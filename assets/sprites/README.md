# Pixel Office sprite assets

**These PNGs are git-ignored on purpose — do not remove them from `.gitignore`.**
They're chibi character art from two free CraftPix packs. CraftPix's free license permits use in personal/commercial projects, but explicitly forbids redistributing the raw asset files in any way that makes them extractable by another end user — which committing them to this public GitHub repo would do. See https://craftpix.net/file-licenses/. They exist only on this machine; anyone else cloning the repo gets the plain colored-square fallback until they add their own.

## Current mapping

| File | Agent | Role label | Source |
|---|---|---|---|
| `pm.png` | ARIES | PM_Agent | CraftPix "Free Tribal Warrior Boss Characters" — Nordic Leader |
| `dev.png` | TAURUS | Dev_Agent | CraftPix "Free Chibi Dark Oracle Character Sprites" — Dark Oracle 1 |
| `qa.png` | VIRGO | QA_Agent | CraftPix "Free Chibi Dark Oracle Character Sprites" — Dark Oracle 2 |
| `design.png` | LIBRA | Design_Agent | CraftPix "Free Tribal Warrior Boss Characters" — Maya Leader |
| `intern.png` | SAGITTARIUS | Intern_Agent | CraftPix "Free Tribal Warrior Boss Characters" — Aztec Leader |

Each is a single static "Idle" frame pulled from the pack's PNG Sequences folder (no walk-cycle animation yet). Dark Oracle 3 is unused — a spare if a 6th role/agent is ever added.

## Spec

* Transparent-background PNG. Source canvases are large (e.g. 900×900) with padding around the character — `background-size: contain` in `style.css` handles the scaling, no manual resizing needed.
* Rendered with plain smooth scaling (not `image-rendering: pixelated`) since this is cel-shaded chibi art, not retro pixel art.

Until a file exists for a given role, that agent falls back to a plain colored square with its initials — the office still works, it just looks plainer.

To change which agent maps to which role, or swap in different source art, edit `AGENT_JOB_TYPES` at the top of `scripts/pixel-office.js` and drop a same-named PNG here.
