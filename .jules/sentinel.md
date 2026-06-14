## 2024-06-14 - Fix overly permissive CORS configuration
**Vulnerability:** The backend FastAPI application was configured with a wildcard ('*') for `allow_origins` while also setting `allow_credentials=True`. This is insecure and violates CORS specifications.
**Learning:** Overly permissive CORS configurations, especially when credentials are allowed, expose the application to CSRF attacks and unauthorized cross-origin requests.
**Prevention:** Always restrict `allow_origins` to specific trusted domains via environment variables (e.g., `ALLOWED_ORIGINS`), and never use wildcards when `allow_credentials` is true.
