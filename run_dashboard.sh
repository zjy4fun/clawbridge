#!/bin/bash
# run_dashboard.sh - Keep ClawLink Alive

LOG_FILE="/root/clawd/logs/dashboard_daemon.log"
DIR="/root/clawd/skills/clawlink-dashboard"

# Ensure log dir exists
mkdir -p "$(dirname "$LOG_FILE")"

while true; do
    echo "[$(date)] 🧹 Cleaning up zombie processes..." >> "$LOG_FILE"
    # Kill anything on port 3000
    fuser -k 3000/tcp >> "$LOG_FILE" 2>&1
    # Kill orphan cloudflared
    pkill -f "$DIR/cloudflared" >> "$LOG_FILE" 2>&1
    
    echo "[$(date)] 🚀 Starting ClawLink Dashboard..." >> "$LOG_FILE"
    
    # Run Node.js directly
    # Note: We use absolute path to node just in case
    /root/.nvm/versions/node/v22.22.0/bin/node "$DIR/index.js" >> "$LOG_FILE" 2>&1
    
    EXIT_CODE=$?
    echo "[$(date)] ⚠️ Process crashed with exit code $EXIT_CODE. Restarting in 5s..." >> "$LOG_FILE"
    
    sleep 5
done
