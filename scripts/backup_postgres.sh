#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="${1:-storage/backups}"
mkdir -p "$BACKUP_DIR"

if [[ -z "${DB_DATABASE:-}" ]]; then
  echo "DB_DATABASE is required."
  exit 1
fi

OUTPUT_FILE="${BACKUP_DIR}/cardict_${TIMESTAMP}.sqlc"
export PGPASSWORD="${DB_PASSWORD:-}"

pg_dump \
  --format=custom \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-5432}" \
  --username="${DB_USERNAME:-postgres}" \
  --dbname="${DB_DATABASE}" \
  --file="${OUTPUT_FILE}"

echo "Backup created at ${OUTPUT_FILE}"

