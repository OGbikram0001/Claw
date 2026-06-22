## 2024-06-22 - Fix Overly Permissive CORS with Credentials
**Vulnerability:** FastAPIs CORSMiddleware was configured with allow_origins=["*"] while allow_credentials=True. This exposes the API to credentialed cross-origin requests from any site.
**Learning:** When allow_credentials=True, origins must be explicitly specified. Wildcard origins negate security benefits and are generally blocked by modern browsers for credentialed requests, leading to both security risks and operational failures.
**Prevention:** Always parse ALLOWED_ORIGINS from environment variables to restrict allowed domains when allow_credentials=True.
