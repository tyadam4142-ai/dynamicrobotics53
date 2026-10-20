# DR53 website usability redesign: record of changes

## What the site actually is (from the code, not assumptions)
Static Vite + React 19 + TypeScript + Tailwind 4 single page, deployed to GitHub Pages by `.github/workflows/pages.yml`.
There is **no backend, database, login, administrator dashboard or server-side upload** in the public site.
The only "upload" is the Tap Tag artwork preview (a browser-only `blob:` preview, nothing is stored or sent).
All "submit" actions open WhatsApp with a pre-filled message. The local `sales-command-centre/` app has since been removed from this repository.

## Problems found and what was done
| Problem | Fix |
|---|---|
| 8 header items, several unclear ("Ad Screen", "Builds (7)", numbered mobile list), nav order did not match page order | 6 plain labels in page order (T53, Projects, Tap Tag, Services, Milestones, Contact) + one primary button, "Build Your Website". Current section is highlighted and exposed with `aria-current`. |
| Header WhatsApp button duplicated the floating button and Contact section | Removed from the header. WhatsApp remains in the mobile menu, floating button, Contact section, footer, every project card |
| Hero had 4 equally weighted calls to action | One primary ("Explore Robotics Projects") and one secondary ("Build Your Website (from ₹5,300)"). Tap Tag and T53 stay one click away in the "What are you looking to build?" launcher right below |
| Dead link: ad screen "Launch Live Builder" pointed to `#website-builder`, which only exists while the builder is open | `/#website-builder` is now a working deep link that opens the builder; closing clears the hash |
| "Builds (7)" / "All (7)" while 9 project cards exist | Counts are computed from the data |
| Hero card showed fake "ONLINE / READY / ACTIVE" status badges | Replaced with three real links (robotics, AI vision, Tap Tag) |
| Website builder was only reachable from a modal, with no dialog semantics | New visible "Need a website for your business?" section, plus the existing entry points. The dialog now has `role="dialog"`, labelled close button, Escape to close, focus moved in and returned, Tab kept inside, page scroll locked, backdrop click closes |
| Logo component was an `<a>` nested inside other `<a>` elements (invalid HTML) | It renders as an image unless an `href` is passed |
| No skip link, no visible focus style, no `<main>`, unlabeled menu button | Added all four |
| Decorative motion (pinging dots, scan line, orbit ring, cursor glow, drifting orbs, marquee ticker, 3D card tilt) | Removed. Kept: scroll progress bar, scroll reveal, Tap Tag card flip, ad-screen rotation, splash (now skipped for reduced-motion users and within the same browser session) |
| Quick-start launcher forced a 860px minimum width | Responsive grid (2 / 3 / 5 columns) |
| Project filters had no pressed state and no empty state | `aria-pressed`, plus an empty state with a reset button |

## Feature checklist (all preserved)
Splash + skip · sticky nav + mobile menu · hero · quick-start launcher · T53 section (APK download if the file exists, otherwise T53 download page; iOS "coming soon") ·
live ad screen (all modes) · project grid, filters, per-project WhatsApp order/discuss links · Tap Tag flip card, artwork preview upload, plan switch, price, tap simulator ·
website builder (category, package, add-ons, colour, domain check, device preview, WhatsApp quote) · services · milestones · contact · footer · chatbot · floating WhatsApp ·
CNAME, Pages workflow, asset paths, `public/downloads/` APK mechanism. No route, asset or data file was deleted.

## Files changed
`src/App.tsx`, `src/components/BrandLogo.tsx`, `src/index.css` (appended layer), this document.

## Not verified / limits
Live site (https://dynamicrobotics53.com) was not accessible from the build environment; testing used a local production build.
Google Fonts could not load offline, so fallback fonts were rendered in tests. No APK is in the repo, so the T53 Android button points to the T53 download page until `public/downloads/T53-Android.apk` is added (this was already the behaviour).
No screen-reader or real-device testing was done.

## Update
Added: `.nojekyll`, workflow type-check + Jekyll disable, hero entrance sequence, rotating ring around the logo, headline gradient, project-card tilt. All motion is disabled for reduced-motion users.
