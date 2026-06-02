## 2024-05-01 - Overly Permissive CORS Configuration
**Vulnerability:** Fast API CORS middleware was configured to allow all origins (`allow_origins=["*"]`).
**Learning:** This overrides the backend's strict CORS policy which is intended to be strictly governed by the `ALLOWED_ORIGINS` environment variable. Leaving it open could lead to Cross-Origin Resource Sharing vulnerabilities.
**Prevention:** Always read and parse the intended allowed origins from environment variables instead of using the wildcard.
