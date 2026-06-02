from fastapi.testclient import TestClient
import importlib
import backend.server
from backend.server import app


def test_cors_middleware():
    """Test that CORS headers are correctly applied based on ALLOWED_ORIGINS"""
    # Create test client
    client = TestClient(app)

    # Test an allowed origin
    headers = {"Origin": "http://localhost:3000"}
    response = client.options("/api/", headers=headers)

    # We didn't set ALLOWED_ORIGINS in tests initially, so the default is empty list.
    # Therefore, no origin is allowed, and starlette will return a 400 Bad Request
    # for preflight requests with an origin not in the allowed list.
    response = client.options(
        "/api/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400


def test_cors_middleware_with_env_var(monkeypatch):
    """Test that CORS headers are correctly applied when ALLOWED_ORIGINS is set"""

    # Need to reload the module to apply the mocked env var to the app initialization
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://localhost:3000,https://example.com")

    # Note: Because the app object is created at module load time,
    # we need to re-import or recreate the app with the env vars set
    # For a simple test, we can just inspect the middleware stack

    importlib.reload(backend.server)
    test_app = backend.server.app

    client = TestClient(test_app)

    # We send an OPTIONS request which CORS uses for preflight
    response = client.options(
        "/api/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

    # Test a second allowed origin
    response = client.options(
        "/api/",
        headers={"Origin": "https://example.com", "Access-Control-Request-Method": "GET"},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://example.com"

    # Test an unallowed origin
    response = client.options(
        "/api/",
        headers={
            "Origin": "https://malicious.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400
    # Starlette returns 400 Bad Request for disallowed origins in preflight
