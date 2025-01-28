# Vercel Guide

This guide covers common Vercel commands and workflows for development and deployment.

## Quick Start

```bash
# Start local development
vercel dev

# Create preview deployment
vercel

# Deploy to production
vercel --prod
```

## Development Commands

### Local Development
```bash
# Start development server
vercel dev

# Build production version locally
vercel build

# Start development server with hot reload (recommended)
pnpm dev

# Build and preview production build locally
pnpm build && pnpm preview

# Build with environment variables
vercel build --env-file .env.production
vercel build --env-file .env.development

# Pull latest environment variables
vercel env pull
```

### Local Build Verification
```bash
# 1. Build with local environment
vercel build

# 2. Preview production build (using Vite's preview server)
pnpm preview

# 3. Run with specific environment variables
vercel build --env-file .env.production
vercel build --env-file .env.development

# 4. Test specific directory
cd apps/dhg-baseline && vercel build
```

Local builds:
- Uses local environment variables
- Runs build process locally
- Creates output in `.vercel/output` directory
- Matches production build process

> Note: While `vercel start` exists, it's recommended to use Vite's built-in
> development (`pnpm dev`) and preview (`pnpm preview`) commands for local development.
> These provide better performance, hot module replacement, and more accurate
> local development experience.

### Project Setup
```bash
# Initialize new project
vercel init

# Link to existing project
vercel link

# Pull project settings and env vars
vercel pull
```

## Deployment Commands

### Preview Deployments
```bash
# Deploy to preview environment
vercel

# Deploy specific directory
vercel ./apps/dhg-baseline

# Force new deployment
vercel --force
```

### Production Deployments
```bash
# Deploy to production
vercel --prod

# Deploy with environment
vercel --env production
vercel --env preview
vercel --env development
```

## Environment Management

### Environment Variables
```bash
# Pull env vars to .env file
vercel env pull

# Add new env var
vercel env add

# List env vars
vercel env ls
```

### Project Configuration
```bash
# Show project settings
vercel project ls

# Update project settings
vercel project settings

# List all deployments
vercel ls
```

## Domain Management

### Domain Commands
```bash
# List domains
vercel domains ls

# Add domain
vercel domains add [domain]

# Remove domain
vercel domains rm [domain]

# Check DNS configuration
vercel dns ls
```

## Monitoring & Debugging

### Logs and Status
```bash
# Get deployment logs
vercel logs

# Show detailed logs
vercel logs --debug

# Check deployment status
vercel status

# Show detailed deployment info
vercel inspect [deployment-url]
```

## Common Workflows

### Feature Development
1. Start local development:
   ```bash
   vercel dev
   ```

2. Make and test changes locally

3. Create preview deployment:
   ```bash
   vercel
   ```

4. Review preview deployment and share with team

5. Deploy to production when ready:
   ```bash
   vercel --prod
   ```

### Environment Updates
1. Add new environment variable:
   ```bash
   vercel env add
   ```

2. Pull updated variables:
   ```bash
   vercel env pull
   ```

3. Restart local development:
   ```bash
   vercel dev
   ```

## Best Practices

### Deployment
- Always test in preview before production
- Use meaningful deployment comments
- Review deployment logs for issues
- Keep environment variables in sync

### Development
- Use `vercel dev` for local development
- Pull latest env vars regularly
- Check logs when debugging issues
- Use preview deployments for testing

### Project Management
- Keep project settings documented
- Review deployments regularly
- Clean up unused preview deployments
- Monitor domain configurations

## Common Issues

### Deployment Failures
1. Check build logs:
   ```bash
   vercel logs --debug
   ```

2. Verify environment variables:
   ```bash
   vercel env ls
   ```

3. Review project settings:
   ```bash
   vercel project ls
   ```

### Environment Issues
1. Pull latest variables:
   ```bash
   vercel env pull
   ```

2. Verify environment:
   ```bash
   vercel env ls
   ```

3. Check environment-specific settings:
   ```bash
   vercel inspect [deployment-url]
   ```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [CLI Documentation](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment Overview](https://vercel.com/docs/concepts/deployments/overview) 