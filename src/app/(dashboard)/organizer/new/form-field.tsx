import type { UseFormRegisterReturn } from 'react-hook-form'

type FormFieldProps = {
  label: string
  type?: string
  step?: string
  error?: { message?: string }
  registration: UseFormRegisterReturn
}

export function FormField({ label, type = 'text', step, error, registration }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={registration.name} className="text-sm text-text-muted">
        {label}
      </label>
      <input
        id={registration.name}
        type={type}
        step={step}
        aria-invalid={error ? 'true' : 'false'}
        {...registration}
        className="rounded-md border border-border bg-surface px-3 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      {error?.message && (
        <p role="alert" className="text-sm text-red-400">
          {error.message}
        </p>
      )}
    </div>
  )
}
