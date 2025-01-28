# Using Git: A Beginner's Guide

## Daily Workflow

### Starting Your Day
```bash
# 1. Switch to main branch
git checkout main

# 2. Get latest changes
git pull

# 3. Create a branch for today's work
git checkout -b feature/add-login-page
```

### Checking Your Work
```bash
# See what files you've changed
git status

# See exact changes in files
git diff

# See changes in a specific file
git diff src/components/LoginPage.tsx
```

### Saving Your Work
```bash
# 1. Check what you're about to commit
git status

# 2. Stage your changes
git add src/components/LoginPage.tsx
git add src/components/LoginForm.tsx
# Or stage everything:
git add .

# 3. Commit with a descriptive message
git commit -m "feat: add login page with form validation"
```

## Common Situations

### "Help! I Need to Switch Tasks But I'm Not Done"
```bash
# 1. Save your work in progress
git stash save "login page wip"

# 2. Switch to other task
git checkout other-branch

# Later: get your work back
git checkout feature/add-login-page
git stash pop
```

### "Oops, I Made a Mistake"

#### Undo Changes in One File
```bash
# Discard changes in a file (careful: can't be undone!)
git checkout -- src/components/LoginPage.tsx
```

#### Undo Last Commit (but keep changes)
```bash
# Undo commit but keep the changes staged
git reset --soft HEAD~1
```

#### Remove Files from Staging
```bash
# Unstage a file (keep the changes, just not staged)
git reset HEAD src/components/LoginPage.tsx
```

### "I Need to Update My Branch with Main"
```bash
# 1. Save your current work
git add .
git commit -m "feat: work in progress"

# 2. Get latest main
git checkout main
git pull

# 3. Update your branch
git checkout feature/add-login-page
git merge main
```

## Working with Remote Repository

### Pushing Your Work
```bash
# First time pushing a branch
git push -u origin feature/add-login-page

# After that, just:
git push
```

### Getting Others' Changes
```bash
# Update your current branch
git pull

# If you have local changes:
git stash
git pull
git stash pop
```

## Common Command Combinations

### Starting a New Feature
```bash
git checkout main
git pull
git checkout -b feature/new-thing
```

### Quick Save Work in Progress
```bash
git add .
git commit -m "wip: saving progress on login form"
```

### Clean Up a Messy Branch
```bash
# Save current state
git stash

# Reset to clean state
git checkout main
git pull
git checkout -b feature/login-page-clean

# Get your changes back
git stash pop

# Commit properly
git add .
git commit -m "feat: add login page"
```

## Tips for Success

### Good Commit Messages
```bash
# Structure:
# <type>: <description>

# Examples:
git commit -m "feat: add login page"
git commit -m "fix: correct validation error message"
git commit -m "docs: update readme with setup steps"
git commit -m "test: add tests for login form"
```

### Check Before Committing
```bash
# 1. See what's changed
git status

# 2. Review changes
git diff

# 3. Stage carefully
git add src/components/LoginPage.tsx

# 4. Review what's staged
git diff --staged

# 5. Commit
git commit -m "feat: add login page"
```

### Daily Cleanup
```bash
# Update main
git checkout main
git pull

# List branches you've merged
git branch --merged

# Delete old branches
git branch -d feature/old-thing
```

## When Things Go Wrong

### "I Committed to the Wrong Branch!"
```bash
# 1. Copy the commit hash
git log

# 2. Create new branch with current state
git checkout -b feature/correct-branch

# 3. Go back and remove commit from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### "I Need to Undo Changes!"
```bash
# Undo uncommitted changes in a file
git checkout -- filename

# Undo a commit but keep changes staged
git reset --soft HEAD~1

# Completely undo last commit and changes (careful!)
git reset --hard HEAD~1
```

### "My Branch is a Mess!"
```bash
# Save current state
git stash

# Start fresh from main
git checkout main
git pull
git checkout -b feature/fresh-start

# Get your changes back
git stash pop
```

## Remember
- Always `git status` before committing
- Pull from main regularly
- Commit small, logical chunks
- Write clear commit messages
- When in doubt, create a new branch
- Use stash to save work in progress 