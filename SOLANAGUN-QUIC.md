# solanagun-quic

QUIC client for the SolanaGun transaction relay.

## Usage

```rust
use solanagun_quic::{ClientConfig, SolanaGunQuicClient};

let client =
    SolanaGunQuicClient::connect_auto("my-token", ClientConfig::default(), true).await?;
println!("{:?}", client.endpoint_source()); // Discovered { .. } or Fallback { reason, .. }
```

`connect_auto(token, config, auto)`:

- `auto = true` and `ClientConfig::discovery_url` set → fetches the endpoint over HTTPS
  (JSON `{"endpoint": "host:port"}` or plain text). Source is `EndpointSource::Discovered`.
- Discovery disabled, unconfigured, or failed → connects to `ClientConfig::host`
  (default `fra1.solanagun.com:7000`). Source is `EndpointSource::Fallback { reason, .. }`.

## Example

```sh
export HOST=fra1.solanagun.com:7000
export TOKEN=<token>
export COUNT=4                       # optional, default 1
cargo run --release --example send
```

Set `DISCOVERY_URL` to exercise endpoint discovery.

## Wire protocol (placeholder)

The relay's real framing isn't documented in this repo; the client currently uses
`<u32 LE length><payload>` frames, sends `AUTH <token>` on a unidirectional stream
after the QUIC handshake (ALPN `solanagun`), and sends each transaction on its own
bidirectional stream. Adjust `src/client.rs` to match the relay's actual protocol.
