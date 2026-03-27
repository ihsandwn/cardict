#!/usr/bin/env bash
set -euo pipefail

BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" || ! -f "$BACKUP_FILE" ]]; then
  echo "Usage: ./scripts/restore_postgres.sh <path-to-backup.sqlc>"
  exit 1
fi

if [[ -z "${DB_DATABASE:-}" ]]; then
  echo "DB_DATABASE is required."
  exit 1
fi

export PGPASSWORD="${DB_PASSWORD:-}"

pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-5432}" \
  --username="${DB_USERNAME:-postgres}" \
  --dbname="${DB_DATABASE}" \
  "${BACKUP_FILE}"

echo "Restore completed from ${BACKUP_FILE}"

