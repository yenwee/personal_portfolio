# The AI Industry Has an Energy Problem It Cannot Do Math On

*Sam Altman says training a human uses energy too. By that logic, your office electric bill is justified because the sun also produces heat.*

---

![One AI query versus one human lifetime -- not the same unit of analysis](/blogs/images/energy/energy-featured.png)

## The comparison that falls apart on contact

Sam Altman told an audience at the India AI Impact Summit in February 2026 that "it also takes a lot of energy to train a human. It takes, like, 20 years of life, and all of the food you eat during that time before you get smart." Some in the crowd laughed. The quote circulated as a clever reframe -- AI energy costs are overblown because humans are expensive to run, too.

It is a good soundbite. It is also an accounting error.

Altman is comparing the marginal cost of a single AI inference call -- one query, stateless, disposable -- against the fully loaded lifetime cost of a human being. Food, housing, education, healthcare, eighteen years of caloric intake before the person even enters the workforce.

A human produces economic output for 40-plus years and raises children. An AI query answers a question and forgets it happened.

These are not the same unit of analysis. You do not compare the marginal cost of a single trade against the operating budget of the entire trading floor. You compare trade to trade, or floor to floor. Altman is mixing levels and counting on the audience not to notice.

## The two honest comparisons nobody wants to publish

If you wanted to honestly compare AI and human cognitive costs, there are really only two ways to do it. The industry avoids both.

One way is cost per cognitive task -- how much does it cost for an AI to answer a question or generate a code block, versus paying a human to do the same work? This comparison favors AI. Inference is cheap per task. OpenAI cites this constantly when selling enterprise contracts. Fractions of a cent per query on most workloads.

The other way is total system cost -- how much does it cost to build, train, and run all the AI infrastructure versus the human workforce it claims to replace? This comparison does not favor AI. Training runs cost hundreds of millions.

Global data center electricity consumption is projected to double by 2030, according to the IEA. Nvidia's deployed H100 GPUs alone consume roughly 13,000 GWh per year -- more electricity than countries like Costa Rica or Guatemala use annually.

Altman switches between these two frames depending on which makes AI look better. Selling to enterprises? Cost per task. Defending against energy critics? Total human cost. He never holds still long enough for the math to land on one denominator.

He is not the only one. Google's 2024 environmental report led with per-query efficiency metrics and PUE scores. The 13% year-over-year increase in total greenhouse gas emissions -- driven by data center expansion -- got quieter treatment.

Microsoft did something more interesting. They quietly shifted their Scope 3 sustainability commitments from absolute carbon reduction to "intensity-based" targets, measured as emissions per dollar of revenue. Total emissions have risen 29% since their 2020 carbon-negative pledge. The math technically works -- as long as revenue grows faster than pollution.

The denominator is always chosen after the conclusion.

## What it looks like when you actually measure

At a previous job, I built scoring models at a national credit bureau. Every model had a cost attribution -- not just compute, but the full cost: engineer time, validation cycles, infrastructure, and the expected revenue per decisioned application. We tracked it down to the sen. That is a hundredth of a Malaysian ringgit.

![Five layers of cost attribution per ML model](/blogs/images/energy/energy-cost-attribution.png)

If a model's ROI did not justify the infrastructure, we killed it. No deprecation notice, no review cycle -- just gone. Every query against a 6TB data warehouse rolled up into a business case. Nobody got to wave their hands and say "it also costs a lot to feed the analysts."

Regulated finance has had this discipline for decades. Insurance companies measure cost per unit of risk -- that is what a loss ratio is. They do not get to say "buildings are expensive too" when claims processing costs spike. The AI industry has no version of this, and the absence is not an oversight.

## The denominator problem

Here is the part that really bothers me. The AI industry has never agreed on a standard denominator for energy efficiency.

There is no "cost per unit of useful cognitive output." FLOPS measure raw computation, not usefulness. Tokens are a billing unit, not a quality metric -- a thousand tokens of hallucination cost the same to generate as a thousand tokens of correct analysis. Queries are too coarse -- a simple autocomplete and a multi-step reasoning chain consume different resources and deliver different value.

Without a denominator, every comparison is rigged. Altman can compare whatever he wants against whatever else he wants, and nobody can check the math.

Other industries figured this out a long time ago. Cars have miles per gallon. Buildings have energy use intensity. Power plants have heat rate. Data centers themselves have PUE -- total facility energy divided by IT equipment energy. None of these are perfect, but they are standardized, public, and auditable. They give regulators and competitors something to check.

![Standard energy efficiency metrics by industry -- AI has none](/blogs/images/energy/energy-missing-denominator.png)

AI has nothing like this.

And the fix is not mysterious. You would need a standard unit of useful output -- something tied to task completion, not raw tokens. A correctly answered question, a working code block, a decision that would have taken a human analyst a measured amount of time. Full-stack cost attribution: training, data center construction, cooling, the embodied carbon of the hardware. Then independent audit, not sustainability PDFs written by the same company burning the electricity.

None of this is technically difficult for companies that already track cloud spend to the millisecond. The data exists. The will to publish it does not.

Here is what I keep coming back to. I run AI systems now. I can tell you roughly what it costs to process one document through a multi-agent pipeline -- inference, orchestration, retries, the lot. A small AI team in Kuala Lumpur can track this. The idea that a company valued at $300 billion cannot define "cost per useful output" is not a technical limitation. It is a choice.

![A small team can track cost per output -- a $300B company refuses to](/blogs/images/energy/energy-300b-choice.png)

## This is not really about energy

If the AI industry cannot define what "efficient" means for energy, it cannot define it for accuracy, reliability, or fairness either. The energy debate is one instance of a pattern I keep seeing -- same one behind the [Eightfold lawsuit](/blogs/eightfold-ai-billion-workers-actuary), same one behind every "trust us" from a company that will not open the ledger. Build at scale, operate behind proprietary walls, tell the public to trust the output.

Altman's soundbite works because the public does not have a denominator. Give them one and the argument falls apart. The EU AI Act mandates energy reporting for GPAI model providers starting August 2025 -- but broader standards remain voluntary, and enforcement is still ramping up. Until then, every efficiency claim from an AI company is self-graded homework. Treat it accordingly.
