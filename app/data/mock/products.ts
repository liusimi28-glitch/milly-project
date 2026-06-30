import type { Platform, Product, ProductBadge } from '~/types'

const gameTitles = [
  'Cyberpunk 2077',
  'Elden Ring',
  'Red Dead Redemption 2',
  'Grand Theft Auto V',
  'Hogwarts Legacy',
  'Baldur\'s Gate 3',
  'Call of Duty: Modern Warfare III',
  'EA Sports FC 24',
  'Starfield',
  'The Witcher 3: Wild Hunt',
  'Resident Evil 4',
  'Diablo IV',
  'Marvel\'s Spider-Man Remastered',
  'God of War',
  'Horizon Forbidden West',
  'Forza Horizon 5',
  'Minecraft Java Edition',
  'Palworld',
  'Helldivers 2',
  'Black Myth: Wukong',
  'Microsoft Office 2021',
  'Windows 11 Pro',
  'Kaspersky Total Security',
  'Adobe Creative Cloud',
  'Steam Wallet $50',
  'Xbox Gift Card $25',
  'PlayStation Store $20',
  'Random Premium Key',
  'Random AAA Key Pack',
  'Random Indie Key Pack',
  'Assassin\'s Creed Mirage',
  'Far Cry 6',
  'Dead Space Remake',
  'Lies of P',
  'Armored Core VI',
  'Street Fighter 6',
  'Tekken 8',
  'Sons of the Forest',
  'Valheim',
  'Rust',
  'ARK: Survival Ascended',
  'No Man\'s Sky',
  'Hades II',
  'Civilization VI',
  'Total War: Warhammer III',
  'Crusader Kings III',
  'Stellaris',
  'Euro Truck Simulator 2',
  'The Sims 4',
  'Fallout 4',
]

const platforms: Platform[] = ['Steam', 'Xbox', 'PlayStation', 'Origin', 'Uplay', 'GOG', 'Epic']
const regions = ['Global', 'EU', 'US', 'ROW']
const sellers = ['GameVault', 'KeyMaster', 'DigitalDeals', 'ProSeller99', 'TrustedKeys', 'FastDelivery']

const genreTags = ['action', 'rpg', 'horror', 'indie', 'sports'] as const

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]!
}

function buildProduct(index: number): Product {
  const title = pick(gameTitles, index)
  const platform = pick(platforms, index)
  const basePrice = 4.99 + (index % 20) * 3.5 + (index % 7) * 2
  const hasDiscount = index % 3 !== 0
  const discount = hasDiscount ? 10 + (index % 8) * 10 : undefined
  const originalPrice = hasDiscount ? Math.round(basePrice / (1 - (discount! / 100)) * 100) / 100 : undefined
  const price = hasDiscount ? Math.round(basePrice * 100) / 100 : Math.round(basePrice * 100) / 100

  const tags: string[] = []
  if (index < 12) tags.push('weekly-trend')
  if (index % 4 === 0) tags.push('bestseller')
  tags.push(pick([...genreTags], index))
  if (price < 5) tags.push('under-5')
  if (price < 10) tags.push('under-10')
  if (title.includes('Random')) tags.push('random-keys')
  if (index % 11 === 0) tags.push('plus')

  let badge: ProductBadge | undefined
  if (index % 4 === 0) badge = 'bestseller'
  else if (index % 13 === 0) badge = 'new'
  else if (index % 11 === 0) badge = 'plus'

  return {
    id: `product-${index + 1}`,
    title,
    platform,
    region: pick(regions, index),
    price,
    originalPrice,
    discount,
    image: `https://picsum.photos/seed/g2a-product-${index + 1}/300/400`,
    seller: pick(sellers, index),
    sellerRating: 4.5 + (index % 5) * 0.1,
    badge,
    tags,
  }
}

export const products: Product[] = Array.from({ length: 50 }, (_, i) => buildProduct(i))
