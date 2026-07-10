export const GAME_IMAGE_PLACEHOLDER
  = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533"%3E%3Crect fill="%23f3f4f6" width="400" height="533"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="18"%3ENo image%3C/text%3E%3C/svg%3E'

export interface VerticalGameImageFields {
  library_capsule_image?: string
  vertical_capsule_image?: string
  header_image?: string
  capsule_image?: string
}

/** Resolve cover art for vertical game card / gallery slots (Library Capsule first). */
export function resolveVerticalGameImage(fields: VerticalGameImageFields): string {
  return fields.library_capsule_image
    || fields.vertical_capsule_image
    || fields.header_image
    || fields.capsule_image
    || GAME_IMAGE_PLACEHOLDER
}
