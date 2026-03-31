# Medium CDP Skill

Interact with Medium via Chrome DevTools Protocol to check stats, read comments, clap, and reply.

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
Comments indexed #0, #1, #2... These indices are stable across reply/clap commands.

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
Count defaults to 1. Medium allows up to 50 claps per person per comment.

### Debug snapshot
```bash
node scripts/medium-cdp.js snapshot "<url>"
```

## Analytics
```bash
node scripts/medium-analytics.js           # Full report with recommendations
node scripts/medium-analytics.js --json     # Raw JSON
```

### Read Ratio Benchmarks
- Excellent: 40%+ | Good: 30-40% | Average: 20-30% | Low: 10-20% | Concerning: <10%

## Comment Reply Strategy (Research-Backed)

### Vary the tone. Do NOT follow the same template every time.
Different reply styles to rotate:
- **Concede a point**: "You are right that... I probably should have..."
- **Add a specific story**: "We had exactly this happen when..."
- **Light challenge**: "Interesting take. The counterargument would be..."
- **Agree and extend**: "This is the part I keep coming back to..."
- **Short acknowledgment**: "Fair point." (not every comment needs a long reply)

### Clapping Strategy
- Clap for every thoughtful comment (2-5 claps)
- Skip spam comments
- Do NOT clap your own comments

### Writing Guidelines
- No em dashes or double dashes (`--`). Use periods.
- Keep concise (2-5 sentences). Vary length.
- If every reply sounds the same, it reads like a bot.

## Technical Architecture

### Why CDP (not API)
Medium deprecated their publishing API and never offered endpoints for stats, comments, or engagement. CDP via Playwright is the only reliable approach.

### Key Technical Patterns
1. **JS clicks via `page.evaluate`**: Medium's response panel uses a `data-focus-lock-disabled` overlay that blocks Playwright's `.click()`. All button interactions must use `element.click()` inside `page.evaluate()`.

2. **Clap-button-based indexing**: Comments are identified by `svg[aria-label="clap"]` buttons which only exist on other people's comments (not your own replies). This keeps indices stable regardless of how many replies you've posted.

3. **Before/after editor diff**: Reply editors are found by comparing contenteditable elements before and after clicking Reply. The editor with the highest y-value (closest to the comment) is selected.

4. **CDP mouse clicks for claps**: `page.mouse.click(x, y)` at clap button coordinates. Medium blocks synthetic JS mouse events for claps.

5. **`keyboard.type()` for React**: Typing via keyboard events triggers React's state management properly (unlike `execCommand` or `element.textContent`).

### Chrome Profile
Login persists at `/home/ubuntu/.medium-cdp-profile` across restarts.

### Post URLs
Use `https://medium.com/p/<post-id>` format. Post IDs are visible in stats page URLs. Cross-posted URLs tracked in `lib/blogs.json`.
