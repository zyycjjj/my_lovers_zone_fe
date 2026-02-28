#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DEPLOY_HOST:-}" ]]; then echo "Missing DEPLOY_HOST"; exit 1; fi
if [[ -z "${DEPLOY_USER:-}" ]]; then echo "Missing DEPLOY_USER"; exit 1; fi
if [[ -z "${DEPLOY_PATH:-}" ]]; then echo "Missing DEPLOY_PATH"; exit 1; fi
if [[ -z "${DEPLOY_SERVICE:-}" ]]; then echo "Missing DEPLOY_SERVICE"; exit 1; fi

DEPLOY_PORT="${DEPLOY_PORT:-22}"

ssh -o StrictHostKeyChecking=no -p "${DEPLOY_PORT}" "${DEPLOY_USER}@${DEPLOY_HOST}" "
  mkdir -p '${DEPLOY_PATH}' 2>/dev/null || true
  if [ ! -d '${DEPLOY_PATH}' ]; then
    if sudo -n /bin/mkdir -p '${DEPLOY_PATH}' 2>/dev/null || sudo -n /usr/bin/mkdir -p '${DEPLOY_PATH}' 2>/dev/null; then
      sudo -n /bin/chown -R '${DEPLOY_USER}':'${DEPLOY_USER}' '${DEPLOY_PATH}' 2>/dev/null || sudo -n /usr/bin/chown -R '${DEPLOY_USER}':'${DEPLOY_USER}' '${DEPLOY_PATH}'
    else
      echo 'SUDO_REQUIRED_FOR_DEPLOY_PATH'
      exit 1
    fi
  fi
  if [ ! -w '${DEPLOY_PATH}' ]; then
    if sudo -n /bin/chown -R '${DEPLOY_USER}':'${DEPLOY_USER}' '${DEPLOY_PATH}' 2>/dev/null || sudo -n /usr/bin/chown -R '${DEPLOY_USER}':'${DEPLOY_USER}' '${DEPLOY_PATH}' 2>/dev/null; then
      :
    else
      echo 'DEPLOY_PATH_NOT_WRITABLE_AND_NO_SUDO'
      exit 1
    fi
  fi
  mkdir -p '${DEPLOY_PATH}/deploy' 2>/dev/null || true
  sudo -n /bin/chown -R '${DEPLOY_USER}':'${DEPLOY_USER}' '${DEPLOY_PATH}/deploy' 2>/dev/null || sudo -n /usr/bin/chown -R '${DEPLOY_USER}':'${DEPLOY_USER}' '${DEPLOY_PATH}/deploy' 2>/dev/null || true
"

rsync -az --delete --no-perms --no-owner --no-group -e "ssh -p ${DEPLOY_PORT} -o StrictHostKeyChecking=no" .next public package.json pnpm-lock.yaml next.config.ts .env deploy/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

ssh -o StrictHostKeyChecking=no -p "${DEPLOY_PORT}" "${DEPLOY_USER}@${DEPLOY_HOST}" "DEPLOY_PATH='${DEPLOY_PATH}' DEPLOY_SERVICE='${DEPLOY_SERVICE}' bash -s" <<'REMOTE'
set -euo pipefail
export PNPM_HOME="${HOME}/.local/share/pnpm"
export PATH="${PNPM_HOME}:${PATH}"
if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    corepack enable || true
    corepack prepare pnpm@9 --activate || true
  fi
fi
if ! command -v pnpm >/dev/null 2>&1; then
  curl -fsSL https://get.pnpm.io/install.sh | SHELL=$(command -v bash) bash -s -- --version 9
  export PATH="${PNPM_HOME}:${PATH}"
fi
pnpm --version
cd "${DEPLOY_PATH}"
echo "[deploy] CWD: $(pwd)"
pnpm install --prod
SERVICE_NAME="${DEPLOY_SERVICE:-}"
if [ -z "${SERVICE_NAME}" ]; then
  CANDIDATE=$(ls -1 deploy/*.service 2>/dev/null | head -n1 || true)
  if [ -n "${CANDIDATE}" ]; then
    SERVICE_NAME=$(basename "${CANDIDATE}" .service)
    echo "[deploy] DEPLOY_SERVICE not set, detected service name: ${SERVICE_NAME}"
  fi
fi
if [ -z "${SERVICE_NAME}" ]; then
  echo "[deploy] ERROR: service name is empty (DEPLOY_SERVICE not set and no deploy/*.service found)"
  exit 1
fi
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
SOURCE_FILE="${DEPLOY_PATH}/deploy/${SERVICE_NAME}.service"
if [ ! -f "${SERVICE_FILE}" ]; then
  if [ -f "${SOURCE_FILE}" ]; then
    echo "[deploy] Installing systemd unit: ${SERVICE_FILE}"
    sudo -n cp "${SOURCE_FILE}" "${SERVICE_FILE}"
    sudo -n /usr/bin/systemctl daemon-reload
    sudo -n /usr/bin/systemctl enable "${SERVICE_NAME}"
  else
    echo "[deploy] ERROR: source unit not found at ${SOURCE_FILE}"
    exit 1
  fi
else
  echo "[deploy] Unit already exists: ${SERVICE_FILE}"
  sudo -n /usr/bin/systemctl daemon-reload
fi
sudo -n /usr/bin/systemctl restart "${SERVICE_NAME}"
REMOTE
