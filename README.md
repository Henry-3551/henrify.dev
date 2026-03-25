# Henrify.dev Portfolio

Modern, multi-page portfolio for showcasing Henrify's full-stack development, automation, and design services. The site highlights featured projects, services, and contact channels while remaining lightweight enough to host on any static platform.

## Features
- Responsive Tailwind-powered layout with animated hero, services, and project sections
- Dedicated pages for About, Services, Projects, and Contact to organize content clearly
- SEO-ready metadata, Open Graph cards, and JSON-LD schema for improved discoverability
- Google Analytics tracking plus sitemap and robots files for production deployments
- Contact CTAs across the site to drive leads to the preferred channels

## Tech Stack
- HTML5 + semantic SEO tags
- Tailwind CSS (CDN) and custom styles in `CSS/main.css`
- Vanilla JavaScript in `JS/app.js` for interactions such as the mobile menu and loader
- Static assets under `ASSETS/` (logos, icons, PDFs, verification files)

## Project Structure
```
Henrify Port/
├── index.html          # Landing page
├── about.html          # Personal background & skills
├── services.html       # Detailed service offerings
├── projects.html       # Portfolio case studies
├── contact.html        # Contact form & social links
├── CSS/main.css        # Custom styling and animations
├── JS/app.js           # Loader, navbar, and other behavior
├── ASSETS/             # Images, icons, resume, verification assets
├── sitemap.xml / robots.txt / CNAME / google*.html
└── README.md
```

## Getting Started
1. Clone the repository: `git clone https://github.com/<username>/<repo>.git`
2. Open the folder in VS Code (recommended) and install the Live Server extension if you want hot reloads.
3. Serve locally:
	- Quick preview: open `index.html` directly in a browser, or
	- Better workflow: run Live Server from `index.html` for auto-refresh while editing CSS/JS.
4. Edit any HTML/CSS/JS files, then commit and push changes to GitHub Pages, Netlify, Vercel, or another static host.

## Deployment Notes
- Ensure the custom domain (if any) remains mapped by keeping the provided `CNAME` file intact.
- Regenerate `sitemap.xml` if URLs change, and update search console verification files when needed.
- Update meta tags in each HTML file whenever you change branding, description, or social preview assets.

## Contact
For collaboration or inquiries, use the prompts embedded throughout the site (CTA buttons) or reach out via the social handles linked in the footer/nav.
