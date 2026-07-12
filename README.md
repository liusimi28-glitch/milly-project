# Nuxt 最小化启动模板

请查阅 [Nuxt 文档](https://nuxt.com/docs/getting-started/introduction) 了解更多信息。

## shadcn-vue Nuxt 项目初始化指南

根据当前项目的实战经验，以下是在 Nuxt 4 中正确初始化集成 `shadcn-vue` 和 Tailwind CSS v4 的完整流程：

### 1. 初始化 Nuxt 项目
```bash
pnpm create nuxt@latest my-app
cd my-app
```
*(如遇到 `reading 'sys'` 报错，请先安装 typescript：`pnpm add -D typescript`)*

### 2. 配置 Tailwind CSS v4
安装依赖：
```bash
pnpm add tailwindcss @tailwindcss/vite -D
```
创建并编辑 `app/assets/css/tailwind.css`：
```css
@import "tailwindcss";
```
更新 `nuxt.config.ts`：
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
```

### 3. 集成 shadcn-nuxt 模块
安装模块：
```bash
pnpm dlx nuxi@latest module add shadcn-nuxt
```
在 `nuxt.config.ts` 中配置模块：
```typescript
export default defineNuxtConfig({
  // ...
  modules: ['shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  }
})
```

### 4. 解决 Hydration 报错 (添加 SSR 宽度插件)
安装 VueUse:
```bash
pnpm add @vueuse/core
```
创建 `app/plugins/ssr-width.ts`：
```typescript
import { provideSSRWidth } from '@vueuse/core'

export default defineNuxtPlugin((nuxtApp) => {
  provideSSRWidth(1024, nuxtApp.vueApp)
})
```

### 5. 初始化 shadcn-vue 配置
由于 Nuxt 4 目录结构的变更，运行 init 前需要确保项目上下文正确：
```bash
# 准备 Nuxt 运行环境，生成 .nuxt 缓存
pnpm dlx nuxi prepare

# 运行初始化命令
pnpm dlx shadcn-vue@latest init -d
```
请注意检查生成的 `components.json`，确保其中的 `tailwind.css` 路径正确指向 `app` 目录下的文件：
```json
"tailwind": {
  "css": "app/assets/css/tailwind.css",
  // ...
}
```

### 6. 添加组件
环境准备就绪，可以开始添加 UI 组件，例如：
```bash
pnpm dlx shadcn-vue@latest add button card
```

---

## 安装设置

请确保已安装相关依赖：

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## 开发服务器

在 `http://localhost:3000` 启动开发服务器：

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## 生产环境

构建生产环境应用：

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

在本地预览生产环境构建结果：

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

请查阅 [部署文档](https://nuxt.com/docs/getting-started/deployment) 了解有关应用部署的更多信息。

## 国际化（i18n）

### 内容语言（BCP-47）

商店可翻译内容（游戏标题/描述、标签名称等）与后端 `mall-back/internal/model/locale.go` → `SupportedLocales` 保持一致，共 **15** 种语言。客户端通过 API `?locale=` 或 `Accept-Language` 请求对应语言。

| 代码 | 语言 |
|------|------|
| `en` | English（英语） |
| `zh-CN` | 简体中文 |
| `zh-TW` | 繁體中文 |
| `ar` | العربية（阿拉伯语） |
| `ja` | 日本語（日语） |
| `ko` | 한국어（韩语） |
| `id` | Bahasa Indonesia（印尼语） |
| `th` | ไทย（泰语） |
| `vi` | Tiếng Việt（越南语） |
| `ms` | Bahasa Melayu（马来语） |
| `hi` | हिन्दी（印地语） |
| `bn` | বাংলা（孟加拉语） |
| `fil` | Filipino（菲律宾语） |
| `ur` | اردو（乌尔都语） |
| `tr` | Türkçe（土耳其语） |

未命中翻译时，后端按 **请求 locale → `en` → `zh-CN` → 任意已有翻译** 回落。首页等接口示例：`GET /api/v1/client/homepage?locale=zh-CN`。
