import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Heart,
  Activity,
  Zap,
  Shield,
  Layers,
  TrendingUp,
  Stethoscope,
  Award,
  Check,
} from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

const ICON_OPTIONS = [
  { id: 'heart',       label: 'Heart',        Icon: Heart },
  { id: 'activity',    label: 'Pulse / ECG',  Icon: Activity },
  { id: 'zap',         label: 'Arrhythmia',   Icon: Zap },
  { id: 'shield',      label: 'Prevention',   Icon: Shield },
  { id: 'layers',      label: 'Structural',   Icon: Layers },
  { id: 'trending-up', label: 'Hypertension', Icon: TrendingUp },
  { id: 'stethoscope', label: 'Clinical',     Icon: Stethoscope },
  { id: 'award',       label: 'Excellence',   Icon: Award },
];

function getSpecialtyIcon(iconId, size = 18, color) {
  const match = ICON_OPTIONS.find((i) => i.id === (iconId || '').toLowerCase());
  const Component = match ? match.Icon : Heart;
  return <Component size={size} color={color} />;
}

export default function SpecialtiesTab() {
  const { showToast } = useApp();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    color: '#0ea5a0',
    icon: 'heart',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  async function fetchSpecialties() {
    setLoading(true);
    try {
      const data = await api.getSpecialties();
      setSpecialties(data || []);
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load specialties.' });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      title: '',
      shortDesc: '',
      fullDesc: '',
      color: '#0ea5a0',
      icon: 'heart',
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      shortDesc: item.shortDesc || '',
      fullDesc: item.fullDesc || '',
      color: item.color || '#0ea5a0',
      icon: item.icon || 'heart',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title || !formData.shortDesc || !formData.fullDesc) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Title and descriptions are required.' });
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const res = await api.updateSpecialty(id, formData);
        setSpecialties((prev) =>
          prev.map((s) => (s.id === id || s._id === id ? res.data : s))
        );
        showToast({ type: 'success', title: 'Updated', message: 'Specialty updated successfully.' });
      } else {
        const res = await api.createSpecialty(formData);
        setSpecialties((prev) => [...prev, res.data]);
        showToast({ type: 'success', title: 'Created', message: 'New specialty added.' });
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message || 'Failed to save specialty.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteSpecialty(deleteId);
      setSpecialties((prev) => prev.filter((s) => s.id !== deleteId && s._id !== deleteId));
      setDeleteId(null);
      showToast({ type: 'success', title: 'Deleted', message: 'Specialty deleted successfully.' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete specialty.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = specialties.filter(
    (s) =>
      (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.shortDesc || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search specialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
          <Plus size={16} /> Add Specialty
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Specialties ({filtered.length})</h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchSpecialties}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading specialties...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No specialties found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon & Title</th>
                  <th>Short Description</th>
                  <th>Identifier</th>
                  <th>Slug</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: `${item.color || '#0ea5a0'}18`,
                            border: `1px solid ${item.color || '#0ea5a0'}33`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {getSpecialtyIcon(item.icon, 18, item.color || '#0ea5a0')}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.title}</strong>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.shortDesc}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          background: 'var(--clr-bg-2, #eef5fc)',
                          border: '1px solid var(--clr-border, #d5e6f5)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          color: 'var(--clr-primary, #1a6bbd)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.icon || 'heart'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.82rem' }}>{item.slug}</td>
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

      {/* Add / Edit Specialty Modal with Visual Icon Selector */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Specialty' : 'Add New Specialty'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* Row 1: Title and Accent Color */}
            <div className="form-row">
              <div className="form-group">
                <label>Specialty Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pediatric Cardiology"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Accent Color</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    style={{ width: 44, height: 38, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Visual Icon Chips (8 in a single sleek row) */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ margin: 0 }}>Select Icon Identifier *</label>
                <span style={{ fontSize: '0.78rem', color: formData.color, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {getSpecialtyIcon(formData.icon, 15, formData.color)}
                  <strong>{ICON_OPTIONS.find((i) => i.id === formData.icon)?.label || formData.icon}</strong>
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: 6,
                }}
              >
                {ICON_OPTIONS.map((opt) => {
                  const isSelected = (formData.icon || '').toLowerCase() === opt.id;
                  const IconComp = opt.Icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      title={opt.label}
                      onClick={() => setFormData({ ...formData, icon: opt.id })}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        padding: '6px 2px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isSelected ? `2px solid ${formData.color}` : '1px solid var(--clr-border, #d5e6f5)',
                        background: isSelected
                          ? `${formData.color}18`
                          : 'var(--clr-bg, #f8fbff)',
                        color: isSelected ? formData.color : 'var(--clr-text-muted, #5a7899)',
                      }}
                    >
                      <IconComp size={15} color={isSelected ? formData.color : '#5a7899'} />
                      <span style={{ fontSize: '0.62rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {opt.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Short Description */}
            <div className="form-group">
              <label>Short Description (Card summary) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="1-2 sentences for the overview card..."
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                required
              />
            </div>

            {/* Row 4: Full Description (Clinical Details) */}
            <div className="form-group">
              <label>Full Description (Clinical details) *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Comprehensive description of clinical scope..."
                value={formData.fullDesc}
                onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
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
            <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingItem ? 'Update Specialty' : 'Create Specialty'}
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
        title="Delete Specialty"
        message="Are you sure you want to delete this specialty? All procedures assigned to it will also be deleted."
      />
    </div>
  );
}
