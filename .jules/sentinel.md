## 2024-06-27 - Fix Overly Permissive CORS Configuration
**Vulnerability:** The API server had CORS configured with `allow_origins=["*"]` while `allow_credentials=True` was set.
**Learning:** This is a critical misconfiguration that allows any website to make cross-origin requests to the API with user credentials, leading to potential Cross-Site Request Forgery (CSRF) or data leakage.
**Prevention:** Always use a specific, restricted list of allowed origins via environment variables (`ALLOWED_ORIGINS`) rather than wildcards, especially when credentials are allowed.
