# Transient Fluid Mechanics Laboratory — website

The site at **www.tfmltechnion.com** as a static website: plain HTML and CSS generated
from simple text files. No database, no plugins, nothing to patch. Hosted for free on
GitHub Pages.

```
content/            <- everything you will ever edit
  site.yml            site name, contact details, navigation, research themes, redirects
  people.yml          lab members and alumni
  publications.yml    papers (one block each)
  facilities.yml      facilities and their specs
  research/*.md       one file per research project
  news/*.md           one file per news post (file name starts with the date)
  join.md             the Join Us page
static/             <- images (static/img/...), stylesheet, small script
templates/          <- page layouts (HTML with Jinja2 tags)
build.py            <- turns content + templates into the site
docs/               <- the generated site. GitHub Pages serves this folder. Don't edit by hand.
IMAGES-NEEDED.md    <- which image files to add, and where
```

## 1. Publish it (one-time, about 20 minutes)

1. Create a free account at github.com if you don't have one, then create a new
   repository called `tfml-website` (Public, no README).
2. Upload this whole folder. Easiest: on the empty repository page click
   *uploading an existing file*, drag the **contents** of this folder (not the folder
   itself) into the browser window, and click *Commit changes*. If your computer
   hides files whose names start with a dot (`.github`, `.gitignore`), don't worry:
   the site works without them, they only add the automatic rebuild described below.
3. In the repository, open **Settings → Pages**. Under *Build and deployment* choose
   **Deploy from a branch**, branch **main**, folder **/docs**, then *Save*.
   After a minute your site is live at `https://<your-username>.github.io/tfml-website/`
   (links will look odd there; they are written for the real domain, which comes next).
4. Still under **Settings → Pages**, check that *Custom domain* says `www.tfmltechnion.com`
   (the `docs/CNAME` file usually fills it in; if not, type it and *Save*). GitHub will show a DNS check that fails until step 5 is done.
5. In your **Wix** account open the domain's DNS settings (Domains → tfmltechnion.com →
   Manage DNS records) and set:

   | Type  | Host / name | Value |
   |-------|-------------|-------|
   | A     | `@`         | `185.199.108.153` |
   | A     | `@`         | `185.199.109.153` |
   | A     | `@`         | `185.199.110.153` |
   | A     | `@`         | `185.199.111.153` |
   | CNAME | `www`       | `<your-username>.github.io` |

   Delete the existing A and CNAME records that point at Wix (leave MX or TXT records
   alone if you use the domain for email). Changes take from a few minutes to a day
   to propagate.
6. When GitHub's DNS check turns green, tick **Enforce HTTPS** on the same Pages
   settings page. Done: `https://www.tfmltechnion.com` shows the new site, and
   `tfmltechnion.com` without www redirects to it.
7. Check the *Actions* tab of the repository: the first build downloads all the images
   from Wix into the site (about a minute). Only now cancel the Wix **site** plan. Keep the domain registration at Wix (or
   transfer it elsewhere later), and keep paying its yearly renewal.

Old addresses from the Wix site (for example `/copy-of-current-members-1` or
`/post/…`) redirect to the new pages, so links from other websites keep working.

## 2. Edit the content

Edit files in `content/` directly on GitHub (open the file, click the pencil icon,
edit, *Commit changes*). If the `.github` folder was uploaded, the site rebuilds
itself within about a minute of each commit: you'll see a small yellow dot, then a
green tick, next to the latest commit. If not, rebuild manually (section 3) or ask
Claude to do it for you.

**Add a news post.** Create `content/news/2026-10-01-my-post-title.md` (date first,
then a short title with hyphens) containing:

```
---
title: Our paper on shock constrictions is out
date: 2026-10-01
image: shock-constriction-paper.png      # optional, file in static/img/news/
summary: One sentence shown in the news list.
---
The post text, in Markdown. Blank line between paragraphs. **bold**, *italic*,
[links](https://example.com) all work.
```

**Add or change a person.** Edit `content/people.yml`; copy an existing block. The
`group` decides the section (pi, staff, postdoc, phd, msc, undergrad, alumni). To move
a graduate to alumni, change the group and add `thesis:`. Photos go in
`static/img/people/` and are referred to by file name.

**Add a paper.** Edit `content/publications.yml`; copy a block. Only `authors`,
`title`, `venue` and `year` are required; `volume`, `pages`, `url` and `note` are
optional. Papers are sorted by year automatically.

**Add or edit a research project.** Files in `content/research/`. The lines between the
`---` marks set the title, theme (`compressible` or `multiphase`), position in the list,
summary, lead image and related publications (any distinctive words from the paper's
title); the rest is the page text.

**Contact details, navigation, research theme text.** `content/site.yml`.

**Images.** Put files in `static/img/people/`, `static/img/research/`,
`static/img/facilities/` or `static/img/news/` and refer to them by file name. An image
that doesn't exist yet is shown as a placeholder, or, for the pictures from the old
site, loaded from its Wix address until the automatic download has run. See
`IMAGES-NEEDED.md`.

## 3. Rebuild and preview on your own computer (optional)

Needs Python 3.10 or newer.

```
pip install -r requirements.txt
python build.py            # regenerates docs/
python build.py --preview  # regenerates preview/ — open preview/index.html in a browser
```

`preview/` uses relative links so it works from a folder; `docs/` is the version for
the live site.

## 4. Getting help

Upload this folder (or the file you want changed) to Claude and describe the change:
"add this paper", "move Dvir to alumni", "write a news post about our APS talk".
