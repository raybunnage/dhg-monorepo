# Backend Development Guidelines

## Main Entry Point Rules

1. Single Main Entry Point
   - Each backend service MUST have exactly ONE main.py file
   - Location: `apps/<service-name>/backend/app/main.py`
   - NO main.py files allowed in other locations

2. Directory Structure Enforcement
   ```
   apps/
     <service-name>/
       backend/
         app/              # Application package
           main.py        ✅ ONLY valid location for main.py
           api/
           core/
         tests/
         pyproject.toml
   ```

3. Invalid Locations (❌)
   ```
   apps/<service-name>/backend/main.py        # Invalid
   apps/<service-name>/main.py                # Invalid
   apps/<service-name>/backend/src/main.py    # Invalid
   ```

4. Main File Responsibilities
   - FastAPI app initialization
   - Middleware configuration
   - Route registration
   - Core dependencies setup
   - NO business logic

5. Enforcement Methods
   - Use pre-commit hooks to prevent commits with invalid main.py locations
   - Add CI checks to verify main.py placement
   - Configure linting rules to flag incorrect locations

## File Structure Rules
1. Directory Structure:
   ```
   backend/
   ├── app/
   │   ├── api/           # Route handlers
   │   ├── core/          # Core configurations
   │   ├── models/        # Database models
   │   ├── schemas/       # Pydantic schemas
   │   ├── services/      # Business logic
   │   └── main.py        # Single entry point
   └── pyproject.toml
   ```

2. Routing Rules:
   - All routes should be organized in the `api` directory
   - Routes should be grouped by feature
   - Use versioning (v1, v2) for API endpoints

3. Configuration Rules:
   - Environment variables in `.env`
   - Configuration classes in `core/config.py`
   - No duplicate configuration files

## Best Practices
1. Single Responsibility:
   - main.py: Only app initialization and middleware
   - Route handlers: Only request/response handling
   - Services: Business logic implementation

2. Dependency Injection:
   - Use FastAPI's dependency injection
   - Configure shared dependencies in core/dependencies.py

3. Error Handling:
   - Centralize error handling in core/errors.py
   - Use custom exception handlers 