## When 60 Gmail accounts break, 100,000 reminders go unsent

One missed rotation in a shared spreadsheet. Thousands of payment reminders sitting in a queue overnight. A debt collection agency was cycling through 60+ Gmail Workspace accounts by hand, and one operator's vacation stalled an entire week's outbound mail.

The hard constraint was deliverability. Every message already passed SPF, DKIM, and DMARC through Google's infrastructure. **Switching to a cold IP meant a 21-day warm-up the client could not afford.** I needed to automate rotation without leaving Gmail's relay path.

## One daemon, one counter file, one lock

The relay collapses 60+ accounts into a single Postfix instance the client authenticates to once. Postfix delegates sender selection to a **custom Python TCP table daemon** speaking its native lookup protocol. On each query, it increments a file-locked persistent counter and returns the next Gmail address. Postfix relays upstream through Gmail's SMTP servers, so deliverability stays intact without a DNS change.

Intentionally minimal: one process, a flat counter file, a lock. Systemd runs it with `NoNewPrivileges=true` and `ProtectSystem=strict`, **sandboxed to the `postfix` user** with no database or message broker to drift.

> [!decision] Credential Security
> Credentials are compiled into a Postfix `.db` hash via `postmap`, then the plaintext source is deleted. Outbound `Received:` headers are stripped to remove the client's internal IP from message traces.

A Tier B stack (Postal, MariaDB, RabbitMQ, Caddy) sits configured but dormant, ready when the client outgrows Gmail relay.

## Three lockouts and the playbook that survived them

Eight idempotent Ansible roles take a bare Ubuntu 24.04 VPS to production-ready. I learned their edge cases the hard way -- three real lockouts during the engagement.

The **fail2ban role** exposed an undocumented `dbpurgeage=1` requirement. Without it, stale bans bypass the `ignoreip` whitelist on reload, silently locking out the operator. The SSH hardening role hit Ubuntu 24.04's socket activation change, where `service: name=ssh` no longer resolves to the expected systemd unit. Playbooks written for 22.04 fail silently.

The firewall role runs deliberately last. **Enabling UFW mid-provisioning creates iptables conflicts with Docker's own rules**, and sequencing solves what configuration cannot.

> [!challenge] Lockout Recovery
> Three real lockouts occurred during the engagement -- hardening steps that cut SSH access before I could verify from a second session. The playbook now enforces strict ordering: verify SSH on the new port with key auth before disabling password login; confirm fail2ban `ignoreip` before enabling the jail.

The full environment was re-provisioned three times (two VPS migrations, one OS reinstall), each restored from a single playbook run.

## What I Learned

Building for disposability changed how I think about infrastructure. When a server can be replaced in one command, **every fix becomes a playbook change, not a manual patch.** The three lockouts were frustrating, but each one hardened the ordering logic that made the next provisioning run survivable.

The daemon design reinforced a bias I carry into every project: the fewer moving parts a system has, the fewer ways it fails at 2 a.m.
