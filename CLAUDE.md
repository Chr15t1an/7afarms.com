# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Static marketing website for 7A Farms, a family-owned farm stand / direct-to-consumer market. Built with Jekyll 4.3 (Ruby 3.2) and deployed on Cloudflare Pages.

## Build & Development Commands
```bash
bundle install                          # Install Ruby dependencies
bundle exec jekyll serve --livereload   # Dev server at http://localhost:4000
bundle exec jekyll build                # Production build → _site/
```

## Tech Stack
- **Jekyll 4.3** with plugins: jekyll-feed, jekyll-sitemap, jekyll-seo-tag
- **Tailwind CSS via CDN** — configured inline in `_layouts/default.html` (not a build step)
- **Lucide Icons via CDN** — initialized with `lucide.createIcons()` in layout
- **Cloudflare Pages Functions** — serverless backend for contact form (`functions/api/contact.js`)

## Architecture
- **Single layout**: `_layouts/default.html` — every page uses `layout: default`
- **Homepage** (`index.html`) is composed of four includes: `hero-section`, `services-section`, `about-section`, `contact-section`
- **Business data** (phone, address, hours, social links) lives in `_config.yml`, accessed as `site.*` in templates
- **Tailwind custom colors** are defined in the `tailwind.config` script block in `default.html`, not in a config file. Brand colors: primary `#2d6a4f` (forest green), secondary `#d4a373` (warm tan), dark `#1b1b1b`
- **Custom CSS**: `assets/css/main.scss` — minimal overrides (focus rings, transitions, scroll behavior)
- **Contact form** (`_includes/contact-form.html`): client-side JS with honeypot spam protection, rate limiting (60s), and demo mode on localhost. Submits to `/api/contact` which is a Cloudflare Pages Function using SendGrid

## Deployment
- Push to `main` → Cloudflare Pages auto-builds with `bundle exec jekyll build`
- Output directory: `_site`
- Required env vars on Cloudflare: `SENDGRID_API_KEY`, `CONTACT_EMAIL`

## Key Conventions
- New pages: create `page-name.html` with `layout: default` in front matter
- Nav links must be updated in both desktop and mobile sections of `_includes/header.html`
- Privacy policy and terms of service contain template placeholder text
- `_config.yml` changes require restarting the dev server
