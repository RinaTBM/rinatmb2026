/* Catalog validation CLI — `npm run catalog:validate`. No secrets, no network. */
import { validateCatalog } from '../src/lib/catalog/validate';
import { syncableProducts, syncableMemberships, catalogProducts, catalogMemberships } from '../src/lib/catalog/catalog';

const { errors, warnings } = validateCatalog();

console.log('Catalog validation');
console.log('==================');
console.log(`Products: ${catalogProducts.length} total, ${syncableProducts().length} syncable (active + visible)`);
console.log(`Memberships: ${catalogMemberships.length} total, ${syncableMemberships().length} syncable`);
console.log('');

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`  ! ${w}`));
  console.log('');
}

if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log('\nVALIDATION FAILED');
  process.exit(1);
}

console.log('VALIDATION PASSED — no errors.');
