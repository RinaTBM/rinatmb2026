import { useMemo, useState } from 'react';
import type { ClinicalFormField, ClinicalFormSchema } from '@/lib/genHealth/clinicalDomain';
import { validateFormAnswers, type FormAnswerMap } from '@/lib/genHealth/genForms';

type Props = {
  schema: ClinicalFormSchema;
  /** Submit via authenticated MBM Edge — never GEN directly. */
  onSubmit: (answers: FormAnswerMap) => Promise<void>;
  submitting?: boolean;
};

/**
 * MyBareMethod-branded clinical form renderer (Phase 12I.5).
 * Does not show GEN branding. Does not store answers in localStorage.
 */
export function ClinicalFormRenderer({ schema, onSubmit, submitting }: Props) {
  const [answers, setAnswers] = useState<FormAnswerMap>({});
  const [error, setError] = useState<string | null>(null);
  const [unsupportedBlocked, setUnsupportedBlocked] = useState(false);

  const requiredUnsupported = useMemo(
    () => schema.fields.filter((f) => f.unsupported && f.required),
    [schema.fields],
  );

  const setValue = (id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (requiredUnsupported.length) {
      setUnsupportedBlocked(true);
      setError(
        'A required health question cannot be displayed yet. Please contact support — do not skip it.',
      );
      return;
    }
    const v = validateFormAnswers(schema, answers);
    if (!v.ok) {
      setError(v.message);
      return;
    }
    try {
      await onSubmit(answers);
    } catch {
      setError('We could not submit your health information. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cream-300 bg-white p-5 md:p-6 space-y-4"
      data-testid="clinical-form-renderer"
    >
      <div>
        <h3 className="font-serif text-2xl text-ink-900">
          {schema.title || 'Health Information'}
        </h3>
        <p className="text-sm text-ink-500 mt-1">
          Complete this information so your care team can review your order. Your answers are
          submitted securely through My Bare Method.
        </p>
      </div>

      {schema.fields.map((field) => (
        <FieldControl key={field.id} field={field} value={answers[field.id]} onChange={setValue} />
      ))}

      {error && (
        <p className="rounded-lg bg-red-50 text-red-700 text-sm p-3" role="alert">
          {error}
        </p>
      )}
      {unsupportedBlocked && (
        <p className="text-xs text-ink-500">
          Required question type is not supported in this version of the form. Support has been
          notified via this message — please contact us.
        </p>
      )}

      <button
        type="submit"
        className="btn-primary w-full py-3 disabled:opacity-50"
        disabled={!!submitting}
      >
        {submitting ? 'Submitting…' : 'Submit Health Information'}
      </button>
    </form>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: ClinicalFormField;
  value: unknown;
  onChange: (id: string, value: unknown) => void;
}) {
  if (field.unsupported) {
    return (
      <div
        className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"
        data-unsupported-field={field.id}
      >
        <p className="font-medium">{field.label}</p>
        <p className="mt-1 text-amber-800">
          This question uses a control we cannot display yet
          {field.rawType ? ` (${field.rawType})` : ''}.
          {field.required ? ' It is required — please contact support.' : ''}
        </p>
      </div>
    );
  }

  const label = (
    <label className="block text-sm font-medium text-ink-900 mb-1.5" htmlFor={field.id}>
      {field.label}
      {field.required ? <span className="text-red-600"> *</span> : null}
    </label>
  );

  const help = field.helpText ? (
    <p className="text-xs text-ink-500 mt-1">{field.helpText}</p>
  ) : null;

  if (field.type === 'textarea') {
    return (
      <div>
        {label}
        <textarea
          id={field.id}
          className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          rows={4}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          required={field.required}
        />
        {help}
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div>
        {label}
        <input
          id={field.id}
          type="number"
          className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          value={value == null ? '' : String(value)}
          onChange={(e) => onChange(field.id, e.target.value === '' ? '' : Number(e.target.value))}
          required={field.required}
        />
        {help}
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div>
        {label}
        <input
          id={field.id}
          type="date"
          className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          required={field.required}
        />
        {help}
      </div>
    );
  }

  if (field.type === 'boolean' || field.type === 'checkbox' || field.type === 'acknowledgment') {
    return (
      <div className="flex items-start gap-2">
        <input
          id={field.id}
          type="checkbox"
          className="mt-1"
          checked={value === true}
          onChange={(e) => onChange(field.id, e.target.checked)}
          required={field.required}
        />
        <div>
          <label htmlFor={field.id} className="text-sm text-ink-900">
            {field.label}
            {field.required ? <span className="text-red-600"> *</span> : null}
          </label>
          {help}
        </div>
      </div>
    );
  }

  if (field.type === 'select' || field.type === 'radio') {
    return (
      <div>
        {label}
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-ink-800">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(field.id, opt.value)}
                required={field.required}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {help}
      </div>
    );
  }

  if (field.type === 'multi_select') {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div>
        {label}
        <div className="space-y-2">
          {(field.options || []).map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-ink-800">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selected.filter((v) => v !== opt.value)
                      : [...selected, opt.value];
                    onChange(field.id, next);
                  }}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {help}
      </div>
    );
  }

  if (field.type === 'file') {
    return (
      <div>
        {label}
        <p className="text-sm text-ink-500 rounded-xl border border-dashed border-ink-200 p-3">
          Secure document upload will be available when your care team requests it. File contents
          are never stored in browser storage.
        </p>
        {help}
      </div>
    );
  }

  // text default
  return (
    <div>
      {label}
      <input
        id={field.id}
        type="text"
        className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(field.id, e.target.value)}
        required={field.required}
      />
      {help}
    </div>
  );
}
