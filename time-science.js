import {calendarYears,historicalToAstronomical,lightTravel,lorentzGamma,travellerYears,yearLabel} from "./science-core.js";
const $=id=>document.getElementById(id),fmt=(v,d=2)=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:d}).format(v);
const NOW=new Date().getUTCFullYear();
let chosen=-12000;
function drawSelected(year,fiction,name){
 chosen=year;
 $("st-year").textContent=yearLabel(year);
 const delta=calendarYears(year,NOW);
 $("st-age").textContent=delta>0?"≈ "+fmt(delta,0)+" yıl önce":delta<0?"≈ "+fmt(-delta,0)+" yıl sonra":"Bu yıl";
 const min=historicalToAstronomical(-12000),max=historicalToAstronomical(3000);
 const progress=(historicalToAstronomical(year)-min)/(max-min)*100;
 $("st-marker").style.left=Math.min(100,Math.max(0,progress))+"%";
 $("st-truth").textContent=fiction?
  "Gelecek kurgusu: Bu duraktaki 3D insan ve şehirler senaryodur; geleceğin kanıtı değildir.":
  "Tarihsel veri: "+(name||"Seçili dönem")+". Ancak 3D sahnenin yüzleri, giysileri ve mimarisi kaynakla birebir doğrulanmış bir görüntü değildir.";
}
function updateLight(){
 const d=Number($("st-distance").value),unit=$("st-distance-unit").value;
 if(!Number.isFinite(d)||d<=0||d>1000000){$("st-delay").textContent="Geçerli bir pozitif mesafe gir";return}
 const x=lightTravel(d,unit);
 const text=x.years>=1?fmt(x.years,4)+" yıl":x.days>=1?fmt(x.days,2)+" gün":x.minutes>=1?fmt(x.minutes,2)+" dakika":fmt(x.seconds,4)+" saniye";
 $("st-delay").textContent=text;
 $("st-delay-text").textContent="Işık boşlukta yaklaşık 299.792,458 km/s ile ilerler. Bu mesafeden gelen ışık bize "+text+" sonra ulaşır. Bu nedenle uzaktaki gökcismi "+text+" önceki hâlinde gözlemlenir (uzay-zaman/geometri basitleştirilmiştir).";
}
function updateRelativity(){
 const beta=Number($("st-beta").value),gamma=lorentzGamma(beta),proper=travellerYears(10,beta);
 $("st-beta-value").textContent=fmt(beta,2)+" c";
 $("st-gamma").textContent=fmt(gamma,3);
 $("st-clock").textContent=fmt(proper,3)+" yıl";
 $("st-worldline").setAttribute("d","M220 200 L"+(220+175*beta).toFixed(1)+" 28");
 $("st-worldpoint").setAttribute("cx",(220+175*beta).toFixed(1));
}
$("st-beta").addEventListener("input",updateRelativity);
$("st-distance").addEventListener("input",updateLight);
$("st-distance-unit").addEventListener("change",updateLight);
document.addEventListener("simulakron:time-stop",e=>drawSelected(e.detail.year,e.detail.fiction,e.detail.name));
drawSelected(-12000,false,"Buzul Çağı'nın sonları");updateLight();updateRelativity();
