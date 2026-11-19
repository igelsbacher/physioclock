import fs from "node:fs";
import path from "node:path";

const { version, languages, manuals } = JSON.parse(fs.readFileSync("version.json", "utf8"));
const files = ["index.html", ...languages.flatMap(language =>
  fs.readdirSync(language).filter(file => file.endsWith(".html")).map(file => path.join(language, file))
)];
const errors = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes('<span class="pc-footer-version">Version ' + version + "</span>")) {
    errors.push(file + ": missing public version in footer");
  }
  if (/\b3\.\d+\.\d+\b|\bBuild\s+\d+\b|datenschutz-(?:vor-|1-)|legal\/privacy\/1\.0|web-app\//i.test(source)) {
    errors.push(file + ": development build or old privacy reference");
  }
}
const published = fs.readdirSync("downloads").filter(file => file.endsWith(".pdf"))
  .map(file => "downloads/" + file).sort();
if (JSON.stringify(published) !== JSON.stringify([...manuals].sort())) {
  errors.push("Published PDFs differ from the version manifest");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Version ${version} verified across ${files.length} pages and ${published.length} guides.`);
}
