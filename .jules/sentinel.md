## 2024-05-31 - Overly Permissive CORS and Insecure Env Reads
**Vulnerability:** CORS middleware configured with `allow_origins=["*"]` alongside `allow_credentials=True` (which breaks modern standards and crashes FastAPI apps). Additionally, direct dictionary access of `os.environ` was causing application crashes when `.env` variables were missing.
**Learning:** Hardcoding wildcard CORS origins when accepting credentials is an anti-pattern. Environment variable reads must always use `.get()` with safe defaults to prevent runtime crashes.
**Prevention:** Always parse CORS origins from a strict environment-configured list and ensure `os.environ` accesses handle missing keys safely.
