# shoyeb.dev

Source for [shoyeb.dev](https://shoyeb.dev), the portfolio of Shoyeb Akhtar, a mobile product engineer working across React Native, Expo, iOS and Android.

The site presents production work, engineering case studies and the services I offer to teams building or maintaining mobile products. It includes live store links for RangeNow, longer write-ups about shipped products, upstream open-source work and a contact form for project enquiries.

## What is here

- A focused overview of my mobile product work and technical background
- Case studies for RangeNow, Kuttl and Smriti
- Public App Store, Google Play and product links
- Writing powered by Astro content collections
- A serverless contact form with validation and spam protection
- Responsive images, light/dark themes, reduced-motion support and SEO metadata

## Stack

- [Astro](https://astro.build/) and TypeScript
- Plain Astro components and CSS, with no client-side framework
- Cloudflare Pages and Pages Functions
- Resend for contact-form delivery
- GitHub Actions for build and deployment

## Project structure

```text
public/                  Static images, icons and crawler files
src/components/          Homepage sections and shared UI
src/content/posts/       Project case studies
src/layouts/             Shared document layout and metadata
src/pages/               Homepage, writing routes and form outcomes
src/styles/              Design tokens and motion styles
functions/api/contact.ts Cloudflare Pages contact-form handler
```

## Local development

Requires Node.js 22.12 or later.

```sh
npm install
npm run dev
```

The development server starts at `http://localhost:4321` by default.

To create and inspect a production build:

```sh
npm run build
npm run preview
```

## Contact form configuration

The Cloudflare Pages project needs these environment variables:

- `RESEND_API_KEY` — a Resend API key authorized to send from `shoyeb.dev`
- `CONTACT_TO` — the address that receives portfolio enquiries

The form posts to `/api/contact`, validates the required fields, ignores honeypot submissions and redirects to a success or error page.

## Deployment

Every push to `main` runs the GitHub Actions deployment workflow. The workflow installs dependencies with `npm ci`, builds the static site, verifies the expected output and deploys `dist/` to the `shoyeb-dev` Cloudflare Pages project.

Deployment requires the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
