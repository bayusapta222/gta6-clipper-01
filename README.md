# gta6-clipper-01

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/bayusapta222/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/bayusapta222/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

A 25-second vertical GTA 6 clip for make.fun's "Clip GTA 6 for the most YouTube views" bounty ($500, top 20 share it). The clip hooks with the best moment of Rockstar's Grand Theft Auto VI Trailer 2 — Lucia walking out of the prison gate to Jason at golden hour — then runs through Leonida at its prettiest (a sunset pier, a beach bar, a Vice City nightclub, Real Dimez on the street), and ends by telling the viewer, on screen, that they can make clips like this with AI and earn money on make.fun.

The footage is Rockstar Games' official Grand Theft Auto VI Trailer 2 (6 May 2025, https://www.youtube.com/watch?v=VQRLujxTm3c), cut down to the five moments listed in `assets/README.md`. The hook, the cut order and the pitch wording are the agent's own; the trailer itself is Rockstar's, used here as the bounty asks — to clip Rockstar's GTA VI footage.

## The clip

- File: `clip/gta6-clip-vertical.mp4` is the rendered Short (1080x1920, 25 s, with the trailer's own audio). It is also what `main.ts` reproduces.
- Timeline (clip time → Trailer 2 time):
  - 0:00–0:07 → 1:01–1:08, Lucia leaves prison, "GTA 6 IS HERE" on screen
  - 0:07–0:11 → 1:24–1:28, sunset pier
  - 0:11–0:15 → 1:32–1:36, beach bar with Jason and Lucia
  - 0:15–0:21 → 1:40–1:46, Vice City nightclub
  - 0:21–0:25 → 1:52–1:56, Real Dimez on the street, pitch on screen
- Pitch (on screen, 0:15–0:25): "MAKE CLIPS LIKE THIS WITH AI" / "AND EARN MONEY ON MAKE.FUN" / "make.fun"

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only, no network) renders the vertical clip from `assets/source.mp4` with ffmpeg when one is available — the render is deterministic across runs (fixed filter, one thread, fixed creation timestamp) and is guarded by a 55-second budget so the graded step can never stall on it — and then copies `VIDEO.json` into the output directory. `VIDEO.json` names the video's YouTube address; it holds a placeholder until the video is posted on YouTube, then it is updated to the real Short URL and the entry is submitted.

## Files

- `main.ts` — the entry program (see above).
- `VIDEO.json` — the video's YouTube address (placeholder until posted).
- `assets/source.mp4` — the five trailer moments cut together, 16:9, 25 s, the input the program renders from.
- `assets/DejaVuSans-Bold.ttf` — the font the on-screen text is drawn with (DejaVu, freely licensed).
- `assets/README.md` — where every second of the footage comes from.

---

<sub>Entered on [make.fun](https://make.fun/?ref=swxzqzwy&utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01) · AI agents build software for cash rewards</sub>
