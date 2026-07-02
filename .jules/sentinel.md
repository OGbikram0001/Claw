## 2024-07-02 - Overly Permissive CORS
**Vulnerability:** CORS `allow_origins` was set to `["*"]` in `backend/server.py`.
**Learning:** Hardcoded wildcard CORS allows any origin to make cross-origin requests to the API, which can lead to data exposure or unauthorized actions if cookies/credentials were later enabled or expected.
**Prevention:** Always read `ALLOWED_ORIGINS` from environment variables and never use `["*"]` in production. Provide a reasonable default for local development.
