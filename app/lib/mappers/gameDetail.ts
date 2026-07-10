import { formatPriceFromCents, formatReleaseDate } from '~/lib/format/price'
import { derivePlatform, mapGameCardToProduct } from '~/lib/mappers/homepage'
import type { GameDetailResponse, GameListItem } from '~/types/api/game'
import type {
  BreadcrumbItem,
  Product,
  ProductDetail,
  ProductImage,
  ProductSpec,
  ProductTrailer,
} from '~/types'

export { mapGameCardToProduct }

export function mapGameListItemToProduct(item: GameListItem): Product {
  return mapGameCardToProduct(item)
}

export function mapGameDetailResponse(raw: GameDetailResponse, locale: string): ProductDetail {
  const translation = raw.translations
  const screenshots = mapScreenshots(raw, translation.title)
  const trailers = mapTrailers(raw, locale)
  const price = raw.is_free ? 0 : raw.base_price_cents / 100
  const originalPrice = raw.original_price_cents > 0
    ? raw.original_price_cents / 100
    : undefined
  const developers = raw.companies?.filter(c => c.role === 'developer').map(c => c.name) ?? []
  const publishers = raw.companies?.filter(c => c.role === 'publisher').map(c => c.name) ?? []

  return {
    id: String(raw.id),
    title: translation.title,
    platform: derivePlatform(raw),
    region: 'Global',
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    discount: raw.discount_percent || computeDiscountPercent(raw) || undefined,
    image: raw.header_image,
    seller: 'SiteA',
    sellerRating: 4.5,
    tags: raw.tags?.map(tag => tag.name) ?? [],
    slug: String(raw.id),
    breadcrumb: buildBreadcrumb(translation.title, locale),
    headerImage: raw.header_image,
    backgroundImage: raw.background_image || raw.background_raw_image,
    images: screenshots,
    trailers,
    shortDescription: translation.short_description,
    description: translation.about_description || translation.short_description,
    descriptionHtml: translation.about_description,
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
    currency: raw.currency,
    metacriticScore: raw.metacritic_score,
    releaseDate: formatReleaseDate(raw.release_date, locale),
    requiredAge: raw.required_age,
    developers,
    publishers,
    supportedLanguages: raw.supported_languages?.map(lang => lang.language_code) ?? [],
    supportUrl: raw.support_url,
    supportEmail: raw.support_email,
    priceFormatted: raw.is_free
      ? '免费'
      : raw.price_formatted || formatPriceFromCents(raw.base_price_cents, raw.currency, locale),
    originalPriceFormatted: raw.original_price_formatted
      || (raw.original_price_cents > 0
        ? formatPriceFromCents(raw.original_price_cents, raw.currency, locale)
        : undefined),
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

function mapScreenshots(raw: GameDetailResponse, title: string): ProductImage[] {
  const screenshots = raw.assets?.filter(asset => asset.role === 'screenshot') ?? []

  if (screenshots.length > 0) {
    return screenshots.map((asset, index) => ({
      id: String(asset.id),
      url: asset.url,
      thumbnailUrl: asset.thumbnail_url || asset.url,
      alt: `${title} 截图 ${index + 1}`,
    }))
  }

  if (raw.header_image) {
    return [{
      id: 'header',
      url: raw.header_image,
      thumbnailUrl: raw.header_image,
      alt: title,
    }]
  }

  return []
}

function mapTrailers(raw: GameDetailResponse, locale: string): ProductTrailer[] {
  return (raw.assets?.filter(asset => asset.role === 'trailer') ?? []).map((asset) => {
    const localizedTitle = asset.translations?.find(item => item.locale === locale)?.title
      ?? asset.translations?.[0]?.title
      ?? '游戏预告片'

    return {
      id: String(asset.id),
      url: asset.url,
      title: localizedTitle,
      thumbnailUrl: asset.thumbnail_url,
    }
  })
}

function buildSpecs(
  raw: GameDetailResponse,
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
  if (raw.support_url) {
    specs.push({ label: '客服链接', value: raw.support_url })
  }
  if (raw.support_email) {
    specs.push({ label: '客服邮箱', value: raw.support_email })
  }

  return specs
}

function computeDiscountPercent(raw: GameDetailResponse): number | undefined {
  if (raw.original_price_cents <= 0 || raw.base_price_cents >= raw.original_price_cents) {
    return undefined
  }

  return Math.round((1 - raw.base_price_cents / raw.original_price_cents) * 100)
}

function metacriticToRating(score?: number): number {
  if (!score || score <= 0) return 0
  return Math.round((score / 100) * 5 * 10) / 10
}
