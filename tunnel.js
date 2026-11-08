const $=s=>document.getElementById(s);
const years=[[-12000,"BUZUL ÇAĞI"],[-9600,"GÖBEKLİTEPE"],[-3200,"YAZININ DOĞUŞU"],[-1500,"TUNÇ ÇAĞI"],[476,"ORTA ÇAĞ"],[1071,"ANADOLU"],[1453,"İSTANBUL"],[1789,"DEVRİMLER"],[1923,"CUMHURİYET"],[1969,"UZAY ÇAĞI"],[2026,"BUGÜN"],[2050,"GELECEK"],[2100,"GELECEK"],[2300,"BİLİMKURGU"],[2600,"BİLİMKURGU"],[3000,"ULTRA ZEKÂ"]];
let gate,interval=null,i=0,done=false;
const fmt=n=>n<0?"MÖ "+Math.abs(n).toLocaleString("tr-TR"):String(n);
function finish(){if(!gate)return;clearInterval(interval);gate.remove();gate=null;done=true;document.body.style.overflow="";}
function enter(){finish();location.href="./time.html";}
function showGate(){
 if(gate)return;
 gate=document.createElement("div");gate.className="time-gateway";
 gate.innerHTML='<div class="tg-background"></div><div class="tg-perspective">'+Array.from({length:6},()=>'<span class="tg-ring"></span>').join("")+Array.from({length:28},(_,j)=>'<i class="tg-star" style="--rot:'+j*13+'deg;--delay:-'+(j%9)*.27+'s;--op:'+(0.4+(j%6)*.09)+'"></i>').join("")+'</div><div class="tg-content"><p class="tg-eyebrow">SIMÜLAKRON · ZAMAN KAPISI</p><div class="tg-sign">◈</div><h2>Bir adımda <em>binlerce yıl.</em></h2><strong class="tg-year" id="tg-year">MÖ 12000</strong><div class="tg-era" id="tg-era">BUZUL ÇAĞI</div><p class="tg-lede">Gelecekten gelen kurgusal Ultra Zekâ rehberinle zamanın katmanlarını keşfet.</p><div class="tg-progress"><span id="tg-progress"></span></div><div class="tg-actions"><button class="tg-enter" id="tg-enter">ZAMAN TÜNELİNE GİR →</button><button id="tg-skip">Giriş animasyonunu geç</button></div></div><p class="tg-disclaimer">GERÇEK ZAMAN YOLCULUĞU DEĞİL · TARİHSEL VE KURGUSAL 3D SİMÜLASYON</p>';
 document.body.appendChild(gate);document.body.style.overflow="hidden";
 gate.querySelector("#tg-enter").addEventListener("click",enter);
 gate.querySelector("#tg-skip").addEventListener("click",finish);
 const spin=()=>{const v=years[i%years.length];$("#tg-year").textContent=fmt(v[0]);$("#tg-era").textContent=v[1];$("#tg-progress").style.width=Math.min(100,(i+1)/years.length*100)+"%";i++;};
 spin();interval=setInterval(()=>{spin();if(i>=years.length){clearInterval(interval);gate.querySelector("#tg-enter").textContent="ZAMAN KAŞİFİNİ BAŞLAT →";}},360);
 gate.addEventListener("keydown",e=>{if(e.key==="Escape")finish()});
}
const query=new URLSearchParams(location.search);
if(query.get("tunnel")==="1"){history.replaceState(null,"",location.pathname+location.hash);showGate();}
else{let firstVisit=true;try{firstVisit=sessionStorage.getItem("simulakron-intro-seen")!=="1";if(firstVisit)sessionStorage.setItem("simulakron-intro-seen","1")}catch(e){}if(firstVisit)showGate();const openButton=document.createElement("button");openButton.type="button";openButton.className="tunnel-fab";openButton.textContent="◈ ZAMAN KAPISI";openButton.title="Zaman tünelini aç";openButton.addEventListener("click",showGate);document.body.appendChild(openButton);}