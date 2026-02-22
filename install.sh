#!/bin/bash

# ClawBridge One-Liner Installer
# Usage: curl -sL https://raw.githubusercontent.com/dreamwing/clawbridge/master/install.sh | bash

set -e

echo "🌊 ClawBridge Installer"
echo "-----------------------"

TARGET_DIR="skills/clawbridge"

# 1. Check Directory & Update
if [ -d "$TARGET_DIR" ]; then
    echo "ℹ️  Updating existing installation..."
    cd "$TARGET_DIR"
    
    # Stash local changes to config (if any, though .env is ignored)
    git stash >/dev/null 2>&1 || true
    
    echo "⬇️  Fetching updates..."
    git fetch --all --tags --prune
    
    # Try to find latest v* tag
    LATEST_TAG=$(git tag -l "v*" | sort -V | tail -n1)
    
    if [ ! -z "$LATEST_TAG" ]; then
        echo "🔖 Switching to release $LATEST_TAG..."
        # Checkout tag (detached head)
        git checkout "tags/$LATEST_TAG"
    else
        echo "⚠️  No release tags found. Using master branch..."
        git checkout master
        git pull origin master
    fi
    
    cd - > /dev/null
else
    echo "⬇️  Cloning repository..."
    mkdir -p skills
    git clone https://github.com/dreamwing/clawbridge.git "$TARGET_DIR"
    
    # Post-clone: Checkout tag if available
    cd "$TARGET_DIR"
    LATEST_TAG=$(git tag -l "v*" | sort -V | tail -n1)
    if [ ! -z "$LATEST_TAG" ]; then
        echo "🔖 Checkout release $LATEST_TAG..."
        git checkout "tags/$LATEST_TAG"
    fi
    cd - > /dev/null
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

