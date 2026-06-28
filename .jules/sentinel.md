## 2024-06-28 - Overly Permissive CORS
**Vulnerability:** CORS configuration in FastAPI allowed all origins ("*").
**Learning:** The FastAPI app explicitly hardcoded allow_origins=["*"] inside backend/server.py, bypassing CORS protections.
**Prevention:** Always read ALLOWED_ORIGINS from environment variables, defaulting to safe local development origins if missing, and update .env.example.
