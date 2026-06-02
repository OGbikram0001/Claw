import os
import pytest
from unittest.mock import patch

@pytest.fixture
def mock_env():
    with patch.dict(os.environ, {"ALLOWED_ORIGINS": "http://localhost:3000,https://example.com", "MONGO_URL": "mongodb://localhost:27017", "DB_NAME": "testdb"}):
        yield

def test_cors(mock_env):
    # Import app inside the test after environment variables are mocked
    from server import app
    from fastapi.testclient import TestClient

    client = TestClient(app)

    response = client.options(
        "/api/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

    response = client.options(
        "/api/",
        headers={
            "Origin": "http://unknown.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400 or response.headers.get("access-control-allow-origin") is None
