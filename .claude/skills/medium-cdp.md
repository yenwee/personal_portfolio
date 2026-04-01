# Medium CDP Skill

Interact with Medium via Chrome DevTools Protocol to check stats, read comments, clap, reply, and engage with other writers' posts.

## Prerequisites

Chrome must be running with remote debugging enabled and logged into Medium:

```bash
DISPLAY=:1 nohup /home/ubuntu/.cache/ms-playwright/chromium-1208/chrome-linux/chrome \
  --remote-debugging-port=9222 --no-first-run --no-default-browser-check \
  --user-data-dir=/home/ubuntu/.medium-cdp-profile \
  --no-sandbox --disable-setuid-sandbox --disable-gpu \
  --window-size=1280,800 "https://medium.com/m/signin" \
  > /tmp/chrome-cdp.log 2>&1 &
```

User logs in via VNC (display :1), then commands are available.

## Commands

### Get post statistics
```bash
node scripts/medium-cdp.js stats
```
Columns: Story | Presentations (impressions) | Views | Reads

### Get comments on a post
```bash
node scripts/medium-cdp.js comments "https://medium.com/p/<post-id>"
```
Comments indexed #0, #1, #2... Indices are stable across reply/clap commands (uses clap-button indexing to skip author's own replies).

### Reply to a specific comment
```bash
node scripts/medium-cdp.js reply "https://medium.com/p/<post-id>" <comment-index> "reply text"
```

### Post a top-level response
```bash
node scripts/medium-cdp.js respond "https://medium.com/p/<post-id>" "response text"
```

### Clap for a comment or post
```bash
node scripts/medium-cdp.js clap "https://medium.com/p/<post-id>" <comment-index> [count]
node scripts/medium-cdp.js clap "https://medium.com/p/<post-id>"     # clap for post itself
```
Count defaults to 1. Medium allows up to 50 claps per person per comment/post.

### Debug snapshot
```bash
node scripts/medium-cdp.js snapshot "<url>"
```

## Engaging With Other Writers' Posts

The tool also works for commenting and clapping on other people's articles. This is a collaborative workflow, not automated spam.

### Workflow
1. User provides a Medium article URL
2. Claude reads the article via CDP, summarizes key points
3. Claude drafts 2-3 comment options in the user's voice (using writing defaults from memory)
4. User picks one or revises
5. Claude posts the comment and claps (50x for articles you genuinely like)

### How to post (ad-hoc script, not via medium-cdp.js yet)
For other people's articles, use an inline script that:
1. Navigates to the article
2. Full-scrolls to load all content
3. Opens the responses panel via speech bubble SVG (path data includes "18.006")
4. Clicks the editor via `page.mouse.click()` (CDP-level, not JS)
5. Types via `page.keyboard.type()` (React-compatible)
6. Clicks Respond via `page.mouse.click()` on button coordinates
7. Claps by finding `svg[aria-label="clap"]` on the main page (x < 700), scrolling into view, then 50x `page.mouse.click()`

### What works
- Commenting (top-level responses on other people's posts)
- Clapping (50x via CDP mouse clicks)
- Replying to comments on your own posts

### What does NOT work yet
- Highlighting (text selection + popup menu is a different UI interaction)
- Clapping on some posts fails when panel doesn't load clap buttons (timing/layout issue)

### Guidelines
- Human in the loop. User approves every comment before posting.
- Volume stays human-scale: 5-10 interactions per session max.
- Comments must be genuine and specific to the article content.
- Never generic ("great article!"). Always reference a specific point.

## Analytics
```bash
node scripts/medium-analytics.js           # Full report with recommendations
node scripts/medium-analytics.js --json     # Raw JSON
```

### Read Ratio Benchmarks
- Excellent: 40%+ | Good: 30-40% | Average: 20-30% | Low: 10-20% | Concerning: <10%

### Key Insight From Our Analysis
The real bottleneck is **discovery (impressions to views CTR), not content quality**. Read ratios are 40-74% (elite). The fix is better titles that create curiosity gaps, not better writing.

### Title CTR Rules
- High CTR (17-22%): Titles with specific tension or surprise. "Distillation Is Not the Crime. Fraud Is."
- Low CTR (3-8%): Titles that give away the conclusion. "Open Models Can Do Your Chores. They Still Cannot Think for You."
- Rule: If the reader knows the conclusion from the headline alone, rewrite it.

## Comment Reply Strategy

### Vary the tone. Not every reply follows the same pattern.
- **Concede a point**: "You are right that... I probably should have..."
- **Add a specific story**: "We had exactly this happen when..."
- **Light challenge**: "Interesting take. The counterargument would be..."
- **Short acknowledgment**: "Fair point." or a one-liner with humor
- **Genuine compliment**: Quote their line and say why it's better than your own framing

### Clapping Strategy
- 50 claps for articles you genuinely like (max per person)
- 2-5 claps for comments on your own posts
- Skip spam comments

### Writing Guidelines
- No em dashes or double dashes. Use periods.
- Keep concise (2-5 sentences). Vary length.
- If every reply sounds the same, it reads like a bot.
- Run through humanizer skill before posting if unsure.

## Technical Architecture

### Why CDP (not API)
Medium deprecated their publishing API. No endpoints for stats, comments, or engagement. CDP via Playwright is the only approach.

### Key Technical Patterns
1. **JS clicks via `page.evaluate`**: Medium's response panel uses a `data-focus-lock-disabled` overlay. Button interactions must use `element.click()` inside `page.evaluate()`.

2. **CDP mouse clicks for claps + editor focus**: `page.mouse.click(x, y)` for claps (Medium blocks synthetic JS events) and for focusing contenteditable editors.

3. **Clap-button-based indexing**: Comments identified by `svg[aria-label="clap"]` (only on other people's comments). Keeps indices stable regardless of author replies.

4. **Scroll into view before clapping**: Clap buttons must be in viewport for CDP mouse clicks to register. Always `scrollIntoView()` first, then get coordinates.

5. **Before/after editor diff for replies**: Reply editors found by comparing contenteditable elements before/after clicking Reply. Pick the one with **highest y** (closest to comment).

6. **Speech bubble SVG for panel opening**: Some publications don't have "See all responses" text. Match by SVG path data containing "18.006".

7. **`keyboard.type()` for React**: Keyboard events trigger React state. `execCommand` does not reliably.

### Chrome Profile
Login persists at `/home/ubuntu/.medium-cdp-profile` across restarts.

### Post URLs
`https://medium.com/p/<post-id>` format redirects to actual post. Cross-posted URLs in `lib/blogs.json`.
