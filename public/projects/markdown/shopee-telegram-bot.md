## Everything I tried before the thing that worked

Direct requests: blocked. Headless browser: fingerprinted. Session reuse: expired within minutes. Shopee fingerprints automation aggressively -- valid tokens rotate constantly, internal APIs are undocumented, and **anything that does not look like a real logged-in browser gets rejected outright.**

Each failure narrowed the search. Raw HTTP clients lacked the cookie chain Shopee validates on every call. Headless Chrome tripped fingerprinting within seconds. Reusing exported sessions broke the moment token rotation invalidated them. I could not fake legitimacy. I had to borrow it.

## Borrowing legitimacy from a real browser

Chrome runs with `--remote-debugging-port=9222`. The bot attaches via pychrome and registers a `Network.requestWillBeSent` listener before navigation. When Shopee's frontend fires its internal `api/v4/` calls, the listener intercepts each one -- capturing the full URL, headers, and session cookies.

Replay happens via subprocess curl. **The anti-bot checks pass because the session genuinely belongs to a running Chrome instance** -- Shopee sees real credentials, because they are. The response comes back as structured JSON, ready to parse without touching the DOM.

Shortened `shp.ee` URLs added a wrinkle: those pages lazy-load product data behind scroll events. The bot injects synthetic scrolls so the CDP listener captures the relevant API calls. Once solved, every product URL worked uniformly.

> [!insight] Why Replay Beats Scraping
> Replaying API calls returns structured JSON directly; parsing is trivial and resistant to frontend layout changes.

## Why the bot survived three Shopee frontend updates

The bot is stateless between scraping runs. Each cycle attaches to Chrome, captures, replays, and parses fresh JSON. **It never depends on CSS selectors, page layout, or DOM structure** -- only on the shape of Shopee's internal API responses, which change far less frequently than the frontend.

Six regions -- MY, SG, TH, ID, VN, PH -- work by switching base URLs and API path variants. The CDP capture logic is identical everywhere. python-telegram-bot v21.3 handles the interface layer, with a JobQueue scheduler driving periodic monitoring without blocking command handling. Restocks and delistings trigger triple alert escalation because missing a single restock notification defeats the entire purpose of the tool.

> [!decision] Flat File Over Database
> For a single-user tool, JSON persistence eliminates an entire dependency class; state footprint is small and concurrent writes don't exist.

State lives in a flat `state.json`; configuration changes persist atomically to `config.json`. No database, no migrations -- just files I can read and debug by hand.

## What I Learned

CDP capture-and-replay was not clever engineering. It was the last option standing after everything else failed. **Working with a platform's own mechanisms beats evasion sophistication every time.** The bot outlasted three frontend redesigns because it targets the layer Shopee cannot change without breaking its own app.

It also taught me where the complexity boundary sits for personal tools. One Chrome instance, a flat JSON file, and a Telegram interface stayed maintainable where the over-engineered alternatives I initially reached for never would have.
