import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ReviewsTab() {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    condition: '',
    rating: 5,
    review: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const data = await api.getReviews();
      setReviews(data || []);
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load reviews.' });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      name: '',
      age: '',
      condition: '',
      rating: 5,
      review: '',
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      age: item.age || '',
      condition: item.condition || '',
      rating: item.rating || 5,
      review: item.review || '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.condition || !formData.review) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Name, condition, and review are required.' });
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const res = await api.updateReview(id, formData);
        setReviews(prev => prev.map(r => (r.id === id || r._id === id) ? res.data : r));
        showToast({ type: 'success', title: 'Updated', message: 'Review updated successfully.' });
      } else {
        const res = await api.createReview(formData);
        setReviews(prev => [...prev, res.data]);
        showToast({ type: 'success', title: 'Created', message: 'New patient review added.' });
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message || 'Failed to save review.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteReview(deleteId);
      setReviews(prev => prev.filter(r => r.id !== deleteId && r._id !== deleteId));
      setDeleteId(null);
      showToast({ type: 'success', title: 'Deleted', message: 'Review deleted successfully.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete review.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = reviews.filter(r =>
    (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.condition || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.review || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search patient reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
          <Plus size={16} /> Add Review
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Patient Testimonials ({filtered.length})</h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchReviews}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading reviews...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No reviews found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Rating</th>
                  <th>Review Excerpt</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id || item.id}>
                    <td>
                      <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.name}</strong>
                      {item.age && <span style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.8rem' }}> ({item.age} yrs)</span>}
                    </td>
                    <td>
                      <span className="badge-status badge-status--confirmed">
                        {item.condition}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                        <Star size={14} fill="#f59e0b" />
                        <span style={{ fontWeight: 600 }}>{item.rating}.0</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 350, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.review}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button
                          className="admin-btn admin-btn--secondary admin-btn--icon-only"
                          title="Edit"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--icon-only"
                          title="Delete"
                          onClick={() => setDeleteId(item.id || item._id)}
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

      {/* Add / Edit Review Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Review' : 'Add New Review'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 58"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cardiac Condition *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Coronary Angioplasty"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Star Rating (1 - 5) *</label>
                <select
                  className="form-control"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                  <option value={2}>2 Stars (Fair)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Patient Testimonial *</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="What the patient shared about their care experience..."
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update Review' : 'Create Review'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Review"
        message="Are you sure you want to permanently delete this patient review?"
      />
    </div>
  );
}
