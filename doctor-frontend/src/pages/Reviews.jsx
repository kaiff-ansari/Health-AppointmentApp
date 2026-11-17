import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import StarRating from '../components/common/StarRating';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import './Reviews.css';

export default function Reviews() {
  const { data: reviews, loading } = useApi(() => api.getReviews());
  const { openModal } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const count = (reviews || []).length;
  const prev = () => setActiveIdx(i => (i - 1 + count) % count);
  const next = () => setActiveIdx(i => (i + 1) % count);

  const featured = reviews ? reviews[activeIdx] : null;

  return (
    <div className="reviews-page">
      <section className="page-hero">
        <div className="container page-hero__inner">
          <ScrollReveal>
            <span className="pill pill--primary">Patient Reviews</span>
            <h1 className="page-hero__title">
              What Our Patients <span className="text-gradient">Say About Us</span>
            </h1>
            <p className="page-hero__subtitle">
              Real stories from real patients who trusted Dr. Sharma with their most precious organ — their heart.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="section reviews-summary">
        <div className="container">
          <ScrollReveal className="reviews-summary__inner">
            <div className="reviews-summary__score">
              <span className="reviews-summary__number">4.9</span>
              <div>
                <StarRating rating={5} size={28} />
                <p>Based on 1,200+ patient reviews</p>
              </div>
            </div>
            <div className="reviews-summary__bars">
              {[5, 4, 3, 2, 1].map((s, i) => (
                <div key={s} className="review-bar">
                  <span className="review-bar__label">{s} ★</span>
                  <div className="review-bar__track">
                    <div
                      className="review-bar__fill"
                      style={{ width: `${[92, 6, 1.5, 0.3, 0.2][i]}%` }}
                    />
                  </div>
                  <span className="review-bar__pct">{[92, 6, 1.5, 0.3, 0.2][i]}%</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Carousel */}
      {!loading && featured && (
        <section className="section section--alt reviews-carousel">
          <div className="container">
            <SectionTitle pill="Stories" title="Patient" highlight="Testimonials" />
            <ScrollReveal className="carousel-wrap">
              <div className="featured-review">
                <Quote size={40} className="featured-review__quote-icon" />
                <p className="featured-review__text">{featured.review}</p>
                <div className="featured-review__meta">
                  <div className="featured-review__avatar">{featured.avatar}</div>
                  <div>
                    <strong className="featured-review__name">{featured.name}</strong>
                    <span className="featured-review__info">Age {featured.age} · {featured.condition}</span>
                    <StarRating rating={featured.rating} size={14} />
                  </div>
                  <span className="featured-review__date">
                    {new Date(featured.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="carousel-controls">
                <button className="carousel-btn" onClick={prev} id="review-prev-btn" aria-label="Previous review">
                  <ChevronLeft size={20} />
                </button>
                <div className="carousel-dots">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot ${i === activeIdx ? 'carousel-dot--active' : ''}`}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Review ${i + 1}`}
                    />
                  ))}
                </div>
                <button className="carousel-btn" onClick={next} id="review-next-btn" aria-label="Next review">
                  <ChevronRight size={20} />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* All Reviews Grid */}
      <section className="section reviews-grid-section">
        <div className="container">
          <SectionTitle pill="All Reviews" title="Every" highlight="Voice Matters" />
          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" style={{ height: 200 }} />)}
            </div>
          ) : (
            <div className="reviews-grid">
              {(reviews || []).map((r, i) => (
                <ScrollReveal key={r.id} delay={i * 0.07} className="review-card">
                  <div className="review-card__top">
                    <div className="review-card__avatar">{r.avatar}</div>
                    <div>
                      <strong className="review-card__name">{r.name}</strong>
                      <p className="review-card__condition">{r.condition}</p>
                    </div>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <p className="review-card__text">"{r.review}"</p>
                  <span className="review-card__date">
                    {new Date(r.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section section--alt text-center">
        <div className="container">
          <ScrollReveal>
            <h2>Ready to Become Our <span className="text-gradient">Next Success Story?</span></h2>
            <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              Join thousands of patients who have transformed their heart health with Dr. Sharma.
            </p>
            <button className="btn btn--primary btn--lg" onClick={openModal} id="reviews-cta-btn">
              Book Your Appointment
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
