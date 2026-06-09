## 2024-06-09 - Hardcoded Allowed Origins

**Vulnerability:** FastApi CORS middleware configured with `allow_origins=["*"]` alongside `allow_credentials=True`.
**Learning:** The default setup allowed any origin to make authenticated requests, violating the CORS specification and posing a critical security risk (CSRF / data exfiltration).
**Prevention:** Always restrict CORS allowed origins to a known whitelist via an environment variable `ALLOWED_ORIGINS`, defaulting to an empty list `[]` to fail securely if unconfigured.
