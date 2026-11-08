#!/usr/bin/env bash
# DARMA: complete standalone install on an EMPTY Ubuntu/Debian VPS.
set -Eeuo pipefail
umask 027
export DEBIAN_FRONTEND=noninteractive
say(){ printf '\n[DARMA] %s\n' "$*"; }
fail(){ printf '\nDARMA_FRESH_INSTALL_FAILED: %s\n' "$*" >&2; exit 1; }
[[ "$(id -u)" = "0" ]] || fail "Execute as root."
for x in apt-get dpkg awk grep curl; do command -v "$x" >/dev/null || fail "Missing base command $x"; done
[[ -r /etc/os-release ]] || fail "Cannot read OS release."
. /etc/os-release
case "$ID" in ubuntu|debian) ;; *) fail "Only stock Ubuntu or Debian is supported, detected $ID.";; esac
codename="$VERSION_CODENAME"
if [[ "$ID" = "ubuntu" && -n "$(printenv UBUNTU_CODENAME || true)" ]]; then codename="$UBUNTU_CODENAME"; fi
[[ -n "$codename" ]] || fail "Cannot determine OS release codename."
APP=/opt/darmawear-store
REPO=https://github.com/aliiitavazoeiii-afk/darma.git
COMPOSE=deploy/compose.fresh.yml
HERO_SHA=66cfb4f1703070afff1c2e6343ba3ccc93ebc3e820ac0a0c8f9731317bc4e94f

if command -v flock >/dev/null; then exec 9>/run/darmawear-fresh-install.lock; flock -n 9 || fail "Another install is running."; fi
[[ ! -e /opt/darma-general ]] || fail "Existing ERP directory found: this installer is only for a new VPS."
[[ ! -e "$APP" || -d "$APP/.git" ]] || fail "Unrecognized existing $APP; not overwriting."
say "Checking ports 80 and 443, preparing the system."
apt-get update -y
apt-get install -y ca-certificates curl git iproute2 openssl
if ! command -v docker >/dev/null 2>&1; then
  occupied="$(ss -lntH | awk '{print $4}' | grep -E ':(80|443)$' || true)"
  [[ -z "$occupied" ]] || fail "Web ports already in use: $occupied"
  say "Installing Docker Engine and Compose from official Docker apt repository."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  architecture="$(dpkg --print-architecture)"
  cat > /etc/apt/sources.list.d/docker.sources <<DOCKER_REPO
Types: deb
URIs: https://download.docker.com/linux/$ID
Suites: $codename
Components: stable
Architectures: $architecture
Signed-By: /etc/apt/keyrings/docker.asc
DOCKER_REPO
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
else
  docker compose version >/dev/null 2>&1 || fail "Existing Docker lacks Compose; refusing to replace an unknown installation."
fi
docker info >/dev/null 2>&1 || fail "Docker daemon unavailable."
docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin unavailable."
if docker inspect darma-general-caddy-1 >/dev/null 2>&1; then fail "Old ERP Caddy detected; wrong VPS for fresh installation."; fi
if ! docker inspect darmawear-store-caddy >/dev/null 2>&1; then
  occupied="$(ss -lntH | awk '{print $4}' | grep -E ':(80|443)$' || true)"
  [[ -z "$occupied" ]] || fail "Web ports already occupied: $occupied"
fi

if [[ -d "$APP/.git" ]]; then
  remote="$(git -C "$APP" remote get-url origin)"
  [[ "$remote" = "$REPO" ]] || fail "Unknown git remote $remote; not overwriting."
  [[ -z "$(git -C "$APP" status --porcelain --untracked-files=no)" ]] || fail "Local tracked edits detected; not overwriting."
  say "Updating protected main (fast forward only)."
  git -C "$APP" fetch origin main
  git -C "$APP" checkout main
  git -C "$APP" merge --ff-only origin/main
else
  say "Cloning all website sources, approved imagery and deployment code from GitHub."
  git clone --depth 1 --branch main "$REPO" "$APP"
fi
cd "$APP"
for image in public/media/hero-desktop.webp public/media/hero-mobile.webp; do
  [[ -f "$image" ]] || fail "Missing approved photo $image"
  printf '%s  %s\n' "$HERO_SHA" "$image" | sha256sum -c - >/dev/null || fail "Photo checksum mismatch: $image"
done
[[ -f "$COMPOSE" && -f deploy/Caddyfile.fresh ]] || fail "Missing standalone Docker/Caddy config."
printf 'NEXT_PUBLIC_SITE_LIVE=false\n' > .env.preview
chmod 600 .env.preview

# Credentials generated ONLY on the VPS, never committed to GitHub or printed in logs.
# Existing passwords/tokens and CMS records are preserved on every subsequent update.
if [[ ! -f .env.cms ]]; then
  say "Generating private first-run CMS/Postgres secrets (not printed)."
  dbpass="$(openssl rand -hex 28)"
  adminpass="$(openssl rand -hex 22)"
  admintoken="$(openssl rand -hex 32)"
  signsecret="$(openssl rand -hex 32)"
  cat > .env.cms <<CMS_ENV
SECRET=$signsecret
DB_CLIENT=pg
DB_HOST=cms-db
DB_PORT=5432
DB_DATABASE=darma_cms
DB_USER=darma_cms
DB_PASSWORD=$dbpass
POSTGRES_DB=darma_cms
POSTGRES_USER=darma_cms
POSTGRES_PASSWORD=$dbpass
ADMIN_EMAIL=admin@darmawear.ir
ADMIN_PASSWORD=$adminpass
ADMIN_TOKEN=$admintoken
PUBLIC_URL=https://admin.darmawear.ir
FILES_MAX_UPLOAD_SIZE=25mb
FILES_MIME_TYPE_ALLOW_LIST=image/jpeg,image/png,image/webp,image/avif,image/gif,font/woff2
CORS_ENABLED=false
WEBSOCKETS_ENABLED=false
TELEMETRY=false
CMS_ENV
  chmod 600 .env.cms
  # Initial password stays local; the user can retrieve it privately when logging in.
  printf 'URL=https://admin.darmawear.ir/admin\nEMAIL=admin@darmawear.ir\nPASSWORD=%s\n' "$adminpass" > /root/darmawear-admin-first-login.txt
  chmod 600 /root/darmawear-admin-first-login.txt
  unset dbpass adminpass admintoken signsecret
fi
# Add website-licensed WOFF2 support on old installs without changing credentials/content.
if grep -q '^FILES_MIME_TYPE_ALLOW_LIST=' .env.cms &&
   ! grep '^FILES_MIME_TYPE_ALLOW_LIST=' .env.cms | grep -q 'font/woff2'; then
  sed -i '/^FILES_MIME_TYPE_ALLOW_LIST=/s|$|,font/woff2|' .env.cms
fi
[[ -s .env.cms ]] || fail "CMS secret file is missing or empty"
admintoken="$(sed -n 's/^ADMIN_TOKEN=//p' .env.cms | head -n1)"
[[ "$admintoken" =~ ^[a-f0-9]{64}$ ]] || fail "Existing CMS API token has invalid format"
printf 'DARMA_CMS_URL=http://cms:8055\nDARMA_CMS_TOKEN=%s\n' "$admintoken" > .env.store
chmod 600 .env.store
unset admintoken

say "Validating isolated Caddy + Compose configuration."
docker compose -p darmawear-store -f "$COMPOSE" config -q
docker compose -p darmawear-store -f "$COMPOSE" run --rm --no-deps --entrypoint caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

say "Starting separate password-protected CMS and private PostgreSQL."
docker compose -p darmawear-store -f "$COMPOSE" up -d cms-db cms
cms_ready=0
for attempt in $(seq 1 65); do
  if docker exec darmawear-admin node -e "fetch('http://127.0.0.1:8055/server/ping').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    cms_ready=1;break
  fi
  sleep 3
done
[[ "$cms_ready" = "1" ]] || fail "CMS startup failed. Show: docker logs darmawear-admin"
# Backup before any future additive CMS schema migration (orders and editor changes are preserved).
if docker exec darmawear-cms-db psql -U darma_cms -d darma_cms -tAc \
  "SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='darma_content'" 2>/dev/null | grep -qx 1; then
  mkdir -p "$APP/backups"
  chmod 700 "$APP/backups"
  backup="$APP/backups/cms-pre-upgrade-$(date +%Y%m%d-%H%M%S).sql"
  docker exec darmawear-cms-db pg_dump -U darma_cms -d darma_cms > "$backup"
  chmod 600 "$backup"
  say "CMS database safety backup created in backups/ (never exposed by Caddy)."
fi
say "Provisioning the seven content/product/order editing areas without overwriting edits."
docker exec -i darmawear-admin node --input-type=module - < cms/bootstrap.mjs

say "Building Next.js with locked SEO controls."
docker compose -p darmawear-store -f "$COMPOSE" up -d --build --no-deps web
healthy=0
for attempt in $(seq 1 50); do
  if docker exec darmawear-store-web node -e "Promise.all(['/', '/media/hero-desktop.webp', '/media/hero-mobile.webp','/robots.txt'].map(p=>fetch('http://127.0.0.1:3000'+p))).then(rs=>process.exit(rs.every(r=>r.status===200)?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then healthy=1;break;fi
  sleep 3
done
[[ "$healthy" = "1" ]] || fail "Storefront HTTP health check failed. Show: docker logs darmawear-store-web"
say "Starting dedicated HTTPS Caddy proxy."
docker compose -p darmawear-store -f "$COMPOSE" up -d --no-deps caddy
docker exec darmawear-store-caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q '^Status: active'; then
  ufw allow 80/tcp >/dev/null || true
  ufw allow 443/tcp >/dev/null || true
fi
printf '\nDARMA_FRESH_SITE_INSTALLED_OK\n'
printf 'DOMAIN=https://darmawear.ir\nCMS=https://admin.darmawear.ir/admin\nCMS_LOGIN_FILE=/root/darmawear-admin-first-login.txt\n'
printf 'REVISION='; git rev-parse --short HEAD
printf 'INDEXING=DISABLED (preview)\nPAYMENTS=NOT_LIVE\n'
docker compose -p darmawear-store -f "$COMPOSE" ps
printf '\nSet the A record of darmawear.ir to THIS VPS IP for automatic public HTTPS.\n'
printf 'Verify: curl -I https://darmawear.ir\n'
