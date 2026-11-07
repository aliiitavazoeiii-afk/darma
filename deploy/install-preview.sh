#!/usr/bin/env bash
# DARMAWEAR: all-in-one GitHub installation and safe idempotent update.
# Only touches its own Docker Compose project and the managed Caddy domain block.
set -Eeuo pipefail
umask 027
fail(){ printf 'DARMA_INSTALL_FAILED: %s\n' "$*" >&2; exit 1; }
info(){ printf '[DARMA] %s\n' "$*"; }
[[ "$(id -u)" -eq 0 ]] || fail "Run as root (or use sudo bash)."
for cmd in git docker grep cp sha256sum date curl awk; do command -v "$cmd" >/dev/null || fail "Missing command: $cmd"; done
docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin required. Existing services unchanged."
if command -v flock >/dev/null; then exec 9>/run/darmawear-preview-install.lock; flock -n 9 || fail "Another DARMA install is active."; fi

REPO='https://github.com/aliiitavazoeiii-afk/darma.git'
APP='/opt/darmawear-store'
CADDY='darma-general-caddy-1'
MARKER='# BEGIN MANAGED DARMAWEAR PREVIEW'
expected='66cfb4f1703070afff1c2e6343ba3ccc93ebc3e820ac0a0c8f9731317bc4e94f'

docker inspect "$CADDY" >/dev/null 2>&1 || fail "Expected Caddy container $CADDY not found. Stopped safely."
CADDYFILE="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')"
[[ -n "$CADDYFILE" && -f "$CADDYFILE" && -w "$CADDYFILE" ]] || fail "Caddyfile is not a writable bind-mounted file. Found: $CADDYFILE. No changes made."
nets="$(docker inspect "$CADDY" --format '{{range $name,$v := .NetworkSettings.Networks}}{{println $name}}{{end}}')"
if printf '%s\n' "$nets" | grep -Fxq 'darma-general_default'; then
  CADDY_NETWORK='darma-general_default'
else
  CADDY_NETWORK="$(printf '%s\n' "$nets" | awk 'NF {print; exit}')"
fi
[[ -n "$CADDY_NETWORK" ]] || fail "Existing Caddy network not detected."

if grep -Fq "$MARKER" "$CADDYFILE"; then
  grep -Fq '# END MANAGED DARMAWEAR PREVIEW' "$CADDYFILE" || fail "Incomplete Caddy block. Inspect before proceeding."
  managed=1
elif grep -Eiq '(^|[ ,])((www\.)?darmawear\.ir)([[:space:],{]|$)' "$CADDYFILE"; then
  fail "Domain already occurs in another Caddy block. No edits made."
else
  managed=0
fi

info "Caddy: $CADDY | Caddyfile: $CADDYFILE | Network: $CADDY_NETWORK"
if [[ -d "$APP/.git" ]]; then
  remote="$(git -C "$APP" remote get-url origin)"
  [[ "$remote" = "$REPO" ]] || fail "Existing app belongs to a different git remote."
  [[ -z "$(git -C "$APP" status --porcelain --untracked-files=no)" ]] || fail "Local tracked changes detected; refusing overwrite."
  info "Updating known DARMA repository (fast-forward only)."
  git -C "$APP" fetch --depth 1 origin main
  git -C "$APP" checkout main
  git -C "$APP" merge --ff-only origin/main
elif [[ -e "$APP" ]]; then
  fail "Unknown existing $APP directory; refusing overwrite."
else
  info "Cloning website and image assets directly from GitHub."
  git clone --depth 1 --branch main "$REPO" "$APP"
fi

cd "$APP"
[[ -f public/media/hero-desktop.webp && -f public/media/hero-mobile.webp ]] || fail "Approved hero assets missing from GitHub clone."
for hero in public/media/hero-desktop.webp public/media/hero-mobile.webp; do
  printf '%s  %s\n' "$expected" "$hero" | sha256sum -c - >/dev/null || fail "Hero image hash unexpected: $hero"
done
info "Approved white-brief hero image verified."
printf 'NEXT_PUBLIC_SITE_LIVE=false\n' > .env.preview
printf 'CADDY_NETWORK=%s\n' "$CADDY_NETWORK" > .env
chmod 600 .env .env.preview
export CADDY_NETWORK
docker compose -p darmawear-store -f deploy/compose.preview.yml config -q

info "Building and starting only the isolated DARMA container."
docker compose -p darmawear-store -f deploy/compose.preview.yml up -d --build --no-deps
ready=0
for attempt in $(seq 1 45); do
  if docker exec darmawear-store-web node -e "Promise.all(['/', '/media/hero-desktop.webp', '/media/hero-mobile.webp','/robots.txt'].map(p=>fetch('http://127.0.0.1:3000'+p))).then(a=>process.exit(a.every(r=>r.status===200)?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    ready=1; break
  fi
  sleep 3
done
[[ "$ready" = 1 ]] || fail "DARMA preview is unhealthy; existing Caddy unchanged. Run: docker logs darmawear-store-web"

if [[ "$managed" = 0 ]]; then
  backup="$CADDYFILE.bak-darmawear-$(date +%Y%m%d-%H%M%S)"
  cp -p "$CADDYFILE" "$backup"
  cat >> "$CADDYFILE" <<'CADDY'

# BEGIN MANAGED DARMAWEAR PREVIEW
darmawear.ir, www.darmawear.ir {
    encode zstd gzip
    reverse_proxy darmawear-store-web:3000
}
# END MANAGED DARMAWEAR PREVIEW
CADDY
  if ! docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile; then
    cp -p "$backup" "$CADDYFILE"
    fail "Caddy validation failed; previous config restored: $backup"
  fi
  if ! docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile; then
    cp -p "$backup" "$CADDYFILE"
    docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || true
    fail "Caddy reload failed; original config restored: $backup"
  fi
  info "New domain route added; existing Caddy services were not restarted."
else
  info "Existing managed DARMA domain route preserved (no Caddy modification)."
fi

printf '\nDARMAWEAR_PREVIEW_INSTALLED_OK\n'
printf 'GIT_REVISION='; git rev-parse --short HEAD
printf 'DOMAIN=https://darmawear.ir\n'
printf 'INDEXING=DISABLED (preview only)\n'
printf 'PAYMENTS=NOT_CONFIGURED\n'
printf 'DNS A record must point to this server for external HTTPS.\n'
printf 'Verify with: curl -I https://darmawear.ir\n'
