## Zero platform fees, full control over the door

Third-party ticketing platforms charge 5-10% per ticket and lock you into their check-in app. The organizer wanted their money and their data back.

I built the entire system around **Billplz**, a Malaysian payment gateway. The backend creates a bill, persists a pending reference, and redirects the buyer to Billplz's hosted payment page. When payment completes, Billplz fires a webhook that I verify with HMAC-SHA256 using timing-safe byte comparison -- no forgery via timing oracle. Processing is idempotent: repeated delivery for a completed order is silently ignored, so retries never double-fulfill.

> [!decision] Local Payment Simulation
> A stub service simulates the full Billplz flow locally, auto-completing payments and firing verified webhooks, so the entire purchase-to-fulfillment path is testable without live credentials. Sandbox-to-production is one environment variable.

## A state machine at the door

The staff scanner runs a camera-based QR interface at 10fps via html5-qrcode, with USB barcode fallback for high-throughput gates. An **explicit state machine** drives the flow: scanning, validating, ticket_found, confirming, success. The confirming step surfaces the attendee's name and last four NRIC digits as a human verification gate before check-in commits.

The self-service portal is a four-step mobile flow -- email and order number, ticket selection, identity confirmation, done. I optimized it for **single-handed phone operation** at the venue so attendees never need to juggle bags or drinks.

> [!insight] Why Two Check-in Modes
> Staff scanning maximizes throughput at peak entry; self-service absorbs the long tail of arrivals throughout the event, reducing staffing needs without bottlenecks.

## The NRIC never touches the database

Malaysian events require NRIC verification, but the raw twelve-digit number is too sensitive to store. I keep two derived values: a **SHA-256 hash with a per-installation salt** for duplicate detection, and the last four digits in plaintext for staff confirmation. A breach exposes neither full identity numbers nor reversible hashes.

Rate limiting runs at two layers: Nginx connection limits at the edge, and a **sliding window at the application layer** caps ticket orders at 10/min per IP and check-in submissions at 30/min. Authentication uses NextAuth.js v4 with constant-time password verification and a dummy hash path on invalid usernames, so timing does not leak account existence.

## What I Learned

Deploying on Docker Compose -- PostgreSQL 16, Next.js standalone, Nginx with SSL, and Certbot -- meant the organizer could spin up the entire stack with a single command. But the real lesson was that **two check-in modes solved a staffing problem, not a technical one**. The state machine kept the staff flow predictable under pressure, and the self-service portal let the organizer cut door staff in half after the initial rush. Building for handover forced me to think about operability from day one.
