import { useState } from 'react';
import { Clock, Tag, ArrowRight, Search } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import ScrollReveal from '../components/common/ScrollReveal';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { ARTICLE_CATEGORIES } from '../utils/constants';
import './Blog.css';

const CATEGORY_ICONS = {
  'Heart Disease': '❤', 'Hypertension': '📊', 'Emergency': '🚨',
  'Nutrition': '🥗', 'Lifestyle': '🏃', 'Procedures': '🏥', 'Arrhythmia': '⚡',
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { data: articles, loading } = useApi(
    () => api.getArticles(activeCategory !== 'All' ? { category: activeCategory } : {}),
    [activeCategory]
  );

  const filtered = (articles || []).filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered.find(a => a.featured);
  const rest     = filtered.filter(a => !a.featured || activeCategory !== 'All');

  return (
    <div className="blog-page">
      <section className="page-hero">
        <div className="container page-hero__inner" style={{ maxWidth: 800 }}>
          <ScrollReveal>
            <span className="pill pill--primary">Blog</span>
            <h1 className="page-hero__title">
              Health Articles &amp; <span className="text-gradient">Heart Insights</span>
            </h1>
            <p className="page-hero__subtitle">
              Expert guidance from Dr. Sharma on heart health, lifestyle, procedures, and prevention.
            </p>
          </ScrollReveal>

          {/* Search */}
          <ScrollReveal delay={0.2} className="blog-search">
            <Search size={18} className="blog-search__icon" />
            <input
              id="blog-search-input"
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="blog-search__input"
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Pills */}
          <div className="blog-categories">
            {ARTICLE_CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`blog-cat-${cat.toLowerCase().replace(/\s+/g, '-')}-btn`}
                className={`filter-pill ${activeCategory === cat ? 'filter-pill--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_ICONS[cat] && <span>{CATEGORY_ICONS[cat]}</span>} {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" style={{ height: 280 }} />)}
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && activeCategory === 'All' && !search && (
                <ScrollReveal className="featured-article">
                  <div className="featured-article__badge">
                    <Tag size={14} /> Featured
                  </div>
                  <div className="featured-article__body">
                    <div className="featured-article__category">{CATEGORY_ICONS[featured.category]} {featured.category}</div>
                    <h2 className="featured-article__title">{featured.title}</h2>
                    <p className="featured-article__excerpt">{featured.excerpt}</p>
                    <div className="featured-article__meta">
                      <span><Clock size={14} /> {featured.readTime}</span>
                      <span>📅 {new Date(featured.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="featured-article__tags">
                      {featured.tags.map(t => (
                        <span key={t} className="article-tag">#{t}</span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Articles Grid */}
              <div className="articles-grid">
                {(activeCategory !== 'All' || search ? filtered : rest).map((article, i) => (
                  <ScrollReveal key={article.id} delay={i * 0.08} className="article-card">
                    <div className="article-card__top">
                      <span className="article-card__category">
                        {CATEGORY_ICONS[article.category]} {article.category}
                      </span>
                      <span className="article-card__read-time">
                        <Clock size={12} /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="article-card__title">{article.title}</h3>
                    <p className="article-card__excerpt">{article.excerpt}</p>
                    <div className="article-card__footer">
                      <span className="article-card__date">
                        {new Date(article.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button className="article-card__read-btn" id={`article-${article.id}-read-btn`}>
                        Read More <ArrowRight size={14} />
                      </button>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="blog-empty">
                  <p>No articles found. Try a different search or category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
