import * as React from 'react';
import type { CommunityPost, Profile, Habit } from '../types';
import { COMMUNITY_RESOURCES, JOCO_TOWNS } from '../joco';
import CountyChallenge from './CountyChallenge';
import HelpBoard from './HelpBoard';
import CommunityImpact from './CommunityImpact';
import CountyAwards from './CountyAwards';

const CATEGORIES = ['Sustainability','Reading','Chores & Allowance','Fitness Basics','Hydration','Community Service','General'];

interface Props {
  posts: CommunityPost[];
  profile: Profile;
  habits: Habit[];
  onAddPost: (message: string, category: string) => void;
  onCheer: (id: string) => void;
  onDeletePost: (id: string) => void;
  onReportPost: (id: string) => void;
  onProfileName: (name: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function CommunityTab({ posts, profile, habits, onAddPost, onCheer, onDeletePost, onReportPost, onProfileName }: Props) {
  const [message, setMessage] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [name, setName] = React.useState(profile.name);
  const [showNameField, setShowNameField] = React.useState(!profile.name);
  const [showResources, setShowResources] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<CommunityPost | null>(null);
  const [showBannerPreview, setShowBannerPreview] = React.useState(true);

  const SEED_POSTS: CommunityPost[] = React.useMemo(() => {
    const now = Date.now();
    return [
      { id: 'seed-1', author: 'Maria G.', message: 'Finished my 30-day hydration streak! Feeling so much better. Drink your water, neighbors! 💧', category: 'Hydration', createdAt: now - 3600000, cheers: 12 },
      { id: 'seed-2', author: 'James T.', message: 'Volunteered at the Clayton Food Pantry this morning. Great crew and a big turnout. Come join us next Saturday!', category: 'Community Service', createdAt: now - 7200000, cheers: 24 },
      { id: 'seed-3', author: 'Aisha K.', message: 'Walked the Buffalo Creek Greenway with my kids today. Saw a blue heron! Best habit goal ever 🌿', category: 'Fitness Basics', createdAt: now - 10800000, cheers: 8 },
      { id: 'seed-4', author: 'Robert L.', message: "Finished reading 10 books this month at the Public Library of Johnston County. Knowledge is power! 📚", category: 'Reading', createdAt: now - 14400000, cheers: 15 },
    ];
  }, []);

  const allPosts = React.useMemo(() => [...posts, ...SEED_POSTS], [posts, SEED_POSTS]);
  const sorted = [...allPosts].sort((a, b) => b.createdAt - a.createdAt);
  const totalCheers = allPosts.reduce((s, p) => s + p.cheers, 0);
  const categoryCounts = CATEGORIES.map(c => ({ c, n: allPosts.filter(p => p.category === c).length }))
    .filter(x => x.n > 0);

  return (
    <div className="tab-panel">
      <CommunityImpact habits={habits}>
        <div className="community-banner community-banner-expanded">
          <button
            className="community-banner-main community-banner-clickable"
            onClick={() => setShowBannerPreview(s => !s)}
            aria-expanded={showBannerPreview}
          >
            <h2>🤝 Thriving Together — District 13 <span className="banner-chevron">{showBannerPreview ? '▾' : '▸'}</span></h2>
            <p>Share wins, tips, and encouragement with neighbors across Johnston County. Every post builds our community stronger.</p>
          </button>
          <div className="community-stats">
            <div className="comm-stat">
              <span className="comm-stat-num">{allPosts.length}</span>
              <span className="comm-stat-label">posts</span>
            </div>
            <div className="comm-stat">
              <span className="comm-stat-num">{totalCheers}</span>
              <span className="comm-stat-label">cheers</span>
            </div>
          </div>

          {showBannerPreview && (
            <div className="banner-preview banner-preview-inline">
            {showNameField ? (
              <div className="add-block name-block banner-preview-block">
                <div className="name-block-header">
                  <h3>Set your display name</h3>
                  <p className="tab-intro name-block-sub">How neighbors will see your posts. Stored only on your device.</p>
                </div>
                <div className="name-row">
                  <input
                    className="text-input"
                    placeholder="Your name or nickname"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && name.trim()) { onProfileName(name.trim()); setShowNameField(false); } }}
                  />
                  <button
                    className="btn-primary"
                    disabled={!name.trim()}
                    onClick={() => { onProfileName(name.trim()); setShowNameField(false); }}
                  >Save</button>
                </div>
              </div>
            ) : (
              <div className="add-block banner-preview-block">
                <div className="post-head">
                  <span className="avatar">{profile.name.charAt(0).toUpperCase() || 'Y'}</span>
                  <span>Posting as <strong>{profile.name}</strong></span>
                  <button className="link-action" onClick={() => setShowNameField(true)}>Change</button>
                </div>
                <textarea
                  className="text-area"
                  placeholder="Share a win, tip, or encourage a neighbor... (e.g. 'Walked the Buffalo Creek Greenway today — beautiful morning!')"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  maxLength={300}
                />
                <div className="post-footer">
                  <span className="char-count">{message.length}/300</span>
                  <div className="post-actions">
                    <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                      className="btn-primary"
                      disabled={!message.trim()}
                      onClick={() => { onAddPost(message.trim(), category); setMessage(''); }}
                    >Post to District 13</button>
                  </div>
                </div>
              </div>
            )}

            {sorted.length === 0 ? (
              <p className="banner-preview-empty">No posts yet — be the first to share something!</p>
            ) : (
              sorted.slice(0, 1).map(p => (
                <div
                  key={p.id}
                  className="banner-preview-card"
                  onClick={() => setSelectedPost(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPost(p); } }}
                >
                  <div className="post-head">
                    <span className="avatar">{p.author.charAt(0).toUpperCase()}</span>
                    <div className="post-meta">
                      <strong>{p.author}</strong>
                      <span className="post-time">{timeAgo(p.createdAt)}</span>
                    </div>
                    <span className="post-category">{p.category}</span>
                    <button
                      className="post-report-btn"
                      onClick={e => { e.stopPropagation(); onReportPost(p.id); }}
                      aria-label="Report post"
                      title="Report this post"
                    >🚩</button>
                    <button
                      className="post-delete-btn"
                      onClick={e => { e.stopPropagation(); onDeletePost(p.id); }}
                      aria-label="Delete post"
                      title="Delete post"
                    >🗑</button>
                  </div>
                  <p className="post-message">{p.message}</p>
                  <div className="banner-preview-footer">
                    <button
                      className={`cheer-btn banner-preview-cheer-btn ${p.cheered ? 'cheered' : ''}`}
                      onClick={e => { e.stopPropagation(); onCheer(p.id); }}
                    >
                      {p.cheered ? '✓ Cheered' : '👏 Cheer'} · {p.cheers}
                    </button>
                  </div>
                </div>
              ))
            )}
            </div>
          )}
        </div>
      </CommunityImpact>

      <HelpBoard profileName={profile.name} />

      <CountyChallenge profileName={profile.name} />

      <CountyAwards profileName={profile.name} />

      <div className="joco-resources-section">
        <button className="joco-resources-toggle" onClick={() => setShowResources(s => !s)}>
          <span className="joco-resources-title">Community Resources in Johnston County</span>
          <span className="joco-resources-chevron">{showResources ? '▾' : '▸'}</span>
        </button>
        {showResources && (
          <div className="joco-resources-grid">
            {COMMUNITY_RESOURCES.map(r => (
              <a key={r.title} className="joco-resource-card" href={r.url} target="_blank" rel="noopener noreferrer">
                <span className="joco-resource-icon">{r.icon}</span>
                <div className="joco-resource-body">
                  <span className="joco-resource-name">{r.title}</span>
                  <p className="joco-resource-desc">{r.desc}</p>
                  <span className="joco-resource-loc">📍 {r.location}</span>
                </div>
                <span className="joco-resource-arrow">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <p className="tab-intro">Serving neighbors in {JOCO_TOWNS.join(', ')} and all of Johnston County.</p>

      {categoryCounts.length > 0 && (
        <div className="category-chips">
          {categoryCounts.map(({ c, n }) => (
            <span key={c} className="category-chip">{c} · {n}</span>
          ))}
        </div>
      )}

      {selectedPost && (
        <div className="post-detail-overlay" onClick={() => setSelectedPost(null)}>
          <div className="post-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="post-detail-close" onClick={() => setSelectedPost(null)} aria-label="Close">✕</button>
            <div className="post-detail-head">
              <span className="avatar avatar-lg">{selectedPost.author.charAt(0).toUpperCase()}</span>
              <div className="post-detail-author-area">
                <strong>{selectedPost.author}</strong>
                <span className="post-time">{timeAgo(selectedPost.createdAt)}</span>
              </div>
              <span className="post-category">{selectedPost.category}</span>
            </div>
            <p className="post-detail-message">{selectedPost.message}</p>
            <div className="post-detail-stats">
              <span className="post-detail-stat">👏 {selectedPost.cheers} {selectedPost.cheers === 1 ? 'cheer' : 'cheers'}</span>
            </div>
            <button
              className={`cheer-btn post-detail-cheer ${selectedPost.cheered ? 'cheered' : ''}`}
              onClick={() => onCheer(selectedPost.id)}
            >{selectedPost.cheered ? '✓ Cheered' : '👏 Cheer this post'}</button>
            <button
              className="post-detail-report-btn"
              onClick={() => { onReportPost(selectedPost.id); setSelectedPost(null); }}
            >🚩 Report this post</button>
          </div>
        </div>
      )}
    </div>
  );
}
