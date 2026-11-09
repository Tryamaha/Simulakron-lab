import {EXHIBITS,MIN_YEAR,MAX_YEAR,scaleYear,unscaleYear,yearText,elapsed,nearest} from "./chrono-data.js";
import {createChronoRenderer} from "./chrono-render.js";
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LABEL={evidence:"TARİHSEL / ARKEOLOJİK KANIT",inference:"DOLAYLI KANIT / YORUM",fiction:"GELECEK KURGUSU / SENARYO"};
let chosen=EXHIBITS[0],engine=null,pressed=null;
const slider=$("cw-slider"),rail=$("cw-events"),viewport=$("cw-viewport"),play=$("cw-play");
let lastPublishedYear=null;
function at(x){return EXHIBITS.findIndex(y=>y.year===x.year);}
function quote(item){
 if(item.type==="fiction")return "Kaşif, "+yearText(item.year)+" arşivi yok. Bu dönem tahmin ve kurgu alanı. "+item.unknown;
 if(item.type==="inference")return "Kaşif, "+yearText(item.year)+" katmanındayız. Eldeki bulgular yorum gerektiriyor. "+item.unknown;
 return "Kaşif, "+yearText(item.year)+". Bu olaya dair kanıtlar araştırılabilir; gördüğün koridor gerçek görüntü kaydı değildir. "+item.unknown;
}
function renderItem(item,scroll=false){
 if(!item)return;chosen=item;
 $("cw-category").textContent=item.group;$("cw-precision").textContent=item.precision;
 $("cw-title").textContent=item.title;$("cw-description").textContent=item.description;
 $("cw-proof").textContent=item.evidence;$("cw-unknown").textContent=item.unknown;
 $("cw-voice").textContent=quote(item);
 const badge=$("cw-evidence-level");badge.className="evidence-level"+(item.type==="evidence"?"":" "+item.type);
 badge.querySelector("span").textContent=LABEL[item.type];
 const refs=$("cw-sources");refs.replaceChildren();
 if(item.sources?.length){for(const x of item.sources){const a=document.createElement("a");a.href=x.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=x.label+" ↗";refs.append(a);}}
 else refs.textContent="Doğrudan birincil kaynak bağlantısı henüz eklenmedi. Bu başlangıç katalog kaydını ayrıca doğrula.";
 for(const b of rail.children){
  const active=b.dataset.year===String(item.year);b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active));
  if(active&&scroll)b.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
 }
 $("cw-prev").disabled=at(item)===0;$("cw-next").disabled=at(item)===EXHIBITS.length-1;
 $("cw-nearest").textContent="ARŞİV DURAĞI: "+item.label.toLocaleUpperCase("tr");
 $("cw-mode").textContent=item.type==="fiction"?"KURGU / SENARYO":"TAKVİM ÖLÇEĞİ";
}
function renderProgress(t,meta={}){
 const y=unscaleYear(t);$("cw-year").textContent=yearText(y);slider.value=String(Math.round(t*10000));
 if(lastPublishedYear!==y){lastPublishedYear=y;document.dispatchEvent(new CustomEvent("simulakron:time-coordinate",{detail:{year:y}}));}
 const delta=elapsed(chosen.year,y);
 $("cw-interval").textContent=delta===0?"SEÇİLEN DÖNEM":Math.abs(delta).toLocaleString("tr-TR")+" YIL "+(delta>0?"SONRA":"ÖNCE");
 if(meta.autoplay){const active=nearest(t);if(active!==chosen)renderItem(active,false);}
}
function updatePlay(){
 const active=engine?.isPlaying()??false;
 play.textContent=active?"Ⅱ YOLCULUĞU DURDUR":"▶ OTOMATİK GEÇİŞ";
 play.setAttribute("aria-pressed",String(active));
}
function changePosition(t,immediate=false){
 const v=clamp(t,0,1);
 if(engine?.isReady()){immediate?engine.seek(v):engine.go(v);}
 else renderProgress(v);
 const x=nearest(v);if(x!==chosen)renderItem(x,false);
 updatePlay();
}
function toExhibit(item){renderItem(item,true);changePosition(scaleYear(item.year));}
function next(delta){toExhibit(EXHIBITS[clamp(at(chosen)+delta,0,EXHIBITS.length-1)])}
for(const item of EXHIBITS){
 const b=document.createElement("button");b.type="button";b.className="event"+(item.type==="fiction"?" fiction":"");b.dataset.year=String(item.year);
 b.innerHTML='<span class="year">'+safe(yearText(item.year))+'</span><strong>'+safe(item.label)+'</strong><small>'+safe(item.group)+'</small>';
 b.addEventListener("click",()=>toExhibit(item));rail.appendChild(b);
}
const args=new URLSearchParams(location.search),n=Number(args.get("year"));
const initial=args.has("year")&&Number.isFinite(n)&&n!==0?clamp(n,MIN_YEAR,MAX_YEAR):MIN_YEAR;
renderItem(nearest(scaleYear(initial)));
function onStatus(s){
 if(s==="unavailable"){$("cw-fallback").hidden=false;$("cw-loading").remove();$("render-status").textContent="◌ 2D TARİH ARŞİVİ";return;}
 if(s==="running"){$("render-status").textContent="● 3D KORİDOR AKTİF";$("cw-loading").classList.add("hide");setTimeout(()=>$("cw-loading")?.remove(),600);}
 if(s==="playing")$("render-status").textContent="▶ KORİDOR HAREKETLİ";
 if(s==="paused")$("render-status").textContent="◉ MANUEL KEŞİF";
 if(s==="ended")$("render-status").textContent="◈ YIL 3000 / KURGU";
 updatePlay();
}
engine=createChronoRenderer({canvas:$("cw-canvas"),viewport,onProgress:renderProgress,onStatus,onHuman:(message)=>{$("cw-human-status").textContent=message}});
changePosition(scaleYear(initial),true);
const humanButton=$("cw-human-load");
humanButton?.addEventListener("click",async()=>{
  if(!engine?.isReady()){
    $("cw-human-status").textContent="3D koridor bu cihazda çalışmıyor; kaynak sayfasından modeli açabilirsin.";
    return;
  }
  humanButton.disabled=true;
  humanButton.textContent="◌ ANATOMİK MODEL İNDİRİLİYOR";
  const today=EXHIBITS.find(e=>e.year===2026);
  if(today){renderItem(today,true);changePosition(scaleYear(2026));}
  const success=await engine.loadHuman();
  humanButton.disabled=Boolean(success);
  humanButton.textContent=success?"✓ İNSAN REFERANSI HAZIR":"↺ YÜKLEMEYİ TEKRAR DENE";
});
const speedControl=$("cw-speed"),qualityControl=$("cw-quality");
speedControl?.addEventListener("input",e=>{
  const v=Number(e.target.value);
  engine?.setSpeed(v);
  $("cw-speed-label").textContent=v.toLocaleString("tr-TR",{minimumFractionDigits:1,maximumFractionDigits:2})+"×";
});
qualityControl?.addEventListener("change",e=>{
  const v=Number(e.target.value);engine?.setQuality(v);
  $("cw-quality-label").textContent=v>=.9?"YÜKSEK":v>=.5?"DENGELİ":"DÜŞÜK";
});
if(window.matchMedia?.("(max-width: 650px)")?.matches){
  qualityControl.value=".65";qualityControl.dispatchEvent(new Event("change"));
}

if(args.has("arrival") && !(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)){
 engine?.play();updatePlay();
}
$("cw-prev").addEventListener("click",()=>next(-1));
$("cw-next").addEventListener("click",()=>next(1));
play.addEventListener("click",()=>{
 if(!engine?.isReady()){alert("Cihaz bu 3D modeli desteklemiyor. Tarih şeridini kullanabilirsin.");return;}
 engine.isPlaying()?engine.pause():engine.play();updatePlay();
});
slider.addEventListener("input",e=>changePosition(Number(e.target.value)/10000,true));
viewport.addEventListener("wheel",e=>{
 if(Math.abs(e.deltaY)<1)return;e.preventDefault();
 changePosition((engine?.target()??Number(slider.value)/10000)+e.deltaY*.00023);
},{passive:false});
viewport.addEventListener("pointerdown",e=>{
 if(e.pointerType==="mouse"&&e.button!==0)return;
 pressed={id:e.pointerId,y:e.clientY,t:engine?.target()??Number(slider.value)/10000};
 viewport.setPointerCapture?.(e.pointerId);
});
viewport.addEventListener("pointermove",e=>{
 if(!pressed||pressed.id!==e.pointerId)return;
 changePosition(pressed.t+(pressed.y-e.clientY)/Math.max(200,viewport.clientHeight)*.48);
});
viewport.addEventListener("pointerup",e=>{if(pressed?.id===e.pointerId)pressed=null});
viewport.addEventListener("pointercancel",e=>{if(pressed?.id===e.pointerId)pressed=null});
viewport.addEventListener("keydown",e=>{
 if(["ArrowRight","ArrowDown","PageDown"].includes(e.key)){e.preventDefault();next(1);}
 if(["ArrowLeft","ArrowUp","PageUp"].includes(e.key)){e.preventDefault();next(-1);}
 if(e.key===" "){e.preventDefault();if(engine?.isPlaying())engine.pause();else engine?.play();updatePlay();}
});
$("cw-speak").addEventListener("click",()=>{
 if(!("speechSynthesis" in window)){alert("Sesli okuma bu cihazda desteklenmiyor.");return;}
 speechSynthesis.cancel();const spoken=new SpeechSynthesisUtterance($("cw-voice").textContent+" "+chosen.description);
 spoken.lang="tr-TR";spoken.rate=.93;speechSynthesis.speak(spoken);
});
window.addEventListener("pagehide",()=>{engine?.destroy();if("speechSynthesis" in window)speechSynthesis.cancel()});
document.addEventListener("visibilitychange",()=>{if(document.hidden)engine?.pause()});
