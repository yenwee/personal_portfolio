# Your VPS Urge Is a Feature, Not a Bug

I bought my first VPS during Chinese New Year. [I locked myself out three times](/blogs/locked-out-server-chinese-new-year-ansible). Then I [deployed my entire hobby project on it for $18.66/year](/blogs/deployed-full-app-18-dollar-vps). Five Docker containers, Cloudflare Tunnel, Zero Trust access, daily backups.

Now I want another one.

Not because I need more compute. Because the economics of self-hosting changed faster than most developers realise, and I want to understand where the floor is before hardware costs push it back up.

---

## The numbers

The VPS market hit $5.2 billion in 2025, growing at 15.5% annually. Active subscribers jumped from 29 million in 2022 to 38 million in 2025.

The poster child is 37signals. DHH documented their AWS exit in detail: $3.2 million per year in cloud spend, S3 bill alone at $1.5 million/year, down to $200,000/year on Pure Storage after migrating. Total savings over five years: $7 million.

![RackNerd Black Friday VPS pricing - $18.66/year for 2.5GB RAM](/blogs/racknerd-vps-pricing.png)

> [!metric] My Own Numbers
> I run five Docker containers on a $18.66/year RackNerd VPS (second from left). The equivalent on managed cloud (database, hosting, object storage, monitoring, e-signing service) would cost roughly $80-120/month. The VPS paid for itself in the first week.

But 37signals has a dedicated ops team. They can rack servers in colocation facilities. The question that matters is whether the same logic works at the $50-300/month scale where most of us operate.

It does. Two things changed.

---

## Hardware is getting more expensive

DRAM contract prices are up 50% in 2025, with another 20-30% forecast into 2026. NAND has doubled in six months. All 2026 production capacity is already sold out. Samsung's memory price hikes of up to 60% are hitting data center builders now.

> [!challenge] Why VPS Providers Have Not Raised Prices Yet
> VPS providers lock in hardware at contract prices 6-12 months ahead. The DRAM and NAND spikes from mid-2025 have not fully hit retail pricing yet. When current inventory cycles out, expect adjustments.

Cloud providers will pass those costs downstream. The cheap VPS that exists today will not stay cheap, but it will stay cheaper than the managed cloud alternative, because you are cutting out the margin layer.

At the indie developer scale, a $26/month Hetzner VPS running Docker can host 5-8 services that would collectively cost $150-300/month across managed providers. Database-as-a-service, hosting platform, monitoring, storage, all of that fits on one box. I know because I did exactly this, my entire Hustle OS stack runs on a single RackNerd box for $1.55/month. The breakeven period was immediate.

---

## AI got good enough at the setup part

This is the part that changed the equation for developers who have not gone through the lockout-and-learn cycle I did.

Self-hosting was always technically possible on the cheap. The barrier was never the tools. It was the knowledge required when something went wrong. Your reverse proxy returns a 502 and you have no idea whether it is DNS, a container crash, a port conflict, or a firewall rule. Your database runs out of connections at 3 AM and you do not know what `ulimit` means.

![VPS console showing SSH service name confusion - sshd vs ssh on Ubuntu](/blogs/vps-novnc-ssh-debug.png)

*The kind of problem AI solves in seconds. Ubuntu names the service `ssh`, not `sshd`. A small thing if you know it, a 30-minute search if you do not.*

I learned most of this the hard way, by getting locked out of my own server repeatedly and having to re-provision from scratch. But the developer starting today does not need to follow that path. AI got good enough at the setup part of DevOps to make the first 70% painless. Writing configs, standing up containers, explaining what every Nginx directive does. You can get that through a conversation with Claude or GPT now. Paste an error log, get a diagnosis with the exact commands to fix it.

Not the hard parts. Not incident response under pressure, not tuning database connections under load, not debugging why UFW and Docker are fighting over iptables chains. Those still need someone who has done it before. But the gap between "I want to run my own server" and "I have a hobby project running on my own server", that gap closed.

> [!insight] The Real Barrier Was Knowledge, Not Tools
> When I locked myself out during Chinese New Year, the problem was never that the tools were hard. It was that I did not know fail2ban restores old bans on restart, or that UFW and Docker both write to the same iptables chains. AI does not prevent every mistake, but it dramatically shortens the debugging loop for common ones.

You still learn. Probably faster than from a tutorial, because the feedback loop is immediate. But you no longer need to learn everything before you start.

---

## The stack

The modern self-hosting stack has converged on something clean. Here is what I run:

- **Reverse proxy**: Cloudflare Tunnel, no ports exposed, no Nginx config to manage.
- **Container management**: Docker Compose. Five containers defined in one YAML file.
- **Monitoring**: Uptime Kuma for health checks, Dozzle for container logs.
- **Security**: Ansible playbook for repeatable hardening. SSH key-only, fail2ban, UFW.

Four layers, all open source.

For most indie projects, Docker Compose is enough. The more ambitious path is k3s, lightweight Kubernetes on a single node with roughly 512MB RAM overhead. Kubernetes semantics without the multi-node complexity. The option to graduate without migrating is a useful safety net.

---

## When it does not work

Cloud scales with usage, which matters when usage is unpredictable. Bursty workloads, seasonal traffic, anything where you cannot forecast resource needs. For those, pay-per-use still makes sense.

A VPS gives you a predictable monthly cost. The tradeoff is operational risk: if it breaks at 3 AM, you are the on-call engineer. For a hobby project, that is fine. For a production SaaS with paying customers, think carefully.

The honest framework: use managed cloud for bursty, unpredictable workloads. Use self-hosted for steady-state services where you know the resource profile. Most developers will end up with a hybrid. That is the correct answer, not a compromise.

> [!note] What I Keep on Managed Cloud
> My portfolio site stays on Vercel. The cold start latency is irrelevant for a personal site, and the global CDN is free. The VPS runs everything with persistent state: database, file storage, background jobs. Split by what benefits from managed scaling versus what benefits from predictable cost.

---

## Where this is heading

AI agents will get better at infrastructure management. Not just generating configs, but monitoring, scaling, patching. The gap between "managed cloud" and "self-hosted with AI assistance" will narrow. That is the trajectory.

Data sovereignty is also pushing this direction. GDPR enforcement is tightening, new regulations in Asia are following the EU model. For many applications, self-hosting on a VPS in a specific jurisdiction becomes the path of least resistance for compliance. Malaysia's PDPA enforcement is getting stricter too, something worth watching if you are building here.

---

## Start here

If you have not self-hosted before and the urge is there:

1. **Hetzner Cloud or DigitalOcean**: pick one, spin up the cheapest VPS.
2. **Install Docker**: one command, `curl -fsSL https://get.docker.com | sh`
3. **Deploy Coolify**: one-line installer, gives you a Vercel-like dashboard.
4. **Move one project**: not your production app. A hobby project, something you can afford to break.
5. **Use AI when you get stuck**: paste the error, describe what you expected, ask for the fix.

You will learn more about how the internet works in one weekend of self-hosting than in a year of deploying to managed platforms. You will also lock yourself out at least once. That is part of the process.

I ran the numbers again. Time to buy another one.
