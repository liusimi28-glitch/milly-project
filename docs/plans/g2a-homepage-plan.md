# G2A 首页仿制 — 工作计划

> 基于当前项目（**Nuxt 4 + Vue 3 + Tailwind CSS v4 + shadcn-vue**）与 [G2A 首页](https://www.g2a.com/) 结构制定的可执行计划。
>
> **范围**：仅首页 · **数据**：全部假数据 · **目标**：视觉、布局与动态交互高度还原

---

## 一、项目目标

| 项 | 说明 |
|---|---|
| **目标** | 实现一个与 g2a.com 首页视觉与信息架构高度一致的数字商城首页 |
| **范围** | 首页单页（`/`），含 Header、内容区、Footer |
| **数据** | 全部使用本地 mock 数据（JSON / TS 常量） |
| **交互** | 搜索框、导航、轮播、Tab 切换等 UI 交互可用，链接可占位（`#` 或空路由） |
| **动效** | 轮播、悬停、滚动、Tab 切换、Header sticky 等动态效果接近 g2a.com 手感 |
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

在 `app/assets/css/tailwind.css` 中扩展 G2A 主题 token，覆盖 shadcn 默认中性色。动效 token 见 **第四节**。

---

## 四、动态效果规范与还原清单

> G2A 首页的「活」感来自组件级微交互 + 滚动行为 + 轮播过渡的组合，而非大量装饰动画。原则：**克制、快速、可降级**。

### 4.1 全局动效 Token

在 `app/assets/css/tailwind.css`（或 `app/assets/css/motion.css`）统一定义：

| Token | 值 | 用途 |
|---|---|---|
| `--motion-fast` | `150ms` | 按钮、链接、图标 hover |
| `--motion-base` | `250ms` | 卡片 hover、Tab 指示器、下拉展开 |
| `--motion-slow` | `400ms` | Banner 切换、区块 fade |
| `--ease-out` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | 默认缓动 |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 轮播、Mega Menu |

Tailwind 用法示例：`transition-all duration-[var(--motion-base)] ease-[var(--ease-out)]`

### 4.2 技术选型

| 能力 | 方案 | 说明 |
|---|---|---|
| 轮播 | `embla-carousel-vue`（已安装 shadcn Carousel） | Hero、商品横滑；支持 autoplay 插件 |
| 横向滚动 | Embla 或 CSS `scroll-snap` + `ScrollArea` | Weekly Trends、分类快捷入口 |
| Tab 切换 | shadcn Tabs + Vue `<Transition>` | Genre / Budget 内容 fade |
| 滚动监听 | `@vueuse/core` `useScroll` / `useElementVisibility` | Sticky Header、箭头显隐 |
| CSS 动画 | Tailwind + `tw-animate-css`（已引入） | 仅用于 fade-in、pulse 等轻量效果 |
| 降级 | `@media (prefers-reduced-motion: reduce)` | 关闭 autoplay、去掉 translate/scale |

### 4.3 按模块动效清单（对照 g2a.com）

| 模块 | G2A 典型动态行为 | 实现要点 | 归属阶段 |
|---|---|---|---|
| **TopBar** | 链接 hover 下划线/变色 | `text-white/80 → text-white`，150ms | 1 |
| **Header** | 滚动后 sticky + 阴影加深 | `useScrollHeader` composable，`shadow-md` 过渡 | 1 |
| **Mega Menu** | 悬停 fade + slideDown 展开；离开延迟关闭 | `opacity` + `translateY(-4px→0)`，250ms；`pointer-events` 防闪烁 | 1 |
| **SearchBar** | focus 边框高亮；mock 下拉建议 fadeIn | ring 橙色；下拉 `max-height` 或 opacity 过渡 | 1 |
| **购物车图标** | hover scale；角标数字（静态 mock） | `scale-105`，badge bounce 可选 | 1 |
| **Hero Banner** | 自动轮播 5s；slide 切换；圆点 active 宽度变化 | Embla Autoplay + loop；指示器 `w-2 → w-6` 过渡 | 2 |
| **CategoryGrid** | 图标 hover 背景变橙；横向 snap 滚动 | `bg-g2a-orange/10`；mobile 触摸滑动 | 2 |
| **ProductCarousel** | 左右箭头 hover；滑到尽头箭头 disabled 淡出 | Embla `canScrollPrev/Next`；smooth scroll | 3 |
| **ProductCard** | hover：阴影 + 上浮 + 封面微 zoom | `shadow-lg translate-y-[-2px] scale-[1.02]` on image | 3 |
| **DiscountBadge** | 首次进入视口轻微 pop（可选） | `animate-in fade-in zoom-in-95`，仅一次 | 3 |
| **GenreTabs** | Tab 下划线 slide；内容 crossfade | TabsTrigger `after` 过渡；`<Transition mode="out-in">` | 4 |
| **BudgetDeals** | Tab 切换同 GenreTabs | 复用同一 Tab 动效模式 | 4 |
| **PlusPromo** | CTA 按钮 hover 亮度；背景 subtle gradient shift（可选） | `brightness-110`；避免过度动画 | 4 |
| **TrustBadges** | 图标 hover 变色 | 150ms color transition | 5 |
| **Footer 链接** | hover 文字变白/变橙 | 标准 link transition | 1 / 5 |
| **图片加载** | 占位 skeleton → fadeIn 真实图 | `loading="lazy"` + opacity 0→1 on load | 3 |
| **移动端菜单** | 汉堡 → 全屏/抽屉 slideIn | `translateX` 或 height expand，300ms | 1 |

### 4.4 不做 / 低优先级动效

以下 g2a.com 存在但**首页仿制可省略**或后期再加：

- Cookie 同意弹窗 slideUp
- G2A Plus 全屏推广弹窗
- 搜索实时 API 联想与 loading spinner
- 页面级 scroll-reveal（区块 stagger 入场）— 可选，阶段 6
- Marquee 无限滚动文字条

### 4.5 新增文件（动效相关）

```
app/
├── assets/css/
│   └── motion.css              # 可选：@keyframes、reduced-motion 规则
├── composables/
│   ├── useScrollHeader.ts      # Header sticky + shadow
│   └── useReducedMotion.ts     # prefers-reduced-motion 检测
```

---

## 五、技术方案

### 5.1 目录结构（建议）

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
│   ├── useMockProducts.ts        # 假数据访问
│   ├── useScrollHeader.ts        # Header 滚动 sticky / shadow
│   └── useReducedMotion.ts       # 动效降级检测
├── assets/css/
│   ├── tailwind.css
│   └── motion.css                # 可选：全局 keyframes、reduced-motion
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

### 5.2 需补充的 shadcn 组件

```bash
pnpm dlx shadcn-vue@latest add input badge carousel tabs scroll-area separator
# 轮播自动播放（Hero Banner）
pnpm add embla-carousel-autoplay
```

### 5.3 图片资源

- 商品封面：占位图（picsum.photos 或本地 `/public/mock/`）
- Banner：渐变背景 + 文字，或 Unsplash 游戏主题图
- Logo：文字 Logo「G2A」或 SVG 占位

---

## 六、假数据模型

### 6.1 核心 TypeScript 类型

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

### 6.2 Mock 数据量（建议）

| 数据集 | 数量 | 用途 |
|---|---|---|
| `banners` | 4~5 | Hero 轮播 |
| `categories` | 12~16 | 分类入口 + Mega Menu |
| `products` | 40~60 | 各区块复用（按 tag 分组） |
| `topBarLinks` | 6~8 | 顶部快捷链接 |
| `footerLinks` | 4 列 × 5~8 条 | Footer |

### 6.3 商品分区标签（mock 字段）

```typescript
products.filter(p => p.tags?.includes('weekly-trend'))
products.filter(p => p.tags?.includes('bestseller'))
products.filter(p => p.tags?.includes('action'))
products.filter(p => p.tags?.includes('under-5'))
```

---

## 七、分阶段实施计划

### 阶段 0：基础准备（约 0.5 天）

- [x] 移除 `NuxtWelcome`，创建 `layouts/default.vue` + `pages/index.vue`
- [x] 扩展 G2A 主题色到 `tailwind.css`
- [x] 创建 `types/` 与 `data/mock/` 假数据文件
- [x] 安装所需 shadcn 组件

**验收**：`pnpm dev` 可访问空白首页骨架，主题色生效。

---

### 阶段 1：全局 Layout（约 1 天）

| 组件 | 要点 | 动效要点 |
|---|---|---|
| `AppTopBar` | 深色/橙色细条，Bestsellers、Steam Gift Cards、Random Keys、Software、G2A Plus | 链接 hover 变色 150ms |
| `AppHeader` | Logo 左、Mega Menu 中、搜索框（宽）、右侧图标（用户/购物车/语言/货币） | 滚动 >80px 后 `sticky` + `shadow-md` 过渡 |
| `AppMegaMenu` | 悬停展开：Games / Software / Gift Cards / Subscriptions 等二级分类 | fade + slideDown 250ms；mouseleave 150ms 延迟关闭 |
| `AppSearchBar` | 大搜索框 + placeholder「Search for games, software…」 | focus ring 橙色；mock 建议列表 fadeIn |
| `AppFooter` | 4 列链接 + 支付方式图标 + 社交 + © 版权 | 链接 hover 颜色过渡 |

- [x] 实现 `useScrollHeader` composable
- [x] 移动端汉堡菜单 slide / expand 动画

**验收**：Header/Footer 在桌面与移动端均可正常展示；**滚动时 Header 阴影平滑出现；Mega Menu 展开/收起有过渡**。

---

### 阶段 2：Hero + 分类区（约 0.5 天）

| 组件 | 要点 | 动效要点 |
|---|---|---|
| `HeroBanner` | Carousel 轮播，自动播放，左右箭头，底部圆点指示器 | Embla Autoplay 5s；slide 切换；active 圆点宽度动画 |
| `CategoryGrid` | 8~12 个圆形/方形分类图标 + 文字，横向滚动或网格 | 项 hover 背景变橙；mobile scroll-snap |

- [x] 安装并接入 `embla-carousel-autoplay`
- [x] `useReducedMotion` 为 true 时禁用 autoplay

**验收**：轮播可切换且**自动播放**；**圆点与箭头状态有过渡**；分类 hover 有反馈。

---

### 阶段 3：商品展示核心（约 1 天）

| 组件 | 要点 | 动效要点 |
|---|---|---|
| `ProductCard` | 封面图、标题、平台图标、现价/原价、折扣 Badge、卖家评分 | hover：shadow + translateY(-2px) + 封面 scale(1.03) |
| `ProductCarousel` | Weekly Trends 横向滚动，左右箭头 | Embla smooth scroll；箭头 disabled 时 opacity-40 |
| `ProductGrid` | Bestsellers 4 列网格，响应式 2→4 列 | 复用 ProductCard 动效 |
| `DiscountBadge` | 红色/橙色 `-XX%` 标签 | 可选：进入视口 fade-in |

- [ ] 商品图 lazy load + 加载完成后 opacity 过渡

**验收**：商品区块数据来自 mock；**卡片 hover 有阴影/上浮/封面 zoom**；横滑箭头状态正确。

---

### 阶段 4：分区 Tab + 促销区（约 1 天）

| 组件 | 要点 | 动效要点 |
|---|---|---|
| `GenreTabs` | Action / RPG / Horror / Indie Tab 切换，切换后商品网格更新 | Tab 下划线 slide；内容 `<Transition mode="out-in">` fade |
| `BudgetDeals` | 「Under $5」「Under $10」双列或 Tab | 复用 GenreTabs 动效模式 |
| `PlusPromo` | 蓝紫渐变横幅，G2A Plus 会员 CTA | CTA hover brightness；背景 gradient 静态即可 |
| `RandomKeysPromo` | 随机钥匙包特色卡片 | 卡片 hover 同 ProductCard |

**验收**：Tab 切换**内容 crossfade 无闪烁**；各区块视觉区分清晰。

---

### 阶段 5：信任区 + 收尾（约 0.5 天）

| 组件 | 要点 | 动效要点 |
|---|---|---|
| `TrustBadges` | 安全支付、AI 反欺诈、认证卖家 3~4 个图标 + 文案 | 图标 hover 变色 150ms |
| `AppDownload` | App Store / Google Play 按钮占位 | 按钮 hover scale / shadow |
| 响应式优化 | 375 / 768 / 1280 三档断点测试 | 动效在移动端不卡顿 |
| 无障碍 | 键盘 focus、alt 文本、语义化 HTML | focus-visible ring；`prefers-reduced-motion` |

**验收**：整页结构完整；移动端可完整浏览；**系统开启「减少动态效果」时 autoplay 与 hover transform 已降级**。

---

### 阶段 6：动效打磨与对照验收（约 0.5 天）

> 在各阶段组件就绪后，对照 Simple Browser 中的 g2a.com 首页做动效逐项核对。

- [ ] 在 `motion.css` 或 `tailwind.css` 中集中定义动效 token 与 `@media (prefers-reduced-motion: reduce)` 规则
- [ ] 实现 `useReducedMotion` composable，Hero autoplay 与卡片 transform 联动降级
- [ ] 对照 g2a.com 录屏/逐块检查：Header sticky、Banner 轮播、商品 hover、Tab 切换 timing
- [ ] 修复 timing 偏差（过快/过慢）与缺失过渡
- [ ] （可选）主内容区 scroll-reveal：区块进入视口 fade-up，stagger 50ms

**验收**：与 g2a.com 并排对比，**核心动效（轮播、hover、Tab、Header scroll）无明显缺失**；无 layout shift 导致的动效抖动。

---

## 八、页面线框（桌面端参考）

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

## 九、验收标准（Definition of Done）

1. **结构完整**：上述 13 个模块全部存在，顺序与 G2A 一致
2. **视觉还原**：橙白主色调、商品卡片样式、折扣标签、Header 布局接近原站
3. **动效还原**：第四节动效清单中「归属阶段 1–5」的项均已实现并通过阶段 6 对照验收
4. **假数据驱动**：所有内容来自 `data/mock/`，无硬编码在组件内
5. **响应式**：320px ~ 1440px 无横向溢出，移动端 Header 可折叠
6. **组件化**：`ProductCard` 等可复用，Section 独立组件
7. **可维护**：TypeScript 类型完整，`pnpm build` 无报错
8. **可访问动效**：支持 `prefers-reduced-motion` 降级，键盘可操作轮播与 Tab

---

## 十、预估工时

| 阶段 | 内容 | 工时 |
|---|---|---|
| 0 | 基础准备 | 0.5 天 |
| 1 | Layout + Header 动效 | 1 天 |
| 2 | Hero + 分类 + 轮播动效 | 0.5 天 |
| 3 | 商品核心 + 卡片 hover | 1 天 |
| 4 | Tab + 促销 + 切换动效 | 1 天 |
| 5 | 收尾 + reduced-motion | 0.5 天 |
| 6 | 动效打磨与 g2a 对照 | 0.5 天 |
| **合计** | | **约 5 天** |

---

## 十一、建议执行顺序

```
阶段0 → 阶段1 → 阶段3(ProductCard) → 阶段2 → 阶段3(区块) → 阶段4 → 阶段5 → 阶段6
```

先完成 `ProductCard` 和 Layout，再填充各 Section；**阶段 6 动效打磨放在全部模块就绪之后**，与 g2a.com 并排对照调 timing。

---

## 十二、变更记录

| 日期 | 说明 |
|---|---|
| 2026-07-01 | 初版工作计划落盘 |
| 2026-07-01 | 阶段 2 完成：HeroBanner 轮播 + CategoryGrid 分类入口 |
| 2026-07-01 | 阶段 1 完成：Layout 组件（TopBar / Header / MegaMenu / SearchBar / Footer） |
