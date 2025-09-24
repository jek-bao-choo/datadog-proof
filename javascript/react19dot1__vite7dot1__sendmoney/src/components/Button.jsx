function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
  isLoading = false,
  ...props
}) {
  const baseClasses = 'btn'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger'
  }

  const buttonClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    disabled || isLoading ? 'btn-disabled' : '',
    isLoading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...props}
    >
      {isLoading && <span className="btn-spinner"></span>}
      <span className={isLoading ? 'btn-text-loading' : 'btn-text'}>
        {children}
      </span>
    </button>
  )
}

export default Button