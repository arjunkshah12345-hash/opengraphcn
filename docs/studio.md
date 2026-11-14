# Studio guide

Open the Studio at [https://arjunkshah12345-hash.github.io/opengraphcn/#/studio](https://arjunkshah12345-hash.github.io/opengraphcn/#/studio). Everything runs in your browser.

- **Left — templates.** Search and filter by collection. Thumbnails render your own content.
- **Center — canvas.** Zoom, fit to screen, and an actual-size (1200×630) preview.
- **Right — controls.** Content, Style (colors, display typeface, type scale), Brand (logo, favicon, screenshot, avatar, visibility), Export.
- On mobile the template browser becomes a tab.

Behaviour:
- Switching templates keeps your content; colors reset to the new template's palette unless *Keep my colors* is on.
- Headline/description counters show the recommended length. Longer text shrinks, then clamps with an ellipsis — never overflows.
- Undo/redo: ⌘Z / ⇧⌘Z. ⌘S saves to local storage (folder icon restores). ⌘E exports a PNG. Drafts autosave.
- *Copy share link* encodes the design into the URL (uploaded images are omitted).
- *Import from GitHub* calls the public GitHub API anonymously (60 requests/hour/IP) and fills name, owner, description, language, stars, forks and homepage. Missing values stay empty.
