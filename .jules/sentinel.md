## 2024-05-24 - Overly Permissive CORS with Credentials
**Vulnerability:** CORS configured with allow_origins=["*"] while allow_credentials=True is enabled.
**Learning:** This combination allows any origin to make authenticated requests, violating security boundaries. It was likely left from development.
**Prevention:** Always restrict allow_origins to specific, trusted domains via environment variables, defaulting to an empty list to fail securely when allow_credentials=True.
