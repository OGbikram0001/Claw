## 2026-05-08 - Overly Permissive CORS Configuration
**Vulnerability:** The application was configured with `allow_origins=["*"]` in CORSMiddleware, allowing any external origin to make API requests, which could lead to Cross-Origin Resource Sharing vulnerabilities like data exfiltration.
**Learning:** Defaulting to wildcard origins is a common pitfall during early development that often slips into production.
**Prevention:** Always read allowed origins from environment variables, defaulting to an empty list `[]` so that an explicit configuration is required to allow external access.
