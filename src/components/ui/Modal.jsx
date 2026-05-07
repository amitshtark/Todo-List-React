import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import useUIStore from '../../store/uiStore.js';

function Modal({ name, title, children, size = 'md', onClose }) {
  const { modals, closeModal } = useUIStore();
  const isOpen = modals[name];
  const overlayRef = useRef(null);

  const handleClose = () => {
    if (onClose) onClose();
    closeModal(name);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: '420px',
    md: '580px',
    lg: '760px',
    xl: '960px',
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="modal-content"
        style={{ maxWidth: sizeMap[size] || sizeMap.md }}
      >
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              className="modal-close-btn"
              onClick={handleClose}
              aria-label="Close modal"
              id="modal-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
