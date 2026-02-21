# I Built My Own Business OS Because No SaaS Could Connect My Entire Workflow

I started building side projects with no system. No invoicing tool. No CRM. No project tracker. No expense log. Just a laptop and the vague intention to "figure it out as I go."

That is not a system. That is a liability.

The standard advice would be to sign up for FreshBooks, HubSpot, Toggl, and Expensify. Four tools, maybe $200/month, problem solved. But I am a developer, I wanted to learn, and I had a hunch that stitching together four SaaS products designed for different workflows would create more friction than it solved.

So I built my own. One app. Eight modules. The entire end-to-end business workflow from lead to tax report. It started as an invoice generator. It turned into something much bigger. And the most valuable thing it produced was not software -- it was business clarity I could not have gotten any other way.

---

## Why Not Just Use SaaS?

The honest answer has three parts.

**Cost.** I was just starting out. Committing to $200/month in subscriptions before I had steady revenue felt backwards. Most business SaaS tools are priced for established businesses, not people building their first real project.

**Integration.** Even if I paid for everything, the tools do not talk to each other. When a lead converts to a client, you re-enter their details in your invoicing tool. When you finish a project milestone, you manually create an invoice. When tax season comes, you reconcile expenses across platforms that use different category names. The data lives in five silos. You are the integration layer.

**Learning.** I wanted to build something real. Not a tutorial project, not a to-do app, not a clone of something that already exists. A tool I would actually use, solving a problem I actually had. If it also taught me Next.js, PostgreSQL, and deployment -- even better.

The third reason is the one that actually mattered. The first two were justifications I told myself later.

---

## It Started With Invoicing

The first version did one thing: generate invoices. A form, some fields, a PDF. That was it.

But the moment you have invoicing, you need to know who to invoice. So I added clients. Then I needed to track which clients had paid and which had not. So I added payment status and overdue detection. Then I needed to send the invoices. So I added email with PDF attachments.

Each feature pulled the next one into existence. Invoicing needed clients. Clients needed a pipeline to track how they became clients. The pipeline needed proposals. Proposals needed to link to projects. Projects needed time tracking. Time tracking needed to flow into invoices. Invoices needed to feed financial reports.

I did not plan eight modules. I planned one. The rest emerged from the question: "What do I need next to make this actually useful?"

---

## What It Does Now

Hustle OS is a Next.js app backed by PostgreSQL. Eight modules covering the full business workflow:

**Sales**
- **CRM Pipeline** -- Kanban board for leads. Qualifying, proposal, negotiation, won, lost. Every status change is logged. Follow-up reminders surface stale leads.
- **Proposals** -- Quotations with line items, validity dates, PDF export. When a proposal is accepted, the lead auto-transitions to "won."

**Delivery**
- **Projects** -- Milestones, deadlines, completion tracking. Fixed-price or hourly billing. Links to clients and invoices.
- **Timesheets** -- Log time entries against projects. One click bills unbilled hours into a draft invoice where each entry becomes a line item.

**Finance**
- **Invoices** -- Create, send, track. Partial payments, overdue auto-marking, PDF generation. Malaysian tax fields (SSM, TIN, SST) in the header.
- **Recurring Invoices** -- Automatic draft generation on a schedule. Monthly retainers, quarterly fees.
- **Expenses** -- Business costs by category with receipt uploads. Recurring expense support. Categories aligned with Malaysian tax deductions.
- **Reports** -- Client profitability, monthly revenue, accounts receivable aging, annual tax summaries with equipment depreciation.

**Manage**
- **Contracts** -- Generate contracts, send for e-signing via Documenso. Track signature status.
- **Email** -- AI-drafted emails for invoices, proposals, and contracts. I review every draft before it sends. Nothing goes out autonomously.

Everything connects through one data model. A lead becomes a client. A client gets a project. A project generates timesheets. Timesheets become invoices. Invoices feed reports. No re-entry. No copy-pasting between tools.

![Hustle OS Dashboard](/blogs/images/hustle-os-dashboard.png)

---

## The Technical Decisions

### One monolith, not microservices

Single Next.js application. Server-side rendering, API routes, Prisma ORM, PostgreSQL. No separate backend, no API gateway, no message queue.

For a solo developer's tool, this is exactly right. One database, one deployment, one log to check when something breaks. The complexity ceiling for a personal business tool is low enough that a well-structured monolith handles it cleanly.

### CLI and UI, same core

Every operation works through both a web dashboard and a CLI. Both call the same core functions in `src/core/`. The CLI is not an afterthought -- it makes quick operations faster than any web interface:

```plaintext
$ hustle invoice create --client "Acme Corp" --items "API integration:8000" --due 30d
Created INV-0042 for Acme Corp (RM 8,000.00) due 21 Mar 2026

$ hustle pipeline
Lead Pipeline:
  QUALIFYING (2): TechStart AI, DataFlow Inc
  PROPOSAL    (1): CloudNine Systems
  NEGOTIATION (1): FinanceHub MY
  WON         (3): Acme Corp, ByteScale, CreditView
```

### Malaysian tax context

This is the part no SaaS gets right. Malaysian business registration (SSM number), tax identification (TIN), Sales and Service Tax (SST) -- all baked into invoice PDFs. Expense categories aligned with LHDN deduction rules. Tax reports that calculate equipment depreciation the way Malaysian tax law requires.

Most invoicing tools are built for US or EU markets. Malaysian developers are an afterthought. Building my own meant getting the tax context right from the start.

### Live and self-hosted

The app is live at [app.weeai.dev](https://app.weeai.dev), with contract e-signing running on [sign.weeai.dev](https://sign.weeai.dev). The entire stack runs on a $1.55/month VPS with Cloudflare Tunnel for routing and Zero Trust for access control. Five Docker containers, 2.4GB of RAM, no managed services. I wrote a [separate post about the deployment](/blogs/deployed-full-app-18-dollar-vps) because the infrastructure story deserved its own telling.

---

## What I Actually Learned

The software works. But I am still building more than I am using it day-to-day. And that is the honest part of this story.

The most valuable output of this project is not the app. It is what building the app forced me to think about.

**I had to define my sales process.** Building a CRM pipeline meant deciding: what are my actual stages? What does "qualifying" mean versus "proposal"? Before this, I had no defined process for moving a lead forward. Now I have one, even if I built it in code before I practiced it in real life.

**I had to formalize invoicing.** What payment terms do I use? What tax fields are required? What does "overdue" mean -- 30 days? 14? Building the system forced answers to questions I had been avoiding.

**I had to think about profitability.** The reports module calculates client profitability, revenue trends, and aging receivables. I built the math before I had enough data to run it. But the act of building it made me think about my business in ways I never had: which engagements are worth pursuing, what my effective hourly rate actually is, where money gets stuck.

**I had to confront what I was not tracking.** Every module I built revealed a gap in how I was running things. Expenses I was not logging. Time I was not tracking. Follow-ups I was not making. The tool did not fix these habits automatically -- but it made the gaps visible.

The conventional wisdom says "do not build what you can buy." For teams, that is correct. But for a solo developer building a real-world side project, building your own business tool is a form of business education. You cannot build a system for something you do not understand. And the process of building it forces understanding.

---

## Should You Build Your Own?

Probably not. Most solo operators should use FreshBooks or Wave and get on with their work.

But if you are a developer, if you want to learn by building something real, and if you are willing to trade speed-to-market for depth of understanding -- building your own business tool is one of the most educational projects you can take on.

You will learn full-stack development, database design, PDF generation, email integration, authentication, deployment, and performance optimization. Not from tutorials. From actual requirements that come from your actual business.

The app is still a work in progress. I am still adding features faster than I am using them. But every feature I build forces me to think about a part of my business I had been ignoring.

The whole thing took 6 days from first commit to production deployment. 189 commits, 24 database models, ~18,000 lines of application code. Running live at $1.55/month. That is less than the free trial period of most SaaS tools I considered replacing.

The tool is the byproduct. The clarity is the product.

---

*This is the second in a series. The [first post](/blogs/locked-out-server-chinese-new-year-ansible) covers how I locked myself out of my own server three times during Chinese New Year and automated everything with Ansible. The [third post](/blogs/deployed-full-app-18-dollar-vps) covers deploying this app on a $18.66/year VPS with Cloudflare Tunnel.*
