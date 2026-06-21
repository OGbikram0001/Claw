## 2024-06-21 - Restrict CORS Origins
**Vulnerability:** Overly permissive CORS policy (`allow_origins=["*"]`) combined with `allow_credentials=True`.
**Learning:** The FastAPI application was allowing any domain to make credentialed requests, leading to potential CSRF and data leakage vulnerabilities.
**Prevention:** Use the `ALLOWED_ORIGINS` environment variable to explicitly whitelist trusted origins in `CORSMiddleware` instead of using wildcards.
