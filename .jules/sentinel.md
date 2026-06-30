## 2024-06-30 - Overly Permissive CORS Configuration
**Vulnerability:** The FastAPI backend used allow_origins=["*"] with allow_credentials=True, creating a high-risk CORS misconfiguration.
**Learning:** Hardcoding wildcard origins with credentials enables cross-origin credentialed requests, violating security boundaries.
**Prevention:** Always restrict CORS origins via environment variables (e.g., ALLOWED_ORIGINS) and avoid using wildcards with allow_credentials=True.
