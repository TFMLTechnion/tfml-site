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

Two things the old site never had, and which nothing online can replace:

- **Rami Yanai's photo.** The old site used a stock flower picture. Add a real portrait
  as `static/img/people/rami-yanai.jpg` and uncomment the `image:` line in
  `content/people.yml`. Until then his card shows his initials.
- **A workshop photo** (3D printers, CNC, laser cutter) for the Facilities page. Any
  phone photo of the machines works: save it as `static/img/facilities/workshop.jpg` and
  add `image: workshop.jpg` to the Workshop block in `content/facilities.yml`.

Three older news posts (Yoav joining, Jibu joining, the Zuckerman grant) have no image
because the originals didn't either; that's fine, the news list doesn't need one.

## Videos

The old project pages embedded four short videos (raw PIV footage, Shake-The-Box
tracks, a rising sphere, shock evolution). Wix doesn't let those be copied out. If you
have the original files, upload them to YouTube or Vimeo (unlisted is fine) and send me
the links; I'll embed them on the project pages.

## Guidelines for new images

Portraits: portrait orientation, about 4:5, at least 600 px wide, JPEG.
Research and facility images: at least 1200 px wide; JPEG for photos, PNG for diagrams
and screenshots.
