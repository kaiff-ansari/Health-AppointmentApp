import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, BookOpen, Star } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ArticlesTab() {
  const { showToast } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Prevention',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    featured: false,
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [activeCategory]);

  async function fetchArticles() {
    setLoading(true);
    try {
      const data = await api.getArticles(activeCategory === 'All' ? null : { category: activeCategory });
      setArticles(data || []);
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load articles.' });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      title: '',
      category: activeCategory !== 'All' ? activeCategory : 'Prevention',
      excerpt: '',
      content: '',
      readTime: '5 min read',
      featured: false,
      tags: 'heart health, prevention',
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Prevention',
      excerpt: item.excerpt || '',
      content: item.content || '',
      readTime: item.readTime || '5 min read',
      featured: Boolean(item.featured),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Title, excerpt, and content are required.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id;
        const res = await api.updateArticle(id, payload);
        setArticles(prev => prev.map(a => (a.id === id || a._id === id) ? res.data : a));
        showToast({ type: 'success', title: 'Updated', message: 'Article updated successfully.' });
      } else {
        const res = await api.createArticle(payload);
        setArticles(prev => [res.data, ...prev]);
        showToast({ type: 'success', title: 'Created', message: 'New article published.' });
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message || 'Failed to save article.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.deleteArticle(deleteId);
      setArticles(prev => prev.filter(a => a.id !== deleteId && a._id !== deleteId));
      setDeleteId(null);
      showToast({ type: 'success', title: 'Deleted', message: 'Article deleted successfully.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete article.' });
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = articles.filter(a =>
    (a.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.excerpt || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Prevention', 'Procedures', 'Nutrition', 'Recovery'].map(cat => (
            <button
              key={cat}
              className={`admin-btn admin-btn--sm ${activeCategory === cat ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
            <Plus size={16} /> Publish Article
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Blog Articles ({filtered.length})</h3>
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchArticles}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '24px', textAlign: 'center' }}>Loading articles...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b', padding: '32px', textAlign: 'center' }}>No articles found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Read Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id || item.id}>
                    <td>
                      <strong style={{ color: 'var(--clr-text, #0f1d2e)' }}>{item.title}</strong>
                      <div style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.8rem' }}>/{item.slug}</div>
                    </td>
                    <td>
                      <span className="badge-status badge-status--confirmed">
                        {item.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--clr-text, #0f1d2e)', fontSize: '0.85rem' }}>{item.readTime}</td>
                    <td>
                      {item.featured ? (
                        <span className="badge-status" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                          <Star size={11} fill="#b45309" /> Featured
                        </span>
                      ) : (
                        <span style={{ color: 'var(--clr-text-muted, #5a7899)', fontSize: '0.8rem' }}>Standard</span>
                      )}
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
        title={editingItem ? 'Edit Article' : 'Publish New Article'}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Understanding Blood Pressure: A Complete Guide"
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
                  <option value="Prevention">Prevention</option>
                  <option value="Procedures">Procedures</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Recovery">Recovery</option>
                  <option value="Heart Health">Heart Health</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Read Time</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 5 min read"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Short Excerpt (Teaser) *</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Brief summary displayed on article cards..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Full Content (Markdown or Text) *</label>
              <textarea
                className="form-control"
                rows={6}
                placeholder="Write article content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="prevention, blood pressure, lifestyle"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 18 }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0ea5a0' }}
                  />
                  <span>Feature on Blog Homepage</span>
                </label>
              </div>
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
              {submitting ? 'Publishing...' : editingItem ? 'Update Article' : 'Publish Article'}
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
        title="Delete Article"
        message="Are you sure you want to permanently delete this blog article?"
      />
    </div>
  );
}
