# Auth Service Change: Token Handling Improvement

## Change Information
- **Date**: 2024-01-31
- **Author**: Assistant
- **Component**: AuthService
- **Method**: set_password

## Current Functionality
```python
@staticmethod
async def set_password(request: SetPasswordRequest) -> dict:
    try:
        print(
            "🔑 Received token:",
            {
                "token": request.token[:10] + "..." if request.token else "None",
                "length": len(request.token) if request.token else 0,
            },
        )

        # Clean the token - remove any URL encoding or extra characters
        cleaned_token = request.token.strip()
        if "#" in cleaned_token:
            cleaned_token = cleaned_token.split("#")[0]

        if not AuthService.is_valid_uuid(cleaned_token):
            print("❌ Invalid token format:", cleaned_token[:10] + "...")
            raise HTTPException(status_code=400, detail="Invalid token format")

        print(f"Attempting to set password with token: {cleaned_token[:10]}...")

        settings = get_settings()
        admin_client = create_client(
            settings.supabase_url, settings.supabase_service_role_key
        )

        response = admin_client.auth.admin.update_user_by_id(
            cleaned_token, {"password": request.password}
        )
        print("✅ Password update response:", response)
        return {"message": "Password updated successfully"}
```
- Currently only handles UUID tokens
- Doesn't handle Supabase JWT tokens
- Limited token cleaning

## Proposed Change
```python
@staticmethod
async def set_password(request: SetPasswordRequest) -> dict:
    try:
        print(
            "🔑 Received token:",
            {
                "token": request.token[:10] + "..." if request.token else "None",
                "length": len(request.token) if request.token else 0,
                "format": "JWT" if request.token.startswith("ey") else "UUID" if AuthService.is_valid_uuid(request.token) else "Unknown"
            },
        )

        # Clean the token - remove any URL encoding or extra characters
        cleaned_token = request.token.strip()
        original_token = cleaned_token  # Keep original for debugging
        if "#" in cleaned_token:
            cleaned_token = cleaned_token.split("#")[0]

        # Handle Supabase JWT access tokens
        if cleaned_token.startswith("ey"):  # JWT format
            try:
                settings = get_settings()
                admin_client = create_client(
                    settings.supabase_url, settings.supabase_service_role_key
                )
                print("🔍 Attempting to get user from JWT...")
                user = admin_client.auth.get_user(cleaned_token)
                print("👤 User response:", {
                    "has_user": bool(user),
                    "user_id": user.user.id if user and user.user else None,
                    "email": user.user.email if user and user.user else None
                })
                if user and user.user:
                    cleaned_token = user.user.id
                    print("✅ Extracted user ID from JWT:", cleaned_token)
                else:
                    print("❌ No user data in JWT response")
                    raise HTTPException(status_code=400, detail="Invalid token - no user data")
            except Exception as e:
                print("❌ JWT processing error:", {
                    "error": str(e),
                    "token_type": "JWT",
                    "original_token": original_token[:10] + "...",
                    "cleaned_token": cleaned_token[:10] + "..."
                })
                raise HTTPException(status_code=400, detail="Invalid token")

        if not AuthService.is_valid_uuid(cleaned_token):
            print("❌ Invalid token format:", cleaned_token[:10] + "...")
            raise HTTPException(status_code=400, detail="Invalid token format")

        print(f"Attempting to set password with token: {cleaned_token[:10]}...")

        settings = get_settings()
        admin_client = create_client(
            settings.supabase_url, settings.supabase_service_role_key
        )

        response = admin_client.auth.admin.update_user_by_id(
            cleaned_token, {"password": request.password}
        )
        print("✅ Password update response:", response)
        return {"message": "Password updated successfully"}
```

- Adds JWT token handling
- Extracts user ID from JWT if present
- Maintains existing UUID handling
- Improves error messages

## Test Plan
1. **Existing Functionality**
   - [ ] Test password reset with UUID token
   - [ ] Verify error handling for invalid UUID
   - [ ] Check password update success case
   - [ ] Verify error messages

2. **New Functionality**
   - [ ] Test with Supabase JWT token
   - [ ] Test invalid JWT handling
   - [ ] Verify user ID extraction
   - [ ] Check error cases for JWT
   - [ ] Test malformed JWT tokens
   - [ ] Test expired JWT tokens
   - [ ] Test JWT tokens from different issuers
   - [ ] Test tokens with missing user data

3. **Debug Information**
   - [ ] Verify token format detection
   - [ ] Check all error scenarios are logged
   - [ ] Confirm user data extraction logging
   - [ ] Test original token preservation

## Rollback Plan
```python
# Keep original code in comments for quick reversion
# @staticmethod
# async def set_password(request: SetPasswordRequest) -> dict:
#     ... (original code above)
```
- Remove JWT handling code
- Restore original token cleaning
- Test password reset flow after reversion

## Verification
- [ ] Test password reset with UUID
- [ ] Test password reset with JWT
- [ ] Verify error handling
- [ ] Check logging output
- [ ] Ensure no regression 