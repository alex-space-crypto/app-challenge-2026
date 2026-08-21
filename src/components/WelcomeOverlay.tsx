import * as React from 'react';
import { JOCO_MISSION, CORE_VALUES } from '../joco';

interface Props {
  onClose: () => void;
  onPickPathway: () => void;
}

const STEPS = ['welcome', 'mission', 'how', 'levels', 'start'] as const;
type Step = typeof STEPS[number];

const LEVEL_ICONS = ['🌱', '🌿', '⛏️', '🔨', '⚡', '🌟', '🏆', '👑'];

const LEVEL_TITLES = [
  'New Neighbor', 'Getting Started', 'Thrive Builder', 'Routine Maker',
  'Consistency Pro', 'Wellness Leader', 'District Champion', 'Community Pillar',
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
