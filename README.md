# How Are You? — portfolio site

The studio site of Jack Howard. Static HTML/CSS/JS — no build step.

## Structure
```
index.html                    Landing: hero, selected work (01–05), archive (06–09), about, contact
work/stepseat.html            01  StepSeat
work/spunog.html              02  Spúnóg den Cheo
work/fastnet.html             03  Fastnet Project
work/bespoke-woodwork.html    04  Bespoke Woodwork (Granada)
work/slugs.html               05  Something To Keep The Slugs Off The Cabbages (film)
work/tiny-house.html          06  Modern Tiny House Eco-Village
work/fitzgerald-park.html     07  Fitzgerald Park Café Redesign
work/skatehouse.html          08  Skatehouse Retail Project
work/oak-house.html           09  Oak House — Cork Stroke Support Centre
assets/css/style.css          All styling + brand palette (CSS variables at the top)
assets/js/main.js             Footer year + scroll reveal
assets/img/                   Local images (projects 01–03), favicon (yellow mark), HAY stamp
```

## A note on images
Projects 01–03 use images recovered from your Affinity files (stored locally in `assets/img/`).
Projects 04–09 pull their images **directly from your Behance CDN** (the `mir-s3-cdn-cf.behance.net`
URLs in those pages), and project 05 embeds the YouTube film. This keeps the build light, but means
those images depend on Behance staying up. To make the site fully self-contained, save those images
into `assets/img/` and swap the URLs — happy to do that for you.

## Brand palette (in `assets/css/style.css`)
- Paper (off-white) `#ECE7DD`
- Ink (off-black) `#22211F`
- 