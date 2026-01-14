# Git Workflow Guide for TheBotCompany Repository

## Repository Status
✅ Repository cloned successfully
✅ Remote configured: `origin` → `https://github.com/Mohammed-farook-28/TheBotCompany.git`
✅ Git user configured: tharun242004

## Making Changes and Pushing

### Step 1: Make Your Changes
Edit any files you want to modify in the repository.

### Step 2: Check What Changed
```bash
git status
```
This shows which files have been modified.

### Step 3: Stage Your Changes
To stage all changes:
```bash
git add .
```

To stage specific files:
```bash
git add path/to/file1 path/to/file2
```

### Step 4: Commit Your Changes
```bash
git commit -m "Your descriptive commit message here"
```

### Step 5: Push to GitHub
```bash
git push origin main
```

If you're pushing for the first time or if there are remote changes:
```bash
git pull origin main
git push origin main
```

## Common Commands

### View current status
```bash
git status
```

### View changes in files
```bash
git diff
```

### View commit history
```bash
git log
```

### Pull latest changes from GitHub
```bash
git pull origin main
```

### Create a new branch (optional, for feature work)
```bash
git checkout -b feature-name
git push origin feature-name
```

## Important Notes

- Always pull before pushing if others might have made changes
- Write clear, descriptive commit messages
- You have push access, so you can push directly to `main` branch
- If you encounter conflicts, Git will guide you through resolving them

## Quick Workflow Summary
1. Make changes → `git add .` → `git commit -m "message"` → `git push origin main`
