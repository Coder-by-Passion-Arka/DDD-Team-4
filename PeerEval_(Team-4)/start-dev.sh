#!/bin/bash

# DDD Team 4 - Complete Setup Script
echo "🚀 Starting DDD Team 4 Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ All dependencies installed"

# Check if .env files exist and are properly configured
echo "🔧 Checking environment configuration..."

# Verify backend .env
if [ ! -f "backend/src/.env" ]; then
    echo "❌ Backend .env file missing!"
    exit 1
fi

# Verify frontend .env
if [ ! -f "frontend/.env" ]; then
    echo "❌ Frontend .env file missing!"
    exit 1
fi

echo "✅ Environment files are present"

# Show configuration
echo "📋 Current Configuration:"
echo "   Backend: http://localhost:8024"
echo "   Frontend: http://localhost:5173"
echo "   API Base URL: http://localhost:8024/api"

echo ""
echo "🔥 Starting development servers..."
echo "   - Backend will start on port 8024"
echo "   - Frontend will start on port 5173"
echo "   - Press Ctrl+C to stop both servers"
echo ""

# Start both servers
npm run ddd
