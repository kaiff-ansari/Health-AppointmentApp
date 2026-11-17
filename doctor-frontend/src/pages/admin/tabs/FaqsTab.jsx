import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, HelpCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function FaqsTab() {
  const { showToast } = useApp();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Heart Health',
    question: '',
    answer: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, [activeCategory]);

  async function fetchFaqs() {
    setLoading(true);
    try {
      const data = await api.getFaqs(activeCategory === 'All' ? null : activeCategory);
      setFaqs(data || []);
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load FAQs.' });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      category: activeCategory !== 'All' ? activeCategory : 'Heart Health',
      question: '',
      answer: '',
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      category: item.category || 'Heart Health',
      question: item.question || '',
      answer: item.answer || '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Question and answer are required.' });
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const res = await api.updateFaq(id, formData);
        setFaqs(prev => prev.map(f => (f.id === id || f._id === id) ? res.data : f));
        showToast({ type: 'success', title: 'Updated', message: 'FAQ updated successfully.' });
      } else {
        const res = await api.createFaq(formData);
        setFaqs(prev => [...prev, res.data]);
        showToast({ type: 'success', title: 'Created', message: 'New FAQ added.' });
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message || 'Failed to save FAQ.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteFaq(deleteId);
      setFaqs(prev => prev.filter(f => f.id !== deleteId && f._id !== deleteId));
      setDeleteId(null);
      showToast({ type: 'success', title: 'Deleted', message: 'FAQ deleted successfully.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete FAQ.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = faqs.filter(f =>
    (f.question || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.answer || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Appointments', 'Procedures', 'Heart Health', 'Emergency'].map(cat => (
            <button
              key={cat}
              className={`admin-btn admin-btn--sm ${activeCategory === cat ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
            <Plus size={16} /> Add FAQ
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <HelpCircle size={20} style={{ color: '#0ea5a0' }} />
            Frequently Asked Questions ({filtered.length})
          </h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchFaqs}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading FAQs...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No FAQs found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Question</th>
                  <th>Category</th>
                  <th style={{ width: '40%' }}>Answer</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id || item.id}>
                    <td>
                      <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.question}</strong>
                    </td>
                    <td>
                      <span className="badge-status badge-status--confirmed">
                        {item.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: 350, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--clr-text, #0f1d2e)' }}>
                      {item.answer}
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

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit FAQ' : 'Add New FAQ'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="form-group">
              <label>Category *</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Appointments">Appointments</option>
                <option value="Procedures">Procedures</option>
                <option value="Heart Health">Heart Health</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label>Question *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. What happens during a coronary angioplasty?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Answer *</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Clear, compassionate explanation for patients..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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
              {submitting ? 'Saving...' : editingItem ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ question?"
      />
    </div>
  );
}
