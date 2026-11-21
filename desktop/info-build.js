'use strict';
// Scrive info-build.json: commit del gioco e data della build. In CI arrivano da GITHUB_SHA; sul PC da git (se c'è).
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function commit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: __dirname, encoding: 'utf8' }).trim(); } catch { return null; }
}
function scrivi() {
  const sha = commit();
  const info = { commit: sha, commitBreve: sha ? sha.slice(0, 7) : null, data: new Date().toISOString() };
  fs.writeFileSync(path.join(__dirname, 'info-build.json'), JSON.stringify(info, null, 2) + '\n');
  return info;
}
if (require.main === module) console.log('info-build.json', scrivi());
module.exports = { scrivi };
