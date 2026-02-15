# ClawLink Dashboard 📱

**The "Missing Mobile Link" for Autonomous Agents.**
ClawLink is a lightweight, self-hosted dashboard designed to monitor and control your Clawdbot/Agent instance from anywhere.

**Status**: 🟢 Production Ready (v1.0)
**Live URL**: [Your Custom Domain] (e.g., `https://clawlink.geofast.app`)

---

## ✨ Features

1.  **🩸 Kill Switch (Emergency Stop)**: Instantly stop all running agent scripts (`pkill node`) when things go wrong.
2.  **♻️ System Restart**: Remote reboot for the Gateway when cron jobs get stuck.
3.  **📊 Live Status**: Real-time CPU/Memory usage and current task display.
4.  **📝 Cron Monitor**: View scheduled tasks and manually trigger them.
5.  **🔒 Secure**: Protected by Basic Auth + HTTPS (via Cloudflare Tunnel).
6.  **🛡️ Auto-Healing**: Daemon script (`run_dashboard.sh`) ensures 24/7 uptime.

---

## 🚀 Quick Start (Local)

If you just want to run it locally (without public access):

```bash
cd skills/clawlink-dashboard
npm install
npm start
```

Access at: `http://localhost:3000`

---

## 🌐 Deployment & Custom Domain (Cloudflare Tunnel)

To make this dashboard accessible from the internet **without port forwarding**, we use **Cloudflare Tunnel (Zero Trust)**.

### Step 1: Get Your Cloudflare Token
1.  Log in to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2.  Go to **Networks** -> **Tunnels**.
3.  Click **Create a tunnel** -> Select **Cloudflared**.
4.  Name it (e.g., `clawlink-local`) -> Save.
5.  **Copy the Token**: 
    - Look for the installation command: `cloudflared service install eyJhIjoi...`
    - Copy the long string starting with `ey...` (this is your Token).

### Step 2: Configure Public Hostname
1.  In the Tunnel configuration page, click **Next**.
2.  Click **Add a public hostname**.
3.  **Subdomain**: e.g., `ops` or `clawlink`.
4.  **Domain**: Select your domain (e.g., `geofast.app`).
5.  **Service**:
    - **Type**: `HTTP`
    - **URL**: `localhost:3000`
6.  Click **Save Hostname**.

### Step 3: Inject Token into Code
Open `index.js` and replace the `TOKEN` variable:

```javascript
// index.js
const TOKEN = 'eyJhIjoi...'; // Paste your token here
```

*(Note: For better security, consider moving this to an environment variable in production).*

---

## 🔐 Security (Basic Auth)

The dashboard is protected by HTTP Basic Auth. 
**Default Credentials**:

- **User**: `winglet`
- **Pass**: `clawlink2026`

**To change credentials:**
Edit `index.js`:
```javascript
const AUTH = { user: 'new_user', pass: 'new_password' };
```

---

## 🛡️ Daemon (Auto-Restart)

To keep the dashboard running permanently (even after crashes or reboots), use the included shell script:

```bash
# Start Daemon
nohup ./run_dashboard.sh > /dev/null 2>&1 &
```

**How it works**:
1.  Kills any zombie `cloudflared` or `node` processes on port 3000.
2.  Starts the server.
3.  If the server crashes, it waits 5 seconds and restarts it automatically.
4.  Logs are written to `/root/clawd/logs/dashboard_daemon.log`.

---

## 🛠️ Architecture

- **Frontend**: Single-file HTML/JS (No build step required). Auto-detects WebSocket protocol (`ws://` or `wss://`).
- **Backend**: Node.js (Express).
- **Tunnel**: Cloudflare `cloudflared` binary (auto-downloaded on first run).
