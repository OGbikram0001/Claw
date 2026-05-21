## 2025-05-21 - [Overly Permissive CORS Configuration]
**Vulnerability:** The FastAPI backend used a wildcard `allow_origins=["*"]` combined with `allow_credentials=True` in the `CORSMiddleware`.
**Learning:** This is a highly insecure configuration because it allows any origin to make authenticated requests, making the app vulnerable to CSRF and data exposure. Furthermore, modern FastAPI/Starlette versions explicitly reject this combination with a `ValueError`.
**Prevention:** Always restrict `allow_origins` to a specific list of trusted domains via environment variables. When `allow_credentials=True` is required, the `Access-Control-Allow-Origin` header must not be a wildcard `*`.
