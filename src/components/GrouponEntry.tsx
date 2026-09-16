import { Link } from '@/router';
import { useState } from 'react';
import { GrouponPage } from '@/pages/GrouponPage';

export function GrouponEntry({ onOpen }: { onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  return <div className="mt-4 border-t border-cream-300 pt-4 text-sm text-ink-600">
    <p>Purchased through Groupon?</p>
    <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)} className="mt-1 inline-block font-medium text-gold-800 underline underline-offset-4">Redeem Groupon Voucher</button>
    {open && <><GrouponPage embedded /><Link to="/groupon" onClick={onOpen} className="text-xs underline">Open full redemption page</Link></>}
  </div>;
}
