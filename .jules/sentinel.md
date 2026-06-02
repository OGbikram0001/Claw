## 2024-05-02 - Fix overly permissive CORS configuration
**Vulnerability:** The backend FastAPI server in `backend/server.py` had an overly permissive CORS configuration `allow_origins=["*"]`.
**Learning:** This existed because it's often easier during development to allow all origins, but it poses a security risk in production by allowing any website to make cross-origin requests to the API.
**Prevention:** Always restrict CORS origins using an environment variable like `ALLOWED_ORIGINS` to specify a comma-separated list of trusted domains.
