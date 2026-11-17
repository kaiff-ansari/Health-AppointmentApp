import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function TreatmentsTab() {
  const { showToast } = useApp();
  const [procedures, setProcedures] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    specialtyId: 1,
    category: 'Interventional',
    title: '',
    desc: '',
    duration: '1–2 hours',
    recovery: '1–2 days',
    anesthesia: 'Local + sedation',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  async function fetchData() {
    setLoading(true);
    try {
      const [procData, specData] = await Promise.all([
        api.getProcedures(activeCategory === 'All' ? null : activeCategory),
        api.getSpecialties(),
      ]);
      setProcedures(procData || []);
      setSpecialties(specData || []);
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load treatments.' });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      specialtyId: specialties[0]?.id || 1,
      category: activeCategory !== 'All' ? activeCategory : 'Interventional',
      title: '',
      desc: '',
      duration: '1–2 hours',
      recovery: '1–2 days',
      anesthesia: 'Local + sedation',
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      specialtyId: item.specialtyId || 1,
      category: item.category || 'Interventional',
      title: item.title || '',
      desc: item.desc || '',
      duration: item.duration || '',
      recovery: item.recovery || '',
      anesthesia: item.anesthesia || '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title || !formData.desc) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Title and description are required.' });
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const res = await api.updateProcedure(id, formData);
        setProcedures(prev => prev.map(p => (p.id === id || p._id === id) ? res.data : p));
        showToast({ type: 'success', title: 'Updated', message: 'Treatment updated successfully.' });
      } else {
        const res = await api.createProcedure(formData);
        setProcedures(prev => [...prev, res.data]);
        showToast({ type: 'success', title: 'Created', message: 'New treatment procedure added.' });
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message || 'Failed to save treatment.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteProcedure(deleteId);
      setProcedures(prev => prev.filter(p => p.id !== deleteId && p._id !== deleteId));
      setDeleteId(null);
      showToast({ type: 'success', title: 'Deleted', message: 'Treatment deleted successfully.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete treatment.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = procedures.filter(p =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.desc || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search treatments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Interventional', 'Diagnostic', 'Structural', 'Preventive'].map(cat => (
            <button
              key={cat}
              className={`admin-btn admin-btn--sm ${activeCategory === cat ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
            <Plus size={16} /> Add Treatment
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Treatments & Procedures ({filtered.length})</h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchData}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading procedures...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No treatments found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Procedure Title</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Recovery</th>
                  <th>Anesthesia</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id || item.id}>
                    <td>
                      <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.title}</strong>
                      <div style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.8rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.desc}
                      </div>
                    </td>
                    <td>
                      <span className="badge-status badge-status--confirmed">
                        {item.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.duration}</td>
                    <td style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.recovery}</td>
                    <td style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.82rem' }}>{item.anesthesia}</td>
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

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Treatment Procedure' : 'Add New Treatment Procedure'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="form-group">
              <label>Procedure Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Coronary Angioplasty & Stenting"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Interventional">Interventional</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Structural">Structural</option>
                  <option value="Preventive">Preventive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Related Specialty *</label>
                <select
                  className="form-control"
                  value={formData.specialtyId}
                  onChange={(e) => setFormData({ ...formData, specialtyId: Number(e.target.value) })}
                >
                  {specialties.map(s => (
                    <option key={s.id || s._id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Detailed description of what the procedure involves..."
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1–2 hours"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Recovery Time</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1–2 days"
                  value={formData.recovery}
                  onChange={(e) => setFormData({ ...formData, recovery: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Anesthesia</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Local + conscious sedation"
                value={formData.anesthesia}
                onChange={(e) => setFormData({ ...formData, anesthesia: e.target.value })}
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
              {submitting ? 'Saving...' : editingItem ? 'Update Treatment' : 'Create Treatment'}
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
        title="Delete Treatment"
        message="Are you sure you want to delete this treatment procedure?"
      />
    </div>
  );
}
