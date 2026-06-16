export function parseBoolean(value: string): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    if (value.trim().toLowerCase() === 'true') {
      return true
    }

    if (value.trim().toLowerCase() === 'false') {
      return false
    }
  }

  throw new Error(`Не удалось преобразовать значение "${value}" в логическое значение`)
}
