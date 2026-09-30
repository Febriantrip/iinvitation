# Iinvitation

<p align="center">
  <strong>Full-stack digital wedding invitation platform with multi-client CMS, guest personalization, RSVP, guestbook, check-in, review workflow, and reusable invitation themes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-5.1.0-111827" alt="Version 5.1.0">
  <img src="https://img.shields.io/badge/React-TypeScript-3178C6?logo=react&logoColor=fff" alt="React + TypeScript">
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=fff" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=fff" alt="Node.js + Express">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=fff" alt="MySQL">
  <img src="https://img.shields.io/badge/Realtime-SSE-0F766E" alt="Server-Sent Events">
</p>

## Overview

**Iinvitation** is a full-stack digital invitation platform that combines a public marketing website with an operational backoffice for creating and managing invitation projects.

Each invitation can expose its own personalized public experience, guest links, RSVP workflow, guestbook and check-in flow, wedding-frame feature, media, editable sections, client review process, and publication state.

The application is built as a React + TypeScript frontend backed by a Node.js + Express API and MySQL persistence.

## Product areas

| Area | What it covers |
| --- | --- |
| **Marketing Website** | Public landing page, package presentation, catalog, and WhatsApp inquiry flow |
| **Admin / Backoffice** | Multi-client invitation project management |
| **Invitation CMS** | Section content, media, design configuration, template selection |
| **Guest Manager** | Guest records, personalized invitation links, import/export |
| **RSVP** | Attendance, pax, messages, and guest status |
| **Digital Guestbook** | Guest lookup and event-side check-in workflow |
| **Wedding Frame** | Shareable event frame experience |
| **Client Review** | Tokenized review, approval, and revision workflow |
| **Publication** | Preview and publication-state management |
| **Realtime** | Server-Sent Event updates for supported flows |

## Core capabilities

- Multi-client invitation management
- Reusable wedding invitation themes and templates
- Personalized guest invitation links
- Guest import/export workflow
- RSVP and wishes
- Digital guestbook and check-in
- Wedding-frame experience
- Media upload and management
- Invitation section manager
- Template/design editor
- WhatsApp message workflow
- Client review and approval
- Public preview and publication workflow
- Marketing landing page with interactive catalog
- QR-code utilities
- SSE-based realtime updates
- MySQL migration and seed flow

## Architecture

~~~mermaid
flowchart LR
    VIS[Visitors] --> WEB[React + TypeScript]
    ADM[Admin / Backoffice] --> WEB
    GUEST[Invitation Guests] --> WEB
    CLIENT[Client Review] --> WEB

    WEB -->|REST API| API[Node.js + Express]

    API --> ADMIN[Admin API]
    API --> PUBLIC[Public Invitation API]
    API --> MEDIA[Media API]
    API --> RT[SSE Realtime Hub]

    ADMIN --> DB[(MySQL)]
    PUBLIC --> DB
    MEDIA --> STORE[Runtime Upload Storage]
    RT --> WEB
~~~

## Main application routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing website |
| `/admin` | Backoffice / CMS |
| `/invite/{slug}` | Public invitation |
| `/checkin/{slug}` | Digital guestbook / check-in |
| `/frame/{slug}` | Wedding frame |
| `/review/{token}` | Client review flow |

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript |
| Build tool | Vite |
| Routing | React Router |
| Icons | Lucide React |
| QR | qrcode |
| Spreadsheet | SheetJS / xlsx |
| Backend | Node.js, Express |
| Database | MySQL via mysql2 |
| Uploads | Multer |
| Realtime | Server-Sent Events |
| Configuration | dotenv |
| Package structure | npm workspaces |

## Repository structure

~~~text
iinvitation/
├── public/             # Static brand and marketing assets
├── scripts/            # Local development helpers
├── server/
│   ├── data/uploads/   # Runtime uploads, ignored by Git
│   ├── sql/            # Database schema / migrations
│   └── src/            # Express API
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
~~~

## Local development

### Requirements

- Node.js
- npm
- MySQL or XAMPP MySQL

Install dependencies:

~~~bash
npm install
~~~

Create the backend environment file:

~~~powershell
copy server\.env.example server\.env
~~~

On macOS/Linux:

~~~bash
cp server/.env.example server/.env
~~~

Set your local database values and replace the example admin password before starting the application.

Run frontend and API together:

~~~bash
npm run dev
~~~

The development launcher resolves available frontend/API ports and connects the Vite proxy to the selected backend port.

## Environment

Only `server/.env.example` belongs in the repository. The real `server/.env` must remain local.

Typical variables include:

~~~text
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
~~~

## Build and validation

Production frontend build:

~~~bash
npm run build
~~~

Backend syntax validation:

~~~bash
npm run check:api
~~~

## Security and repository hygiene

This public repository intentionally excludes:

- `node_modules/`
- generated `dist/`
- local `server/.env`
- runtime uploads
- backup and patch artifacts
- build cache files
- customer-specific guest data
- customer media
- real payment information
- production invitation/review/session tokens
- real WhatsApp/contact information

Demo identities, phone numbers, and payment details in the source are synthetic placeholders.

See [SECURITY.md](SECURITY.md) for repository security guidance.

## Portfolio context

This repository showcases the engineering structure of the invitation platform: a customer-facing product, operational CMS, personalized guest flows, and an API-backed data model working as one application.

It is published as a sanitized portfolio version. Production customer data and operational secrets are not part of this repository.

## Author

**Febrian Tri Prasmanto**  
Full-Stack Programmer

- GitHub: [@Febriantrip](https://github.com/Febriantrip)
- LinkedIn: [linkedin.com/in/febriantrip](https://www.linkedin.com/in/febriantrip)

---

<p align="center">
  Digital invitations as a small product ecosystem, not just a single landing page.
</p>
