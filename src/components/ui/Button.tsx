import { cn } from '@/lib/cn'

type ButtonProps = {
  variant?: 'primary' | 'ghost'
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-bg hover:bg-accent-hover',
  ghost: 'border border-border text-text hover:border-accent hover:text-accent',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        'cursor-pointer transition-colors duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
