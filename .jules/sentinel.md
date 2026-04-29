## 2024-03-24 - [CORS Misconfiguration with Credentials]
**Vulnerability:** Found a highly permissive CORS configuration in `backend/server.py` where `allow_origins=["*"]` was combined with `allow_credentials=True`. This is a critical risk as it could allow malicious sites to make authenticated requests.
**Learning:** The FastAPI backend initially defaulted to completely open CORS, likely for development convenience, which is dangerous in production.
**Prevention:** Implement strict origin checks via environment variables (`ALLOWED_ORIGINS`) and avoid wildcard origins when credentials are permitted.
