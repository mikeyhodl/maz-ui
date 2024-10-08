const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}

export const date = (
  date: string | number | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (typeof locale === 'undefined')
    throw new TypeError(
      '[maz-ui](FilterDate) The `locale` attribute is required.',
    )
  if (typeof locale !== 'string')
    throw new TypeError(
      '[maz-ui](FilterDate) The `locale` attribute must be a string.',
    )

  options = options || DEFAULT_OPTIONS

  try {
    const usedDate = date instanceof Date ? date : new Date(date)

    return new Intl.DateTimeFormat(locale, options).format(usedDate)
  } catch (error: unknown) {
    throw new Error(`[maz-ui](FilterDate) ${error}`)
  }
}
