## 2026-06-19 - Overly Permissive CORS with Credentials
**Vulnerability:** The FastAPI application used allow_origins=["*"] alongside allow_credentials=True in CORSMiddleware.
**Learning:** This misconfiguration is highly dangerous as it allows any site to make authenticated requests, potentially leading to CSRF or data exfiltration. Explicit domain whitelisting must always be used when credentials are allowed.
**Prevention:** Always parse ALLOWED_ORIGINS from environment variables and use a strict whitelist instead of wildcard * when allow_credentials=True is required.
