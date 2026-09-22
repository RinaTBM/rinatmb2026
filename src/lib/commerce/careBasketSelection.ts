/** One selection per basket slug; choosing another form replaces its checkout and price. */
export function saveCareBasketSelection<T extends { slug: string }>(items: T[], selection: T): T[] {
  return items.some(item => item.slug === selection.slug)
    ? items.map(item => item.slug === selection.slug ? selection : item)
    : [...items, selection];
}
