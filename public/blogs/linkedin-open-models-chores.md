OpenClaw proved open models can do your chores. They still can't think for you.

Steinberger got hired by OpenAI last week. Built OpenClaw on open models like Kimi K2.5, running on a Raspberry Pi. Millions of installs.

I run something similar. My Telegram bot Clara handles my finances on an open model. Logs expenses, pulls spending summaries, shows my portfolio. Works great.

Then I asked her to set up budget categories with spending limits. Two API calls. She nailed the first one.

Second one failed. And she didn't just get stuck -- she told me it was nginx blocking POST requests. Sounded technical. Sounded right.

Completely wrong. It was a permission error. She made up a diagnosis and sent me debugging the wrong thing.

Give a senior engineer a vague brief and they'll figure it out. Give an intern the same brief and they'll handle the easy parts, then freeze when it gets weird. Not because they're bad. Because nobody gave them a checklist for the hard stuff.

Open models are the intern. Good at following instructions. Lost when the task goes off-script.

"So write better instructions." I did. Detailed tool definitions, error handling, fallback paths. She improved. But she still hallucinated when she hit something my instructions didn't cover. The ceiling moves. It doesn't go away.

Wrote about where that ceiling actually is, and what Steinberger joining OpenAI says about where general agents are headed.

Link in comments.

#OpenClaw #AIAgents #OpenSource #LLM

---
FIRST COMMENT (post immediately after publishing):

Full post: https://weeai.dev/blogs/open-models-can-do-chores-not-think

Goes deeper into the genius vs intern analogy, why benchmarks miss the real gap, and why "can I write a detailed enough SOP for this?" is the actual question when picking between open and frontier models.
