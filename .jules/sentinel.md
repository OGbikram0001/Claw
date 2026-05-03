## 2024-05-03 - Insecure CORS wildcard with credentials

**Vulnerability:** The FastAPI backend had CORS configured with `allow_origins=["*"]` while simultaneously setting `allow_credentials=True`. This is insecure because it effectively allows any arbitrary domain to make authenticated cross-origin requests to the API, opening the application to cross-origin data theft and CSRF-like attacks via credentials. In fact, many modern browsers and specs explicitly forbid `Access-Control-Allow-Origin: *` when `Access-Control-Allow-Credentials: true` is present.

**Learning:** The initial setup used wildcard origins out of convenience without correctly scoping to the environment configuration. `ALLOWED_ORIGINS` should always strictly govern trusted domains for API access.

**Prevention:** To prevent this, always map `allow_origins` strictly to a dynamic list parsed from environment variables (e.g., `ALLOWED_ORIGINS`). For internal or API-based access defaults, use an empty list to implicitly deny unlisted domains, failing securely.