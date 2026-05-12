## 2024-05-12 - Secure Environment Variables and CORS
**Vulnerability:** Fast fail behavior on missing environment variables and overly permissive CORS
**Learning:** `os.environ['VAR']` throws a KeyError and crashes the app. CORS was previously `allow_origins=["*"]` which allows all domains, combining with `allow_credentials=True` makes it technically an invalid configuration for modern browsers and insecure.
**Prevention:** Use `os.environ.get('VAR', default)` to fallback securely, and pass `ALLOWED_ORIGINS` via environment variables. For CORS, fail securely by defaulting to an empty origin list.
