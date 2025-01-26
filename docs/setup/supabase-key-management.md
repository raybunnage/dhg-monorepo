# Supabase Key Management Guide

This guide explains the different types of Supabase keys, their purposes, and best practices for using them in the DHG Hub application.

## Key Types Overview

| Key Type | Usage | Security Level | Location |
|----------|-------|----------------|-----------|
| Anon Key | Public client operations | Public | Frontend `.env` |
| Service Role Key | Admin/backend operations | Secret | Backend `.env` |

## Anon Key (Public)

### Purpose
- Public client operations
- User authentication
- Row Level Security (RLS) enforced operations
- Public data access

### Usage in Frontend
```typescript
// AuthContext.tsx
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY  // Public key
);

// Example operations
const login = async ({ email, password }) => {
  await supabase.auth.signInWithPassword({ email, password });
};

const getUserPosts = async (userId) => {
  // RLS will ensure users only see their own posts
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId);
};
```

### Security Considerations
- Safe to expose in client-side code
- Always use with Row Level Security (RLS)
- Limited permissions by design
- Used for authenticated user operations

## Service Role Key (Admin)

### Purpose
- Administrative operations
- Backend services
- RLS bypass when needed
- Data migrations and maintenance

### Usage in Backend
```python
# main.py
def get_supabase(settings: Settings = Depends(get_settings)) -> Client:
    return create_client(
        settings.supabase_url,
        settings.supabase_key  # Service role key
    )

@app.get("/api/admin/users")
async def list_users(supabase: Client = Depends(get_supabase)):
    # Admin operation using service role key
    return await supabase.auth.admin.list_users()
```

### Security Considerations
- Never expose in client-side code
- Store securely in backend `.env`
- Use only for necessary admin operations
- Implement proper access controls

## Environment Configuration

### Frontend (.env)
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)
```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Common Use Cases

### User Authentication
```typescript
// Frontend (Anon Key)
const signUp = async () => {
  await supabase.auth.signUp({ email, password });
};

// Backend (Service Key)
const deleteUser = async (userId) => {
  await supabase.auth.admin.deleteUser(userId);
};
```

### Data Access
```typescript
// Frontend (Anon Key) - RLS Enforced
const { data: userPosts } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', currentUser.id);

// Backend (Service Key) - RLS Bypassed
const { data: allPosts } = await supabase
  .from('posts')
  .select('*');
```

## Best Practices

1. **Key Management**
   - Keep service role key secure
   - Rotate keys periodically
   - Use environment variables
   - Never commit keys to version control

2. **Access Control**
   - Implement RLS policies
   - Use anon key for client operations
   - Limit service key usage
   - Validate permissions server-side

3. **Security Measures**
   - Encrypt sensitive data
   - Use HTTPS only
   - Implement rate limiting
   - Monitor usage patterns

4. **Development Workflow**
   - Use different projects for dev/prod
   - Test RLS policies thoroughly
   - Review security settings regularly
   - Document policy changes

## Troubleshooting

Common issues and solutions:
- Permission denied: Check RLS policies
- Authentication failed: Verify key validity
- Data access issues: Review access patterns
- Security concerns: Audit key usage

## Additional Resources

- [Supabase Security Documentation](https://supabase.com/docs/guides/auth/security)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [API Key Best Practices](https://supabase.com/docs/guides/api-keys) 