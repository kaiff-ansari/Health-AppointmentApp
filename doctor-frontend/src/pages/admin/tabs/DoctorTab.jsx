import { useState, useEffect } from 'react';
import { Save, User, Phone, Mail, MapPin, Clock, Award, Shield, Share2, Plus, Trash2, Heart, Sparkles, Milestone } from 'lucide-react';
import { api } from '../../../services/api';
import { useApp } from '../../../context/AppContext';

export default function DoctorTab() {
  const { showToast, setDoctor } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    specialty: '',
    tagline: '',
    bio: '',
    shortBio: '',
    mission: '',
    quote: '',
    phone: '',
    email: '',
    address: '',
    training: 'AIIMS New Delhi + Cleveland Clinic',
    workingHours: [
      { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
      { day: 'Saturday', time: '9:00 AM – 2:00 PM' },
      { day: 'Sunday', time: 'Emergency Only' },
    ],
    stats: [
      { label: 'Years Experience', value: '18+', icon: 'award' },
      { label: 'Patients Treated', value: '12,000+', icon: 'users' },
      { label: 'Procedures Done', value: '5,000+', icon: 'activity' },
      { label: 'Awards Won', value: '24', icon: 'award' },
    ],
    socials: {
      linkedin: '',
      twitter: '',
      instagram: '',
      youtube: '',
    },
    values: [
      { icon: 'heart', title: 'Patient First', desc: "Every decision is made with the patient's best interest at heart — always." },
      { icon: 'shield', title: 'Evidence-Based Care', desc: 'Treatment plans grounded in the latest clinical research and guidelines.' },
      { icon: 'zap', title: 'Innovation', desc: 'Leveraging the most advanced cardiac technologies available in India.' },
      { icon: 'users', title: 'Holistic Approach', desc: 'Treating the whole person — mind, body, and lifestyle — not just symptoms.' },
    ],
    milestones: [
      { year: '2000', title: 'MBBS — AIIMS New Delhi', desc: "Graduated with distinction from India's premier medical institution." },
      { year: '2004', title: 'MD Internal Medicine — AIIMS', desc: 'Post-graduation with a focus on cardiovascular medicine.' },
      { year: '2007', title: 'DM Cardiology — PGIMER', desc: 'Super-specialization in clinical and interventional cardiology.' },
      { year: '2009', title: 'Fellowship — Cleveland Clinic', desc: 'Advanced interventional cardiology fellowship in the USA.' },
      { year: '2010', title: 'Returned to India', desc: 'Established cardiac practice in Gurugram, bringing world-class care home.' },
      { year: '2026', title: 'Present — Medicity Heart Centre', desc: '18+ years, 12,000+ patients, 5,000+ procedures, 24 national awards.' },
    ],
  });

  useEffect(() => {
    fetchDoctor();
  }, []);

  async function fetchDoctor() {
    setLoading(true);
    try {
      const data = await api.getDoctor();
      if (data) {
        setFormData({
          name: data.name || '',
          title: data.title || '',
          specialty: data.specialty || '',
          tagline: data.tagline || '',
          bio: data.bio || '',
          shortBio: data.shortBio || '',
          mission: data.mission || '',
          quote: data.quote || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          training: data.training || 'AIIMS New Delhi + Cleveland Clinic',
          workingHours: data.workingHours && data.workingHours.length ? data.workingHours : [
            { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
            { day: 'Saturday', time: '9:00 AM – 2:00 PM' },
            { day: 'Sunday', time: 'Emergency Only' },
          ],
          stats: data.stats && data.stats.length ? data.stats : [
            { label: 'Years Experience', value: '18+', icon: 'award' },
            { label: 'Patients Treated', value: '12,000+', icon: 'users' },
            { label: 'Procedures Done', value: '5,000+', icon: 'activity' },
          ],
          socials: {
            linkedin: data.socials?.linkedin || '',
            twitter: data.socials?.twitter || '',
            instagram: data.socials?.instagram || '',
            youtube: data.socials?.youtube || '',
          },
          values: data.values && data.values.length ? data.values : [
            { icon: 'heart', title: 'Patient First', desc: "Every decision is made with the patient's best interest at heart — always." },
            { icon: 'shield', title: 'Evidence-Based Care', desc: 'Treatment plans grounded in the latest clinical research and guidelines.' },
            { icon: 'zap', title: 'Innovation', desc: 'Leveraging the most advanced cardiac technologies available in India.' },
            { icon: 'users', title: 'Holistic Approach', desc: 'Treating the whole person — mind, body, and lifestyle — not just symptoms.' },
          ],
          milestones: data.milestones && data.milestones.length ? data.milestones : [
            { year: '2000', title: 'MBBS — AIIMS New Delhi', desc: "Graduated with distinction from India's premier medical institution." },
            { year: '2004', title: 'MD Internal Medicine — AIIMS', desc: 'Post-graduation with a focus on cardiovascular medicine.' },
            { year: '2007', title: 'DM Cardiology — PGIMER', desc: 'Super-specialization in clinical and interventional cardiology.' },
            { year: '2009', title: 'Fellowship — Cleveland Clinic', desc: 'Advanced interventional cardiology fellowship in the USA.' },
            { year: '2010', title: 'Returned to India', desc: 'Established cardiac practice in Gurugram, bringing world-class care home.' },
            { year: '2026', title: 'Present — Medicity Heart Centre', desc: '18+ years, 12,000+ patients, 5,000+ procedures, 24 national awards.' },
          ],
        });
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load doctor profile.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateDoctor(formData);
      if (res?.data) {
        setDoctor(res.data);
      } else {
        setDoctor({ ...formData });
      }
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Doctor profile changes have been saved to the database.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Unable to update doctor profile.',
      });
    } finally {
      setSaving(false);
    }
  }

  function handleHoursChange(index, field, value) {
    const next = [...formData.workingHours];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, workingHours: next });
  }

  function handleAddHourRow() {
    setFormData((prev) => ({
      ...prev,
      workingHours: [...prev.workingHours, { day: '', time: '' }],
    }));
  }

  function handleRemoveHourRow(index) {
    if (formData.workingHours.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, idx) => idx !== index),
    }));
  }

  function handleSocialChange(platform, value) {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  }

  function handleStatsChange(index, field, value) {
    const next = [...formData.stats];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, stats: next });
  }

  function handleValueChange(index, field, value) {
    const next = [...formData.values];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, values: next });
  }

  function handleAddValueRow() {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, { icon: 'heart', title: '', desc: '' }],
    }));
  }

  function handleRemoveValueRow(index) {
    if (formData.values.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, idx) => idx !== index),
    }));
  }

  function handleMilestoneChange(index, field, value) {
    const next = [...formData.milestones];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, milestones: next });
  }

  function handleAddMilestoneRow() {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { year: '', title: '', desc: '' }],
    }));
  }

  function handleRemoveMilestoneRow(index) {
    if (formData.milestones.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, idx) => idx !== index),
    }));
  }

  if (loading) {
    return <p style={{ color: '#94a3b8', padding: '32px', textAlign: 'center' }}>Loading doctor profile...</p>;
  }

  return (
    <div className="admin-tab">
      <form onSubmit={handleSubmit}>
        <div className="admin-toolbar" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>

        {/* 1. Basic Info */}
        <div className="admin-card">
          <h3 className="admin-card-title">
            <User size={18} style={{ color: '#0ea5a0' }} />
            Personal & Professional Details
          </h3>

          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Doctor Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Medical Qualifications & Titles *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MD, DM (Cardiology), FESC"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Clinical Specialty *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Interventional Cardiologist"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tagline / Motto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Expert Care. Personal Attention. Better Health."
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Short Bio (Header & Footers)</label>
              <input
                type="text"
                className="form-control"
                value={formData.shortBio}
                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Medical Training &amp; Fellowships (Profile Card &amp; Trust Badges)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AIIMS New Delhi + Cleveland Clinic"
                value={formData.training}
                onChange={(e) => setFormData({ ...formData, training: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Full Biography</label>
              <textarea
                className="form-control"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Mission Statement</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="To deliver world-class cardiac care with empathy, precision, and innovation..."
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Personal Quote</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="The heart is not just a pump. It is the center of life..."
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 2. Clinic Contact Details */}
        <div className="admin-card">
          <h3 className="admin-card-title">
            <Phone size={18} style={{ color: '#0ea5a0' }} />
            Clinic Contact & Address
          </h3>

          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Clinic Phone *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Clinic Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Physical Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 3. Working Hours & Clinic Stats */}
        <div className="form-row">
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="admin-card-title" style={{ margin: 0 }}>
                <Clock size={18} style={{ color: '#0ea5a0' }} />
                Consultation Hours
              </h3>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={handleAddHourRow}
                title="Add new working hour slot"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div className="admin-card-body" style={{ paddingTop: 0 }}>
              {formData.workingHours.map((wh, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Monday – Friday"
                      value={wh.day}
                      onChange={(e) => handleHoursChange(idx, 'day', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 9:00 AM – 6:00 PM"
                      value={wh.time}
                      onChange={(e) => handleHoursChange(idx, 'time', e.target.value)}
                    />
                  </div>
                  {formData.workingHours.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHourRow(idx)}
                      className="admin-btn admin-btn--danger admin-btn--sm admin-btn--icon-only"
                      title="Remove row"
                      style={{ padding: '8px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ marginBottom: 0 }}>
            <h3 className="admin-card-title">
              <Award size={18} style={{ color: '#0ea5a0' }} />
              Key Practice Stats
            </h3>

            <div className="admin-card-body">
              {formData.stats.map((st, idx) => (
                <div key={idx} className="form-row" style={{ marginBottom: 8 }}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={st.label}
                      onChange={(e) => handleStatsChange(idx, 'label', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={st.value}
                      onChange={(e) => handleStatsChange(idx, 'value', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Social Media Links */}
        <div className="admin-card" style={{ marginTop: 24 }}>
          <h3 className="admin-card-title">
            <Share2 size={18} style={{ color: '#0ea5a0' }} />
            Social Media Links (Website Footer)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4, marginBottom: 14 }}>
            Enter your social profile or channel URLs. These dynamically power the social media buttons in the footer.
          </p>

          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://linkedin.com/in/doctor-profile"
                  value={formData.socials?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Twitter / X Profile URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://twitter.com/doctor-profile"
                  value={formData.socials?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Instagram Profile URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://instagram.com/doctor-profile"
                  value={formData.socials?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>YouTube Channel URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://youtube.com/@doctor-channel"
                  value={formData.socials?.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Core Practice Values & Features */}
        <div className="admin-card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h3 className="admin-card-title" style={{ margin: 0 }}>
              <Heart size={18} style={{ color: '#e74c6e' }} />
              Core Practice Values &amp; Features (Home &amp; About Pages)
            </h3>
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={handleAddValueRow}
              title="Add new value card"
            >
              <Plus size={14} /> Add Value
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4, marginBottom: 14 }}>
            These pillars power the "Why Choose Us" cards on the Home page and "Core Values" on the About page.
          </p>

          <div className="admin-card-body" style={{ paddingTop: 0 }}>
            {formData.values.map((val, idx) => (
              <div key={idx} style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: 10 }}>
                <div className="form-row" style={{ marginBottom: 8, alignItems: 'center' }}>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label style={{ fontSize: '0.75rem' }}>Value Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Patient First"
                      value={val.title}
                      onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem' }}>Icon</label>
                    <select
                      className="form-control"
                      value={val.icon || 'heart'}
                      onChange={(e) => handleValueChange(idx, 'icon', e.target.value)}
                    >
                      <option value="heart">Heart (Patient Care)</option>
                      <option value="shield">Shield (Evidence-based)</option>
                      <option value="zap">Zap (Technology)</option>
                      <option value="users">Users (Holistic / Community)</option>
                      <option value="award">Award (Excellence)</option>
                    </select>
                  </div>
                  {formData.values.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveValueRow(idx)}
                      className="admin-btn admin-btn--danger admin-btn--sm admin-btn--icon-only"
                      title="Remove value"
                      style={{ padding: '8px', alignSelf: 'flex-end', marginBottom: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem' }}>Description *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brief description of this core principle..."
                    value={val.desc}
                    onChange={(e) => handleValueChange(idx, 'desc', e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Career Timeline / Milestones */}
        <div className="admin-card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h3 className="admin-card-title" style={{ margin: 0 }}>
              <Milestone size={18} style={{ color: '#1a6bbd' }} />
              Career Journey &amp; Milestones (About Page Timeline)
            </h3>
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={handleAddMilestoneRow}
              title="Add new milestone"
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4, marginBottom: 14 }}>
            Historical timeline milestones shown on the About page journey section.
          </p>

          <div className="admin-card-body" style={{ paddingTop: 0 }}>
            {formData.milestones.map((m, idx) => (
              <div key={idx} style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: 10 }}>
                <div className="form-row" style={{ marginBottom: 8, alignItems: 'center' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem' }}>Year / Period *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2000 or 2018 – Present"
                      value={m.year}
                      onChange={(e) => handleMilestoneChange(idx, 'year', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 3 }}>
                    <label style={{ fontSize: '0.75rem' }}>Milestone Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. MBBS — AIIMS New Delhi"
                      value={m.title}
                      onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                      required
                    />
                  </div>
                  {formData.milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestoneRow(idx)}
                      className="admin-btn admin-btn--danger admin-btn--sm admin-btn--icon-only"
                      title="Remove milestone"
                      style={{ padding: '8px', alignSelf: 'flex-end', marginBottom: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem' }}>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brief description of this career milestone..."
                    value={m.desc}
                    onChange={(e) => handleMilestoneChange(idx, 'desc', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
