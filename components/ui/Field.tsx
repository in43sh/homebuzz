/** A labelled form field with an optional hint and an announced error. */
export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  /** Field name; the error element's id is `${id}-error`. */
  id: string;
  label: string;
  error?: string;
  /** A requirement shown before the user submits, so it is never a surprise. */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink-900">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      {error && (
        <span
          id={`${id}-error`}
          role="alert"
          className="mt-1 block text-sm text-red-600"
        >
          {error}
        </span>
      )}
    </label>
  );
}
