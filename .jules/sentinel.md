## 2024-06-08 - Insecure CORS and Env Var Access
**Vulnerability:** The FastAPI backend used a wildcard `*` for `allow_origins` while `allow_credentials=True` was set. Also, environment variables for DB connections were accessed directly without defaults, causing the app to crash if they were missing.
**Learning:** `Access-Control-Allow-Origin: *` with credentials enables attackers to make cross-origin requests using a user's session. Direct env var access prevents the application from failing securely.
**Prevention:** Explicitly specify trusted origins using an environment variable list for CORS when using credentials. Always use `os.environ.get()` with defaults to fail securely and handle missing configuration gracefully.
