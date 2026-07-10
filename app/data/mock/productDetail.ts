import { products } from '~/data/mock/products'
import type { Product, ProductDetail, ProductImage, ProductReview } from '~/types'

const reviewTemplates: Omit<ProductReview, 'id' | 'author' | 'date'>[] = [
  {
    rating: 5,
    content: '密钥秒发，激活顺利，价格也很实惠，会继续回购。',
    verified: true,
  },
  {
    rating: 4,
    content: '整体不错，发货速度快，就是说明文档可以更详细一些。',
    verified: true,
  },
  {
    rating: 5,
    content: '已经是第三次购买了，卖家信誉很好，推荐。',
    verified: false,
  },
  {
    rating: 3,
    content: '激活没问题，但等待时间比预期稍长，客服响应及时。',
    verified: true,
  },
]

const featurePool = [
  '即时数字交付，付款后自动发送激活码',
  '支持 Steam 客户端一键激活',
  '全球区账号均可使用（部分区域除外）',
  '7×24 自动发货系统',
  '购买后可在订单页查看激活指引',
  '支持主流 Windows 系统',
]

const authors = ['Alex_Gamer', 'KeyHunter', 'SteamFan99', 'DigitalBuyer', 'NightOwl']

function hashId(id: string): number {
  return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

function buildImages(product: Product): ProductImage[] {
  const seed = hashId(product.id)
  return Array.from({ length: 4 }, (_, i) => ({
    id: `${product.id}-img-${i + 1}`,
    url: `https://picsum.photos/seed/${product.id}-${i + 1}/640/800`,
    alt: `${product.title} 预览图 ${i + 1}`,
  })).map((img, i) => (i === 0 ? { ...img, url: product.image.replace('/300/400', '/640/800') } : img))
}

function buildReviews(product: Product): ProductReview[] {
  const seed = hashId(product.id)
  return reviewTemplates.map((template, i) => ({
    ...template,
    id: `${product.id}-review-${i + 1}`,
    author: authors[(seed + i) % authors.length]!,
    date: `2025-${String((seed % 12) + 1).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`,
  }))
}

export function buildProductDetail(product: Product): ProductDetail {
  const seed = hashId(product.id)
  const isRandomKey = product.title.toLowerCase().includes('random') || product.tags.includes('random-keys')
  const categoryLabel = isRandomKey ? '随机密钥' : '游戏'

  return {
    ...product,
    slug: product.id,
    breadcrumb: [
      { label: '首页', href: '/' },
      { label: categoryLabel, href: isRandomKey ? '/best-deals/random-keys' : '/games' },
      { label: product.title },
    ],
    headerImage: product.image,
    images: buildImages(product),
    trailers: [],
    shortDescription: isRandomKey
      ? '随机 Steam 游戏密钥，全球区即时交付，适合喜欢惊喜的玩家。'
      : `${product.platform} 正版数字密钥，${product.region} 区域，付款后自动发货。`,
    description: isRandomKey
      ? '购买后将获得一个随机 Steam 游戏激活码。密钥适用于全球区 Steam 账号（部分地区可能受限）。本商品为数字商品，付款成功后系统将自动发送激活码至您的订单页面。激活前请确认您的 Steam 账号区域与商品说明一致。'
      : `《${product.title}》是一款备受玩家喜爱的数字版游戏。购买后您将获得 ${product.platform} 平台激活密钥，按照订单页指引即可完成激活并开始游玩。本商品由认证卖家提供，支持自动发货与售后咨询。`,
    features: featurePool.slice(0, 4 + (seed % 3)),
    averageRating: product.sellerRating,
    reviewCount: 120 + (seed % 800),
    inStock: seed % 9 !== 0,
    stockCount: 5 + (seed % 95),
    specs: [
      { label: '平台', value: product.platform },
      { label: '商品类型', value: isRandomKey ? '随机密钥' : '游戏密钥' },
      { label: '激活地区', value: product.region },
      { label: '交付方式', value: '即时数字交付' },
      { label: '发行商', value: isRandomKey ? 'Gaming4You' : '官方授权' },
      { label: '语言', value: '多语言（以平台显示为准）' },
      { label: 'DRM', value: product.platform },
    ],
    reviews: buildReviews(product),
    sellerDetail: {
      name: product.seller,
      rating: product.sellerRating,
      level: seed % 3 === 0 ? '金牌卖家' : seed % 3 === 1 ? '银牌卖家' : '认证卖家',
      totalSales: 1200 + (seed % 50000),
      positiveRate: 92 + (seed % 8),
      memberSince: `${2018 + (seed % 6)} 年`,
    },
    platformWindows: product.platform === 'Steam' || product.platform === 'Epic',
    platformMac: product.platform === 'GOG',
    platformLinux: product.platform === 'Epic',
    isFree: product.price === 0,
    comingSoon: false,
    currency: 'USD',
    developers: [],
    publishers: [],
    supportedLanguages: [],
  }
}

/** G2A 风格示例商品：MVP Random Key */
export const featuredProductDetail: ProductDetail = buildProductDetail({
  ...products.find(p => p.title.includes('Random Premium')) ?? products[27]!,
  id: 'product-10000514851001',
  title: 'MVP Random by Gaming4You - 1 Key PC Steam Key GLOBAL',
  platform: 'Steam',
  region: 'Global',
  price: 2.49,
  originalPrice: 9.99,
  discount: 75,
  image: 'https://picsum.photos/seed/mvp-random-key/300/400',
  seller: 'Gaming4You',
  sellerRating: 4.8,
  tags: ['random-keys', 'weekly-trend', 'under-5'],
})

export function getProductDetailById(id: string): ProductDetail | null {
  if (id === featuredProductDetail.id) {
    return featuredProductDetail
  }

  const base = products.find(p => p.id === id)
  if (!base) return null

  return buildProductDetail(base)
}

export function getRecommendedProducts(productId: string, limit = 6): Product[] {
  const detail = getProductDetailById(productId)
  if (!detail) return products.slice(0, limit)

  return products
    .filter(p => p.id !== productId && (p.platform === detail.platform || p.tags.some(t => detail.tags.includes(t))))
    .slice(0, limit)
}
