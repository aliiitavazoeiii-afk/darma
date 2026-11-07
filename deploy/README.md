# DARMAWEAR safe preview deployment (not checkout-ready)

Deployment target: `darmawear.ir`. Historical intended host is `root@5.10.248.50`, which also runs the existing DARMA ERP Caddy `darma-general-caddy-1`. **Do not take over the existing /opt/darma-general directory, do not restart the ERP/DB services, do not bind another container to host ports 80 or 443.**

## Inputs
- Repository: `https://github.com/aliiitavazoeiii-afk/darma` (merge this feature PR first)
- User-approved hero artwork, delivered separately as `darmawear-hero-assets.tar.gz` in the conversation. This image bundle must be copied to `/root/darmawear-hero-assets.tar.gz` before installation.
- Install script: `deploy/install-preview.sh`. Use the copy attached in the conversation if GitHub is unreachable from the server.
- DNS: A `darmawear.ir` to the actual server public IPv4; `www` CNAME to `darmawear.ir`. Confirm before expecting Caddy to obtain a certificate. Never overwrite pre-existing DNS without checking where it currently points.

## Recommended install
From Windows PowerShell, after saving the hero asset bundle in Downloads:

```powershell
scp "$env:USERPROFILE\Downloads\darmawear-hero-assets.tar.gz" root@5.10.248.50:/root/
scp "$env:USERPROFILE\Downloads\darmawear-install-preview.sh" root@5.10.248.50:/root/
ssh root@5.10.248.50
```

On server:

```bash
bash -n /root/darmawear-install-preview.sh
sudo bash /root/darmawear-install-preview.sh
curl -I https://darmawear.ir
```

The installer performs read-only Caddy inspection, rejects an existing domain config or app directory, clones only this repository into `/opt/darmawear-store`, extracts images, creates an isolated Docker Compose service, verifies that the homepage AND hero image both return HTTP 200 internally, backs up the existing Caddyfile, appends ONLY a dedicated domain site block, validates Caddy and reloads without stopping the existing Caddy container. A syntax or reload error restores the old Caddyfile.

If the installer cannot access GitHub or detects a different Caddyfile mount/network, it stops rather than guessing. Inspect its output and use an offline repo archive/explicit network setting as needed; do not run arbitrary fixes against the ERP.

## Checks
```bash
docker ps --filter name=darmawear-store-web
# Check that all static media are loaded inside the new container:
docker exec darmawear-store-web node -e "Promise.all(['/','/media/hero-desktop.webp','/media/hero-mobile.webp','/robots.txt'].map(p=>fetch('http://127.0.0.1:3000'+p))).then(rs=>{console.log(rs.map(r=>r.status));process.exit(rs.every(r=>r.ok)?0:1)})"
curl -sSI https://darmawear.ir | head
curl -fsS https://darmawear.ir/robots.txt | head
```

The preview is deliberately `NEXT_PUBLIC_SITE_LIVE=false`. It has a robots disallow and page noindex: no legitimate commerce features, prices, delivery policies, full stock, or SEO public rollout have been approved. **Do not force `NEXT_PUBLIC_SITE_LIVE=true` to make Google index the unfinished store.**

## Upgrade and rollback
Keep a known-good Git commit and Caddyfile backup. Updates to application code should run `git pull --ff-only` in `/opt/darmawear-store` followed by a rebuild of only `darmawear-store`. The existing Caddy block doesn't need to change on every deploy. To remove the new domain route, restore the matching Caddyfile backup, validate and reload Caddy (never restart ERP), then stop only the separate preview container.
