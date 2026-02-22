OpenClaw proved open models can do your chores. They still cannot think for you.

Peter Steinberger got hired by OpenAI last week. He built OpenClaw on Kimi 2.5. Running on a Raspberry Pi. Millions use it.

I run a similar setup.

My Telegram bot Clara handles my finances on an open model. Expense tracking, budget queries, investment portfolio. Fast, cheap, reliable on simple stuff.

Then I asked her to set up three budget categories with spending limits.

She nailed step one. Step two failed.

She did not just get stuck. She told me the problem was nginx blocking POST requests. Sounded technical. Sounded right.

It was completely wrong.

The actual issue was an API permission error. She hallucinated a confident diagnosis and pointed me in the wrong direction.

Here is how I think about it:

Give a senior engineer a vague brief and they figure it out. Read the docs, try alternatives, make judgment calls. Hand them autonomy and they use it.

Give an intern the same brief and they nail the straightforward parts. Then they get stuck. Not because they are bad. Because the task exceeded what they can reason through alone.

A genius does not need an SOP. An intern absolutely does.

Open models are the intern. Genuinely good at following instructions. But when the task goes off-script, they need architecture to compensate for the reasoning they cannot do on their own.

"Just write a better SOP then." I tried. Detailed tool definitions, error handling rules, fallback paths. Clara got better. The ceiling moved. But it did not disappear. She still hallucinated a diagnosis when she hit something the instructions did not cover. You cannot SOP your way out of a reasoning gap.

I wrote about where that ceiling is, what Steinberger joining OpenAI tells us about general agents, and why "can I write a detailed enough SOP?" is the real question for open vs frontier models.

Full breakdown in the comments.

#OpenClaw #AIAgents #OpenSource #LLM

---
FIRST COMMENT (post immediately after publishing):

Full post here: https://weeai.dev/blogs/open-models-can-do-chores-not-think

The post covers the genius vs intern analogy in detail, benchmarks vs real-world reasoning, and why Steinberger's hire is less about open-source validation and more about what general agents still need.
