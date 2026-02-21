## Five SaaS tools, five data silos, one frustrated developer

I started building side projects with no system. The standard advice is to subscribe to FreshBooks, HubSpot, Toggl, Asana, and Expensify. But **five tools means five databases that do not talk to each other**, and you become the integration layer -- re-entering client details, manually creating invoices from project milestones, context-switching between interfaces that each assume they are the center of your workflow.

I wanted one pipeline: a lead becomes a client, a client gets a project, a project generates timesheets, timesheets flow into invoices, invoices feed financial reports. So I built it. Six days from first commit to production deployment, 189 commits, 24 database models.

## One transaction turns a proposal into a billing schedule

Every module writes to the same PostgreSQL instance through Prisma. When a proposal is accepted, the system converts it into invoices in a single atomic operation -- **one-time items become a single draft, milestone items become invoices spaced 30 days apart, recurring items spawn a schedule that auto-generates invoices on each cycle**. Time entries logged against a project bill into an invoice where each entry becomes a line item, with the entries marked as billed and linked back.

> [!decision] CLI and UI Share One Core
> Both the web dashboard and the CLI call the same functions in `src/core/`. Creating an invoice, billing time entries, running reports -- all work identically from either interface. The CLI is not a wrapper around the API; it talks directly to the same business logic.

The REST API accepts both database IDs and human-readable formats (`INV-0042`, `PRJ-005`, `CTR-001`). Route helpers detect the format via regex and resolve accordingly, so **the API is human-friendly without sacrificing machine precision**.

## AI-native: an agent can run the whole system

The app was built to be operated by both humans and AI. Eight Claude Code skill files -- `/invoice`, `/proposal`, `/crm`, `/project`, `/expense`, `/reports`, `/contract`, `/timesheet` -- give an AI agent the ability to create invoices, manage the sales pipeline, log expenses, bill time entries, and run financial reports through natural language. **The same CLI that a developer uses from the terminal is the same interface an AI agent uses autonomously.**

> [!insight] AI as Operator, Not Just Assistant
> Most AI integrations draft text or answer questions. Here, the AI agent performs actual business operations -- creating a RM 8,000 invoice, moving a lead to "won", billing 34 hours of unbilled time into a draft invoice. The REST API and CLI were designed from day one to be machine-operable, not just human-usable.

The architecture made this possible. A single Next.js monolith handles SSR, API routes, PDF generation, and email sending. No microservices, no API gateway, no message queue. **Every piece of state lives in one database, every deployment is one `docker compose up -d`.** Contracts integrate with Documenso for e-signing, emails are AI-drafted with full client context, and the entire stack runs live at [app.weeai.dev](https://app.weeai.dev) on a $1.55/month VPS behind Cloudflare Tunnel.

## What I Learned

The app works, but I am still building more than using it. That honesty matters more than a polished story.

**What surprised me**: the highest-leverage output was not the software -- it was the clarity about how real-world systems connect. Building a profitability report forced me to think about which clients are worth pursuing. Building a CRM pipeline forced me to define a sales process I had never formalized. The code was the byproduct; the thinking was the product.

**What I would do differently**: start with fewer modules and use each one in production before building the next. I built eight modules in six days because the architecture made it easy, but depth of use reveals requirements that breadth of features misses.

**What stuck with me**: for a solo operator, "do not build what you can buy" is not always right. When no single SaaS connects your full workflow end-to-end, building your own is not over-engineering. It is the only way to get the integration right.
