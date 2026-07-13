import { formatReleaseDate } from '~/lib/format/price'
import { resolveVerticalGameImage } from '~/lib/game-images'
import { derivePlatform } from '~/lib/mappers/homepage'
import type { GameDetail, GameListItem, GamePrice } from '~/types/api/game'
import type {
  BreadcrumbItem,
  Product,
  ProductDetail,
  ProductImage,
  ProductSpec,
  ProductTrailer,
} from '~/types'

function pickListPrice(prices: GamePrice[] = []) {
  const promo = prices.find(p => p.currency_type === 'promo_token')
  const main = prices.find(p => p.currency_type === 'main_token')
  const row = promo ?? main ?? prices[0]
  if (!row) {
    return { base: 0, original: 0 }
  }
  return {
    base: row.base_token_amount,
    original: row.original_token_amount,
  }
}

function formatTokenAmount(amount: number) {
  if (amount <= 0) return '免费'
  return `${amount} 代币`
}

export function mapGameListItemToProduct(item: GameListItem): Product {
  const { base, original } = pickListPrice(item.prices)
  const price = item.is_free ? 0 : base
  const originalPrice = original > price ? original : undefined
  const discount = computeDiscountPercent(base, original)

  return {
    id: String(item.id),
    title: item.title,
    platform: derivePlatform(item),
    region: 'Global',
    price,
    originalPrice,
    discount,
    image: resolveVerticalGameImage(item),
    seller: 'SiteA',
    sellerRating: 4.5,
    tags: item.tags?.map(tag => tag.name || tag.code) ?? [],
  }
}

export function mapGameDetailResponse(raw: GameDetail, locale: string): ProductDetail {
  const title = raw.title || '未命名游戏'
  const screenshots = mapScreenshots(raw, title)
  const trailers = mapTrailers(raw)
  const { base, original } = pickListPrice(raw.prices)
  const price = raw.is_free ? 0 : base
  const originalPrice = original > price ? original : undefined
  const developers = raw.developers ?? []
  const publishers = raw.publishers ?? []

  return {
    id: String(raw.id),
    title,
    platform: derivePlatform(raw),
    region: 'Global',
    price,
    originalPrice,
    discount: computeDiscountPercent(base, original),
    image: resolveVerticalGameImage(raw),
    seller: 'SiteA',
    sellerRating: 4.5,
    tags: raw.tags?.map(tag => tag.name || tag.code) ?? [],
    slug: String(raw.id),
    breadcrumb: buildBreadcrumb(title, locale),
    headerImage: raw.header_image,
    backgroundImage: raw.library_hero_image || raw.background_image || raw.background_raw_image,
    images: screenshots,
    trailers,
    shortDescription: raw.short_description || '',
    description: raw.about_description || raw.detailed_description || raw.short_description || '',
    descriptionHtml: raw.about_description || raw.detailed_description,
    features: [],
    averageRating: metacriticToRating(raw.metacritic_score),
    reviewCount: raw.recommendations_total ?? 0,
    inStock: !raw.coming_soon,
    stockCount: raw.coming_soon ? 0 : 999,
    specs: buildSpecs(raw, locale, developers, publishers),
    reviews: [],
    sellerDetail: {
      name: 'SiteA',
      rating: 4.5,
      level: '认证卖家',
      totalSales: 0,
      positiveRate: 98,
      memberSince: '2024',
    },
    platformWindows: raw.platform_windows,
    platformMac: raw.platform_mac,
    platformLinux: raw.platform_linux,
    isFree: raw.is_free,
    comingSoon: raw.coming_soon,
    currency: '',
    metacriticScore: raw.metacritic_score,
    releaseDate: formatReleaseDate(raw.release_date, locale),
    requiredAge: raw.required_age,
    developers,
    publishers,
    supportedLanguages: raw.supported_languages?.map(lang => lang.language_code) ?? [],
    supportUrl: raw.support_url,
    supportEmail: raw.support_email,
    priceFormatted: raw.is_free ? '免费' : formatTokenAmount(base),
    originalPriceFormatted: originalPrice ? formatTokenAmount(originalPrice) : undefined,
    prices: raw.prices ?? [],
  }
}

function buildBreadcrumb(title: string, locale: string): BreadcrumbItem[] {
  return [
    { label: '首页', href: withLocaleQuery('/', locale) },
    { label: '游戏', href: withLocaleQuery('/games', locale) },
    { label: title },
  ]
}

function withLocaleQuery(path: string, locale: string): string {
  return `${path}?locale=${encodeURIComponent(locale)}`
}

function mapScreenshots(raw: GameDetail, title: string): ProductImage[] {
  const screenshots = raw.assets?.filter(asset => asset.role === 'screenshot') ?? []

  if (screenshots.length > 0) {
    return screenshots.map((asset, index) => ({
      id: String(asset.id),
      url: asset.url,
      thumbnailUrl: asset.thumbnail_url || asset.url,
      alt: `${title} 截图 ${index + 1}`,
    }))
  }

  const cover = resolveVerticalGameImage(raw)
  if (cover) {
    return [{
      id: 'cover',
      url: cover,
      thumbnailUrl: cover,
      alt: title,
    }]
  }

  return []
}

function mapTrailers(raw: GameDetail): ProductTrailer[] {
  return (raw.assets?.filter(asset => asset.role === 'trailer') ?? []).map(asset => ({
    id: String(asset.id),
    url: asset.url,
    title: asset.title || '游戏预告片',
    thumbnailUrl: asset.thumbnail_url,
  }))
}

function buildSpecs(
  raw: GameDetail,
  locale: string,
  developers: string[],
  publishers: string[],
): ProductSpec[] {
  const specs: ProductSpec[] = []

  if (developers.length > 0) {
    specs.push({ label: '开发商', value: developers.join('、') })
  }
  if (publishers.length > 0) {
    specs.push({ label: '发行商', value: publishers.join('、') })
  }
  if (raw.early_access) {
    specs.push({ label: '抢先体验', value: '是' })
  }
  if (raw.controller_support && raw.controller_support !== 'none') {
    const label = raw.controller_support === 'full' ? '完全支持' : '部分支持'
    specs.push({ label: '手柄支持', value: label })
  }
  if (raw.release_date) {
    specs.push({
      label: '发行日期',
      value: formatReleaseDate(raw.release_date, locale) ?? raw.release_date,
    })
  }
  if (raw.required_age) {
    specs.push({ label: '年龄限制', value: `${raw.required_age}+` })
  }
  if (raw.supported_languages?.length) {
    specs.push({
      label: '支持语言',
      value: raw.supported_languages.map(lang => lang.language_code.toUpperCase()).join('、'),
    })
  }
  if (raw.pc_requirements_min) {
    specs.push({ label: 'PC 最低配置', value: raw.pc_requirements_min })
  }
  if (raw.pc_requirements_rec) {
    specs.push({ label: 'PC 推荐配置', value: raw.pc_requirements_rec })
  }
  if (raw.mac_requirements_min) {
    specs.push({ label: 'Mac 最低配置', value: raw.mac_requirements_min })
  }
  if (raw.linux_requirements_min) {
    specs.push({ label: 'Linux 最低配置', value: raw.linux_requirements_min })
  }
  if (raw.support_url) {
    specs.push({ label: '客服链接', value: raw.support_url })
  }
  if (raw.support_email) {
    specs.push({ label: '客服邮箱', value: raw.support_email })
  }

  return specs
}

function computeDiscountPercent(
  baseAmount: number,
  originalAmount: number,
): number | undefined {
  if (originalAmount <= 0 || baseAmount >= originalAmount) {
    return undefined
  }

  return Math.round((1 - baseAmount / originalAmount) * 100)
}

function metacriticToRating(score?: number): number {
  if (!score || score <= 0) return 0
  return Math.round((score / 100) * 5 * 10) / 10
}

export function tokenPriceForType(
  prices: GamePrice[] | undefined,
  tokenType: string,
): number {
  const row = prices?.find(p => p.currency_type === tokenType)
  return row?.base_token_amount ?? 0
}
