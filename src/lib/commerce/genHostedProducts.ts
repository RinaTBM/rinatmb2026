export type GenHostedProductOption = {
  label: string;
  price: number;
  genClientProductId: string;
};

export type GenHostedProductRoute = {
  price: number;
  genClientProductId: string;
  options?: readonly GenHostedProductOption[];
};

export const GEN_HOSTED_PRODUCTS: Record<string, GenHostedProductRoute> = {
  'aod-9604': { price: 179, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_PRIG7DYPNNgco3lGf1zx' },
  'fat-burner': { price: 199, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_KXMm9SsbOEYnFy9phmZn' },
  'metabolic-triple': { price: 219, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_yearpPaLo5H0k0FU5Ej8' },
  'nad-plus': {
    price: 139,
    genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
    options: [
      {
        label: 'Injection',
        price: 139,
        genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_SHJpGAACUFEeMONdpEbn',
      },
      {
        label: 'Nasal Spray',
        price: 79,
        genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_FVwkzvQqWIZRNAwbslGw',
      },
    ],
  },
  'bpc-157': { price: 199, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_7Kix55LA15U0lNvY9QXI' },
  'estradiol-patch': { price: 129, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_o7dNtf9QsnEqPCrLr2tR' },
  'tretinoin-cream': { price: 79, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_EeWMcfCJf5EU2LkNQmp9' },
  'ghk-cu-minoxidil': { price: 69, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_489YrehNXRlL77fYPkOn' },
  'minoxidil-topical': { price: 79, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_Raw7mUkuzzhVdAo88jpL' },
  'ondansetron-odt': { price: 59, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_4ZWsN26iLt5ZpiLS1HCC' },
  'tesamorelin': { price: 269, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_2cYxVfvwpWyyrANZx06G' },
  'progesterone-capsules': { price: 59, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_5dGkjdpLP7DkKKE2iVxh' },
  'recovery-stack': { price: 159, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_MXsSZY2GpiCByJUQer1p' },
  'selank-semax-nasal-spray': { price: 149, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_LWkYtwm66dIeLuDSvSfi' },
  'testosterone-cream': { price: 89, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_AVNvVWBE98DfINxyz5Dm' },
  'scream-cream': { price: 129, genClientProductId: 'f5e0mdyBYnDh7HGvek0C_MoDyAcICE5RDa4DfaeBX_llc4XwX8XjHashrkv74r' },
};
