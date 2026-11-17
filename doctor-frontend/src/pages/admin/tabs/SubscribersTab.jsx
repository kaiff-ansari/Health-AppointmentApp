import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function SubscribersTab() {
  const { showToast } = useApp();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const res = await api.getSubscribers();
      setSubscribers(res || []);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load newsletter subscribers.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteSubscriber(deleteId);
      setSubscribers(prev => prev.filter(s => s._id !== deleteId));
      setDeleteId(null);
      showToast({ type: 'success', title: 'Removed', message: 'Subscriber removed successfully.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to remove subscriber.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = subscribers.filter(s =>
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Mail size={20} style={{ color: '#0ea5a0' }} />
            Newsletter Subscribers ({filtered.length})
          </h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchSubscribers}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading subscribers...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No subscribers found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Status</th>
                  <th>Subscribed Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td>
                      <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.email}</strong>
                    </td>
                    <td>
                      <span className="badge-status badge-status--completed">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.85rem' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--icon-only"
                        title="Remove Subscriber"
                        onClick={() => setDeleteId(item._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Remove Subscriber"
        message="Are you sure you want to remove this subscriber from the mailing list?"
      />
    </div>
  );
}
