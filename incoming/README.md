# Drop images and videos here

Put anything you export here — figures cropped out of a PDF, movie files, photos. Names
don't matter. Tell me it's here and I'll convert, rename, move it to the folder the site
expects, and rebuild.

Everything in this folder is ignored by git (only this README is tracked), so nothing you
leave here ends up in a commit and large video files won't bloat the repository.

## Done so far

The shock waves page is complete. From the batch dropped here:

| Source | Became |
|---|---|
| `fig4.pdf` | `near-step-series.png` — the shock crossing the step |
| `fig6.pdf` | `downstream-sequence.png` — the whole tube, seven times over |
| `fig12.pdf` | `scaling-collapse.png` — the triple point zig-zagging between the walls |
| `fig13.pdf` | `mss-scaling.png` — the scaling law, simulation against the fast model |
| `…sup001.mp4` | `movie-experiment.webm` / `.mp4` / `-poster.jpg` |
| `…sup002 (1).mp4` | `movie-les.webm` / `.mp4` / `-poster.jpg` |

All in `static/img/research/shock-waves-area-changes/`. The scripts that did it are
`_render.py` (PDF → PNG at 1600 px) and `_encode.ps1` (crop, speed up, encode, poster),
kept here in case more figures arrive.

Videos were cropped down to just the imaging panel — the title banner and logo footer were
dropped — sped up so each runs about 23 seconds, and re-encoded. The experiment clip went
from 8.4 MB to 1.1 MB, the simulation from 9.6 MB to 0.3 MB.

## Still useful

One figure would finish the page: **figure 8** (pressure traces at eight stations, top wall
against bottom, showing they're out of phase) or **figure 15** (the x–t pressure map). The
"What the walls feel" section is the only one with no picture.

Beyond that, `IMAGES-NEEDED.md` at the top of the repository lists the portraits and the
workshop photo that are still wanted. Same thing applies: drop them here under any name.

## What I need from you

Nothing in particular. Any format is fine — `.pdf`, `.png`, `.mp4`, `.mov`, `.avi`. I have
PyMuPDF for rasterising PDFs and ffmpeg for video, both installed on this machine.
