## 2024-06-16 - Overly Permissive CORS
**Vulnerability:** CORS was configured with `allow_origins=["*"]` while `allow_credentials=True` was set. Also, `os.environ` dict access was used directly, which could cause application crashes if not set.
**Learning:** When `allow_credentials=True` is used, origins cannot be a wildcard `*`. Also, always use `.get()` with defaults for `os.environ` to fail securely.
**Prevention:** Ensure origins are tightly scoped via env variables like `ALLOWED_ORIGINS` when using credentials and always use `os.environ.get()` with fallback defaults.
