# Eightfold AI Scored a Billion Workers in Secret. An Actuary Would Have Stopped Them at the Door.

*You have probably been scored by an AI hiring tool. You were never told, and there is no way to dispute it.*

---

## The score you never saw

Erin Kistler has a computer science degree from Ohio State and 19 years of product management experience. She applied for a job at PayPal. Before a human recruiter ever opened her application, an algorithm had already scored her on a 0 to 5 scale -- displayed as star ratings in half-point increments -- and decided whether she was worth looking at.

She did not know the score existed. Neither did over a billion other workers in Eightfold AI's database.

On January 20, 2026, Kistler and co-plaintiff Sruti Bhaumik filed a class action in California Superior Court. Their lawyer is Jenny R. Yang, former chair of the Equal Employment Opportunity Commission. The client list behind Eightfold reads like a Fortune 500 roll call: Microsoft, Morgan Stanley, Starbucks, PayPal, Chevron, Bayer, BNY. The system pulled data from LinkedIn, GitHub, Stack Overflow, and other public sources to build profiles that candidates never consented to, never saw, and had no way to challenge.

The headlines called it an AI bias lawsuit. That framing is valid -- I am not dismissing it. But from where I sit, it misses the more useful story.

I spent two years at Credit Bureau Malaysia building ML models that scored real people for income estimation and loan screening. Every model cleared a governance process before it touched a single applicant. My FRM certification covers model risk management. My actuarial science degree means the math of fairly scoring populations was the curriculum, not an elective. Looking at the Eightfold case through that lens, this is not a bias problem. **It is a governance vacuum -- and the governance already exists in another industry.**

This post covers why the "AI bias" frame is incomplete, and what credit scoring built decades ago to prevent exactly these failures.

## Everyone is having the wrong conversation

Every time an AI hiring tool gets sued, the discourse follows the same arc. Algorithms are biased. We need fairness audits. Humans should stay in the loop. Rinse, repeat.

These are real concerns. They are also the concerns of someone looking at the problem from the outside, like diagnosing a building collapse by talking about the weather when the foundation had no rebar.

The foundation, in this case, is governance. Credit scoring has been assigning numbers to people for high-stakes decisions since the Fair Credit Reporting Act of 1970. The industry got it wrong plenty of times. But through decades of lawsuits, regulation, and hard operational lessons, it built a governance framework with five components: documentation, validation, discrimination testing, disclosure, and dispute rights. **If you score people, you owe them the receipt.** That is the heuristic. Simple enough to fit on a sticky note, and Eightfold allegedly violated every part of it.

I am not the only one seeing this pattern. Keith Sonderling, former EEOC Commissioner, has argued that existing employment law already covers algorithmic hiring -- the problem is enforcement, not statute. Pauline Kim, a law professor at Washington University, has written that the "black box" defense in AI hiring would never survive scrutiny in consumer finance. And the Kistler plaintiffs' legal theory -- that Eightfold's scores are consumer reports under FCRA -- directly maps hiring AI onto the credit reporting framework. Three different angles. Same conclusion: the governance already exists. AI hiring just ignored it.

(Deploying an unvalidated model that secretly scores millions would be career-ending in banking. In AI hiring, it is a Series C. Eightfold has raised over $400 million.)

## What credit scoring requires -- and what Eightfold skipped

Let me walk through the five governance controls. Not as a legal treatise, but as someone who had to clear every one of them before a model touched an applicant at a national credit bureau.

**Documentation** comes first. SR 11-7, the Federal Reserve's model risk guidance from April 2011, requires documentation "sufficiently detailed to allow parties unfamiliar with a model to understand how the model operates." Think of it as a recipe that a stranger could follow -- inputs, logic, known failure modes, all written down. Eightfold's scoring methodology is proprietary. The plaintiffs allege that neither candidates nor employers receive documentation about how scores are calculated or what data feeds them. Kistler did not know the recipe existed, let alone what was in it.

**Validation** is the second gate. In credit risk, a separate team -- not the developers -- stress-tests every model against holdout data before deployment, then repeats the process periodically. SR 11-7 is explicit: validation must "continue on an ongoing basis after a model goes into use." An analogy that makes this concrete: you would not trust a bridge designed and inspected by the same engineer. The inspector has to be independent. There is no public evidence that Eightfold's model has been independently validated by anyone outside the company. The system scores over a billion profiles.

**Discrimination testing** is where actuarial training earns its keep. The Equal Credit Opportunity Act prohibits using protected characteristics -- race, sex, age, religion -- in lending decisions. But the harder problem is proxy discrimination: variables that look neutral but correlate with protected classes. An insurance actuary can use your driving record but cannot use your zip code as a stand-in for your ethnicity. The rules are specific, the testing is mandatory, and the penalty is regulatory action. Eightfold claims its AI reduces bias. The lawsuit alleges the opposite. Without transparency into the model's features and weights, neither claim is verifiable. That opacity itself would be disqualifying in credit risk.

**Disclosure** is the most straightforward requirement and the most clearly violated. FCRA Section 604(b) says: before obtaining a consumer report for employment purposes, the employer must provide a clear disclosure and get written authorization. **Eightfold provided no disclosure, obtained no authorization, and gave candidates no access to their own scores.** This is the heart of the FCRA claim. If Eightfold's output qualifies as a consumer report -- and the statutory definition covers "character, general reputation, personal characteristics," which is broad enough to include a hiring fitness score -- then every company using the tool has been violating federal disclosure law at scale. Microsoft. Morgan Stanley. All of them.

**Dispute rights** close the loop. FCRA gives consumers the right to see what is in their file, challenge inaccuracies, and have errors corrected within 30 days. A candidate scored 1 out of 5 because Eightfold scraped an outdated LinkedIn profile has no path to correction. The score filters them out silently, before a recruiter opens the application. In credit scoring, that would be a regulatory violation on day one. In AI hiring, it ran for years. (Imagine getting rejected from a bank loan because of a credit score you couldn't see, built from data you didn't provide, with no way to dispute it. That is exactly what happened -- just in hiring.)

## What is already moving

The Kistler lawsuit is not isolated.

New York City's Local Law 144, effective since January 2023, requires annual bias audits for automated hiring tools and public disclosure of results. Research from Citizens and Tech found the compliance is thin -- companies exercise "extreme discretion" and have "strong incentives to avoid transparency." But the law exists, and it mirrors the same audit-and-disclose logic that credit scoring runs on.

The EEOC issued guidance in May 2023 treating algorithmic hiring as "selection procedures" under Title VII. That guidance was pulled from the EEOC website in January 2025 under the new administration -- creating a gap, but not erasing the legal theory behind it.

The NIST AI Risk Management Framework maps four functions to high-stakes AI: Govern, Map, Measure, Manage. Read the framework's requirements and you will recognize them. **They are a compressed version of what credit risk management has required since 2011.** Different vocabulary. Same architecture.

The pattern across jurisdictions is convergence. Regulators, courts, and standards bodies are all arriving at the same destination that credit scoring reached decades ago: if you score people for consequential decisions, you owe them documentation, validation, testing, disclosure, and dispute rights. The question is how long AI hiring can avoid the same conclusion.

## Back to the billion

Erin Kistler did not know she had a score. Over a billion other profiled workers still do not. The data was scraped. The model is proprietary. The score is invisible. There is no way to dispute it.

Every one of those failures has a corresponding control in credit scoring that has existed for years -- some for decades. The AI hiring industry did not discover a new problem. It skipped solutions that were already sitting on the Federal Reserve's website, in every FRM study manual, in the operational playbooks of every credit bureau I worked at.

The governance is not hard to find. The will to apply it is.

An actuary would have stopped Eightfold at the door. The courts are now deciding whether they will do what the industry would not.
