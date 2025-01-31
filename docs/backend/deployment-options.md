# Backend Role in DHG Baseline

## Current Architecture
- Frontend → Supabase (direct auth & data)
- Backend → Optional monitoring services

## Why Backend is Optional
1. Supabase client handles:
   - Authentication
   - Data queries
   - Session management
   
2. Backend currently only provides:
   - Health monitoring
   - Environment info
   - Status checks

## Future Backend Uses
- Custom business logic
- Rate limiting
- Data transformation
- Third-party integrations 