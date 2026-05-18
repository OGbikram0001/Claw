## 2024-05-18 - Overly Permissive CORS Configuration
**Vulnerability:** FastApi CORSMiddleware was configured with `allow_origins=["*"]` while `allow_credentials=True` was also set.
**Learning:** This is a high severity security vulnerability since it allows any third-party domain to make credentialed requests. The FastAPI documentation allows wildcards for learning, but they are dangerous when credentials are true.
**Prevention:** Always parse trusted domains explicitly from an environment variable (like `ALLOWED_ORIGINS`). Do not hardcode origins unless they are safe defaults (e.g. empty list). Never use a wildcard `*` with `allow_credentials=True`.
