## 2024-05-18 - Restrict CORS and Environment Variables

**Vulnerability:** Found overly permissive CORS (`allow_origins=["*"]`) and direct access to `os.environ` that could crash the application.
**Learning:** `ALLOWED_ORIGINS` needs to be used to configure CORS. Direct `os.environ` without fallback defaults fails insecurely, taking down the app rather than falling back.
**Prevention:** Use `os.environ.get()` with safe defaults and configure `CORSMiddleware` using `ALLOWED_ORIGINS` to maintain least privilege.
