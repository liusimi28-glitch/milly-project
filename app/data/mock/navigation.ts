import type { NavLink } from '~/types'

export const topBarLinks: NavLink[] = [
  { label: 'Bestsellers', href: '/best-deals/best-gamers-choice' },
  { label: 'Steam Gift Cards', href: '/category/steam' },
  { label: 'Random Keys', href: '/best-deals/random-keys' },
  { label: 'Software', href: '/software-deals' },
  { label: 'Save more with G2A Plus', href: '/plus', highlight: true },
  { label: 'DLC', href: '/category/dlc' },
  { label: 'Gift Cards', href: '/category/gift-cards' },
]

export const headerNavLinks: NavLink[] = [
  { label: 'Bestsellers', href: '/best-deals' },
  { label: 'Random Keys', href: '/best-deals/random-keys' },
  { label: 'Software', href: '/software-deals' },
  { label: 'G2A Plus', href: '/plus', highlight: true },
]
