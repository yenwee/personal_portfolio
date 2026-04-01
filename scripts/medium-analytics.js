#!/usr/bin/env node

/**
 * Medium Analytics Tool
 *
 * Analyzes Medium post performance using CDP stats data.
 * Provides actionable insights on read ratios, engagement patterns,
 * and writing improvement recommendations.
 *
 * Usage:
 *   node scripts/medium-analytics.js                # Full analytics report
 *   node scripts/medium-analytics.js --json         # Raw JSON output
 *   node scripts/medium-analytics.js comments-scan  # Scan all posts for comments
 *
 * Prerequisites:
 *   Chrome running with --remote-debugging-port=9222, logged into Medium
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CDP_URL = process.env.CDP_URL || 'http://localhost:9222';

// ─── Read Ratio Benchmarks ──────────────────────────────────
// Source: Medium community data, CoSchedule, vocal.media
const BENCHMARKS = {
  EXCELLENT: 40,  // 40%+ read ratio
  GOOD: 30,       // 30-40%
  AVERAGE: 20,    // 20-30%
  LOW: 10,        // 10-20%
  // Below 10% = concerning
};

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
      console.error('No browser contexts found.');
      process.exit(1);
    }
    return { browser, context: contexts[0] };
  } catch (err) {
    console.error(`Failed to connect to Chrome at ${CDP_URL}`);
    console.error('Make sure Chrome is running with: --remote-debugging-port=9222');
    process.exit(1);
  }
}

// ─── Stats Extraction ────────────────────────────────────────

async function extractStats(context) {
  const page = await context.newPage();

  try {
    await page.goto('https://medium.com/me/stats', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const stats = await page.evaluate(() => {
      const results = [];
      const rows = document.querySelectorAll('table tbody tr, table tr');

      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
          const titleEl = cells[0]?.querySelector('a') || cells[0];
          const title = titleEl?.textContent?.trim() || '';
          const url = titleEl?.href || '';

          // Parse numeric values, handling K/M suffixes
          const parseNum = (text) => {
            if (!text) return 0;
            text = text.replace(/,/g, '').trim();
            if (text.includes('K')) return parseFloat(text) * 1000;
            if (text.includes('M')) return parseFloat(text) * 1000000;
            return parseInt(text, 10) || 0;
          };

          // Columns: Presentations | Views | Reads
          results.push({
            title,
            url,
            presentations: parseNum(cells[1]?.textContent),
            views: parseNum(cells[2]?.textContent),
            reads: parseNum(cells[3]?.textContent),
            presentationsRaw: cells[1]?.textContent?.trim() || '',
            viewsRaw: cells[2]?.textContent?.trim() || '',
            readsRaw: cells[3]?.textContent?.trim() || '',
          });
        }
      }
      return results;
    });

    return stats;
  } finally {
    await page.close();
  }
}

// ─── Comment Scanner ─────────────────────────────────────────

async function scanPostComments(context, postUrl, postTitle) {
  const page = await context.newPage();

  try {
    await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // Scroll to bottom to find responses
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, 400);
          totalHeight += 400;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
        setTimeout(() => { clearInterval(timer); resolve(); }, 10000);
      });
    });
    await page.waitForTimeout(2000);

    const commentCount = await page.evaluate(() => {
      const body = document.body.innerText || '';
      // Look for response count indicators
      const match = body.match(/(\d+)\s*(?:responses?|comments?)/i);
      if (match) return parseInt(match[1], 10);

      // Count response blocks
      const blocks = document.querySelectorAll('[data-testid*="response"], [role="article"]');
      return Math.max(0, blocks.length - 1); // -1 for main article
    });

    return { url: postUrl, title: postTitle, commentCount };
  } catch {
    return { url: postUrl, title: postTitle, commentCount: -1, error: true };
  } finally {
    await page.close();
  }
}

// ─── Analytics Engine ────────────────────────────────────────

// CTR benchmarks (impressions to views)
const CTR_BENCHMARKS = {
  STRONG: 15,    // 15%+ CTR
  OK: 10,        // 10-15%
  WEAK: 5,       // 5-10%
  // Below 5% = poor
};

function analyzeStats(posts) {
  const analyzed = posts.map((post) => {
    const readRatio = post.views > 0 ? (post.reads / post.views) * 100 : 0;
    const ctr = post.presentations > 0 ? (post.views / post.presentations) * 100 : 0;

    let readTier;
    if (readRatio >= BENCHMARKS.EXCELLENT) readTier = 'EXCELLENT';
    else if (readRatio >= BENCHMARKS.GOOD) readTier = 'GOOD';
    else if (readRatio >= BENCHMARKS.AVERAGE) readTier = 'AVERAGE';
    else if (readRatio >= BENCHMARKS.LOW) readTier = 'LOW';
    else readTier = 'CONCERNING';

    let ctrTier;
    if (ctr >= CTR_BENCHMARKS.STRONG) ctrTier = 'STRONG';
    else if (ctr >= CTR_BENCHMARKS.OK) ctrTier = 'OK';
    else if (ctr >= CTR_BENCHMARKS.WEAK) ctrTier = 'WEAK';
    else ctrTier = 'POOR';

    // Diagnose what needs fixing based on the two metrics
    // CTR = title/subtitle/image problem (discovery)
    // Read ratio = content/opening problem (retention)
    let diagnosis;
    if (ctr >= CTR_BENCHMARKS.STRONG && readRatio >= BENCHMARKS.GOOD) {
      diagnosis = 'WINNING - both discovery and retention strong';
    } else if (ctr >= CTR_BENCHMARKS.OK && readRatio >= BENCHMARKS.GOOD) {
      diagnosis = 'GOOD - content is strong, title could be sharper';
    } else if (ctr >= CTR_BENCHMARKS.STRONG && readRatio < BENCHMARKS.AVERAGE) {
      diagnosis = 'FIX CONTENT - title works but readers leave early. Strengthen opening paragraphs.';
    } else if (ctr < CTR_BENCHMARKS.WEAK && readRatio >= BENCHMARKS.GOOD) {
      diagnosis = 'FIX TITLE - content is great but nobody clicks. Rewrite title/subtitle for curiosity gap.';
    } else if (ctr < CTR_BENCHMARKS.WEAK && readRatio < BENCHMARKS.AVERAGE) {
      diagnosis = 'FIX BOTH - low clicks AND low retention. Rethink title and opening.';
    } else if (post.presentations === 0) {
      diagnosis = 'NO DATA - old post without presentation tracking';
    } else {
      diagnosis = 'AVERAGE - room to improve on both fronts';
    }

    return {
      ...post,
      readRatio: Math.round(readRatio * 10) / 10,
      ctr: Math.round(ctr * 10) / 10,
      readTier,
      ctrTier,
      diagnosis,
    };
  });

  // Sort by presentations descending (most impressions first)
  analyzed.sort((a, b) => b.presentations - a.presentations || b.views - a.views);

  // Aggregate stats (only posts with views > 0)
  const postsWithViews = analyzed.filter((p) => p.views > 0);
  const totalViews = postsWithViews.reduce((s, p) => s + p.views, 0);
  const totalReads = postsWithViews.reduce((s, p) => s + p.reads, 0);
  const avgReadRatio = totalViews > 0 ? (totalReads / totalViews) * 100 : 0;

  const postsWithPres = analyzed.filter((p) => p.presentations > 0);
  const totalPres = postsWithPres.reduce((s, p) => s + p.presentations, 0);
  const totalViewsFromPres = postsWithPres.reduce((s, p) => s + p.views, 0);
  const avgCtr = totalPres > 0 ? (totalViewsFromPres / totalPres) * 100 : 0;

  // Diagnosis distribution
  const diagCounts = {};
  for (const p of analyzed) {
    const key = p.diagnosis.split(' - ')[0];
    diagCounts[key] = (diagCounts[key] || 0) + 1;
  }

  return {
    posts: analyzed,
    summary: {
      totalPosts: analyzed.length,
      totalPresentations: totalPres,
      totalViews,
      totalReads,
      avgCtr: Math.round(avgCtr * 10) / 10,
      avgReadRatio: Math.round(avgReadRatio * 10) / 10,
      diagCounts,
    },
  };
}

// ─── Report Generator ────────────────────────────────────────

function generateReport(analysis) {
  const { posts, summary } = analysis;
  const lines = [];

  lines.push('');
  lines.push('='.repeat(100));
  lines.push('  MEDIUM ANALYTICS REPORT');
  lines.push('  Generated: ' + new Date().toISOString().split('T')[0]);
  lines.push('='.repeat(100));

  // Summary
  lines.push('');
  lines.push('OVERVIEW');
  lines.push('-'.repeat(50));
  lines.push(`  Total posts:         ${summary.totalPosts}`);
  lines.push(`  Total impressions:   ${summary.totalPresentations.toLocaleString()}`);
  lines.push(`  Total views:         ${summary.totalViews.toLocaleString()}`);
  lines.push(`  Total reads:         ${summary.totalReads.toLocaleString()}`);
  lines.push(`  Avg CTR:             ${summary.avgCtr}% (impressions -> views)`);
  lines.push(`  Avg read ratio:      ${summary.avgReadRatio}% (views -> reads)`);
  lines.push('');
  lines.push('  Diagnosis distribution:');
  for (const [diag, count] of Object.entries(summary.diagCounts)) {
    const bar = '#'.repeat(count * 3);
    lines.push(`    ${diag.padEnd(14)} ${String(count).padStart(2)} ${bar}`);
  }

  // All posts table with CTR + Read Ratio + Diagnosis
  lines.push('');
  lines.push('ALL POSTS (sorted by impressions)');
  lines.push('-'.repeat(100));
  lines.push(
    '  ' +
    '#'.padEnd(3) +
    'Title'.padEnd(32) +
    'Impr.'.padStart(7) +
    'Views'.padStart(7) +
    'Reads'.padStart(7) +
    'CTR'.padStart(6) +
    'Read%'.padStart(7) +
    '  What to fix'
  );
  lines.push('-'.repeat(100));

  posts.forEach((p, i) => {
    const title = p.title.length > 29 ? p.title.substring(0, 29) + '...' : p.title;
    const ctrStr = p.ctr > 0 ? p.ctr + '%' : '-';
    const ratioStr = p.readRatio > 0 ? p.readRatio + '%' : '-';
    const diag = p.diagnosis.split(' - ')[0];
    lines.push(
      '  ' +
      String(i + 1).padEnd(3) +
      title.padEnd(32) +
      p.presentations.toLocaleString().padStart(7) +
      p.views.toLocaleString().padStart(7) +
      p.reads.toLocaleString().padStart(7) +
      ctrStr.padStart(6) +
      ratioStr.padStart(7) +
      '  ' + diag
    );
  });

  // Detailed diagnosis for each post that needs work
  const needsWork = posts.filter(p =>
    p.diagnosis.startsWith('FIX') || p.diagnosis.startsWith('AVERAGE')
  );

  if (needsWork.length > 0) {
    lines.push('');
    lines.push('='.repeat(100));
    lines.push('  WHAT TO FIX (per post)');
    lines.push('='.repeat(100));

    for (const p of needsWork) {
      const title = p.title.length > 55 ? p.title.substring(0, 55) + '...' : p.title;
      lines.push('');
      lines.push(`  "${title}"`);
      lines.push(`  ${p.diagnosis}`);
      if (p.diagnosis.startsWith('FIX TITLE') || p.diagnosis.startsWith('FIX BOTH')) {
        lines.push('  -> Rewrite title to create a curiosity gap. Ask: does the headline give away the conclusion?');
        lines.push('  -> Check subtitle preview in feed. Is it compelling on its own?');
        lines.push('  -> Consider a stronger featured image.');
      }
      if (p.diagnosis.startsWith('FIX CONTENT') || p.diagnosis.startsWith('FIX BOTH')) {
        lines.push('  -> Strengthen the first 2-3 sentences. Deliver on the title promise immediately.');
        lines.push('  -> Consider a TL;DR at the top for longer posts.');
        lines.push('  -> Check if the post is too long for the promise the title makes.');
      }
    }
  }

  // Winners
  const winners = posts.filter(p => p.diagnosis.startsWith('WINNING') || p.diagnosis.startsWith('GOOD'));
  if (winners.length > 0) {
    lines.push('');
    lines.push('='.repeat(100));
    lines.push('  WHAT IS WORKING');
    lines.push('='.repeat(100));

    for (const p of winners) {
      const title = p.title.length > 55 ? p.title.substring(0, 55) + '...' : p.title;
      lines.push(`  "${title}"  CTR: ${p.ctr}% | Read: ${p.readRatio}%`);
    }
  }

  lines.push('');
  lines.push('='.repeat(100));
  lines.push('  METRICS EXPLAINED');
  lines.push('='.repeat(100));
  lines.push('  CTR = Impressions -> Views. Low CTR = fix title/subtitle/image (discovery problem)');
  lines.push('  Read% = Views -> Reads. Low Read% = fix opening/content (retention problem)');
  lines.push('  CTR benchmarks: STRONG 15%+ | OK 10-15% | WEAK 5-10% | POOR <5%');
  lines.push('  Read benchmarks: EXCELLENT 40%+ | GOOD 30-40% | AVERAGE 20-30% | LOW <20%');
  lines.push('');

  return lines.join('\n');
}


// ─── CLI ─────────────────────────────────────────────────────

const USAGE = `
Medium Analytics - Post performance analysis and recommendations

Usage:
  node scripts/medium-analytics.js              Full analytics report
  node scripts/medium-analytics.js --json        Raw JSON output
  node scripts/medium-analytics.js comments-scan Scan top posts for comment counts

Prerequisites:
  Chrome running with --remote-debugging-port=9222, logged into Medium
`.trim();

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE);
    process.exit(0);
  }

  const { browser, context } = await connect();

  try {
    console.log('Fetching Medium stats...');
    const stats = await extractStats(context);

    if (stats.length === 0) {
      console.error('No posts found. Are you logged in to Medium?');
      process.exit(1);
    }

    const analysis = analyzeStats(stats);

    if (args.includes('--json')) {
      console.log(JSON.stringify(analysis, null, 2));
      return;
    }

    if (args[0] === 'comments-scan') {
      console.log(`\nScanning ${analysis.posts.length} posts for comments...\n`);
      const commentResults = [];

      for (const post of analysis.posts) {
        if (!post.url) continue;
        process.stdout.write(`  Scanning: ${post.title.substring(0, 50)}...`);
        const result = await scanPostComments(context, post.url, post.title);
        commentResults.push(result);
        console.log(` ${result.commentCount >= 0 ? result.commentCount + ' comments' : 'error'}`);
      }

      console.log('\n' + '='.repeat(60));
      console.log('  COMMENT SUMMARY');
      console.log('='.repeat(60));
      const withComments = commentResults.filter((r) => r.commentCount > 0);
      withComments.sort((a, b) => b.commentCount - a.commentCount);

      if (withComments.length > 0) {
        for (const r of withComments) {
          console.log(`  ${String(r.commentCount).padStart(3)} comments - ${r.title.substring(0, 50)}`);
          console.log(`      ${r.url}`);
        }
        console.log('\nUse: node scripts/medium-cdp.js comments "<url>" to read them');
      } else {
        console.log('  No comments found on any posts.');
      }
      return;
    }

    // Default: full report
    const report = generateReport(analysis);
    console.log(report);
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
