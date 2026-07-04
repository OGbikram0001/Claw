## 2024-05-24 - Overly Permissive CORS
**Vulnerability:** CORS configured with `allow_origins=["*"]`.
**Learning:** This exposes the API to requests from any domain.
**Prevention:** Use an environment variable to define allowed origins and default to local development URLs.
