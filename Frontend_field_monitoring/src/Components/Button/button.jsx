import './button.css';

const Button = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  otherStyles = {},
  icon,
  iconPosition = 'left',
  iconOnly = false,
  ariaLabel
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={otherStyles}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${iconOnly ? 'btn-icon-only' : ''}`}
      aria-label={iconOnly ? ariaLabel || text : undefined}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">
          {icon}
        </span>
      )}
      
      {!iconOnly && text}
      
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;