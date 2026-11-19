import fs from 'node:fs';
import path from 'node:path';
import { content } from './timer-content.mjs';
import crypto from 'node:crypto';

const langs = Object.keys(content);
const names = {de:'Deutsch',en:'English',fr:'Français',it:'Italiano'};
const version = '1.2';
const canonical = {start:'erste-schritte.html',control:'training-bedienen.html',sets:'vorlagen.html',settings:'bedienmodus.html',plan:'routinen.html',history:'trainingsuebersicht.html',backup:'daten.html',sync:'synchronisation.html',icons:'symbole.html',premium:'plus.html',support:'support.html',legal:'impressum.html',ack:'bestaetigungen.html',news:'news.html'};
const aliases = {'einfach-starten.html':'start','lernen.html':'start','erinnerungen.html':'plan','befinden.html':'history','ziele.html':'history','zielfarben.html':'history','uebungen.html':'sets','bewegen.html':'settings','bewegungswissen.html':'settings','medizinprodukt.html':'legal'};
const modules = ['start','control','sets','plan','history','backup'];
const allGuide = ['start','control','sets','settings','plan','history','backup','sync','icons','premium','support','ack'];
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const p = s => '<p>'+esc(s)+'</p>';
const a = (url,label,cls='') => `<a href="${esc(url)}"${cls?' class="'+cls+'"':''}>${esc(label)}</a>`;
const docs = JSON.parse(fs.readFileSync('legal/current-documents.json','utf8'));
const legalManifest = {version:docs[0].version,sha256:{privacy:{},usage:{}}};
for(const d of docs){
 const digest=crypto.createHash('sha256').update(d.text,'utf8').digest('hex');
 if(digest!==d.textSHA256) throw new Error('Legal checksum mismatch '+d.kind+' '+d.language);
 const dir=`legal/${d.kind}/${d.version}`;fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(dir+'/'+d.language+'.txt',d.text);legalManifest.sha256[d.kind][d.language]=digest;
}
fs.writeFileSync('legal/manifest-v1.2.json',JSON.stringify(legalManifest,null,2)+'\n');
const pdfName = l => `downloads/PhysioClock_Guide_${l.toUpperCase()}_V1.pdf`;
const langTitle = (c,k)=>c.pages[k][0];
function shell(lang,file,body,title,root=false){
 const c=content[lang], pre=root?'':'../', dir=root?lang+'/':'';
 const route = f=>dir+f;
 const languages=langs.map(l=>`<a href="${pre}${l}/${file}" hreflang="${l}"${l===lang?' aria-current="page"':''}>${names[l]}</a>`).join('');
 const menu=[...allGuide.map(k=>a(route(canonical[k]),langTitle(c,k))),a(route('kompletteinfuehrung.html'),c.pdf),a(route('datenschutz.html'),c.privacy),a(route('impressum.html'),c.legal),a(route('news.html'),c.news)].join('');
 return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#142922"><meta name="description" content="${esc(c.sub)}"><title>${esc(title)} · Timer</title><link rel="icon" href="${pre}favicon.svg"><link rel="stylesheet" href="${pre}timer.css?v=1.2"></head><body><a class="skip" href="#main">${esc(c.skip)}</a><header class="top"><div class="wrap top-row"><a class="brand" href="${route('index.html')}"><img src="${pre}goal-icon.png" alt="">Timer</a><nav class="actions" aria-label="${esc(c.topics)}">${a(route('index.html#quick-start'),c.quick)}${a(route('index.html#modules'),c.guide)}<details class="menu"><summary>${esc(c.topics)}</summary><div class="menu-list">${menu}</div></details></nav></div><nav class="wrap pc-language" aria-label="Language / Sprache / Langue / Lingua">${languages}</nav></header><main class="wrap" id="main">${body}</main><footer class="wrap footer"><div class="footer-row"><strong>Timer · Heinz Josef Igelsbacher</strong><nav>${a(route('index.html'),c.homeLink)}${a(route('index.html#modules'),c.guide)}${a(route('datenschutz.html'),c.privacy)}${a(route('impressum.html'),c.legal)}${a('mailto:iphysioclock@gmail.com','iphysioclock@gmail.com')}</nav><span class="pc-footer-version">Version ${version}</span></div><section class="storage"><strong>${esc(c.cookies)}</strong>${p(c.cookieText)}${a(route('datenschutz.html#website-speicher'),c.privacy)} <button type="button" hidden data-session-preferences data-enable="${esc(c.remember)}" data-disable="${esc(c.forget)}" data-active="${esc(c.remembered)}" data-error="${esc(c.storageError)}" aria-pressed="false">${esc(c.remember)}</button><span data-session-status role="status"></span></section></footer><script defer src="${pre}browser-language.js?v=5"></script><script defer src="${pre}timer-photos.js"></script></body></html>`;
}
function optional(c){return `<section class="notice"><h2>${esc(c.optional)}</h2>${p(c.optionalText)}</section>`;}
function home(l,root=false){
 const c=content[l],pre=root?'':'../',dir=root?l+'/':'';
 const cards=modules.map((k,i)=>{let [title,...steps]=c.pages[k];return `<details class="module"><summary><small>0${i+1}</small><h3>${esc(title)}</h3>${p(steps[0])}</summary><div class="module-body"><ol>${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="pc-checklist"><label><input type="checkbox"> ${esc(title)}</label></div>${a(dir+canonical[k],c.guide,'button')}</div></details>`;}).join('');
 return `<section class="hero"><img id="hero-photo" src="${pre}neutral-lake.jpg" data-second="${pre}neutral-hourglass.jpg" alt="" width="1672" height="941"><div class="hero-copy"><span class="eyebrow">TIMER · iPhone &amp; iPad</span><h1>${esc(c.home)}</h1>${p(c.sub)}${a('#quick-start',c.quick,'button')}</div><div class="photo-nav"><button data-photo-prev aria-label="${esc(c.prev)}">‹</button><button data-photo-next aria-label="${esc(c.next)}">›</button></div></section><section class="notice">${p(c.free)}${a(dir+'plus.html','Timer Premium')}</section><section id="quick-start"><h2>${esc(c.quick)}</h2><ol class="quick">${c.pages.start.slice(1).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section><section id="modules"><h2>${esc(c.guide)}</h2><div class="modules">${cards}</div></section>${optional(c)}<section class="resources"><h2>${esc(c.topics)}</h2><div class="links">${['settings','sync','icons','premium','support','ack','news'].map(k=>a(dir+canonical[k],langTitle(c,k),'resource')).join('')}${a(dir+'kompletteinfuehrung.html',c.pdf,'resource')}${a(dir+'datenschutz.html',c.privacy,'resource')}${a(dir+'impressum.html',c.legal,'resource')}</div></section>`;
}
const sub=(c,title,body)=>`<div class="breadcrumb">${a('index.html',c.homeLink)} / ${a('index.html#modules',c.guide)}</div><article class="article"><h1>${esc(title)}</h1>${body}</article>`;
const section=(title,items,id='')=>`<section class="guide-section"${id?' id="'+id+'"':''}><h2>${esc(title)}</h2>${items.map(p).join('')}</section>`;
function legalBody(l){
 const c=content[l],doc=docs.find(d=>d.kind==='privacy'&&d.language===l), blocks=doc.text.trim().split('\n\n');
 let body=p('Version '+doc.version+' · '+doc.effectiveFrom),i=0;
 // Retain the exact current app notice; meaningful anchors survive old URLs.
 const patterns=[/Cookies|Cookie e memoria/i,/Premium.*(?:Apple|via)/i,/Lokale Bestätigungen|Local acknowledgements|Confirmations locales|Conferme locali/i,/Synchronisationsmodus|Sync mode|Mode de synchronisation|Modalità di sincronizzazione/i];
 const ids=['website-speicher','plus-kauf','bestaetigungen','sync-activity'];
 for(const b of blocks.slice(1)){
  const match=patterns.findIndex(x=>x.test(b)&&b.length<110);
  if(b.length<110 && !/[.!?]$/.test(b)){body+=`<h2${match>=0?' id="'+ids[match]+'"':' id="privacy-'+i+++'"'}>${esc(b)}</h2>`;}
  else body+=p(b);
 }
 body+=`<p>${a('../legal/privacy/'+doc.version+'/'+l+'.txt',c.privacy+' · '+doc.version)} · ${a('../legal/usage/'+doc.version+'/'+l+'.txt',c.pages.ack[0]+' · '+doc.version)}</p><p>${a('../'+pdfName(l),c.pdf)}</p>`;
 return sub(c,c.privacy,body);
}
for(const l of langs){
 const c=content[l];
 fs.writeFileSync(l+'/index.html',shell(l,'index.html',home(l),c.home));
 for(const [k,file] of Object.entries(canonical)){
  const [title,...items]=c.pages[k];
  let body=items.map(p).join('');
  if(k==='settings')body+=optional(c);
  if(k==='legal') body+=`<p>${a('mailto:iphysioclock@gmail.com','iphysioclock@gmail.com')} · ${a('mailto:dev.igelsbacher@icloud.com','dev.igelsbacher@icloud.com')}</p><p>${a('datenschutz.html',c.privacy)} · ${a('https://www.swissmedic.ch/','Swissmedic')}</p>`;
  if(k==='ack')body+=`<p>${a('../legal/usage/1.2/'+l+'.txt',c.pages.ack[0]+' · 1.2')} · ${a('datenschutz.html',c.privacy)}</p>`;
  if(k==='backup')body+=`<p>${a('../PhysioClock_Trainingsvorlage_4_Sprachen.csv','CSV')} · ${a('../PhysioClock_Beispielimport_4_Sprachen.json','JSON')}</p>`;
  if(k==='support')body+=`<p>${a('mailto:iphysioclock@gmail.com','iphysioclock@gmail.com')}</p>`;
  fs.writeFileSync(l+'/'+file,shell(l,file,sub(c,title,body),title));
 }
 for(const [file,k] of Object.entries(aliases)){
  const [title,...items]=c.pages[k];const body=items.map(p).join('')+(k==='settings'?optional(c):'')+`<p>${a(canonical[k],c.guide)} · ${a('index.html',c.homeLink)}</p>`;
  fs.writeFileSync(l+'/'+file,shell(l,file,sub(c,title,body),title));
 }
 const full=allGuide.map(k=>section(c.pages[k][0],c.pages[k].slice(1),k)).join('')+optional(c)+`<p>${a('../'+pdfName(l),c.pdf,'button')}</p>`;
 fs.writeFileSync(l+'/kompletteinfuehrung.html',shell(l,'kompletteinfuehrung.html',sub(c,c.guide,full),c.guide));
 fs.writeFileSync(l+'/datenschutz.html',shell(l,'datenschutz.html',legalBody(l),c.privacy));
}
fs.writeFileSync('index.html',shell('en','index.html',home('en',true),content.en.home,true));
for(const f of ['datenschutz.html','impressum.html','news.html','support.html']){
 fs.writeFileSync(f,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=en/${f}"><title>Timer</title></head><body>${a('en/'+f,'Timer')}</body></html>`);
}
fs.writeFileSync('version.json',JSON.stringify({name:'Timer',version,languages:langs,manuals:langs.map(pdfName)},null,2)+'\n');
fs.writeFileSync('scripts/timer-guide-content.json',JSON.stringify(content,null,2)+'\n');
// No body-part field: empty values would still be movement metadata.
fs.writeFileSync('PhysioClock_Trainingsvorlage_4_Sprachen.csv','sprache,uebung,dauer_sekunden,set_name\nde,Fokus,300,Timer\nen,Focus,300,Timer\nfr,Concentration,300,Timer\nit,Concentrazione,300,Timer\n');
fs.writeFileSync('PhysioClock_Beispielimport_4_Sprachen.json',JSON.stringify({format:'PhysioClock.Set',schemaVersion:1,setName:'Timer',exercises:[{name:'Focus',seconds:300},{name:'Pause',seconds:60},{name:'Review',seconds:120}],options:{rounds:1,restSeconds:0},movementEnabled:false},null,2)+'\n');
