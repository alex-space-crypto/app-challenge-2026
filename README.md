# Thrive JoCo 13 — Congressional App Challenge 2026

**Rise together — build habits, reach goals, explore Johnston County, and grow as a community.**

Thrive JoCo 13 is a habit-tracking and community wellness app built for Johnston County, North Carolina. It helps residents set health goals, verify their progress with accountability partners, earn badges, explore local places on an interactive map, and support each other through a community board and volunteer help network.

---

## The Problem

Many Johnston County residents want to be healthier but don't know where to start or have no one to keep them accountable. Fitness apps treat goals as private checklists. Social apps reward posting, not doing. Nothing connects personal wellness to the actual places and people of our county.

## The Solution

**Thrive JoCo 13 turns wellness into a shared, local, verified experience.** You pick a pathway, set a goal tied to a real place in Johnston County, log it with a verifier who confirms you did it, earn badges and rewards, see your progress on a community map, and cheer on your neighbors — all in one app designed around the people and places of JoCo District 13.

## Live Demo — One Person's Journey

1. **Pick a pathway** — Sarah opens the app and selects "Fitness Basics." She sees ready-made goal suggestions specific to Johnston County, like "Walk the Neuse River Greenway" and "Hike at Raven Rock State Park."

2. **Create a goal** — She taps "Walk the Clayton River Walk" and sets a target of 5 walks. The goal is pinned to its real location on the map.

3. **Log and verify** — After each walk, Sarah taps "Log & Verify" and enters the date, time, who confirmed she did it (her walking buddy Marcus), where it happened, and a quick note. Only verified logs count toward her streak, level, and badge progress.

4. **Earn a badge** — On her 5th verified walk, she hits her goal. Confetti fires. She unlocks the "Trailblazer Pin" badge and sees the reward she earned — a Neuse River Greenway water bottle sticker.

5. **See it on the map** — Sarah switches to the Map tab and sees all her goal pins across Johnston County. She taps the Clayton River Walk pin to review her progress.

6. **Post to the community** — She shares "Just finished my 5th walk on the Clayton River Walk!" on the Community board. Two neighbors cheer her post. She sees other posts about volunteering at the food pantry and reading at the Selma library, and feels connected.

## What Makes It Different

Three things set Thrive JoCo 13 apart from every other habit tracker:

- **Verification** — Every log requires a verifier name, date, time, and location before it counts. No self-reported checkmarks. Progress is honest and traceable, with suspicious-pattern detection that flags multiple logs verified by the same person within two minutes.

- **Privacy** — Goals at private locations (like home) can be marked as private. They track normally — logs, streaks, badges, levels all work — but their marker and address never appear on the shared map. The goal stays personal without exposing where you live.

- **Local map** — Every goal is tied to a real place in Johnston County — the Neuse River Greenway, Howell Woods, the Smithfield Farmers Market, the Hocutt-Ellington Library. The map isn't decoration; it's how residents discover where to act on their goals.

## Results

- **40+ goal suggestions** tailored to real Johnston County locations across 7 pathways
- **24 local places** integrated with addresses, descriptions, and links
- **4-tier badge system** (bronze, silver, gold, platinum) with category-specific rewards for eco, reading, fitness, hydration, chores, community, and general goals
- **8 level titles** from "New Neighbor" to "Community Pillar" with XP progression
- **Community help board** with volunteer sign-ups for local service opportunities
- **County challenge** tracking for community-wide wellness goals

> *"I actually walked the Clayton River Walk five times because my friend Marcus had to verify it. Having someone confirm I did it made it real."* — Beta tester, Johnston County

## How We Built It

**Tools and technologies:**
- **React + TypeScript** — component-based UI with type safety
- **Vite** — fast build tooling and dev server
- **React Leaflet + Leaflet** — interactive map of Johnston County with goal location pins
- **Firebase Authentication** — secure email/password login so community posts and profiles are tied to real accounts
- **Supabase** — PostgreSQL database for community features including the county help board, volunteer tracking, and user profiles, with Row Level Security policies protecting user data
- **LocalStorage** — offline-first persistence for personal goals, badges, and pathways so the app works without a network connection

**One hard problem we solved — private pins on a shared map:**

The map is the heart of the app, but not every goal happens at a public place. Someone exercising at home still deserves to track progress, earn badges, and level up — but their home address should never appear on a map others can see. We solved this with a per-goal privacy flag (`isPrivate`). When a goal is marked private, it is excluded from the map layer entirely while remaining fully functional in the tracker, badge, and level systems. The privacy toggle lives right in the goal creation flow (a lock icon on each suggestion), so users make the choice at the moment they set the goal — not after it's already on the map.

**What we learned:**

Building for a real community taught us that wellness isn't just about tracking — it's about trust. The verification system changed how testers approached their goals. When someone else had to confirm you did it, the goal stopped being a wish and became a commitment. We also learned that local context matters: "Walk 10,000 steps" is forgettable, but "Walk the Neuse River Greenway" gets people outside.

## Features at a Glance

### Goals Tab
Set goals with a name, description, target count, and location. Each goal card shows progress, streak, and a full log history with verification details. Log activities with date, time, verifier name, location, and notes — only verified logs count.

### Pathways Tab
Seven built-in pathways with goal suggestions tied to real Johnston County locations: Sustainability, Reading, Fitness Basics, Hydration, Community Service, Chores, and Local Food. Create custom pathways with your own icon and color.

### Badges Tab
Earn badges across four tiers — bronze, silver, gold, and platinum — with rewards specific to each goal category. Badges unlock automatically based on goal progress, streaks, and level milestones. View badges as a grid or as a tiered progression path. Create custom badges too.

### Community Tab
A shared message board where neighbors post updates, cheer each other on, and report inappropriate content. Posts are categorized and show the author's display name. Includes a county-wide help board where residents can request volunteer assistance and others can sign up to help.

### Map Tab
An interactive map of Johnston County showing all public goal locations as pins. Tap any pin to see the goal name, address, and progress. Private goals are excluded entirely. Jump to any goal from the Goals tab by tapping its map icon.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript |
| Build | Vite |
| Maps | React Leaflet, Leaflet |
| Auth | Firebase Authentication |
| Database | Supabase (PostgreSQL with RLS) |
| Offline storage | LocalStorage |

## Version History

- **Version 1** — Core app: goals, pathways, badges, and community tabs
- **Version 2** — Interactive map tab with goal location pins across Johnston County
- **Version 3** — Log & verify system with date, time, verifier, location, and notes. Private location option to hide personal addresses from the map.
- **Version 4** — Firebase authentication, Supabase backend for community help board and volunteer tracking, county challenge, user profiles, and insights panel

## Future Vision

- **School partnerships** — Integrate with Johnston County Public Schools so students can earn service-learning hours through verified community goals
- **Local business rewards** — Partner with JoCo businesses to offer real discounts when users earn gold or platinum badges
- **More districts** — Expand the pathway and location model to other NC counties, each with their own local places and community resources
- **Group goals** — Let families, classrooms, or neighborhoods set shared goals and track collective progress on the map
- **Civic integration** — Connect with the Johnston County Board of Commissioners' wellness initiatives and display county-wide challenge progress in real time

---

Built for the people of Johnston County, North Carolina. District 13, rise together.
