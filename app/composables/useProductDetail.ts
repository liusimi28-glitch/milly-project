import { getProductDetailById, getRecommendedProducts } from '~/data/mock/productDetail'

export function useProductDetail() {
  return {
    getProductDetail: getProductDetailById,
    getRecommended: getRecommendedProducts,
  }
}
