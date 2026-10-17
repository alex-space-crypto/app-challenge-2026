import * as React from 'react';
import type { CollectibleAnimal, AnimalInteraction } from '../collectibles';
import type { Beast, BeastAbility } from '../beasts';
import { RARITY_INFO } from '../collectibles';
import { BEAST_TIER_INFO } from '../beasts';
import { playInteractionSound, playClickSound } from '../sounds';

interface AnimalInteractionModalProps {
  animal: CollectibleAnimal;
  onClose: () => void;
}

export function AnimalInteractionModal({ animal, onClose }: AnimalInteractionModalProps) {
  const [response, setResponse] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState<string>('');
  const [emojiClass, setEmojiClass] = React.useState('');
  const rarity = RARITY_INFO[animal.rarity];

  const handleInteract = (interaction: AnimalInteraction) => {
    setResponse(interaction.response);
    setReaction(interaction.reaction);
    setEmojiClass(interaction.reaction);
    playInteractionSound(interaction.reaction);
    setTimeout(() => setEmojiClass(''), 1500);
  };

  return (
    <div className="creature-interaction-overlay" onClick={onClose}>
      <div
        className="creature-interaction-card"
        style={{ '--creature-color': rarity.color, '--creature-glow': rarity.glow } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <button className="creature-interaction-close" onClick={() => { playClickSound(); onClose(); }}>Close ✕</button>
        <div className="creature-interaction-light-beam" style={{ background: rarity.glow }} />
        <div className="creature-interaction-header">
          <span className="creature-interaction-badge" style={{ color: rarity.color, borderColor: rarity.color }}>
            {rarity.label} Animal
          </span>
        </div>
        <div className={`creature-interaction-emoji ${emojiClass}`} style={{ '--creature-color': rarity.color } as React.CSSProperties}>
          {animal.emoji}
        </div>
        <span className="creature-interaction-name">{animal.name}</span>
        <div className="creature-interaction-info">
          <span className="creature-info-item">Habitat: {animal.habitat}</span>
          <span className="creature-info-item">Fact: {animal.fact}</span>
        </div>
        <div className="creature-interaction-buttons">
          {animal.interactions.map(action => (
            <button
              key={action.label}
              className="creature-action-btn"
              style={{ borderColor: rarity.color }}
              onClick={() => handleInteract(action)}
            >
              <span className="creature-action-icon">{action.icon}</span>
              <span className="creature-action-label">{action.label}</span>
            </button>
          ))}
        </div>
        {response && (
          <div className={`creature-response ${reaction}`}>
            <span className="creature-response-text">{response}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface BeastInteractionModalProps {
  beast: Beast;
  onClose: () => void;
}

export function BeastInteractionModal({ beast, onClose }: BeastInteractionModalProps) {
  const [response, setResponse] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState<string>('');
  const [emojiClass, setEmojiClass] = React.useState('');
  const tierInfo = BEAST_TIER_INFO[beast.tier];

  const handleAbility = (ability: BeastAbility) => {
    setResponse(ability.response);
    setReaction(ability.reaction);
    setEmojiClass(ability.reaction);
    playInteractionSound(ability.reaction);
    setTimeout(() => setEmojiClass(''), 1500);
  };

  return (
    <div className="creature-interaction-overlay" onClick={onClose}>
      <div
        className="creature-interaction-card"
        style={{ '--creature-color': tierInfo.color, '--creature-glow': tierInfo.glow } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <button className="creature-interaction-close" onClick={() => { playClickSound(); onClose(); }}>Close ✕</button>
        <div className="creature-interaction-light-beam" style={{ background: tierInfo.glow }} />
        <div className="creature-interaction-header">
          <span className="creature-interaction-badge" style={{ color: tierInfo.color, borderColor: tierInfo.color }}>
            {tierInfo.label} Beast
          </span>
        </div>
        <div className={`creature-interaction-emoji ${emojiClass}`} style={{ '--creature-color': tierInfo.color } as React.CSSProperties}>
          {beast.emoji}
        </div>
        <span className="creature-interaction-name">{beast.name}</span>
        <div className="creature-interaction-info">
          <span className="creature-info-item">Power: {beast.power}</span>
          <span className="creature-info-lore">{beast.lore}</span>
        </div>
        <div className="creature-interaction-buttons">
          {beast.abilities.map(ability => (
            <button
              key={ability.label}
              className="creature-action-btn"
              style={{ borderColor: tierInfo.color }}
              onClick={() => handleAbility(ability)}
            >
              <span className="creature-action-icon">{ability.icon}</span>
              <span className="creature-action-label">{ability.label}</span>
            </button>
          ))}
        </div>
        {response && (
          <div className={`creature-response ${reaction}`}>
            <span className="creature-response-text">{response}</span>
          </div>
        )}
      </div>
    </div>
  );
}
