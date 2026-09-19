import type { PrescriptionBasketItem } from '@/context/PrescriptionBasketContext';

export function savePrescriptionSelection(
  items: PrescriptionBasketItem[],
  selection: PrescriptionBasketItem,
): PrescriptionBasketItem[] {
  // Match old slug-only saved items as well as new form-specific selections.
  const index = items.findIndex(item => item.slug === selection.slug || (
    Boolean(selection.genClientProductId) && item.genClientProductId === selection.genClientProductId
  ));
  if (index < 0) return [...items, selection];
  return items.map((item, i) => i === index ? selection : item);
}
