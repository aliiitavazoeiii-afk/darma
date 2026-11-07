#!/usr/bin/env bash
# DARMAWEAR preview installer: abort on unknown config, do not stop/restart other services.
set -Eeuo pipefail
fail(){ echo "ERROR: $*" >&2; exit 1; }
[[ "$(id -u)" -eq 0 ]] || fail "Run as root"
APP=/opt/darmawear-store
CADDYFILE=/opt/darma-general/Caddyfile
CADDY=darma-general-caddy-1
ARCHIVE=/root/darmawear-hero-assets.tar.gz
[[ ! -e "$APP" ]] || fail "Existing $APP; refusing overwrite"
[[ -f "$CADDYFILE" && -r "$ARCHIVE" ]] || fail "Missing expected Caddyfile or hero bundle"
docker compose version >/dev/null
docker inspect "$CADDY" >/dev/null
mount="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')"
[[ "$mount" = "$CADDYFILE" ]] || fail "Unexpected Caddy mount $mount"
! grep -Eiq '(^|[ ,])((www\.)?darmawear\.ir)([[:space:],{]|$)' "$CADDYFILE" || fail "Domain is already configured"
nets="$(docker inspect "$CADDY" --format '{{range $name,$v := .NetworkSettings.Networks}}{{println $name}}{{end}}')"
if echo "$nets" | grep -Fxq darma-general_default; then
  net=darma-general_default
else
  net="$(echo "$nets" | sed '/^$/d' | head -n1)"
fi
[[ -n "$net" ]] || fail "Caddy network not detected"
tar -tzf "$ARCHIVE" | grep -Fx 'public/media/hero-desktop.webp' >/dev/null || fail "Desktop hero missing"
tar -tzf "$ARCHIVE" | grep -Fx 'public/media/hero-mobile.webp' >/dev/null || fail "Mobile hero missing"
git clone --depth 1 --branch main https://github.com/aliiitavazoeiii-afk/darma.git "$APP"
cd "$APP"
tar --no-same-owner -xzf "$ARCHIVE" -C "$APP"
printf 'CADDY_NETWORK=%s\n' "$net" > .env
printf 'NEXT_PUBLIC_SITE_LIVE=false\n' > .env.preview
chmod 600 .env .env.preview
docker compose -p darmawear-store -f deploy/compose.preview.yml config -q
docker compose -p darmawear-store -f deploy/compose.preview.yml up -d --build --no-deps
ready=0
for attempt in $(seq 1 40); do
  if docker exec darmawear-store-web node -e "Promise.all(['/', '/media/hero-desktop.webp', '/media/hero-mobile.webp'].map(p=>fetch('http://127.0.0.1:3000'+p))).then(a=>process.exit(a.every(r=>r.status===200)?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    ready=1;break
  fi
  sleep 3
done
[[ "$ready" = 1 ]] || fail "Preview container unhealthy; Caddy untouched. Check docker logs darmawear-store-web"
backup="$CADDYFILE.bak-darmawear-$(date +%Y%m%d-%H%M%S)"
cp -p "$CADDYFILE" "$backup"
cat >> "$CADDYFILE" <<'CADDY'

# DARMAWEAR isolated preview — noindex until verified commerce launch
darmawear.ir, www.darmawear.ir {
    encode zstd gzip
    reverse_proxy darmawear-store-web:3000
}
CADDY
if ! docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile; then
  cp -p "$backup" "$CADDYFILE"
  fail "Caddy syntax error, original file restored; no reload"
fi
if ! docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile; then
  cp -p "$backup" "$CADDYFILE"
  docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || true
  fail "Caddy reload error, original file restored"
fi
echo "DARMAWEAR_PREVIEW_INSTALLED"
echo "Caddy backup: $backup"
echo "Preview is NOINDEX; purchase/payment disabled."
echo "Verify: curl -I https://darmawear.ir"
