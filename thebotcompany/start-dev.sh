#!/bin/bash

# Development startup script for ULA Event Booking System
# This script starts both the Vite dev server and the Email API server

echo "╔════════════════════════════════════════════════╗"
echo "║  ULA Event Booking System - Development Mode  ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Please copy env-template.txt to .env and configure it"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if API dependencies are installed
if [ ! -d api/node_modules ]; then
    echo "📦 Installing API dependencies..."
    cd api && npm install && cd ..
fi

echo ""
echo "🚀 Starting servers..."
echo ""
echo "   Frontend: http://localhost:5173"
echo "   Email API: http://localhost:3001"
echo "   Admin Panel: http://localhost:5173/admin"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start Email API server in background
cd api && npm start &
API_PID=$!

# Wait a bit for API server to start
sleep 2

# Start Vite dev server in background
cd ..
npm run dev &
VITE_PID=$!

# Wait for both processes
wait $API_PID $VITE_PID


