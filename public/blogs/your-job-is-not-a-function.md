# Your Job Is Not a Function

*A 1989 proof says AI can approximate any input-output mapping. If that describes your entire job, worry. If it does not, you just got a 10x multiplier.*

---

If your entire job is turning inputs into outputs, a neural network can do it cheaper. That is not opinion. It is a mathematical proof from 1989.

George Cybenko published the Universal Approximation Theorem that year. The paper showed that a neural network with a single hidden layer and sufficient width can approximate any continuous function to arbitrary accuracy. The math is elegant. The implication is blunt: if a task can be described as a mapping from inputs to outputs through a learnable pattern, a neural network can learn it.

Jensen Huang understood this earlier than most. At the NVIDIA AI Summit in India, he described what his company had built: "A universal function approximator. A machine learning system, something that learns from examples." He was not being poetic. He was being literal. A GPU running a neural network can learn any input-output relationship you can define, given enough data, enough compute, and enough time.

(The theorem said nothing about which relationships are worth learning.)

This post covers three things: what the theorem actually proves, why the gap between task and purpose is the only career question that matters in the age of AI, and what the honest version of "AI will not take your job" sounds like when you stop being polite about it.

## The 57% that is already spoken for

McKinsey studied 800 occupations and 6,800 skills across the US workforce. The headline finding: 57% of work hours are automatable at the task level. That is not a prediction. It is a description of tasks that already have the mathematical structure a neural network can learn. Inputs mapped to outputs through patterns in historical data.

Resume keyword screening. First-pass document review. Expense categorization. Appointment scheduling. Data entry. Code generation from a specification. Each of these is a function. Defined inputs, expected outputs, learnable patterns connecting the two.

**The number that matters more is the other one: fewer than 4% of entire occupations are fully replaceable.** Not 57%. Four.

The gap between 57% and 4% is enormous, and it has a name. It is the part of every job where someone decides which tasks matter in the first place. Where someone interprets the output and decides what to do with it. Where someone defines what "good" looks like in a context that has never existed before. Where someone kills a project because the numbers work but the direction is wrong.

That gap is purpose. And no theorem covers it.

## What the theorem cannot see

The Universal Approximation Theorem proves existence. Given any continuous function and any margin of error you choose, there exists a neural network that can get within that margin. It is a powerful guarantee. It is also a narrow one.

The theorem says nothing about how to choose which function to approximate. It says nothing about whether the function you picked is the right one for your business, your users, or your market. It says nothing about what to do when the function changes because the world changed overnight.

Jensen Huang, on Joe Rogan podcast, put it differently: AI is "just math." He meant it as a defense against the sentience doomsday crowd, but the phrase works just as well as a job description. AI is just math. It maps patterns. It does not originate direction.

Sir Andrew Likierman at London Business School framed the same idea from the business side: "The more powerful AI becomes, the more we need human judgment." Harvard research on AI-assisted innovation reached the same conclusion independently: AI cannot reliably distinguish good ideas from mediocre ones or guide long-term strategy on its own.

Three different sources. Three different fields. Same finding: **AI approximates functions. It does not approximate purpose.**

## What this looks like in production

I want to be concrete about this because the abstract version is too easy to nod along with and forget.

We threw the most capable vision-language model available at a document extraction problem. Hundreds of scanned invoices, inconsistent layouts, handwritten annotations. Frontier model, single API call, the approach everyone reaches for first. Under 40% accuracy. Not on edge cases. Across the board.

The fix was not a bigger model. It was not more data. It was not fine-tuning. It was a human deciding to reframe the problem entirely. Stop asking "which model extracts best?" and start asking "how does a skilled human actually read a complex document?" That reframe led to an adaptive workflow with a model one-tenth the size. Over 90% accuracy on the same documents.

The model was the function approximator. It did exactly what function approximators do. It mapped visual inputs to text outputs. The thing that took accuracy from 40% to 90% was not a better approximation. It was an architectural judgment call about how to decompose the problem. That judgment call is not inside any theorem.

Credit risk is the same pattern. AI scores applications, maps borrower data to default probabilities. That is a function, and neural networks do it well. But the actuary who decides the institution's risk appetite, who sets the model governance framework, who kills a model because its ROI does not justify the infrastructure. That person is not performing a function. They are defining which functions the institution should care about.

The pattern holds in hiring. AI screens resumes by matching keywords to job descriptions. Input to output. Function. But the recruiter who decides what "culture fit" actually means for this team, who recognizes that the best candidate's resume does not match the spec because the spec was wrong. That is judgment the screening function cannot reach.

Software engineering, same story. AI generates code from prompts. But the engineer who decides what to build, why it matters, and what architectural trade-offs the team can live with is making purpose-level decisions that no code generator can approximate, because the answer depends on context that does not exist in the training data.

In every case, the function layer got faster and cheaper. The purpose layer got more valuable. The gap between them widened, not narrowed.

## The sorting function nobody wants to hear

Most of the "AI will not take your job" discourse is reassurance. It exists so knowledge workers can read it, feel briefly comforted, and go back to doing exactly what they were doing. The problem is that reassurance is not a strategy.

Here is the honest version: AI will not take your job if your job has purpose.

If your work involves defining direction, interpreting ambiguous situations, making judgment calls where the right answer depends on context that changes, choosing which problems are worth solving, then AI just handed you the most powerful set of tools ever built for executing on those decisions. Your bottleneck was never the doing. It was the deciding. Now the doing is nearly free. That is the 10x multiplier.

But if your entire job is a function (defined inputs, expected outputs, learnable pattern connecting the two, no judgment layer on top), then the theorem already has your number. Not because AI is coming for you. Because the mathematical description of your job already exists, and someone will train a network on it if they have not already.

**This is not a threat. It is a sorting function.** And being honest about which side of the sort you fall on is more useful than any amount of reassurance.

## The part that should actually worry you

There is a real problem here, and it is not the one most people are discussing.

Entry-level workers learn judgment by doing tasks. A junior analyst builds intuition about risk by processing hundreds of loan applications. A junior developer builds architectural judgment by writing thousands of lines of straightforward code. A junior recruiter develops an eye for talent by screening thousands of resumes.

If AI handles the task layer, what is the apprenticeship path for the purpose layer?

This is not a hypothetical concern. Harvard research on AI augmentation found that AI "may substitute for entry-level workers but augment experienced workers." The people who already have judgment get a multiplier. The people who are still building judgment lose the reps they need.

I do not have a clean answer for this. The problem is real and underexplored. But I know what the wrong answer looks like: pretending the task layer is safe so we do not have to think about what happens when it is not.

## What the theorem omits

The Universal Approximation Theorem is one of the most powerful results in machine learning. It guarantees that neural networks can learn any function. And the thing it omits -- by mathematical necessity, not by oversight -- is the question of which functions matter.

Jensen Huang built his career on that omission. In 1995, NVIDIA was 30 days from bankruptcy. The Sega contract had failed. The technology did not work. Huang flew to Japan and told Sega CEO the truth: the product they promised could not be delivered. Then he asked for the remaining $5 million anyway, because without it the company would cease to exist. Sega CEO agreed.

That decision -- to tell the truth when lying was easier, to ask for money when the leverage was zero, to bet the company on integrity when the math said fold -- is not a function. It has no training data. No input-output mapping covers it. It is purpose, operating in a space where the theorem has nothing to say.

Huang has used the phrase "30 days from going out of business" for 33 years. Every morning. Every decision. That is not an input-output mapping. That is a human choosing what matters under uncertainty, day after day, with no guarantee the choice is correct.

Your job is not a function. Not if you are doing it right. The parts of it that are functions just got automated. The part that remains -- the part that was always the point -- is more valuable than it has ever been.

The theorem describes what AI can do. It also describes, by omission, what it cannot.
