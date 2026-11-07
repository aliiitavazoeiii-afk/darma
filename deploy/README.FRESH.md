# DARMAWEAR — Install on a completely new Ubuntu/Debian VPS

**Use this for a brand-new server with NO Docker, NO Caddy, and NO prior DARMA systems.**
Do NOT use `deploy/install-preview.sh` for a fresh VPS. That legacy script is specifically for an existing ERP/Caddy server and will fail on a new VPS.

From an SSH root shell, run only:

```bash
curl -fsSL --retry 3 https://raw.githubusercontent.com/aliiitavazoeiii-afk/darma/main/deploy/install-fresh.sh -o /tmp/darma-install-fresh.sh && bash -n /tmp/darma-install-fresh.sh && bash /tmp/darma-install-fresh.sh
```

## What the command does
1. Verifies Ubuntu/Debian, root, empty or recognized DARMA installation, and that ports 80/443 are available.
2. Installs curl, git, certificates, networking tools and **official Docker Engine + Docker Compose plugin** from the Docker apt repository, only if Docker is absent.
3. Clones protected `main` from GitHub into `/opt/darmawear-store` (or fast-forward updates an existing recognized clone).
4. Verifies the original owner-approved white underwear hero image from GitHub by SHA-256.
5. Validates the standalone Caddyfile and Docker Compose configuration.
6. Runs the existing site build/SEO release guard and starts an isolated Next.js web container; tests homepage, both hero-image URLs and robots.txt.
7. Starts a dedicated Caddy container using only ports 80/tcp, 443/tcp and 443/udp, with persisted volumes for TLS credentials. Caddy automatically requests a certificate when domain DNS and public access are correct.
8. Allows 80/tcp and 443/tcp in UFW only if UFW is already active. Never closes SSH and never restarts another project.

## Prerequisites outside the server
- Domain DNS: the A record for `darmawear.ir` must point at the **new VPS public IPv4**. This must be changed at the domain's DNS provider; the installer has no registrar credentials.
- Host provider firewall/security group: inbound TCP 80 and 443 must be allowed. UFW is handled when present, but external provider firewalls are not.
- GitHub / Docker Hub / Docker apt repository must be accessible from the VPS.
- The VPS should have adequate memory/disk for compiling Next.js (Docker build may otherwise fail).

## Installation status and SEO
This is a visual-development PREVIEW. It deliberately stays `NEXT_PUBLIC_SITE_LIVE=false`:
- `robots.txt` disallows crawlers and HTTP header includes `X-Robots-Tag: noindex, nofollow`.
- Catalog, checkout, payment, legal policies and verified contact information are **not complete**.
- Do not turn on live indexing before production SEO/commerce gates pass.

## Check after install
```bash
docker compose -p darmawear-store -f /opt/darmawear-store/deploy/compose.fresh.yml ps
curl -I https://darmawear.ir
curl -fsS https://darmawear.ir/robots.txt
```

## Automatic updates
Run the same installer again. It will verify the Git remote, reject local modifications, fast-forward to approved `main`, rebuild only DARMA containers, and preserve Caddy TLS volumes.

## If the script aborts
Paste the line `DARMA_FRESH_INSTALL_FAILED` and the few preceding terminal lines. Do not run legacy commands or delete Docker volumes. The preflight is intentionally conservative.

## References
- Docker official Ubuntu install: https://docs.docker.com/engine/install/ubuntu/
- Docker official Debian install: https://docs.docker.com/engine/install/debian/
- Caddy automatic HTTPS: https://caddyserver.com/docs/automatic-https
- Caddy Docker: https://caddyserver.com/docs/running
