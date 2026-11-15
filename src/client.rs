use std::net::SocketAddr;
use std::sync::Arc;
use std::time::{Duration, Instant};

use quinn::{Connection, Endpoint};

use crate::{ClientConfig, EndpointSource, Error};

/// A connected QUIC client for the SolanaGun relay.
///
/// Wire protocol (placeholder — adapt to the relay's real framing):
/// every message is a frame of `<u32 LE length><payload bytes>`.
/// After the QUIC handshake the client sends `AUTH <token>` as its first
/// frame on a unidirectional stream.
pub struct SolanaGunQuicClient {
    conn: Connection,
    // Kept alive so the endpoint (and its sockets) live as long as the client.
    _endpoint: Endpoint,
    source: EndpointSource,
    token: String,
}

impl SolanaGunQuicClient {
    /// Connect using `config`, optionally attempting endpoint discovery first.
    ///
    /// When `auto` is true and [`ClientConfig::discovery_url`] is set, the
    /// endpoint is fetched from that URL; on any failure the client falls back
    /// to [`ClientConfig::host`]. Inspect [`endpoint_source`](Self::endpoint_source)
    /// to see which path was taken.
    pub async fn connect_auto(
        token: &str,
        config: ClientConfig,
        auto: bool,
    ) -> Result<Self, Error> {
        let source = resolve_endpoint(&config, auto).await;
        let endpoint_str = match &source {
            EndpointSource::Discovered { endpoint } => endpoint.clone(),
            EndpointSource::Fallback { endpoint, .. } => endpoint.clone(),
        };
        let (conn, endpoint) = connect_quic(&endpoint_str, &config).await?;
        let client = Self {
            conn,
            _endpoint: endpoint,
            source,
            token: token.to_string(),
        };
        client.authenticate().await?;
        Ok(client)
    }

    /// How the connected endpoint was selected.
    pub fn endpoint_source(&self) -> &EndpointSource {
        &self.source
    }

    async fn authenticate(&self) -> Result<(), Error> {
        let mut send = self.conn.open_uni().await?;
        let frame = encode_frame(format!("AUTH {}", self.token).as_bytes());
        send.write_all(&frame).await?;
        send.finish()?;
        Ok(())
    }

    /// Send a payload as a length-prefixed frame on a new bidirectional
    /// stream; returns the response bytes and the round-trip time.
    pub async fn send_transaction(&self, payload: &[u8]) -> Result<(Vec<u8>, Duration), Error> {
        let start = Instant::now();
        let (mut send, mut recv) = self.conn.open_bi().await?;
        send.write_all(&encode_frame(payload)).await?;
        send.finish()?;
        let resp = recv.read_to_end(64 * 1024).await?;
        Ok((resp, start.elapsed()))
    }
}

fn encode_frame(payload: &[u8]) -> Vec<u8> {
    let mut out = Vec::with_capacity(4 + payload.len());
    out.extend_from_slice(&(payload.len() as u32).to_le_bytes());
    out.extend_from_slice(payload);
    out
}

async fn resolve_endpoint(config: &ClientConfig, auto: bool) -> EndpointSource {
    if !auto {
        return EndpointSource::Fallback {
            reason: "discovery disabled".into(),
            endpoint: config.host.clone(),
        };
    }
    let Some(url) = &config.discovery_url else {
        return EndpointSource::Fallback {
            reason: "auto discovery requested but no discovery_url configured".into(),
            endpoint: config.host.clone(),
        };
    };
    match discover(url, config.connect_timeout).await {
        Ok(endpoint) => EndpointSource::Discovered { endpoint },
        Err(err) => EndpointSource::Fallback {
            reason: format!("discovery via {url} failed: {err}"),
            endpoint: config.host.clone(),
        },
    }
}

async fn discover(url: &str, timeout: Duration) -> Result<String, Error> {
    let client = reqwest::Client::builder()
        .timeout(timeout)
        .build()
        .map_err(|e| Error::Discovery(e.to_string()))?;
    let body = client
        .get(url)
        .send()
        .await
        .and_then(|r| r.error_for_status())
        .map_err(|e| Error::Discovery(e.to_string()))?
        .text()
        .await
        .map_err(|e| Error::Discovery(e.to_string()))?;
    if let Ok(value) = serde_json::from_str::<serde_json::Value>(&body) {
        if let Some(endpoint) = value.get("endpoint").and_then(|e| e.as_str()) {
            return Ok(endpoint.trim().to_string());
        }
    }
    let endpoint = body.trim().to_string();
    if endpoint.is_empty() {
        return Err(Error::Discovery("empty discovery response".into()));
    }
    Ok(endpoint)
}

async fn connect_quic(hostport: &str, config: &ClientConfig) -> Result<(Connection, Endpoint), Error> {
    let (host, port) = hostport
        .rsplit_once(':')
        .ok_or_else(|| Error::InvalidEndpoint(hostport.into(), "expected host:port".into()))?;
    let port: u16 = port
        .parse()
        .map_err(|_| Error::InvalidEndpoint(hostport.into(), "invalid port".into()))?;
    let addr: SocketAddr = tokio::net::lookup_host((host, port))
        .await?
        .next()
        .ok_or_else(|| Error::InvalidEndpoint(hostport.into(), "DNS resolution returned no addresses".into()))?;

    let provider = Arc::new(rustls::crypto::ring::default_provider());
    let builder = rustls::ClientConfig::builder_with_provider(provider.clone())
        .with_safe_default_protocol_versions()
        .map_err(|e| Error::Tls(e.to_string()))?;
    let mut tls = if config.danger_accept_invalid_certs {
        builder
            .dangerous()
            .with_custom_certificate_verifier(Arc::new(NoVerifier::new(provider)))
            .with_no_client_auth()
    } else {
        let mut roots = rustls::RootCertStore::empty();
        roots.extend(webpki_roots::TLS_SERVER_ROOTS.iter().cloned());
        builder.with_root_certificates(roots).with_no_client_auth()
    };
    tls.alpn_protocols = vec![config.alpn.clone()];

    let quic_config = quinn::crypto::rustls::QuicClientConfig::try_from(tls)
        .map_err(|e| Error::Tls(e.to_string()))?;
    let client_config = quinn::ClientConfig::new(Arc::new(quic_config));

    let bind_addr: SocketAddr = if addr.is_ipv6() {
        "[::]:0".parse().unwrap()
    } else {
        "0.0.0.0:0".parse().unwrap()
    };
    let mut endpoint = Endpoint::client(bind_addr)?;
    endpoint.set_default_client_config(client_config);

    let connecting = endpoint.connect(addr, host)?;
    let conn = tokio::time::timeout(config.connect_timeout, connecting)
        .await
        .map_err(|_| Error::Timeout(format!("QUIC handshake with {hostport}")))?
        ?;
    Ok((conn, endpoint))
}

#[derive(Debug)]
struct NoVerifier {
    schemes: Vec<rustls::SignatureScheme>,
}

impl NoVerifier {
    fn new(provider: Arc<rustls::crypto::CryptoProvider>) -> Self {
        Self {
            schemes: provider.signature_verification_algorithms.supported_schemes(),
        }
    }
}

impl rustls::client::danger::ServerCertVerifier for NoVerifier {
    fn verify_server_cert(
        &self,
        _end_entity: &rustls::pki_types::CertificateDer<'_>,
        _intermediates: &[rustls::pki_types::CertificateDer<'_>],
        _server_name: &rustls::pki_types::ServerName<'_>,
        _ocsp_response: &[u8],
        _now: rustls::pki_types::UnixTime,
    ) -> Result<rustls::client::danger::ServerCertVerified, rustls::Error> {
        Ok(rustls::client::danger::ServerCertVerified::assertion())
    }

    fn verify_tls12_signature(
        &self,
        _message: &[u8],
        _cert: &rustls::pki_types::CertificateDer<'_>,
        _dss: &rustls::DigitallySignedStruct,
    ) -> Result<rustls::client::danger::HandshakeSignatureValid, rustls::Error> {
        Ok(rustls::client::danger::HandshakeSignatureValid::assertion())
    }

    fn verify_tls13_signature(
        &self,
        _message: &[u8],
        _cert: &rustls::pki_types::CertificateDer<'_>,
        _dss: &rustls::DigitallySignedStruct,
    ) -> Result<rustls::client::danger::HandshakeSignatureValid, rustls::Error> {
        Ok(rustls::client::danger::HandshakeSignatureValid::assertion())
    }

    fn supported_verify_schemes(&self) -> Vec<rustls::SignatureScheme> {
        self.schemes.clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn frame_encoding_is_length_prefixed_le() {
        let frame = encode_frame(b"abc");
        assert_eq!(frame, vec![3, 0, 0, 0, b'a', b'b', b'c']);
    }

    #[test]
    fn fallback_reason_mentions_missing_url() {
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap();
        rt.block_on(async {
            let source = resolve_endpoint(&ClientConfig::default(), true).await;
            match source {
                EndpointSource::Fallback { reason, endpoint } => {
                    assert!(reason.contains("discovery_url"));
                    assert_eq!(endpoint, ClientConfig::default().host);
                }
                other => panic!("expected Fallback, got {other:?}"),
            }
        });
    }
}
