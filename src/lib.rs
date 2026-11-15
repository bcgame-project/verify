//! QUIC client for the SolanaGun transaction relay.
//!
//! ```no_run
//! use solanagun_quic::{ClientConfig, SolanaGunQuicClient};
//!
//! # async fn example() -> Result<(), solanagun_quic::Error> {
//! let client =
//!     SolanaGunQuicClient::connect_auto("my-token", ClientConfig::default(), true).await?;
//! println!("{:?}", client.endpoint_source()); // Discovered { .. } or Fallback { reason, .. }
//! # Ok(())
//! # }
//! ```

mod client;
mod config;
mod endpoint;
mod error;

pub use client::SolanaGunQuicClient;
pub use config::ClientConfig;
pub use endpoint::EndpointSource;
pub use error::Error;
