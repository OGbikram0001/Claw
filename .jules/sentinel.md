## 2024-06-24 - Overly Permissive CORS Configuration
**Vulnerability:** CORS configured with allow_credentials=True and allow_origins=["*"].
**Learning:** This combination allows credentialed cross-origin requests from anywhere, leading to CSRF and potential data exposure. In FastAPI, `allow_origins=["*"]` with `allow_credentials=True` is explicitly rejected by the framework but can be bypassed or misconfigured in other setups. To be secure, the origins must be explicitly listed.
**Prevention:** Load specific ALLOWED_ORIGINS from environment variables and never use wildcard origins with credentials.
