import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary:
    'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button {...props} className={classes} />
}
