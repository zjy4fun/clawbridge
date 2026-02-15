# ClawBridge 仪表盘 🌉

[🇺🇸 English](./README.md) | **🇨🇳 中文**

**ClawBridge** 是一个专为 **Clawdbot** 和 **OpenClaw** 智能体设计的轻量级、实时任务控制中心。

## ✨ 核心功能
*   **👁️ 全知之眼**: 实时监控 AI 思考 (`🧠`)、工具调用 (`🔧`) 和文件变动 (`📄`)。
*   **💰 代币经济**: 每日 Token 消耗与成本趋势图。
*   **🎮 任务控制**: Cron 定时任务的健康状态与手动触发。
*   **🛡️ 稳定安全**: Systemd 守护与 Magic Link 认证。

---

## 🛠️ 安装指南

### 1. 克隆与安装
```bash
cd /root/clawd/skills
git clone https://github.com/dreamwing/clawbridge-openclaw-mobile-dashboard.git clawbridge-dashboard
cd clawbridge-dashboard
npm install
```

### 2. 配置文件
复制示例文件并修改：

```bash
cp .env.example .env
nano .env
```

**如何获取 `TUNNEL_TOKEN` (隧道令牌):**
1.  登录 **[Cloudflare Zero Trust](https://one.dash.cloudflare.com/)** -> **Networks** -> **Tunnels**。
2.  点击 **Create a tunnel** (创建隧道)。
3.  选择 **Cloudflared** 连接器。
4.  在安装命令中，找到 `--token` 后面的长字符串（以 `eyJh...` 开头）。
5.  复制这个 Token 填入 `.env`。

### 3. 部署服务 (推荐 Systemd)

仓库中提供了 `.service` 模板文件。

1.  **修改模板**：打开 `clawbridge-dashboard.service` 和 `clawbridge-tunnel.service`，确保路径 (`WorkingDirectory`, `ExecStart`) 与您的实际安装路径一致。
2.  **填入 Token**：在 `clawbridge-tunnel.service` 中，将 `<YOUR_TOKEN_HERE>` 替换为您的真实 Token。

```bash
# 复制到系统目录
cp clawbridge-dashboard.service /etc/systemd/system/
cp clawbridge-tunnel.service /etc/systemd/system/

# 启动服务
systemctl daemon-reload
systemctl enable --now clawbridge-dashboard
systemctl enable --now clawbridge-tunnel
```

---

## 🌐 域名配置

### 方案 A：使用自有域名 (推荐)
1.  登录 **Cloudflare Zero Trust** 后台。
2.  点击 **Public Hostname** -> **Add a public hostname**。
3.  **Subdomain**: 输入子域名（如 `captain-deck`，为了兼容免费 SSL 请使用连字符）。
4.  **Domain**: 选择您的域名（如 `clawbridge.app`）。
5.  **Service**: 选择 `HTTP`，地址填 `localhost:3000`。
6.  保存。

### 方案 B：申请 ClawBridge Deck (邀请制)
如果您没有域名，我们可以提供免费的 `clawbridge.app` 子域名。
*   **格式**: `https://<您的ID>-deck.clawbridge.app`
*   **示例**: `https://captain-deck.clawbridge.app`
*   **申请方式**: 目前仅限人工发放。请在 GitHub [提交 Issue](https://github.com/dreamwing/clawbridge-openclaw-mobile-dashboard/issues) 联系管理员。

### 访问仪表盘
使用您在 `.env` 中设置的 Key 访问：

**URL**: `https://<您的域名>/?key=<ACCESS_KEY>`

*示例*: `https://ops.example.com/?key=my-secret-password`

---

## 📄 许可证
MIT License. Created by [DreamWing](https://github.com/dreamwing).
