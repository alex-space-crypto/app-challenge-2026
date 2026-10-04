import * as React from 'react';
import type { Habit, HabitLog, Badge, Topic, CommunityPost, Profile, AuthUser } from './types';
import { calcStreak, totalGoalHits, totalVerifiedLogs, verifiedLogCount, verifiedLogs } from './habitUtils';
import {
  loadHabits, saveHabits, loadBadges, saveBadges,
  loadTopics, saveTopics, loadPosts, savePosts, loadProfile, saveProfile,
} from './storage';
import { auth } from './firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import TrackerTab from './components/TrackerTab';
import MapTab from './components/MapTab';
import HabitMap from './components/HabitMap';
import TopicsTab from './components/TopicsTab';
import BadgesTab from './components/BadgesTab';
import CommunityTab from './components/CommunityTab';
import InsightsPanel from './components/InsightsPanel';
import WelcomeOverlay from './components/WelcomeOverlay';
import { JoCoMissionBanner } from './components/JoCoMissionBanner';
import LoginScreen from './components/LoginScreen';

type Tab = 'tracker' | 'topics' | 'badges' | 'community' | 'map';

const LEVEL_TITLES = [
  'New Neighbor', 'Getting Started', 'Thrive Builder', 'Routine Maker',
  'Consistency Pro', 'Wellness Leader', 'District Champion', 'Community Pillar',
];

const LEVEL_ICONS = ['🌱', '🌿', '⛏️', '🔨', '⚡', '🌟', '🏆', '👑'];

export default function App() {
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [habits, setHabits] = React.useState<Habit[]>(() => loadHabits());
  const [badges, setBadges] = React.useState<Badge[]>(() => loadBadges());
  const [topics, setTopics] = React.useState<Topic[]>(() => loadTopics());
  const [posts, setPosts] = React.useState<CommunityPost[]>(() => loadPosts());
  const [profile, setProfile] = React.useState<Profile>(() => loadProfile());
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<Tab>('tracker');
  const [focusLocation, setFocusLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const [confetti, setConfetti] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(() => {
    try { return !localStorage.getItem('joco-welcome-seen'); } catch { return false; }
  });
  const [showLevelInfo, setShowLevelInfo] = React.useState(false);
  const [showXpInfo, setShowXpInfo] = React.useState(false);
  const [showIconPopover, setShowIconPopover] = React.useState(false);
  const [statModal, setStatModal] = React.useState<'goals' | 'logs' | 'hits' | null>(null);
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => { if (authUser) setShowLogin(false); }, [authUser]);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAuthUser(null);
        return;
      }
      setAuthUser({
        id: user.uid,
        email: user.email ?? null,
        name: user.displayName ?? user.email?.split('@')[0] ?? null,
        phone: user.phoneNumber ?? null,
      });
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    try { await firebaseSignOut(auth); } catch { /* ignore */ }
    setAuthUser(null);
    setProfile({ name: '' });
  };

  const handleUpdateName = async (name: string) => {
    setProfile({ name });
  };

  React.useEffect(() => { saveHabits(habits); }, [habits]);
  React.useEffect(() => { saveBadges(badges); }, [badges]);
  React.useEffect(() => { saveTopics(topics); }, [topics]);
  React.useEffect(() => { savePosts(posts); }, [posts]);
  React.useEffect(() => { saveProfile(profile); }, [profile]);

  const totalLogs = totalVerifiedLogs(habits);
  const level = Math.floor(totalLogs / 5) + 1;
  const xpInLevel = totalLogs % 5;
  const xpForNext = 5;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addHabit = (name: string, desc: string, goalCount: number, lat: number, lng: number, locName: string, address: string, isPrivate: boolean) => {
    const newHabit: Habit = {
      id: 'h' + Date.now(), name, description: desc, goalCount, logs: [],
      location: { name: locName, lat, lng, address },
      isPrivate,
      createdAt: Date.now(),
    };
    setHabits(prev => [...prev, newHabit]);
    showToast(`Added "${name}" — tap the map icon to see where it is!`);
  };

  const logHabit = (id: string, verifiedBy: string, verifiedWhere: string, note: string, logDate: string, logTime: string) => {
    const dateStr = logDate || new Date().toISOString().slice(0, 10);
    const timeStr = logTime || new Date().toTimeString().slice(0, 5);
    const fullISO = new Date(`${dateStr}T${timeStr}:00`).toISOString();
    let leveledUp = false;
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      if (h.logs.some(l => l.date === dateStr && l.verified)) return h;
      const newLog: HabitLog = {
        date: dateStr,
        verified: true,
        verifiedBy: verifiedBy.trim(),
        verifiedAt: fullISO,
        verifiedWhere: verifiedWhere.trim(),
        note: note.trim(),
      };
      const newLogs = [...h.logs, newLog];
      const newTotal = totalLogs + 1;
      if (Math.floor(newTotal / 5) > Math.floor(totalLogs / 5)) {
        leveledUp = true;
      }
      if (verifiedLogCount(h) + 1 === h.goalCount) {
        showToast(`Goal complete! You did "${h.name}" ${h.goalCount} times!`);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2500);
      }
      return { ...h, logs: newLogs };
    }));
    if (leveledUp) {
      setTimeout(() => {
        showToast(`Level up! You're now level ${level + 1} — ${LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)]}`);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2500);
      }, 200);
    }
  };

  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const toggleHabitPrivate = (id: string) => setHabits(prev => prev.map(h => h.id === id ? { ...h, isPrivate: !h.isPrivate } : h));

  const addBadge = (name: string, emoji: string, description: string) => {
    const newBadge: Badge = {
      id: 'b' + Date.now(), name, description, emoji, tier: 'gold',
      earnedAt: Date.now(), custom: true,
    };
    setBadges(prev => [...prev, newBadge]);
    showToast(`Badge "${name}" created and earned!`);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  };

  const deleteBadge = (id: string) => setBadges(prev => prev.filter(b => b.id !== id));

  const addTopic = (name: string, icon: string, color: string) => {
    const newTopic: Topic = {
      id: 't' + Date.now(), name, blurb: 'Custom topic', icon, color, custom: true,
    };
    setTopics(prev => [...prev, newTopic]);
    showToast(`Pathway "${name}" added!`);
  };

  const deleteTopic = (id: string) => setTopics(prev => prev.filter(t => t.id !== id));

  const addPost = (message: string, category: string) => {
    const newPost: CommunityPost = {
      id: 'p' + Date.now(), author: profile.name || 'You', message, category,
      createdAt: Date.now(), cheers: 0,
    };
    setPosts(prev => [...prev, newPost]);
  };

  const cheerPost = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (p.cheered) return p;
      return { ...p, cheers: p.cheers + 1, cheered: true };
    }));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const focusLoc = (lat: number, lng: number) => {
    setFocusLocation({ lat, lng });
    setTab('map');
  };

  const dismissWelcome = () => {
    try { localStorage.setItem('joco-welcome-seen', '1'); } catch { /* ignore */ }
    setShowWelcome(false);
  };

  const replayWelcome = () => {
    try { localStorage.removeItem('joco-welcome-seen'); } catch { /* ignore */ }
    setShowWelcome(true);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-title-row">
            <h1><a className="header-title-link" href="https://knott.house.gov/" target="_blank" rel="noopener noreferrer" title="Visit JoCo District 13">Thrive JoCo 13</a></h1>
            <button className="replay-intro-btn" onClick={replayWelcome} title="Replay the welcome tour">
              ↻ Replay intro
            </button>
          </div>
          <div className="header-auth-row">
            {authUser ? (
              <>
                <span className="header-user-name">{authUser.name || authUser.email || 'Neighbor'}</span>
                <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <button className="login-btn-header" onClick={() => setShowLogin(true)}>Log in</button>
            )}
          </div>
          <p className="tagline">Rise together — build habits, reach goals, explore Johnston County and grow as a community.</p>
        </div>
        <JoCoMissionBanner />
        <div className="level-bar">
          <div className="level-info-row">
            <button className="level-header-clickable" onClick={() => setShowLevelInfo(true)} title="Click to see how levels work">
              <span className="level-num">
                <span className="level-num-text">Lv {level}</span>
                <span className="level-num-icon">{LEVEL_ICONS[Math.min(level - 1, LEVEL_ICONS.length - 1)]}</span>
              </span>
              <span className="level-title">{levelTitle}</span>
            </button>
          </div>
          <button className="xp-track-clickable" onClick={() => setShowXpInfo(true)} title="Click to see how your XP was earned">
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${(xpInLevel / xpForNext) * 100}%` }} />
              <span className="xp-text">{xpInLevel} / {xpForNext} XP</span>
            </div>
          </button>
          <span className="level-bar-hint">tap the level or XP bar to learn more</span>
        </div>
        <div className="header-stats">
          <button className="mini-stat mini-stat-clickable" onClick={() => setStatModal('goals')} title="See all goals">
            {habits.length} goals
          </button>
          <button className="mini-stat mini-stat-clickable" onClick={() => setStatModal('logs')} title="See all logs">
            {totalLogs} logs
          </button>
          <button className="mini-stat mini-stat-clickable" onClick={() => setStatModal('hits')} title="See completed goals">
            {totalGoalHits(habits)} goals hit
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button className={`tab ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>
          <span className="tab-icon">🎯</span><span className="tab-label">Goals</span>
        </button>
        <button className={`tab ${tab === 'topics' ? 'active' : ''}`} onClick={() => setTab('topics')}>
          <span className="tab-icon">🧭</span><span className="tab-label">Pathways</span>
        </button>
        <button className={`tab ${tab === 'badges' ? 'active' : ''}`} onClick={() => setTab('badges')}>
          <span className="tab-icon">🏅</span><span className="tab-label">Badges</span>
        </button>
        <button className={`tab ${tab === 'community' ? 'active' : ''}`} onClick={() => setTab('community')}>
          <span className="tab-icon">🤝</span><span className="tab-label">Community</span>
        </button>
        <button className={`tab ${tab === 'map' ? 'active' : ''}`} onClick={() => setTab('map')}>
          <span className="tab-icon">🗺️</span><span className="tab-label">Map</span>
        </button>
      </nav>

      <main className="main">
        {tab === 'tracker' && (
          <>
          <InsightsPanel habits={habits} level={level} />
          <TrackerTab
            habits={habits}
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={(id) => { setSelectedTopic(id || null); }}
            onAddTopic={addTopic}
            onAddHabit={addHabit}
            onLogHabit={logHabit}
            profileName={profile.name}
            onDeleteHabit={deleteHabit}
            onTogglePrivate={toggleHabitPrivate}
            onFocusLocation={focusLoc}
          />
          </>
        )}
        {tab === 'topics' && (
          <TopicsTab
            topics={topics}
            selected={selectedTopic}
            onSelect={setSelectedTopic}
            onAdd={addTopic}
            onDelete={deleteTopic}
          />
        )}
        {tab === 'badges' && (
          <BadgesTab
            badges={badges}
            habits={habits}
            level={level}
            onAddBadge={addBadge}
            onDeleteBadge={deleteBadge}
            onRewardEarned={(badgeName, rewardTitle) => {
              showToast(`Reward earned for "${badgeName}" — ${rewardTitle}!`);
              setConfetti(true);
              setTimeout(() => setConfetti(false), 2500);
            }}
          />
        )}
        {tab === 'community' && (
          <CommunityTab
            posts={posts}
            profile={profile}
            onAddPost={addPost}
            onCheer={cheerPost}
            onDeletePost={deletePost}
            onProfileName={handleUpdateName}
          />
        )}
        {tab === 'map' && (
          <>
            <MapTab habits={habits} onFocusLocation={focusLoc} />
            <div className="map-wrapper">
              <HabitMap habits={habits} focusLocation={focusLocation} />
            </div>
          </>
        )}
      </main>

      {statModal && (
        <div className="level-info-overlay" onClick={() => setStatModal(null)}>
          <div className="level-info-modal" onClick={e => e.stopPropagation()}>
            <button className="welcome-skip" onClick={() => setStatModal(null)}>Close ✕</button>
            <div className="level-info-hero">
              <span className="level-info-big-num">
                {statModal === 'goals' ? habits.length : statModal === 'logs' ? totalLogs : totalGoalHits(habits)}
              </span>
              <span className="level-info-big-title">
                {statModal === 'goals' ? 'Goals' : statModal === 'logs' ? 'Verified Logs' : 'Goals Hit'}
              </span>
            </div>

            {statModal === 'goals' && (
              habits.length === 0 ? (
                <p className="level-info-explain">You haven't created any goals yet. Head to the Goals tab to start your first one!</p>
              ) : (
                <div className="stat-list">
                  {habits.map(h => (
                    <div key={h.id} className="stat-list-row">
                      <span className="stat-list-icon">🎯</span>
                      <div className="stat-list-main">
                        <span className="stat-list-name">{h.name}</span>
                        <span className="stat-list-sub">{verifiedLogCount(h)} / {h.goalCount} done{h.location ? ` · ${h.location.name}` : ''}</span>
                      </div>
                      <span className={`stat-list-badge ${verifiedLogCount(h) >= h.goalCount ? 'complete' : ''}`}>
                        {verifiedLogCount(h) >= h.goalCount ? '✓ hit' : 'in progress'}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}

            {statModal === 'logs' && (
              totalLogs === 0 ? (
                <p className="level-info-explain">No verified logs yet. Log a goal from the Goals tab to earn XP!</p>
              ) : (
                <div className="stat-list">
                  {habits.filter(h => verifiedLogCount(h) > 0).flatMap(h =>
                    verifiedLogs(h).map((log, i) => ({ habit: h, log, key: `${h.id}-${i}` }))
                  )
                  .sort((a, b) => b.log.verifiedAt.localeCompare(a.log.verifiedAt))
                  .map(({ habit, log, key }) => (
                    <div key={key} className="stat-list-row">
                      <span className="stat-list-icon">📋</span>
                      <div className="stat-list-main">
                        <span className="stat-list-name">{habit.name}</span>
                        <span className="stat-list-sub">
                          {log.date}{log.verifiedBy ? ` · verified by ${log.verifiedBy}` : ''}{log.verifiedWhere ? ` · ${log.verifiedWhere}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {statModal === 'hits' && (
              (() => {
                const hitHabits = habits.filter(h => verifiedLogCount(h) >= h.goalCount);
                return hitHabits.length === 0 ? (
                  <p className="level-info-explain">No goals completed yet. Keep logging — you'll get here!</p>
                ) : (
                  <div className="stat-list">
                    {hitHabits.map(h => (
                      <div key={h.id} className="stat-list-row">
                        <span className="stat-list-icon">🏆</span>
                        <div className="stat-list-main">
                          <span className="stat-list-name">{h.name}</span>
                          <span className="stat-list-sub">{verifiedLogCount(h)} / {h.goalCount} done{h.location ? ` · ${h.location.name}` : ''}</span>
                        </div>
                        <span className="stat-list-badge complete">✓ hit</span>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}

            <button className="btn-primary" onClick={() => setStatModal(null)}>Got it!</button>
          </div>
        </div>
      )}

      {showXpInfo && (
        <div className="level-info-overlay" onClick={() => setShowXpInfo(false)}>
          <div className="level-info-modal" onClick={e => e.stopPropagation()}>
            <button className="welcome-skip" onClick={() => setShowXpInfo(false)}>Close ✕</button>
            <div className="level-info-hero">
              <span className="level-info-big-num">{xpInLevel} / {xpForNext}</span>
              <span className="level-info-big-title">XP this level</span>
            </div>
            <p className="level-info-explain">
              Each verified log earns <strong>1 XP</strong>. Here's how you earned your {xpInLevel} XP{xpInLevel === 1 ? '' : 's'} toward <strong>Lv {level}</strong>.
            </p>
            {(() => {
              const recentLogs = habits
                .filter(h => verifiedLogCount(h) > 0)
                .flatMap(h => verifiedLogs(h).map((log, i) => ({ habit: h, log, key: `${h.id}-${i}` })))
                .sort((a, b) => b.log.verifiedAt.localeCompare(a.log.verifiedAt))
                .slice(0, xpInLevel);
              if (recentLogs.length === 0) {
                return <p className="level-info-explain">No verified logs yet — log a goal to earn your first XP!</p>;
              }
              return (
                <div className="stat-list">
                  {recentLogs.map(({ habit, log, key }, idx) => (
                    <div key={key} className="stat-list-row">
                      <span className="xp-coin">{xpInLevel - idx}</span>
                      <div className="stat-list-main">
                        <span className="stat-list-name">{habit.name}</span>
                        <span className="stat-list-sub">
                          {log.date}{log.verifiedBy ? ` · verified by ${log.verifiedBy}` : ''}{log.verifiedWhere ? ` · ${log.verifiedWhere}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
            <p className="level-info-tip">You need {xpForNext - xpInLevel} more verified log{xpForNext - xpInLevel === 1 ? '' : 's'} to reach Lv {level + 1} — {LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)]}.</p>
            <button className="btn-primary" onClick={() => setShowXpInfo(false)}>Got it!</button>
          </div>
        </div>
      )}

      {showLevelInfo && (
        <div className="level-info-overlay" onClick={() => setShowLevelInfo(false)}>
          <div className="level-info-modal" onClick={e => e.stopPropagation()}>
            <button className="welcome-skip" onClick={() => setShowLevelInfo(false)}>Close ✕</button>
            <div className="level-info-hero">
              <span className="level-info-big-num">Lv {level}</span>
              <span className="level-info-big-title">{levelTitle}</span>
            </div>
            <p className="level-info-explain">
              Every time you log a verified goal, you earn <strong>1 XP</strong>. Every <strong>5 XP</strong> you level up and unlock a new title. Keep logging to climb the ladder!
            </p>
            <div className="level-ladder-bar level-ladder-bar-modal">
              {LEVEL_TITLES.map((title, i) => {
                const lvl = i + 1;
                const isCurrent = lvl === level;
                const isPast = lvl < level;
                return (
                  <span
                    key={i}
                    className={`level-ladder-icon ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
                    title={`Lv ${lvl} — ${title}`}
                  >
                    {LEVEL_ICONS[i]}
                  </span>
                );
              })}
            </div>
            <div className="level-ladder">
              {LEVEL_TITLES.map((title, i) => {
                const lvl = i + 1;
                const isCurrent = lvl === level;
                const isPast = lvl < level;
                const xpStart = i * 5;
                return (
                  <div key={i} className={`level-ladder-row ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}>
                    <span className="level-ladder-num">{lvl}</span>
                    <span className="level-ladder-row-icon">{LEVEL_ICONS[i]}</span>
                    <span className="level-ladder-title">{title}</span>
                    <span className="level-ladder-xp">{xpStart}+ XP</span>
                    {isCurrent && <span className="level-ladder-you">you are here</span>}
                    {isPast && <span className="level-ladder-check">✓</span>}
                  </div>
                );
              })}
            </div>
            <p className="level-info-tip">You need {(level * 5) - totalLogs} more verified log{(level * 5) - totalLogs === 1 ? '' : 's'} to reach {LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)]}.</p>
            <button className="btn-primary" onClick={() => setShowLevelInfo(false)}>Got it!</button>
          </div>
        </div>
      )}

      {showWelcome && (
        <WelcomeOverlay
          onClose={dismissWelcome}
          onPickPathway={() => { dismissWelcome(); setTab('tracker'); }}
        />
      )}

      {toast && (
        <div className="toast">
          <span className="toast-emoji">🎉</span>
          {toast}
        </div>
      )}

      {confetti && (
        <div className="confetti-layer">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#3b82f6','#3ba55d','#f0a93b','#e05656','#60a5fa'][i % 5],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-overlay-inner" onClick={e => e.stopPropagation()}>
            <button className="login-overlay-close" onClick={() => setShowLogin(false)}>✕</button>
            <LoginScreen embedded />
          </div>
        </div>
      )}
    </div>
  );
}
