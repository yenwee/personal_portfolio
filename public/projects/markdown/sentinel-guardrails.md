## Most guardrails are either too slow or too dumb

Every guardrail system I evaluated made the same tradeoff: run a heavyweight classifier on every request, or slap a regex filter on the front and hope for the best. **I built Sentinel to treat guard depth as a function of input ambiguity**, not a fixed pipeline every request must traverse.

The cost gradient is steep by design. Layer 1 regex resolves in ~2ms. Fine-tuned DeBERTa-v3 costs ~50-150ms. The LLM judge costs ~500ms-2s. Most production traffic exits before the expensive work begins.

## Five layers, but most requests only see two

Layer 1 compiles sixteen regex patterns at startup covering prompt injection, SQL injection, jailbreak sequences, and encoding evasion -- the bulk of automated attacks caught at negligible cost. Layer 2 runs fine-tuned DeBERTa-v3 with two confidence thresholds: **above 0.85 stops the pipeline, below 0.7 escalates to the LLM judge.** That uncertainty band is where adversarial inputs live, crafted to look just benign enough to slip past a naive binary classifier.

> [!decision] BERT Uncertainty as Escalation Trigger
> Most systems escalate on positive flags; Sentinel also escalates on uncertainty, catching adversarial inputs that produce low-confidence benign verdicts.

The intent gatekeeper deliberately excludes keyword matching -- trivially bypassed through paraphrasing. LLM-based classification costs more but provides a control that is meaningful, not theatrical. All policy lives in **hot-reloadable YAML**, so threshold tuning happens in minutes without a container restart.

## What happens when the output leaks the system prompt

The output guard opens with a canary token: a cryptographic string embedded in the system prompt. If it surfaces in a response, the system prompt has leaked -- **a deterministic signal with near-zero false positives**, borrowed from honeypot design.

BERT and topic classifiers run concurrently via `asyncio.gather` because they are independent checks; sequential execution would double latency for no safety benefit. When a violation is detected, the final layer does not return a block message.

> [!insight] Regeneration Over Refusal
> A block message tells adversaries where the boundary lies; auto-regeneration produces compliant responses without leaking policy.

Instead, auto-regeneration submits a corrected generation request with constraints derived from the specific violation, then re-validates. **The loop is bounded** to prevent runaway LLM calls.

## What I Learned

- **What surprised me**: uncertainty proved more informative than confidence. The requests that nearly broke through landed in the ambiguous middle where the model could not commit either way. Designing around that zone was the highest-leverage decision in the architecture.
- **What I would do differently**: build a structured evaluation harness before tuning DeBERTa thresholds. I calibrated the 0.85/0.7 bands through manual red-teaming, which worked but does not scale.
- **What stuck with me**: the best security controls are invisible. Legitimate requests resolve at Layer 1 or 2 in under 150ms, adversarial inputs get quietly handled. If the guardrail is invisible to honest users and opaque to attackers, it is doing its job.
