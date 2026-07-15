# 客户端 Google 登录配置与验收

契约：客户端通过 Supabase Auth `signInWithOAuth({ provider: 'google' })` 完成 Google 登录；mall-back **不**自行对接 Google OAuth。用户入库走既有 Webhook / JWT 同步（见 `mall-back/docs/auth-user-sync-design.md`）。

## 客户端环境变量

```bash
NUXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

客户端**不需要**配置 Google Client ID / Secret；这些只配置在 Supabase Dashboard 的 Google Provider 中。

开发环境把上述变量写入 `.env.local` 后重启 `nuxt dev`。

## Supabase Dashboard

1. **Authentication → Providers → Google**  
   - 启用 Google  
   - 填入 Google Cloud 的 Client ID / Client Secret  

2. **Authentication → URL Configuration → Redirect URLs** 至少包含：  
   - `http://localhost:3000/auth/callback`（开发，按实际 Nuxt 端口调整）  
   - `https://<client-domain>/auth/callback`（生产）  

   客户端会把回流页写成：

   ```text
   https://<client-domain>/auth/callback?redirect=<urlencoded-path>
   ```

   若 Supabase 对带 query 的 URL 要求精确匹配，请同时放行带 `?redirect=*` 的规则，或使用官方文档允许的通配写法。至少保证 `/auth/callback` 前缀被接受。

3. **Site URL** 设为对应环境的客户端 Origin（如 `http://localhost:3000`）。

## Google Cloud Console

- 创建 OAuth 2.0 客户端（Web application）  
- **Authorized redirect URIs** 填 **Supabase 提供的回调**，形如：

  ```text
  https://<project-ref>.supabase.co/auth/v1/callback
  ```

  **不要**把客户端域名 `/auth/callback` 填到 GCP（那是用户回站地址，由 Supabase 再 302 过去）。

## 客户端行为摘要

| 步骤 | 说明 |
|------|------|
| 点击「使用 Google 登录」 | `signInWithGoogle(route.fullPath)`，`redirectTo` 含消毒后的 `redirect` |
| 整页跳转 Google → Supabase | 成功建立 session 后落到 `/auth/callback` |
| `/auth/callback` | 解析 `error` / `error_description`；成功则 `replace` 到站内路径 |
| 受保护 API | 登录后 `authClient` 自动带 `Authorization: Bearer <access_token>` |

路径消毒规则：仅允许以 `/` 开头的站内路径；拒绝 `//`、含 `://` 的外链。

## 验收清单（AE）

### AE1 — 成功回流

1. 未登录打开例如 `/product/103?locale=zh-CN`  
2. 打开账户下拉 → 「使用 Google 登录」  
3. 完成 Google 授权  
4. 应回到原商品页，且头像/昵称显示已登录  

### AE2 — 拒绝授权

1. 在 Google 页取消授权，或人为构造  
   `/auth/callback?error=access_denied`  
2. 回跳页显示中文错误，并提供「返回首页 / 返回上一页重试」  

### AE3 — 后端用户同步

1. Google 新用户登录成功后，浏览器 DevTools → Network  
2. 调用 `GET {API}/api/v1/client/profile`，请求头含 `Authorization: Bearer …`  
3. 期望 **200** 与用户资料；若 401/404，检查 GoTrue `after-user-created` Webhook 与 JWT 同步  

## 相关文件

- `app/composables/useSupabaseAuth.ts` — `signInWithGoogle`  
- `app/lib/auth-redirect.ts` — 路径消毒与 OAuth 错误解析  
- `app/components/layout/AuthFormPanel.vue` — 登录面板  
- `app/pages/auth/callback.vue` — OAuth 回跳页  
- `docs/api-client.md` — 鉴权 API 客户端总览  
