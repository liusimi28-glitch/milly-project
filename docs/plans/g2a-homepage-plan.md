# G2A 首页仿制 — 工作计划

> 基于当前项目（**Nuxt 4 + Vue 3 + Tailwind CSS v4 + shadcn-vue**）与 [G2A 首页](https://www.g2a.com/) 结构制定的可执行计划。
>
> **范围**：仅首页 · **数据**：全部假数据 · **目标**：视觉与布局高度还原

---

## 一、项目目标

| 项 | 说明 |
|---|---|
| **目标** | 实现一个与 g2a.com 首页视觉与信息架构高度一致的数字商城首页 |
| **范围** | 首页单页（`/`），含 Header、内容区、Footer |
| **数据** | 全部使用本地 mock 数据（JSON / TS 常量） |
| **交互** | 搜索框、导航、轮播、Tab 切换等 UI 交互可用，链接可占位（`#` 或空路由） |
| **不做** | 真实登录、购物车逻辑、支付、后端 API、商品详情页（可留占位链接） |

---

## 二、G2A 首页模块拆解（对照清单）

按从上到下顺序，逐块还原：

```
┌─────────────────────────────────────────────────────────┐
│ ① Top Bar — 快捷链接（Bestsellers / Steam / Random Keys…）│
├─────────────────────────────────────────────────────────┤
│ ② Header — Logo + 分类 Mega Menu + 搜索 + 用户/购物车/语言 │
├─────────────────────────────────────────────────────────┤
│ ③ Hero Banner — 主促销轮播（3~5 张）                      │
├─────────────────────────────────────────────────────────┤
│ ④ 分类快捷入口 — Games / Software / Gift Cards / DLC…   │
├─────────────────────────────────────────────────────────┤
│ ⑤ Weekly Trends — 横向商品卡片滚动区                      │
├─────────────────────────────────────────────────────────┤
│ ⑥ Bestsellers — 网格商品列表 + 折扣标签                     │
├─────────────────────────────────────────────────────────┤
│ ⑦ 按类型分区 — Action / RPG / Horror / Indie 等 Tab 区块  │
├─────────────────────────────────────────────────────────┤
│ ⑧ Budget Deals — 「$5 以下」「$10 以下」等低价专区          │
├─────────────────────────────────────────────────────────┤
│ ⑨ G2A Plus 推广条 — 订阅会员 CTA                          │
├─────────────────────────────────────────────────────────┤
│ ⑩ Random Keys / 特色专区 — 随机钥匙包促销                   │
├─────────────────────────────────────────────────────────┤
│ ⑪ 信任背书 — 安全支付 / 反欺诈 / 卖家认证图标                │
├─────────────────────────────────────────────────────────┤
│ ⑫ App 推广 — 下载移动端 App                               │
├─────────────────────────────────────────────────────────┤
│ ⑬ Footer — 多列链接 + 支付方式 + 社交媒体 + 版权            │
└─────────────────────────────────────────────────────────┘
```

---

## 三、设计规范（G2A 品牌还原）

| 元素 | 规格 |
|---|---|
| **主色** | 橙色 `#FF6B00`（CTA、折扣、高亮） |
| **辅色** | 蓝色 `#0066CC`（链接、Plus 会员） |
| **背景** | 白 `#FFFFFF` + 浅灰区块 `#F5F5F5` |
| **文字** | 深灰 `#333333` / 次要 `#666666` |
| **字体** | 保留 Geist Sans，或改用更接近 G2A 的无衬线（如 Inter） |
| **圆角** | 商品卡片 4~8px，按钮 4px |
| **布局** | 最大宽度 ~1280px 居中，移动端单列堆叠 |

在 `app/assets/css/tailwind.css` 中扩展 G2A 主题 token，覆盖 shadcn 默认中性色。

---

## 四、技术方案

### 4.1 目录结构（建议）

```
app/
├── pages/
│   └── index.vue                 # 首页入口，组装各 Section
├── layouts/
│   └── default.vue               # 全局 Layout（Header + Footer）
├── components/
│   ├── layout/
│   │   ├── AppTopBar.vue
│   │   ├── AppHeader.vue
│   │   ├── AppMegaMenu.vue
│   │   ├── AppSearchBar.vue
│   │   └── AppFooter.vue
│   ├── home/
│   │   ├── HeroBanner.vue
│   │   ├── CategoryGrid.vue
│   │   ├── ProductCarousel.vue
│   │   ├── ProductGrid.vue
│   │   ├── GenreTabs.vue
│   │   ├── BudgetDeals.vue
│   │   ├── PlusPromo.vue
│   │   ├── RandomKeysPromo.vue
│   │   ├── TrustBadges.vue
│   │   └── AppDownload.vue
│   └── product/
│       ├── ProductCard.vue       # 可复用商品卡片
│       └── DiscountBadge.vue
├── composables/
│   └── useMockProducts.ts        # 假数据访问
├── data/
│   └── mock/
│       ├── products.ts
│       ├── categories.ts
│       ├── banners.ts
│       ├── navigation.ts
│       └── footer.ts
└── types/
    └── index.ts                  # Product, Category, Banner 等类型
```

### 4.2 需补充的 shadcn 组件

```bash
pnpm dlx shadcn-vue@latest add input badge carousel tabs scroll-area separator
```

### 4.3 图片资源

- 商品封面：占位图（picsum.photos 或本地 `/public/mock/`）
- Banner：渐变背景 + 文字，或 Unsplash 游戏主题图
- Logo：文字 Logo「G2A」或 SVG 占位

---

## 五、假数据模型

### 5.1 核心 TypeScript 类型

```typescript
// types/index.ts
interface Product {
  id: string
  title: string
  platform: 'Steam' | 'Xbox' | 'PlayStation' | 'Origin' | 'Uplay'
  region: string           // 'Global', 'EU', 'US'
  price: number
  originalPrice?: number   // 原价（有则显示折扣）
  discount?: number        // 折扣百分比
  image: string
  seller: string
  sellerRating: number     // 4.8
  badge?: 'bestseller' | 'new' | 'plus'
  tags?: string[]          // 分区标签
}

interface Category {
  id: string
  name: string
  icon: string
  slug: string
  children?: Category[]
}

interface Banner {
  id: string
  title: string
  subtitle?: string
  cta: string
  href: string
  image: string
  bgColor?: string
}
```

### 5.2 Mock 数据量（建议）

| 数据集 | 数量 | 用途 |
|---|---|---|
| `banners` | 4~5 | Hero 轮播 |
| `categories` | 12~16 | 分类入口 + Mega Menu |
| `products` | 40~60 | 各区块复用（按 tag 分组） |
| `topBarLinks` | 6~8 | 顶部快捷链接 |
| `footerLinks` | 4 列 × 5~8 条 | Footer |

### 5.3 商品分区标签（mock 字段）

```typescript
products.filter(p => p.tags?.includes('weekly-trend'))
products.filter(p => p.tags?.includes('bestseller'))
products.filter(p => p.tags?.includes('action'))
products.filter(p => p.tags?.includes('under-5'))
```

---

## 六、分阶段实施计划

### 阶段 0：基础准备（约 0.5 天）

- [x] 移除 `NuxtWelcome`，创建 `layouts/default.vue` + `pages/index.vue`
- [x] 扩展 G2A 主题色到 `tailwind.css`
- [x] 创建 `types/` 与 `data/mock/` 假数据文件
- [x] 安装所需 shadcn 组件

**验收**：`pnpm dev` 可访问空白首页骨架，主题色生效。

---

### 阶段 1：全局 Layout（约 1 天）

| 组件 | 要点 |
|---|---|
| `AppTopBar` | 深色/橙色细条，Bestsellers、Steam Gift Cards、Random Keys、Software、G2A Plus |
| `AppHeader` | Logo 左、Mega Menu 中、搜索框（宽）、右侧图标（用户/购物车/语言/货币） |
| `AppMegaMenu` | 悬停展开：Games / Software / Gift Cards / Subscriptions 等二级分类 |
| `AppSearchBar` | 大搜索框 + placeholder「Search for games, software…」 |
| `AppFooter` | 4 列链接 + 支付方式图标 + 社交 + © 版权 |

**验收**：Header/Footer 在桌面与移动端（汉堡菜单）均可正常展示。

---

### 阶段 2：Hero + 分类区（约 0.5 天）

| 组件 | 要点 |
|---|---|
| `HeroBanner` | Carousel 轮播，自动播放，左右箭头，底部圆点指示器 |
| `CategoryGrid` | 8~12 个圆形/方形分类图标 + 文字，横向滚动或网格 |

**验收**：轮播可切换，分类可点击（占位链接）。

---

### 阶段 3：商品展示核心（约 1 天）

| 组件 | 要点 |
|---|---|
| `ProductCard` | 封面图、标题、平台图标、现价/原价、折扣 Badge、卖家评分 |
| `ProductCarousel` | Weekly Trends 横向滚动，左右箭头 |
| `ProductGrid` | Bestsellers 4 列网格，响应式 2→4 列 |
| `DiscountBadge` | 红色/橙色 `-XX%` 标签 |

**验收**：两个商品区块数据来自 mock，卡片 hover 有阴影/上浮效果。

---

### 阶段 4：分区 Tab + 促销区（约 1 天）

| 组件 | 要点 |
|---|---|
| `GenreTabs` | Action / RPG / Horror / Indie Tab 切换，切换后商品网格更新 |
| `BudgetDeals` | 「Under $5」「Under $10」双列或 Tab |
| `PlusPromo` | 蓝紫渐变横幅，G2A Plus 会员 CTA |
| `RandomKeysPromo` | 随机钥匙包特色卡片 |

**验收**：Tab 切换流畅，各区块视觉区分清晰。

---

### 阶段 5：信任区 + 收尾（约 0.5 天）

| 组件 | 要点 |
|---|---|
| `TrustBadges` | 安全支付、AI 反欺诈、认证卖家 3~4 个图标 + 文案 |
| `AppDownload` | App Store / Google Play 按钮占位 |
| 响应式优化 | 375 / 768 / 1280 三档断点测试 |
| 无障碍 | 键盘 focus、alt 文本、语义化 HTML |

**验收**：整页与 G2A 首页结构对照，无明显缺块；移动端可完整浏览。

---

## 七、页面线框（桌面端参考）

```
[TopBar: Bestsellers | Steam | Random Keys | Software | Plus]
[Logo] [Categories ▼] [======== Search ========] [👤 🛒 🌐]
─────────────────────────────────────────────────────────────
[              Hero Banner Carousel (full width)              ]
─────────────────────────────────────────────────────────────
[🎮 Games] [💿 Software] [🎁 Gift Cards] [📦 DLC] [🎲 Random] …
─────────────────────────────────────────────────────────────
Weekly Trends                                    [◀ ▶]
[Card][Card][Card][Card][Card][Card] →
─────────────────────────────────────────────────────────────
Bestsellers                         [View all →]
[Card] [Card] [Card] [Card]
[Card] [Card] [Card] [Card]
─────────────────────────────────────────────────────────────
[Action] [RPG] [Horror] [Indie] [Sports]  ← tabs
[Card] [Card] [Card] [Card]
─────────────────────────────────────────────────────────────
Budget Deals:  Under $5  |  Under $10
[Card] [Card] [Card] [Card]
─────────────────────────────────────────────────────────────
[══════ G2A Plus — Save more with exclusive deals ══════]
─────────────────────────────────────────────────────────────
[🔒 Secure] [🛡 Anti-fraud] [✓ Verified sellers] [💳 400+ payments]
─────────────────────────────────────────────────────────────
[Footer columns × 4] [Payment icons] [Social] [© 2026]
```

---

## 八、验收标准（Definition of Done）

1. **结构完整**：上述 13 个模块全部存在，顺序与 G2A 一致
2. **视觉还原**：橙白主色调、商品卡片样式、折扣标签、Header 布局接近原站
3. **假数据驱动**：所有内容来自 `data/mock/`，无硬编码在组件内
4. **响应式**：320px ~ 1440px 无横向溢出，移动端 Header 可折叠
5. **组件化**：`ProductCard` 等可复用，Section 独立组件
6. **可维护**：TypeScript 类型完整，`pnpm build` 无报错

---

## 九、预估工时

| 阶段 | 内容 | 工时 |
|---|---|---|
| 0 | 基础准备 | 0.5 天 |
| 1 | Layout | 1 天 |
| 2 | Hero + 分类 | 0.5 天 |
| 3 | 商品核心 | 1 天 |
| 4 | Tab + 促销 | 1 天 |
| 5 | 收尾 + 响应式 | 0.5 天 |
| **合计** | | **约 4.5 天** |

---

## 十、建议执行顺序

```
阶段0 → 阶段1 → 阶段3(ProductCard) → 阶段2 → 阶段3(区块) → 阶段4 → 阶段5
```

先完成 `ProductCard` 和 Layout，再填充各 Section，效率最高。

---

## 变更记录

| 日期 | 说明 |
|---|---|
| 2026-07-01 | 初版工作计划落盘 |
