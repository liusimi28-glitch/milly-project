import {
  BitcoinIcon,
  CoinsIcon,
  Dice5Icon,
  FileTextIcon,
  Gamepad2Icon,
  GiftIcon,
  GraduationCapIcon,
  GhostIcon,
  LayoutGridIcon,
  MonitorIcon,
  PackageIcon,
  RepeatIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SmartphoneIcon,
  SparklesIcon,
  SwordsIcon,
  TrophyIcon,
} from '@lucide/vue'
import type { Component } from 'vue'

const categoryIconMap: Record<string, Component> = {
  'gamepad-2': Gamepad2Icon,
  'monitor': MonitorIcon,
  'gift': GiftIcon,
  'package': PackageIcon,
  'repeat': RepeatIcon,
  'dice-5': Dice5Icon,
  'coins': CoinsIcon,
  'smartphone': SmartphoneIcon,
  'graduation-cap': GraduationCapIcon,
  'bitcoin': BitcoinIcon,
  'swords': SwordsIcon,
  'shield': ShieldIcon,
  'ghost': GhostIcon,
  'sparkles': SparklesIcon,
  'trophy': TrophyIcon,
  'file-text': FileTextIcon,
  'shield-check': ShieldCheckIcon,
  'layout-grid': LayoutGridIcon,
  'steam': Gamepad2Icon,
  'xbox': Gamepad2Icon,
  'playstation': Gamepad2Icon,
}

export function getCategoryIcon(name: string): Component {
  return categoryIconMap[name] ?? PackageIcon
}
