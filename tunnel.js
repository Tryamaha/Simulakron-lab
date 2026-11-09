/* Simülakron V3 entry routing.
 * On first session visit the real 3D ChronoWorm corridor, not the old 2D splash.
 * Returning to Atlas does not redirect again.
 * Add ?atlas=1 to deliberately stay on the encyclopedia.
 */
(()=>{
 const qs=new URLSearchParams(location.search);
 const skip=qs.has("atlas")||location.hash.length>0;
 let first=true;
 try{first=sessionStorage.getItem("simulakron-v3-visited")!=="yes";sessionStorage.setItem("simulakron-v3-visited","yes")}catch(e){}
 if(qs.has("tunnel")||qs.has("chrono")||(first&&!skip)){
  location.replace("./chrono.html?arrival=1");return;
 }
 const b=document.createElement("a");b.className="tunnel-fab";
 b.href="./chrono.html";b.title="Yeni 3D ChronoWorm zaman koridoruna gir";
 b.textContent="◈ CHRONOWORM V3";
 b.style.cssText="position:fixed;z-index:40;right:18px;bottom:18px;background:#e5b986;color:#132731;border-radius:11px;padding:14px 18px;font:800 12px system-ui,sans-serif;text-decoration:none;box-shadow:0 6px 23px #0008;border:1px solid #ffe1b7";
 document.body.appendChild(b);
})();