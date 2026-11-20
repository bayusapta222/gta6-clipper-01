// gta6-clipper-01 — "Clip GTA 6 for the most YouTube views" (make.fun).
//
// What this program does, in order:
//   1. Prepares the output directory (MAKEFUN_OUTPUT_DIR, or /output).
//      It creates the directory if needed and only ever removes the two
//      files it owns inside it. It NEVER deletes the output directory
//      itself, and never touches anything else in it.
//   2. Renders the vertical clip (1080x1920, 25 s) from
//      assets/source.mp4 with ffmpeg, when ffmpeg is available:
//      a blurred-fill background behind the 16:9 footage, the on-screen
//      hook "GTA 6 IS HERE" at the start, and the make.fun pitch
//      ("MAKE CLIPS LIKE THIS WITH AI" / "AND EARN MONEY ON MAKE.FUN" /
//      "make.fun") over the last ten seconds. The render is fully
//      deterministic: fixed filter, fixed encoder settings, one thread,
//      and a fixed creation timestamp, so two runs produce the same bytes.
//      If ffmpeg is missing, or the render does not finish inside its
//      time budget, the program logs a warning and carries on: the clip
//      is a reproduction of the entry's video, not the graded artifact.
//   3. Copies VIDEO.json from this repository into the output directory.
//      That copy is the entry's graded deliverable: the house reads the
//      video's address from it and the video's views through YouTube.
//
// Node 22, standard library only, no network access at runtime.
// Run it with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const CLIP_NAME = "gta6-clip-vertical.mp4";
const VIDEO_JSON_NAME = "VIDEO.json";
// The render is slow on a small sandbox CPU, and a run of this program
// is only allowed about a minute, so the render gets a hard budget and
// the program always finishes its real job (VIDEO.json) either way.
const RENDER_TIMEOUT_MS = 55_000;

function log(message: string): void {
  console.log(`[gta6-clipper-01] ${message}`);
}

function prepareOutputDir(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  // Delete only the two files this program owns. Never the directory.
  for (const name of [CLIP_NAME, VIDEO_JSON_NAME]) {
    const target = join(OUTPUT_DIR, name);
    if (existsSync(target)) {
      rmSync(target, { force: true });
    }
  }
  log(`output directory ready: ${OUTPUT_DIR}`);
}

function renderClip(): void {
  const source = join(REPO_ROOT, "assets", "source.mp4");
  const font = join(REPO_ROOT, "assets", "DejaVuSans-Bold.ttf");
  if (!existsSync(source)) {
    log("assets/source.mp4 is missing, skipping the clip render");
    return;
  }
  if (!existsSync(font)) {
    log("assets/DejaVuSans-Bold.ttf is missing, skipping the clip render");
    return;
  }
  const probe = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  if (probe.error !== undefined || probe.status !== 0) {
    log("ffmpeg is not available, skipping the clip render");
    return;
  }
  const filter = [
    "[0:v]split[a][b]",
    "[a]scale=540:960:force_original_aspect_ratio=increase,crop=540:960,gblur=sigma=20,scale=1080:1920[bg]",
    "[b]scale=1080:456[fg]",
    [
      "[bg][fg]overlay=(W-w)/2:732",
      `drawtext=fontfile=${font}:text='GTA 6 IS HERE':fontsize=110:fontcolor=white:borderw=3:bordercolor=black:box=1:boxcolor=black@0.45:boxborderw=24:x=(w-text_w)/2:y=820:enable='between(t,0,3)'`,
      `drawtext=fontfile=${font}:text='MAKE CLIPS LIKE THIS WITH AI':fontsize=48:fontcolor=white:borderw=3:bordercolor=black:box=1:boxcolor=black@0.45:boxborderw=20:x=(w-text_w)/2:y=720:enable='between(t,15,25)'`,
      `drawtext=fontfile=${font}:text='AND EARN MONEY ON MAKE.FUN':fontsize=48:fontcolor=white:borderw=3:bordercolor=black:box=1:boxcolor=black@0.45:boxborderw=20:x=(w-text_w)/2:y=800:enable='between(t,20,25)'`,
      `drawtext=fontfile=${font}:text='make.fun':fontsize=56:fontcolor=white:borderw=3:bordercolor=black:box=1:boxcolor=black@0.45:boxborderw=18:x=(w-text_w)/2:y=1740:enable='between(t,15,25)'`,
    ].join(",") + "[v]",
  ].join(";");
  const args = [
    "-v",
    "error",
    "-i",
    source,
    "-filter_complex",
    filter,
    "-map",
    "[v]",
    "-map",
    "0:a",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "20",
    "-threads",
    "1",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-metadata",
    "creation_time=2026-11-20T00:00:00.000Z",
    "-movflags",
    "+faststart",
    join(OUTPUT_DIR, CLIP_NAME),
    "-y",
  ];
  log("rendering the vertical clip with ffmpeg (budget 55 s) ...");
  const result = spawnSync("ffmpeg", args, {
    encoding: "utf8",
    timeout: RENDER_TIMEOUT_MS,
  });
  if (result.error !== undefined) {
    log(`clip render did not finish (${result.error.message}), continuing without it`);
    return;
  }
  if (result.status !== 0) {
    log(`ffmpeg exited with status ${String(result.status)}, continuing without the clip`);
    return;
  }
  log(`clip rendered: ${join(OUTPUT_DIR, CLIP_NAME)}`);
}

function copyVideoJson(): void {
  const source = join(REPO_ROOT, VIDEO_JSON_NAME);
  const raw = readFileSync(source, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string" ||
    ((parsed as { url: string }).url.length === 0)
  ) {
    throw new Error("VIDEO.json does not hold a url string");
  }
  const destination = join(OUTPUT_DIR, VIDEO_JSON_NAME);
  copyFileSync(source, destination);
  log(`VIDEO.json copied to ${destination}`);
}

function main(): void {
  prepareOutputDir();
  renderClip();
  copyVideoJson();
  log("done");
}

main();
