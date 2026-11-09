import {CO2_GLOBAL_ANNUAL} from "./co2-annual-data.js";
/**
 * Simülakron ChronoWorm — NOAA Global Monitoring Laboratory annual global
 * marine boundary-layer CO2 values (1979-2025), ppm dry air.
 * NOAA 2026-10 version, source and methodology:
 * https://gml.noaa.gov/ccgg/trends/gl_data.html
 * https://doi.org/10.15138/9N0H-ZH07
 * 2025 PRELIMINARY. No invented annual observations before 1979 or after 2025.
 */
const $=id=>document.getElementById(id);
const vals=CO2_GLOBAL_ANNUAL;
/* All 47 annual values transcribed from NOAA GML version 2026-10 (1979-2025). */
const years=[...vals.keys()].map(i=>1979+i);
const points=years.map((year,i)=>({year,value:vals[i]}));
const NS="http://www.w3.org/2000/svg",format=x=>Number(x).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});
const xmin=56,xmax=626,ymin=226,ymax=22,lo=330,hi=435;
const x=y=>xmin+(y-1979)/(2025-1979)*(xmax-xmin);
const y=v=>ymin-(v-lo)/(hi-lo)*(ymin-ymax);
let target=NaN,lastYear=NaN,highlight=null;
function svg(name,attributes,parent){
 const el=document.createElementNS(NS,name);
 Object.entries(attributes).forEach(([k,v])=>el.setAttribute(k,String(v)));
 parent.appendChild(el);return el;
}
function renderGraph(){
 const grid=$("co2-grid");
 for(const ppm of [340,380,420]){
  svg("line",{x1:xmin,x2:xmax,y1:y(ppm),y2:y(ppm),stroke:"#426671","stroke-width":1,"stroke-dasharray":"4 5"},grid);
  const t=svg("text",{x:10,y:y(ppm)+4,fill:"#a7bdba","font-size":12,"font-family":"system-ui,sans-serif"},grid);
  t.textContent=String(ppm);
 }
 const known=points.filter(p=>Number.isFinite(p.value));
 const route=known.map((p,i)=>(i?"L":"M")+x(p.year).toFixed(2)+" "+y(p.value).toFixed(2)).join(" ");
 $("co2-path").setAttribute("d",route);
 $("co2-fill").setAttribute("d",route+" L"+x(known.at(-1).year)+" "+ymin+" L"+x(known[0].year)+" "+ymin+" Z");
 const dots=$("co2-dots");
 for(const p of known){
  if(p.year%5===0||p.year>=2023){
   const dot=svg("circle",{cx:x(p.year),cy:y(p.value),r:3.4,fill:"#e7bd8b",stroke:"#163039","stroke-width":1},dots);
   const title=svg("title",{},dot);title.textContent=p.year+": "+format(p.value)+" ppm";
  }
 }
 highlight=svg("circle",{cx:0,cy:0,r:6,fill:"#f7d29a",stroke:"#133b42","stroke-width":2},dots);
 highlight.style.display="none";
}
function update(selected){
 if(selected===lastYear)return;
 lastYear=selected;
 $("climate-selected-year").textContent=selected<0?"MÖ "+Math.abs(selected).toLocaleString("tr-TR"):String(selected);
 const measured=points.find(p=>p.year===selected);
 const current=measured??points.at(-1);
 $("co2-number").textContent=format(current.value);
 $("co2-year").textContent=measured?String(selected)+(selected===2025?" · ÖN VERİ":" · YILLIK ÖLÇÜM"):"2025 · SON YILLIK ÖLÇÜM (ÖN VERİ)";
 $("co2-year-note").textContent=measured?
  selected+" yılına ait NOAA küresel yıllık CO₂ ortalaması: "+format(measured.value)+" ppm"+(selected===2025?". 2025 değeri ön veridir.":"."):
  "Seçilen yılın yıllık küresel gözlem kaydı bu seride yok; grafikte 2025'e kadar olan gerçek NOAA ölçümleri gösteriliyor.";
 const note=$("climate-selected-note");
 if(selected<1979){
  note.textContent="NOAA'nın bu küresel yıllık gözlem serisi 1979'dan başlar. "+(selected<1750?"Bu çağ için buz çekirdeği gibi ayrı paleoklimat kanıtları gerekir.":"Bu yıl için bu seriden doğrudan küresel ölçüm yok.")+" Sayı uydurulmadı.";
 }else if(selected>2025){
  note.textContent="Bu yıla ait tamamlanmış bir küresel yıllık ölçüm bu seride yok. "+(selected>2026?"Geleceğin CO₂ değeri gözlenmedi; senaryo değeri üretilmiyor.":"2026 henüz tamamlanmadı; 2025 ön veri etiketiyle kalıyor.");
 }else{
  note.textContent=format(measured.value)+" ppm: "+selected+" yılına ait küresel yıllık NOAA gözlem değeri."+(selected===2025?" Ön veri; daha sonra düzeltilebilir.":"");
 }
 if(highlight){
  highlight.style.display=measured?"":"none";
  if(measured){highlight.setAttribute("cx",x(measured.year));highlight.setAttribute("cy",y(measured.value));}
 }
}
renderGraph();update(-12000);
document.addEventListener("simulakron:time-coordinate",e=>{
 const yr=Number(e.detail?.year);
 if(Number.isFinite(yr)&&yr!==0)update(yr);
});