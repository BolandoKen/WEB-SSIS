import "../styles/TextPopup.css";

function TextPopup({ message, onClose, title = "Oops!" }) {
  return (
    <div className="toast-notification">
      <div className="toast-content">
        <h3 className="toast-title">{title}</h3>
        <p className="toast-message">{message}</p>
      </div>
      <button onClick={onClose} className="toast-close">
        ×
      </button>
    </div>
  );
}

export default TextPopup;