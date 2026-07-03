## 2024-07-03 - Restrict CORS Configuration
**Vulnerability:** Overly permissive CORS configuration (`allow_origins=["*"]`) in `backend/server.py`.
**Learning:** Permitting all origins makes the API vulnerable to Cross-Origin Resource Sharing (CORS) related attacks, where any domain could potentially make authenticated requests to the API.
**Prevention:** Always restrict `allow_origins` to specific trusted domains or use environment variables to configure allowed origins dynamically per environment.
