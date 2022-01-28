# 安装命令行
npm install -g @cloudflare/wrangler
# 登录 Cloudflare
wrangler login
# 创建 KV 存储桶
wrangler kv:namespace create "busuanzi" --env production
