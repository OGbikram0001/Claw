## 2024-05-07 - Insecure CORS Configuration
**Vulnerability:** The FastAPI backend used a wildcard `allow_origins=["*"]` in its CORSMiddleware configuration, effectively disabling same-origin policy protections and allowing any site to make cross-origin requests to the API.
**Learning:** Hardcoded permissive CORS configurations are a severe security risk in production environments as they bypass browser security mechanisms intended to protect users.
**Prevention:** Always configure CORS dynamically using environment variables (e.g., `ALLOWED_ORIGINS`). Parse this variable securely, defaulting to an empty list `[]` to ensure a fail-secure posture when the configuration is missing or invalid.
