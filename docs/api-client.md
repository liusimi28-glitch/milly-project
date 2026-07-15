# 客户端 API 对接指南

契约真源：[`docs/server.api.yaml`](./server.api.yaml)

## 环境变量

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:46002
NUXT_PUBLIC_SUPABASE_URL=...
NUXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Google 登录配置与验收见 [`auth-google-login.md`](./auth-google-login.md)。

## 请求层

| 模块 | 说明 |
|------|------|
| [`app/lib/api/client.ts`](../app/lib/api/client.ts) | `createApiClient()`、`ApiError`、Bearer token |
| [`app/composables/useApiClient.ts`](../app/composables/useApiClient.ts) | `publicClient`（匿名）/ `authClient`（带 Supabase token） |
| [`app/composables/useApiAuth.ts`](../app/composables/useApiClient.ts) | `getAccessToken()` / `requireAccessToken()` |

所有接口响应格式：`{ data, error_no, error_no, request_id }`。列表接口 `data` 为 `{ items, total }`。

## 商店浏览（无需登录）

| Endpoint | Composable / 页面 | Mapper |
|----------|-------------------|--------|
| `GET /homepage` | `useHomepage()` | `mapHomepageResponse` |
| `GET /game` | `useGameList()`、`/games` | `mapGameListItemToProduct` |
| `GET /game/{id}` | `useGameDetail()`、`/product/:id` | `mapGameDetailResponse` |
| `GET /promotion` | `usePromotions()`、`/promotions` | — |
| `GET /post` | `usePosts()`、`/posts` | — |

### 图片映射

竖版封面统一走 `resolveVerticalGameImage()`（Library Capsule 优先）。

- 首页卡片：`library_capsule_image` → `vertical_capsule_image` → `header_image` → `capsule_image`
- 游戏列表：`library_capsule_image` → `vertical_capsule_image` → `main_capsule_image` → `header_image`
- 游戏详情：同上，且 `library_hero_image` 优先作 Hero 背景

## 用户域（需 Bearer token）

| Endpoint | Composable | 页面 |
|----------|------------|------|
| `GET/PUT /profile` | `useProfile()` | `/account` |
| `GET /wallet` | `useWallet()` | `/wallet` |
| `POST /wallet/recharge` | `useWallet().recharge()` | `/wallet` |
| `GET /wallet/transaction` | `useWallet()` | `/wallet` |
| `GET/POST /order` | `useOrders()` | `/orders`、商品详情购买 |
| `GET /library` | `useLibrary()` | `/library` |

`PlayerLibrary` 仅含 `game_id`，库页通过并行 `GET /game/{id}`  enrichment 游戏信息。

## Locale

`useHomepageLocale()` 响应 `?locale=` 查询参数；商品链接通过 `useProductRoute().productLink(id)` 自动附带 locale。

## 错误处理

- `ApiError.isUnauthorized` → 提示「请先登录」
- 页面级 composable 暴露 `error` + `refresh()` 供重试

## 类型

DTO 定义在 `app/types/api/`，与 `server.api.yaml` 保持同步。

## 仍使用 mock 的模块

- `AppHeader` / `AppFooter` / `AppTopBar` 部分导航与页脚链接
- Footer 支付图标等纯展示内容
