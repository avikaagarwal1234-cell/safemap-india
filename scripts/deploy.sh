#!/bin/bash
set -e
echo "■ SafeMap India — Auto Deploy Script"
echo "======================================"
# Generate README first
node scripts/generate-readme.js
# Stage all changes
git add -A
# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
git commit -m "feat: landing page + admin dashboard + UI overhaul + alert system [$TIMESTAMP]"
# Push to GitHub (Vercel auto-deploys on push)
git push origin main
echo ""
echo "■ Pushed to GitHub!"
echo "■ Vercel will auto-deploy in ~60 seconds"
echo "■ Check: https://vercel.com/dashboard for deploy status"
