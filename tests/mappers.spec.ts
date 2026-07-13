import type { GameDetail, GameListItem } from '~/types/api/game'
import type { HomepageGameCard, HomepageResponse } from '~/types/api/homepage'
import { mapGameDetailResponse, mapGameListItemToProduct } from '~/lib/mappers/gameDetail'
import { mapHomepageResponse } from '~/lib/mappers/homepage'

const samplePrices = [
  { currency_type: 'main_token', base_token_amount: 19, original_token_amount: 29 },
  { currency_type: 'reward_token', base_token_amount: 19, original_token_amount: 29 },
  { currency_type: 'promo_token', base_token_amount: 19, original_token_amount: 29 },
]

const sampleGameDetail: GameDetail = {
  id: 103,
  locale: 'zh-CN',
  title: '测试游戏',
  short_description: '简短描述',
  about_description: '<p>关于游戏</p>',
  header_image: 'https://cdn.example.com/header.jpg',
  library_capsule_image: 'https://cdn.example.com/lib-cap.jpg',
  prices: samplePrices,
  is_free: false,
  coming_soon: false,
  platform_windows: true,
  platform_mac: false,
  platform_linux: false,
  developers: ['Studio A'],
  publishers: ['Publisher B'],
  tags: [{ code: 'action', name: '动作' }],
  assets: [
    {
      id: 1,
      role: 'trailer',
      asset_type: 'video',
      url: 'https://cdn.example.com/trailer.mp4',
      title: 'Launch Trailer',
    },
  ],
}

const sampleListItem: GameListItem = {
  id: 2,
  locale: 'zh-CN',
  title: '列表游戏',
  header_image: 'https://cdn.example.com/header2.jpg',
  main_capsule_image: 'https://cdn.example.com/main.jpg',
  prices: [
    { currency_type: 'promo_token', base_token_amount: 9, original_token_amount: 19 },
    { currency_type: 'main_token', base_token_amount: 9, original_token_amount: 19 },
    { currency_type: 'reward_token', base_token_amount: 9, original_token_amount: 19 },
  ],
  is_free: false,
  coming_soon: false,
  platform_windows: true,
  platform_mac: false,
  platform_linux: false,
  tags: [{ code: 'rpg', name: '角色扮演' }],
}

const sampleHomepage: HomepageResponse = {
  banners: [],
  category_quick_links: [],
  sections: {
    weekly_trends: { items: [], total: 0 },
    bestsellers: {
      items: [{
        id: 1,
        title: '首页卡片',
        header_image: 'https://cdn.example.com/h.jpg',
        capsule_image: 'https://cdn.example.com/c.jpg',
        library_capsule_image: 'https://cdn.example.com/l.jpg',
        prices: [
          { currency_type: 'promo_token', base_token_amount: 5, original_token_amount: 10 },
        ],
        base_token_amount: 5,
        original_token_amount: 10,
        discount_percent: 50,
        is_free: false,
        platform_windows: true,
        platform_mac: false,
        platform_linux: false,
        tags: ['action'],
      } satisfies HomepageGameCard],
      total: 1,
    },
    genres: {
      action: { items: [], total: 0 },
      rpg: { items: [], total: 0 },
      horror: { items: [], total: 0 },
      indie: { items: [], total: 0 },
      sports: { items: [], total: 0 },
    },
    budget_deals: {
      under_5: { items: [], total: 0 },
      under_10: { items: [], total: 0 },
    },
    random_keys: { items: [], total: 0 },
  },
  meta: {
    locale: 'zh-CN',
    generated_at: '2026-01-01T00:00:00Z',
    cache_ttl_seconds: 300,
  },
}

describe('gameDetail mapper', () => {
  it('maps flat GameDetailDTO without translations object', () => {
    const product = mapGameDetailResponse(sampleGameDetail, 'zh-CN')
    expect(product.title).toBe('测试游戏')
    expect(product.image).toBe('https://cdn.example.com/lib-cap.jpg')
    expect(product.developers).toEqual(['Studio A'])
    expect(product.trailers[0]?.title).toBe('Launch Trailer')
    expect(product.price).toBe(19)
  })
})

describe('game list mapper', () => {
  it('maps GameListItemDTO with tag names and vertical image fallback', () => {
    const product = mapGameListItemToProduct(sampleListItem)
    expect(product.title).toBe('列表游戏')
    expect(product.image).toBe('https://cdn.example.com/main.jpg')
    expect(product.tags).toEqual(['角色扮演'])
    expect(product.discount).toBe(53)
  })
})

describe('homepage mapper', () => {
  it('maps homepage game cards to products', () => {
    const vm = mapHomepageResponse(sampleHomepage)
    expect(vm.bestsellers[0]?.title).toBe('首页卡片')
    expect(vm.bestsellers[0]?.image).toBe('https://cdn.example.com/l.jpg')
    expect(vm.bestsellers[0]?.price).toBe(5)
  })
})
