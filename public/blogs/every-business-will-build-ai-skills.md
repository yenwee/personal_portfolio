# Every business will build AI skills. Most will ship garbage.

![Skill-based service hierarchy -- skill at the top as domain expertise, agent orchestrates, model as swappable engine, platform as infrastructure](/blogs/images/skills/skills-featured.png)

My director said something this morning that I cannot stop thinking about.

"Our clients want Skill X from AiExe and Skill Y from AiMod. Can we let them pick and choose?"

AiExe is our AI-powered KYC platform. AiMod is our AI workflow automation platform. Two separate products. The client did not want either product as a whole. They wanted *specific capabilities* from each one, assembled into their own workflow.

That stopped me. That is not a feature request. That is a market forming.

> [!insight] The skill is the product
> Clients are not buying platforms anymore. They are buying capabilities. A transfer pricing firm does not want "an AI analytics suite." They want the skill that automates their benchmarking analysis. The platform is a delivery mechanism. The skill is what they are paying for.

## I started with Tableau and XML

![From tinkering to production skill -- flowchart showing reverse-engineering, breaking things, writing instructions for model mistakes, validation, and testing until it works without watching](/blogs/images/skills/skills-building.png)

My first skill was not for a client. It was for myself.

When Claude Code came out, I wanted to automate parts of my Tableau Desktop workflow. The problem: Tableau's underlying format is XML, and the API to work with it is not public. There is no documented way to programmatically manipulate workbook structure. You have to reverse-engineer the XML schema, figure out which nodes control which visual elements, and write instructions precise enough that an AI agent can modify them without breaking the file.

The early models could not do it. The XML was too complex, the structure too fragile. One wrong node and the workbook corrupts. I tried with Claude Sonnet, with Opus. Close, but not reliable enough for production use.

Then Opus 4.6 came out, and something shifted. The model could finally hold enough context to understand the full XML tree and make targeted modifications without collapsing the structure. I had a working Tableau skill. Not perfect. But reliable enough to save me hours every week.

> [!challenge] The hidden difficulty
> The hardest part of building a skill is not writing the instructions. It is understanding the system well enough to write instructions that work when the model makes a mistake. A Tableau XML file has thousands of nodes. The skill needs to know which ones are safe to modify and which ones will corrupt the file if touched. That knowledge took weeks of tinkering. The skill file itself is a few hundred lines.

## Taking other people's knowledge and making it into skills

After Tableau, I started building AI agents for clients at Infomina AI. Transfer pricing firms. Credit risk teams. Analytics departments that needed repeatable workflows.

The pattern was always the same. The client already had the expertise internally. Transfer pricing consultants who knew the OECD guidelines cold. Credit risk analysts who could assess default probability in their sleep. They had the knowledge. What they did not have was a way to assemble that knowledge into something an AI agent could execute.

I would sit with the domain expert. They would explain their process: "First I pull the comparable data, then I adjust for these five factors, then I run the benchmarking analysis, then I format the report." I would listen, ask questions, and encode their expertise into a structured skill file with defined steps, tool calls, validation checks, and error handling.

The domain expert spent twenty years learning what matters. The skill file captured the decision logic in a format an AI agent could run. Not perfectly. But consistently enough to handle the 80% of cases that follow the pattern, and flag the 20% that need a human.

**The skill is not code. The skill is someone's expertise, assembled.** The businesses already have the knowledge. They just do not know how to package it into something AI can use. That is the gap I keep filling, one client at a time.

I thought I was selling AI agents. I am selling packaged expertise. A transfer pricing firm does not care that I use LangGraph and Claude. They care that the benchmarking analysis takes 20 minutes instead of 4 hours.

## Skills are the new apps

![App Store vs Skill Store -- matrix comparing distribution, payment, sandbox, security, and IP protection](/blogs/images/skills/skills-appstore.png)

I keep coming back to the app analogy because it maps so precisely.

When Apple launched the App Store in 2008, everyone built apps. Most were terrible. A few dominated their categories. And a long tail of niche apps quietly made money solving specific problems for specific audiences. The weather app that 50 million people use and the aviation weather app that 10,000 pilots rely on both exist in the same marketplace. Both make money. They serve completely different needs at completely different scales.

Skills are following the same curve. SkillsMP, a marketplace for AI agent skills, went from 66,000 listings to 351,000 in two months. That is app-store-scale growth. And like the early App Store, most of those 351,000 skills are probably mediocre. A few will dominate. Some niche skills that solve expensive problems for small audiences will quietly generate recurring revenue.

The difference is that apps have infrastructure. The App Store handles distribution, payment, installation, updates, and security. You download an app and it works. It runs in a sandbox. It cannot corrupt your operating system. It goes through review before it reaches users.

Skills have none of that.

> [!warning] The missing infrastructure
> There is no App Store for AI skills. No standard installation process. No sandbox. No payment layer. No security review. If I want to sell my Tableau skill, I would have to share the raw skill file, which exposes my entire methodology. There is no DRM, no hosted execution, no way to sell access without selling the source. The market is building inventory before the store exists.

## Good skills vs bad skills

I have built enough skills to know what separates the ones that last from the ones that get abandoned.

A bad skill is a script pretending to be a skill. It solves one problem for one user in one context, and breaks the moment any of those three things change. No error handling. No validation. Just a bet that the model gets it right every time.

A good skill is something you can hand to a stranger. They read the instructions, plug it into their workflow, and it runs without calling you. It has clear inputs and outputs. It checks its own work. When something goes wrong, it fails gracefully instead of silently producing garbage.

I have built both kinds. The bad ones felt productive when I wrote them. The good ones took three times longer to build and saved ten times more time over the following months.

If your skill only works when you are watching it, it is not a skill. It is a demo.

## Most will ship garbage

![Published skills vs production-ready skills -- 351K published, high failure rate, security risks](/blogs/images/skills/skills-garbage.png)

I am not being cynical. I am reading the data.

Of the 351,000 skills on SkillsMP, how many have been tested in production? How many handle edge cases? How many have error recovery? Someone analyzed 847 real AI agent deployments and found that **76% experience critical failures within 90 days**. Only 18% deliver on their original ROI promises. 43% get abandoned completely after six months.

A security audit of 2,614 MCP servers found that **82% are vulnerable to path traversal** and **67% are vulnerable to code injection**. Thirty CVEs were filed in the first two months of 2026 alone. Anthropic's own mcp-server-git had vulnerabilities that allowed arbitrary file writes.

The market is growing faster than the infrastructure that would make it safe. That is the early App Store without Apple's review process. It is npm without lockfiles. It is Docker Hub without image scanning. The skills are flowing. The quality control is not.

> [!metric] The reliability gap
> 351,000 skills published. 76% of agent deployments fail within 90 days. 82% of MCP servers have known vulnerabilities. The ratio of skills built to skills that work in production is probably somewhere around 10 to 1. Maybe worse.

## MCP is a bridge, not the destination

![MCP importance over time -- from required in 2024 to optimization layer long-term, still critical for smaller models](/blogs/images/skills/skills-mcp-timeline.png)

I have a take on MCP that will probably get me yelled at on Hacker News.

MCP (Model Context Protocol) is valuable right now because it solves a real problem: giving AI agents structured access to external systems. It pre-stores context, defines tool interfaces, and provides a standard way for agents to interact with APIs, databases, and services.

But as models get smarter, they need less scaffolding. Opus 4.6 can read API documentation and figure out how to call endpoints without a pre-built MCP server. It can parse XML without a custom tool definition. It can navigate authentication flows that would have required explicit handling a year ago.

MCP matters enormously for smaller, open-weight models that need structured guidance. It is the SOP for models that cannot reason through novel integrations on their own. For frontier models, the value of pre-built MCP servers is shrinking because the models are increasingly capable of figuring it out themselves.

This does not mean MCP will disappear. It means its role is shifting from "necessary infrastructure" to "performance optimization." A frontier model can call the Stripe API without a Stripe MCP server. But the Stripe MCP server makes it faster, cheaper, and more reliable. That is still valuable. It is just a different value proposition than "the model literally cannot do this without MCP."

> [!insight] The SOP analogy again
> MCP is the SOP for AI agents, and SOPs matter more when the agent is less capable. A senior engineer does not need a checklist to deploy to production. A junior engineer does. MCP is the checklist. As models mature, they need less of it. But even senior engineers appreciate a good checklist when the stakes are high.

## Every business becomes a skill contributor

![AI skill contribution framework -- cycle from using AI tools through workflow identification, expertise encoding, testing, packaging, to distribution](/blogs/images/skills/skills-cycle.png)

Most businesses right now are AI consumers. They prompt ChatGPT, use Copilot, experiment with Claude. They are running on someone else's expertise.

But businesses have something that AI companies do not: twenty years of domain knowledge that no foundation model was trained on. A credit bureau knows how to assess default risk. A law firm knows how to structure a merger agreement. A transfer pricing consultancy knows the OECD guidelines better than any model ever will.

That expertise is locked inside people's heads and internal documentation. Skills are the extraction mechanism. The transfer pricing agent I built does not know transfer pricing. The skill file does. The model just executes the workflow. And because the knowledge lives in the skill, not the model, it survives model upgrades, provider switches, and API changes.

I think the businesses that figure out how to package their expertise as reusable skills will build an asset that compounds. The ones that wait will end up buying skills from their own competitors.

## I would sell my skills. I do not know how.

This is the honest part.

I have built skills for invoicing, CRM management, contract generation, proposal writing, expense tracking, project management, content ideation, visual generation, and evaluation platforms. Some of them save me hours every week. Some of them are good enough that other people could use them with zero modification.

And I have no idea how to sell them.

If I share the skill file, I share the IP. If I host it behind an API, I need infrastructure I have not built. If I list it on a marketplace, there is no standard for pricing, no SLA framework, no way for the buyer to know if the skill actually works before they pay for it.

Apps solved this decades ago. The App Store handles distribution, payment, sandboxing, reviews, updates, and refunds. The developer writes the app and uploads it. The infrastructure handles everything else.

**Skills have no equivalent.** The closest thing is SkillsMP with 351,000 listings and no monetization layer. Or Agent37, which is trying to build hosted execution. Or Gumloop, which just raised $50 million to be the platform layer. But none of them are the App Store yet. Not even close.

So for now, skill builders like me keep building for ourselves and our clients, one custom engagement at a time. It works. It pays. But it does not scale, and I know it.

> [!challenge] The infrastructure gap
> The skill economy has 351,000 skills, $10.9 billion in market size, and 79% enterprise adoption of agentic AI. What it does not have is a way to install a skill and trust that it will work. Until someone builds the App Store for AI skills, the market stays fragmented and the opportunity stays locked.

**The skill is the product. The agent is the delivery mechanism. The model is the engine. And the infrastructure to sell them does not exist yet.**

That last part is either a problem or an opportunity. I have not decided which yet. But I am paying attention.
