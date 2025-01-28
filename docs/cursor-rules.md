# Cursor Development Rules & Standards

## React Development Standards

### Component Structure
- Use functional components with hooks (useState, useEffect, etc.)
- Follow TypeScript for type safety
- Implement responsive design using Tailwind CSS

### Naming Conventions
- Component Names: PascalCase
- Directory Names: lowercase-with-dashes

### Best Practices
- Use `function` for component declarations
- Leverage React hooks (useState, useEffect, useContext)
- Follow hooks rules strictly
- Avoid inline functions
- Prefer functional over class components

### Styling Approach
- Primary: Tailwind CSS with modules
- Keep styles close to components
- Prioritize utility classes

## Vite Configuration
- Utilize Vite's fast bundling capabilities
- Implement hot module replacement
- Use dynamic importing for lazy-loaded routes and components

## Deployment Workflow (Vercel)

### Environments
1. **Development**
   - Purpose: Local development and testing
   - Debug mode enabled
   
2. **Production**
   - Purpose: Live environment
   - Optimized for production performance

### Best Practices
- Implement semantic versioning
- Monitor deployment health
- Test in development before production deployment

## Documentation Standards

### Location & Structure
- All documentation in `docs/` directory
- Use markdown (.md) files
- Maintain clear table of contents

### Documentation Style
- Use clear, simple language
- Avoid technical jargon
- Include practical examples
- Add visual guides for important steps

## Environment Configuration

### Branch Strategy
1. **Main Branch**
   - Production environment (dhg-hub.org)
   - Requires pull request
   - Requires 1 approval
   - Enforced testing

2. **Development Branch**
   - Development environment (dev.dhg-hub.org)
   - Requires pull request
   - Enforced testing

3. **Preview Environments**
   - Pattern: feature/* or migration/*
   - URL: {branch-name}.dhg-hub.org
   - Auto-cleanup after 7 days of inactivity

### Feature Development Workflow
1. Create feature branch from development
2. Develop and test locally
3. Push for preview deployment
4. Create PR to development
5. Merge to development after approval
6. Test in development environment
7. Create PR to main
8. Deploy to production after approval

## Backend Structure

### File Organization
- All backend code in `backend/app/`
- Simple, flat structure
- Key files:
  - main.py
  - auth.py
  - health.py
  - config.py
  - dependencies.py

### API Design
- Keep routes simple initially
- Maximum depth of 2 levels
- Pattern: `/api/{endpoint}`
- Group related endpoints in same file

## Git Standards

### Gitignore Patterns
- Dependencies (node_modules, .pnpm-store)
- Build outputs (dist, build, .next)
- Environment files (.env*)
- Cache (.turbo, .cache)
- Editor files (.vscode, .idea)
- Testing outputs (coverage)
- OS-specific files (.DS_Store)

### Script Standards
- Use kebab-case for script names
- Include comprehensive documentation
- Support both interactive and CI usage
- Implement proper error handling
- Include help documentation
- Use relative paths from script location

## Monorepo Structure
- Root directory: /
- Applications: apps/
- Shared packages: packages/
- Package manager: pnpm
- Monorepo tool: turborepo

### Shared Configurations
- TypeScript: tsconfig.base.json
- ESLint: .eslintrc.base.js
- Tailwind: tailwind.config.base.js

{
  "type": "Documentation",
  "instructions": "Maintain clear documentation in markdown (.md) files within the docs directory.",
  "fileEditing": {
    "format": "Use explicit diff format with +/- markers when editing files",
    "example": "```diff:path/to/file\n- old content\n+ new content\n```",
    "rules": [
      "Always use diff format when editing existing files",
      "Include file path after language identifier",
      "Use + for additions and - for deletions",
      "Show context around changes when needed",
      "When documenting code patterns, always include real examples from the codebase",
      "Format code examples using markdown code blocks with appropriate language tags",
      "Include comments in examples to explain key concepts",
      "Examples should be complete and runnable where possible"
    ]
  }
} 