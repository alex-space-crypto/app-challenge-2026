import * as React from 'react';
import { JOCO_MISSION, CORE_VALUES } from '../joco';
import { ANIMALS, RARITY_INFO, type CollectibleAnimal, type AnimalInteraction } from '../collectibles';
import { BEASTS, BEAST_TIER_INFO, type Beast, type BeastAbility } from '../beasts';

interface Props {
  onClose: () => void;
  onPickPathway: () => void;
}

const STEPS = ['welcome', 'mission', 'how', 'levels', 'creatures', 'start'] as const;
type Step = typeof STEPS[number];

const LEVEL_ICONS = ['🌱', '🌿', '⛏️', '🔨', '⚡', '🌟', '🏆', '👑'];

const LEVEL_TITLES = [
  'New Neighbor', 'Getting Started', 'Thrive Builder', 'Routine Maker',
  'Consistency Pro', 'Wellness Leader', 'District Champion', 'Community Pillar',
];

const SHOWCASE_ANIMALS: CollectibleAnimal[] = [
  ANIMALS.find(a => a.id === 'cardinal')!,
  ANIMALS.find(a => a.id === 'fox')!,
  ANIMALS.find(a => a.id === 'dragon')!,
];

const SHOWCASE_BEASTS: Beast[] = [
  BEASTS.find(b => b.id === 'mud-pup')!,
  BEASTS.find(b => b.id === 'storm-hawk')!,
  BEASTS.find(b => b.id === 'cosmic-leo')!,
];

export default function WelcomeOverlay({ onClose, onPickPathway }: Props) {
  const [step, setStep] = React.useState<Step>('welcome');
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const prev = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleFinish = () => {
    setDismissed(true);
    onPickPathway();
  };

  const handleSkip = () => {
    setDismissed(true);
    onClose();
  };

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <button className="welcome-skip" onClick={handleSkip} title="Skip intro">Skip →</button>

        {step === 'welcome' && (
          <div className="welcome-step">
            <div className="welcome-hero-emoji">🌱</div>
            <h2>Welcome to Thrive JoCo 13</h2>
            <p className="welcome-body">
              Build healthy habits, reach goals, explore Johnston County, and grow as a community.
              This app was built for <strong>District 13</strong> — Johnston County, NC.
            </p>
            <p className="welcome-body welcome-body-dim">
              Track daily goals, verify each one, earn badges, and see your progress on an interactive
              map of local places you actually visit.
            </p>
          </div>
        )}

        {step === 'mission' && (
          <div className="welcome-step">
            <div className="welcome-hero-emoji">🏛️</div>
            <h2>Our County's Mission</h2>
            <p className="welcome-mission-quote">&ldquo;{JOCO_MISSION}&rdquo;</p>
            <p className="welcome-body welcome-body-dim">— Johnston County Board of Commissioners</p>
            <div className="welcome-values">
              {CORE_VALUES.slice(0, 4).map(v => (
                <div key={v.title} className="welcome-value-chip">
                  <span className="welcome-value-icon">{v.icon}</span>
                  <span className="welcome-value-title">{v.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'how' && (
          <div className="welcome-step">
            <div className="welcome-hero-emoji">🎯</div>
            <h2>How it works</h2>
            <div className="welcome-how-steps">
              <div className="welcome-how-item">
                <span className="welcome-how-num">1</span>
                <div>
                  <strong>Pick a pathway</strong>
                  <p>Choose a category like Sustainability, Fitness, or Community Service.</p>
                </div>
              </div>
              <div className="welcome-how-item">
                <span className="welcome-how-num">2</span>
                <div>
                  <strong>Start a goal</strong>
                  <p>Get tailored suggestions or write your own. Each goal has a target count.</p>
                </div>
              </div>
              <div className="welcome-how-item">
                <span className="welcome-how-num">3</span>
                <div>
                  <strong>Log & verify</strong>
                  <p>Record when you do it, who confirmed it, and where. Only verified logs count.</p>
                </div>
              </div>
              <div className="welcome-how-item">
                <span className="welcome-how-num">4</span>
                <div>
                  <strong>Earn badges & level up</strong>
                  <p>Hit streaks, complete goals, and unlock rewards. See your progress on the map.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'levels' && (
          <div className="welcome-step">
            <div className="welcome-hero-emoji">📈</div>
            <h2>Earn XP & level up</h2>
            <p className="welcome-body">
              Every time you log a verified goal, you earn <strong>1 XP</strong>. Every <strong>5 XP</strong>
              you level up and unlock a new title. You can always tap your level bar at the top of the
              screen to see where you stand.
            </p>
            <div className="welcome-level-ladder">
              {LEVEL_TITLES.map((title, i) => (
                <div key={i} className="welcome-level-row">
                  <span className="welcome-level-num">{i + 1}</span>
                  <span className="welcome-level-icon">{LEVEL_ICONS[i]}</span>
                  <span className="welcome-level-title">{title}</span>
                  <span className="welcome-level-xp">{i * 5} XP</span>
                </div>
              ))}
            </div>
            <p className="welcome-body welcome-body-dim">
              You start as a <strong>New Neighbor</strong> at Level 1. Log 5 goals to become a
              <strong> Getting Started</strong> neighbor, and keep climbing all the way to
              <strong> Community Pillar</strong>.
            </p>
          </div>
        )}

        {step === 'creatures' && (
          <div className="welcome-step">
            <div className="welcome-hero-emoji">🐾</div>
            <h2>Collect & interact with creatures</h2>
            <p className="welcome-body">
              Every time you log a verified goal, you discover a creature. <strong>Pet, feed, and play</strong>
              with each one for fun reactions.
            </p>
            <div className="welcome-creatures-section">
              <span className="welcome-creatures-label">Animals of Johnston County</span>
              <div className="welcome-creatures-row">
                {SHOWCASE_ANIMALS.map(animal => (
                  <CreaturePreview
                    key={animal.id}
                    emoji={animal.emoji}
                    name={animal.name}
                    rarityLabel={RARITY_INFO[animal.rarity].label}
                    color={RARITY_INFO[animal.rarity].color}
                    glow={RARITY_INFO[animal.rarity].glow}
                    actions={animal.interactions}
                  />
                ))}
              </div>
            </div>
            <div className="welcome-creatures-section">
              <span className="welcome-creatures-label">Beasts with powers</span>
              <div className="welcome-creatures-row">
                {SHOWCASE_BEASTS.map(beast => (
                  <CreaturePreview
                    key={beast.id}
                    emoji={beast.emoji}
                    name={beast.name}
                    rarityLabel={BEAST_TIER_INFO[beast.tier].label}
                    color={BEAST_TIER_INFO[beast.tier].color}
                    glow={BEAST_TIER_INFO[beast.tier].glow}
                    actions={beast.abilities}
                  />
                ))}
              </div>
            </div>
            <p className="welcome-body welcome-body-dim">
              Tap any action button below a creature to see how they react!
            </p>
          </div>
        )}

        {step === 'start' && (
          <div className="welcome-step">
            <div className="welcome-hero-emoji">🚀</div>
            <h2>Ready to thrive?</h2>
            <p className="welcome-body">
              Let's pick a pathway and start your first goal. You can always change it later.
            </p>
            <p className="welcome-body welcome-body-dim">
              You'll also find a <strong>County Challenge</strong> in the Community tab where everyone's
              verified hours add up toward a shared Johnston County goal.
            </p>
          </div>
        )}

        <div className="welcome-nav">
          <div className="welcome-dots">
            {STEPS.map((s, i) => (
              <span key={s} className={`welcome-dot ${i === stepIdx ? 'active' : ''}`} />
            ))}
          </div>
          <div className="welcome-nav-buttons">
            {stepIdx > 0 && <button className="welcome-btn-secondary" onClick={prev}>Back</button>}
            {stepIdx < STEPS.length - 1 ? (
              <button className="welcome-btn-primary" onClick={next}>Next</button>
            ) : (
              <button className="welcome-btn-primary" onClick={handleFinish}>Start thriving →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CreaturePreviewAction {
  label: string;
  icon: string;
  response: string;
  reaction: string;
}

function CreaturePreview({
  emoji,
  name,
  rarityLabel,
  color,
  glow,
  actions,
}: {
  emoji: string;
  name: string;
  rarityLabel: string;
  color: string;
  glow: string;
  actions: CreaturePreviewAction[];
}) {
  const [response, setResponse] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState('');
  const [emojiClass, setEmojiClass] = React.useState('');

  const handleAction = (action: CreaturePreviewAction) => {
    setResponse(action.response);
    setReaction(action.reaction);
    setEmojiClass(action.reaction);
    setTimeout(() => setEmojiClass(''), 1500);
  };

  return (
    <div
      className="welcome-creature-card"
      style={{ '--creature-color': color, '--creature-glow': glow } as React.CSSProperties}
    >
      <span
        className="welcome-creature-rarity"
        style={{ color, borderColor: color }}
      >
        {rarityLabel}
      </span>
      <span className={`welcome-creature-emoji ${emojiClass}`} style={{ '--creature-color': color } as React.CSSProperties}>
        {emoji}
      </span>
      <span className="welcome-creature-name">{name}</span>
      <div className="welcome-creature-actions">
        {actions.slice(0, 3).map(action => (
          <button
            key={action.label}
            className="welcome-creature-action-btn"
            style={{ borderColor: color }}
            onClick={() => handleAction(action)}
          >
            <span className="welcome-creature-action-icon">{action.icon}</span>
            <span className="welcome-creature-action-label">{action.label}</span>
          </button>
        ))}
      </div>
      {response && (
        <div className={`welcome-creature-response ${reaction}`}>
          <span>{response}</span>
        </div>
      )}
    </div>
  );
}
