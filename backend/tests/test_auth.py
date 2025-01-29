from fastapi.testclient import TestClient
import pytest
from unittest.mock import Mock, patch
from fastapi import HTTPException
from backend.app.auth import (
    AuthService,
    LoginCredentials,
    SignupCredentials,
    AuthResponse,
)

# Mock Supabase responses
mock_user_data = {
    "id": "test-user-id",
    "email": "test@example.com",
    "aud": "authenticated",
}

mock_session_data = {
    "access_token": "test-token",
    "token_type": "bearer",
    "expires_in": 3600,
}


@pytest.fixture
def mock_supabase_auth():
    with patch("backend.app.auth.supabase") as mock_supabase:
        yield mock_supabase


@pytest.mark.asyncio
class TestAuthService:
    async def test_signup_success(self, mock_supabase_auth):
        # Arrange
        credentials = SignupCredentials(
            email="test@example.com",
            password="password123",
            password_confirmation="password123",
        )

        mock_supabase_auth.auth.sign_up.return_value = Mock(
            user=mock_user_data, session=mock_session_data
        )

        # Act
        response = await AuthService.signup(credentials)

        # Assert
        assert isinstance(response, AuthResponse)
        assert response.user == mock_user_data
        assert response.session == mock_session_data
        assert "successful" in response.message.lower()
        mock_supabase_auth.auth.sign_up.assert_called_once()

    async def test_signup_password_mismatch(self):
        # Arrange
        credentials = SignupCredentials(
            email="test@example.com",
            password="password123",
            password_confirmation="different_password",
        )

        # Act/Assert
        with pytest.raises(HTTPException) as exc_info:
            await AuthService.signup(credentials)
        assert exc_info.value.status_code == 400
        assert "passwords do not match" in str(exc_info.value.detail).lower()

    async def test_signup_password_too_short(self):
        # Arrange
        credentials = SignupCredentials(
            email="test@example.com",
            password="short",
            password_confirmation="short",
        )

        # Act/Assert
        with pytest.raises(HTTPException) as exc_info:
            await AuthService.signup(credentials)
        assert exc_info.value.status_code == 400
        assert "at least 8 characters" in str(exc_info.value.detail).lower()

    async def test_signup_user_already_exists(self, mock_supabase_auth):
        # Arrange
        credentials = SignupCredentials(
            email="existing@example.com",
            password="password123",
            password_confirmation="password123",
        )

        # Mock Supabase throwing user exists error
        mock_supabase_auth.auth.sign_up.side_effect = Exception(
            "User already registered"
        )

        # Act/Assert
        with pytest.raises(HTTPException) as exc_info:
            await AuthService.signup(credentials)
        assert exc_info.value.status_code == 400
        assert "email already registered" in str(exc_info.value.detail).lower()

    async def test_signup_supabase_error(self, mock_supabase_auth):
        # Arrange
        credentials = SignupCredentials(
            email="test@example.com",
            password="password123",
            password_confirmation="password123",
        )

        # Mock Supabase throwing generic error
        mock_supabase_auth.auth.sign_up.side_effect = Exception("Supabase error")

        # Act/Assert
        with pytest.raises(HTTPException) as exc_info:
            await AuthService.signup(credentials)
        assert exc_info.value.status_code == 400
        assert "signup failed" in str(exc_info.value.detail).lower()

    async def test_login_success(self, mock_supabase_auth):
        # Arrange
        credentials = LoginCredentials(email="test@example.com", password="password123")

        mock_supabase_auth.auth.sign_in_with_password.return_value = Mock(
            user=mock_user_data, session=mock_session_data
        )

        # Act
        response = await AuthService.login(credentials)

        # Assert
        assert isinstance(response, AuthResponse)
        assert response.user == mock_user_data
        assert response.session == mock_session_data
        assert "successful" in response.message.lower()
        mock_supabase_auth.auth.sign_in_with_password.assert_called_once()

    async def test_login_invalid_credentials(self, mock_supabase_auth):
        # Arrange
        credentials = LoginCredentials(
            email="test@example.com", password="wrong_password"
        )

        mock_supabase_auth.auth.sign_in_with_password.return_value = Mock(
            user=None, session=None
        )

        # Act/Assert
        with pytest.raises(HTTPException) as exc_info:
            await AuthService.login(credentials)
        assert exc_info.value.status_code == 401
        assert "invalid credentials" in str(exc_info.value.detail).lower()

    async def test_signout_success(self, mock_supabase_auth):
        # Arrange
        mock_supabase_auth.auth.get_user.return_value = Mock(user=mock_user_data)

        # Act
        response = await AuthService.signout()

        # Assert
        assert response["message"] == "Signed out successfully"
        mock_supabase_auth.auth.sign_out.assert_called_once()

    async def test_get_current_user_success(self, mock_supabase_auth):
        # Arrange
        mock_supabase_auth.auth.get_user.return_value = Mock(user=mock_user_data)

        # Act
        user = await AuthService.get_current_user()

        # Assert
        assert user == mock_user_data
        mock_supabase_auth.auth.get_user.assert_called_once()

    async def test_get_current_user_no_user(self, mock_supabase_auth):
        # Arrange
        mock_supabase_auth.auth.get_user.return_value = None

        # Act
        user = await AuthService.get_current_user()

        # Assert
        assert user is None
        mock_supabase_auth.auth.get_user.assert_called_once()


def test_auth_endpoints(client: TestClient):
    # Test login endpoint exists
    response = client.post(
        "/api/auth/login", json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code in [401, 200]  # Either unauthorized or success

    # Test user endpoint exists
    response = client.get("/api/auth/user")
    assert response.status_code in [401, 200]  # Either unauthorized or success

    # Test signup endpoint exists
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "password123",
            "password_confirmation": "password123",
        },
    )
    assert response.status_code in [400, 200]  # Either validation error or success

    # Test signup validation
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "invalid-email",  # Invalid email format
            "password": "short",  # Too short password
            "password_confirmation": "different",  # Mismatched confirmation
        },
    )
    assert response.status_code == 422  # Validation error
