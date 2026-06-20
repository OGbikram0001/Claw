## 2024-05-24 - Overly Permissive CORS with Credentials
**Vulnerability:** FastAPI CORS middleware was configured with allow_origins=["*"] while allow_credentials=True was enabled.
**Learning:** When credentials are allowed, the Access-Control-Allow-Origin cannot be a wildcard to prevent cross-origin attacks where attackers can access authenticated endpoints. It must be specific origins.
**Prevention:** Always restrict allow_origins to a specific list of trusted origins when using allow_credentials=True, typically loaded via environment variables.
