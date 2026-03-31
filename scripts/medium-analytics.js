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

function analyzeStats(posts) {
  const analyzed = posts.map((post) => {
    const readRatio = post.views > 0 ? (post.reads / post.views) * 100 : 0;
    let tier;
    if (readRatio >= BENCHMARKS.EXCELLENT) tier = 'EXCELLENT';
    else if (readRatio >= BENCHMARKS.GOOD) tier = 'GOOD';
    else if (readRatio >= BENCHMARKS.AVERAGE) tier = 'AVERAGE';
    else if (readRatio >= BENCHMARKS.LOW) tier = 'LOW';
    else tier = 'CONCERNING';

    return {
      ...post,
      readRatio: Math.round(readRatio * 10) / 10,
      tier,
    };
  });

  // Sort by views descending
  analyzed.sort((a, b) => b.views - a.views);

  // Aggregate stats (only include posts where views > 0 for ratio calc)
  const postsWithViews = analyzed.filter((p) => p.views > 0);
  const totalViews = postsWithViews.reduce((s, p) => s + p.views, 0);
  const totalReads = postsWithViews.reduce((s, p) => s + p.reads, 0);
  const avgReadRatio = totalViews > 0 ? (totalReads / totalViews) * 100 : 0;

  // Tier distribution
  const tierCounts = {};
  for (const p of analyzed) {
    tierCounts[p.tier] = (tierCounts[p.tier] || 0) + 1;
  }

  // Identify patterns
  const highViewLowRatio = analyzed.filter(
    (p) => p.views >= 1000 && p.readRatio < 15
  );
  const lowViewHighRatio = analyzed.filter(
    (p) => p.views < 500 && p.readRatio >= 15
  );
  const topPerformers = analyzed.filter(
    (p) => p.views >= 5000 && p.readRatio >= 30
  );
  const underperformers = analyzed.filter(
    (p) => p.views < 300 && p.readRatio < 15
  );

  return {
    posts: analyzed,
    summary: {
      totalPosts: analyzed.length,
      totalViews,
      totalReads,
      avgReadRatio: Math.round(avgReadRatio * 10) / 10,
      tierCounts,
    },
    patterns: {
      highViewLowRatio,
      lowViewHighRatio,
      topPerformers,
      underperformers,
    },
  };
}

// ─── Report Generator ────────────────────────────────────────

function generateReport(analysis) {
  const { posts, summary, patterns } = analysis;
  const lines = [];

  lines.push('');
  lines.push('='.repeat(80));
  lines.push('  MEDIUM ANALYTICS REPORT');
  lines.push('  Generated: ' + new Date().toISOString().split('T')[0]);
  lines.push('='.repeat(80));

  // Summary
  lines.push('');
  lines.push('OVERVIEW');
  lines.push('-'.repeat(40));
  lines.push(`  Total posts:      ${summary.totalPosts}`);
  lines.push(`  Total views:      ${summary.totalViews.toLocaleString()}`);
  lines.push(`  Total reads:      ${summary.totalReads.toLocaleString()}`);
  lines.push(`  Avg read ratio:   ${summary.avgReadRatio}%`);
  lines.push('');
  lines.push('  Tier distribution:');
  for (const [tier, count] of Object.entries(summary.tierCounts)) {
    const bar = '#'.repeat(count * 3);
    lines.push(`    ${tier.padEnd(12)} ${String(count).padStart(2)} ${bar}`);
  }

  // All posts table
  lines.push('');
  lines.push('ALL POSTS (sorted by views)');
  lines.push('-'.repeat(80));
  lines.push(
    '  ' +
    '#'.padEnd(3) +
    'Title'.padEnd(40) +
    'Views'.padStart(8) +
    'Reads'.padStart(8) +
    'Ratio'.padStart(7) +
    '  Tier'
  );
  lines.push('-'.repeat(80));

  posts.forEach((p, i) => {
    const title = p.title.length > 37 ? p.title.substring(0, 37) + '...' : p.title;
    const ratioStr = p.readRatio > 0 ? p.readRatio + '%' : '-';
    lines.push(
      '  ' +
      String(i + 1).padEnd(3) +
      title.padEnd(40) +
      p.views.toLocaleString().padStart(8) +
      p.reads.toLocaleString().padStart(8) +
      ratioStr.padStart(7) +
      '  ' + p.tier
    );
  });

  // Pattern insights
  lines.push('');
  lines.push('='.repeat(80));
  lines.push('  INSIGHTS & PATTERNS');
  lines.push('='.repeat(80));

  if (patterns.highViewLowRatio.length > 0) {
    lines.push('');
    lines.push('HIGH VIEWS, LOW READ RATIO (title/content mismatch?)');
    lines.push('-'.repeat(60));
    lines.push('  These posts attract clicks but readers leave early.');
    lines.push('  Possible causes: title overpromises, weak opening,');
    lines.push('  too long, or content does not match expectations.');
    lines.push('');
    for (const p of patterns.highViewLowRatio) {
      lines.push(`  - "${p.title.substring(0, 55)}"`);
      lines.push(`    ${p.views.toLocaleString()} views, ${p.readRatio}% read ratio`);
    }
  }

  if (patterns.lowViewHighRatio.length > 0) {
    lines.push('');
    lines.push('LOW VIEWS, HIGH READ RATIO (distribution problem?)');
    lines.push('-'.repeat(60));
    lines.push('  These posts are engaging but not getting discovered.');
    lines.push('  Possible fixes: better title, submit to publications,');
    lines.push('  cross-post to social media, improve SEO/tags.');
    lines.push('');
    for (const p of patterns.lowViewHighRatio) {
      lines.push(`  - "${p.title.substring(0, 55)}"`);
      lines.push(`    ${p.views.toLocaleString()} views, ${p.readRatio}% read ratio`);
    }
  }

  if (patterns.topPerformers.length > 0) {
    lines.push('');
    lines.push('TOP PERFORMERS (high views AND high read ratio)');
    lines.push('-'.repeat(60));
    lines.push('  Study what makes these work. Replicate the pattern.');
    lines.push('');
    for (const p of patterns.topPerformers) {
      lines.push(`  - "${p.title.substring(0, 55)}"`);
      lines.push(`    ${p.views.toLocaleString()} views, ${p.readRatio}% read ratio`);
    }
  }

  // Recommendations
  lines.push('');
  lines.push('='.repeat(80));
  lines.push('  RECOMMENDATIONS');
  lines.push('='.repeat(80));

  // Generate contextual recommendations based on data
  const recommendations = generateRecommendations(analysis);
  recommendations.forEach((rec, i) => {
    lines.push('');
    lines.push(`${i + 1}. ${rec.title}`);
    rec.details.forEach((d) => lines.push(`   ${d}`));
  });

  lines.push('');
  lines.push('='.repeat(80));

  return lines.join('\n');
}

function generateRecommendations(analysis) {
  const { summary, patterns } = analysis;
  const recs = [];

  if (patterns.highViewLowRatio.length > 0) {
    recs.push({
      title: 'FIX THE TITLE-CONTENT GAP',
      details: [
        `${patterns.highViewLowRatio.length} posts have high views but low read ratios.`,
        'Your titles are attracting clicks, but readers leave before 30 seconds.',
        'Action: Strengthen your opening paragraphs - deliver on the title promise',
        'within the first 2-3 sentences. Use a hook that previews the payoff.',
        'Consider: Are these posts too long for the promise? A provocative title',
        'needs an equally compelling first paragraph to keep readers scrolling.',
      ],
    });
  }

  if (patterns.topPerformers.length > 0) {
    recs.push({
      title: 'DOUBLE DOWN ON WHAT WORKS',
      details: [
        `Your top ${patterns.topPerformers.length} posts combine discovery + engagement.`,
        'Common pattern in your top posts: practical, technical how-to content.',
        'These posts rank well in search (evergreen) and deliver clear value.',
        'Action: Write more tutorial/how-to content alongside opinion pieces.',
        'Consider: Can you add practical sections to your opinion posts?',
      ],
    });
  }

  if (summary.avgReadRatio < 25) {
    recs.push({
      title: 'IMPROVE OVERALL READ RATIO',
      details: [
        `Your average read ratio is ${summary.avgReadRatio}% (benchmark: 30-40%).`,
        'Medium uses read ratio to rank and recommend posts.',
        'Quick wins:',
        '  - Shorter paragraphs (3-4 sentences max)',
        '  - Use subheadings every 200-300 words',
        '  - Front-load the most valuable insight',
        '  - Add a "TL;DR" or key takeaway at the top',
        '  - End with a clear call-to-action or question',
      ],
    });
  }

  recs.push({
    title: 'COMMENT ENGAGEMENT STRATEGY',
    details: [
      'Reply to every comment within 24 hours if possible.',
      'Use the 1-3-1 structure: 1 hook, 3 content lines, 1 closer.',
      'Share relevant personal experience in your replies.',
      'Ask a follow-up question to keep the conversation going.',
      'Replying boosts your post in Medium\'s algorithm.',
      'Run: node scripts/medium-cdp.js comments "<url>" to check.',
    ],
  });

  return recs;
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
