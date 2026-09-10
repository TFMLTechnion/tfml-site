#!/usr/bin/env python3
"""Download the site's images from their original addresses into static/img/.

    python tools/fetch_images.py          # fetch whatever is missing
    python tools/fetch_images.py --force  # re-download everything

Sources are listed in content/image_sources.yml. Files that already exist are
skipped, so this is safe to run any time. Crops recorded there (the framing the
old site used) are applied when Pillow is installed; .webp files are converted
to .jpg for the same reason. Run automatically by the GitHub Actions workflow.
"""
import argparse, io, pathlib, sys, urllib.request
import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / "static" / "img"
SOURCES = yaml.safe_load((ROOT / "content" / "image_sources.yml").read_text(encoding="utf-8"))
try:
    from PIL import Image
except ImportError:
    Image = None

def exists(target):
    stem = target.with_suffix("")
    return any(stem.with_suffix(ext).exists() for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"))

def download(url):
    """Fetch the original file; if that address refuses, ask Wix for a large resized copy."""
    ext = url.rsplit(".", 1)[-1]
    attempts = [url, f"{url}/v1/fit/w_2400,h_2400,q_90/image.{ext}"]
    last = None
    for u in attempts:
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (site image fetcher)"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:
            last = e
    raise last

def save(target, data, crop):
    target.parent.mkdir(parents=True, exist_ok=True)
    if Image is None:
        target.write_bytes(data)
        return "saved (no Pillow: not cropped/converted)"
    im = Image.open(io.BytesIO(data))
    note = f"{im.width}x{im.height}"
    if crop:
        x, y, w, h = crop
        im = im.crop((x, y, min(x + w, im.width), min(y + h, im.height)))
        note += f" -> cropped {im.width}x{im.height}"
    if target.suffix.lower() in (".jpg", ".jpeg"):
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        im.save(target, quality=88, optimize=True)
    else:
        im.save(target)
    return note

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    ok = skipped = failed = 0
    for rel, spec in SOURCES.items():
        target = IMG / rel
        if not args.force and exists(target):
            skipped += 1
            continue
        url = spec["url"] if isinstance(spec, dict) else spec
        crop = spec.get("crop") if isinstance(spec, dict) else None
        try:
            data = download(url)
            note = save(target, data, crop)
            print(f"  ok   {rel}  ({note})")
            ok += 1
        except Exception as e:  # keep going; report at the end
            print(f"  FAIL {rel}: {e}", file=sys.stderr)
            failed += 1
    print(f"Fetched {ok}, already present {skipped}, failed {failed}.")
    if failed:
        print("Failed images keep using their online address until fixed.", file=sys.stderr)

if __name__ == "__main__":
    main()
