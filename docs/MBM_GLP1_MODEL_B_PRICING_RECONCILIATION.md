# MBM GLP-1 Model B + Membership Pricing Reconciliation

**Cutover:** `MBM-GLP1-MODEL-B-PRICING`  
**Date:** 2026-08-26  
**Scope:** 22 one-time vial SKUs + 2 membership base prices + 4 membership combo prices.

## Membership shipping architecture

- Base membership excludes customer shipping.
- Two-Day adds $30/month; Next-Day adds $50/month.
- Membership checkout uses one combo recurring Tagada price; it does not append an `MBM-SHIP-*` line.
- One-time carts add the same $30/$50 customer shipping separately.

| Program | Base | Two-Day recurring | Next-Day recurring | Highest-dose one-time + same shipping | Membership savings |
|---|---:|---:|---:|---:|---:|
| Semaglutide | $125 | $155 | $175 | $169 / $189 | $14/month |
| Tirzepatide | $179 | $209 | $229 | $239 / $259 | $30/month |

## Exact Tagada reconciliation

All new prices were appended to existing variants. No products or variants were created. Historical price IDs remain present.

| SKU | Weekly dose(s) / role | Formulation | Product ID | Variant ID | Historical/current price ID | Old cents | New price ID | New cents | Billing | Active |
|---|---|---|---|---|---|---:|---|---:|---|---|
| `MBM-WM-SEM-B12-001` | 0.25 mg | Vitamin B12 | `product_6b750325addf` | `variant_f9ac5ea25184` | `price_e31ac583370d` | 8900 | `price_7ca4c3abc69a` | 10900 | one-time | YES |
| `MBM-WM-SEM-B12-002` | 0.75 / 1 mg | Vitamin B12 | `product_6b750325addf` | `variant_d839f0aab609` | `price_0bf0b622fd45` | 10900 | `price_11ec89ad646a` | 11900 | one-time | YES |
| `MBM-WM-SEM-B12-003` | 1.25 / 1.5 mg | Vitamin B12 | `product_6b750325addf` | `variant_d9dac92d2f71` | `price_3c22af390881` | 10900 | `price_755359fc40cc` | 12900 | one-time | YES |
| `MBM-WM-SEM-B12-005` | 0.5 mg | Vitamin B12 | `product_6b750325addf` | `variant_a726bfe758b3` | `price_1c3c8051e3b5` | 9900 | `price_80723e21469c` | 11900 | one-time | YES |
| `MBM-WM-SEM-B12-006` | 1.75 / 2 mg | Vitamin B12 | `product_6b750325addf` | `variant_23afe7061b26` | `price_013a62e05b77` | 11900 | `price_9dead884531e` | 13900 | one-time | YES |
| `MBM-WM-SEM-GLY-001` | 0.25 mg | Glycine | `product_dcc64482bbbf` | `variant_c51c894cfee6` | `price_74822644bb1f` | 8900 | `price_6c22c5bf103d` | 10900 | one-time | YES |
| `MBM-WM-SEM-GLY-002` | 0.75 / 1 mg | Glycine | `product_dcc64482bbbf` | `variant_398f72f8ca6b` | `price_9113997a5445` | 10900 | `price_18ffbabbc121` | 11900 | one-time | YES |
| `MBM-WM-SEM-GLY-003` | 1.25 / 1.5 mg | Glycine | `product_dcc64482bbbf` | `variant_a71889d8f2e1` | `price_0c321507201f` | 10900 | `price_1499a5df1238` | 12900 | one-time | YES |
| `MBM-WM-SEM-GLY-005` | 0.5 mg | Glycine | `product_dcc64482bbbf` | `variant_1f6e4f4d2cb4` | `price_cea49d485af6` | 9900 | `price_c433061826aa` | 11900 | one-time | YES |
| `MBM-WM-SEM-GLY-006` | 1.75 / 2 mg | Glycine | `product_dcc64482bbbf` | `variant_6db94a24e1ad` | `price_49a9a6e85d5a` | 11900 | `price_a1f4ee6101c1` | 13900 | one-time | YES |
| `MBM-WM-TIR-B12-001` | 2.5 mg | Vitamin B12 | `product_74cd4752c9d6` | `variant_2d96cc588f51` | `price_ed0142289010` | 11900 | `price_296f17fe8611` | 13900 | one-time | YES |
| `MBM-WM-TIR-B12-002` | 7.5 mg | Vitamin B12 | `product_74cd4752c9d6` | `variant_0acda4e3b2d7` | `price_3db063ba334a` | 14900 | `price_4ccf56c8f7e0` | 17900 | one-time | YES |
| `MBM-WM-TIR-B12-003` | 12.5 mg | Vitamin B12 | `product_74cd4752c9d6` | `variant_5e13db7812ee` | `price_fb5946461765` | 16900 | `price_86e638aabe8e` | 19900 | one-time | YES |
| `MBM-WM-TIR-B12-005` | 5 mg | Vitamin B12 | `product_74cd4752c9d6` | `variant_1f1dab8b6177` | `price_ea84cec6ed40` | 13900 | `price_d2f5088bdb5a` | 15900 | one-time | YES |
| `MBM-WM-TIR-B12-006` | 10 mg | Vitamin B12 | `product_74cd4752c9d6` | `variant_dd351c9f2fd1` | `price_e6ef11aa3bd1` | 15900 | `price_6471bd5ade2a` | 18900 | one-time | YES |
| `MBM-WM-TIR-B12-007` | 15 mg | Vitamin B12 | `product_74cd4752c9d6` | `variant_56e8f07d6ab2` | `price_bc09750e5e79` | 17900 | `price_4039f14c59dd` | 20900 | one-time | YES |
| `MBM-WM-TIR-GLY-001` | 2.5 mg | Glycine | `product_861e0edd8ab2` | `variant_ddd60b897d66` | `price_5e4581d60278` | 11900 | `price_4ae8c421cf18` | 13900 | one-time | YES |
| `MBM-WM-TIR-GLY-002` | 7.5 mg | Glycine | `product_861e0edd8ab2` | `variant_b7e1562ee522` | `price_0e41d6b0aeab` | 14900 | `price_993d0d4616fd` | 17900 | one-time | YES |
| `MBM-WM-TIR-GLY-003` | 12.5 mg | Glycine | `product_861e0edd8ab2` | `variant_121e6d8cd921` | `price_9803c9a96da8` | 16900 | `price_7c361359593f` | 19900 | one-time | YES |
| `MBM-WM-TIR-GLY-005` | 5 mg | Glycine | `product_861e0edd8ab2` | `variant_7726800f83dd` | `price_33457ae01ee9` | 13900 | `price_f8f8e7b07150` | 15900 | one-time | YES |
| `MBM-WM-TIR-GLY-006` | 10 mg | Glycine | `product_861e0edd8ab2` | `variant_57cd2414aabf` | `price_2a8c8629ae5c` | 15900 | `price_b4a459a9223c` | 18900 | one-time | YES |
| `MBM-WM-TIR-GLY-007` | 15 mg | Glycine | `product_861e0edd8ab2` | `variant_1446f75121d7` | `price_5bcb6c9f666c` | 17900 | `price_0f7eac35ed15` | 20900 | one-time | YES |
| `MBM-MEM-SEM-MEM-001` | base membership | Program | `product_e5fe772b62d6` | `variant_6973906c4bd6` | `price_344d3dacb4ab` | 14900 | `price_307f4d84658d` | 12500 | recurring | YES |
| `MBM-MEM-SEM-MEM-001` | base + Two-Day | Program | `product_e5fe772b62d6` | `variant_6973906c4bd6` | `price_344d3dacb4ab` | 14900 | `price_f89402dcbe76` | 15500 | recurring | YES |
| `MBM-MEM-SEM-MEM-001` | base + Next-Day | Program | `product_e5fe772b62d6` | `variant_6973906c4bd6` | `price_344d3dacb4ab` | 14900 | `price_fc83af356019` | 17500 | recurring | YES |
| `MBM-MEM-TIR-MEM-001` | base membership | Program | `product_8b3bfb6614c4` | `variant_b3890c799e09` | `price_2d2dd07b2f73` | 27500 | `price_321bc7a3ea7e` | 17900 | recurring | YES |
| `MBM-MEM-TIR-MEM-001` | base + Two-Day | Program | `product_8b3bfb6614c4` | `variant_b3890c799e09` | `price_2d2dd07b2f73` | 27500 | `price_dd3f65ebcee2` | 20900 | recurring | YES |
| `MBM-MEM-TIR-MEM-001` | base + Next-Day | Program | `product_8b3bfb6614c4` | `variant_b3890c799e09` | `price_2d2dd07b2f73` | 27500 | `price_da1063335965` | 22900 | recurring | YES |

## Safety status

```text
TAGADA PRODUCTS CREATED: 0
TAGADA VARIANTS CREATED: 0
TAGADA PRICES APPENDED: 28
HISTORICAL PRICE OBJECTS DELETED: 0
GEN CHANGED: NO
FULFILLMENT ROUTING CHANGED: NO
PROVIDER PRICING CHANGED: NO
REAL PAYMENT: NO
```
