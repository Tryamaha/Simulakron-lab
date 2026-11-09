const $=s=>document.getElementById(s);
const years=[[-12000,"BUZUL ÇAĞI"],[-9600,"GÖBEKLİTEPE"],[-3200,"YAZININ DOĞUŞU"],[-1500,"TUNÇ ÇAĞI"],[476,"ORTA ÇAĞ"],[1071,"ANADOLU"],[1453,"İSTANBUL"],[1789,"DEVRİMLER"],[1923,"CUMHURİYET"],[1969,"UZAY ÇAĞI"],[2026,"BUGÜN"],[2050,"GELECEK"],[2100,"GELECEK"],[2300,"BİLİMKURGU"],[2600,"BİLİMKURGU"],[3000,"ULTRA ZEKÂ"]];
let gate,interval=null,i=0,done=false;
const fmt=n=>n<0?"MÖ "+Math.abs(n).toLocaleString("tr-TR"):String(n);
function finish(){if(!gate)return;clearInterval(interval);gate.remove();gate=null;done=true;document.body.style.overflow="";}
function enter(){finish();location.href="./time.html";}
function showGate(){
 if(gate)return;
 gate=document.createElement("div");gate.className="time-gateway";
 gate.innerHTML='<div class="tg-background"></div><div class="tg-perspective">'+Array.from({length:6},()=>'<span class="tg-ring"></span>').join("")+Array.from({length:28},(_,j)=>'<i class="tg-star" style="--x:'+((j*37)%100)+'%;--y:'+((j*61)%100)+'%;--rot:'+j*13+'deg;--delay:-'+(j%9)*.27+'s;--op:'+(0.4+(j%6)*.09)+'"></i>').join("")+'</div><div class="tg-content"><p class="tg-eyebrow">SIMÜLAKRON · ZAMAN KAPISI</p><div class="tg-sign">◈</div><h2>Bir adımda <em>binlerce yıl.</em></h2><strong class="tg-year" id="tg-year">MÖ 12000</strong><div class="tg-era" id="tg-era">BUZUL ÇAĞI</div><p class="tg-lede">Gelecekten gelen kurgusal Ultra Zekâ rehberinle zamanın katmanlarını keşfet.</p><div class="tg-metric" id="tg-metric" aria-live="polite">Dönemler arasındaki tarihsel aralık hesaplanıyor…</div><div class="tg-progress"><span id="tg-progress"></span></div><div class="tg-actions"><button class="tg-enter" id="tg-enter">ZAMAN TÜNELİNE GİR →</button><button id="tg-skip">Giriş animasyonunu geç</button></div></div><p class="tg-disclaimer">ZAMAN ÇİZELGESİ DOĞRUSAL, ANİMASYONUN ADIMLARI EŞİT SÜRELİDİR · FİZİKSEL ZAMAN YOLCULUĞU DEĞİL</p>';
 document.body.appendChild(gate);document.body.style.overflow="hidden";
 gate.querySelector("#tg-enter").addEventListener("click",enter);
 gate.querySelector("#tg-skip").addEventListener("click",finish);
 const astro=y=>y<0?y+1:y;
 const spin=()=>{
  const v=years[i%years.length];
  $("#tg-year").textContent=fmt(v[0]);$("#tg-era").textContent=v[1];
  const distance=i===0?0:astro(v[0])-astro(years[i-1][0]);
  $("#tg-metric").textContent=(i===0?"Başlangıç noktası":("Önceki durağa göre "+distance.toLocaleString("tr-TR")+" takvim yılı"))+
    " · "+(v[0]>2026?"BİLİMKURGU":"TARİHSEL ZAMAN ÇİZGİSİ");
  // Timeline progress is proportional to elapsed calendar years, not equal stop count.
  const min=astro(years[0][0]),max=astro(years[years.length-1][0]);
  const pct=(astro(v[0])-min)/(max-min)*100;
  $("#tg-progress").style.width=Math.max(0,Math.min(100,pct))+"%";
  i++;
 };
 spin();interval=setInterval(()=>{spin();if(i>=years.length){clearInterval(interval);gate.querySelector("#tg-enter").textContent="ZAMAN KAŞİFİNİ BAŞLAT →";}},360);
 gate.addEventListener("keydown",e=>{if(e.key==="Escape")finish()});
}
const query=new URLSearchParams(location.search);
if(query.get("tunnel")==="1"){history.replaceState(null,"",location.pathname+location.hash);showGate();}
else{let firstVisit=true;try{firstVisit=sessionStorage.getItem("simulakron-intro-seen")!=="1";if(firstVisit)sessionStorage.setItem("simulakron-intro-seen","1")}catch(e){}if(firstVisit)showGate();const openButton=document.createElement("button");openButton.type="button";openButton.className="tunnel-fab";openButton.textContent="◈ ZAMAN KAPISI";openButton.title="Zaman tünelini aç";openButton.addEventListener("click",showGate);document.body.appendChild(openButton);}