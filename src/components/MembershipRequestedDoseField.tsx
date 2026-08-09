import {
  REQUESTED_DOSE_DISCLAIMER,
  REQUESTED_DOSE_FIELD_LABEL,
  REQUESTED_DOSE_HINT,
  requestedFormulationOptions,
} from '@/lib/membership/requestedFormulation';

interface MembershipRequestedDoseFieldProps {
  includedFormulations: readonly string[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
}

/** Shared requested-dose selector for membership enrollment (request only). */
export function MembershipRequestedDoseField({
  includedFormulations,
  value,
  onChange,
  id = 'requested-dose',
  disabled = false,
}: MembershipRequestedDoseFieldProps) {
  const options = requestedFormulationOptions(includedFormulations);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">
        {REQUESTED_DOSE_FIELD_LABEL}
      </label>
      <p className="text-xs text-ink-500">{REQUESTED_DOSE_HINT}</p>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="input-lux w-full"
        required
      >
        <option value="" disabled>
          Select a requested dose…
        </option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-ink-500 leading-relaxed">{REQUESTED_DOSE_DISCLAIMER}</p>
    </div>
  );
}
