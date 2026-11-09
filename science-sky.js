import {BRIGHT_STARS, horizontal, sunHorizontal, gmst} from "./science-core.js";
/**
 * Horizontal sky map: azimuth clockwise from north, zenith in the center,
 * horizon on the outer ring. NOT registered to the phone camera orientation.
 * Observer's coordinates are user supplied (or shared with explicit permission).
 */
const $=id=>document.getElementById(id);
const state={lat:38.61,lon:27.43,source:"Örnek: Manisa (yaklaşık)",last:null,ts:0};
function valid(lat,lon){return Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<90&&Math.abs(lon)<=180;}
function compute(){
 const date=new Date();
 const stars=BRIGHT_STARS.map(([name,ra,dec,mag])=>({name,mag,...horizontal(ra,dec,state.lat,state.lon,date)}));
 const sun=sunHorizontal(state.lat,state.lon,date);
 state.last={date,stars,sun,lst:(gmst(date)+state.lon+360)%360};
 state.ts=Date.now();
 const visible=stars.filter(s=>s.visible);
 const head=visible.sort((a,b)=>a.mag-b.mag).slice(0,4).map(s=>s.name+" "+s.alt.toFixed(0)+"°").join(" · ");
 $("sky-observation").textContent=state.source+"\n"+
  "UTC: "+date.toISOString().slice(0,19).replace("T"," ")+" · Yıldız zamanı: "+(state.last.lst/15).toFixed(2)+" sa\n"+
  "Güneş: "+sun.alt.toFixed(1)+"° yükseklik / "+sun.az.toFixed(1)+"° azimut\n"+
  "Ufuk üstünde katalog yıldızı: "+visible.length+"/"+stars.length+" · Örnek: "+(head||"Yok");
 return state.last;
}
export function observer(){return {lat:state.lat,lon:state.lon,source:state.source}}
export function skyReport(){if(!state.last||Date.now()-state.ts>25000)compute();return state.last}
function applyCoordinates(source){
 const lat=Number($("observer-lat").value.replace?.(",",".")??$("observer-lat").value);
 const lon=Number($("observer-lon").value.replace?.(",",".")??$("observer-lon").value);
 if(!valid(lat,lon)){ $("sky-observation").textContent="Hatalı koordinat. Enlem -90 ile +90, boylam -180 ile +180 derece arasında olmalı.";return; }
 state.lat=lat;state.lon=lon;state.source=source;compute();
}
$("observer-update").addEventListener("click",()=>applyCoordinates("Elle girilen koordinatlar"));
$("observer-gps").addEventListener("click",()=>{
 if(!navigator.geolocation){$("sky-observation").textContent="Tarayıcı coğrafi konum erişimini desteklemiyor.";return}
 $("sky-observation").textContent="Konum izni isteniyor. Konum yalnızca bu cihazda hesaplamaya katılır.";
 navigator.geolocation.getCurrentPosition(
  p=>{state.lat=p.coords.latitude;state.lon=p.coords.longitude;state.source="Cihaz konumu (doğruluk ±"+Math.round(p.coords.accuracy)+" m)";
    $("observer-lat").value=state.lat.toFixed(5);$("observer-lon").value=state.lon.toFixed(5);compute();},
  e=>{$("sky-observation").textContent="Konum alınamadı veya izin verilmedi. Elle koordinat girebilirsin. ("+e.code+")";},
  {enableHighAccuracy:false,timeout:15000,maximumAge:300000}
 );
});
/** Draw horizontal azimuthal-equidistant sky chart on top of camera view.
 *  Projection is North up / East right, so it is NOT aligned with camera feed.
 */
export function drawScientificSky(ctx,w,h){
 const {stars,sun}=skyReport();
 ctx.save();
 ctx.fillStyle="rgba(3,17,29,.94)";ctx.fillRect(0,0,w,h);
 const cx=w/2,cy=h/2,R=Math.min(w*.42,h*.41);
 ctx.strokeStyle="#477c82";ctx.lineWidth=1;
 for(const altitude of [0,30,60]){
  ctx.beginPath();ctx.arc(cx,cy,R*(90-altitude)/90,0,Math.PI*2);ctx.stroke();
 }
 ctx.strokeStyle="#356368";
 for(let az=0;az<360;az+=45){const a=az*Math.PI/180;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R*Math.sin(a),cy-R*Math.cos(a));ctx.stroke();}
 const cardinal=[["N",0],["E",90],["S",180],["W",270]];
 ctx.font="800 12px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#e4d5b1";
 for(const [name,az] of cardinal){const a=az*Math.PI/180;ctx.fillText(name,cx+(R+14)*Math.sin(a),cy-(R+14)*Math.cos(a));}
 const xy=(az,alt)=>{const angle=az*Math.PI/180,rad=R*(90-alt)/90;return [cx+Math.sin(angle)*rad,cy-Math.cos(angle)*rad]};
 const set=stars.filter(st=>st.alt>0).sort((a,b)=>a.mag-b.mag);
 for(const star of set){
  const [x,y]=xy(star.az,star.alt);
  ctx.beginPath();ctx.fillStyle="#d7f5ec";ctx.shadowColor="#b1f2e4";ctx.shadowBlur=6;
  ctx.arc(x,y,Math.max(1.6,3.2-star.mag*.47),0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  if(star.mag<1.35||star.name==="Polaris"){
   ctx.font=(w<380?"10":"11")+"px system-ui";ctx.textAlign="left";ctx.fillStyle="#bbdce2";
   ctx.fillText(star.name,x+6,y-6);
  }
 }
 if(sun.alt>0){
  const [x,y]=xy(sun.az,sun.alt);ctx.shadowColor="#f2dca1";ctx.shadowBlur=13;
  ctx.fillStyle="#f8ce79";ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="#f5d99f";ctx.font="bold 11px system-ui";ctx.textAlign="left";ctx.fillText("Güneş",x+10,y-4);
 }
 ctx.font="700 "+(w<360?9:10)+"px monospace";ctx.textAlign="center";ctx.fillStyle="#bad9d7";
 ctx.fillText("ŞİMDİKİ GÖKYÜZÜ · KUZEY ÜSTTE · KAMERA DOĞRULTUSU DEĞİL",cx,h-58);
 ctx.restore();
}
export function instrumentReadout(track,zoom){
 const node=$("hardware-readout");
 if(!track){node.textContent="Kamera kapalı. Gerçek sensör ayarları henüz bilinmiyor.";return}
 const s=track.getSettings?.()||{},c=track.getCapabilities?.()||{};
 const size=(s.width&&s.height)?s.width+" × "+s.height+" px":"Tarayıcı bildirmedi";
 const fps=Number.isFinite(s.frameRate)?s.frameRate.toFixed(1)+" fps":"Tarayıcı bildirmedi";
 const cap=c.zoom&&Number.isFinite(c.zoom.min)?"Mevcut, aralık "+c.zoom.min+"–"+c.zoom.max+" (optik olduğu garanti değil)":"Erişilemiyor / bildirilmedi";
 const effective=s.width&&s.height?"Dijital kırpmanın yaklaşık kaynak piksel alanı: "+
   Math.round(s.width/Math.max(1,zoom))+" × "+Math.round(s.height/Math.max(1,zoom))+" piksel (yeniden örnekleme hariç)\n":"";
 node.textContent=
   "Gerçek kamera akışı: "+size+"\n"+
   "Bildirilen kare hızı: "+fps+"\n"+
   "Tarayıcının zoom yeteneği: "+cap+"\n"+
   "Ekranda uygulanan büyütme: "+Number(zoom).toFixed(1)+"× (CSS dijital kırpma)\n"+
   effective+
   "Etkin sensör: "+(s.facingMode==="user"?"Ön":s.facingMode==="environment"?"Arka":"Tarayıcı belirtmedi");
}
compute();
