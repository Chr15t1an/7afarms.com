# 7A Farms Website — 7afarms.com

## Project Overview
Static marketing website for 7A Farms, a farm stand / direct-to-consumer market. Built with Jekyll 4.3 and deployed on Cloudflare Pages.

## Tech Stack
- **Static site generator:** Jekyll 4.3 (Ruby)
- **Styling:** Tailwind CSS via CDN
- **Icons:** Lucide Icons via CDN
- **Hosting:** Cloudflare Pages
- **Contact form backend:** Cloudflare Pages Function + SendGrid
- **Analytics:** Google Tag Manager (placeholder)

## Local Development
```bash
bundle install
bundle exec jekyll serve --livereload
# Site available at http://localhost:4000
```

## Project Structure
- `_layouts/default.html` — Single base layout (all pages use this)
- `_includes/` — Reusable partials (header, footer, page sections)
- `assets/css/main.scss` — Custom styles (Tailwind via CDN in layout)
- `functions/api/contact.js` — Cloudflare Pages Function for contact form
- `_config.yml` — Site settings, business info, hours, social links

## Brand Colors
- **Primary (forest green):** `#2d6a4f`
- **Secondary (warm tan):** `#d4a373`
- **Dark (near-black):** `#1b1b1b`

## Key Conventions
- All pages use the `default` layout
- Business info (phone, address, hours) lives in `_config.yml` and is accessed via `site.*`
- Contact form has honeypot spam protection + rate limiting
- Contact form runs in demo mode on localhost (no backend needed)
- Privacy policy and terms of service are template content — update with real legal text

## Deployment
- Push to `main` branch triggers Cloudflare Pages build
- Build command: `bundle exec jekyll build`
- Output directory: `_site`
- Environment variables needed: `SENDGRID_API_KEY`, `CONTACT_EMAIL` (see `.env.example`)

## Common Tasks
- **Update business info:** Edit `_config.yml`
- **Update hours:** Edit `hours` array in `_config.yml`
- **Add a new page:** Create `page-name.html` with YAML front matter, use `layout: default`
- **Modify nav links:** Edit `_includes/header.html`
- **Modify styles:** Edit `assets/css/main.scss` or add Tailwind classes directly in HTML
