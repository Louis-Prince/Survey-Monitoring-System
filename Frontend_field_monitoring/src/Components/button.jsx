import '../CSS/button.css';

const Button = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  otherStyles = {}
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={otherStyles}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
    >
      {text}
    </button>
  );
};

export default Button;
