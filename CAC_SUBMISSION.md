# Thrive JoCo 13 — Congressional App Challenge Submission Write-Up
## Answers for the CAC Submission Form

---

## App Name

Thrive JoCo 13

---

## Team Members

[List your name(s) here]

---

## Congressional District

NC13 — Rep. Brad Knott

---

## App Description (Short)

Thrive JoCo 13 is a habit-tracking and community wellness app built for Johnston County, North Carolina. It helps residents set health goals tied to real local places, verify their progress with accountability partners, earn badges and rewards, explore an interactive county map, and support each other through a community board and volunteer help network. Every verified activity contributes to a county-wide impact dashboard showing the collective effort of District 13 neighbors.

---

## Purpose of the App

Many Johnston County residents want to be healthier but don't know where to start or have no one to keep them accountable. Fitness apps treat goals as private checklists. Social apps reward posting, not doing. Nothing connects personal wellness to the actual places and people of our county.

Thrive JoCo 13 solves this by turning wellness into a shared, local, verified experience. You pick a pathway, set a goal tied to a real place in Johnston County, log it with a verifier who confirms you did it, earn badges and rewards, see your progress on a community map, and cheer on your neighbors — all in one app designed around the people and places of JoCo District 13.

---

## Who the App Is Intended For

Thrive JoCo 13 is built for the residents of Johnston County, North Carolina — students, families, seniors, and anyone who wants to build healthier habits with real accountability. It's designed so that a high school student walking the Neuse River Greenway, a parent volunteering at the food pantry, and a senior reading at the Hocutt-Ellington Library can all use the same app to track real progress in their real community.

---

## What Makes Your App Different

Three things set Thrive JoCo 13 apart from every other habit tracker:

**1. Verification — progress is honest, not self-reported.**
Every log requires a verifier name, date, time, and location before it counts. No self-reported checkmarks. Progress is traceable, with suspicious-pattern detection that flags multiple logs verified by the same person within two minutes. This changes the psychology of goal-setting — when someone else has to confirm you did it, the goal stops being a wish and becomes a commitment.

**2. Community-first design — the county comes before the individual.**
When you open the app, the first thing you see isn't your own goals. It's the Johnston County Community Impact dashboard — over 2,300 verified activities logged by neighbors, 180 goals completed, 400 community service logs, and a volunteer help board where residents can request assistance and others can sign up to help. The app is built around the idea that wellness is collective, not just personal.

**3. Local map — every goal is tied to a real place.**
Every goal is pinned to a real location in Johnston County — the Neuse River Greenway, Howell Woods, the Smithfield Farmers Market, the Hocutt-Ellington Library. The map isn't decoration; it's how residents discover where to act on their goals. Goals at private locations like home are excluded from the map entirely, so privacy is protected while the goal still tracks normally.

---

## Tools and Coding Languages Used

- **React 18 + TypeScript** — component-based UI with full type safety
- **Vite** — build tooling and development server
- **React Leaflet + Leaflet** — interactive map of Johnston County with goal location pins
- **Firebase Authentication** — secure email/password login required on launch
- **Supabase (PostgreSQL with Row Level Security)** — backend database for the community help board, volunteer tracking, county challenge, community polls, user profiles, and collectible collections
- **LocalStorage** — offline-first persistence for personal goals, badges, and pathways so the app works without a network connection

---

## How We Built It

We started by identifying a real problem in our community: people want to be healthier but lack accountability and local context. Generic fitness apps say "walk 10,000 steps" — forgettable. We wanted to say "walk the Clayton River Walk" — specific, local, and motivating.

The app is organized into five tabs, with Community first because collective impact is the core idea:

1. **Community** — county-wide impact dashboard, community board, county challenge, volunteer help board, and local resources
2. **Goals** — create goals with location, log activities with verification, track streaks and progress
3. **Pathways** — seven themed pathways (Sustainability, Reading, Fitness, Hydration, Community Service, Chores, Local Food) with 40+ goal suggestions tied to real Johnston County places
4. **Badges** — four-tier badge system (bronze, silver, gold, platinum) with category-specific rewards, plus a collectible animal system and a beast egg reward system
5. **Map** — interactive Leaflet map showing all public goal pins across Johnston County

**One hard problem we solved — private pins on a shared map:**

The map is the heart of the app, but not every goal happens at a public place. Someone exercising at home still deserves to track progress, earn badges, and level up — but their home address should never appear on a map others can see. We solved this with a per-goal privacy flag. When a goal is marked private, it is excluded from the map layer entirely while remaining fully functional in the tracker, badge, and level systems. The privacy toggle lives right in the goal creation flow, so users make the choice at the moment they set the goal.

**What we learned:**

Building for a real community taught us that wellness isn't just about tracking — it's about trust. The verification system changed how testers approached their goals. When someone else had to confirm you did it, the goal stopped being a wish and became a commitment. We also learned that local context matters: "Walk 10,000 steps" is forgettable, but "Walk the Neuse River Greenway" gets people outside.

---

## Demonstration Video URL

[Insert your YouTube public video URL here]

---

## Submission Checklist

- [ ] App is complete and functional (no broken features, no dead ends)
- [ ] Demonstration video is 1-3 minutes, uploaded to YouTube, set to Public
- [ ] Video shows: app name, your name(s), purpose, who it's for, tools used, how it works
- [ ] Video shows the full user journey: community impact → goal creation → verification → badge unlock → map
- [ ] Submission form completed on the CAC portal
- [ ] Submitted before October 26, 2026 at 12:00 PM Eastern
