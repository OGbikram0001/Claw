## 2024-05-15 - Hardcoded Environment Variables and Wildcard CORS
**Vulnerability:**
- The backend had an overly permissive `allow_origins=["*"]` configured with `allow_credentials=True` in the FastAPI `CORSMiddleware`.
- It directly accessed environment variables `os.environ['MONGO_URL']` without defaulting, leading to unhandled app crashes.
**Learning:**
- Using wildcard (`*`) origins combined with `allow_credentials=True` violates browser security standards.
- Environment variables must fail securely by returning a default or empty safe value if unconfigured.
**Prevention:**
- The backend now uses `os.environ.get()` with safe fallback defaults. CORS is securely built from an `ALLOWED_ORIGINS` environment variable string default initialized to an empty list securely rejecting unauthorized domains.
