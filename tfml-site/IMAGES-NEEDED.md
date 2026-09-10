# Images

Every image from the old Wix site is already wired in. Until the files are downloaded
into `static/img/`, the pages load them from their original Wix addresses, so the
preview and the live site show the real pictures immediately.

**Downloading them into the site happens automatically** the first time the site is
pushed to GitHub: the workflow in `.github/workflows/build.yml` runs
`tools/fetch_images.py`, which saves all 45 images into `static/img/` (cropped the way
the old site cropped them, .webp converted to .jpg) and commits them. After that the
site no longer depends on Wix in any way, and you can cancel the Wix site plan.

To do the same on your own computer instead:

```
pip install -r requirements.txt
python tools/fetch_images.py
python build.py
```

The list of sources is `content/image_sources.yml`. To replace any picture, drop a
new file with the same name into `static/img/...` and rebuild; local files always win
over the online address.

## Still missing

- **Rami Yanai's photo.** Add a portrait as `static/img/people/rami-yanai.jpg` and remove the
  `#` in front of the `image:` line in `content/people.yml`. Until then his card shows his initials.
- **Yoav Gichon** still uses the photo from the old site. To match the others, replace
  `static/img/people/yoav-gichon.jpg` with a new square portrait.
- **A workshop photo** (3D printers, CNC, laser cutter) for the Facilities page: save it as
  `static/img/facilities/workshop.jpg` and add `image: workshop.jpg` to the Workshop block in
  `content/facilities.yml`.

All other portraits were replaced in September 2026 with the square studio photos; new
portraits should follow the same format (square, at least 800 × 800 px, JPEG).

## Videos

The old project pages embedded four short videos (raw PIV footage, Shake-The-Box
tracks, a rising sphere, shock evolution). Wix doesn't let those be copied out. If you
have the original files, upload them to YouTube or Vimeo (unlisted is fine) and send me
the links; I'll embed them on the project pages.

## Guidelines for new images

Portraits: portrait orientation, about 4:5, at least 600 px wide, JPEG.
Research and facility images: at least 1200 px wide; JPEG for photos, PNG for diagrams
and screenshots.
