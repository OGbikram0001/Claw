## 2024-05-15 - Wildcard CORS with Credentials
**Vulnerability:** FastAPIs CORSMiddleware was configured with `allow_origins=["*"]` and `allow_credentials=True`.
**Learning:** Using a wildcard for allowed origins when credentials are allowed is a security risk as it potentially enables Cross-Site Request Forgery (CSRF) and unwanted access to authenticated endpoints.
**Prevention:** Always restrict `allow_origins` to a specific list of trusted domains when `allow_credentials` is `True`. In this codebase, parse a list from the `ALLOWED_ORIGINS` environment variable and fail securely by defaulting to an empty list `[]` if not set.
