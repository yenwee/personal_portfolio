#!/usr/bin/env node

/**
 * Medium CDP Tool
 *
 * Connects to a running Chrome instance via Chrome DevTools Protocol
 * to fetch Medium stats, read comments, clap, and post replies.
 *
 * Prerequisites:
 *   1. Start Chrome with remote debugging:
 *      DISPLAY=:1 /path/to/chrome --remote-debugging-port=9222 --no-sandbox ...
 *   2. Log in to Medium in that browser
 *
 * Usage:
 *   node scripts/medium-cdp.js stats
 *   node scripts/medium-cdp.js comments <post-url>
 *   node scripts/medium-cdp.js respond <post-url> "response text"
 *   node scripts/medium-cdp.js reply <post-url> <comment-index> "reply text"
 *   node scripts/medium-cdp.js clap <post-url> [comment-index]
 *   node scripts/medium-cdp.js snapshot <url>
 *
 * Environment:
 *   CDP_URL  - Chrome DevTools URL (default: http://localhost:9222)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CDP_URL = process.env.CDP_URL || 'http://localhost:9222';

// ─── Playwright Loader ───────────────────────────────────────

function loadPlaywright() {
  try {
    const playwrightPath = execSync(
      'find /home/ubuntu/.npm/_npx -path "*/playwright/index.js" -not -path "*/next/*" 2>/dev/null | head -1'
    ).toString().trim();
    if (!playwrightPath) throw new Error('not found');
    return require(playwrightPath);
  } catch {
    console.error('Playwright not found. Install with: npx playwright install chromium');
    process.exit(1);
  }
}

// ─── CDP Connection ──────────────────────────────────────────

async function connect() {
  const { chromium } = loadPlaywright();
  try {
    const browser = await chromium.connectOverCDP(CDP_URL);
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      console.error('No browser contexts found. Is Chrome running with a profile?');
      process.exit(1);
    }
    return { browser, context: contexts[0] };
  } catch (err) {
    console.error(`Failed to connect to Chrome at ${CDP_URL}`);
    console.error('Make sure Chrome is running with: --remote-debugging-port=9222');
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

// ─── Shared: Open Responses Panel ────────────────────────────

async function openResponsesPanel(page, postUrl) {
  console.log(`Navigating to: ${postUrl}`);
  await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Scroll to bottom to find responses section
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(2000);

  // Click responses button via JS to bypass overlay issues
  // Tries multiple strategies since Medium layouts vary by publication
  const panelOpened = await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button'));

    // Strategy 1: "See all responses" / "Show all responses" text
    let btn = allBtns.find(b => {
      const t = b.textContent.trim().toLowerCase();
      return (t.includes('see all') || t.includes('show all')) && t.includes('response')
        && b.getBoundingClientRect().width > 0;
    });

    // Strategy 2: Button with "N responses" text
    if (!btn) {
      btn = allBtns.find(b => {
        const t = b.textContent.trim();
        return /\d+\s*response/i.test(t) && b.getBoundingClientRect().width > 0;
      });
    }

    // Strategy 3: Speech bubble SVG button (matches by SVG path data)
    if (!btn) {
      btn = allBtns.find(b => {
        const svg = b.querySelector('svg');
        if (!svg || b.getBoundingClientRect().width === 0) return false;
        const paths = svg.querySelectorAll('path');
        return Array.from(paths).some(p => (p.getAttribute('d') || '').includes('18.006'));
      });
    }

    if (btn) {
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      btn.click();
      return true;
    }
    return false;
  });

  if (panelOpened) console.log('Opening responses panel...');
  await page.waitForTimeout(5000);
  return panelOpened;
}

// ─── Stats ───────────────────────────────────────────────────

async function getStats(context) {
  const page = await context.newPage();
  try {
    console.log('Navigating to Medium stats...');
    await page.goto('https://medium.com/me/stats', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const stats = await page.evaluate(() => {
      const results = [];
      // Medium stats columns: Story | Presentations | Views | Reads
      const tableRows = document.querySelectorAll('table tbody tr, table tr');
      if (tableRows.length > 0) {
        for (const row of tableRows) {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            const titleEl = cells[0]?.querySelector('a') || cells[0];
            results.push({
              title: titleEl?.textContent?.trim() || '',
              url: titleEl?.href || '',
              presentations: cells[1]?.textContent?.trim() || '',
              views: cells[2]?.textContent?.trim() || '',
              reads: cells[3]?.textContent?.trim() || '',
            });
          }
        }
        if (results.length > 0) return { strategy: 'table', posts: results };
      }
      const bodyText = document.body?.innerText?.substring(0, 3000) || '';
      return { strategy: 'fallback', posts: [], pagePreview: bodyText };
    });

    if (stats.posts.length > 0) {
      console.log(`\nMedium Stats (${stats.posts.length} posts found)`);
      console.log('─'.repeat(90));
      console.log(
        '#'.padEnd(4) + 'Title'.padEnd(44) +
        'Impress.'.padStart(10) + 'Views'.padStart(10) + 'Reads'.padStart(10)
      );
      console.log('─'.repeat(90));
      stats.posts.forEach((post, i) => {
        const title = post.title.length > 41 ? post.title.substring(0, 41) + '...' : post.title;
        console.log(
          String(i + 1).padEnd(4) + title.padEnd(44) +
          (post.presentations || '-').padStart(10) +
          (post.views || '-').padStart(10) +
          (post.reads || '-').padStart(10)
        );
      });
      console.log('─'.repeat(90));
    } else {
      console.log('\nCould not extract stats.');
      if (stats.pagePreview) console.log(stats.pagePreview.substring(0, 1000));
    }
    return stats;
  } finally {
    await page.close();
  }
}

// ─── Comments (clap-button indexed for consistency with reply/clap) ──

async function getComments(context, postUrl) {
  const page = await context.newPage();
  try {
    await openResponsesPanel(page, postUrl);

    // Expand all truncated comments and reply threads
    for (let pass = 0; pass < 3; pass++) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        btns.filter(b => {
          const t = b.textContent.trim();
          return (t === 'more' || /^\d+\s*repl/i.test(t) || /show.*repl/i.test(t))
            && b.getBoundingClientRect().width > 0;
        }).forEach(b => b.click());
      });
      await page.waitForTimeout(2000);
    }

    // Use clap buttons as anchors (same indexing as reply/clap commands)
    // Then extract surrounding text for each clap-indexed comment
    const comments = await page.evaluate(() => {
      const panel = document.querySelector('[data-focus-lock-disabled]') || document;

      // Get clap buttons sorted by y (these define the replyable comments)
      const clapBtns = Array.from(panel.querySelectorAll('svg[aria-label="clap"]'))
        .map(svg => svg.closest('button'))
        .filter(btn => btn && btn.getBoundingClientRect().width > 0)
        .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y);

      // Get all Reply buttons sorted by y
      const replyBtns = Array.from(panel.querySelectorAll('button'))
        .filter(b => b.textContent.trim() === 'Reply' && b.getBoundingClientRect().width > 0)
        .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y);

      // For each clap button, find its comment block by walking up the DOM
      const results = [];
      for (let i = 0; i < clapBtns.length; i++) {
        const clapBtn = clapBtns[i];
        const clapY = clapBtn.getBoundingClientRect().y;

        // Walk up to find the comment container
        let container = clapBtn;
        for (let j = 0; j < 8; j++) {
          if (container.parentElement) container = container.parentElement;
        }

        // Extract text from the container
        const fullText = container.innerText || '';
        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // Parse: first meaningful line = author, then time, then comment text
        let author = '';
        let time = '';
        let commentLines = [];
        let foundAuthor = false;

        for (let j = 0; j < lines.length; j++) {
          const line = lines[j];
          // Skip noise
          if (/^(Follow|he\/him|she\/her|they\/them|Author|Member-only|MOST RELEVANT)$/i.test(line)) continue;
          if (/^(Hide replies|Show \d|Cancel|Respond|Reply|\d+ repl)/.test(line)) continue;
          if (/^(What are your thoughts|Write a response)/.test(line)) continue;

          if (!foundAuthor && line.length > 1 && line.length < 60 && !/^\d+$/.test(line)) {
            author = line;
            foundAuthor = true;
            continue;
          }

          if (foundAuthor && !time && (/ago/i.test(line) || /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(line) || /^\d+ (day|hour|min)/i.test(line))) {
            time = line;
            continue;
          }

          if (foundAuthor && time) {
            // Stop at noise markers
            if (/^(Hide replies|Reply|\d+ repl|Show \d)/.test(line)) break;
            if (line === 'more') continue;
            if (/^\d+$/.test(line) && parseInt(line) < 200) continue; // clap count
            commentLines.push(line);
          }
        }

        if (author && commentLines.length > 0) {
          results.push({
            index: i,
            author,
            time: time || '',
            text: commentLines.join(' '),
          });
        }
      }

      // Also get the total response count
      const body = document.body.innerText || '';
      const countMatch = body.match(/Responses?\s*\((\d+)\)/);
      const totalCount = countMatch ? parseInt(countMatch[1], 10) : results.length;

      return { comments: results, totalCount };
    });

    // Also get nested replies (our replies + follow-ups) from text
    const nestedData = await page.evaluate(() => {
      const body = document.body.innerText || '';
      const idx = body.indexOf('Responses');
      if (idx === -1) return { raw: '' };
      return { raw: body.substring(idx, idx + 15000) };
    });

    // Find nested replies by looking for "Author" tagged entries and follow-up replies
    const nestedReplies = parseNestedReplies(nestedData.raw, comments.comments);

    console.log(`\nComments on post (${comments.totalCount} total responses)`);
    console.log('═'.repeat(70));

    comments.comments.forEach((c) => {
      console.log(`\n#${c.index} ${c.author} (${c.time})`);
      console.log('─'.repeat(70));
      const lines = wordWrap(c.text, 66);
      lines.forEach(line => console.log(`  ${line}`));

      // Show nested replies for this comment
      const nested = nestedReplies.filter(n => n.parentIndex === c.index);
      nested.forEach(n => {
        console.log(`  └─ ${n.author} (${n.time}): ${n.text.substring(0, 100)}${n.text.length > 100 ? '...' : ''}`);
      });
    });

    console.log('\n' + '═'.repeat(70));
    console.log(`\n# indices match across comments/reply/clap commands`);
    console.log(`To reply:   node scripts/medium-cdp.js reply "${postUrl}" <#> "your text"`);
    console.log(`To clap:    node scripts/medium-cdp.js clap "${postUrl}" <#>`);

    return { comments: comments.comments };
  } finally {
    await page.close();
  }
}

function parseNestedReplies(raw, topComments) {
  const nested = [];
  if (!raw) return nested;

  // Look for "Author" tagged replies and follow-up replies between top-level comments
  for (let i = 0; i < topComments.length; i++) {
    const authorName = topComments[i].author;
    // Find follow-up text blocks between this comment and the next
    const startMarker = topComments[i].text.substring(0, 30);
    const endMarker = i + 1 < topComments.length ? topComments[i + 1].text.substring(0, 30) : null;

    const startIdx = raw.indexOf(startMarker);
    if (startIdx === -1) continue;
    const endIdx = endMarker ? raw.indexOf(endMarker, startIdx + 50) : raw.length;
    const section = raw.substring(startIdx, endIdx);

    // Look for "Author" tag (our replies)
    const authorMatches = [...section.matchAll(/Author\n\n(\d+[\w\s]+ago|Just now)\n\n([\s\S]*?)(?=\nReply\n|\n\d+\n|$)/g)];
    const seen = new Set();
    for (const m of authorMatches) {
      const key = m[1].trim() + m[2].substring(0, 30);
      if (seen.has(key)) continue;
      seen.add(key);
      nested.push({
        parentIndex: i,
        author: 'You',
        time: m[1].trim(),
        text: m[2].replace(/\n/g, ' ').trim(),
      });
    }

    // Look for follow-up replies from others
    const followUpPattern = /Hide replies[\s\S]*?Reply\n\n([\w\s,.]+)\n\n(\d+[\w\s]+ago|Just now)\n\n([\s\S]*?)(?=\nReply\n|$)/g;
    for (const fu of section.matchAll(followUpPattern)) {
      const fuAuthor = fu[1].trim();
      if (fuAuthor !== authorName && fuAuthor.length < 40) {
        const key = fuAuthor + fu[2].trim();
        if (seen.has(key)) continue;
        seen.add(key);
        nested.push({
          parentIndex: i,
          author: fuAuthor,
          time: fu[2].trim(),
          text: fu[3].replace(/\n/g, ' ').trim(),
        });
      }
    }
  }

  return nested;
}


// ─── Respond (top-level response to post) ────────────────────

async function respondToPost(context, postUrl, responseText) {
  const page = await context.newPage();
  try {
    await openResponsesPanel(page, postUrl);

    // Find the top-level editor in the panel ("What are your thoughts?")
    // It's the contenteditable element closest to the top of the panel (x > 800)
    const editors = await page.$$('[contenteditable="true"]');
    let topEditor = null;

    for (const ed of editors) {
      const box = await ed.boundingBox().catch(() => null);
      const visible = await ed.isVisible().catch(() => false);
      if (visible && box && box.x > 700 && box.y < 200) {
        topEditor = ed;
        break;
      }
    }

    if (!topEditor) {
      // Fallback: look for any visible contenteditable in the right half
      for (const ed of editors) {
        const box = await ed.boundingBox().catch(() => null);
        const visible = await ed.isVisible().catch(() => false);
        if (visible && box && box.x > 700) {
          topEditor = ed;
          break;
        }
      }
    }

    if (!topEditor) {
      console.error('Could not find the response editor in the panel.');
      await page.screenshot({ path: '/tmp/medium-no-editor.png' });
      console.error('Screenshot saved to /tmp/medium-no-editor.png');
      return false;
    }

    console.log('Clicking response editor...');
    await topEditor.click({ force: true });
    await page.waitForTimeout(500);

    // Type via keyboard (triggers React state properly)
    console.log('Typing response...');
    await page.keyboard.type(responseText, { delay: 5 });
    await page.waitForTimeout(1000);

    // Submit via JS click (bypasses focus-lock overlay)
    const submitted = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(b =>
        b.textContent.trim() === 'Respond' && b.getBoundingClientRect().width > 0
      );
      btns.sort((a, b) => b.getBoundingClientRect().y - a.getBoundingClientRect().y);
      if (btns.length > 0) { btns[0].click(); return true; }
      return false;
    });

    if (submitted) {
      await page.waitForTimeout(3000);
      // Verify by checking if response count changed
      const newText = await page.evaluate(() => {
        const body = document.body.innerText || '';
        const match = body.match(/Responses?\s*\((\d+)\)/);
        return match ? match[1] : '?';
      });
      console.log(`Response posted! (${newText} total responses)`);
      await page.screenshot({ path: '/tmp/medium-response-posted.png' });
    } else {
      console.error('Could not find Respond button.');
      await page.screenshot({ path: '/tmp/medium-no-respond-btn.png' });
    }

    return submitted;
  } finally {
    await page.close();
  }
}

// ─── Reply (to a specific comment) ──────────────────────────

async function replyToComment(context, postUrl, commentIndex, replyText) {
  const page = await context.newPage();
  try {
    await openResponsesPanel(page, postUrl);

    // Expand all truncated comments and reply threads (same as getComments)
    for (let pass = 0; pass < 3; pass++) {
      await page.evaluate(() => {
        const panel = document.querySelector('[data-focus-lock-disabled]') || document;
        // Scroll to bottom to trigger lazy loading
        if (panel.scrollHeight) panel.scrollTop = panel.scrollHeight;
        // Click expansion buttons
        const btns = Array.from(panel.querySelectorAll('button'));
        btns.filter(b => {
          const t = b.textContent.trim();
          return (t === 'more' || /^\d+\s*repl/i.test(t) || /show.*repl/i.test(t))
            && b.getBoundingClientRect().width > 0;
        }).forEach(b => b.click());
      });
      await page.waitForTimeout(2000);
    }
    // Scroll back to top so clap button ordering is correct
    await page.evaluate(() => {
      const panel = document.querySelector('[data-focus-lock-disabled]');
      if (panel) panel.scrollTop = 0;
    });
    await page.waitForTimeout(1000);

    // Snapshot editor positions BEFORE clicking Reply
    const editorsBefore = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[contenteditable=true]')).map(e => {
        const r = e.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      });
    });

    // Use clap buttons to identify other people's comments (excludes our own replies)
    // Then find the Reply button nearest to each clap button
    const clickResult = await page.evaluate((idx) => {
      const panel = document.querySelector('[data-focus-lock-disabled]') || document;

      // Clap buttons only exist on other people's comments
      const clapBtns = Array.from(panel.querySelectorAll('svg[aria-label="clap"]'))
        .map(svg => svg.closest('button'))
        .filter(btn => btn && btn.getBoundingClientRect().width > 0)
        .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y);

      if (idx >= clapBtns.length) {
        return { error: `Comment #${idx} not found. ${clapBtns.length} comments visible.` };
      }

      // Find the Reply button nearest to this comment's clap button
      const clapY = clapBtns[idx].getBoundingClientRect().y;
      const replyBtns = Array.from(panel.querySelectorAll('button')).filter(b =>
        b.textContent.trim() === 'Reply' && b.getBoundingClientRect().width > 0
      );
      const nearestReply = replyBtns.reduce((best, btn) => {
        const dist = Math.abs(btn.getBoundingClientRect().y - clapY);
        return dist < best.dist ? { btn, dist } : best;
      }, { btn: null, dist: Infinity });

      if (!nearestReply.btn) return { error: 'Reply button not found near comment #' + idx };
      nearestReply.btn.click();
      return { clicked: true, total: clapBtns.length };
    }, commentIndex);

    if (clickResult.error) {
      console.error(clickResult.error);
      return false;
    }

    console.log(`Clicked Reply on comment #${commentIndex} (${clickResult.total} total)`);
    await page.waitForTimeout(3000);

    // Find the NEW editor by diffing before/after
    const editorsAfter = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[contenteditable=true]')).map(e => {
        const r = e.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      });
    });

    // Find the NEW editor - pick the one with highest y (closest to the comment)
    // This avoids accidentally picking the top-level editor that shifted position
    let newEditorIdx = -1;
    let highestNewY = -1;
    for (let i = 0; i < editorsAfter.length; i++) {
      const ea = editorsAfter[i];
      const existed = editorsBefore.some(eb => Math.abs(eb.x - ea.x) < 5 && Math.abs(eb.y - ea.y) < 5);
      if (!existed && ea.y > highestNewY) {
        highestNewY = ea.y;
        newEditorIdx = i;
      }
    }

    if (newEditorIdx === -1) {
      console.error('Reply editor did not appear.');
      await page.screenshot({ path: '/tmp/medium-no-reply-editor.png' });
      return false;
    }

    const allEditors = await page.$$('[contenteditable=true]');
    const replyEditor = allEditors[newEditorIdx];

    console.log('Typing reply...');
    await replyEditor.click({ force: true });
    await page.waitForTimeout(300);
    // Clear any existing draft text in the editor
    await page.keyboard.press('Meta+A');
    await page.waitForTimeout(100);
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(100);
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(300);
    await page.keyboard.type(replyText, { delay: 5 });
    await page.waitForTimeout(1000);

    // Submit via JS click scoped to the responses panel (bypasses overlay)
    const submitted = await page.evaluate(() => {
      const panel = document.querySelector('[data-focus-lock-disabled]') || document;
      const btns = Array.from(panel.querySelectorAll('button')).filter(b =>
        b.textContent.trim() === 'Respond' && b.getBoundingClientRect().width > 0
      );
      btns.sort((a, b) => b.getBoundingClientRect().y - a.getBoundingClientRect().y);
      if (btns.length > 0) { btns[0].click(); return true; }
      return false;
    });

    if (submitted) {
      await page.waitForTimeout(5000);
      console.log('Reply posted!');
    } else {
      console.error('Could not find Respond button.');
    }

    return submitted;
  } finally {
    await page.close();
  }
}

// ─── Clap ────────────────────────────────────────────────────

async function clapForComment(context, postUrl, commentIndex, clapCount = 1) {
  const page = await context.newPage();
  try {
    // For article-level claps (no comment index), skip the panel entirely
    if (commentIndex === null || commentIndex === undefined) {
      console.log(`Navigating to: ${postUrl}`);
      await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(3000);

      // Scroll full page to load the clap button
      const totalHeight = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < totalHeight; y += 400) {
        await page.evaluate((sy) => window.scrollTo(0, sy), y);
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(2000);

      // Find main page clap button (x < 800, not in a panel)
      const clapPos = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll('svg[aria-label="clap"]'));
        for (const svg of svgs) {
          const btn = svg.closest('button');
          if (!btn) continue;
          const r = btn.getBoundingClientRect();
          if (r.width > 0 && r.x < 800 && r.x > 100) {
            btn.scrollIntoView({ behavior: 'instant', block: 'center' });
            return { found: true };
          }
        }
        return { error: 'No article clap button found' };
      });

      if (clapPos.error) { console.error(clapPos.error); return false; }
      await page.waitForTimeout(1000);

      const coords = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll('svg[aria-label="clap"]'));
        for (const svg of svgs) {
          const btn = svg.closest('button');
          if (!btn) continue;
          const r = btn.getBoundingClientRect();
          if (r.width > 0 && r.x < 800 && r.x > 100 && r.y > 0 && r.y < window.innerHeight) {
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
          }
        }
        return null;
      });

      if (!coords) { console.error('Clap button not in viewport'); return false; }

      for (let c = 0; c < clapCount; c++) {
        await page.mouse.click(coords.x, coords.y);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(1000);
      console.log(`Clapped ${clapCount}x for post!`);
      return true;
    }

    // For comment-level claps, open the responses panel
    await openResponsesPanel(page, postUrl);

    // Find clap button, scroll into view, then CDP mouse click
    const findResult = await page.evaluate((idx) => {
      const panel = document.querySelector('[data-focus-lock-disabled]') || document;

      const clapBtns = Array.from(panel.querySelectorAll('svg[aria-label="clap"]'))
        .map(svg => svg.closest('button'))
        .filter(btn => btn && btn.getBoundingClientRect().width > 0)
        .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y);

      if (idx >= clapBtns.length) {
        return { error: `Comment #${idx} not found. ${clapBtns.length} clappable comments.` };
      }

      // Scroll into view so CDP mouse click lands on a visible element
      clapBtns[idx].scrollIntoView({ behavior: 'instant', block: 'center' });
      return { target: idx };
    }, commentIndex);

    if (findResult.error) {
      console.error(findResult.error);
      return false;
    }

    await page.waitForTimeout(1000);

    // Get coordinates after scroll
    const clapPos = await page.evaluate((idx) => {
      const panel = document.querySelector('[data-focus-lock-disabled]') || document;
      const clapBtns = Array.from(panel.querySelectorAll('svg[aria-label="clap"]'))
        .map(svg => svg.closest('button'))
        .filter(btn => btn && btn.getBoundingClientRect().width > 0)
        .sort((a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y);
      const btn = idx === null
        ? document.querySelector('svg[aria-label="clap"]')?.closest('button')
        : clapBtns[idx];
      if (!btn) return null;
      const r = btn.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, commentIndex);

    if (!clapPos) { console.error('Clap button lost after scroll'); return false; }

    // CDP-level mouse clicks
    for (let c = 0; c < clapCount; c++) {
      await page.mouse.click(clapPos.x, clapPos.y);
      await page.waitForTimeout(400);
    }

    await page.waitForTimeout(1000);
    const label = findResult.target === 'post' ? 'post' : 'comment #' + findResult.target;
    console.log(`Clapped ${clapCount}x for ${label}!`);
    return true;
  } finally {
    await page.close();
  }
}

// ─── Reply Nested (via comment permalink page) ──────────────

async function replyNested(context, commentUrl, replyText) {
  const page = await context.newPage();
  try {
    console.log(`Navigating to comment: ${commentUrl}`);
    await page.goto(commentUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(5000);

    // Full scroll to load content
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 300) {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(2000);

    // Open responses panel via speech bubble SVG
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => {
        const svg = b.querySelector('svg');
        if (!svg || b.getBoundingClientRect().width === 0) return false;
        return Array.from(svg.querySelectorAll('path')).some(p =>
          (p.getAttribute('d') || '').includes('18.006'));
      });
      if (btn) { btn.scrollIntoView({ behavior: 'instant', block: 'center' }); btn.click(); }
    });
    await page.waitForTimeout(5000);

    // Find editor in panel
    const editorPos = await page.evaluate(() => {
      for (const ed of document.querySelectorAll('[contenteditable=true]')) {
        const r = ed.getBoundingClientRect();
        if (r.width > 0 && r.x > 700) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }
      return null;
    });

    if (!editorPos) {
      console.error('No editor found on comment page.');
      return false;
    }

    // Type via CDP mouse click (real focus) + keyboard
    await page.mouse.click(editorPos.x, editorPos.y);
    await page.waitForTimeout(500);
    await page.keyboard.type(replyText, { delay: 5 });
    await page.waitForTimeout(1000);
    console.log('Typed reply...');

    // Click Respond
    const respondPos = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.trim() === 'Respond' && b.getBoundingClientRect().width > 0
          && b.getBoundingClientRect().x > 700);
      if (!btn) return null;
      const r = btn.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    if (!respondPos) {
      console.error('No Respond button found.');
      return false;
    }

    await page.mouse.click(respondPos.x, respondPos.y);
    await page.waitForTimeout(5000);
    console.log('Nested reply posted!');
    return true;
  } finally {
    await page.close();
  }
}

// ─── Snapshot ────────────────────────────────────────────────

async function snapshot(context, url) {
  const page = await context.newPage();
  try {
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(2000);

    const html = await page.content();
    const text = await page.evaluate(() => document.body.innerText);

    const snapshotDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 60);

    const htmlPath = path.join(snapshotDir, `snapshot_${slug}_${timestamp}.html`);
    const textPath = path.join(snapshotDir, `snapshot_${slug}_${timestamp}.txt`);

    fs.writeFileSync(htmlPath, html);
    fs.writeFileSync(textPath, text);

    console.log(`\nSnapshot saved:`);
    console.log(`  HTML: ${htmlPath}`);
    console.log(`  Text: ${textPath}`);
    console.log(`\nText preview (first 2000 chars):\n`);
    console.log(text.substring(0, 2000));
  } finally {
    await page.close();
  }
}

// ─── Helpers ─────────────────────────────────────────────────

async function clickRespondButton(page) {
  // Find visible Respond/Submit button in the panel
  for (const btn of await page.$$('button')) {
    const text = await btn.textContent().catch(() => '');
    const visible = await btn.isVisible().catch(() => false);
    const box = await btn.boundingBox().catch(() => null);
    if (/^Respond$/i.test(text.trim()) && visible && box && box.x > 700) {
      console.log('Clicking Respond...');
      await btn.click({ force: true });
      return true;
    }
  }
  return false;
}

function wordWrap(text, maxWidth) {
  const lines = [];
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    if (para.length <= maxWidth) { lines.push(para); continue; }
    const words = para.split(' ');
    let current = '';
    for (const word of words) {
      if (current.length + word.length + 1 <= maxWidth) {
        current += (current ? ' ' : '') + word;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

// ─── CLI ─────────────────────────────────────────────────────

const USAGE = `
Medium CDP Tool - Interact with Medium via Chrome DevTools Protocol

Usage:
  node scripts/medium-cdp.js stats                                      Get post statistics
  node scripts/medium-cdp.js comments <post-url>                        Get comments on a post
  node scripts/medium-cdp.js respond <post-url> "response text"         Post a top-level response
  node scripts/medium-cdp.js reply <post-url> <comment-index> "text"    Reply to a specific comment
  node scripts/medium-cdp.js reply-nested <comment-url> "text"          Reply to a nested comment via its permalink
  node scripts/medium-cdp.js clap <post-url> post [count]              Clap for article (default 50)
  node scripts/medium-cdp.js clap <post-url> <comment-index> [count]   Clap for comment (default 1)
  node scripts/medium-cdp.js snapshot <url>                             Debug: save page HTML

Environment:
  CDP_URL  Chrome DevTools Protocol endpoint (default: http://localhost:9222)

Prerequisites:
  1. Start Chrome with --remote-debugging-port=9222
  2. Log in to Medium in that browser instance
`.trim();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(USAGE);
    process.exit(0);
  }

  // Validate args before connecting
  switch (command) {
    case 'stats': break;
    case 'comments':
      if (!args[1]) { console.error('Usage: comments <post-url>'); process.exit(1); }
      break;
    case 'respond':
      if (!args[1] || !args[2]) { console.error('Usage: respond <post-url> "text"'); process.exit(1); }
      break;
    case 'reply':
      if (!args[1] || isNaN(parseInt(args[2], 10)) || !args[3]) {
        console.error('Usage: reply <post-url> <index> "text"'); process.exit(1);
      }
      break;
    case 'reply-nested':
      if (!args[1] || !args[2]) {
        console.error('Usage: reply-nested <comment-url> "text"'); process.exit(1);
      }
      break;
    case 'clap':
      if (!args[1]) { console.error('Usage: clap <post-url> [comment-index]'); process.exit(1); }
      break;
    case 'snapshot':
      if (!args[1]) { console.error('Usage: snapshot <url>'); process.exit(1); }
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log(USAGE);
      process.exit(1);
  }

  const { browser, context } = await connect();

  try {
    switch (command) {
      case 'stats':
        await getStats(context);
        break;
      case 'comments':
        await getComments(context, args[1]);
        break;
      case 'respond':
        await respondToPost(context, args[1], args[2]);
        break;
      case 'reply':
        await replyToComment(context, args[1], parseInt(args[2], 10), args[3]);
        break;
      case 'reply-nested':
        await replyNested(context, args[1], args[2]);
        break;
      case 'clap': {
        // clap <url>              → 1 clap for article
        // clap <url> post [N]     → N claps for article (default 50)
        // clap <url> <idx> [N]    → N claps for comment #idx (default 1)
        let clapIdx, clapN;
        if (args[2] === 'post' || args[2] === undefined) {
          clapIdx = null;
          clapN = args[3] !== undefined ? Math.min(50, parseInt(args[3], 10)) : (args[2] === 'post' ? 50 : 1);
        } else {
          clapIdx = parseInt(args[2], 10);
          clapN = args[3] !== undefined ? Math.min(50, Math.max(1, parseInt(args[3], 10))) : 1;
        }
        await clapForComment(context, args[1], clapIdx, clapN);
        break;
      }
      case 'snapshot':
        await snapshot(context, args[1]);
        break;
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
