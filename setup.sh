#!/bin/bash

# ClawBridge One-Liner Installer
# Usage: curl -sL https://raw.githubusercontent.com/dreamwing/clawbridge-openclaw-mobile-dashboard/master/setup.sh | bash

set -e

echo "🌊 ClawBridge Quick Installer"
echo "------------------------------"

TARGET_DIR="skills/clawbridge-dashboard"

# 1. Check Directory
if [ -d "$TARGET_DIR" ]; then
    echo "ℹ️  Directory $TARGET_DIR already exists."
else
    echo "⬇️  Cloning repository..."
    mkdir -p skills
    git clone https://github.com/dreamwing/clawbridge-openclaw-mobile-dashboard.git "$TARGET_DIR"
fi

# 2. Install Deps
echo "📦 Installing dependencies..."
cd "$TARGET_DIR"
if [ -f "package-lock.json" ]; then
    npm ci --production --silent
else
    npm install --production --silent
fi

# 3. Run Install
echo "🚀 Launching setup..."
chmod +x install.sh
./install.sh --quick
