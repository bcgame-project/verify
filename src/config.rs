use std::time::Duration;

/// Client configuration.
#[derive(Debug, Clone)]
pub struct ClientConfig {
    /// Fallback endpoint as `host:port`, used when discovery is disabled or fails.
    pub host: String,
    /// Optional HTTPS URL used for endpoint discovery. The response body may be
    /// JSON (`{"endpoint": "host:port"}`) or plain text (`host:port`).
    pub discovery_url: Option<String>,
    /// ALPN protocol negotiated with the relay.
    pub alpn: Vec<u8>,
    /// Timeout applied to discovery and to the QUIC handshake.
    pub connect_timeout: Duration,
    /// Skip TLS certificate verification. Development only — never enable in production.
    pub danger_accept_invalid_certs: bool,
}

impl Default for ClientConfig {
    fn default() -> Self {
        Self {
            host: "fra1.solanagun.com:7000".into(),
            discovery_url: None,
            alpn: b"solanagun".to_vec(),
            connect_timeout: Duration::from_secs(10),
            danger_accept_invalid_certs: false,
        }
    }
}
