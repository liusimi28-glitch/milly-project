export function formatPriceFromCents(
  cents: number,
  currency: string,
  locale: string,
): string {
  const amount = cents / 100
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
  }
  catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatReleaseDate(value: string | undefined, locale: string): string | undefined {
  if (!value?.trim()) return undefined

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return value

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(parsed))
}
