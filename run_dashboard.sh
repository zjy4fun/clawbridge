#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
nohup node index.js > dashboard.log 2>&1 &
echo "ClawBridge Dashboard started in background."
