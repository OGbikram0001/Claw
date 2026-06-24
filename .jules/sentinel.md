## 2024-06-25 - Overly Permissive CORS Configuration
**Vulnerability:** The backend allowed all origins (*) in CORS settings, which is a high-priority risk.
**Learning:** The default setup prioritized ease of development over security.
**Prevention:** Always restrict CORS to specific trusted origins loaded from environment variables.
