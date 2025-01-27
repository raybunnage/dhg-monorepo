from fastapi.testclient import TestClient

def test_auth_endpoints(client: TestClient):
    # Test login endpoint exists
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code in [401, 200]  # Either unauthorized or success

    # Test user endpoint exists
    response = client.get("/api/auth/user")
    assert response.status_code in [401, 200]  # Either unauthorized or success 