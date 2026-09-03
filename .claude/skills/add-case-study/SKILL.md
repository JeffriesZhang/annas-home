---
name: add-case-study
description: Add or remove a property listing case study on the Lumina Staging site (annas-home repo) — downloading vendor photo deliveries, curating a subset, generating watermarked/preview image tiers, writing data/cases.json, and deploying. Use when the user says things like "加个 case"、"上架一个新房源"、"这个案例下架/删掉" in this project.
---

# Add / remove a case study

This project (`annas-home`, deployed to `luminabayarea.com` as "Lumina Staging")
shows real-estate staging work as case studies under `/work/[id]`. Each case
lives in `data/cases.json` plus an image folder under
`public/images/cases/<slug>/`. This skill covers onboarding a new listing and
retiring an old one.

## Prerequisites (one-time, already done on this machine)

- `magick` (ImageMagick) — `brew install imagemagick`
- Font used for the watermark: `/System/Library/Fonts/Supplemental/Arial.ttf`
- Bash tool calls that fetch external URLs need `dangerouslyDisableSandbox: true`
  (the default sandbox blocks outbound network access)

## 1. Get the source material

The user will hand you either:

- **A Google Drive share** (a `drive-download-*` folder appearing under
  `~/Downloads` after they download it manually via browser — ask them to do
  this, it isn't scriptable), typically containing `Photos/`, `Floor Plan/`,
  `Video/`, and sometimes a `3D Tour.docx` with Matterport links (`unzip` it /
  read `word/document.xml` and strip XML tags to get the URLs), **or**
- **A vendor delivery-page link** (e.g. `https://<host>.hd.pics/media/download2.asp?...`
  from "Open House 365" / HD Photo Hub). These pages don't expose a plain zip
  over `curl`. Instead:
  1. `curl -sL <download2.asp URL> -o page.html` to load the preview page.
  2. Grep it for a `getzip.aspx?g=...&n=....zip&jd=...` link and fetch that
     with `curl -sL <getzip URL> -o resp.html` (still HTML, not a real zip).
  3. That response is actually a `buildzip.aspx` form containing hidden
     `mN`/`nN` fields — `mN` is a direct image URL
     (`http://vaultNN.hd.pics/r/<hash>.jpg`), `nN` is its filename. Extract
     all of them with a regex (`name="m(\d+)" value="([^"]*)"` /
     `name="n(\d+)" value="([^"]*)"`) instead of trying to complete the zip
     flow — downloading each image URL directly is much simpler.
  4. The same page's embedded JS object (`hd.dataSession = {...}`) usually has
     the full address (`sAddress`, `sCity`, `sState`, `sZipCode`) — use it to
     build the slug and case title instead of asking the user.

Download everything to a scratch dir first (the session's scratchpad, not the
repo) using a **Python `ThreadPoolExecutor` + `urllib`**, not `xargs` — this
project's shell is zsh and BSD `xargs` mangles tab-delimited `{}` arguments
across parallel workers. A quick pattern:

```python
import concurrent.futures, urllib.request, os
def dl(row):
    idx, name, url = row
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r, open(f"full/{idx:03d}_{name}.jpg", "wb") as f:
        f.write(r.read())
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    list(ex.map(dl, rows))
```

## 2. Curate — don't dump everything in

Vendor deliveries often bundle far more than usable listing photos:

- **Exclude** agent/brokerage marketing graphics (commonly named
  `Sign_Image_*`) — these are template infographics carrying third-party
  logos (school badges, big-box retailers, etc.) and don't belong on a
  staging portfolio.
- **Exclude** generic neighborhood aerials that don't show the subject
  property (tennis courts, parks, street grids from a drone pass) — keep
  only aerials that clearly frame the house itself.
- A vendor `collov-ai_*` or similarly-named file is usually an AI twilight/dusk
  re-light of one of the real exterior photos — fine to keep as one bonus
  "twilight" shot, not a real second exterior.
- Duplicate coverage (e.g. a `DSC_*` standard-lens pass and a separate
  `Image_*` wide-lens pass of the same rooms) — pick the better one per
  room/angle rather than keeping both.
- Default to showing more rather than fewer angles per room once the above
  exclusions are applied — a first pass that only keeps one photo per room
  reads as too sparse (this happened on the second case: an initial 33-photo
  cut got expanded to 60 after the user asked for fuller coverage). It's
  fine to end up in the 50–60+ range for a house with many rooms; there's no
  fixed target count. Cut only near-duplicate angles of the *same* shot, not
  different angles/rooms.

To review a large batch quickly without spending tokens on 100+ full-size
reads: resize everything to small labelled thumbnails, then use
`magick montage` to tile them into a handful of contact-sheet grids (~24
photos each), and view just those grids.

```bash
for f in full/*.jpg; do
  magick "$f" -resize 260x260 -gravity South -background "rgba(0,0,0,0.6)" -splice 0x18 \
    -font "$FONT" -pointsize 12 -fill white -annotate +0+4 "$(basename "$f" .jpg)" "thumbs/$(basename "$f")"
done
ls thumbs/*.jpg | sort | split -l 24 - batch_
i=1; for b in batch_*; do
  magick montage $(cat "$b") -tile 6x4 -geometry 260x260+2+2 -background white "sheet_$(printf '%02d' $i).jpg"
  i=$((i+1))
done
```

Read the `sheet_NN.jpg` files, note which filenames to keep, then run the
real per-photo processing (step 3) only on that curated list.

## 3. Process images: preview / original / watermark / blur

Every case photo ships in two tiers plus an inline blur placeholder — see
`public/images/cases/1506-canna-ct-mountain-view-ca-94043/` for a reference
example. Do **not** skip this — it's why the site loads fast and why
downloaded full-size photos carry a visible watermark.

```
public/images/cases/<slug>/
  cover.jpg              # same as one preview photo, used on cards/hero
  floor-plan.jpg         # optional, only if a floor plan image was provided
  photos/<name>.jpg      # 900px wide, quality 68, NO watermark — grid thumbnails
  originals/<name>.jpg   # 2200px wide, quality 85, watermarked bottom-right —
                          # only reachable by clicking a photo (opens new tab)
```

Watermark recipe (double-layer for legibility on any background — a dark
soft-shadow copy behind a near-white copy, both bottom-right). Brand text is
**"Lumina Staging"** (rebranded from the original "Anna's Home Staging" —
if the brand ever changes again, regenerate every `originals/*.jpg` from the
raw source, not by re-stamping existing watermarked files, or the old text
shows through underneath).

```bash
FONT="/System/Library/Fonts/Supplemental/Arial.ttf"
watermark() {
  local in="$1" out="$2"
  magick "$in" -resize 2200x -auto-orient \
    \( -background none -fill "rgba(0,0,0,0.45)" -font "$FONT" -pointsize 34 label:"Lumina Staging" \) \
    -gravity SouthEast -geometry +39+29 -compose over -composite \
    \( -background none -fill "rgba(255,255,255,0.92)" -font "$FONT" -pointsize 34 label:"Lumina Staging" \) \
    -gravity SouthEast -geometry +38+30 -compose over -composite \
    -quality 85 -sampling-factor 4:2:0 -strip "$out"
}
magick "$SRC" -resize 900x -auto-orient -quality 68 -sampling-factor 4:2:0 -strip "photos/$name"
watermark "$SRC" "originals/$name"
```

**Important gotcha:** run multi-file loops (`for base in $LIST; do ... done`)
via `bash <<'EOF' ... EOF`, not directly in the zsh-flavored Bash tool — zsh
doesn't word-split an unquoted `$LIST` the way bash does, so the whole
space-separated list gets treated as one filename and `magick` fails with
"File name too long".

After generating `photos/` and `originals/`, produce the inline blur
placeholder for each preview image (16px wide, quality 40, base64-encoded)
and the case's `coverBlurDataURL`:

```python
import subprocess, base64
def blur_data_url(path):
    out = subprocess.run(["magick", path, "-resize", "16x", "-quality", "40", "jpg:-"],
                          capture_output=True, check=True).stdout
    return f"data:image/jpeg;base64,{base64.b64encode(out).decode()}"
```

## 4. Write the `data/cases.json` entry

Prepend (newest first) an object shaped like:

```json
{
  "id": "<slug>",                         // kebab-case, include full street+city+state+zip for uniqueness
  "title": "<street address>",
  "location": "<City, ST ZIP>",
  "category": "For Sale" | "For Rent",
  "description": "1-2 sentence description of the staging work",
  "cover": "/images/cases/<slug>/cover.jpg",
  "photos": [
    { "src": "/images/cases/<slug>/photos/<name>.jpg",
      "original": "/images/cases/<slug>/originals/<name>.jpg",
      "blurDataURL": "data:image/jpeg;base64,...",
      "category": "interior" }
  ],
  "floorPlan": "/images/cases/<slug>/floor-plan.jpg",   // omit if none
  "matterportUrl": "https://my.matterport.com/show/?m=...", // omit if none
  "coverBlurDataURL": "data:image/jpeg;base64,..."
}
```

Note the two different `category` fields at different levels: the top-level
one is the listing type (`"For Sale"` / `"For Rent"`, shown as a badge), the
per-photo one is `"interior" | "exterior" | "aerial"` (defaults to
`"interior"` if omitted).

The detail page (`app/work/[id]/page.tsx`) splits `photos` into Interior /
Exterior / Aerial View sections by that per-photo `category`. Set it
yourself when curating — don't infer it from filenames or assume "not
aerial" means "interior": ground-level exterior shots (front yard,
driveway, backyard/patio, twilight re-lights) need `"exterior"` explicitly,
or they'll get mislabeled as interior. Vendor naming is inconsistent too
(one delivery used `DJI_*` for aerials, another just numbered
`Image_N.jpg` indistinguishably from ground shots) — always classify by
looking at the actual photo, not the filename.

No code changes are needed to pick the entry up — `generateStaticParams()` in
`app/work/[id]/page.tsx` and the list rendering in `app/work/page.tsx` /
`app/page.tsx` both read `data/cases.json` directly.

## 5. Build, verify, ship

```bash
npm run build   # must succeed — this is a static export (output: 'export')
```

Then the normal git flow: `git add -A`, commit, `git push` (remote is the
`github-annashome` SSH alias — see `~/.ssh/config`). Pushing to `main`
triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages automatically; no manual deploy step. Watch it with:

```bash
RUN_ID=$(gh run list -R JeffriesZhang/annas-home --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN_ID" -R JeffriesZhang/annas-home --exit-status
```

Confirm the case is live at `https://luminabayarea.com/work/<slug>` (curl
`-o /dev/null -w "%{http_code}\n"` a few key paths, `dangerouslyDisableSandbox: true`).

## Removing a case (delisting)

1. Delete its object from `data/cases.json`.
2. `git rm -r public/images/cases/<slug>/`.
3. `npm run build` to confirm nothing else references it (it'll simply
   disappear from the `/work` grid and homepage "Recent Projects" — no other
   code changes needed).
4. Commit and push as above; the old `/work/<slug>` URL will start 404ing
   once the next deploy finishes (fine — it was never linked from search
   engines' perspective for a young site, but mention this to the user if
   the listing has been publicly shared/indexed).
