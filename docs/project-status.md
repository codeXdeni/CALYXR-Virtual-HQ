# CALYXR Virtual HQ

> **⚠️ This file is the single source of truth for project status.**
> If any other document, chat summary, or AI handoff disagrees with what's written here, **this file wins**. Update this file first when status changes; treat everything else (including `calyxr-hq-v1.0.md` and `calyxr-hq-v1.1-roadmap.md`) as historical record only.

Current Version: v1.0 — Pixel Office

Repository:
https://github.com/codexdeni/CALYXR-Virtual-HQ

Project Location:
F:\CALYXR_CORE\ARIES\Projects\CALYXR-Virtual-HQ

---

## Version History Reconciliation

Three separate narratives about this project's status have accumulated over time, and they disagreed with each other. Traced against `git log --reverse`, here's what actually happened, and how the conflicting docs map onto it:

1. **`calyxr-hq-v1.0.md`** — the real, shipped whole-project milestone (commit `d51eeca` "Release CALYXR HQ v1.0"), released right after the founding departments (ARIES, TAURUS, VIRGO, LIBRA, SAGITTARIUS) were first built out.
2. **`calyxr-hq-v1.1-roadmap.md`** — created immediately after (commit `c27a8ef`), listing six planned features: Shared Project Database, Progress Bars, Department Status Indicators, Dynamic Dashboard Metrics, Cross-Department Project Tracking, Interactive Command Center.
3. That roadmap was then **actually built** — the very next commits implement it feature-for-feature ("Connect HQ metrics to shared data," "Make department status board data driven," "Make roadmap panel data driven," "Create department performance engine," "Add department command console"). Partway through, the internal versioning for this dashboard layer **restarted at v0.1** and climbed independently of the "v1.0/v1.1" whole-project numbering — the v1.1 roadmap's features are what became **v0.2** (Executive Command Center, Project Tracker — Features 1 & 4), **v0.3** (Department Health Rankings — Features 2 & 3), and **v0.4** (Department Command Console — Feature 6). So the roadmap wasn't abandoned; it was absorbed into the restarted numbering, and that restarted scheme is what continued on through v0.5 → v0.9.5 (this file).
4. **This file (`project-status.md`)** is the running log of that restarted scheme from v0.5 onward, and is the canonical source of truth.
5. **A fourth, informal narrative** (from an outside ChatGPT session, not committed to the repo) claimed some features as "planned for v0.9" that were actually already built, and proposed a "Phase 5: Visual Upgrade" concept. That session also referred to a "v0.9.5 phase system" — to be clear, **v0.9.5 itself is real, shipped history** (commit `a433215`, current HEAD), not aspirational. Only the "Phase 5: Visual Upgrade" idea is aspirational/future — it has been folded into **Planned Features** below under its own heading, kept distinct from the real v0.9.5 milestone so the two aren't conflated again.

**Correction applied:** localStorage persistence (department selection, active tab, agent tasks, activity feed) was incorrectly listed as a "planned v0.9" feature in that fourth narrative. It is **already implemented**, and shipped back in v0.5 — see `script.js` (`saveData()`/`loadData()`, plus direct `localStorage` calls for `selectedDepartment` and `activeExecutiveTab`).

**Known cleanup item:** `script.js` has a leftover/duplicate persistence path — `saveAgentTasks()` / `loadAgentTasks()` write to a `calyxr-agentTasks` localStorage key, but neither function is ever called. The active path is `saveData()` / `loadData()`, which uses plain `agentTasks` / `activityFeed` keys and is called at startup and on task toggle. The dead `calyxr-agentTasks` pair should be deleted in a future pass — flagged here so it isn't mistaken for a second, intentional storage layer.

**Terminology note:** department-specific docs (`aries-v0.2.md`, `taurus-v0.2.md`, `virgo-v0.1.md`, `libra-v0.1.md`, `sagittarius-v0.1.md`) use their own independent per-page version numbers — these track each department page's own iteration and are unrelated to the overall project version tracked in this file. A department doc at "v0.2" does not correspond to overall project v0.2.

---

## Vision

CALYXR Virtual HQ is a pixel-art inspired command center for managing CALYXR Holdings, its departments, projects, and AI agents.

The system serves as the operational headquarters for the CALYXR ecosystem and eventually will become a living AI-powered office environment where agents collaborate across departments.

Theme:

* Oregon forests
* Coastal atmosphere
* Ocean breeze aesthetic
* Pixel-art inspired interface
* Executive command center feel

---

## Completed Features

### v0.1

* Initial CALYXR HQ structure
* Department pages
* Navigation system

### v0.2

* Executive Command Center
* Project Tracker
* Dynamic Project Data

### v0.3

* Department Health Rankings
* Department Status Badges
* Dynamic Ranking Calculations

### v0.4

* Department Command Console
* Clickable Department Rankings
* Dynamic Department Detail Viewer

### v0.5

* Executive Activity Feed
* Agent Command Center
* Status Pills
* Workload Bars
* Efficiency Ratings
* Auto Activity Logging
* localStorage persistence: department selection, active executive tab, agent tasks, activity feed

### v0.6

✓ Agent Recommendations Engine v0.6.1
✓ Department Intelligence Cards v0.6.2
✓ Executive Insights Engine v0.6.3
✓ Strategic Directives Engine v0.6.4

### v0.7

✓ Department Mission Briefings v0.7.0
✓ Dynamic Mission Generation v0.7.1
✓ Mission Progress Bars
✓ Department Objectives v0.7.2
✓ Department Status Indicators v0.7.3
✓ Department KPI System v0.7.4
✓ Cross Department Collaboration Engine v0.7.5

### v0.8

✓ Interactive Department Command Console v0.8.1

### v0.9

✓ Executive KPI Dashboard Cards v0.9.1
✓ Executive Dashboard Complete v0.9.5

### v1.0

✓ Pixel Office — autonomous agent simulation tab. A new "Office" tab (`index.html`, `scripts/pixel-office.js`) renders the five agents as pixel sprites in a building of rooms (one per department + a lobby). No player character — agents move on their own, driven by the existing `generateCollaborations()` logic in `script.js` (an agent with an active collaboration walks to that department's room for a few ticks, then returns home). When two agents share a room it's flagged visually and logged to the existing Executive Activity Feed. Clicking an agent shows its live role/status/task. Resets to home rooms on page load — no persistence, since this only runs while the page is open.

---

## Departments

### ARIES

Role: Executive Command

### TAURUS

Role: Development Wing

### VIRGO

Role: Knowledge Wing

### LIBRA

Role: Financial Wing

### SAGITTARIUS

Role: Strategic Planning Wing

---

## Current Data Sources

### agentTasks

Tracks:

* Department assignments
* Completion status
* Performance calculations

Persisted to localStorage (`agentTasks` key) via `saveData()` / `loadData()`.

### activityFeed

Tracks:

* Department updates
* Completed tasks
* HQ activity history

Persisted to localStorage (`activityFeed` key) via `saveData()` / `loadData()`.

### CALYXR.agents

Tracks:

* Agent role
* Status
* Priority
* Workload

---

## Current Sprint

Version: v1.1

Sprint Goal:
Expand the Pixel Office simulation (see Backlog)

---

## Planned Features

### Backlog (not yet scheduled)

* Pixel Office: pathfinding/obstacles if the building layout grows beyond direct room-to-room hops
* Pixel Office: mobile/touch-friendly layout (currently desktop-oriented, scrolls horizontally on narrow viewports)
* Agent Notes System
* Agent Memory Layer
* Project Dependency System
* Cleanup: remove dead `calyxr-agentTasks` / `saveAgentTasks()` / `loadAgentTasks()` code in `script.js`

---

## Latest Git Tag

v0.5.1

(Note: git tags lag behind the commit history above — latest tagged release is v0.5.1, but committed work has advanced to v1.0. Tagging should be caught up as part of the next release.)

---

## Last Completed Milestone

CALYXR HQ v1.0 — Pixel Office autonomous agent simulation tab
Executive Dashboard Complete v0.9.5
Executive KPI Dashboard Cards v0.9.1
