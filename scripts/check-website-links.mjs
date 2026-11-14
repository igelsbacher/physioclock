import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
let pageCount = 0;
let checkedLinks = 0;
let anchorChecks = 0;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(location) : [location];
  });
}
const files = walk(root).filter(file => file.endsWith(".html"));
const cache = new Map();
function html(file) {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(file, "utf8"));
  return cache.get(file);
}
function anchors(file) {
  const ids = new Set();
  for (const match of html(file).matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/gi)) {
    ids.add(match[2]);
  }
  return ids;
}
for (const file of files) {
  pageCount++;
  const source = path.relative(root, file);
  for (const match of html(file).matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)) {
    const raw = match[2].replaceAll("&amp;", "&");
    if (!raw || /^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(raw)) continue;
    checkedLinks++;
    let url;
    try {
      url = new URL(raw, "https://physioclock.local/" + source.replaceAll(path.sep, "/"));
    } catch {
      errors.push(`${source}: invalid link ${raw}`);
      continue;
    }
    if (url.hostname !== "physioclock.local") continue;
    let targetPath = decodeURIComponent(url.pathname);
    if (targetPath.startsWith("/physioclock-website/")) {
      targetPath = targetPath.slice("/physioclock-website".length);
    }
    const target = path.resolve(root, "." + targetPath);
    if (target !== root && !target.startsWith(root + path.sep)) {
      errors.push(`${source}: link outside repository ${raw}`);
      continue;
    }
    const targetFile = fs.existsSync(target) && fs.statSync(target).isDirectory()
      ? path.join(target, "index.html") : target;
    if (!fs.existsSync(targetFile)) {
      errors.push(`${source}: missing file ${raw}`);
      continue;
    }
    if (url.hash && targetFile.endsWith(".html")) {
      anchorChecks++;
      const fragment = decodeURIComponent(url.hash.slice(1));
      if (fragment && !anchors(targetFile).has(fragment)) {
        errors.push(`${source}: missing anchor ${raw}`);
      }
    }
  }
}
console.log(`PhysioClock: ${pageCount} HTML pages, ${checkedLinks} internal links, ${anchorChecks} fragment links verified.`);
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`FAILED: ${errors.length} broken internal links.`);
  process.exitCode = 1;
} else {
  console.log("PASS: all internal HTML navigation targets exist.");
}
