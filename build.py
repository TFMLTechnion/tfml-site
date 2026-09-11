#!/usr/bin/env python3
"""Build the TFML website from the files in content/ and templates/.

    python build.py            -> writes the live site to docs/ (served by GitHub Pages)
    python build.py --preview  -> writes a copy to preview/ that opens from a local folder

Requires: pip install jinja2 pyyaml markdown
"""
import argparse, datetime, os, pathlib, re, shutil, sys
import yaml, markdown
from markupsafe import Markup
from jinja2 import Environment, FileSystemLoader, select_autoescape, pass_context

ROOT = pathlib.Path(__file__).parent
CONTENT, TEMPLATES, STATIC = ROOT / "content", ROOT / "templates", ROOT / "static"
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg")

# ----------------------------------------------------------------------------- helpers

def read_front_matter(path):
    """Split a Markdown file into (metadata dict, html body)."""
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", text, re.S)
    if not m:
        return {}, Markup(markdown.markdown(text))
    meta = yaml.safe_load(m.group(1)) or {}
    body = Markup(markdown.markdown(m.group(2), extensions=["smarty"]))
    return meta, body

_sources_path = CONTENT / "image_sources.yml"
IMAGE_SOURCES = yaml.safe_load(_sources_path.read_text(encoding="utf-8")) if _sources_path.exists() else {}
REMOTE_USED = []

def find_image(folder, name):
    """Return the site path of an image if the file exists in static/img/<folder>/.
    Accepts a name with any extension and tries the others too (e.g. .webp -> .jpg).
    If the file is missing but content/image_sources.yml knows where it lives online,
    that address is used instead (tools/fetch_images.py downloads it into place)."""
    if not name:
        return None
    base = STATIC / "img" / folder if folder else STATIC / "img"
    candidates = [base / name] + [base / (pathlib.Path(name).stem + ext) for ext in IMG_EXT]
    for c in candidates:
        if c.exists():
            rel = c.relative_to(STATIC).as_posix()
            return "/assets/" + rel
    key = f"{folder}/{name}" if folder else name
    spec = IMAGE_SOURCES.get(key)
    if spec:
        REMOTE_USED.append(key)
        return spec["url"] if isinstance(spec, dict) else spec
    return None

def initials(name):
    parts = [p for p in re.split(r"[\s-]+", name) if p]
    return "".join(p[0] for p in parts[:2]).upper()

def fmt_date(d):
    return d.strftime("%-d %B %Y") if hasattr(d, "strftime") else str(d)

# ----------------------------------------------------------------------------- content

def load_content():
    site = yaml.safe_load((CONTENT / "site.yml").read_text(encoding="utf-8"))
    people_doc = yaml.safe_load((CONTENT / "people.yml").read_text(encoding="utf-8"))
    pubs = yaml.safe_load((CONTENT / "publications.yml").read_text(encoding="utf-8"))
    facilities = yaml.safe_load((CONTENT / "facilities.yml").read_text(encoding="utf-8"))

    rank = {"under review": 0, "submitted": 0, "accepted": 1}
    pubs.sort(key=lambda p: (-int(p["year"]), rank.get(p.get("status"), 2), p["authors"]))
    for p in pubs:
        p["image_url"] = find_image("", p["image"]) if p.get("image") else None
    for p in pubs:
        p["year"] = int(p["year"])

    people = people_doc["people"]
    for person in people:
        person["image_url"] = find_image("people", person.get("image"))
        person["initials"] = initials(person["name"])
    groups = []
    for gid, label in people_doc["groups"].items():
        members = [p for p in people if p.get("group") == gid]
        if members:
            groups.append((gid, label, members))

    for f in facilities:
        f["image_url"] = find_image("facilities", f.get("image"))

    projects = []
    for path in sorted((CONTENT / "research").glob("*.md")):
        meta, body = read_front_matter(path)
        slug = meta.get("slug") or path.stem
        proj = dict(meta, slug=slug, body=body, url=f"/research/{slug}/")
        proj["image_url"] = find_image("research", meta.get("image"))
        proj["figure_list"] = [dict(f, url=find_image("research", f.get("image"))) for f in meta.get("figures", [])]
        needles = [n.lower() for n in meta.get("related", [])]
        proj["related_pubs"] = [p for p in pubs if any(n in p["title"].lower() for n in needles)]
        projects.append(proj)
    projects.sort(key=lambda p: (p.get("theme", ""), p.get("order", 99), p["title"]))

    posts = []
    for path in sorted((CONTENT / "news").glob("*.md")):
        meta, body = read_front_matter(path)
        slug = meta.get("slug") or re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem)
        date = meta.get("date")
        if isinstance(date, str):
            date = datetime.date.fromisoformat(date)
        post = dict(meta, slug=slug, body=body, date=date, url=f"/news/{slug}/")
        post["image_url"] = find_image("news", meta.get("image")) or find_image("people", meta.get("image"))
        post["figure_list"] = [dict(f, url=find_image("news", f.get("image"))) for f in meta.get("figures", [])]
        posts.append(post)
    posts.sort(key=lambda p: (p["date"], p["slug"]), reverse=True)

    join_meta, join_body = read_front_matter(CONTENT / "join.md")
    join = dict(join_meta, body=join_body)

    return site, people, groups, pubs, facilities, projects, posts, join

# ----------------------------------------------------------------------------- build

def build(out_dir, preview=False):
    site, people, groups, pubs, facilities, projects, posts, join = load_content()
    out = ROOT / out_dir
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    env = Environment(loader=FileSystemLoader(str(TEMPLATES)), autoescape=select_autoescape(["html"]))
    # short fingerprints of the stylesheet and script, appended to their URLs so browsers
    # never keep an outdated copy after a change
    import hashlib
    asset_v = {name: hashlib.md5((STATIC / name).read_bytes()).hexdigest()[:8] for name in ("css/site.css", "js/site.js")}
    env.filters["date"] = fmt_date

    current = {"path": "/"}

    def url(path):
        """Root-relative on the live site; relative (with index.html) in the preview build."""
        if not preview or not path or not path.startswith("/"):
            return path
        folder = current["path"].rsplit("/", 1)[0].strip("/")   # directory the page lives in
        depth = folder.count("/") + 1 if folder else 0
        prefix = "../" * depth if depth else "./"
        target = path.lstrip("/")
        if target == "" or target.endswith("/"):
            target += "index.html"
        return prefix + target

    # pass_context stops Jinja2 from folding constant paths at compile time, so the
    # filter is re-evaluated for every page (the relative depth differs per page).
    env.filters["url"] = pass_context(lambda ctx, path: url(path))

    def img(name):
        u = find_image("", name)
        return url(u) if u else None

    def render(template, path, **ctx):
        current["path"] = path
        ctx.setdefault("canonical", path)
        html = env.get_template(template).render(
            site=site, projects=_with_urls(projects, url), posts=_with_urls(posts, url),
            img=img, year=datetime.date.today().year, css_v=asset_v["css/site.css"], js_v=asset_v["js/site.js"], **ctx)
        if preview:  # links written inside Markdown content are root-relative; make them relative too
            html = re.sub(r'(href|src)="(/[^"]*)"', lambda m: f'{m.group(1)}="{url(m.group(2))}"', html)
        dest = out / path.lstrip("/")
        if path.endswith("/"):
            dest = dest / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")

    def _with_urls(items, url):
        result = []
        for it in items:
            copy = dict(it)
            if copy.get("image_url"):
                copy["image_url"] = url(copy["image_url"])
            if copy.get("figure_list"):
                copy["figure_list"] = [dict(f, url=url(f["url"]) if f.get("url") else None) for f in copy["figure_list"]]
            result.append(copy)
        return result

    themes = {t["id"]: t for t in site["themes"]}

    team = [p for p in people if p.get("group") != "alumni"]
    featured_raw = [p for p in pubs if p.get("image_url")][:3]
    current["path"] = "/"
    render("index.html", "/", page_id="home", section="",
           facilities=_with_urls(facilities, url), team=_with_urls(team, url), featured_pubs=_with_urls(featured_raw, url))
    # Preview of the redesigned landing page at /new/ (not indexed). To make it the real home page,
    # rename templates/home-new.html to templates/index.html and remove these two lines.
    current["path"] = "/new/"
    render("home-new.html", "/new/", page_id="home", section="", page_title="New landing page (preview)", noindex=True, hero_dark=True,
           facilities=_with_urls(facilities, url), team=_with_urls(team, url), featured_pubs=_with_urls(featured_raw, url))
    render("research.html", "/research/", page_id="research", section="research", page_title="Research")
    for p in projects:
        current["path"] = p["url"]
        render(p.get("template") or "project.html", p["url"], page_id="project", section="research", page_title=p["title"],
               page_description=p.get("summary"), project=_with_urls([p], url)[0],
               theme=themes.get(p.get("theme"), {}), og_image=p.get("image_url"))
    current["path"] = "/people/"
    render("people.html", "/people/", page_id="people", section="people", page_title="People",
           groups=[(g, l, _with_urls(m, url)) for g, l, m in groups],
           page_description="The people of the Transient Fluid Mechanics Laboratory at the Technion.")
    current["path"] = "/facilities/"
    render("facilities.html", "/facilities/", page_id="facilities", section="facilities", page_title="Facilities",
           facilities=_with_urls(facilities, url),
           page_description="Shock tube, index-matched pipe channel, octagonal tank and water tunnel at TFML, Technion.")
    by_year = {}
    for p in pubs:
        if p.get("section", "journal") == "journal":
            by_year.setdefault(p["year"], []).append(p)
    render("publications.html", "/publications/", page_id="publications", section="publications",
           page_title="Publications", journal_by_year=sorted(by_year.items(), reverse=True),
           chapters=[p for p in pubs if p.get("section") == "chapter"],
           proceedings=[p for p in pubs if p.get("section") == "proceedings"],
           page_description="Journal articles and preprints from the Transient Fluid Mechanics Laboratory, Technion.")
    render("news.html", "/news/", page_id="news", section="news", page_title="News")
    for i, post in enumerate(posts):
        current["path"] = post["url"]
        render("post.html", post["url"], page_id="post", section="news", page_title=post["title"],
               page_description=post.get("summary"), post=_with_urls([post], url)[0],
               prev=posts[i + 1] if i + 1 < len(posts) else None, next=posts[i - 1] if i > 0 else None,
               og_image=post.get("image_url"))
    render("join.html", "/join/", page_id="join", section="join", page_title="Join us", join=join,
           page_description="Open positions for graduate students, postdocs and undergraduates at TFML, Technion.")
    render("404.html", "/404.html", page_id="404", section="", page_title="Page not found")

    # Redirects from the old Wix addresses (live site only)
    for old, new in ({} if preview else (site.get("redirects") or {})).items():
        dest = out / old.strip("/") / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(env.get_template("redirect.html").render(site=site, target=new), encoding="utf-8")
    for post in ([] if preview else posts):  # old blog posts lived under /post/<slug>
        dest = out / "post" / post["slug"] / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(env.get_template("redirect.html").render(site=site, target=post["url"]), encoding="utf-8")

    # Static assets
    shutil.copytree(STATIC, out / "assets")

    if not preview:
        host = site["url"].split("//", 1)[1]
        (out / "CNAME").write_text(host + "\n")
        (out / ".nojekyll").write_text("")
        (out / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {site['url']}/sitemap.xml\n")
        pages = ["/", "/research/", "/people/", "/facilities/", "/publications/", "/news/", "/join/"]
        pages += [p["url"] for p in projects] + [p["url"] for p in posts]
        today = datetime.date.today().isoformat()
        sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
        sm += [f"  <url><loc>{site['url']}{p}</loc><lastmod>{today}</lastmod></url>" for p in pages]
        sm.append("</urlset>")
        (out / "sitemap.xml").write_text("\n".join(sm) + "\n")

    n = sum(1 for _ in out.rglob("*.html"))
    remote = sorted(set(REMOTE_USED))
    print(f"Built {n} HTML pages into {out_dir}/")
    if remote:
        print(f"  {len(remote)} images are not in static/img yet and are loaded from their online address;"
              f" run tools/fetch_images.py to download them.")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", action="store_true", help="build a folder-openable copy into preview/")
    args = ap.parse_args()
    if args.preview:
        build("preview", preview=True)
    else:
        build("docs")
