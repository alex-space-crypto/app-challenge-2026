import * as React from 'react';
import type { CollectibleAnimal, CollectedAnimal } from '../collectibles';
import { RARITY_INFO, getAnimalById, ANIMALS } from '../collectibles';
import { playRewardSound, playClickSound } from '../sounds';
import { AnimalInteractionModal } from './CreatureInteraction';

interface RewardPopupProps {
  animal: CollectibleAnimal;
  isNew: boolean;
  habitName: string;
  onCollect: () => void;
}

export function RewardPopup({ animal, isNew, habitName, onCollect }: RewardPopupProps) {
  const [revealed, setRevealed] = React.useState(false);
  const rarity = RARITY_INFO[animal.rarity];

  React.useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      playRewardSound(animal.rarity);
    }, 400);
    return () => clearTimeout(t);
  }, [animal.rarity]);

  return (
    <div className="reward-popup-overlay" onClick={onCollect}>
      <div
        className="reward-popup-card"
        style={{ '--rarity-color': rarity.color, '--rarity-glow': rarity.glow } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <div className={`reward-popup-light-beam ${revealed ? 'active' : ''}`} style={{ background: rarity.glow }} />
        <div className="reward-popup-header">
          <span className="reward-popup-badge">Animal Collected!</span>
        </div>
        <div className={`reward-egg ${revealed ? 'hatched' : ''}`} style={{ '--rarity-color': rarity.color } as React.CSSProperties}>
          {revealed ? (
            <span className="reward-emoji">{animal.emoji}</span>
          ) : (
            <span className="reward-egg-shape">🥚</span>
          )}
        </div>
        {revealed && (
          <div className="reward-popup-info">
            <span className="reward-animal-name">{animal.name}</span>
            <span className="reward-rarity-tag" style={{ color: rarity.color, borderColor: rarity.color }}>
              {rarity.label}
            </span>
            {isNew ? (
              <span className="reward-new-badge">NEW!</span>
            ) : (
              <span className="reward-dup-badge">Already in collection</span>
            )}
            <p className="reward-animal-fact">{animal.fact}</p>
            <span className="reward-animal-habitat">Habitat: {animal.habitat}</span>
            <span className="reward-from-habit">Earned from: {habitName}</span>
            <button className="reward-collect-btn" onClick={() => { playClickSound(); onCollect(); }}>
              {isNew ? 'Add to Collection!' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface CollectionViewerProps {
  collected: CollectedAnimal[];
  onClose: () => void;
}

export function CollectionViewer({ collected, onClose }: CollectionViewerProps) {
  const collectedIds = new Set(collected.map(c => c.animalId));
  const [selectedAnimal, setSelectedAnimal] = React.useState<CollectibleAnimal | null>(null);
  const grouped = (['legendary', 'epic', 'rare', 'common'] as const).map(rarity => ({
    rarity,
    animals: ANIMALS.filter(a => a.rarity === rarity),
  }));

  const totalCollected = collectedIds.size;
  const totalPossible = ANIMALS.length;

  return (
    <div className="collection-overlay" onClick={onClose}>
      <div className="collection-modal" onClick={e => e.stopPropagation()}>
        <button className="collection-close" onClick={() => { playClickSound(); onClose(); }}>Close ✕</button>
        <div className="collection-header">
          <h2 className="collection-title">🦊 Animal Collection</h2>
          <p className="collection-subtitle">
            {totalCollected} / {totalPossible} animals discovered
          </p>
          <div className="collection-progress-bar">
            <div className="collection-progress-fill" style={{ width: `${(totalCollected / totalPossible) * 100}%` }} />
          </div>
        </div>
        <div className="collection-list">
          {grouped.map(({ rarity, animals }) => (
            <div key={rarity} className="collection-rarity-group">
              <span className="collection-rarity-label" style={{ color: RARITY_INFO[rarity].color }}>
                {RARITY_INFO[rarity].label} ({animals.filter(a => collectedIds.has(a.id)).length}/{animals.length})
              </span>
              <div className="collection-animal-grid">
                {animals.map(animal => {
                  const isCollected = collectedIds.has(animal.id);
                  const instance = collected.find(c => c.animalId === animal.id);
                  return (
                    <div
                      key={animal.id}
                      className={`collection-animal-card ${isCollected ? 'collected' : 'locked'}`}
                      style={isCollected ? { '--rarity-color': RARITY_INFO[animal.rarity].color } as React.CSSProperties : undefined}
                      onClick={isCollected ? () => { playClickSound(); setSelectedAnimal(animal); } : undefined}
                      role={isCollected ? 'button' : undefined}
                    >
                      <span className="collection-animal-emoji">{isCollected ? animal.emoji : '❓'}</span>
                      <span className="collection-animal-name">{isCollected ? animal.name : '???'}</span>
                      {isCollected && <span className="collection-interact-hint">Tap to interact</span>}
                      {isCollected && instance && (
                        <span className="collection-animal-date">
                          {new Date(instance.collectedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAnimal && (
        <AnimalInteractionModal animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
      )}
    </div>
  );
}

export function getCollectedAnimalInfo(collected: CollectedAnimal[], animalId: string) {
  const animal = getAnimalById(animalId);
  if (!animal) return null;
  return animal;
}
