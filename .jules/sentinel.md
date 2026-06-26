## 2024-06-26 - Overly Permissive CORS Configuration
**Vulnerability:** The backend FastAPI application was configured with allow_origins=["*"], allowing any domain to make cross-origin requests.
**Learning:** Default configurations or quick setups often leave CORS wide open, which can lead to unauthorized cross-origin requests and potential data exposure.
**Prevention:** Always parse ALLOWED_ORIGINS from environment variables and restrict allowed origins to specific trusted domains.
