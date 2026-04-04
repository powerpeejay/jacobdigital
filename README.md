# Jacob Digital

Website für [jacobdigital.de](https://jacobdigital.de) — Beratung für Websites, Automatisierung und AI-Lösungen.

## Stack

- Vanilla HTML, CSS, JavaScript — kein Framework, kein Build-Tool
- Selbst gehostete Fonts (Outfit Bold, Inter Regular)
- WebGL-Shader als Hero-Hintergrund
- Formspree für das Kontaktformular

## Struktur

```
/
├── index.html          Hauptseite (eine Seite, 8 Sektionen)
├── impressum.html
├── datenschutz.html
├── robots.txt
├── sitemap.xml
├── css/style.css       Design-System mit CSS-Variablen
├── js/main.js          Navigation, Formular, WebGL-Shader
├── fonts/              Outfit-Bold.woff2, Inter-Regular.woff2
└── Brand/              Logo, Favicon, Brand Assets
```

## Lokal starten

```bash
node serve.mjs
# → http://localhost:3000
```

## Screenshots

```bash
node screenshot.mjs http://localhost:3000
# → temporary screenshots/screenshot-N-desktop.png
# → temporary screenshots/screenshot-N-mobile.png
```

## Deployment

GitHub Pages — automatisch bei jedem Push auf `master`.  
Custom Domain: `jacobdigital.de` via IONOS.

## Kontakt

peter@jacobdigital.de
