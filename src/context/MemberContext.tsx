import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type MembershipProgram = 'semaglutide' | 'tirzepatide';

export interface ActiveMembershipState {
  /** Customer currently has an Active Wellness Membership. */
  isActiveMember: boolean;
  program: MembershipProgram | null;
  checkoutProductId: 'm1' | 'm2' | null;
  displayName: string | null;
  renewalDate: string | null;
  status: 'active' | 'none';
}

interface MemberContextValue extends ActiveMembershipState {
  activateMembership: (input: {
    program: MembershipProgram;
    checkoutProductId: 'm1' | 'm2';
    displayName: string;
    renewalDate?: string;
  }) => void;
  clearMembership: () => void;
  /** Demo/testing helper — toggles active member state for UI verification. */
  setDemoActiveMember: (active: boolean, program?: MembershipProgram) => void;
}

const STORAGE_KEY = 'mybaremethod_active_membership';

const empty: ActiveMembershipState = {
  isActiveMember: false,
  program: null,
  checkoutProductId: null,
  displayName: null,
  renewalDate: null,
  status: 'none',
};

const MemberContext = createContext<MemberContextValue | null>(null);

function nextMonthIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export function MemberProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ActiveMembershipState>(empty);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const activateMembership: MemberContextValue['activateMembership'] = input => {
    setState({
      isActiveMember: true,
      program: input.program,
      checkoutProductId: input.checkoutProductId,
      displayName: input.displayName,
      renewalDate: input.renewalDate ?? nextMonthIso(),
      status: 'active',
    });
  };

  const clearMembership = () => setState(empty);

  const setDemoActiveMember: MemberContextValue['setDemoActiveMember'] = (active, program = 'tirzepatide') => {
    if (!active) {
      clearMembership();
      return;
    }
    activateMembership({
      program,
      checkoutProductId: program === 'semaglutide' ? 'm1' : 'm2',
      displayName: program === 'semaglutide' ? 'Semaglutide Membership' : 'Tirzepatide Membership',
    });
  };

  return (
    <MemberContext.Provider
      value={{
        ...state,
        activateMembership,
        clearMembership,
        setDemoActiveMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used within MemberProvider');
  return ctx;
}
