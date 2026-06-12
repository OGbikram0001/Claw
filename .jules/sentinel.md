## 2025-01-20 - Overly Permissive CORS and Unsafe Env Var Access
**Vulnerability:** CORS allow_origins=["*"] with allow_credentials=True, and direct dictionary access for OS environment variables without fallbacks.
**Learning:** Developers often use wildcard CORS during early development but forget to restrict it, leading to CSRF and data exposure risks. Direct OS environ access crashes the app securely but ungracefully if not set.
**Prevention:** Always restrict CORS to known origins using an environment variable, and use os.environ.get() with proper error handling or secure defaults.
