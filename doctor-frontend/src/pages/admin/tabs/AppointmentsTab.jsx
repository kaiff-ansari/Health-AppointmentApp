import { useState, useEffect } from 'react';
import { Search, Trash2, CheckCircle2, Clock, XCircle, Calendar, Eye } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';
import AdminModal from '../components/AdminModal';

export default function AppointmentsTab() {
  const { showToast } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus]);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await api.getAppointments(filterStatus === 'All' ? null : filterStatus);
      setAppointments(res.appointments || []);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load appointments.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      if (viewItem && viewItem._id === id) {
        setViewItem(prev => ({ ...prev, status: newStatus }));
      }
      showToast({ type: 'success', title: 'Updated', message: `Status changed to ${newStatus}` });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update status.' });
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteAppointment(deleteId);
      setAppointments(prev => prev.filter(a => a._id !== deleteId));
      if (viewItem && viewItem._id === deleteId) setViewItem(null);
      setDeleteId(null);
      showToast({ type: 'success', title: 'Deleted', message: 'Appointment record deleted.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete appointment.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    return (
      (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.phone || '').toLowerCase().includes(q) ||
      (a.message || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search patient name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              className={`admin-btn admin-btn--sm ${filterStatus === st ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              onClick={() => setFilterStatus(st)}
              style={{ textTransform: 'capitalize' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            Patient Appointments & Inquiries ({filtered.length})
          </h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchAppointments}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading appointments...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No appointments found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact Info</th>
                  <th>Preferred Date</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td>
                      <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.name}</strong>
                    </td>
                    <td>
                      <div>{item.email}</div>
                      <div style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.8rem' }}>{item.phone || 'No phone'}</div>
                    </td>
                    <td>
                      {item.preferredDate ? new Date(item.preferredDate).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : 'Flexible'}
                    </td>
                    <td>
                      <select
                        className={`badge-status badge-status--${item.status || 'pending'}`}
                        value={item.status || 'pending'}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button
                          className="admin-btn admin-btn--secondary admin-btn--icon-only"
                          title="View Full Details"
                          onClick={() => setViewItem(item)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--icon-only"
                          title="Delete"
                          onClick={() => setDeleteId(item._id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Appointment Details Modal */}
      {viewItem && (
        <AdminModal isOpen={true} onClose={() => setViewItem(null)} title="Appointment Details">
          <div className="admin-modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <div className="form-control" style={{ background: 'rgba(255,255,255,0.02)' }}>{viewItem.name}</div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={viewItem.status}
                  onChange={(e) => handleStatusChange(viewItem._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <div className="form-control" style={{ background: 'var(--clr-bg-2, #eef5fc)' }}>{viewItem.email}</div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="form-control" style={{ background: 'var(--clr-bg-2, #eef5fc)' }}>{viewItem.phone || 'N/A'}</div>
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Date</label>
              <div className="form-control" style={{ background: 'var(--clr-bg-2, #eef5fc)' }}>
                {viewItem.preferredDate ? new Date(viewItem.preferredDate).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }) : 'No preferred date requested'}
              </div>
            </div>

            <div className="form-group">
              <label>Symptoms / Message</label>
              <div
                className="form-control"
                style={{ background: 'var(--clr-bg-2, #eef5fc)', minHeight: 90, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
              >
                {viewItem.message}
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button className="admin-btn admin-btn--secondary" onClick={() => setViewItem(null)}>
              Close
            </button>
            <button
              className="admin-btn admin-btn--danger"
              onClick={() => {
                const id = viewItem._id;
                setViewItem(null);
                setDeleteId(id);
              }}
            >
              Delete
            </button>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Appointment"
        message="Are you sure you want to permanently delete this appointment record?"
      />
    </div>
  );
}
