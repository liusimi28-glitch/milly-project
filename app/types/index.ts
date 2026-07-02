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
