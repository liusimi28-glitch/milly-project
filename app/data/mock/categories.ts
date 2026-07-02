import type { Category } from '~/types'

export const categories: Category[] = [
  {
    id: 'games',
    name: 'Games',
    icon: 'gamepad-2',
    slug: 'games',
    children: [
      { id: 'action', name: 'Action', icon: 'swords', slug: 'action' },
      { id: 'rpg', name: 'RPG', icon: 'shield', slug: 'rpg' },
      { id: 'horror', name: 'Horror', icon: 'ghost', slug: 'horror' },
      { id: 'indie', name: 'Indie', icon: 'sparkles', slug: 'indie' },
      { id: 'sports', name: 'Sports', icon: 'trophy', slug: 'sports' },
    ],
  },
  {
    id: 'software',
    name: 'Software',
    icon: 'monitor',
    slug: 'software',
    children: [
      { id: 'office', name: 'Office', icon: 'file-text', slug: 'office' },
      { id: 'antivirus', name: 'Antivirus', icon: 'shield-check', slug: 'antivirus' },
      { id: 'windows', name: 'Windows', icon: 'layout-grid', slug: 'windows' },
    ],
  },
  {
    id: 'gift-cards',
    name: 'Gift Cards',
    icon: 'gift',
    slug: 'gift-cards',
    children: [
      { id: 'steam-gc', name: 'Steam', icon: 'steam', slug: 'steam-gift-cards' },
      { id: 'xbox-gc', name: 'Xbox', icon: 'xbox', slug: 'xbox-gift-cards' },
      { id: 'psn-gc', name: 'PlayStation', icon: 'playstation', slug: 'psn-gift-cards' },
    ],
  },
  {
    id: 'dlc',
    name: 'DLC',
    icon: 'package',
    slug: 'dlc',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: 'repeat',
    slug: 'subscriptions',
    children: [
      { id: 'xbox-game-pass', name: 'Xbox Game Pass', icon: 'xbox', slug: 'xbox-game-pass' },
      { id: 'ps-plus', name: 'PlayStation Plus', icon: 'playstation', slug: 'ps-plus' },
    ],
  },
  {
    id: 'random-keys',
    name: 'Random Keys',
    icon: 'dice-5',
    slug: 'random-keys',
  },
  {
    id: 'in-game',
    name: 'In-Game Items',
    icon: 'coins',
    slug: 'in-game-items',
  },
  {
    id: 'prepaid',
    name: 'Prepaid',
    icon: 'smartphone',
    slug: 'prepaid',
  },
  {
    id: 'e-learning',
    name: 'E-Learning',
    icon: 'graduation-cap',
    slug: 'e-learning',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: 'bitcoin',
    slug: 'crypto',
  },
]

export const categoryQuickLinks = categories.slice(0, 8)
