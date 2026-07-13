export type Platform = 'Steam' | 'Xbox' | 'PlayStation' | 'Origin' | 'Uplay' | 'GOG' | 'Epic'

export type ProductBadge = 'bestseller' | 'new' | 'plus'

export interface Product {
  id: string
  title: string
  platform: Platform
  region: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  seller: string
  sellerRating: number
  badge?: ProductBadge
  tags: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
  children?: Category[]
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  cta: string
  href: string
  image: string
  bgColor?: string
}

export interface NavLink {
  label: string
  href: string
  highlight?: boolean
}

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  thumbnailUrl?: string
}

export interface ProductTrailer {
  id: string
  url: string
  title: string
  thumbnailUrl?: string
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  date: string
  content: string
  verified: boolean
}

export interface ProductSpec {
  label: string
  value: string
}

export interface SellerDetail {
  name: string
  rating: number
  level: string
  totalSales: number
  positiveRate: number
  memberSince: string
}

export interface ProductDetail extends Product {
  slug: string
  breadcrumb: BreadcrumbItem[]
  headerImage: string
  backgroundImage?: string
  images: ProductImage[]
  trailers: ProductTrailer[]
  shortDescription: string
  description: string
  descriptionHtml?: string
  features: string[]
  averageRating: number
  reviewCount: number
  inStock: boolean
  stockCount: number
  specs: ProductSpec[]
  reviews: ProductReview[]
  sellerDetail: SellerDetail
  platformWindows: boolean
  platformMac: boolean
  platformLinux: boolean
  isFree: boolean
  comingSoon: boolean
  currency: string
  metacriticScore?: number
  releaseDate?: string
  requiredAge?: number
  developers: string[]
  publishers: string[]
  supportedLanguages: string[]
  supportUrl?: string
  supportEmail?: string
  priceFormatted?: string
  originalPriceFormatted?: string
  prices: import('~/types/api/game').GamePrice[]
}
