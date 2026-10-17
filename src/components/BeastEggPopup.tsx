import * as React from 'react';
import type { BeastTier, CollectedBeast, Beast } from '../beasts';
import { BEAST_TIER_INFO, TIER_ORDER, getBeastForTier, BEASTS, isBeastCollected } from '../beasts';
import { playEggTapSound, playBeastRevealSound, playEggCrackSound, playClickSound } from '../sounds';
import { BeastInteractionModal } from './CreatureInteraction';

interface BeastEggPopupProps {
  source: string;
  collectedBeasts: CollectedBeast[];
  onConfirm: (beastId: string, tier: BeastTier, isNew: boolean) => void;
}

const TOTAL_TAPS = 3;

export function BeastEggPopup({ source, collectedBeasts, onConfirm }: BeastEggPopupProps) {
  const [tierIndex, setTierIndex] = React.useState(0);
  const [taps, setTaps] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [shaking, setShaking] = React.useState(false);
  const [beastId, setBeastId] = React.useState<string | null>(null);
  const [isNew, setIsNew] = React.useState(true);

  const currentTier = TIER_ORDER[tierIndex];
  const tierInfo = BEAST_TIER_INFO[currentTier];
  const isMaxTier = tierIndex >= TIER_ORDER.length - 1;

  const handleTap = () => {
    if (revealed || isMaxTier) return;
    playEggTapSound();
    setShaking(true);
    setTimeout(() => setShaking(false), 300);

    const newTaps = taps + 1;
    if (newTaps >= TOTAL_TAPS) {
      setTaps(0);
      const nextIndex = tierIndex + 1;
      setTierIndex(nextIndex);
      if (nextIndex === TIER_ORDER.length - 1) {
        // Final tier reached — auto-hatch
        setTimeout(() => hatchBeast(TIER_ORDER[nextIndex]), 600);
      }
    } else {
      setTaps(newTaps);
    }
  };

  const hatchBeast = (tier: BeastTier) => {
    playEggCrackSound();
    setTimeout(() => {
      const beast = getBeastForTier(tier);
      setBeastId(beast.id);
      setIsNew(!isBeastCollected(collectedBeasts, beast.id, tier));
      setRevealed(true);
      playBeastRevealSound(TIER_ORDER.indexOf(tier));
    }, 300);
  };

  const handleHatchNow = () => {
    if (revealed) return;
    hatchBeast(currentTier);
  };

  const handleConfirm = () => {
    if (!beastId) return;
    playClickSound();
    onConfirm(beastId, currentTier, isNew);
  };

  const beast = beastId ? BEASTS.find(b => b.id === beastId) : null;
  const revealedTierInfo = beast ? BEAST_TIER_INFO[beast.tier] : tierInfo;

  return (
    <div className="beast-egg-overlay" onClick={revealed ? handleConfirm : undefined}>
      <div
        className="beast-egg-card"
        style={{ '--tier-color': revealedTierInfo.color, '--tier-glow': revealedTierInfo.glow } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <div className="beast-egg-light-beam" style={{ background: revealedTierInfo.glow }} />
        <div className="beast-egg-header">
          <span className="beast-egg-badge">Beast Egg!</span>
          <span className="beast-egg-source">Earned from: {source}</span>
        </div>

        {!revealed ? (
          <div className="beast-egg-stage">
            <div
              className={`beast-egg ${shaking ? 'shaking' : ''}`}
              style={{ '--egg-color': tierInfo.eggColor, '--tier-color': tierInfo.color } as React.CSSProperties}
              onClick={handleTap}
            >
              <span className="beast-egg-emoji">🥚</span>
            </div>
            <div className="beast-egg-tier-display">
              <span className="beast-egg-tier-label" style={{ color: tierInfo.color }}>
                {tierInfo.label}
              </span>
              {!isMaxTier && (
                <span className="beast-egg-tap-progress">
                  Tap {taps}/{TOTAL_TAPS} to upgrade
                </span>
              )}
              {isMaxTier && (
                <span className="beast-egg-max-tier">Max tier reached!</span>
              )}
            </div>
            <div className="beast-egg-tier-ladder">
              {TIER_ORDER.map((t, i) => (
                <span
                  key={t}
                  className={`beast-egg-tier-dot ${i < tierIndex ? 'passed' : ''} ${i === tierIndex ? 'current' : ''} ${i > tierIndex ? 'future' : ''}`}
                  style={{
                    background: i <= tierIndex ? BEAST_TIER_INFO[t].color : 'transparent',
                    borderColor: BEAST_TIER_INFO[t].color,
                  }}
                  title={BEAST_TIER_INFO[t].label}
                />
              ))}
            </div>
            {!isMaxTier && (
              <button className="beast-egg-hatch-btn" onClick={handleHatchNow}>
                Hatch now ({BEAST_TIER_INFO[currentTier].label})
              </button>
            )}
            <p className="beast-egg-tap-hint">Tap the egg 3 times to upgrade to the next tier, or hatch now!</p>
          </div>
        ) : (
          <div className="beast-reveal-stage">
            <div className="beast-reveal-emoji" style={{ '--tier-color': revealedTierInfo.color } as React.CSSProperties}>
              {beast?.emoji}
            </div>
            <div className="beast-reveal-info">
              <span className="beast-reveal-name">{beast?.name}</span>
              <span className="beast-reveal-tier" style={{ color: revealedTierInfo.color, borderColor: revealedTierInfo.color }}>
                {revealedTierInfo.label}
              </span>
              {isNew ? (
                <span className="beast-reveal-new-badge">NEW BEAST!</span>
              ) : (
                <span className="beast-reveal-dup-badge">Already collected</span>
              )}
              <div className="beast-reveal-stats">
                <div className="beast-stat-row">
                  <span className="beast-stat-label">Power</span>
                  <span className="beast-stat-value">{beast?.power}</span>
                </div>
              </div>
              <p className="beast-reveal-lore">{beast?.lore}</p>
              <button className="beast-reveal-confirm-btn" onClick={handleConfirm}>
                {isNew ? 'Add to Beast Collection!' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BeastCollectionViewerProps {
  collected: CollectedBeast[];
  onClose: () => void;
}

export function BeastCollectionViewer({ collected, onClose }: BeastCollectionViewerProps) {
  const grouped = [...TIER_ORDER].reverse().map(tier => ({
    tier,
    beasts: BEASTS.filter(b => b.tier === tier),
  }));
  const [selectedBeast, setSelectedBeast] = React.useState<Beast | null>(null);

  const totalCollected = collected.length;
  const totalPossible = BEASTS.length;

  return (
    <div className="beast-collection-overlay" onClick={onClose}>
      <div className="beast-collection-modal" onClick={e => e.stopPropagation()}>
        <button className="beast-collection-close" onClick={() => { playClickSound(); onClose(); }}>Close ✕</button>
        <div className="beast-collection-header">
          <h2 className="beast-collection-title">🐲 Beast Collection</h2>
          <p className="beast-collection-subtitle">
            {totalCollected} / {totalPossible} beasts collected
          </p>
          <div className="beast-collection-progress-bar">
            <div className="beast-collection-progress-fill" style={{ width: `${(totalCollected / totalPossible) * 100}%` }} />
          </div>
        </div>
        <div className="beast-collection-list">
          {grouped.map(({ tier, beasts }) => {
            const tierCollected = collected.filter(c => c.tier === tier);
            const collectedIds = new Set(tierCollected.map(c => c.beastId));
            return (
              <div key={tier} className="beast-collection-rarity-group">
                <span className="beast-collection-rarity-label" style={{ color: BEAST_TIER_INFO[tier].color }}>
                  {BEAST_TIER_INFO[tier].label} ({collectedIds.size}/{beasts.length})
                </span>
                <div className="beast-collection-grid">
                  {beasts.map(beast => {
                    const isCollected = collectedIds.has(beast.id);
                    const instance = tierCollected.find(c => c.beastId === beast.id);
                    return (
                      <div
                        key={beast.id}
                        className={`beast-collection-card ${isCollected ? 'collected' : 'locked'}`}
                        style={isCollected ? { '--tier-color': BEAST_TIER_INFO[beast.tier].color } as React.CSSProperties : undefined}
                        onClick={isCollected ? () => { playClickSound(); setSelectedBeast(beast); } : undefined}
                        role={isCollected ? 'button' : undefined}
                      >
                        <span className="beast-collection-emoji">{isCollected ? beast.emoji : '❓'}</span>
                        <span className="beast-collection-name">{isCollected ? beast.name : '???'}</span>
                        {isCollected && beast.power && (
                          <span className="beast-collection-power">{beast.power}</span>
                        )}
                        {isCollected && <span className="beast-interact-hint">Tap to interact</span>}
                        {isCollected && instance && (
                          <span className="beast-collection-date">
                            {new Date(instance.collectedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBeast && (
        <BeastInteractionModal beast={selectedBeast} onClose={() => setSelectedBeast(null)} />
      )}
    </div>
  );
}
