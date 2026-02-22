@echo off
echo ========================================
echo LibraryHub Deployment Script
echo ========================================
echo.

echo Step 1: Authenticating with GitHub...
gh auth login

echo.
echo Step 2: Initializing Git repository...
git init

echo.
echo Step 3: Creating GitHub repository...
gh repo create library-management-system --public --source=. --description "Modern Library Management System with React, Node.js, Express, and MongoDB"

echo.
echo Step 4: Committing and pushing to GitHub...
git add .
git commit -m "Initial commit: Library Management System"
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Deployment complete!
echo ========================================
