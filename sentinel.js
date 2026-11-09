/* Sentinel Anadolu — civilian, source-grounded situational awareness.
 * Live earthquake observations: USGS FDSN event API.
 * Weather: Open-Meteo FORECAST model, not an official warning feed.
 * Security: linked official public announcements only, no operational tracking.
 */
const $=id=>document.getElementById(id);
const CITIES={
 Manisa:[38.61,27.43,"Manisa"],Istanbul:[41.01,28.98,"İstanbul"],
 Izmir:[38.42,27.14,"İzmir"],Ankara:[39.92,32.85,"Ankara"],
 Antalya:[36.89,30.71,"Antalya"],Adana:[37,35.33,"Adana"],
 Gaziantep:[37.07,37.38,"Gaziantep"],Hatay:[36.20,36.16,"Hatay"],
 Van:[38.5,43.38,"Van"],Trabzon:[41,39.73,"Trabzon"],
 Athens:[37.98,23.73,"Atina"],Sofia:[42.70,23.32,"Sofya"],
 Nicosia:[35.19,33.37,"Lefkoşa"],Tbilisi:[41.72,44.79,"Tiflis"]
};
const state={quakes:[],weather:null,map:null,qLayer:null,wLayer:null,quakesEnabled:true,weatherEnabled:true,securityEnabled:true,minMagnitude:2,country:"Manisa",stamp:{earthquake:null,weather:null}};
const num=(n,d=1)=>Number.isFinite(n)?n.toLocaleString("tr-TR",{minimumFractionDigits:d,maximumFractionDigits:d}):"—";
const safeUrl=(url)=>{try{const u=new URL(url);return u.protocol==="https:"&&(/(^|\.)usgs\.gov$/.test(u.hostname))?u.href:null}catch(e){return null}};
function setStatus(message){$("map-status").textContent=message}
function clock(){const date=new Date();$("utc-clock").textContent=date.toLocaleTimeString("tr-TR",{timeZone:"UTC",hour12:false});}
clock();setInterval(clock,1000);
function initializeMap(){
 if(!window.L){setStatus("Harita kütüphanesi erişilemiyor");$("map-fallback").textContent="Harita bileşeni yüklenemedi. Olayları aşağıdaki listeden görebilirsiniz.";return}
 const map=L.map("map",{zoomControl:true,worldCopyJump:false,preferCanvas:true}).setView([38.6,34.4],6);
 L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:17,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
 state.map=map;state.qLayer=L.layerGroup().addTo(map);state.wLayer=L.layerGroup().addTo(map);
 $("map-fallback").style.display="none";setStatus("Harita katmanları aktif");
 document.querySelector("#reset-map").addEventListener("click",()=>map.setView([38.6,34.4],6));
 setTimeout(()=>map.invalidateSize(),200);
}
function parseQuakes(data){
 if(!data||data.type!=="FeatureCollection"||!Array.isArray(data.features))throw Error("USGS cevap biçimi beklenmiyor");
 return data.features.filter(f=>{
  const c=f.geometry?.coordinates,p=f.properties;
  return Array.isArray(c)&&Number.isFinite(c[0])&&Number.isFinite(c[1])&&p&&Number.isFinite(p.mag)&&Number.isFinite(p.time);
 }).map(f=>({
  id:String(f.id||"unknown"),lat:f.geometry.coordinates[1],lon:f.geometry.coordinates[0],
  depth:Number.isFinite(f.geometry.coordinates[2])?f.geometry.coordinates[2]:null,
  mag:f.properties.mag,
  time:new Date(f.properties.time),
  place:String(f.properties.place||"Bilinmeyen bölge"),
  url:safeUrl(f.properties.url)
 })).filter(q=>q.lat>=33&&q.lat<=44&&q.lon>=24&&q.lon<=47).sort((a,b)=>b.time-a.time);
}
async function loadQuakes(){
 $("quake-updated").textContent="USGS bağlantısı kuruluyor";
 // FDSN official event catalog query; no invented earthquake records.
 const end=new Date(),start=new Date(end.getTime()-7*864e5);
 const params=new URLSearchParams({
  format:"geojson",starttime:start.toISOString().slice(0,19),endtime:end.toISOString().slice(0,19),
  minlatitude:"33",maxlatitude:"44",minlongitude:"24",maxlongitude:"47",
  minmagnitude:"1",orderby:"time",limit:"2500"
 });
 const endpoint="https://earthquake.usgs.gov/fdsnws/event/1/query?"+params.toString();
 const response=await fetch(endpoint,{headers:{Accept:"application/geo+json, application/json"},cache:"no-store"});
 if(!response.ok)throw Error("USGS HTTP "+response.status);
 const data=await response.json();
 state.quakes=parseQuakes(data);
 state.stamp.earthquake=new Date();
 $("quake-total").textContent=String(state.quakes.length)+(state.quakes.length>=2500?"+":"");
 $("quake-strong").textContent=String(state.quakes.filter(x=>x.mag>=4).length);
 $("quake-updated").textContent="USGS · "+new Date().toLocaleTimeString("tr-TR");
 renderQuakes();
}
const fnClass=mag=>mag>=5?"high":mag>=4?"medium":"low";
function filtered(){return state.quakes.filter(x=>x.mag>=state.minMagnitude)}
function renderQuakes(){
 const items=filtered(),list=$("quake-list");list.replaceChildren();
 $("feed-count").textContent=items.length+" kayıt (M "+num(state.minMagnitude)+")";
 if(!state.stamp.earthquake){
  list.textContent="USGS sorgusu henüz başarılı olmadı. Deprem kaydı uydurulmuyor.";return;
 }
 if(!items.length){
  list.textContent="Bu eşik ve zaman aralığında kaydedilmiş deprem bulunamadı.";return;
 }
 for(const q of items.slice(0,80)){
  const el=document.createElement(q.url?"a":"div");el.className="event";
  if(q.url){el.href=q.url;el.target="_blank";el.rel="noopener noreferrer"}
  const mag=document.createElement("span");mag.className="mag "+fnClass(q.mag);mag.textContent="M"+num(q.mag);
  const body=document.createElement("span");body.className="body";
  const title=document.createElement("strong");title.textContent=q.place;
  const meta=document.createElement("small");
  meta.textContent=q.time.toLocaleString("tr-TR",{dateStyle:"short",timeStyle:"short"})+" · Derinlik "+(q.depth!=null?num(q.depth)+" km":"Bilinmiyor");
  body.append(title,meta);const arr=document.createElement("span");arr.className="arr";arr.textContent="↗";
  el.append(mag,body,arr);
  el.addEventListener("mouseenter",()=>{if(state.map)state.map.panTo([q.lat,q.lon])});
  list.appendChild(el);
 }
 if(state.qLayer){
  state.qLayer.clearLayers();
  if(!state.quakesEnabled)return;
  for(const q of items.slice(0,500)){
   const marker=L.circleMarker([q.lat,q.lon],{radius:Math.min(18,Math.max(4,2+q.mag*1.8)),weight:1,color:q.mag>=4.5?"#f3a27f":"#f2c68e",fillColor:q.mag>=4.5?"#bf603d":"#d79b55",fillOpacity:.5});
   const panel=document.createElement("div");
   const headline=document.createElement("strong");headline.textContent="M "+num(q.mag)+" · "+q.place;
   const details=document.createElement("div");details.textContent=q.time.toLocaleString("tr-TR")+" · "+(q.depth==null?"Derinlik bilinmiyor":num(q.depth)+" km derinlik");
   panel.append(headline,details);
   if(q.url){const anchor=document.createElement("a");anchor.href=q.url;anchor.target="_blank";anchor.rel="noopener noreferrer";anchor.textContent="USGS kayıt sayfası ↗";panel.append(anchor);}
   marker.bindPopup(panel);marker.addTo(state.qLayer);
  }
 }
}
function weatherClass(code){
 if([95,96,99].includes(code))return "Gök gürültülü hava modeli";
 if([51,53,55,61,63,65,80,81,82].includes(code))return "Yağışlı hava modeli";
 if([71,73,75,77,85,86].includes(code))return "Kar yağışı modeli";
 if([45,48].includes(code))return "Sisli hava modeli";
 if([0,1].includes(code))return "Açık / az bulutlu";
 if([2,3].includes(code))return "Parçalı / çok bulutlu";
 return "Model kodu "+code;
}
async function loadWeather(){
 const [lat,lon,name]=CITIES[state.country];
 $("weather-status").textContent="Open-Meteo sorgulanıyor";
 const p=new URLSearchParams({
  latitude:String(lat),longitude:String(lon),
  current:"temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
  hourly:"precipitation_probability,precipitation,wind_gusts_10m",
  forecast_days:"2",timezone:"Europe/Istanbul"
 });
 const res=await fetch("https://api.open-meteo.com/v1/forecast?"+p.toString(),{cache:"no-store"});
 if(!res.ok)throw Error("Open-Meteo HTTP "+res.status);
 const json=await res.json();
 if(!json.current||!Number.isFinite(json.current.temperature_2m))throw Error("Hava modeli veri biçimi tanınmadı");
 const w=json.current;state.weather={city:name,lat,lon,time:w.time,temp:w.temperature_2m,wind:w.wind_speed_10m,gust:w.wind_gusts_10m,precip:w.precipitation,humidity:w.relative_humidity_2m,code:w.weather_code};
 state.stamp.weather=new Date();
 $("weather-temp").textContent=num(w.temperature_2m)+"°";
 $("weather-status").textContent=name+" · Open-Meteo";
 // Non-official heuristic, NOT the meteorological alert colour scale.
 const strong=Number.isFinite(w.wind_gusts_10m)&&w.wind_gusts_10m>=70;
 const rain=Number.isFinite(w.precipitation)&&w.precipitation>=8;
 $("risk-value").textContent=strong||rain?"MODEL İŞARETİ":"—";
 $("weather-details").textContent=name+"\n"+weatherClass(w.weather_code)+"\nSıcaklık: "+num(w.temperature_2m)+" °C\nRüzgâr: "+num(w.wind_speed_10m)+" km/sa\nHamle: "+num(w.wind_gusts_10m)+" km/sa\nYağış: "+num(w.precipitation)+" mm\nNem: %"+num(w.relative_humidity_2m,0)+"\nModel saati: "+String(w.time)+"\nResmî uyarı değildir.";
 renderWeatherMarker();
}
function renderWeatherMarker(){
 if(!state.wLayer)return;
 state.wLayer.clearLayers();
 if(!state.weatherEnabled||!state.weather)return;
 const w=state.weather,mark=L.circleMarker([w.lat,w.lon],{radius:9,color:"#102f36",weight:2,fillColor:"#80d8c3",fillOpacity:.93});
 const node=document.createElement("div");node.textContent=w.city+" · "+num(w.temp)+" °C · "+weatherClass(w.code);
 mark.bindPopup(node);mark.addTo(state.wLayer);
}
function errorSource(type,error){
 console.error(type,error);
 if(type==="quake"){
  state.stamp.earthquake=null;state.quakes=[];$("quake-total").textContent="—";$("quake-strong").textContent="—";
  $("quake-updated").textContent="Bağlantı hatası";$("quake-list").textContent="Deprem kaynağına şu anda erişilemiyor. Bu, deprem olmadığı anlamına gelmez.";
  $("feed-count").textContent="Veri alınamadı";state.qLayer?.clearLayers();
 }else{
  state.stamp.weather=null;state.weather=null;$("weather-temp").textContent="—";$("risk-value").textContent="—";
  $("weather-status").textContent="Bağlantı hatası";
  $("weather-details").textContent="Hava modeli verisine şu anda erişilemiyor. Resmî Meteoroloji uyarı bağlantısını kullanın.";state.wLayer?.clearLayers();
 }
}
function updateStamps(){
 const fmt=d=>d?d.toLocaleString("tr-TR"):"yok";
 $("last-update").textContent="Son başarılı deprem verisi: "+fmt(state.stamp.earthquake)+
  "\nSon başarılı hava modeli: "+fmt(state.stamp.weather)+
  "\nKaynaklar farklı zamanlarda güncellenebilir.";
}
async function refresh(){
 $("refresh").disabled=true;$("refresh").textContent="◌ VERİLER ALINIYOR";
 await Promise.all([
  loadQuakes().catch(err=>errorSource("quake",err)),
  loadWeather().catch(err=>errorSource("weather",err))
 ]);
 updateStamps();$("refresh").disabled=false;$("refresh").textContent="↻ VERİLERİ YENİLE";
}
$("minimum-mag").addEventListener("input",e=>{
 state.minMagnitude=Number(e.target.value);$("mag-value").textContent=num(state.minMagnitude);renderQuakes();
});
$("weather-city").addEventListener("change",e=>{
 state.country=e.target.value;loadWeather().catch(err=>errorSource("weather",err)).finally(updateStamps);
});
$("layer-quakes").addEventListener("change",e=>{state.quakesEnabled=e.target.checked;renderQuakes()});
$("layer-weather").addEventListener("change",e=>{state.weatherEnabled=e.target.checked;renderWeatherMarker()});
$("layer-security").addEventListener("change",e=>{
 state.securityEnabled=e.target.checked;
 document.querySelectorAll(".source-card").forEach(x=>x.style.display=state.securityEnabled?"":"none");
});
$("refresh").addEventListener("click",refresh);
initializeMap();refresh();
