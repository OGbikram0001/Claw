## 2024-05-24 - Overly permissive CORS and insecure env vars
**Vulnerability:** CORS configured with allow_credentials=True and allow_origins=["*"], and direct dict access to os.environ.
**Learning:** Hardcoded wildcard origins with credentials allow Cross-Site Request Forgery (CSRF) and data theft. Direct dict access to os.environ can crash the app if missing.
**Prevention:** Always use environment variables for CORS origins, default to empty lists to fail securely, and use os.environ.get() with fallbacks.
