#!/bin/bash
set -e

echo "🚀 Starting Mhasla Wheels deployment..."

# Go to app folder
cd /opt/mhasla/app

echo "📦 Installing dependencies..."
npm ci --silent

echo "🏗️  Building frontend..."
npm run build

# Ensure dist is available for nginx
if [ ! -d "dist" ]; then
  echo "❌ Build failed: dist/ folder not found!"
  exit 1
fi

echo "♻️  Restarting API service..."
pm2 restart mhasla-api || pm2 start /opt/mhasla/app/api/server.js --name mhasla-api

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
