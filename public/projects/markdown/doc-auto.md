## Why 200-page documents were costing analysts three days each

A senior analyst opens a 200-page transfer pricing report on Monday morning. By Wednesday afternoon, she has extracted forty data points, cross-referenced three appendices she almost missed, and flagged two contradicting figures on pages 47 and 183. **That workflow -- plan what to extract, retrieve evidence, flip back to verify, write it up -- became the blueprint for every pipeline I built.**

The problem was never "can AI read a PDF." It was that analysis requires judgment: knowing when evidence is sufficient, when to switch search strategies, and when to stop trusting text and look at the chart. I designed a dual-mode adaptive RAG system where an AUTO router selects PASSIVE single-pass retrieval for simple queries or AGENTIC self-reflective loops for dense analysis. Users never choose a mode.

## Teaching an AI to flip back and check its work

The extraction v2 pipeline follows six stages: plan, retrieve, evaluate-and-flip, generate, verify, finalize. After initial retrieval, the evaluate-and-flip node examines coverage gaps against the extraction schema and **switches between dense semantic search and sparse keyword retrieval depending on what is missing.** A concept not found semantically might surface through an exact term buried in a footnote.

The Q&A pipeline adds a reflect node that critiques answers against source passages, catching hallucinations before they reach the user. The comparison pipeline normalizes terminology across documents before diffing -- essential when two reports name the same entity differently. A `ConfigurableAIClient` with database-driven provider selection lets customers control which APIs touch their data, swappable via the admin UI without code changes.

> [!decision] Per-Field Confidence Scores
> Document-level confidence hides which fields are uncertain. **Per-field scores with source page citations let analysts target review to low-confidence extractions only**, turning a full re-read into a five-minute spot check.

## When the AI can't read the chart

Financial documents contain charts, scanned attachments, and tabular images that text parsers silently skip. I integrated VLM invocation on demand -- the pipeline routes visual content through a vision model only when needed. For aged scans with faded ink, I apply **CLAHE preprocessing before passing images to the VLM**, improving accuracy on degraded inputs without hurting clean ones.

> [!insight] Multilingual Embeddings From Day One
> I started with `multilingual-e5-large` at 1024 dimensions rather than a cheaper English-only model. **When non-English financial filings appeared three months in, retrieval worked immediately** -- no costly re-embedding of an entire production corpus.

## What I Learned

- **What surprised me**: the evaluate-and-flip node had more impact on extraction quality than any prompt engineering. The right retrieval strategy per field mattered more than the right words to ask the LLM.
- **What I would do differently**: build the comparison pipeline's terminology normalization as a shared service from the start, rather than duplicating alignment logic before refactoring.
- **What stuck with me**: enterprise AI is not about model capability. It is about giving analysts transparent evidence trails so they trust the output enough to act on it.
