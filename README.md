# Iinvitation

**Digital wedding invitation platform with a public marketing site, multi-client CMS, guest management, RSVP, digital guestbook, wedding-frame experience, review workflow, and reusable invitation templates.**

## Overview

Iinvitation is a full-stack invitation platform built as a React + TypeScript frontend with a Node.js + Express API and MySQL persistence.

The project combines a customer-facing marketing website with a backoffice workflow for creating and managing invitation projects. Each invitation can expose a personalized public page, guest links, RSVP, guestbook check-in, wedding frame, media, template customization, and client review flow.

## Core capabilities

- Multi-client invitation management
- Reusable wedding invitation themes and templates
- Personalized guest links
- Guest import/export workflow
- RSVP and wishes
- Digital guestbook and check-in
- Wedding-frame experience
- Media upload and management
- Invitation section manager
- Template/design editor
- WhatsApp message workflow
- Client review and approval workflow
- Public preview / publication workflow
- Marketing landing page with interactive catalog
- QR-code utilities
- SSE-based realtime event updates
- MySQL migration and seed flow

## Architecture

```text
Browser
  |
  +-- Marketing Website
  +-- Admin / Backoffice
  +-- Public Invitation
  +-- Guestbook
  +-- Wedding Frame
  +-- Client Review
          |
          v
   React + Vite + TypeScript
          |
       /api + /uploads
          |
          v
    Node.js + Express
          |
          +-- Admin API
          +-- Public API
          +-- Media API
          +-- Realtime Hub
          |
          v
         MySQL
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Routing | React Router |
| Icons | Lucide React |
| QR | qrcode |
| Spreadsheet | SheetJS / xlsx |
| Backend | Node.js, Express |
| Database | MySQL via mysql2 |
| Uploads | Multer |
| Realtime | Server-Sent Events |
| Configuration | dotenv |

## Main routes

- `/` Marketing website
- `/admin` Backoffice / CMS
- `/invite/{slug}` Public invitation
- `/checkin/{slug}` Digital guestbook
- `/frame/{slug}` Wedding frame
- `/review/{token}` Client review flow

## Repository structure

```text
iinvitation/
├── public/             Static brand and marketing assets
├── scripts/            Local development helpers
├── server/
│   ├── data/uploads/   Runtime uploads, ignored by Git
│   ├── sql/            Database schema/migrations
│   └── src/            Express API
├── src/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── marketing/
│   ├── types/
│   └── utils/
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

## Local setup

### Requirements

- Node.js
- npm
- MySQL or XAMPP MySQL

Install dependencies:

```bash
npm install
```

Create the backend environment file:

```bash
copy server\.env.example server\.env
```

On macOS/Linux:

```bash
cp server/.env.example server/.env
```

Before running the app, replace `ADMIN_PASSWORD` in `server/.env` with your own strong local password.

Start both the frontend and API:

```bash
npm run dev
```

The development launcher automatically finds available frontend and API ports and connects the Vite proxy to the selected API port.

## Environment

The repository contains only `server/.env.example`. Never commit the real `server/.env`.

Typical local variables include:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
PORT
ADMIN_EMAIL
ADMIN_PASSWORD
SESSION_TTL_HOURS
COOKIE_SECURE
ALLOWED_ORIGINS
ALLOW_PRIVATE_LAN_ORIGINS
UPLOAD_DIR
```

## Build

```bash
npm run build
```

## API syntax check

```bash
npm run check:api
```

## Repository hygiene

The GitHub-ready version intentionally excludes:

- `node_modules`
- generated `dist`
- local `server/.env`
- runtime uploads
- update backups and patch logs
- build cache files
- customer-specific/private data

Demo identities, phone numbers, and payment details in the source are synthetic placeholders.

## Security

Do not commit production credentials, customer guest lists, uploaded customer media, database exports, private invitation tokens, real bank details, or real WhatsApp/contact data.

Change the example admin password before running the platform outside a throwaway local environment.

## Author

**Febrian Tri Prasmanto**  
Full-Stack Programmer

- GitHub: https://github.com/Febriantrip
- LinkedIn: https://www.linkedin.com/in/febriantrip
