# The Model Is Not the Bottleneck: How a 32B Model Beat Gemini 3 Pro at Document Extraction

We had the best model. It did not matter.

A client needed structured data extracted from scanned invoices and compliance documents. Hundreds of formats, inconsistent layouts, handwritten annotations in the margins. The kind of problem that frontier vision-language models are supposed to solve out of the box.

The intuitive approach was obvious: pass the document to Gemini 3 Pro, the largest vision-language model available at the time, and let it figure it out. One API call. Simple pipeline. Ship it by Friday.

The result: **30% accuracy**. Not 30% on edge cases -- 30% across the board. Fields transposed, tables misaligned, monetary amounts hallucinated. The model could *describe* what it saw in natural language. It could not *reliably extract* what we needed into structured fields.

> [!challenge] The 30% Problem
> This was not a model quality issue. Gemini 3 Pro is a genuinely capable model. The problem was architectural -- we were asking one inference call to do the work of an entire workflow.

That 30% number forced us to rethink everything. Not which model to use, but how to use any model at all. The answer turned out to be a four-node LangGraph pipeline using Qwen3 32B VL -- a model roughly 30x smaller -- that achieved 100% accuracy on the same document set.

This is the story of how we got there and what it taught me about building production AI systems.

## Why Single-Pass Extraction Fails

When you feed an entire document image to an LLM in one pass, the model receives roughly 15,000 tokens of visual information. Most of it is noise: headers, footers, watermarks, logos, decorative borders, irrelevant tables, page numbers, legal boilerplate.

The signal -- the actual invoice number, the line item amounts, the vendor name in 8pt font -- competes for attention with a company logo that occupies 20% of the page. This is not an intelligence problem. It is an **attention allocation problem**.

The model does not know what matters. It processes everything with roughly equal weight. When you ask it to extract twelve fields simultaneously from a full-page image, it is doing twelve different tasks at once with the same polluted context. Some fields get extracted correctly. Others get transposed, confused with visually adjacent data, or simply hallucinated.

> Think of it this way: imagine handing someone a 50-page contract and asking them to extract the payment terms, the effective date, the governing jurisdiction, the penalty clauses, and the counterparty details -- all at once, in one read, with no ability to flip back. No human works this way. We scan, locate, focus, extract, and cross-check. We do it field by field, section by section. Why do we expect models to do it all in one pass?

The analogy extends further. A human reading a complex document uses a **multi-pass strategy**: first scan the layout to understand what kind of document this is, then identify regions of interest, then extract specific fields with focused attention, then cross-validate (does the line item total match the stated sum?). Each step uses a different cognitive mode. Each step builds on the output of the previous one.

This is not a single inference. It is a directed graph.

## The Insight: The Graph Is the Product

The turning point came when we stopped asking "which model extracts best?" and started asking "how does a skilled human actually read a document?"

A skilled document processor does four things in sequence:

1. **Scans the layout** -- is this a table? A form? Free text? A mix?
2. **Identifies regions** -- where is the header block? The line items? The totals? The signature area?
3. **Extracts fields one at a time** -- with focused attention on a small, relevant region
4. **Cross-validates** -- does the line item total match the sum? Does the date format match the locale?

> [!insight] The Model Is a Component
> The model is not the product. The model is a component inside a workflow graph. The graph is the product. This reframing changes everything about how you architect extraction systems.

Once we made this mental shift, the architecture designed itself. We did not need a bigger model. We needed a better graph -- one that gave a smaller model exactly the right context at exactly the right moment.

## The Architecture: A Four-Node LangGraph Pipeline

Here is the pipeline, node by node.

### Node 1: Structure Scanner

The Structure Scanner receives the full document image. Its job is narrow: classify the layout type (table, form, mixed, free-text) and identify bounding regions. It outputs a structural map -- **not extracted data**.

This node can use a lightweight model because it is answering a classification question, not an extraction question. "Is the top-left quadrant a header block or a table?" is a fundamentally easier task than "extract the invoice number, date, and vendor name from this image."

### Node 2: Region Classifier

The Region Classifier takes the structural map and crops the document into focused regions. Each region is tagged with its semantic role: header block, line items table, signature area, terms section.

This is the critical step. It reduces the downstream token count from **15,000 to 200-500 per region**. Instead of one massive context window full of noise, we now have five clean, focused windows.

### Node 3: Field Extractor (Qwen3 32B VL)

The core extraction node. It receives one focused region at a time -- 200-500 tokens of relevant context instead of 15,000 tokens of noise. It extracts specific fields with a defined schema for each region type.

Five focused calls, each with clean context, outperform one massive call with polluted context. This is the key insight: **context quality beats model size**.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from operator import add

class ExtractionState(TypedDict):
    document_image: bytes
    structure_map: dict
    regions: list[dict]
    extracted_fields: Annotated[list[dict], add]
    validation_result: dict
    confidence_scores: dict
    retry_count: int

def scan_structure(state: ExtractionState) -> dict:
    """Node 1: Classify document layout, identify regions."""
    image = state["document_image"]
    structure = vision_model.classify_layout(image)
    regions = vision_model.identify_regions(image, structure)
    return {"structure_map": structure, "regions": regions}

def classify_regions(state: ExtractionState) -> dict:
    """Node 2: Tag each region with semantic role, crop context."""
    classified = []
    for region in state["regions"]:
        role = classifier.tag_region(region)
        cropped = crop_to_region(state["document_image"], region["bounds"])
        classified.append({**region, "role": role, "focused_context": cropped})
    return {"regions": classified}

def extract_fields(state: ExtractionState) -> dict:
    """Node 3: Qwen3 32B VL on focused 200-500 token regions."""
    fields = []
    for region in state["regions"]:
        if region["role"] in ("line_items", "header", "terms"):
            result = qwen3_32b_vl.extract(
                region["focused_context"],
                expected_fields=FIELD_SCHEMA[region["role"]]
            )
            fields.append(result)
    return {"extracted_fields": fields}

def cross_validate(state: ExtractionState) -> dict:
    """Node 4: Consistency checks with 0.85 confidence threshold."""
    fields = state["extracted_fields"]
    scores = validator.check_consistency(fields)
    low_confidence = {k: v for k, v in scores.items() if v < 0.85}
    return {
        "validation_result": {"pass": len(low_confidence) == 0},
        "confidence_scores": scores,
    }

def should_retry(state: ExtractionState) -> str:
    if state["validation_result"]["pass"]:
        return "complete"
    if state["retry_count"] >= 2:
        return "complete"  # Flag for human review
    return "re_extract"

# Build the graph
graph = StateGraph(ExtractionState)
graph.add_node("scan_structure", scan_structure)
graph.add_node("classify_regions", classify_regions)
graph.add_node("extract_fields", extract_fields)
graph.add_node("cross_validate", cross_validate)

graph.set_entry_point("scan_structure")
graph.add_edge("scan_structure", "classify_regions")
graph.add_edge("classify_regions", "extract_fields")
graph.add_edge("extract_fields", "cross_validate")
graph.add_conditional_edges(
    "cross_validate",
    should_retry,
    {"complete": END, "re_extract": "extract_fields"}
)

extraction_pipeline = graph.compile()
```

### Node 4: Cross-Validator

The Cross-Validator receives all extracted fields and runs consistency checks. Do line items sum to the stated total? Does the date format match the locale? Is the invoice number format consistent with known vendor patterns?

It uses a **0.85 confidence threshold**. Anything below triggers re-extraction of that specific field with the same focused region, giving the model a second chance with identical clean context. After two retries, low-confidence fields are flagged for human review rather than silently accepted.

The conditional edge back to the Field Extractor is what makes this a graph, not a chain. It enables targeted retry without reprocessing the entire document.

## The Numbers: Smaller Model, Better Results, Lower Cost

| Metric | Gemini 3 Pro (single-pass) | Qwen3 32B VL (agentic graph) |
|---|---|---|
| Model size | Frontier (est. 1T+ params) | 32B parameters |
| Accuracy | 30% | 100% |
| Tokens per document | ~15,000 (one call) | ~2,000 (five calls x 400 avg) |
| Inference cost per doc | Higher (single large call) | Lower (multiple small calls) |
| Latency | Single round-trip | Multiple round-trips, parallelizable |
| Failure mode | Silent -- wrong data, high confidence | Explicit -- confidence scores flag uncertainty |
| Debugging | Black box | Node-level traceability |

The accuracy gap is the headline, but the **cost and debuggability** differences are what matter for production.

Five calls at 200-500 tokens each total roughly 2,000 tokens -- an **87% reduction** from the 15,000-token single pass. Fewer tokens means faster inference per call and lower cost per document. At scale (hundreds of invoices per batch), this adds up fast.

> [!insight] Failure Locality
> The most underrated advantage is failure locality. When extraction goes wrong in a single-pass system, you have no idea whether the model misread the layout, confused two tables, or hallucinated a field. In the graph, you inspect each node's output independently. The Cross-Validator tells you exactly which field failed and at what confidence level.

This debuggability transformed our error resolution workflow. Instead of re-running the entire extraction and hoping for a different result, we could trace the failure to a specific node, inspect its input and output, and fix the root cause. Production support tickets went from "extraction is wrong" to "the Region Classifier misclassified the footer as a line items table on invoices from Vendor X."

## The Trade-Offs Nobody Talks About

Let me be honest about what this architecture costs you.

### Debugging Surface Area

A single API call has one failure mode: bad output. A four-node graph has at least twelve failure points. Four nodes that can error. Four state transitions that can corrupt data. Four output schemas that can be malformed. You need **structured logging at every edge**, not just at the final output.

We built a trace viewer that captures the full state object at every node boundary. Without it, debugging the graph would be harder than debugging the single-pass approach it replaced.

### Latency

Sequential nodes add round-trips. The Structure Scanner must complete before the Region Classifier can start. For real-time use cases (user uploads a document and expects results in under a second), this matters. For batch processing -- our case, overnight extraction of hundreds of invoices -- it does not.

Know your latency budget before choosing the architecture. If you need sub-second responses, you might need to parallelize aggressively or accept a simpler pipeline with a more capable model.

### Maintenance Burden

The graph is code. Code needs tests, documentation, and versioning. When the document format changes (new vendor, new invoice layout), you are updating node logic, not swapping a model. This is both the strength and the cost -- you have control, but you also have responsibility.

We maintain a test suite of 50 representative documents across 12 vendor templates. Every change to node logic runs against this suite before deployment. This is more infrastructure than a single API call requires. It is also why we catch regressions before they reach production.

### When Single-Pass Is Fine

> [!note] Know When to Keep It Simple
> If your documents are uniform -- same template, same fields, same layout every time -- single-pass extraction with a frontier model may be perfectly adequate. The graph architecture earns its complexity when document variability is high and accuracy requirements are non-negotiable.

Not every problem needs a four-node pipeline. A standardized form with predictable fields in predictable locations can be handled by a single well-prompted call to a capable model. The graph is for the messy real world where documents come in hundreds of formats and "close enough" is not acceptable.

## The Broader Lesson: Architect the Workflow

Every production AI system is a workflow, not a single inference call. The question is whether you design that workflow explicitly -- as a graph with defined nodes, edges, and state -- or leave it implicit, stuffed into one massive prompt and hoping the model figures it out.

The AI industry's fixation on model benchmarks obscures the real engineering question: **given a fixed accuracy requirement, what is the simplest graph that meets it?** Sometimes the answer is one node with a frontier model. Often, the answer is multiple nodes with smaller, cheaper models doing focused work.

This is not a new insight. Software engineering has always been about decomposing complex problems into manageable components with well-defined interfaces. The only thing that changed is that one of those components is now a language model. The engineering principles are the same.

The model is a component. The graph is the product. Design accordingly.

> The next time someone tells you they need a bigger model, ask them if they have tried a better graph.
