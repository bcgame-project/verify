//! Send `COUNT` placeholder payloads to the SolanaGun relay.
//!
//! ```sh
//! export HOST=fra1.solanagun.com:7000
//! export TOKEN=<token>
//! export COUNT=4                       # optional, default 1
//! cargo run --release --example send
//! ```

use std::env;

use solanagun_quic::{ClientConfig, SolanaGunQuicClient};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let host = env::var("HOST").unwrap_or_else(|_| "fra1.solanagun.com:7000".into());
    let token = env::var("TOKEN").expect("TOKEN env var is required");
    let count: u32 = env::var("COUNT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(1);
    // Optional: set DISCOVERY_URL to enable endpoint discovery.
    let discovery_url = env::var("DISCOVERY_URL").ok();

    let config = ClientConfig {
        host,
        discovery_url,
        ..ClientConfig::default()
    };
    let client = SolanaGunQuicClient::connect_auto(&token, config, true).await?;
    println!("{:?}", client.endpoint_source());

    for i in 0..count {
        // Placeholder payload — replace with a real serialized transaction.
        let payload = vec![0u8; 256];
        let (resp, rtt) = client.send_transaction(&payload).await?;
        println!("tx {i}: {} byte response, rtt {rtt:?}", resp.len());
    }
    Ok(())
}
