OpenClaw proved open models can do your chores. They still cannot think for you.

Last week Peter Steinberger got hired by OpenAI. He built OpenClaw on Kimi 2.5, running on a Raspberry Pi. Millions use it. The open-source AI agent story of 2026.

I run a similar setup. My Telegram bot Clara handles my finances on an open model -- expense tracking, budget queries, investment portfolio. She is fast, cheap, and reliable on the simple stuff.

Then I asked her to set up three budget categories with spending limits. Two sequential API calls. She nailed step one. Step two failed.

And here is the part nobody talks about: she did not just get stuck. She told me the problem was nginx blocking POST requests. Sounded technical. Sounded right. It was completely wrong. The actual issue was an API permission error. She hallucinated a diagnosis and delivered it with confidence.

That gap -- between doing chores and doing thinking -- is the thing the "open models are good enough" camp keeps glossing over. Benchmarks show a three-month lag between open and proprietary models. On standardized tasks, sure. On the weird edge cases where the model has to actually reason? The gap feels a lot wider.

I wrote about this in detail: the genius vs intern analogy, why architecture is the SOP that compensates for what the model cannot reason through, and what Steinberger's OpenAI hire actually tells us about where general agents are headed.

Full post: https://weeai.dev/blogs/open-models-can-do-chores-not-think
