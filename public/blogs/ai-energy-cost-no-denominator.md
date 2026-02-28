# The AI Industry Has an Energy Problem It Cannot Do Math On

*Sam Altman says training a human uses energy too. By that logic, your office electric bill is justified because the sun also produces heat.*

---

## The comparison that falls apart on contact

Sam Altman told a crowd in February 2026 that "it also takes a lot of energy to train a human." The audience laughed. The quote circulated as a clever reframe -- AI energy costs are overblown because humans are expensive to run, too.

It is a good soundbite. It is also an accounting error.

Altman is comparing the marginal cost of a single AI inference call -- one query, stateless, disposable -- against the fully loaded lifetime cost of a human being. Food. Housing. Education. Healthcare. Eighteen years of caloric intake before the person even enters the workforce.

A human is a general-purpose system that produces economic output for 40-plus years, raises the next generation, and participates in governance. An AI query answers a question and forgets it happened.

These are not the same unit of analysis. Any first-year actuarial student or FRM candidate would flag this on a practice exam. You do not compare the marginal cost of a derivatives trade against the operating budget of the entire trading floor. You compare trade to trade, or floor to floor. Altman is mixing levels and counting on the audience not to notice.

## The two honest comparisons nobody wants to publish

There are two defensible ways to compare AI and human cognitive costs. The AI industry avoids both.

The first is cost per cognitive task. How much does it cost for an AI to answer a question, generate a code block, or summarize a report -- versus paying a human to do the same work? This comparison favors AI. Inference is cheap per task. OpenAI knows this and cites it constantly when selling enterprise contracts. Fractions of a cent per query for GPT-4-class models on most workloads.

The second is total system cost. How much does it cost to build, train, and operate all the AI infrastructure -- data centers, chips, power, cooling, talent -- versus the total cost of the human workforce it claims to replace? This comparison does not favor AI. Training runs cost hundreds of millions. Data center power demand is projected to double by 2028. Nvidia shipped more power-hungry chips in 2025 than some countries consume in a year.

Altman switches between these two frames depending on which makes AI look better. Selling to enterprises? Cost per task. Defending against energy critics? Total human cost. He never holds still long enough for the math to land on one denominator.

He is not the only one. Google's 2024 sustainability report buried data center energy numbers in an appendix and led with efficiency-per-query metrics. Microsoft quietly shifted its sustainability commitments from absolute carbon reduction to "intensity-based" targets -- total emissions can rise as long as emissions per dollar of revenue fall. The denominator is always chosen after the conclusion.

## What it looks like when you actually measure

I spent two years at Credit Bureau Malaysia building ML models that scored real people for income estimation and loan eligibility. Every model had a cost attribution. Not just the compute cost to train it, but the full cost: engineer time, validation cycles, infrastructure, and the expected revenue impact per decisioned application. We tracked cost per decisioned application down to the sen -- that is a hundredth of a Malaysian ringgit.

If a model's ROI did not justify the infrastructure, we killed it. Not deprecated it. Not scheduled a review. Killed it. The data warehouse ran on PostgreSQL across 6TB of consumer data, and every query against it had a cost that rolled up into a business case. There was no room for "it also costs a lot to feed the analysts."

This is not exotic. Every regulated financial institution does some version of it. The actuarial profession has been measuring cost per unit of risk for over a century -- that is literally what a loss ratio is. Insurance companies do not get to say "buildings are expensive too" when their claims processing costs spike.

Credit scoring has this discipline. Insurance has it. Banking has it. The AI industry does not. That absence is not an oversight.

## The denominator problem

The AI industry has never agreed on a standard denominator for energy efficiency.

There is no "cost per unit of useful cognitive output." FLOPS measure raw computation, not usefulness. Tokens are a billing unit, not a quality metric -- a thousand tokens of hallucination cost the same to generate as a thousand tokens of correct analysis. Queries are too coarse -- a simple autocomplete and a multi-step reasoning chain consume different resources and deliver different value.

Without a denominator, every comparison is rigged. Altman can compare whatever he wants against whatever else he wants, and nobody can check the math.

Other industries figured this out. Cars have miles per gallon. Buildings have energy use intensity -- kBtu per square foot. Power plants have heat rate. Data centers themselves have PUE, total facility energy divided by IT equipment energy. Imperfect metrics, all of them. But they are standardized, public, and auditable. They let regulators and competitors hold each other accountable.

AI has nothing equivalent. The companies building the largest models are the ones with the most to lose from defining it.

## What the honest version would look like

An honest energy accounting for AI would need a standard unit of useful output -- something tied to task completion, not raw tokens or FLOPS. A correctly answered question. A working code block. A decision that would have taken a human analyst a measured amount of time. Defining this is hard, which is exactly why nobody has done it. Hard does not mean optional.

It would also need full-stack cost attribution. Not just inference cost, but training amortization, data center construction, cooling, network, and the embodied carbon of the hardware itself. A manufacturing company reports cost of goods sold, not just the electricity bill for the assembly line.

And it would need independent audit. Not self-reported efficiency claims buried in sustainability PDFs. The same kind of external verification applied to financial statements. If you claim your system is more efficient than a human workforce, open the ledger.

None of this is technically difficult for companies that already track cloud spend to the millisecond. The data exists. The will to publish it does not.

## This is not really about energy

If the AI industry cannot define what "efficient" means for energy, it cannot define what "efficient" means for anything else either. Accuracy. Reliability. Fairness. Cost to the customer. The energy debate is one instance of a pattern: build at scale, operate behind proprietary walls, and tell the public to trust the output without showing the methodology.

I wrote about this same pattern in the Eightfold case -- a company that scored a billion workers without telling any of them. "How much energy does AI use?" and "How does your AI make decisions?" have the same structural answer: we will not tell you, and we have not agreed on how to measure it.

Altman's soundbite works because the public does not have a denominator. Give them one and the argument collapses on contact. That is exactly why it has not been given.

The industry will not volunteer this metric. The EU AI Act already mandates energy consumption reporting for high-risk systems, but enforcement is years away. Until then, every efficiency claim from an AI company is self-graded homework. Treat it accordingly.
