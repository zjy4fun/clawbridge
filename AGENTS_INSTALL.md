# ClawBridge Agent Installation Protocol

Use this guide when the user asks to "Install ClawBridge" via OpenClaw.

## 1. Preparation Phase (Background)
Execute these commands silently to prepare the environment. Do not ask the user yet.

```bash
# 1. Clone the repo
git clone https://github.com/dreamwing/clawbridge-openclaw-mobile-dashboard skills/clawbridge-dashboard

# 2. Install dependencies
cd skills/clawbridge-dashboard
npm install --production
chmod +x install.sh
```

## 2. Interaction Phase (Chat)
Once preparation is done, reply to the user with this exact logic:

"**ClawBridge 已下载就绪。**

为了开启远程访问（手机端控制），我需要配置 Cloudflare Tunnel。
1.  如果您已有 Token，请直接回复 Token 内容 (以 `ey` 开头)。
2.  如果没有，请前往 [Cloudflare Zero Trust](https://one.dash.cloudflare.com) > Access > Tunnels 创建一个，并将生成的 Token 发送给我。
3.  如果您不需要远程访问，请回复 `skip`。"

## 3. Configuration Phase (Execution)
Based on user response:

**Case A: User provides Token**
Run this command (replace `<TOKEN>` with the user's input):
```bash
cd skills/clawbridge-dashboard && ./install.sh --token=<TOKEN>
```

**Case B: User says "skip"**
Run this command:
```bash
cd skills/clawbridge-dashboard && ./install.sh --no-tunnel
```

## 4. Handover Phase (Completion)
Capture the output of `install.sh`. Look for the lines starting with `📱 Dashboard URL:`.
Reply to the user:

"✅ **安装成功！服务已启动。**

您的访问链接：
<Paste the URL from script output here>

(如果您配置了 Tunnel，请使用您在 Cloudflare 绑定的域名访问，并在 URL 后加上 `?key=...` 部分)"
