// import { CheckCircle, XCircle, Info } from 'lucide-react';
// import '../CSS/modal.css';

// const icons = {
//   success: <CheckCircle size={40} color="#22c55e" />,
//   error: <XCircle size={40} color="#ef4444" />,
//   info: <Info size={40} color="#2563eb" />
// };

// const Modal = ({
//   isOpen,
//   type = 'info',
//   title,
//   description,
//   primaryText,
//   secondaryText,
//   onPrimary,
//   onSecondary
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-card">
//         <div className="modal-icon">{icons[type]}</div>

//         <h3 className="modal-title">{title}</h3>
//         <p className="modal-description">{description}</p>

//         <div className="modal-actions">
//           {secondaryText && (
//             <button className="btn btn-secondary" onClick={onSecondary}>
//               {secondaryText}
//             </button>
//           )}

//           {primaryText && (
//             <button className="btn btn-primary" onClick={onPrimary}>
//               {primaryText}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import '../CSS/modal.css';

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
          {icon && <div className="modal-icon" style={{backgroundColor: 'red'}}>{ICONS[icon]}</div>}

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
