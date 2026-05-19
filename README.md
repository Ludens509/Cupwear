# Cupwear ⚽

Official-style football kit store for the 2026 FIFA World Cup.
Browse jerseys from all 48 nations, find your country's kit, and rep it on match day.

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4 (CSS-native config, @tailwindcss/vite)
- Three.js — 3D soccer ball with custom canvas texture
- GSAP Flip + ScrollTrigger — scroll-driven ball animation between waypoints
- CSS Modules — scoped component styles

## Features

- Fanned jersey showcase with per-nation SVG kit rendering
- Filterable nations grid by World Cup group
- Scroll-driven 3D ball that travels between DOM waypoints on scroll
- Classic black-and-white truncated icosahedron ball texture (12 pentagons, 20 hexagons)
- Responsive layout with Tailwind utility classes
- Clean component architecture ready to extend with real product data

## Getting started

npm install
npm run dev