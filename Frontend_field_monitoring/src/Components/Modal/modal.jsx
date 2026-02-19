import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import './modal.css';

const ICONS = {
  success: <CheckCircle size={40} color="#22c55e" />,
  error: <XCircle size={40} color="#ef4444" />,
  info: <Info size={40} color="#2563eb" />
};

const Modal = ({
  isOpen,
  title = 'Success',
  message = '',
  icon = '',
  iconClose = false,
  buttons = [],
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {iconClose && (
          <button className="modal-close" onClick={onClose}>
            <X size={15} />
          </button>
        )}

        <div className="modal-content">
          {icon && <div className="modal-icon" style={{backgroundColor: ''}}>{ICONS[icon]}</div>}

          <p className="modal-title">{title}</p>
          <p className="modal-message">{message}</p>
        </div>

        {buttons.length > 0 && (
          <div className="modal-actions">
            {buttons.map((btn, index) => (
              <button
                key={index}
                className={`btn ${btn.style}`}
                onClick={btn.action}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
