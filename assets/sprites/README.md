# Pixel Office sprite assets

**These PNGs are git-ignored on purpose — do not remove them from `.gitignore`.**
They're chibi character art from two free CraftPix packs. CraftPix's free license permits use in personal/commercial projects, but explicitly forbids redistributing the raw asset files in any way that makes them extractable by another end user — which committing them to this public GitHub repo would do. See https://craftpix.net/file-licenses/. They exist only on this machine; anyone else cloning the repo gets a plain colored-square fallback until they add their own.

## Layout

Each agent has its own folder, named by job type, holding two 6-frame animation loops:

```
assets/sprites/<jobtype>/idle-0.png … idle-5.png   (idle / thinking loop)
assets/sprites/<jobtype>/work-0.png … work-5.png   (executing-task loop)
```

| Folder | Agent | Role label | Source character | Idle sequence | Work sequence |
|---|---|---|---|---|---|
| `pm/` | ARIES | PM_Agent | CraftPix Tribal Warrior Boss — Nordic Leader | Front - Idle Blinking | Front - Attacking |
| `dev/` | TAURUS | Dev_Agent | CraftPix Chibi Dark Oracle — Dark Oracle 1 | Idle Blinking | Slashing |
| `qa/` | VIRGO | QA_Agent | CraftPix Chibi Dark Oracle — Dark Oracle 2 | Idle Blinking | Throwing |
| `design/` | LIBRA | Design_Agent | CraftPix Tribal Warrior Boss — Maya Leader | Front - Idle Blinking | Front - Attacking |
| `intern/` | SAGITTARIUS | Intern_Agent | CraftPix Tribal Warrior Boss — Aztec Leader | Front - Idle Blinking | Front - Attacking |

Each 6-frame loop is sampled evenly from the full sequence in the downloaded pack (which has many more frames than we use). Dark Oracle 3 is unused — a spare if a 6th role/agent is ever added.

Which loop plays is driven by real data: `agentStatus[name].status === "Working"` shows the `work-*` frames, anything else shows `idle-*`. Neither pack has a literal "typing at a keyboard" animation (they're RPG character packs), so the work loop is a repurposed weapon/gesture flourish — the closest available stand-in for "actively executing a task" without sourcing new art.

## Spec

* Transparent-background PNG. Source canvases are large (e.g. 900×900) with padding around the character — the room-view canvas draw code scales each frame to fit, no manual resizing needed.
* Rendered with plain smooth scaling (not `image-rendering: pixelated`) since this is cel-shaded chibi art, not retro pixel art.

Until frames exist for a given role, that agent falls back to a plain colored square in the room view — the office still works, it just looks plainer.

To change which agent maps to which role, or swap in different source art, edit `AGENT_JOB_TYPES` at the top of `scripts/pixel-office.js` and drop same-named frame files in a folder here.
