import { describe, expect, it } from 'vitest';
import {
  WEBSITE_FAMILY_CUTOVER_ENABLED,
  REAL_GEN_ORDER_SUBMISSION_ENABLED,
  classifyCurrentCutoverVariants,
  formularyPendingVariantIds,
  listPatientVisibleVariants,
  WEBSITE_PRODUCT_FAMILIES,
} from '@/data/websiteFamilies';
import { resolveGenClientProductIdForSku } from '@/lib/catalog/familyCommerce';
import { visibleProducts } from '@/data/products';

describe('MBM-FINAL-WEBSITE-LAUNCH-1 gate', () => {
  it('does not enable real GEN order submission', () => {
    expect(WEBSITE_FAMILY_CUTOVER_ENABLED).toBe(true);
    expect(REAL_GEN_ORDER_SUBMISSION_ENABLED).toBe(false);
  });

  it('classifies current cutover variants without holding whole families for one selector', () => {
    const rows = classifyCurrentCutoverVariants();
    const ready = rows.filter((r) => r.classification === 'LAUNCH_READY');
    const held = rows.filter((r) => r.classification === 'HOLD_FROM_LAUNCH');
    expect(ready.length).toBeGreaterThan(0);
    expect(held.length).toBeGreaterThan(0);
    expect(ready.some((r) => r.familyId === 'nad' && r.websiteVariantId === 'nad-nasal-r84')).toBe(
      true,
    );
    expect(held.some((r) => r.websiteVariantId.startsWith('nad-inj-'))).toBe(true);
    const nadFamily = WEBSITE_PRODUCT_FAMILIES.find((f) => f.familyId === 'nad')!;
    const visible = listPatientVisibleVariants(nadFamily);
    expect(visible.map((v) => v.websiteVariantId)).toEqual(['nad-nasal-r84']);
  });

  it('lists FORMULARY_PENDING current variants', () => {
    const pending = formularyPendingVariantIds();
    expect(pending).toContain('nad-inj-5ml-500');
    expect(pending).toContain('fat-burner-current');
  });

  it('resolves GEN clientProductId server-side for launch-ready SKUs only', () => {
    expect(resolveGenClientProductIdForSku('MBM-WM-SEM-B12-001')).toContain('SkqQHmsc0WdsbK9vmV1y');
    expect(resolveGenClientProductIdForSku('MBM-WM-TIR-B12-001')).toContain('SvFDJ7W4nmWL2bkLUMMS');
    expect(resolveGenClientProductIdForSku('MBM-LON-NAD-NS-001')).toContain('FVwkzvQqWIZRNAwbslGw');
    expect(resolveGenClientProductIdForSku('MBM-LON-NAD-INJ-001')).toBeNull();
  });

  it('restores the public shop catalog without B6 names or future-hidden SKUs', () => {
    const slugs = visibleProducts.map((p) => p.slug);
    expect(slugs).toContain('semaglutide');
    expect(slugs).toContain('tirzepatide');
    expect(slugs).toContain('nad-plus');
    expect(slugs).toContain('fat-burner');
    expect(slugs).toContain('bpc-157-tb-500');
    expect(slugs).toContain('estradiol-patch');
    expect(slugs).not.toContain('sermorelin');
    expect(slugs).not.toContain('minoxidil-tablets');
    for (const p of visibleProducts) {
      expect(p.displayName.toLowerCase()).not.toContain('b6');
    }
  });
});
