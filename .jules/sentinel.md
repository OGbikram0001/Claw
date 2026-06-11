## 2024-06-11 - Overly Permissive CORS Configuration
**Vulnerability:** The FastAPI application used `allow_origins=["*"]` with `allow_credentials=True` in its CORSMiddleware, allowing any external origin to read authenticated responses.
**Learning:** Hardcoding wildcard origins with credentials enables Cross-Origin Resource Sharing attacks, potentially leaking sensitive data to malicious sites.
**Prevention:** Use an `ALLOWED_ORIGINS` environment variable to strictly whitelist trusted origins and default to an empty list `[]` to fail securely if unconfigured.
