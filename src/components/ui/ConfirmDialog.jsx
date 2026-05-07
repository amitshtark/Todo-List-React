import { useUIStore } from '../../store/uiStore.js';
import useUIStoreDefault from '../../store/uiStore.js';

function ConfirmDialog({ name = 'deleteConfirm', onConfirm, title = 'Delete item', description = 'This action cannot be undone.' }) {
  const { modals, closeModal } = useUIStoreDefault();
  const isOpen = modals[name];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: 'var(--color-error)' }}>{title}</h2>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{description}</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-ghost"
              onClick={() => closeModal(name)}
              id="confirm-cancel-btn"
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => { onConfirm?.(); closeModal(name); }}
              id="confirm-delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
