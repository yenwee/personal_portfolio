# We build AI for a living. Half our company does not want to use it.

![Two teams, one AI company -- AI Solutions team embraces tools for speed, Software Engineering team prefers hand-written code for quality](/blogs/images/devdivide/devdivide-featured.png)

We called a townhall last month to talk about AI coding tools. Not a casual Slack poll. A planned, company-wide session. The AI Solutions team -- my team -- had been using Claude Code, Cursor, and custom agent workflows for months. The Software Engineering team, the one building the core product, had not. Same company. Same office. Two completely different relationships with the tools we sell.

I walked in expecting a conversation about which tools to standardize. What I got was a lesson in the technology adoption curve that I should have seen coming.

> [!challenge] The divide is not about tools
> The divide is not about whether AI coding tools work. Everyone agrees they produce code. The divide is about whether you trust what they produce, and whether you think the speed is worth the risk.

## The adoption curve, again

![Technology adoption curve for AI tools -- from innovators through early adopters to laggards, with team positions mapped](/blogs/images/devdivide/devdivide-adoption-curve.png)

I have seen this pattern before. Everyone has.

When the internet arrived, someone at every newspaper said "our readers prefer paper." When crypto emerged, someone at every bank said "this is a toy." When mobile-first happened, someone at every enterprise said "our users are on desktops."

They were not wrong about the present. They were wrong about the trajectory.

The technology adoption curve (innovators, early adopters, early majority, late majority, laggards) is one of the most validated frameworks in tech. It describes every wave. And it describes exactly what happened in our townhall.

My AI Solutions team sits at early adopter. We build AI agents for clients. We already believe the technology works because we ship it. Using AI to write the AI felt natural. The Software Engineering team sits at early majority, maybe late majority. They build the core platform. Their codebase is stable, well-tested, and maintained by people who take pride in the craft of writing it themselves.

Neither side is wrong. But only one side is going to be comfortable in 18 months.

## `/processes` vs `/process`

![Analyzing the pitfalls of almost right AI code -- fishbone diagram showing how false confidence, subtle errors, and isolated tests lead to harder debugging](/blogs/images/devdivide/devdivide-almost-right.png)

Here is the moment that made me take the "almost right" problem seriously.

We had a spec. Frontend and backend teams had agreed on the API contract. Route names, request bodies, response shapes. All documented. An engineer used an AI coding tool to generate the backend endpoint. The code was clean. It compiled. The endpoint responded correctly when tested in isolation.

The frontend got a 404.

The AI had generated the route as `/processes`. The frontend was calling `/process`. One character. Plural vs singular. The spec said `/process`. The AI read the spec and still got it wrong.

> [!warning] The confidence is the dangerous part
> The code looked correct. It passed linting. It returned the right data shape. If you tested the endpoint by itself, everything worked. The bug only appeared when frontend and backend talked to each other. That is not a hallucination. It is a misunderstanding. And it is the kind of bug that slips through code review if you are not looking for it.

This is what I mean by "almost right." The code is 95% correct. It compiles. It runs. It does roughly the right thing. But the 5% it gets wrong is subtle, and subtle bugs are harder to catch than obvious ones. A 500 error is easy to debug. A 404 caused by a route name you never thought to check is not.

METR, one of the few organizations running rigorous randomized studies on AI coding productivity, found that developers using AI tools were **19% slower** on average. But the developers themselves estimated they were **20% faster**. The perception gap is not small. It is a full 39 percentage points in the wrong direction.

I believe that number. I have watched engineers on my team submit pull requests faster and then spend twice as long in review figuring out what the AI got subtly wrong. The generation is fast. The validation eats the speed gains and then some.

> [!metric] The productivity paradox
> Vendor claims: 20-55% faster. METR randomized study: 19% slower. Real-world analysis: maybe 10% gains in the best case. The gap between claimed and measured productivity is the widest in any software tooling category I have seen.

## The "almost right" tax

![AI coding impact matrix -- vendor claims vs METR study findings vs developer perception](/blogs/images/devdivide/devdivide-productivity-paradox.png)

The `/processes` bug is not an isolated story. It is a pattern.

Stack Overflow's 2025 developer survey found that **66% of developers** cite "AI solutions are almost right, but not quite" as their number one frustration with AI tools. Not "AI is too slow." Not "AI does not understand my codebase." The top complaint is that the output is close enough to look correct but far enough to break things.

And close-enough code is harder to debug than wrong code. When code is obviously broken, you know where to look. When code is almost right, you have to read every line carefully to find the one thing that is off. **45% of developers say debugging AI-generated code takes longer than debugging code they wrote themselves.**

The security angle makes this worse. Analysis of AI-generated code found **1.7x more issues** overall and **322% more privilege escalation vulnerabilities** compared to human-written code. The AI does not write insecure code on purpose. It writes plausible code that happens to miss edge cases a security-aware human would catch.

> [!insight] The uncanny valley of code
> Code that is obviously wrong gets caught immediately. Code that is subtly wrong passes review, ships to production, and becomes the bug you spend three days tracking down. AI-generated code sits in that uncanny valley: syntactically perfect, architecturally plausible, functionally off by one character.

This is why TDD matters more now than it did before AI tools existed. Not less. If your tests check that the frontend can actually call the backend endpoint by name, the `/processes` bug dies in CI instead of production. If your tests only check that the endpoint returns the right data shape, the bug ships.

Code review matters more too. Not the rubber-stamp kind where you skim the diff and approve. The kind where you actually read the route names, check them against the spec, and verify the contract matches what the frontend expects.

AI tools make generation faster. They make validation harder. If you do not adjust your process for the second part, you are not getting faster. You are getting *confident*.

## My teammate's best argument

Not everyone on my team is fully bought in. One person -- I will call him the realist -- maintains a healthy skepticism that I think makes our team better.

His argument is not "AI is bad." His argument is "AI is good enough to be dangerous."

He showed us a blog post about a Rust SQL query generated by an AI tool. The query was correct. It returned the right results. But a human who understood the database schema would have written it differently: better indexing, fewer joins, half the execution time. The AI solved for correctness. It did not solve for craft.

Correct but unoptimized code ships to production. Then more correct but unoptimized code ships. Then more. And in 18 months, you have a codebase that runs but runs slowly, uses more memory than it should, and is harder to maintain than it needs to be. That is the technical debt of 2027, and we are writing it right now.

> [!caution] Correct is not the same as good
> AI code that produces the right output is not the same as code a senior engineer would be proud of. The gap between "it works" and "it works well" is where craft lives. If you stop caring about that gap, you are outsourcing your standards to a model that has no standards.

He is right. And I still think we should use the tools.

The two positions are not contradictory. You can believe AI coding tools are worth using and also believe they require more discipline, not less. The mistake is treating AI as a replacement for judgment. It is a replacement for *typing*. The judgment still needs a human. What to build, how to structure it, what to test, what to optimize.

## How I hire now

![Hiring priorities pyramid -- product sense at the top, coding ability at the base as table stakes](/blogs/images/devdivide/devdivide-hiring-shift.png)

I used to weight coding ability heavily in interviews. Can you implement this algorithm? Can you debug this function? Can you write clean, idiomatic code?

I still care about those things. But they matter less than they did two years ago.

Now my interview questions sound more like: "How would you turn this into a product?" "How would someone actually use this?" "Walk me through the architecture. Not the implementation. The architecture."

I am looking for product sense. I am looking for the ability to think at the right altitude. High enough to see the system, low enough to know where the risks are. I am looking for attitude: curiosity about tools, willingness to learn, comfort with ambiguity.

The candidates who concern me are the ones who say "I tried AI tools before and they don't work." Not because they are wrong about the current limitations. But because the statement reveals a fixed relationship with tools. Someone who tried the internet in 1995 and said "this is useless" was making an accurate observation about 1995. They were making a catastrophic prediction about 2005.

> [!insight] The hiring shift
> The question is no longer "can you code?" It is "can you think about what to build, decide how to structure it, and use whatever tools are available to build it well?" Coding ability is now table stakes. Product sense is the differentiator.

I have passed on technically strong candidates who could not answer "who would use this and why?" I have hired people with less raw coding ability who could see the system from the user's perspective. The bet is that AI tools will keep getting better at generation, which means the human value shifts permanently toward judgment, taste, and architectural thinking.

## The ambassador's dilemma

Here is the part I find funny, in the way that uncomfortable truths are funny.

I am the person at Infomina AI pushing hardest for AI tool adoption. I run sharing sessions. I demo my Claude Code setup: the custom skills, the MCP tools, the subagent workflows, the personalized configurations. I show people what is possible when you invest the time to learn the tools deeply.

And I know -- honestly know -- that we are not fully utilizing what is already available. My own company, which builds AI products for clients, has not fully embraced AI tools internally. I am the ambassador, and the embassy is half-built.

This is not hypocrisy. It is the gap between knowing something works and getting an entire organization to change how they work. That gap exists at every company, in every adoption cycle, for every technology. The internet was invented in the 1960s and most businesses did not have a website until the late 1990s. Knowing that a tool works and integrating it into daily practice are separated by years, not weeks.

> [!challenge] The real question for leaders
> The question is not "should we use AI tools?" The answer is obviously yes. The question is "how do we adopt them without losing the craft that makes our code good?" That question does not have a clean answer, and anyone selling you one is lying.

## What we actually do

![The experiment and share cycle -- try new tools, apply to real tasks, analyze results, share findings, adopt what works, repeat](/blogs/images/devdivide/devdivide-experiment-cycle.png)

We do not have an AI tools policy. We have a culture.

The culture is: experiment and share. Someone tries a new tool, a new workflow, a new way of using Claude Code or Cursor. If it works, they share it in our internal sessions. If it fails, they share that too. We learn from each other's experiments instead of waiting for someone to write a mandate.

No top-down requirements. No "everyone must use Copilot by Q3." No banning AI tools either. Just a standing invitation to try things, break things, and tell the team what happened.

This works better than policy for a simple reason: adoption driven by curiosity sticks. Adoption driven by mandate creates resentment. The engineers who adopt AI tools because they saw a colleague ship something faster are more committed than the ones who adopt because their manager told them to.

The sharing sessions are where the real learning happens. Not "look how fast I generated this code." We got past that novelty months ago. More like "here is how I caught a subtle bug using TDD that the AI introduced" or "here is a prompt structure that produces better architecture decisions" or "here is why I stopped using AI for this specific type of task."

The nuance matters. The tools are good for some things and bad for others, and the only way to learn the boundary is to use them enough to find it.

## The divide is not going away

I do not think we will reach consensus. Not at my company, and not in the industry.

Some developers will always prefer hand-written code. They value the craft, the understanding that comes from writing every line, the satisfaction of a codebase they built from scratch. I respect that. It is a legitimate position.

Some developers will embrace AI tools fully. They will generate code faster, review it carefully, use TDD to catch the subtle bugs, and ship more than they could before. I am in this camp. It is also a legitimate position.

The divide is not new. It is the same divide that appeared with every productivity tool, every framework, every abstraction layer in the history of software. IDEs vs text editors. Frameworks vs raw code. Managed services vs self-hosted infrastructure. Every time, the industry split between "this makes us faster" and "this makes us sloppy." Every time, the tools won eventually, but the people who insisted on craft made the tools better.

That tension is productive. The developers who refuse to blindly trust AI output make better code reviewers. The developers who push for AI adoption find the workflows that save time without sacrificing quality. The best teams have both.

**The answer is not "pick a side." The answer is "hold the tension."**

Use the tools. Do not trust them blindly. Write tests that catch what they miss. Review code like the AI is a confident junior who gets the route name wrong one time in twenty. Push for adoption, but keep the craft. Be the ambassador *and* the skeptic. That is the job now.
