## 2024-05-24 - Overly Permissive CORS with Credentials
**Vulnerability:** The FastAPI application used `allow_origins=["*"]` alongside `allow_credentials=True` in `CORSMiddleware`.
**Learning:** Setting wildcard origins `*` with `allow_credentials=True` is a significant security risk, as it allows any site to make cross-origin requests with the user's credentials (cookies, auth headers).
**Prevention:** Always explicitly define `ALLOWED_ORIGINS` via environment variables and restrict allowed origins to a known, trusted list. Default to `[]` if not configured.
