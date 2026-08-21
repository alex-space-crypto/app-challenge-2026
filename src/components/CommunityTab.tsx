import * as React from 'react';
import type { CommunityPost, Profile } from '../types';
import { COMMUNITY_RESOURCES, JOCO_TOWNS } from '../joco';
import CountyChallenge from './CountyChallenge';

const CATEGORIES = ['Sustainability','Reading','Chores & Allowance','Fitness Basics','Hydration','Community Service','General'];

interface Props {
  posts: CommunityPost[];
  profile: Profile;
  onAddPost: (message: string, category: string) => void;
  onCheer: (id: string) => void;
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

export default function CommunityTab({ posts, profile, onAddPost, onCheer, onProfileName }: Props) {
  const [message, setMessage] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [name, setName] = React.useState(profile.name);
  const [showNameField, setShowNameField] = React.useState(!profile.name);
  const [showResources, setShowResources] = React.useState(false);

  const sorted = [...posts].sort((a, b) => b.createdAt - a.createdAt);
  const totalCheers = posts.reduce((s, p) => s + p.cheers, 0);
  const categoryCounts = CATEGORIES.map(c => ({ c, n: posts.filter(p => p.category === c).length }))
    .filter(x => x.n > 0);

  return (
    <div className="tab-panel">
      <div className="community-banner">
        <div className="community-banner-main">
          <h2>🤝 Thriving Together — District 13</h2>
          <p>Share wins, tips, and encouragement with neighbors across Johnston County. Every post builds our community stronger.</p>
        </div>
        <div className="community-stats">
          <div className="comm-stat">
            <span className="comm-stat-num">{posts.length}</span>
            <span className="comm-stat-label">posts</span>
          </div>
          <div className="comm-stat">
            <span className="comm-stat-num">{totalCheers}</span>
            <span className="comm-stat-label">cheers</span>
          </div>
        </div>
      </div>

      <CountyChallenge profileName={profile.name} />

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

      {showNameField ? (
        <div className="add-block name-block">
          <h3>Set your display name</h3>
          <p className="tab-intro">How neighbors will see your posts. Stored only on your device.</p>
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
        <div className="add-block">
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

      <div className="post-list">
        {sorted.map(p => (
          <div key={p.id} className="post-card">
            <div className="post-head">
              <span className="avatar">{p.author.charAt(0).toUpperCase()}</span>
              <div className="post-meta">
                <strong>{p.author}</strong>
                <span className="post-time">{timeAgo(p.createdAt)}</span>
              </div>
              <span className="post-category">{p.category}</span>
            </div>
            <p className="post-message">{p.message}</p>
            <button
              className={`cheer-btn ${p.cheered ? 'cheered' : ''}`}
              onClick={() => onCheer(p.id)}
            >👏 {p.cheers} {p.cheers === 1 ? 'cheer' : 'cheers'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
