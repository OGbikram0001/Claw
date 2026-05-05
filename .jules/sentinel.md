## 2024-05-05 - Fix Overly Permissive CORS Configuration
**Vulnerability:** The FastAPI backend had CORS configured with `allow_origins=["*"]` while `allow_credentials` was `True`.
**Learning:** This is a major security flaw that allows any domain to perform authenticated cross-origin requests. It existed due to a likely quick development setup being left for production.
**Prevention:** Always read allowed origins from environment variables, and fail securely by defaulting to an empty list `[]` instead of `["*"]`. Never use wildcard origins with credentials.
