import type { FooterColumn } from '~/types'

export const footerColumns: FooterColumn[] = [
  {
    title: 'Marketplace',
    links: [
      { label: 'About G2A', href: '/about' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Sell on G2A', href: '/sell' },
      { label: 'Affiliate program', href: '/affiliate' },
      { label: 'G2A Direct', href: '/direct' },
      { label: 'G2A News', href: '/news' },
    ],
  },
  {
    title: 'Help & Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact us', href: '/contact' },
      { label: 'Refund policy', href: '/refund' },
      { label: 'Report fraud', href: '/report' },
      { label: 'System status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Digital Services Act', href: '/dsa' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Discord', href: 'https://discord.gg/g2a' },
      { label: 'Twitter / X', href: 'https://twitter.com/g2a_com' },
      { label: 'Facebook', href: 'https://facebook.com/g2a' },
      { label: 'Instagram', href: 'https://instagram.com/g2a_com' },
    ],
  },
]

export const paymentMethods = [
  'Visa', 'Mastercard', 'PayPal', 'Skrill', 'PayU', 'Bitcoin', 'Apple Pay', 'Google Pay',
]
