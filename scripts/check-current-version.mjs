import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const currentVersion="3.32.12";
const currentBuild=93;
function files(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>{
    if(x.name===".git"||x.name==="node_modules")return [];
    const p=path.join(dir,x.name);
    return x.isDirectory()?files(p):[p];
  });
}
const htmlFiles=files(root).filter(x=>x.endsWith(".html"));
let active=0;
for(const filename of htmlFiles){
  const rel=path.relative(root,filename).replaceAll(path.sep,"/");
  // Historical privacy policies retain their original policy version identifiers.
  if(/(?:^|\/)datenschutz-(?:vor-|1-)/.test(rel))continue;
  const source=fs.readFileSync(filename,"utf8");
  active++;
  for(const m of source.matchAll(/PhysioClock_Guide_[A-Z]{2}_Build_(\d+)\.pdf/g)){
    if(Number(m[1])!==currentBuild)errors.push(rel+": outdated PDF link "+m[0]);
  }
  for(const m of source.matchAll(/\b3\.\d+\.\d+\b/g)){
    if(m[0]!==currentVersion)errors.push(rel+": outdated app version "+m[0]);
  }
  for(const m of source.matchAll(/\b(?:Build|build)\s+(\d+)\b/g)){
    if(Number(m[1])!==currentBuild)errors.push(rel+": outdated build "+m[0]);
  }
}
const pdfFiles=files(path.join(root,"downloads")).filter(x=>x.toLowerCase().endsWith(".pdf"));
const expected=["DE","EN","FR","IT"].map(l=>"PhysioClock_Guide_"+l+"_Build_93.pdf");
for(const l of expected){
 if(!fs.existsSync(path.join(root,"downloads",l)))errors.push("Missing current PDF "+l);
}
for(const file of pdfFiles){
 if(!expected.includes(path.basename(file)))errors.push("Obsolete public PDF "+path.basename(file));
}
console.log("Version audit:",active,"active HTML pages;",pdfFiles.length,"current PDFs");
if(errors.length){
 console.error(errors.join("\n"));console.error("FAIL:",errors.length,"version or build references outdated.");
 process.exitCode=1;
}else console.log("PASS: All active app-version references use 3.32.12 (Build 93).");
