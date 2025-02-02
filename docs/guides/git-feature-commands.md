# Git Feature Branch Commands Guide

## Feature Branch Creation

```bash
# Ensure you're on development and up-to-date
git checkout development
git pull origin development

# Create feature branch
git checkout -b feature/user-auth
```

## Daily Development Flow

```bash
# Start of day - get latest changes
git checkout development
git pull origin development
git checkout feature/user-auth
git rebase development

# During development - commit changes
git add .
git commit -m "feat: add user authentication flow"

# Push changes
git push origin feature/user-auth
```

## Migration-Specific Commands

```bash
# Create migration-specific feature branch
git checkout -b feature/add-user-fields

# Commit migration changes
git add migrations/
git commit -m "feat(db): add user profile fields"

# Push with migration tag
git tag migration-user-fields-v1
git push origin feature/add-user-fields --tags
```

## Code Review Preparation

```bash
# Update branch with latest development changes
git checkout development
git pull origin development
git checkout feature/user-auth
git rebase development

# Squash commits if needed
git rebase -i HEAD~3  # Squash last 3 commits

# Force push if commits were squashed
git push origin feature/user-auth --force-with-lease
```

## Pull Request Commands

```bash
# Create PR branch if needed
git checkout -b feature/user-auth-pr
git merge feature/user-auth
git push origin feature/user-auth-pr

# After PR approval, merge to development
git checkout development
git merge feature/user-auth
git push origin development
```

## Cleanup Commands

```bash
# Delete local branch after merge
git branch -d feature/user-auth

# Delete remote branch
git push origin --delete feature/user-auth

# Clean up local references
git fetch --prune
```

## Emergency Fixes

```bash
# Create hotfix branch
git checkout -b hotfix/fix-migration
git add .
git commit -m "fix: correct migration issue"
git push origin hotfix/fix-migration
```

## Best Practices

1. **Branch Naming**:
```bash
feature/[feature-name]          # New features
feature/migrate-[description]   # Database migrations
hotfix/[issue-description]     # Emergency fixes
```

2. **Commit Messages**:
```bash
feat: add new feature
feat(db): add database migration
fix: resolve issue
docs: update documentation
```

3. **Migration Safety**:
```bash
# Always backup before migrations
git tag backup-[date] main
git push origin backup-[date]
```

## Common Issues

### Reset to Remote
```bash
# Discard local changes and reset to remote
git fetch origin
git reset --hard origin/feature/user-auth
```

### Fix Wrong Branch
```bash
# Save changes and switch branches
git stash
git checkout correct-branch
git stash pop
```

### Undo Last Commit
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
```

## Migration-Specific Tags

```bash
# Create migration tag
git tag migration-v1.0.0 feature/add-user-fields

# Push tag
git push origin migration-v1.0.0

# List migration tags
git tag -l "migration-*"

# Delete migration tag if needed
git tag -d migration-v1.0.0
git push origin :refs/tags/migration-v1.0.0
```

---

**Note**: Always test migrations in development/staging before applying to production. 