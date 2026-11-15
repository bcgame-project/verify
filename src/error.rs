/// Errors returned by [`crate::SolanaGunQuicClient`].
#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("invalid endpoint `{0}`: {1}")]
    InvalidEndpoint(String, String),

    #[error("endpoint discovery failed: {0}")]
    Discovery(String),

    #[error("timeout: {0}")]
    Timeout(String),

    #[error("tls configuration error: {0}")]
    Tls(String),

    #[error(transparent)]
    Connect(#[from] quinn::ConnectError),

    #[error(transparent)]
    Connection(#[from] quinn::ConnectionError),

    #[error(transparent)]
    Write(#[from] quinn::WriteError),

    #[error("stream closed: {0}")]
    StreamClosed(#[from] quinn::ClosedStream),

    #[error(transparent)]
    ReadToEnd(#[from] quinn::ReadToEndError),

    #[error(transparent)]
    Io(#[from] std::io::Error),
}
