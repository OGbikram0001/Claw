## 2024-06-05 - Fix Overly Permissive CORS Configuration
**Vulnerability:** The FastAPI application used a wildcard `*` for the `Access-Control-Allow-Origin` header in the `CORSMiddleware` configuration while simultaneously having `allow_credentials=True`. This is insecure and widely rejected by modern browsers.
**Learning:** Having `allow_credentials=True` requires explicit origins to be declared in `allow_origins`. Using a wildcard when accepting credentials risks exposing sensitive data to arbitrary domains.
**Prevention:** Always restrict `allow_origins` to an environment-configured whitelist (e.g., using `ALLOWED_ORIGINS` environment variable) instead of hardcoding `*` or a generic list, especially when cookies or authorization headers are permitted.
