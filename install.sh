#!/bin/bash

# ClawBridge One-Liner Installer
# Usage: curl -sL https://raw.githubusercontent.com/dreamwing/clawbridge/master/install.sh | bash

set -e

echo "🌊 ClawBridge Installer"
echo "-----------------------"

TARGET_DIR="skills/clawbridge"

# 1. Check Directory
if [ -d "$TARGET_DIR" ]; then
    echo "ℹ️  Directory $TARGET_DIR already exists."
else
    echo "⬇️  Cloning repository..."
    mkdir -p skills
    git clone https://github.com/dreamwing/clawbridge.git "$TARGET_DIR"
fi

# 2. Install Deps
echo "📦 Installing dependencies..."
cd "$TARGET_DIR"
if [ -f "package-lock.json" ]; then
    npm ci --production --silent
else
    npm install --production --silent
fi

# 3. Run Setup
echo "🚀 Configuring..."
chmod +x setup.sh
# Force quick mode for zero-friction
./setup.sh --quick

