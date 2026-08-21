/**
 * Phase 12I.5 — GEN product form schema normalization + white-label form helpers.
 * GEN forms remain clinical source of truth. Unknown field types fail gracefully.
 */

import type { ClinicalFormField, ClinicalFormFieldType, ClinicalFormSchema } from './clinicalDomain';

const SUPPORTED: Record<string, ClinicalFormFieldType> = {
  text: 'text',
  string: 'text',
  textarea: 'textarea',
  long_text: 'textarea',
  number: 'number',
  integer: 'number',
  float: 'number',
  date: 'date',
  select: 'select',
  dropdown: 'select',
  multi_select: 'multi_select',
  multiselect: 'multi_select',
  checkbox_group: 'multi_select',
  radio: 'radio',
  checkbox: 'checkbox',
  boolean: 'boolean',
  bool: 'boolean',
  file: 'file',
  upload: 'file',
  acknowledgment: 'acknowledgment',
  acknowledge: 'acknowledgment',
  consent: 'acknowledgment',
};

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export function mapGenFieldType(raw: string | null | undefined): {
  type: ClinicalFormFieldType;
  unsupported: boolean;
} {
  if (!raw) return { type: 'unknown', unsupported: true };
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  const mapped = SUPPORTED[key];
  if (mapped) return { type: mapped, unsupported: false };
  return { type: 'unknown', unsupported: true };
}

export function normalizeClinicalFormField(raw: unknown, index: number): ClinicalFormField {
  const r = asRecord(raw) || {};
  const id =
    asString(r.id) ||
    asString(r.key) ||
    asString(r.name) ||
    asString(r.fieldId) ||
    `field_${index}`;
  const rawType = asString(r.type) || asString(r.inputType) || asString(r.control) || null;
  const mapped = mapGenFieldType(rawType);
  const label =
    asString(r.label) ||
    asString(r.title) ||
    asString(r.question) ||
    asString(r.name) ||
    'Required question';
  const required = r.required === true || r.isRequired === true || r.mandatory === true;
  const optionsRaw = Array.isArray(r.options)
    ? r.options
    : Array.isArray(r.choices)
      ? r.choices
      : [];
  const options = optionsRaw
    .map((o) => {
      if (typeof o === 'string') return { value: o, label: o };
      const or = asRecord(o);
      if (!or) return null;
      const value = asString(or.value) || asString(or.id) || asString(or.label);
      const olabel = asString(or.label) || value;
      if (!value || !olabel) return null;
      return { value, label: olabel };
    })
    .filter(Boolean) as Array<{ value: string; label: string }>;

  return {
    id,
    type: mapped.type,
    label,
    required,
    options: options.length ? options : undefined,
    helpText: asString(r.helpText) || asString(r.description) || asString(r.hint) || undefined,
    unsupported: mapped.unsupported,
    rawType: rawType || undefined,
  };
}

/**
 * Normalize GEN product forms response into MBM ClinicalFormSchema[].
 * Never invent questions. Unknown controls marked unsupported.
 */
export function normalizeProductFormsResponse(
  raw: unknown,
  productId?: string,
): ClinicalFormSchema[] {
  const root = asRecord(raw) || {};
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(root.forms)
      ? root.forms
      : Array.isArray(root.data)
        ? root.data
        : root.form
          ? [root.form]
          : [];

  return list.map((form, fi) => {
    const f = asRecord(form) || {};
    const formId = asString(f.id) || asString(f.formId) || `form_${fi}`;
    const fieldsRaw = Array.isArray(f.fields)
      ? f.fields
      : Array.isArray(f.questions)
        ? f.questions
        : Array.isArray(f.schema)
          ? f.schema
          : [];
    return {
      formId,
      title: asString(f.title) || asString(f.name) || undefined,
      productId: productId || asString(f.productId) || undefined,
      fields: fieldsRaw.map((field, i) => normalizeClinicalFormField(field, i)),
    };
  });
}

export type FormAnswerMap = Record<string, unknown>;

/**
 * Validate answers against schema before server submit.
 * Does not log answer values.
 */
export function validateFormAnswers(
  schema: ClinicalFormSchema,
  answers: FormAnswerMap,
): { ok: true } | { ok: false; code: 'GEN_UNKNOWN_FIELD' | 'GEN_FORM_SUBMIT_ERROR'; message: string; fieldId?: string } {
  for (const field of schema.fields) {
    if (field.unsupported && field.required) {
      return {
        ok: false,
        code: 'GEN_UNKNOWN_FIELD',
        message: 'A required health question uses an unsupported control. Please contact support.',
        fieldId: field.id,
      };
    }
    if (!field.required) continue;
    const v = answers[field.id];
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) {
      return {
        ok: false,
        code: 'GEN_FORM_SUBMIT_ERROR',
        message: 'Please complete all required health information.',
        fieldId: field.id,
      };
    }
  }
  return { ok: true };
}

/** Customer-safe labels for required action categories (no GEN jargon). */
export function customerActionLabel(category: string | null | undefined): string {
  const c = (category || '').toUpperCase();
  if (c === 'FORM' || c === 'FORMS') return 'Complete Health Information';
  if (c === 'UPLOAD' || c === 'UPLOADS') return 'Upload Required Information';
  if (c === 'VISIT' || c === 'SCHEDULING') return 'Schedule Required Visit';
  if (c === 'LAB' || c === 'LABS') return 'Complete Lab Requirement';
  if (c === 'IDENTITY') return 'Verify Identity';
  if (c.includes('CONTINUATION') || c === 'PATIENT_CONTINUATION') return 'Continue Clinical Review';
  return 'Continue Clinical Review';
}
