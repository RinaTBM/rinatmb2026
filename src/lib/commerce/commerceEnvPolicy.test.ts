import { describe, expect, it } from 'vitest';
import {
  AUTHORIZED_MBM_SHIPPING_CENTS,
  isAuthorizedMbmShippingCents,
  isProductionCommerceRuntime,
  resolveGenApiOrdersEnabled,
  resolveRequireGenMappingForRx,
} from './commerceEnvPolicy';

describe('commerceEnvPolicy', () => {
  it('production Rx GEN guard defaults on for production runtime', () => {
    expect(
      resolveRequireGenMappingForRx({ MBM_RUNTIME_ENV: 'production' }),
    ).toBe(true);
    expect(
      resolveRequireGenMappingForRx({
        SUPABASE_URL: 'https://bsgtuuzwgeetsjjdrtrm.supabase.co',
      }),
    ).toBe(true);
  });

  it('staging/dev defaults REQUIRE_GEN_MAPPING_FOR_RX off', () => {
    expect(resolveRequireGenMappingForRx({ MBM_RUNTIME_ENV: 'staging' })).toBe(false);
    expect(
      resolveRequireGenMappingForRx({
        SUPABASE_URL: 'https://mxvaxkkwrbwhqasnsjpm.supabase.co',
      }),
    ).toBe(false);
    expect(resolveRequireGenMappingForRx({})).toBe(false);
  });

  it('explicit REQUIRE_GEN_MAPPING_FOR_RX overrides runtime', () => {
    expect(
      resolveRequireGenMappingForRx({
        MBM_RUNTIME_ENV: 'staging',
        REQUIRE_GEN_MAPPING_FOR_RX: 'true',
      }),
    ).toBe(true);
    expect(
      resolveRequireGenMappingForRx({
        MBM_RUNTIME_ENV: 'production',
        REQUIRE_GEN_MAPPING_FOR_RX: 'false',
      }),
    ).toBe(false);
  });

  it('never treats Demo Tagada shipping 1156 as authorized MBM shipping', () => {
    expect(AUTHORIZED_MBM_SHIPPING_CENTS).toEqual([0, 3000, 5000]);
    expect(isAuthorizedMbmShippingCents(1156)).toBe(false);
    expect(isAuthorizedMbmShippingCents(0)).toBe(true);
    expect(isAuthorizedMbmShippingCents(3000)).toBe(true);
    expect(isAuthorizedMbmShippingCents(5000)).toBe(true);
  });

  it('isProductionCommerceRuntime prefers explicit env over URL', () => {
    expect(
      isProductionCommerceRuntime({
        MBM_RUNTIME_ENV: 'staging',
        SUPABASE_URL: 'https://bsgtuuzwgeetsjjdrtrm.supabase.co',
      }),
    ).toBe(false);
  });

  it('GEN_API_ORDERS_ENABLED defaults false until explicitly enabled', () => {
    expect(resolveGenApiOrdersEnabled({})).toBe(false);
    expect(resolveGenApiOrdersEnabled({ GEN_API_ORDERS_ENABLED: 'true' })).toBe(true);
    expect(resolveGenApiOrdersEnabled({ GEN_API_ORDERS_ENABLED: '1' })).toBe(true);
    expect(resolveGenApiOrdersEnabled({ GEN_API_ORDERS_ENABLED: 'false' })).toBe(false);
  });
});
