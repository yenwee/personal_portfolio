## A production system for ~RM50 a month

The brief was unusual: build a system an SME team can run indefinitely, at a cost that makes sense for a company that tracks revenue in five figures. Quotations lived in spreadsheets, signatures on paper, and rental equipment was tracked by memory. Malaysia's LHDN MyInvois mandate forced a digital transition, but compliance was only part of the problem.

I designed the system around a single constraint: **zero cost when idle**. Lambda, DynamoDB on-demand, S3, and API Gateway bill nothing when no one is using them, and scale transparently when they are. The steady-state bill sits at roughly RM50 a month. S3's 7-year document retention policy is the dominant cost driver -- not compute, not database.

## Serverless by necessity, not by trend

The architecture needed to absorb scope changes without rework. It did, twice. Rental management arrived mid-project: a check-out/check-in workflow with a CloudWatch scheduled function that runs daily overdue detection and calculates late fees automatically. LHDN e-invoicing compliance followed shortly after, requiring UBL 2.1 JSON serialisation and OAuth2 authentication with a .p12 certificate. **Neither addition required restructuring what already existed.**

Everything runs through Terraform with remote state -- no console-created resources. GitHub Actions enforces pylint, black, mypy, pytest, and bandit on every push. I wanted confidence that a deploy at 11pm on a Tuesday would not break production.

> [!decision] 12 Tables, Zero Scans
> Table design follows access patterns, not relational normalisation. GSI projections serve common reads directly. No query requires a scan.

## Signatures via WhatsApp, secured by single-use tokens

The team needed customers to sign delivery orders on-site, without installing anything. I generate a JWT-secured link that staff share via WhatsApp. The customer opens a mobile-optimised canvas pad, signs, and the image uploads to S3.

The token is **single-use by construction**: hashed with SHA256 before storage, then re-hashed and compared on redemption. A replayed link fails silently. Expiry is set at 24 hours, long enough for a busy site visit, short enough to limit exposure.

> [!decision] No Cognito
> A custom JWT layer with bcrypt and HMAC-SHA256 eliminated a managed service dependency and gave full control over token claims -- critical for mobile signature tokens that need single-use enforcement and short expiry windows.

## What I Learned

Designing for a ~RM50 budget forced decisions I would not have made on a larger project, and most of them turned out better for it. Skipping Cognito gave me precise control over token behaviour. Modelling DynamoDB tables around access patterns instead of entities made reads trivially fast. **The constraint was the architecture.**

The system has been running in production without intervention. The best infrastructure decision I made was ensuring there is almost nothing to manage.
