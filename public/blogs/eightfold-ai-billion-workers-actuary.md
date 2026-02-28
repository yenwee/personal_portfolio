# Eightfold AI Scored a Billion Workers in Secret. An Actuary Would Have Stopped Them at the Door.

*The class action lawsuit is about FCRA violations. The real story is that credit scoring solved this governance problem decades ago -- and AI hiring tools ignored all of it.*

---

## The score you never saw

A woman named Erin Kistler applied for a job at PayPal. She has a computer science degree from Ohio State and 19 years of product management experience. She did not get the job.

What she did not know -- what none of Eightfold AI's billion-plus profiled workers knew -- is that before a human recruiter ever saw her application, an algorithm had already scored her on a 0 to 5 scale, displayed as star ratings in half-point increments. Eightfold's system pulled data from LinkedIn, GitHub, Stack Overflow, and other public sources to build a profile she never consented to, never saw, and had no way to dispute.

On January 20, 2026, Kistler and co-plaintiff Sruti Bhaumik filed a class action in California Superior Court. Their lawyer is Jenny R. Yang, former chair of the U.S. Equal Employment Opportunity Commission. The defendants' client list reads like a Fortune 500 roll call: Microsoft, Morgan Stanley, Starbucks, PayPal, Chevron, Bayer, BNY.

The headlines called it an AI bias lawsuit. That framing is not wrong. But it misses the more useful story.

This post covers two things: why the "AI bias" frame is incomplete, and what the credit scoring industry -- which has been scoring people for decisions since the 1970s -- already built to prevent exactly this failure.

## The tired framing

Every time an AI hiring tool gets sued, the discourse follows the same arc. Algorithms are biased. We need fairness audits. Humans should stay in the loop. These are real concerns. I am not dismissing them.

But they are also the concerns of someone looking at the problem from the outside. From the perspective of someone who has actually built models that score people for high-stakes decisions -- income estimation, loan screening, credit risk -- the Eightfold case looks less like a bias problem and more like a governance vacuum.

**The credit scoring industry already solved every governance failure that Eightfold is being sued for.** Not perfectly. Not without its own battles. But the frameworks exist, they are tested, and they work well enough that deploying an unvalidated model that secretly scores millions would be career-ending in banking.

In AI hiring, it is a Series C.

(That is not a metaphor. Eightfold has raised over $400 million in venture funding.)

## The governance taxonomy

I spent two years at Credit Bureau Malaysia building ML models that scored real people -- income estimation models, loan screening models, credit risk assessments. Every model that touched an applicant had to clear a governance process before deployment. My FRM certification covers model risk management under SR 11-7, the Federal Reserve's supervisory guidance issued in April 2011. My actuarial science degree means the mathematics of fairly scoring populations is not an elective -- it is the curriculum.

Here is what credit scoring requires. I am going to walk through each one, then show what Eightfold allegedly did instead.

**The framework has five categories: documentation, validation, discrimination testing, disclosure, and dispute.**

### Documentation

SR 11-7 requires model documentation "sufficiently detailed to allow parties unfamiliar with a model to understand how the model operates, as well as its limitations and key assumptions." That means someone outside the team can audit it. Not a black box. Not "proprietary AI." A document that explains the inputs, the logic, and the failure modes.

Eightfold's scoring methodology is proprietary. The plaintiffs allege that neither candidates nor employers receive documentation about how scores are calculated, what data sources feed the model, or what the known limitations are. Kistler and Bhaumik did not know the score existed.

### Validation

In credit risk, models go through independent validation -- a separate team, not the developers, stress-tests the model against holdout data, checks for stability, and verifies that it performs as documented. This happens before deployment. It happens again periodically. SR 11-7 is explicit: validation must "continue on an ongoing basis after a model goes into use."

**There is no public evidence that Eightfold's scoring model has undergone independent validation by any party outside the company.** The system scores over a billion profiles. The validation standard for a model at that scale in banking would be extensive, multi-layered, and documented in writing.

### Discrimination testing

The Equal Credit Opportunity Act and Regulation B prohibit lending discrimination based on race, color, religion, national origin, sex, marital status, or age. Credit models are tested for disparate impact across protected classes before deployment. If a neutral-seeming variable produces discriminatory outcomes, the model gets revised.

Eightfold claims its AI reduces bias. The lawsuit alleges the opposite -- that the system's opaque scoring may systematically disadvantage candidates on the basis of characteristics it was never supposed to consider. Without transparency into the model's features and weights, neither claim is verifiable.

Think of it like an insurance actuary pricing a policy. The actuary can use your driving record. The actuary cannot use your zip code as a proxy for your ethnicity. The rules are specific, the testing is mandatory, and the penalty for getting it wrong is regulatory action, not a blog post.

### Disclosure

FCRA Section 604(b) is unambiguous: before obtaining a consumer report for employment purposes, the employer must provide a "clear and conspicuous disclosure" in a standalone document. The consumer must give written authorization.

**Eightfold provided no disclosure that a report existed, obtained no authorization to create it, and gave no access for candidates to view their own scores.** This is the heart of the FCRA claim. If Eightfold's output is a consumer report -- and the plaintiffs' argument that it meets the statutory definition is substantial -- then every company using the tool has been violating federal law at scale.

### Dispute

FCRA Sections 610 and 611 give consumers the right to dispute inaccurate information. Consumer reporting agencies must investigate within 30 days. The consumer can see what is in their file, challenge it, and have errors corrected.

Eightfold offers no dispute mechanism. A candidate scored 1 out of 5 based on scraped data from an outdated LinkedIn profile has no path to correction. The score silently filters them out before a recruiter opens the application.

In credit scoring, this would be a regulatory violation on day one. In AI hiring, it has been operating undisclosed for years.

## The "hiring isn't lending" objection

The natural pushback is that hiring and lending are different. FCRA was written for credit bureaus. Eightfold is a talent intelligence platform. The statutory categories do not map cleanly.

This is exactly what the lawsuit challenges. The plaintiffs argue that Eightfold's output meets the FCRA definition of a consumer report: "any written, oral, or other communication of any information by a consumer reporting agency bearing on a consumer's credit worthiness, credit standing, credit capacity, character, general reputation, personal characteristics, or mode of living." The "character, general reputation, personal characteristics" language is broad enough to cover a hiring fitness score.

If the court agrees, the implications cascade. Every employer using Eightfold -- Microsoft, Morgan Stanley, Starbucks, all of them -- would retroactively be in violation of disclosure and authorization requirements. Section 616 of FCRA provides for statutory damages of $100 to $1,000 per violation for willful non-compliance. Multiply that by the number of candidates scored without consent across every client, and the liability is not theoretical.

**The question is not whether hiring should be regulated like lending. The question is whether scoring people in secret for high-stakes decisions should require the same basic governance, regardless of the domain.** The credit industry's answer, arrived at through decades of litigation and legislation, is yes.

## What is already moving

The Kistler lawsuit is not happening in a vacuum.

New York City's Local Law 144, effective January 1, 2023, requires employers using automated employment decision tools to conduct annual bias audits and disclose results publicly. Research from Citizens and Tech found significant compliance gaps -- companies exercise "extreme discretion" and have "strong incentives to avoid transparency." But the law exists. The framework is there.

The EEOC issued guidance in May 2023 treating algorithmic hiring tools as "selection procedures" under Title VII, with the four-fifths rule for disparate impact analysis. That guidance was removed from the EEOC website in January 2025 under the new administration, creating regulatory uncertainty.

The NIST AI Risk Management Framework lays out four functions -- Govern, Map, Measure, Manage -- that apply directly to hiring AI. Its guidance for high-stakes AI applications reads like a condensed version of what credit risk management has required for over a decade.

None of these are perfect. Some are already weakening. But the pattern is clear: jurisdiction after jurisdiction is converging on the same conclusion that credit scoring reached decades ago. **If you score people for consequential decisions, you owe them documentation, validation, testing, disclosure, and dispute rights.**

## Back to the billion

Erin Kistler did not know she had a score. Over a billion other profiled workers do not know either. The data was scraped. The model is proprietary. The score is invisible. There is no dispute mechanism.

Every one of those failures has a corresponding governance control in credit scoring. Documentation existed since SR 11-7 in 2011. Disclosure existed since FCRA in 1970. Dispute rights existed since the same law. Discrimination testing has been standard practice under ECOA since 1974.

The AI hiring industry did not invent a new problem. It skipped the solutions that already existed and hoped nobody would notice.

The governance frameworks are not hard to find. They sit on the Federal Reserve's website, in the CFPB's guidance documents, in every FRM study manual. The knowledge is not the bottleneck. The will to apply it is.

An actuary would have stopped Eightfold at the door. The question now is whether the courts will do what the industry would not.
