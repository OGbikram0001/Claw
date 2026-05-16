## 2024-05-16 - Prevent Environment Parsing Crashes and Secure CORS
**Vulnerability:** Fast fail vulnerability and overly permissive CORS policy mapping to wildcard (`*`) when credentials are allowed. Direct `os.environ['VAR']` parsing causes application crashing.
**Learning:** Hardcoded environment variables can cause uncaught exceptions on boot if missing in CI/CD environments. Also `allow_origins=["*"]` fails securely when `allow_credentials=True` according to the browser specs, so you need a comma separated `ALLOWED_ORIGINS` strategy that defaults to an empty list securely.
**Prevention:** Always use `os.environ.get("VAR")` and test `if not var`. Parse list-like environment variables properly and fallback to secure defaults (e.g., `[]` for CORS) instead of wide open rules.
