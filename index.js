require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const tunnel = require('./tunnel');

const PORT = 3000;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Config from Env
const SECRET_KEY = process.env.ACCESS_KEY || 'default-insecure';
const TUNNEL_TOKEN = process.env.TUNNEL_TOKEN;

app.use(express.json());

// --- Magic Link Auth Middleware ---
// Access via: https://clawlink.geofast.app/?key=...
app.use((req, res, next) => {
    // 1. Check Query Param (First access)
    if (req.query.key === SECRET_KEY) {
        return next();
    }

    // 2. Check Header (API calls from frontend)
    if (req.headers['x-claw-key'] === SECRET_KEY) {
        return next();
    }

    // 3. Simple Front-End Redirect for Browser
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>body{background:#0f172a;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}</style>
            </head>
            <body>
                <script>
                    const storedKey = localStorage.getItem('claw_key');
                    if (storedKey === '${SECRET_KEY}') {
                        if (!location.search.includes('key=')) {
                            location.href = location.pathname + '?key=' + storedKey;
                        }
                    } else {
                        const input = prompt('🔑 ClawBridge Access Key:');
                        if (input === '${SECRET_KEY}') {
                            localStorage.setItem('claw_key', input);
                            location.href = location.pathname + '?key=' + input;
                        } else {
                            alert('❌ Access Denied');
                            localStorage.removeItem('claw_key');
                            location.reload();
                        }
                    }
                </script>
            </body>
            </html>
        `);
    }

    res.status(401).json({ error: 'Unauthorized' });
});

app.use(express.static(path.join(__dirname, 'public')));

// API: Status
app.get('/api/status', (req, res) => {
    const cmd = "ps -eo pid,pcpu,comm,args --sort=-pcpu | head -n 15";
    exec(cmd, (err, stdout) => {
        const lines = stdout.trim().split('\n').slice(1);
        let activities = [];
        let totalCpu = 0;

        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const cpu = parseFloat(parts[1]);
            const comm = parts[2];
            const args = parts.slice(3).join(' ');

            if (!isNaN(cpu)) totalCpu += cpu;

            if (comm === 'node' && args.includes('scripts/')) {
                const script = args.match(/scripts\/([a-zA-Z0-9_.-]+)/)?.[1] || 'Script';
                activities.push(`📜 ${script}`);
            }
            
            if (args.includes('clawdbot') && !args.includes('gateway') && !args.includes('dashboard')) {
                activities.push(`🤖 Sub-Agent`);
            }

            if (['grep', 'find', 'curl', 'wget', 'git', 'npm', 'tar', 'python', 'python3'].includes(comm)) {
                activities.push(`🔧 ${comm}`);
            }
        });

        activities = [...new Set(activities)];

        let status = 'idle';
        let taskText = 'System Idle';
        
        if (activities.length > 0) {
            status = 'busy';
            taskText = activities.join(', ');
        } else if (totalCpu > 10.0) {
            status = 'busy';
            taskText = '🧠 Thinking / Processing';
        }

        res.json({
            status: status,
            task: taskText,
            cpu: Math.round(totalCpu),
            mem: Math.round((1 - os.freemem() / os.totalmem()) * 100),
            lastHeartbeat: new Date().toISOString()
        });
    });
});

// API: Kill
app.post('/api/kill', (req, res) => {
    exec("pkill -f 'node scripts/'", () => res.json({status:'killed'}));
});

// API: Restart Gateway
app.post('/api/gateway/restart', (req, res) => {
    exec("pkill -f 'clawdbot gateway' || true", () => {
        setTimeout(() => {
            exec("/root/.nvm/versions/node/v22.22.0/bin/clawdbot gateway start --background", () => {
                 res.json({status:'restarted'});
            });
        }, 2000);
    });
});

// API: Cron
app.get('/api/cron', (req, res) => {
    exec('/root/.nvm/versions/node/v22.22.0/bin/clawdbot cron list --json', { maxBuffer: 1024 * 1024 * 5 }, (err, stdout) => {
        if (!err) {
            try {
                const data = JSON.parse(stdout);
                if (data.jobs) return res.json(data.jobs);
            } catch (e) {}
        }
        // Fallback
        try {
            const fs = require('fs');
            const fileData = fs.readFileSync('/root/.clawdbot/cron/jobs.json', 'utf8');
            const json = JSON.parse(fileData);
            return res.json(json.jobs || []);
        } catch(e) {
            res.json([]); 
        }
    });
});

app.post('/api/run/:id', (req, res) => {
    exec(`/root/.nvm/versions/node/v22.22.0/bin/clawdbot cron run ${req.params.id}`);
    res.json({status:'triggered'});
});

// WS Heartbeat
setInterval(() => {
    wss.clients.forEach(c => c.send(JSON.stringify({type:'heartbeat', ts:Date.now()})));
}, 2000);

// Main
async function main() {
    server.listen(PORT, '::', async () => {
        console.log(`[Dashboard] Local: http://[::]:${PORT}`);
        
        // Note: Tunnel is now managed by systemd (clawbridge-tunnel), but if running standalone:
        if (process.env.ENABLE_EMBEDDED_TUNNEL === 'true') {
            try {
                await tunnel.downloadBinary();
                const url = await tunnel.startTunnel(PORT, TUNNEL_TOKEN);
                console.log(`\n🚀 CLAWBRIDGE DASHBOARD LIVE:\n👉 ${url}\n`);
            } catch (e) {
                console.error('Tunnel Failed:', e);
            }
        }
    });
}

main();
