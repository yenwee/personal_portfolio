# Eightfold AI Scored a Billion Workers in Secret. An Actuary Would Have Stopped Them at the Door.

*You have probably been scored by an AI hiring tool. You were never told, and there is no way to dispute it.*

---

## The score you never saw

Erin Kistler has a computer science degree from Ohio State and 19 years of product management experience. She applied for a job at PayPal. Before a human recruiter ever opened her application, an algorithm had already scored her on a 0 to 5 scale -- star ratings, half-point increments -- and decided whether she was worth a look.

She did not know the score existed. Neither did over a billion other workers in Eightfold AI's database.

![AI Hiring Score Pipeline](/blogs/images/eightfold/eightfold-invisible-scoring-pipeline.png)

On January 20, 2026, Kistler and co-plaintiff Sruti Bhaumik filed a class action in Contra Costa County Superior Court. Their lawyer is Jenny R. Yang, former chair of the U.S. Equal Employment Opportunity Commission. The client list behind Eightfold reads like a Fortune 500 roll call: Microsoft, Morgan Stanley, Starbucks, PayPal, Chevron, Bayer, BNY. The system collected data from LinkedIn, GitHub, Stack Overflow, and other public sources to build profiles that candidates never consented to and had no way to challenge. (Eightfold disputes that it scrapes social media directly. The complaint cites the company's own privacy policy listing those platforms as data sources.)

The headlines called it an AI bias lawsuit. That framing is valid -- I am not dismissing it. But from where I sit, it misses the more useful story.

Before my current role building AI agent systems, I spent two years at a national credit bureau building ML models that scored real people for income estimation and loan screening. Every model cleared a governance process before it touched a single applicant. Looking at the Eightfold case through that lens, this is not primarily a bias problem. **It is a governance vacuum -- and the governance already exists in another industry.**

## Everyone is having the wrong conversation

Every time an AI hiring tool gets sued, the discourse follows the same arc. Algorithms are biased. We need fairness audits. Humans should stay in the loop. Rinse, repeat.

These are real concerns. They are also the concerns of someone looking at the problem from the outside -- like diagnosing a building collapse by talking about the weather when the foundation had no rebar.

The foundation is governance. Credit scoring has been assigning numbers to people for high-stakes decisions since the Fair Credit Reporting Act of 1970. The industry got it wrong plenty of times. But through decades of lawsuits, regulation, and hard operational lessons, it built a framework with five components: documentation, validation, discrimination testing, disclosure, and dispute rights. **If you score people, you owe them the receipt.** Simple enough to fit on a sticky note. Eightfold allegedly violated every part of it.

![Compare Credit Scoring and AI Hiring Governance](/blogs/images/eightfold/eightfold-five-governance-controls.png)

A former EEOC Commissioner, Keith Sonderling, has argued that existing employment law already covers algorithmic hiring -- the problem is enforcement, not missing statute. Pauline Kim at Washington University School of Law has written extensively about algorithmic bias in employment and how the opacity that AI hiring vendors rely on would not survive the scrutiny applied to consumer finance. And the Kistler plaintiffs are testing this directly -- their legal theory maps Eightfold's scores onto the consumer reporting framework that has governed credit bureaus for over 50 years. Three separate angles, same conclusion: the governance exists. AI hiring skipped it.

(Deploying an unvalidated model that secretly scores millions would be career-ending in banking. In AI hiring, it is a Series C. Eightfold has raised over $400 million.)

## What credit scoring requires -- and what Eightfold skipped

I had to clear five governance controls before any model I built touched an applicant at a credit bureau. Let me walk through them.

A model cannot be a black box. The Federal Reserve's SR 11-7 guidance, issued in 2011, requires documentation detailed enough that someone outside the team can audit it -- inputs, logic, known failure modes, all written down. Think of it as a recipe a stranger could follow. Eightfold's methodology is proprietary. The plaintiffs allege that neither candidates nor employers receive documentation about how scores are calculated. Kistler did not know the recipe existed, let alone what was in it.

The developers also do not get to grade their own homework. In credit risk, a separate team stress-tests every model against holdout data before deployment, then repeats the process periodically. You would not trust a bridge designed and inspected by the same engineer -- the inspector has to be independent. There is no public evidence that Eightfold's model has been independently validated by anyone outside the company. A system scoring over a billion profiles.

![Credit Bureau vs Eightfold Model Governance](/blogs/images/eightfold/eightfold-credit-bureau-vs-eightfold.png)

Then there is discrimination testing, which is where the actuarial side of my background earns its keep. The harder problem is not explicit bias -- it is proxy discrimination. Variables that look neutral but correlate with protected classes. An insurance actuary can use your driving record but cannot use your zip code as a stand-in for your ethnicity. The rules are specific. The testing is mandatory. Eightfold claims its AI reduces bias. The lawsuit alleges the opposite. Without access to the model's features and weights, there is no way to know which is true -- and that opacity alone would be disqualifying in credit risk.

Disclosure is the most straightforward rule and the most clearly violated. Before using a consumer report for employment decisions, the employer must provide a clear disclosure and get written authorization. Eightfold provided neither. Candidates had no idea a score existed, let alone what it said. If Eightfold's output qualifies as a consumer report -- and the statutory definition covers "character, general reputation, personal characteristics," which is broad enough to include a hiring fitness score -- then every company using the tool has been violating federal disclosure law. Microsoft. Morgan Stanley. All of them.

Dispute rights close the loop. Under FCRA, consumers can see what is in their file, challenge inaccuracies, and have errors investigated within 30 days. A candidate scored 1 out of 5 because the system ingested an outdated LinkedIn profile has no path to correction. The score filters them out silently before a recruiter opens the application.

Imagine getting rejected from a bank loan because of a credit score you could not see, built from data you did not provide, with no way to challenge it. That is what happened here -- just in hiring instead of lending. In credit scoring, this would be a violation on day one. In AI hiring, it ran for years.

![Bank Loan vs AI Hiring: Transparency Comparison](/blogs/images/eightfold/eightfold-bank-loan-vs-ai-hiring.png)

## What this means if you build or buy these tools

The Kistler lawsuit is not isolated.

New York City already requires annual bias audits for automated hiring tools under Local Law 144. Compliance research from Citizens and Tech found most companies are barely meeting the bar -- "extreme discretion" and "strong incentives to avoid transparency" were the researchers' words. But the law is active, auditors are engaged, and other cities are watching.

The EEOC treated algorithmic hiring tools as "selection procedures" under Title VII in its May 2023 guidance -- applying the same disparate impact standards used for any other hiring test. That guidance was pulled from the EEOC website in January 2025 under the new administration. The legal theory did not disappear with the webpage.

The NIST AI Risk Management Framework lays out requirements for high-stakes AI that will feel familiar if you have seen how credit risk management works. **Different vocabulary, same architecture.** Govern, Map, Measure, Manage -- each function maps to the controls credit bureaus already operate.

If you score people for consequential decisions, governance is coming whether you build it proactively or a court orders it. The companies that build it first avoid the scramble when the rules catch up. The rules always catch up. (Ask anyone who was in consumer lending before 2008.)

![Evolution of Regulation for Scoring People](/blogs/images/eightfold/eightfold-governance-convergence-timeline.png)

## Back to the billion

Erin Kistler did not know she had a score. Over a billion other profiled workers still do not.

Every one of those failures maps to a governance control that has existed in credit scoring for years -- some for over half a century. The AI hiring industry did not discover a new problem. It skipped solutions that were already sitting on the Federal Reserve's website, in the operational playbooks of every credit bureau I worked at.

![Bridging the Governance Gap in Hiring](/blogs/images/eightfold/eightfold-governance-gap.png)

The governance is not hard to find. The will to apply it is.

An actuary would have stopped Eightfold at the door. The courts are now deciding whether they will do what the industry would not.
