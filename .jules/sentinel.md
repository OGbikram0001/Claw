## 2024-06-25 - Overly Permissive CORS Configuration
**Vulnerability:** The FastAPI backend used `allow_origins=["*"]`, allowing any domain to make cross-origin requests to the API.
**Learning:** Using a wildcard for CORS origins exposes the API to CSRF and other cross-origin attacks, especially if credentials are allowed.
**Prevention:** Always restrict CORS origins to a specific list of trusted domains via environment variables.
