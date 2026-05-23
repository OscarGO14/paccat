#!/usr/bin/env node
/**
 * clean.mjs — removes repo noise from paccat without touching game source.
 *
 * Usage:
 *   node .claude/skills/clean-paccat/clean.mjs           # dry run (preview)
 *   node .claude/skills/clean-paccat/clean.mjs --apply   # actually delete
 */

import { existsSync, readdirSync, statSync, unlinkSync, rmdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const DRY = !process.argv.includes('--apply');

if (DRY) console.log('[dry-run] pass --apply to delete for real\n');

const removed = [];
const skipped = [];

function del(rel) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) { skipped.push(rel + ' (missing)'); return; }
  console.log((DRY ? '  would remove: ' : '  removing:     ') + rel);
  if (!DRY) {
    const s = statSync(abs);
    if (s.isDirectory()) rmSync(abs, { recursive: true, force: true });
    else unlinkSync(abs);
  }
  removed.push(rel);
}

// ── 1. JS duplicates of TS files in src/ ─────────────────────────────────────
console.log('=== JS duplicates of TS source files ===');
function walkSrc(dir) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) { walkSrc(abs); continue; }
    if (!entry.endsWith('.js')) continue;
    const tsCounterpart = abs.replace(/\.js$/, '.ts');
    if (existsSync(tsCounterpart)) del(relative(ROOT, abs).replace(/\\/g, '/'));
  }
}
walkSrc(join(ROOT, 'src'));

// ── 2. Root-level debug / test / verify scripts ───────────────────────────────
console.log('\n=== Root-level debug / test / verify files ===');
const rootNoise = [
  'compare_mazes.js',
  'debug.js',
  'test.html',
  'test_game_init.html',
  'test_level3.js',
  'test_level3.mjs',
  'verify_design.js',
  'verify_gamescene_logic.js',
  'verify_maze.js',
];
for (const f of rootNoise) del(f);

// ── 3. Build artifact ─────────────────────────────────────────────────────────
console.log('\n=== Build artifacts ===');
del('tsconfig.tsbuildinfo');

// ── 4. Stale Claude worktrees ─────────────────────────────────────────────────
console.log('\n=== Claude worktree leftovers ===');
del('.claude/worktrees');

// ── 5. Update .gitignore ──────────────────────────────────────────────────────
console.log('\n=== .gitignore ===');
const ignorePath = join(ROOT, '.gitignore');
const current = readFileSync(ignorePath, 'utf8');
const additions = [
  'tsconfig.tsbuildinfo',
  '.claude/worktrees/',
  '# root-level debug/verify scripts',
  'compare_mazes.js',
  'debug.js',
  'test_*.html',
  'test_*.js',
  'test_*.mjs',
  'verify_*.js',
];
const missing = additions.filter(line => line.startsWith('#') || !current.includes(line));
if (missing.length) {
  const next = current.trimEnd() + '\n' + missing.join('\n') + '\n';
  console.log((DRY ? '  would add to .gitignore:\n' : '  updating .gitignore with:\n')
    + missing.map(l => '    ' + l).join('\n'));
  if (!DRY) writeFileSync(ignorePath, next);
} else {
  console.log('  .gitignore already up to date');
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${DRY ? '[dry-run] ' : ''}${removed.length} items targeted, ${skipped.length} skipped.`);
if (DRY) console.log('Run with --apply to execute.');
