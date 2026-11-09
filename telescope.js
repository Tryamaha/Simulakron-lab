import {drawScientificSky,instrumentReadout} from "./science-sky.js";
const $=id=>document.getElementById(id);
const vid=$("livevideo"),canvas=$("overlay"),ctx=canvas.getContext("2d"),stage=$("visor");
const Y=[-12000,-3200,-500,1453,1923,2026,2100,2600,3000],fmt=v=>v<0?"MÖ "+Math.abs(v):String(v);
const notes=[
 "Mamutlar ve erken insan toplulukları: Temsili kronoloji; kamera geçmişi görüntüleyemez.",
 "Mezopotamya'da yazının erken örnekleri. Gösterilen görüntü gerçek tarihsel kayıt değildir.",
 "Antik dünyaya ait bu dönem katmanı açıklayıcı bir simülasyondur.",
 "1453: İstanbul'un fethi. Kamera yıl 1453'ü göstermez, yalnızca bugünkü ortamı çeker.",
 "1923: Türkiye Cumhuriyeti'nin ilanı. Ekrandaki yıllar bilgi katmanıdır.",
 "2026: Canlı kameran bugünü gösterir. Zoom dijitaldir, optik teleskop değildir.",
 "2100: Tahminî gelecek tasviri. Kesin bilgi veya gerçek görüntü değil.",
 "2600: Bilimkurgu sahnesi. Gelecek hakkında kanıtlanmış görsel yok.",
 "3000: Ultra Zekâ Kaşifi hayalî bir karakter. Geleceği gösterdiğini iddia etmez."
];
const s={stream:null,front:false,mode:"surface",zoom:1,year:5,night:false,grid:true,frame:0};
let w=1,h=1,timer;const stars=[];let seed=3000;for(let i=0;i<160;i++){seed=(seed*1664525+1013904223)>>>0;let x=seed/4294967296;seed=(seed*1664525+1013904223)>>>0;let y=seed/4294967296;stars.push([x,y,(i%3+1)*.5]);}
function toast(message){const n=$("toast");n.textContent=message;n.classList.add("show");clearTimeout(timer);timer=setTimeout(()=>n.classList.remove("show"),2800)}
function resize(){const rect=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);w=rect.width;h=rect.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
new ResizeObserver(resize).observe(stage);resize();
function videoStyle(){vid.style.transform="scale("+(s.zoom*(s.front?-1:1))+","+s.zoom+")";vid.style.filter=s.night?"grayscale(1) sepia(1) hue-rotate(65deg) saturate(3) contrast(1.5) brightness(1.2)":"none";$("zoom-hud").textContent=$("zoom-val").textContent=s.zoom.toFixed(1)+"×";$("zoom").value=s.zoom;instrumentReadout(s.stream?.getVideoTracks?.()[0]||null,s.zoom)}
function guide(){
 const msgs={
 surface:"Gerçek dünyanın görüntüsü. 3D atlas için Sihirli Küre'yi aç. Ekrandaki tarama işaretleri dijital çizimdir.",
 sky:"Gökyüzü haritası: Parlak katalog yıldızlarının hesaplanmış alt-azimut konumları ve yaklaşık Güneş yönü. Harita kuzeye göre çizilir; kameranın baktığı yöne hizalanmaz. Atmosferik kırılma ve yıldız presesyonu düzeltilmemiştir.",
 micro:"Dijital büyütme yeni fiziksel ayrıntı oluşturmaz. Hücreleri görmek için optik mikroskop gerekir.",
 time:notes[s.year]
 };
 $("guide-text").textContent=msgs[s.mode]+(s.night?" Yeşil görüntü filtresi termal ya da kızılötesi kamera değildir.":"");
 $("info-level").textContent={surface:"01 · CANLI GÖZLEM",sky:"02 · SANAL GÖKYÜZÜ",micro:"03 · DİJİTAL MİKRO",time:"04 · ZAMAN KATMANI"}[s.mode];
 $("origin").textContent=s.mode==="surface"?"KAMERA + HUD":"SİMÜLASYON";
}
async function stop(){if(s.stream)s.stream.getTracks().forEach(t=>t.stop());s.stream=null;vid.pause();vid.srcObject=null;vid.classList.remove("active");$("fallback").style.display="block";$("power-label").textContent="Kamerayı Başlat";$("feed-status").textContent="SİMÜLASYON";$("view-note").textContent="CANLI KAMERA KAPALI";instrumentReadout(null,s.zoom);}
async function start(){
 if(!navigator.mediaDevices?.getUserMedia){toast("HTTPS üzerinden güncel Safari/Chrome gerekir.");return}
 if(s.stream){await stop();toast("Kamera kapatıldı");return}
 try{
  let st=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:s.front?"user":"environment"},width:{ideal:1920},height:{ideal:1080}}});
  s.stream=st;vid.srcObject=st;await vid.play();vid.classList.add("active");$("fallback").style.display="none";$("power-label").textContent="Kamerayı Kapat";$("feed-status").textContent="CANLI KAMERA";$("view-note").textContent="GERÇEK GÖRÜNTÜ + SANAL İŞARETLER";videoStyle();instrumentReadout(s.stream.getVideoTracks()[0],s.zoom);
  toast("Kamera açıldı: sensör verileri alındı; yakınlaştırma sayısal kırpmadır.");
 }catch(e){console.error(e);await stop();toast(e.name==="NotAllowedError"?"Kamera izni verilmedi.":"Kamera açılamadı.")}
}
$("power").addEventListener("click",start);
$("flip").addEventListener("click",async()=>{s.front=!s.front;if(s.stream){await stop();await start()}else toast(s.front?"Ön kamera seçildi":"Arka kamera seçildi")});
$("zoom").addEventListener("input",e=>{s.zoom=Number(e.target.value);videoStyle();guide()});
$("years").addEventListener("input",e=>{s.year=Number(e.target.value);$("year-val").textContent=$("date-hud").textContent=fmt(Y[s.year]);guide()});
document.querySelectorAll(".mode").forEach(btn=>btn.addEventListener("click",()=>{
 s.mode=btn.dataset.mode;document.querySelectorAll(".mode").forEach(b=>{b.classList.toggle("active",b===btn);b.setAttribute("aria-pressed",String(b===btn))});
 $("mode-hud").textContent={surface:"YERYÜZÜ",sky:"GÖKYÜZÜ",micro:"MİKRO",time:"ZAMAN"}[s.mode];
 if(s.mode==="micro"&&s.zoom<2){s.zoom=2;videoStyle()}guide();
}));
$("night").addEventListener("click",()=>{s.night=!s.night;$("night").setAttribute("aria-pressed",String(s.night));$("night").textContent=s.night?"◐ Gece Görüşü Açık":"◐ Gece Görüşü";videoStyle();guide()});
$("grid").addEventListener("click",()=>{s.grid=!s.grid;$("grid").setAttribute("aria-pressed",String(s.grid));$("grid").textContent=s.grid?"⌗ Izgara Açık":"⌗ Izgara Kapalı"});
function label(text,y,color="#afefd2"){
 ctx.font="bold "+(w<400?9:11)+"px monospace";const len=Math.min(w-25,ctx.measureText(text).width+17);
 ctx.fillStyle="#082934db";ctx.fillRect(9,y-17,len,24);ctx.fillStyle=color;ctx.fillText(text,16,y);
}
function paint(t){
 s.frame++;if(s.frame%10===0)$("frame-id").textContent="SCAN / "+String(Math.floor(s.frame/10)%10000).padStart(4,"0");
 ctx.clearRect(0,0,w,h);ctx.save();
 const ink=s.night?"#b7ff8d":"#a0e3ce";
 if(s.grid){
  ctx.strokeStyle=s.night?"#a4ef8c36":"#95e2be30";ctx.lineWidth=1;
  for(let i=1;i<8;i++){ctx.beginPath();ctx.moveTo(w*i/8,0);ctx.lineTo(w*i/8,h);ctx.moveTo(0,h*i/8);ctx.lineTo(w,h*i/8);ctx.stroke();}
 }
 const shade=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.2,w/2,h/2,Math.max(w,h)*.8);shade.addColorStop(0,"#0000");shade.addColorStop(1,"#000b");ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
 if(s.mode==="sky"){
  drawScientificSky(ctx,w,h);
 }
 if(s.mode==="micro"){
  ctx.strokeStyle=ink;ctx.setLineDash([4,8]);ctx.beginPath();ctx.arc(w/2,h/2,Math.min(w,h)*.26,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);label("DİJİTAL ZOOM / OPTİK MİKROSKOP DEĞİL",h-48);
 }
 if(s.mode==="time"){
  const fiction=Y[s.year]>2026;ctx.fillStyle=fiction?"#9c6cee25":"#dda15b23";ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=fiction?"#b79de5":"#dcb77c";ctx.beginPath();ctx.moveTo(15,h*.30);ctx.lineTo(w-15,h*.30);ctx.moveTo(15,h*.7);ctx.lineTo(w-15,h*.7);ctx.stroke();
  label((fiction?"BİLİMKURGU ":"TARİH KATMANI ")+fmt(Y[s.year]),h-48,fiction?"#eac9ff":"#eecf97");
 }
 ctx.strokeStyle=ink;ctx.lineWidth=1;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(w/2+i*25,h/2-4);ctx.lineTo(w/2+i*25,h/2+4);ctx.moveTo(w/2-4,h/2+i*25);ctx.lineTo(w/2+4,h/2+i*25);ctx.stroke();}
 ctx.restore();requestAnimationFrame(paint);
}
requestAnimationFrame(paint);
stage.addEventListener("pointerdown",e=>{
 const r=stage.getBoundingClientRect();let x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 $("coords").textContent="X "+(100*x).toFixed(1)+" / Y "+(100*y).toFixed(1);
 const l=$("tap-label");
 l.textContent=s.mode==="sky"?"Gökyüzü: yıldız konumları temsilî":s.mode==="micro"?"Dijital büyütme":s.mode==="time"?"Simülasyon yılı: "+fmt(Y[s.year]):"Gözlem noktası";
 l.style.left=Math.min(r.width-60,Math.max(60,e.clientX-r.left))+"px";l.style.top=Math.min(r.height-40,Math.max(60,e.clientY-r.top))+"px";l.hidden=false;setTimeout(()=>l.hidden=true,1800);
});
function cameraToCanvas(c,W,H){
 const vw=vid.videoWidth,vh=vid.videoHeight;if(!vw||!vh)return;
 const z=Math.max(W/vw,H/vh)*s.zoom,dw=vw*z,dh=vh*z;
 c.save();if(s.front){c.translate(W,0);c.scale(-1,1)}if(s.night)c.filter=vid.style.filter;
 c.drawImage(vid,(W-dw)/2,(H-dh)/2,dw,dh);c.restore();
}
$("snap").addEventListener("click",async()=>{
 const W=canvas.width,H=canvas.height,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
 const fill=x.createLinearGradient(0,0,W,H);fill.addColorStop(0,"#224b57");fill.addColorStop(1,"#071923");x.fillStyle=fill;x.fillRect(0,0,W,H);
 if(s.stream&&vid.readyState>=2)cameraToCanvas(x,W,H);
 x.drawImage(canvas,0,0,W,H);
 x.fillStyle="#0b293fe8";x.fillRect(0,H-35,W,35);x.fillStyle="#e9c48d";x.font="bold 15px monospace";x.fillText("SIMULAKRON 3000 • "+s.mode.toUpperCase()+" • "+fmt(Y[s.year]),14,H-12);
 try{
  const blob=await new Promise(done=>c.toBlob(done,"image/png"));if(!blob)throw Error("PNG");
  const file=new File([blob],"simulakron-3000.png",{type:"image/png"});
  if(navigator.canShare?.({files:[file]})&&navigator.share){try{await navigator.share({files:[file],title:"Simülakron 3000"});return}catch(err){if(err.name==="AbortError")return}}
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="simulakron-3000.png";a.click();setTimeout(()=>URL.revokeObjectURL(url),6000);toast("Fotoğraf kaydı başlatıldı.");
 }catch(err){console.error(err);toast("Fotoğraf oluşturulamadı.")}
});
window.addEventListener("pagehide",()=>{if(s.stream)s.stream.getTracks().forEach(t=>t.stop())});
videoStyle();guide();