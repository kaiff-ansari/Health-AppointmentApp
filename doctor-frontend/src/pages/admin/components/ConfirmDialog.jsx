import { AlertTriangle } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Deletion', message = 'Are you sure you want to delete this item? This action cannot be undone.', loading = false }) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div className="admin-modal-body" style={{ textAlign: 'center', alignItems: 'center' }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <AlertTriangle size={28} />
        </div>
        <p style={{ margin: 0, color: 'var(--clr-text, #0f1d2e)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
      <div className="admin-modal-footer">
        <button className="admin-btn admin-btn--secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="admin-btn admin-btn--danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </AdminModal>
  );
}
