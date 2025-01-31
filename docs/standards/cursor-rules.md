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
  },
  "rules": [
    {
      "name": "git-basics",
      "description": "Essential Git commands for daily use",
      "commands": {
        "status-and-info": [
          {
            "command": "git status",
            "description": "Shows what files are changed, staged, or untracked",
            "common-use": "Check what files you've modified before committing"
          },
          {
            "command": "git diff",
            "description": "Shows exact changes in files",
            "variations": [
              "git diff file.txt    # Changes in specific file",
              "git diff --staged    # Changes that are staged"
            ]
          }
        ],
        "basic-workflow": [
          {
            "command": "git add file.txt",
            "description": "Stage a specific file for commit",
            "variations": [
              "git add .            # Stage all changes",
              "git add *.tsx       # Stage all TypeScript React files",
              "git add src/        # Stage entire directory"
            ]
          },
          {
            "command": "git commit -m \"message\"",
            "description": "Save staged changes with a message",
            "conventions": {
              "format": "<type>: <description>",
              "types": [
                "feat: new feature",
                "fix: bug fix",
                "docs: documentation changes",
                "test: adding or fixing tests",
                "refactor: code changes that neither fix bugs nor add features"
              ]
            }
          }
        ]
      },
      "common-patterns": [
        {
          "name": "basic-save-work",
          "steps": [
            "git status           # Check what's changed",
            "git diff             # Review changes",
            "git add .            # Stage changes",
            "git commit -m \"...\" # Save changes"
          ]
        }
      ]
    },
    {
      "name": "git-branching",
      "description": "Working with branches",
      "commands": {
        "branch-management": [
          {
            "command": "git checkout -b feature/new-thing",
            "description": "Create and switch to new branch",
            "when-to-use": "Starting work on a new feature"
          },
          {
            "command": "git branch",
            "description": "List all local branches",
            "variations": [
              "git branch -a      # Show all branches including remote",
              "git branch -d name # Delete a branch"
            ]
          },
          {
            "command": "git checkout main",
            "description": "Switch to different branch",
            "warning": "Commit or stash changes first"
          }
        ],
        "common-patterns": [
          {
            "name": "feature-branch-workflow",
            "steps": [
              "git checkout main           # Start from main",
              "git pull                    # Get latest changes",
              "git checkout -b feature/xyz # Create feature branch",
              "# Make changes...",
              "git add .",
              "git commit -m \"feat: add xyz\"",
              "git push -u origin feature/xyz"
            ]
          }
        ]
      }
    },
    {
      "name": "git-saving-work",
      "description": "Commands for saving work in progress",
      "commands": {
        "stashing": [
          {
            "command": "git stash",
            "description": "Temporarily save uncommitted changes",
            "variations": [
              "git stash push -m \"message\"  # Save with description",
              "git stash pop                # Apply and remove last stash",
              "git stash list              # Show all stashes",
              "git stash apply stash@{0}   # Apply specific stash"
            ]
          }
        ],
        "common-patterns": [
          {
            "name": "quick-branch-switch",
            "steps": [
              "git stash                # Save current work",
              "git checkout other-branch",
              "# Do something else...",
              "git checkout previous-branch",
              "git stash pop            # Restore work"
            ]
          }
        ]
      }
    },
    {
      "name": "git-undoing",
      "description": "Commands for undoing changes",
      "commands": {
        "undo-local": [
          {
            "command": "git checkout -- file.txt",
            "description": "Discard changes in one file",
            "warning": "Cannot be undone"
          },
          {
            "command": "git reset HEAD file.txt",
            "description": "Unstage a file",
            "safe": true
          },
          {
            "command": "git reset --soft HEAD~1",
            "description": "Undo last commit, keep changes staged",
            "when-to-use": "Fix commit message or add more files"
          }
        ],
        "common-patterns": [
          {
            "name": "fix-last-commit",
            "steps": [
              "git reset --soft HEAD~1  # Undo commit",
              "# Make changes...",
              "git add .",
              "git commit -m \"Better message\""
            ]
          }
        ]
      }
    },
    {
      "name": "git-collaboration",
      "description": "Working with remote repositories",
      "commands": {
        "syncing": [
          {
            "command": "git pull",
            "description": "Get latest changes from remote",
            "best-practice": "Use before starting new work"
          },
          {
            "command": "git push",
            "description": "Send commits to remote",
            "variations": [
              "git push -u origin branch-name # First push of new branch",
              "git push                      # Subsequent pushes"
            ]
          }
        ],
        "common-patterns": [
          {
            "name": "daily-start",
            "steps": [
              "git checkout main  # Switch to main branch",
              "git pull          # Get latest changes",
              "git checkout -b feature/today # New branch for today's work"
            ]
          }
        ]
      }
    }
  ]
} 