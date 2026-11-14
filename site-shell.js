"use strict";
/* Unified navigation and link migration for all PhysioClock documentation pages. */
(() => {
 const lang=document.documentElement.lang?.slice(0,2)||"en";
 const L=({
 de:{home:"Startseite",modules:"Trainingsmodule",guides:"Anleitungen",exercises:"Übungen & Bilder",help:"Hilfe",privacy:"Datenschutz",more:"Alle Themen",back:"Zur Startseite",topics:"Themenübersicht",contact:"Kontakt",search:"Übungskatalog",continue:"Mehr entdecken",simple:"Einfach starten",full:"Kompletteinführung",news:"Aktuelles",goal:"Ziele",feel:"Befinden",sets:"Vorlagen",settings:"Einstellungen",important:"Informationen"},
 en:{home:"Home",modules:"Training modules",guides:"Guides",exercises:"Exercises & images",help:"Help",privacy:"Privacy",more:"All topics",back:"Back to home",topics:"Explore topics",contact:"Contact",search:"Exercise catalogue",continue:"Explore more",simple:"Getting started",full:"Full introduction",news:"News",goal:"Goals",feel:"Wellbeing",sets:"Templates",settings:"Settings",important:"Information"},
 fr:{home:"Accueil",modules:"Modules",guides:"Guides",exercises:"Exercices illustrés",help:"Aide",privacy:"Confidentialité",more:"Tous les thèmes",back:"Retour à l’accueil",topics:"Tous les thèmes",contact:"Contact",search:"Catalogue d’exercices",continue:"En savoir plus",simple:"Bien commencer",full:"Introduction complète",news:"Actualités",goal:"Objectifs",feel:"Bien-être",sets:"Modèles",settings:"Réglages",important:"Informations"},
 it:{home:"Home",modules:"Moduli",guides:"Guide",exercises:"Esercizi illustrati",help:"Aiuto",privacy:"Privacy",more:"Tutti gli argomenti",back:"Torna alla home",topics:"Tutti gli argomenti",contact:"Contatto",search:"Catalogo esercizi",continue:"Scopri di più",simple:"Per iniziare",full:"Introduzione completa",news:"Notizie",goal:"Obiettivi",feel:"Benessere",sets:"Modelli",settings:"Impostazioni",important:"Informazioni"}
 })[lang]||{};
 const file=decodeURIComponent(location.pathname.split("/").pop()||"index.html");
 const docs=[
 ["index.html#modules",L.modules],
 ["kompletteinfuehrung.html",L.full],
 ["einfach-starten.html",L.simple],
 ["training-bedienen.html",lang==="de"?"Training bedienen":lang==="fr"?"Piloter sa séance":lang==="it"?"Gestire la sessione":"Training controls"],
 ["uebungen.html",L.exercises],
 ["vorlagen.html",L.sets],
 ["ziele.html",L.goal],
 ["befinden.html",L.feel],
 ["daten.html",lang==="de"?"Datensicherung & iCloud":lang==="fr"?"Sauvegarde et iCloud":lang==="it"?"Backup e iCloud":"Backup & iCloud"],
 ["erinnerungen.html",lang==="de"?"Erinnerungen":lang==="fr"?"Rappels":lang==="it"?"Promemoria":"Reminders"],
 ["support.html",L.help],
 ["datenschutz.html",L.privacy],
 ["medizinprodukt.html",lang==="de"?"Medizinische Einordnung":lang==="fr"?"Qualification médicale":lang==="it"?"Inquadramento medico":"Medical classification"],
 ["impressum.html",lang==="de"?"Impressum":lang==="fr"?"Mentions légales":lang==="it"?"Note legali":"Legal notice"],
 ["news.html",L.news]
 ];
 const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
 const head=document.querySelector("header.site-header,header.site-head,header");
 const langLinks=["de","en","fr","it"].map(code=>'<a href="../'+code+'/'+encodeURIComponent(file)+'" hreflang="'+code+'"'+(code===lang?' aria-current="page"':'')+'>'+({de:"Deutsch",en:"English",fr:"Français",it:"Italiano"})[code]+'</a>').join("");
 const nav=docs.map(([href,label])=>'<a href="'+href+'">'+esc(label)+'</a>').join("");
 if(head)head.outerHTML='<header class="pc-topbar"><div class="wrap pc-topbar-inner"><a class="pc-logo site-brand" href="index.html"><img src="../goal-icon.png" alt="">PhysioClock</a><div class="pc-top-actions"><a class="pc-jump" href="index.html#modules">'+esc(L.modules)+'</a><details class="pc-top-menu"><summary>'+esc(L.more)+'</summary><nav aria-label="'+esc(L.topics)+'">'+nav+'</nav></details></div></div><nav class="wrap pc-language" aria-label="Language / Sprache / Langue / Lingua">'+langLinks+'</nav></header>';
 document.body.classList.add("pc-redesign","pc-subpage");
 const main=document.querySelector("main");
 if(main){
  if(!main.id)main.id="main";
  const breadcrumb=document.createElement("nav");breadcrumb.className="pc-doc-breadcrumb";
  breadcrumb.setAttribute("aria-label",L.back);
  breadcrumb.innerHTML='<a href="index.html">← '+esc(L.back)+'</a><span aria-hidden="true">/</span><a href="index.html#modules">'+esc(L.modules)+'</a>';
  main.insertBefore(breadcrumb,main.firstChild);
 }
 const fragments={
  "regulaer-erste-schritte":"erste-schritte.html","regulaer-training":"training-bedienen.html","regulaer-uebersicht":"trainingsuebersicht.html","regulaer-ziele":"ziele.html","regulaer-befinden":"befinden.html","regulaer-erinnerungen":"erinnerungen.html","regulaer-daten":"daten.html","regulaer-vorlagen":"vorlagen.html","regulaer-quiz":"zielfarben.html","regulaer-routinen":"routinen.html","regulaer-lernen":"index.html#modules","regulaer-hilfe":"support.html","regulaer-datenschutz":"datenschutz.html","regulaer-medizin":"medizinprodukt.html","regulaer-kontakt":"impressum.html","regulaer-news":"news.html","regulaer-wissen":"bewegungswissen.html","regulaer-symbole":"symbole.html","regulaer-plus":"index.html#modules",
  "einfach-start":"einfach-starten.html","einfach-programme":"erste-schritte.html","einfach-einstellungen":"bedienmodus.html","einfach-plus":"index.html#modules",
  "auswahl":"index.html#modules","regulaer":"index.html#modules","einfach":"einfach-starten.html","regulaer-ziele-und-fortschritt":"ziele.html"
 };
 document.querySelectorAll('a[href]').forEach(a=>{
  const raw=a.getAttribute("href");if(!raw||/^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(raw))return;
  let m=raw.match(/^(?:\.\/)?index\.html#([\w-]+)$/i);
  if(m&&fragments[m[1]]) a.setAttribute("href",fragments[m[1]]);
  else if(raw==="#auswahl"||raw==="#regulaer"||raw==="#einfach")a.setAttribute("href","index.html#modules");
  else if(raw==="plus.html"||raw==="lernen.html")a.setAttribute("href","index.html#modules");
 });
 document.querySelectorAll("aside.plus-note, .plus-note").forEach(node=>{
  node.querySelectorAll('a[href*="plus"],a[href*="modules"]').forEach(a=>a.remove());
 });
 document.querySelectorAll(".pc-top-menu nav a").forEach(a=>a.addEventListener("click",()=>{const details=a.closest("details");if(details)details.open=false;}));
 const footer=document.querySelector("footer");
 if(footer){
  footer.classList.add("pc-doc-footer");
  footer.insertAdjacentHTML("beforeend",'<nav aria-label="'+esc(L.continue)+'"><a href="index.html">↑ '+esc(L.home)+'</a><a href="index.html#modules">'+esc(L.modules)+'</a><a href="support.html">'+esc(L.help)+'</a></nav>');
 }
})();
