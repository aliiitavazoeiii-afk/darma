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
if [[ "$ID" = "ubuntu" && -n "$UBUNTU_CODENAME" ]]; then codename="$UBUNTU_CODENAME"; fi
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
apt-get install -y ca-certificates curl git iproute2
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
say "Validating isolated Caddy + Compose configuration."
docker compose -p darmawear-store -f "$COMPOSE" config -q
docker compose -p darmawear-store -f "$COMPOSE" run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

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
if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q '^Status: active'; then
  ufw allow 80/tcp >/dev/null || true
  ufw allow 443/tcp >/dev/null || true
fi
printf '\nDARMA_FRESH_SITE_INSTALLED_OK\n'
printf 'DOMAIN=https://darmawear.ir\n'
printf 'REVISION='; git rev-parse --short HEAD
printf 'INDEXING=DISABLED (preview)\nPAYMENTS=NOT_LIVE\n'
docker compose -p darmawear-store -f "$COMPOSE" ps
printf '\nSet the A record of darmawear.ir to THIS VPS IP for automatic public HTTPS.\n'
printf 'Verify: curl -I https://darmawear.ir\n'
