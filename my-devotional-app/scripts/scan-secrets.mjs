import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const FILE_GLOBS = [
  '--hidden',
  '-g',
  '!.git',
  '-g',
  '!node_modules',
  '-g',
  '!dist',
  '-g',
  '!.vite',
];

const patterns = [
  {
    id: 'postgres_url',
    regex: /postgres(?:ql)?:\/\/[^\s'"`]+/gi,
    description: 'Hardcoded Postgres connection URL',
  },
  {
    id: 'jwt_like',
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
    description: 'JWT-like token in plaintext',
  },
  {
    id: 'quoted_secret_assignment',
    regex: /\b(?:password|token|secret|api[_-]?key)\b\s*[:=]\s*['"`][^'"`\n]{10,}['"`]/gi,
    description: 'Quoted secret-like assignment',
  },
];

const allowedSnippets = [
  /your-/i,
  /example/i,
  /replace-/i,
  /process\.env\./i,
  /<redacted>/i,
  /postgres(?:ql)?:\/\/\.\.\./i,
];

function isAllowed(match) {
  return allowedSnippets.some((rule) => rule.test(match));
}

function listFiles() {
  const cmd = `rg --files ${FILE_GLOBS.join(' ')}`;
  const output = execSync(cmd, { encoding: 'utf8' });
  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !file.startsWith('scripts/scan-secrets.mjs'));
}

function lineOf(content, index) {
  const head = content.slice(0, index);
  return head.split('\n').length;
}

const findings = [];

for (const file of listFiles()) {
  const ext = path.extname(file);
  const isTextLike = !ext || /\.(md|ts|tsx|js|mjs|json|sql|css|html|env|yml|yaml|toml)$/i.test(ext) || path.basename(file).startsWith('.env');
  if (!isTextLike) continue;

  const content = await readFile(file, 'utf8');

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern.regex)) {
      const snippet = match[0];
      if (isAllowed(snippet)) continue;

      const line = lineOf(content, match.index ?? 0);
      findings.push({
        file,
        line,
        description: pattern.description,
        snippet: snippet.slice(0, 100),
      });
    }
  }
}

if (findings.length > 0) {
  console.error('Potential secrets found:');
  for (const finding of findings) {
    console.error(
      `${finding.file}:${finding.line} ${finding.description}\n  ${finding.snippet}`
    );
  }
  process.exit(1);
}

console.log('No potential hardcoded secrets detected.');
