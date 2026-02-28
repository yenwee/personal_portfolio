# The AI Industry Has an Energy Problem It Cannot Do Math On

*Sam Altman says training a human uses energy too. By that logic, your office electric bill is justified because the sun also produces heat.*

---

## The comparison that falls apart on contact

Sam Altman told an audience at the India AI Impact Summit in February 2026 that "it also takes a lot of energy to train a human. It takes, like, 20 years of life, and all of the food you eat during that time before you get smart." Some in the crowd laughed. The quote circulated as a clever reframe -- AI energy costs are overblown because humans are expensive to run, too.

It is a good soundbite. It is also an accounting error.

Altman is comparing the marginal cost of a single AI inference call -- one query, stateless, disposable -- against the fully loaded lifetime cost of a human being. Food, housing, education, healthcare, eighteen years of caloric intake before the person even enters the workforce.

A human produces economic output for 40-plus years, raises children, participates in governance. An AI query answers a question and forgets it happened.

These are not the same unit of analysis. You do not compare the marginal cost of a single trade against the operating budget of the entire trading floor. You compare trade to trade, or floor to floor. Altman is mixing levels and counting on the audience not to notice.

## The two honest comparisons nobody wants to publish

There are two defensible ways to compare AI and human cognitive costs. The AI industry avoids both.

One way is cost per cognitive task -- how much does it cost for an AI to answer a question or generate a code block, versus paying a human to do the same work? This comparison favors AI. Inference is cheap per task. OpenAI cites this constantly when selling enterprise contracts. Fractions of a cent per query on most workloads.

The other way is total system cost -- how much does it cost to build, train, and run all the AI infrastructure versus the human workforce it claims to replace? This comparison does not favor AI. Training runs cost hundreds of millions. Global data center electricity consumption is projected to double by 2030, according to the IEA. Nvidia's deployed H100 GPUs alone consume roughly 13,000 GWh per year -- more electricity than countries like Costa Rica or Guatemala use annually.

Altman switches between these two frames depending on which makes AI look better. Selling to enterprises? Cost per task. Defending against energy critics? Total human cost. He never holds still long enough for the math to land on one denominator.

He is not the only one. Google's 2024 environmental report led with per-query efficiency metrics and PUE scores while the 13% year-over-year increase in total greenhouse gas emissions -- driven by data center expansion -- got less prominent treatment. Microsoft quietly shifted its Scope 3 sustainability commitments from absolute carbon reduction to "intensity-based" targets, measured as emissions per dollar of revenue. Total emissions have risen 29% since their 2020 carbon-negative pledge. The denominator is always chosen after the conclusion.

## What it looks like when you actually measure

At a previous job, I built scoring models at a national credit bureau. Every model had a cost attribution -- not just compute, but the full cost: engineer time, validation cycles, infrastructure, and the expected revenue per decisioned application. We tracked it down to the sen. That is a hundredth of a Malaysian ringgit.

If a model's ROI did not justify the infrastructure, we killed it. No deprecation notice, no review cycle -- just gone. Every query against a 6TB data warehouse rolled up into a business case. Nobody got to wave their hands and say "it also costs a lot to feed the analysts."

Regulated finance has had this discipline for decades. Insurance companies measure cost per unit of risk -- that is what a loss ratio is. They do not get to say "buildings are expensive too" when claims processing costs spike. The AI industry has no version of this, and the absence is not an oversight.

## The denominator problem

The AI industry has never agreed on a standard denominator for energy efficiency.

There is no "cost per unit of useful cognitive output." FLOPS measure raw computation, not usefulness. Tokens are a billing unit, not a quality metric -- a thousand tokens of hallucination cost the same to generate as a thousand tokens of correct analysis. Queries are too coarse -- a simple autocomplete and a multi-step reasoning chain consume different resources and deliver different value.

Without a denominator, every comparison is rigged. Altman can compare whatever he wants against whatever else he wants, and nobody can check the math.

Other industries figured this out a long time ago. Cars have miles per gallon. Buildings have energy use intensity. Power plants have heat rate. Data centers themselves have PUE -- total facility energy divided by IT equipment energy. None of these are perfect, but they are standardized, public, and auditable. They give regulators and competitors something to check.

AI has nothing like this.

## What the honest version would look like

An honest energy accounting for AI would start with a standard unit of useful output -- something tied to task completion, not raw tokens or FLOPS. A correctly answered question, a working code block, a decision that would have taken a human analyst a measured amount of time. Defining this is genuinely difficult. That is not a reason to skip it.

The cost attribution would need to be full-stack: training amortization, data center construction, cooling, network, the embodied carbon of the hardware. A manufacturing company reports cost of goods sold, not just the electricity bill for the assembly line. Same principle.

Then someone outside the company would need to verify it. Not self-reported efficiency claims buried in sustainability PDFs -- the same kind of external audit applied to financial statements. If you claim your system is more efficient than a human workforce, open the ledger.

None of this is technically difficult for companies that already track cloud spend to the millisecond. The data exists. The will to publish it does not.

## This is not really about energy

If the AI industry cannot define what "efficient" means for energy, it cannot define what "efficient" means for accuracy, reliability, fairness, or cost to the customer either. The energy debate is one instance of a wider pattern: build at scale, operate behind proprietary walls, tell the public to trust the output without showing how it works.

The same pattern showed up in the Eightfold lawsuit -- a company that scored a billion workers without telling any of them. "How much energy does AI use?" and "How does your AI make decisions?" get the same structural answer: we will not tell you, and we have not agreed on how to measure it.

Altman's soundbite works because the public does not have a denominator. Give them one and the argument collapses on contact. That is exactly why it has not been given.

The industry will not volunteer this metric. The EU AI Act mandates energy consumption reporting for general-purpose AI model providers under Annex XI, with compliance required for models launched after August 2025. But broader environmental standards for AI remain voluntary, and enforcement of the existing rules is still ramping up. Until then, every efficiency claim from an AI company is self-graded homework. Treat it accordingly.
