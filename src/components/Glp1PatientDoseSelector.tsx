import {
  GLP1_FORMULATION_OPTIONS,
  PATIENT_DOSE_DISCLAIMER,
  PATIENT_DOSE_FIELD_LABEL,
  PATIENT_DOSE_HINT,
  patientDoseOptions,
  type Glp1FamilyId,
} from '@/lib/glp1/patientRequestedDose';

export function Glp1FormulationSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink-900 mb-2">Formulation</legend>
      <div className="flex flex-wrap gap-2">
        {GLP1_FORMULATION_OPTIONS.map(opt => (
          <button
            key={opt}
            type="button"
            aria-pressed={value === opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-4 py-2 text-sm border transition-colors ${
              value === opt
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Glp1PatientDoseSelector({
  familyId,
  value,
  onChange,
  allowGettingStarted = true,
}: {
  familyId: Glp1FamilyId;
  value: string;
  onChange: (value: string) => void;
  /** Membership only. One-time purchase must choose an actual weekly dose. */
  allowGettingStarted?: boolean;
}) {
  const options = patientDoseOptions(familyId, { allowGettingStarted });
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink-900 mb-2">{PATIENT_DOSE_FIELD_LABEL}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-2 text-sm border transition-colors ${
              value === opt.value
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {allowGettingStarted && (
        <p className="mt-2 text-xs text-ink-500 leading-relaxed">{PATIENT_DOSE_HINT}</p>
      )}
      <p className="mt-1 text-xs text-ink-500 leading-relaxed">{PATIENT_DOSE_DISCLAIMER}</p>
    </fieldset>
  );
}
