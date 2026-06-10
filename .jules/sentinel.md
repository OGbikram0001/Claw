## 2024-06-10 - Insecure CORS and Config Access
**Vulnerability:** FastAPI CORS configured with wildcard `allow_origins=["*"]` alongside `allow_credentials=True`, and direct dictionary access of environment variables (e.g., `os.environ['MONGO_URL']`).
**Learning:** Wildcards with credentials enable cross-origin data leakage. Unsafe environment variable access causes app crashes/DoS if unconfigured.
**Prevention:** Restrict CORS using an environment-specific whitelist (e.g., `ALLOWED_ORIGINS`) and access environment variables using `os.environ.get()` with secure defaults.
