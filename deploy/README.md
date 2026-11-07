# DARMAWEAR — one-command GitHub deployment (preview only)

Domain: https://darmawear.ir
Repository: https://github.com/aliiitavazoeiii-afk/darma

The approved single white DARMA underwear hero is NOW included in GitHub as optimized WebP files:
- public/media/hero-desktop.webp
- public/media/hero-mobile.webp (temporary use of same wide asset until a portrait crop is approved)

No SCP, uploading image, manual archive extraction or editing files is required.

## Single command to run from SSH on the intended Docker/Caddy server

```bash
curl -fsSL --retry 2 --connect-timeout 10 https://raw.githubusercontent.com/aliiitavazoeiii-afk/darma/main/deploy/install-preview.sh -o /tmp/darmawear-install.sh && bash -n /tmp/darmawear-install.sh && sudo bash /tmp/darmawear-install.sh
```

## Installation behavior

- Checks existing Docker Compose, Git, and existing Caddy container darma-general-caddy-1.
- Inspects Caddy's actual bind-mounted /etc/caddy/Caddyfile and Docker network; fails safely if not detected.
- Clones (or safely fast-forwards) /opt/darmawear-store from protected main.
- Verifies SHA256 of BOTH hero images before building anything.
- Starts only the darmawear-store-web container, with no new host 80/443 port binding and no existing-service recreation.
- Probes actual Next.js HTML, hero images, and robots response inside the container.
- Only if necessary: backs up the original Caddyfile, appends an isolated marked darmawear.ir/www.darmawear.ir site block, validates config, reloads Caddy; restores original Caddyfile upon validation/reload failure.
- A subsequent run safely updates only this deployment and reuses its managed domain route.

## Prerequisites and limitations

- Run on the intended server as a sudo-enabled account. Requires git, curl, Docker and Docker Compose already present.
- GitHub must be reachable from the server. If it is blocked, the installer stops without touching the ERP.
- The existing server must have the expected Caddy container. Different Caddy topologies stop safely; inspect output instead of guessing.
- DNS A record of darmawear.ir must point to the target server's public IP, and www should have a matching CNAME/A record for HTTPS. Installer does not access the domain registrar.
- The current website is a protected visual preview, NOT a purchasable store. Product/catalog integration, payment, real policies and contact still require work.
- The domain preview remains noindex with /robots.txt disallow until the proper approved go-live release. Do not manually set NEXT_PUBLIC_SITE_LIVE=true.

## Verify

```bash
docker ps --filter name=darmawear-store-web
curl -I https://darmawear.ir
curl -fsS https://darmawear.ir/robots.txt
```

## If installer refuses

Copy the printed DARMA_INSTALL_FAILED line and the preceding diagnostics into the chat. Do not stop Caddy, ERP, DB, VPN or other services. The safe abort is deliberate.

## SEO

The mandatory seo-governance GitHub Actions check and protected main branch still govern every change.
