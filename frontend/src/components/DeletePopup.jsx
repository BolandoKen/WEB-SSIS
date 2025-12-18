import "../styles/DeletePopup.css";

function DeletePopup({ onClose, onDeleteConfirm, message, confirmText, title}) {
  return (
    <div className="delete-req-overlay">
      <div className="delete-popup">
        <div className="text-section">
          <h3 className="title">{title}</h3>
          <p className="delete-text">
            {message}
          </p>
        </div>

        <div className="action-section">
          <div className="button-section">

            <button
              onClick={onClose}
              className="cancel-button"
              id="delete-cancel-button"
            >
              Cancel
            </button>

            <button
              onClick={onDeleteConfirm}
              className="confirm-button"
              id="delete-confirm-button"
            >
              {confirmText}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
