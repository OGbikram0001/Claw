## 2024-05-18 - Overly Permissive CORS with Credentials
**Vulnerability:** CORS configured with `allow_origins=["*"]` and `allow_credentials=True`.
**Learning:** Starlette/FastAPI CORS middleware requires specific origins when credentials are allowed, otherwise it can expose the API to CSRF or credential theft.
**Prevention:** Use a configured list of origins via environment variables (e.g., `ALLOWED_ORIGINS`) and never use `*` with `allow_credentials=True`.
