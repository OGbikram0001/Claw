from fastapi.testclient import TestClient
from backend.server import app
import os

client = TestClient(app)

def test_cors_allowed_origin():
    response = client.options("/api/", headers={"Origin": "http://localhost:8081", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:8081"

def test_cors_disallowed_origin():
    response = client.options("/api/", headers={"Origin": "http://evil.com", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 400 or response.headers.get("access-control-allow-origin") is None
