## 2024-06-13 - Insecure CORS Configuration and Environment Variable Access
**Vulnerability:** The FastAPI application used `allow_origins=["*"]` with `allow_credentials=True`, which is a critical security risk (though blocked by recent FastAPI versions, it's still bad practice). It also accessed environment variables directly using `os.environ['VAR']`, causing application crashes if variables were missing.
**Learning:** CORS configurations should strictly validate origins using whitelists when credentials are allowed. Environment variables should be accessed safely to fail gracefully.
**Prevention:** Always parse `ALLOWED_ORIGINS` from environment variables as a comma-separated list, default to `[]`, and use `os.environ.get('VAR', default)` instead of direct dictionary access.
