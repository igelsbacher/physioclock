"use strict";
document.querySelectorAll(".pc-module").forEach((module)=>{
 const trigger=module.querySelector("summary");
 if(!trigger)return;
 module.addEventListener("toggle",()=>{
  if(module.open) {
   document.querySelectorAll(".pc-module").forEach(other=>{if(other!==module)other.open=false;});
  }
 });
});
document.querySelectorAll(".pc-top-menu nav a").forEach(link=>link.addEventListener("click",()=>{const d=link.closest("details");if(d)d.open=false;}));
