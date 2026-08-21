import * as React from 'react';
import type { Topic } from '../types';
import { CORE_VALUES, JOCO_TOWNS, TOPIC_LOCAL_PLACES } from '../joco';

const EMOJI_CHOICES = ['🌱','📚','🧹','🚶','💧','🍎','♻️','🥗','🧘','🌙','🦷','🐶','🧺','📝','🎵','🎨','💰','🌳','🐝','🤝','💧','☀️','🧴','🍳'];

interface Props {
  topics: Topic[];
  selected: string | null;
  onSelect: (id: string) => void;
  onAdd: (name: string, icon: string, color: string) => void;
  onDelete: (id: string) => void;
}

export default function TopicsTab({ topics, selected, onSelect, onAdd, onDelete }: Props) {
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState('📝');
  const [color, setColor] = React.useState('#4a90d9');

  return (
    <div className="tab-panel">
      <p className="tab-intro">
        Choose a pathway to start building daily habits that move you — and Johnston County — forward.
        Each one aligns with our shared mission of a thriving community, from the Neuse River to our downtowns.
      </p>

      <div className="joco-values-strip">
        {CORE_VALUES.map(v => (
          <div key={v.title} className="joco-value-chip">
            <span className="joco-value-chip-icon">{v.icon}</span>
            <span className="joco-value-chip-title">{v.title}</span>
          </div>
        ))}
      </div>

      <div className="topic-grid">
        {topics.map(t => {
          const localPlaces = TOPIC_LOCAL_PLACES[t.id];
          const isSelected = selected === t.id;
          return (
            <div
              key={t.id}
              className={`topic-card-wrapper ${isSelected ? 'selected' : ''}`}
              style={isSelected ? { borderColor: t.color, boxShadow: `0 0 0 2px ${t.color}44` } : undefined}
            >
              <button
                className={`topic-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(t.id)}
                style={isSelected ? { borderColor: t.color, boxShadow: `0 0 0 2px ${t.color}44` } : undefined}
              >
                <span className="topic-icon" style={{ background: `${t.color}33` }}>{t.icon}</span>
                <span className="topic-name">{t.name}</span>
                <span className="topic-blurb">{t.blurb}</span>
                {t.custom && (
                  <span
                    className="topic-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                    title="Remove pathway"
                  >×</span>
                )}
                {isSelected && <span className="topic-check">✓ Selected pathway</span>}
              </button>
              {isSelected && localPlaces && localPlaces.length > 0 && (
                <div className="topic-local-places">
                  <span className="topic-local-label">Local spots along this pathway:</span>
                  <div className="topic-local-links">
                    {localPlaces.map(p => (
                      <a key={p.url} className="topic-local-link" href={p.url} target="_blank" rel="noopener noreferrer">
                        📍 {p.name} <span className="topic-local-arrow">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="add-block">
        <h3>Create Your Own Pathway</h3>
        <p className="tab-intro">Got a habit unique to your family or goals? Add a new pathway here. Serving {JOCO_TOWNS.join(', ')} and all of Johnston County.</p>
        <input
          className="text-input"
          placeholder="Topic name (e.g. Gardening, Pet Care)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="picker-label">Pick an icon</div>
        <div className="emoji-row">
          {EMOJI_CHOICES.map(e => (
            <button
              key={e}
              className={`emoji-pick ${icon === e ? 'active' : ''}`}
              onClick={() => setIcon(e)}
            >{e}</button>
          ))}
        </div>
        <div className="picker-label">Pick a color</div>
        <div className="color-row">
          {['#3ba55d','#4a90d9','#d98a3b','#9b59b6','#e74c3c','#1abc9c','#f39c12','#34495e'].map(c => (
            <button
              key={c}
              className={`color-pick ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <button
          className="btn-primary"
          disabled={!name.trim()}
          onClick={() => { onAdd(name.trim(), icon, color); setName(''); }}
        >Add Pathway</button>
      </div>
    </div>
  );
}
