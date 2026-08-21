# Thrive JoCo 13 — App Challenge 2026

A habit-tracking app for Johnston County District 13 that helps you build healthy habits, reach goals, explore local places, earn badges, and grow as a community. Tagline: **Rise together — build habits, reach goals, then explore Johnston County and grow as a community.**

## Version History

- **Version 1** — Core app: goals, pathways, badges, and community tabs
- **Version 2** — Added the interactive map tab with goal location pins
- **Version 3** — Added log & verify system with date/time, verifier name, location, and notes. Added private location option to hide home or personal addresses from the map.

## How Each Tab Works

### Goals Tab

This is where you track your daily activities as goals. You can start a new goal by giving it a name, description, a target count (how many times you want to do it), and a location. You can also pick a pathway first to get ready-made goal suggestions tailored to that pathway.

Each goal card shows your progress toward the target and your current day streak. When you tap "Log & Verify," a verification form opens where you enter the date, time, who confirmed you did it, where it happened, and an optional note. Only verified logs count toward your progress, streaks, and level.

You can also tap "Show log history" on any goal to see the full audit trail of every log with its verification details.

#### Private location option

If a goal happens at a private place like home, you can check **"Private location"** when creating it. This hides the goal's marker and address from the map — the goal still tracks normally, and you can log, verify, and earn badges for it, but its location never appears on the shared map. You can toggle this on or off from the suggestion list (click the lock icon) or from the new goal form.

### Pathways Tab

Pathways are categories that group goals together, like Sustainability, Reading, Fitness Basics, or Hydration. Each pathway has an icon and color. You can pick a pathway to filter which goals you see, and when you have a pathway selected and go to start a new goal, you get suggestions specific to that pathway (like "Recycle at the Convenience Center" for Sustainability). You can also create your own custom pathways with your own icon and color.

### Badges Tab

Badges are achievements you earn by building goals. Each badge has a tier — bronze, silver, gold, or platinum — and shows whether it's earned or still locked. You earn badges automatically based on your goal progress (like a 7-day recycling streak, walking 30 times, or reaching level 5). When you earn a badge, it unlocks a reward that's shown on the badge card. You can also create your own custom badges.

The badge screen has two views: a grid view showing all badges as cards, and a map view showing badges arranged by tier in a progression path with connectors between them.

### Community Tab

This is a shared message board where you and others can post updates about your goals, like "Just finished my 5th walk on the Neuse River Greenway." Each post shows the author, a category, and how long ago it was posted. You can "cheer" posts to encourage others, and you can set your display name so your posts show who you are.

### Map Tab

This shows all your goal locations as pins on an interactive map of Johnston County. Private goals don't appear here. You can tap any pin to see the goal name, address, and progress. From the Goals tab, tapping the map icon on a goal card flies the map to that goal's location. The map view also has a list of location cards above it — tap one to jump to that spot on the map.

## Verification System

Every goal log requires verification before it counts. This safeguard ensures each record is honest and traceable. Each log records:

- **Date and time** — when the activity happened
- **Verified by** — the name of the person confirming the goal was completed
- **Where** — the location where it took place
- **Note** — optional extra details

Only verified logs count toward streaks, goal completion, level progression, and badge earnings.

## Privacy

When creating a goal at a private location (like home), you can check "Private location" to hide it from the map. The goal still tracks normally — you can log, verify, and earn badges for it — but its marker and address never appear on the shared map.

## Tech Stack

- React + TypeScript
- Vite
- React Leaflet + Leaflet (interactive maps)
- LocalStorage (data persistence)
