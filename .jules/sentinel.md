## 2024-05-23 - Insecure CORS and Missing Env Var Defaults
**Vulnerability:** The application was using a wildcard `*` for CORS origins alongside `allow_credentials=True`, and crashing due to direct dict access on missing environment variables.
**Learning:** Hardcoding wildcard CORS with credentials permits unauthorized origins to read sensitive authenticated responses. Direct dict access for os.environ without defaults leads to unsafe failures.
**Prevention:** Always default missing environment variables (e.g. `os.environ.get()`) to fail securely. Never combine wildcard `*` origins with credentials in CORS; use explicitly whitelisted origins via env config.
