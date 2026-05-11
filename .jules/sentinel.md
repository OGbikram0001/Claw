## 2024-05-18 - Fix overly permissive CORS configuration
**Vulnerability:** CORS configuration in `backend/server.py` was overly permissive (`allow_origins=["*"]`), potentially allowing malicious websites to make requests on behalf of users.
**Learning:** Default configurations in tutorials or initial setups often use `["*"]` for convenience, but this is a critical security flaw in production. It should always be restricted.
**Prevention:** Always use environment variables to configure allowed origins and fail securely by defaulting to an empty list `[]` if the environment variable is not set. This ensures explicit configuration is required.
