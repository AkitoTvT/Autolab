# AutoLab — Interactive Business Website

A fictional automotive showroom and service center template by Marvin Miranda.

## Start here

Upload the CONTENTS of this folder to your static host or GitHub repository. Keep index.html at the repository root and preserve all subfolders. For GitHub Pages, select main and / (root) under Settings > Pages. No npm installation or build step is needed.

For local preview, run `python3 -m http.server 8000` from this folder and open http://localhost:8000. A local server is recommended for consistent browser storage and URL behavior.

## What is included

13 pages with real stock photographs, dedicated car and service pages, a contact form demonstration, photography credits, and the sample-business disclaimer.

React 18.3.1 powers:
- Featured-car switching with previous/next controls and optional auto rotation.
- Saved vehicles, available from the header on every page.
- A persistent comparison shortlist for up to three models and a comparison dialog.
- Quick-view dialogs with model highlights.
- Live collection search, brand and body-style filters, sorting, and a saved-only view.
- Shareable filtered URLs that restore after refresh.

Favorites and comparison selections are stored only in the same browser. Browser storage restrictions may limit persistence. Form entries are not stored or sent. No booking or purchase takes place.

The hero starts with manual controls. Optional rotation pauses on hover and keyboard focus, and it is unavailable when reduced motion is preferred. Scroll entrance animations also respect reduced motion.

## Files and editing

- index.html and nested index.html files: static pages and fallback content.
- style.css: palette, responsive layouts, fonts, and motion.
- react-app.js: React components and shared interaction state.
- app.js: navigation, demo form feedback, and scroll reveals.
- assets/: local photos, bundled React/React DOM, fonts, and licenses.
- scripts/build.py: optional standard-library Python page generator.

For consistent vehicle and service edits, update CARS and SERVICES in scripts/build.py, then run `python3 scripts/build.py`. This regenerates the HTML pages and embedded React vehicle data. You do not need to run this script to host the supplied files. For hand edits, keep the visible listing text and the autolab-data JSON in each HTML file consistent.

The palette uses #6E7F80, #536872, #708090, #536878, and #36454F. Barlow Condensed and Outfit are bundled with their SIL Open Font License notices. React libraries carry their MIT license. See THIRD-PARTY-NOTICES.md for photo sources and permissions.

## Before using it for a real business

All prices, listings, packages, and business details are illustrative. Verify your content and assets, replace sample data, connect the form to a real inquiry system, and update the demo notices. This package does not include a backend, checkout, payment processing, live inventory, or a real booking system.
