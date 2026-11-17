import { API_BASE } from '../utils/constants';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('doctor_admin_token');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Authentication
  login:          (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe:          ()            => request('/auth/me'),
  forgotPassword: (email)       => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword:  (data)        => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Doctor Profile
  getDoctor:       ()       => request('/doctor'),
  updateDoctor:    (data)   => request('/doctor', { method: 'PUT', body: JSON.stringify(data) }),

  // Specialties
  getSpecialties:  ()       => request('/specialties'),
  getSpecialty:    (slug)   => request(`/specialties/${slug}`),
  createSpecialty: (data)   => request('/specialties', { method: 'POST', body: JSON.stringify(data) }),
  updateSpecialty: (id, data) => request(`/specialties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSpecialty: (id)     => request(`/specialties/${id}`, { method: 'DELETE' }),

  // Procedures / Treatments
  getProcedures:   (cat)    => request(`/specialties/procedures/all${cat ? `?category=${cat}` : ''}`),
  createProcedure: (data)   => request('/specialties/procedures', { method: 'POST', body: JSON.stringify(data) }),
  updateProcedure: (id, data) => request(`/specialties/procedures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProcedure: (id)     => request(`/specialties/procedures/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews:      (limit)  => request(`/reviews${limit ? `?limit=${limit}` : ''}`),
  createReview:    (data)   => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateReview:    (id, data) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReview:    (id)     => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Blog Articles
  getArticles:     (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return request(`/articles${q ? `?${q}` : ''}`);
  },
  getArticle:      (slug)   => request(`/articles/${slug}`),
  createArticle:   (data)   => request('/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle:   (id, data) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle:   (id)     => request(`/articles/${id}`, { method: 'DELETE' }),

  // FAQs
  getFaqs:         (cat)    => request(`/faqs${cat ? `?category=${cat}` : ''}`),
  createFaq:       (data)   => request('/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFaq:       (id, data) => request(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFaq:       (id)     => request(`/faqs/${id}`, { method: 'DELETE' }),

  // Appointments / Patient Inquiries
  submitContact:           (data)       => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getAppointments:         (status)     => request(`/contact${status ? `?status=${status}` : ''}`),
  updateAppointmentStatus: (id, status) => request(`/contact/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteAppointment:       (id)         => request(`/contact/${id}`, { method: 'DELETE' }),

  // Newsletter Subscribers
  subscribeNewsletter: (email) => request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers:      ()      => request('/newsletter'),
  deleteSubscriber:    (id)    => request(`/newsletter/${id}`, { method: 'DELETE' }),
};
