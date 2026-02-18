## Every data question bottlenecked through one engineer

I watched the same pattern at three different companies: an analyst types a question into Slack, a data engineer translates it into SQL, pastes a screenshot back, and the follow-up restarts the cycle. **The bottleneck was never the data -- it was the translation layer between intent and query.**

The Decision Agent sits at the center of this. It routes natural language questions to sub-agents for SQL generation, charting, or explanation synthesis. Conversation history persists to PostgreSQL, so follow-ups carry context instead of starting from scratch. What took a two-day Slack thread now resolves in seconds.

> [!decision] Separate LLM Instance Per Agent
> Each of the 18 LLM instances has its own model, temperature, and system prompt tuned to its task -- the Fine Binning Agent needs precision while the Explanation Agent needs creativity, and a shared config would compromise both.

## Fifteen agents that actually ship

The temptation with LLM agents is to build a clever demo and call it done. I built these to be **load-bearing product components**, not assistants bolted onto the side. The Code Agent is a supervisor-worker pair that authors, edits, compiles, previews, and deploys dbt models entirely within a Monaco editor -- no context-switching, no copy-pasting between tools.

The ML agents automate judgment calls that previously required a statistician: optimal binning for credit scorecards, model recommendation, monitoring thresholds, and feature analysis. I designed each agent's state machine in LangGraph with explicit, debuggable transitions so when something fails I can trace the exact decision path.

> [!insight] Multi-Tenancy From Day One
> I scoped RBAC, JWT authentication, and a full audit trail into the initial architecture because sensitive financial data left zero tolerance for bolting on access control after the fact.

## A DAG engine built for humans, not Airflow

The Pipeline Builder converts natural language descriptions into structured DAG JSON, rendered as editable visual pipelines on a ReactFlow canvas. But the interesting decision was underneath: **I built a custom execution engine with 13 node types instead of wrapping Airflow operators.**

Airflow assumes you think in generic task dependencies. Data teams think in datasources, transforms, analyses, and outputs -- so the engine matches their mental model. Human-in-the-loop approval gates are first-class primitives, critical where model promotion requires explicit sign-off, not a rubber-stamp webhook.

## What I Learned

- **What surprised me**: the hardest problem was not the agents but the conversation persistence layer. Knowing when to carry state forward and when to reset required more iteration than any single agent's prompt design.
- **What I would do differently**: invest earlier in agent observability. I built tracing after the fifth agent but should have built it before the second. Debugging distributed LLM calls without structured traces is like reading server logs through a keyhole.
- **What stuck with me**: building for self-serve is fundamentally different from building for power users. Every feature obvious to me needed a guided path for the analyst who would use it daily.
