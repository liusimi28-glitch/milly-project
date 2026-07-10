# 客户端首页 API 对接

## 环境变量

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:46002
```

开发环境后端端口见 `mall-back/config.dev.toml` 的 `Server.Listen`。

## 数据流

1. `useHomepage()` 在首页顶层通过 `useAsyncData` 调用 `GET /api/v1/client/homepage?locale=`
2. `mapHomepageResponse()` 将 API 响应映射为 `Banner` / `Category` / `Product`
3. 各 home 子组件通过同一 composable 读取共享数据（单次请求）

## 字段映射约定

| API | UI |
|-----|-----|
| `HomepageGameCard` | `Product`（价格 cents/100，竖版封面优先 `library_capsule_image`） |
| `HomepageBanner` | `Banner`（`/promotion/:id` 链接映射为 `/product/:id`） |
| `HomepageCategory` | `Category`（icon 空时用 slug 回退） |

占位字段：`seller` = `SiteA`，`sellerRating` = `4.5`，`region` = `Global`。

## 仍使用 mock 的模块

- `AppHeader` / `AppFooter` / `AppTopBar` / `AppSearchBar`
