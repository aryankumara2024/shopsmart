#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

echo "Checking prerequisites..."

if ! command_exists node; then
  echo "Error: Node.js is not installed." >&2
  exit 1
fi

if ! command_exists npm; then
  echo "Error: npm is not installed." >&2
  exit 1
fi

PROJECT_ROOT=$(pwd)

echo "Starting project setup..."

# Setup Server
echo "--------------------------------------------------"
echo "Setting up Server..."
echo "--------------------------------------------------"
if [ -d "server" ]; then
  cd server || exit 1
  if [ -f "package.json" ]; then
    echo "Installing server dependencies..."
    npm install
  else
    echo "Warning: package.json not found in server directory."
  fi
  cd "$PROJECT_ROOT" || exit 1
else
  echo "Error: server directory not found." >&2
  exit 1
fi

# Setup Client
echo "--------------------------------------------------"
echo "Setting up Client..."
echo "--------------------------------------------------"
if [ -d "client" ]; then
  cd client || exit 1
  if [ -f "package.json" ]; then
    echo "Installing client dependencies..."
    npm install
  else
    echo "Warning: package.json not found in client directory."
  fi
  cd "$PROJECT_ROOT" || exit 1
else
  echo "Error: client directory not found." >&2
  exit 1
fi

echo "--------------------------------------------------"
echo "Setup complete! Ready to start."
echo "To run the server: cd server && npm start"
echo "To run the client: cd client && npm run dev"
echo "--------------------------------------------------"

exit 0
