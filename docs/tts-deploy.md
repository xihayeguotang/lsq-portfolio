# 作品集 Agent 语音朗读 · 部署文档

为文字聊天 Agent 增加 MiniMax **speech-2.8-hd 流式 TTS** 语音朗读:

- 后端独立 Node WebSocket 代理(持有密钥,前端不直连 MiniMax)
- 音频为 **16kHz / PCM16LE / 单声道**,前端 Web Audio 边收边播
- 手动朗读、插话打断
- 适配 1Panel + Nginx 反向代理 + pm2

## 一、架构

```
浏览器 chat-app.tsx
  │ WebSocket → wss://liangsq.top/ws/tts（JSON 文本帧 / PCM 二进制帧）
  ▼
Nginx 反向代理（WS Upgrade → 127.0.0.1:8787）
  ▼
Node 代理  scripts/tts-server.mjs（pm2 守护）
  │ ws 客户端 → wss://api.minimaxi.com/ws/v1/t2a_v2（Authorization: Bearer）
  ▼
MiniMax speech-2.8-hd
```

## 二、涉及文件

| 文件 | 说明 |
|---|---|
| `scripts/tts-server.mjs` | Node WS 代理服务(新增,需部署到服务器) |
| `src/hooks/use-speech.ts` | 前端 WS 连接 + 分句推送 + 打断 |
| `src/lib/pcm-player.ts` | Web Audio PCM 播放器 |
| `src/components/chat-app.tsx` | 集成朗读按钮 + 插话打断 |
| `src/lib/prompts.ts` | 提示 LLM 使用 `(breath)` 等声音标签 |

## 三、服务器部署

### 3.1 上传代码与安装依赖

把项目代码同步到服务器站点目录(假设 `/www/wwwroot/zuopinji`,按你的 1Panel 站点路径替换):

```bash
cd /www/wwwroot/zuopinji
npm install          # 已包含 ws 依赖
```

### 3.2 配置 MiniMax 密钥

新建 `server/.env`(已写入 `.gitignore`,不会提交)或用 pm2 环境变量注入:

```bash
mkdir -p /www/wwwroot/zuopinji/server
cat > /www/wwwroot/zuopinji/server/.env <<'EOF'
MINIMAX_API_KEY=你的MiniMax_API_KEY
MINIMAX_GROUP_ID=你的GroupId       # sk- 新版 Key 可留空
EOF
```

> 密钥也可直接写进 pm2 环境变量(见 3.3),二选一。**不要把密钥写进前端代码或 NEXT_PUBLIC_ 变量。**

### 3.3 pm2 启动命令

推荐用 `ecosystem` 管理环境变量,创建 `/www/wwwroot/zuopinji/ecosystem.config.cjs`:

```js
module.exports = {
  apps: [
    {
      name: "tts-server",
      script: "scripts/tts-server.mjs",
      env: {
        MINIMAX_API_KEY: "你的MiniMax_API_KEY",
        MINIMAX_GROUP_ID: "",        // sk- 新版可留空
        TTS_PORT: 8787,
        TTS_HOST: "127.0.0.1",
      },
    },
  ],
};
```

启动 / 重启 / 停止 / 日志 / 开机自启:

```bash
cd /www/wwwroot/zuopinji

pm2 start ecosystem.config.cjs          # 启动 TTS 代理
pm2 restart tts-server                  # 重启
pm2 stop tts-server                     # 停止
pm2 logs tts-server                     # 查看日志
pm2 save                                # 保存进程列表
pm2 startup                             # 生成开机自启命令,按提示再执行一次输出
pm2 status                              # 查看状态
```

主站(Next.js)保持你现有 pm2 方式启动(如 `pm2 start npm --name lsq-site -- run start`)。

> 若不使用 ecosystem,也可命令行注入环境变量:
> `MINIMAX_API_KEY=xxx pm2 start scripts/tts-server.mjs --name tts-server`

## 四、Nginx 反向代理(1Panel)

在 **1Panel → 网站 → 对应站点 → 配置文件** 中,确保包含以下两个 `location`:

```nginx
# 主站:需关闭 buffering,否则 chat 流式输出被缓冲
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_cache off;
}

# TTS WebSocket 反向代理
location /ws/tts {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_buffering off;
}
```

保存后 `nginx -t` 校验并 reload:

```bash
nginx -t && nginx -s reload
```

> 前端按 `wss://liangsq.top/ws/tts` 连接:HTTPS 走 wss,由 Nginx 443 自动终结,后端无需处理 TLS。
> 1Panel 面板防火墙只需放行 80/443;`8787` 仅监听 `127.0.0.1`,**不要**对外放行。

## 五、本地联调(可选)

本地开发时没有 Nginx,可在项目 `.env.local` 指定直连代理:

```bash
# .env.local
NEXT_PUBLIC_TTS_WS=ws://localhost:8787
```

再起代理进程联调:

```bash
MINIMAX_API_KEY=你的Key node scripts/tts-server.mjs
npm run dev
```

浏览器打开 `/chat` → 用回复下方的「朗读」按钮验证。

## 六、功能与验证清单

- [ ] 手动点某条回复的「朗读」→ 整条朗读;播放中再点该按钮或顶部停止按钮 → 停止
- [ ] 朗读中断开文字回答,再次提问 → 旧语音立刻停止(插话打断)
- [ ] 音色为默认「温润男声」,语速默认 1x(如需更换音色,改 `.env.local` 中 `NEXT_PUBLIC_TTS_VOICE`,改后重启 dev server)

## 七、故障排查

| 现象 | 排查 |
|---|---|
| 控制台 `语音连接失败` | 确认代理进程在跑(`pm2 status`)、Nginx `/ws/tts` 配置已 reload |
| `语音服务鉴权失败` | `MINIMAX_API_KEY` 有误或未注入 pm2 env |
| `语音账户余额不足` | MiniMax 控制台余额/充值 |
| 能连上但不出声 | 浏览器自动播放策略:需先有一次用户手势(提问/点击朗读);确认 `AudioContext` 已解锁 |
| 首字迟迟不响 | 该句文本过长,流式 chunk 需等首块返回;正常几十 ms 内出首字 |

## 八、备注

- 音频格式固定 16k/PCM/单声道(服务端 `audio_setting` 已写死),前端无需解码,播放延迟最低
- MiniMax WS 120s 无新文本会自动断连,分句推送天然规避;超长停顿场景可后续加心跳
- 音色 ID 可在 MiniMax「音色库」试听替换,修改 `.env.local` 中 `NEXT_PUBLIC_TTS_VOICE` 即可(改后重启 dev server)
- 语音输入(ASR)不在本次范围,后续可用同样模式扩展
