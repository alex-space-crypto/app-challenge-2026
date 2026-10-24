import * as React from 'react';
import type { Habit, HabitLog, Badge, Topic, CommunityPost, Profile, AuthUser } from './types';
import { calcStreak, totalGoalHits, totalVerifiedLogs, verifiedLogCount, verifiedLogs } from './habitUtils';
import {
  loadHabits, saveHabits, loadBadges, saveBadges,
  loadTopics, saveTopics, loadPosts, savePosts, loadProfile, saveProfile,
  loadCollection, saveCollection, loadBeasts, saveBeasts,
  loadCollectionFromSupabase, saveCollectionToSupabase,
  loadBeastsFromSupabase, saveBeastsToSupabase,
} from './storage';
import type { CollectibleAnimal, CollectedAnimal } from './collectibles';
import { rollAnimal, isAlreadyCollected } from './collectibles';
import { RewardPopup, CollectionViewer } from './components/RewardPopup';
import type { BeastTier, CollectedBeast } from './beasts';
import { BeastEggPopup, BeastCollectionViewer } from './components/BeastEggPopup';
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
import PrivacyPolicy from './components/PrivacyPolicy';

type Tab = 'community' | 'tracker' | 'topics' | 'badges' | 'map';

const LEVEL_TITLES = [
  'New Neighbor', 'Getting Started', 'Thrive Builder', 'Routine Maker',
  'Consistency Pro', 'Wellness Leader', 'District Champion', 'Community Pillar',
];

const LEVEL_ICONS = ['🌱', '🌿', '⛏️', '🔨', '⚡', '🌟', '🏆', '👑'];

export default function App() {
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = React.useState(false);
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [badges, setBadges] = React.useState<Badge[]>([]);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [profile, setProfile] = React.useState<Profile>({ name: '' });
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<Tab>('community');
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
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [collection, setCollection] = React.useState<CollectedAnimal[]>([]);
  const [rewardPopup, setRewardPopup] = React.useState<{ animal: CollectibleAnimal; isNew: boolean; habitName: string } | null>(null);
  const [showCollection, setShowCollection] = React.useState(false);
  const [beasts, setBeasts] = React.useState<CollectedBeast[]>([]);
  const [beastEggPopup, setBeastEggPopup] = React.useState<{ source: string } | null>(null);
  const [showBeastCollection, setShowBeastCollection] = React.useState(false);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthReady(true);
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
  };

  const handleUpdateName = async (name: string) => {
    setProfile({ name });
  };

  const [dataLoaded, setDataLoaded] = React.useState(false);

  React.useEffect(() => { if (authUser && dataLoaded) saveHabits(habits); }, [habits, authUser, dataLoaded]);
  React.useEffect(() => { if (authUser && dataLoaded) saveBadges(badges); }, [badges, authUser, dataLoaded]);
  React.useEffect(() => { if (authUser && dataLoaded) saveTopics(topics); }, [topics, authUser, dataLoaded]);
  React.useEffect(() => { if (authUser && dataLoaded) savePosts(posts); }, [posts, authUser, dataLoaded]);
  React.useEffect(() => { if (authUser && dataLoaded) saveProfile(profile); }, [profile, authUser, dataLoaded]);
  React.useEffect(() => { if (authUser && dataLoaded) saveCollection(collection); }, [collection, authUser, dataLoaded]);
  React.useEffect(() => { if (authUser && dataLoaded) saveBeasts(beasts); }, [beasts, authUser, dataLoaded]);

  // Load from localStorage when user signs in; clear when they sign out
  React.useEffect(() => {
    if (!authUser) {
      setDataLoaded(false);
      setHabits([]); setBadges([]); setTopics([]); setPosts([]);
      setProfile({ name: '' }); setCollection([]); setBeasts([]);
      return;
    }
    setHabits(loadHabits()); setBadges(loadBadges()); setTopics(loadTopics());
    setPosts(loadPosts()); setProfile(loadProfile());
    setCollection(loadCollection()); setBeasts(loadBeasts());
    setDataLoaded(true);
  }, [authUser]);

  // When user logs in, load their collection & beasts from Supabase
  const [cloudLoaded, setCloudLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!authUser) { setCloudLoaded(false); return; }
    let cancelled = false;
    (async () => {
      const [cloudCollection, cloudBeasts] = await Promise.all([
        loadCollectionFromSupabase(authUser.id),
        loadBeastsFromSupabase(authUser.id),
      ]);
      if (cancelled) return;
      // Merge: keep local entries, add any cloud-only entries
      setCollection(prev => {
        const localIds = new Set(prev.map(c => c.animalId));
        const merged = [...prev];
        for (const c of cloudCollection) {
          if (!localIds.has(c.animalId)) merged.push(c);
        }
        return merged;
      });
      setBeasts(prev => {
        const localKeys = new Set(prev.map(b => `${b.beastId}-${b.tier}`));
        const merged = [...prev];
        for (const b of cloudBeasts) {
          if (!localKeys.has(`${b.beastId}-${b.tier}`)) merged.push(b);
        }
        return merged;
      });
      setCloudLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [authUser]);

  // After cloud load, sync any new local items up to Supabase
  React.useEffect(() => {
    if (!authUser || !cloudLoaded) return;
    saveCollectionToSupabase(authUser.id, collection);
  }, [authUser, cloudLoaded, collection]);
  React.useEffect(() => {
    if (!authUser || !cloudLoaded) return;
    saveBeastsToSupabase(authUser.id, beasts);
  }, [authUser, cloudLoaded, beasts]);

  if (!authUser) {
    return <LoginScreen />;
  }

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
    let loggedHabitName = '';
    let actuallyLogged = false;
    const suspiciousLogs: string[] = [];
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      if (h.logs.some(l => l.date === dateStr && l.verified)) return h;
      loggedHabitName = h.name;
      actuallyLogged = true;
      const recentSame = h.logs.filter(l =>
        l.verifiedBy.toLowerCase() === verifiedBy.trim().toLowerCase() &&
        Math.abs(new Date(l.verifiedAt).getTime() - new Date(fullISO).getTime()) < 120000
      );
      if (recentSame.length > 0) {
        suspiciousLogs.push(h.name);
      }
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
        setTimeout(() => setBeastEggPopup({ source: `Goal: ${h.name}` }), 800);
      }
      return { ...h, logs: newLogs };
    }));
    if (suspiciousLogs.length > 0) {
      showToast(`⚠️ Suspicious pattern detected: "${verifiedBy}" verified multiple logs within 2 minutes for ${suspiciousLogs.join(', ')}.`);
    }
    if (leveledUp) {
      setTimeout(() => {
        showToast(`Level up! You're now level ${level + 1} — ${LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)]}`);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2500);
      }, 200);
    }
    if (actuallyLogged) {
      const animal = rollAnimal();
      const isNew = !isAlreadyCollected(collection, animal.id);
      if (isNew) {
        setCollection(prev => [...prev, { animalId: animal.id, collectedAt: Date.now(), fromHabit: loggedHabitName }]);
      }
      setTimeout(() => {
        setRewardPopup({ animal, isNew, habitName: loggedHabitName });
      }, 500);
    }
  };

  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const toggleHabitPrivate = (id: string) => setHabits(prev => prev.map(h => h.id === id ? { ...h, isPrivate: !h.isPrivate } : h));

  const addBadge = (name: string, emoji: string, description: string) => {
    const newBadge: Badge = {
      id: 'b' + Date.now(), name, description, emoji, tier: 'gold',
      custom: true,
    };
    setBadges(prev => [...prev, newBadge]);
    showToast(`Badge "${name}" created — now earn it by logging your goals!`);
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

  const reportPost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, reported: true } : p));
    showToast('Post reported. A moderator will review it. Thank you for keeping our community safe.');
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
            <button className="collection-btn-header" onClick={() => setShowCollection(true)} title="View your animal collection">
              🦊 Collection
              <span className="collection-btn-count">{collection.length}</span>
            </button>
            <button className="beast-btn-header" onClick={() => setShowBeastCollection(true)} title="View your beast collection">
              🐲 Beasts
              <span className="beast-btn-count">{beasts.length}</span>
            </button>
            {authUser && (
              <>
                <span className="header-user-name">{authUser.name || authUser.email || 'Neighbor'}</span>
                <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
              </>
            )}
          </div>
          <p className="tagline">Rise together — help a neighbor, join a challenge, build habits that matter, reach goals and grow our community.</p>
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
        <button className={`tab ${tab === 'community' ? 'active' : ''}`} onClick={() => setTab('community')}>
          <span className="tab-icon">🤝</span><span className="tab-label">Community</span>
        </button>
        <button className={`tab ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>
          <span className="tab-icon">🎯</span><span className="tab-label">Goals</span>
        </button>
        <button className={`tab ${tab === 'topics' ? 'active' : ''}`} onClick={() => setTab('topics')}>
          <span className="tab-icon">🧭</span><span className="tab-label">Pathways</span>
        </button>
        <button className={`tab ${tab === 'badges' ? 'active' : ''}`} onClick={() => setTab('badges')}>
          <span className="tab-icon">🏅</span><span className="tab-label">Badges</span>
        </button>
        <button className={`tab ${tab === 'map' ? 'active' : ''}`} onClick={() => setTab('map')}>
          <span className="tab-icon">🗺️</span><span className="tab-label">Map</span>
        </button>
      </nav>

      <main className="main">
        {tab === 'community' && (
          <CommunityTab
            posts={posts}
            profile={profile}
            habits={habits}
            onAddPost={addPost}
            onCheer={cheerPost}
            onDeletePost={deletePost}
            onReportPost={reportPost}
            onProfileName={handleUpdateName}
          />
        )}
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
              setTimeout(() => setBeastEggPopup({ source: `Badge: ${badgeName}` }), 800);
            }}
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

      <footer className="app-footer">
        <button className="footer-link" onClick={() => setShowPrivacy(true)}>
          Privacy Policy
        </button>
      </footer>

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

      {showWelcome && authUser && (
        <WelcomeOverlay
          onClose={dismissWelcome}
          onPickPathway={() => { dismissWelcome(); setTab('tracker'); }}
        />
      )}

      {showPrivacy && (
        <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
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
      {rewardPopup && (
        <RewardPopup
          animal={rewardPopup.animal}
          isNew={rewardPopup.isNew}
          habitName={rewardPopup.habitName}
          onCollect={() => setRewardPopup(null)}
        />
      )}

      {showCollection && (
        <CollectionViewer
          collected={collection}
          onClose={() => setShowCollection(false)}
        />
      )}

      {beastEggPopup && (
        <BeastEggPopup
          source={beastEggPopup.source}
          collectedBeasts={beasts}
          onConfirm={(beastId, tier, isNew) => {
            if (isNew) {
              setBeasts(prev => [...prev, { beastId, tier, collectedAt: Date.now(), source: beastEggPopup!.source }]);
            }
            setBeastEggPopup(null);
          }}
        />
      )}

      {showBeastCollection && (
        <BeastCollectionViewer
          collected={beasts}
          onClose={() => setShowBeastCollection(false)}
        />
      )}
    </div>
  );
}
