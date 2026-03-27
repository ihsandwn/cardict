# Cardict E-Commerce

Production-oriented e-commerce app built with Laravel + Inertia React + TypeScript, using PostgreSQL and Laravel Reverb for realtime features.

## Tech Stack

- Backend: Laravel 13, PHP 8.3
- Frontend: Inertia.js, React 18, TypeScript, Vite, Tailwind CSS
- Database: PostgreSQL
- Realtime: Laravel Reverb + Laravel Echo
- Queue / Session / Cache: database drivers
- Testing: PHPUnit (feature/unit), Playwright (E2E stubs)

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+ and npm
- PostgreSQL 14+

## Quick Start

1) Install dependencies and initialize app:

```bash
composer run setup
```

2) Configure environment:

- Copy `.env.example` to `.env` (if not already created by setup)
- Set database credentials for your local PostgreSQL:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=5432`
  - `DB_DATABASE=cardict`
  - `DB_USERNAME=...`
  - `DB_PASSWORD=...`
- Ensure realtime is enabled:
  - `BROADCAST_CONNECTION=reverb`
  - `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`
  - `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME`

3) Run database migration + seed:

```bash
php artisan migrate --seed
```

4) Start local development (server + queue + logs + vite + reverb):

```bash
composer run dev
```

## Useful Commands

- Backend tests:

```bash
php artisan test
```

- Frontend build:

```bash
npm run build
```

- E2E stubs (Playwright):

```bash
npm run test:e2e
```

- Re-run migration from clean state:

```bash
php artisan migrate:fresh --seed
```

## Realtime / Chat Notes

- Live chat uses private broadcasting channels via Reverb.
- If realtime events do not appear in browser:
  - make sure `composer run dev` is running (includes `reverb:start`)
  - run `php artisan optimize:clear`
  - hard refresh browser

## Security / Runtime Notes

- CSP and security headers are enforced in middleware.
- Queue connection is `database`; avoid `sync` in production.
- Session/cookie hardening is configured through env values (`SESSION_SECURE_COOKIE`, etc.).

## Backup / Restore Scripts

- Backup PostgreSQL:

```bash
./scripts/backup_postgres.sh
```

- Restore PostgreSQL:

```bash
./scripts/restore_postgres.sh <path-to-backup.sqlc>
```

## Design Assets Export

Stitch exports are saved under:

- `stitch_exports/images`
- `stitch_exports/code`
- `stitch_exports/design-system-*.json`

## Default Seed Admin

Seeders create an admin user:

- Email: `admin@example.com`
- Password: (see seeder/default factory value in your local project)

Update credentials immediately for non-local environments.

## Troubleshooting

### 1) Vite assets blocked by CSP (browser console)

Symptoms:
- `Loading the script ... violates Content Security Policy`
- `@vite/client` or React refresh scripts are blocked

Checks / fixes:
- Ensure Vite dev server runs on `127.0.0.1:5173` (configured in `vite.config.js`)
- Ensure app is running in local env (`APP_ENV=local`)
- Clear Laravel caches:

```bash
php artisan optimize:clear
```

- Restart dev processes:

```bash
composer run dev
```

### 2) Reverb / live chat not receiving realtime messages

Checks / fixes:
- Confirm `BROADCAST_CONNECTION=reverb` in `.env`
- Confirm Reverb env keys are set (`REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`)
- Confirm Reverb process is running (included in `composer run dev`)
- Hard refresh browser after config changes

### 3) Routes or config look stale

Run:

```bash
php artisan optimize:clear
```

Then retry the request/page.

### 4) Database queue jobs not being processed

Checks:
- `QUEUE_CONNECTION=database`
- Queue worker is running (included in `composer run dev`)
- Queue tables exist (`php artisan queue:table` then migrate, if missing)
