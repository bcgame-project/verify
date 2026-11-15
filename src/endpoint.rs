/// How the endpoint used for the connection was selected.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum EndpointSource {
    /// The endpoint was obtained via endpoint discovery.
    Discovered {
        /// Discovered endpoint as `host:port`.
        endpoint: String,
    },
    /// Discovery was disabled or failed; the configured fallback host was used.
    Fallback {
        /// Why discovery did not produce an endpoint.
        reason: String,
        /// Fallback endpoint as `host:port`.
        endpoint: String,
    },
}
