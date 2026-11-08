import {EVENTS, PLACES} from "./catalog.js";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const years=y=>y<0?"MÖ "+Math.abs(y).toLocaleString("tr-TR"):String(y);
const icon={Ülke:"⚑",Dağ:"▲",Nehir:"≈",Göl:"◉",Çöl:"☀",Deniz:"≋",Okyanus:"◎",Ada:"◌","Tarihî Yer":"⌘",Kıta:"◈"};
const continents=["Tümü","Avrupa","Asya","Afrika","Kuzey Amerika","Güney Amerika","Okyanusya","Antarktika"];
const eras=["Tümü","Tarih Öncesi","Antik Çağ","Orta Çağ","Yeni Çağ","Yakın Çağ"];
const groups=["Tümü",...new Set(EVENTS.map(e=>e.group))];
const kinds=["Tümü",...new Set(PLACES.map(p=>p.kind))];
const byId=new Map([...EVENTS,...PLACES].map(item=>[item.id,item]));
const state={page:"home",era:"Tümü",group:"Tümü",kind:"Tümü",continent:"Tümü",historyText:"",atlasText:"",sortHistory:"asc",sortAtlas:"alpha",quiz:[],question:0,score:0,answered:false};
let map=null,markers=null,specialMarker=null,loadedTiles=false;
let activeDetail=null;

$("stat-history").textContent=String(EVENTS.length);
$("stat-geo").textContent=String(PLACES.length);
function makeChips(where,values,selected,click){
  const el=$(where);el.replaceChildren();
  values.forEach(value=>{
    const b=document.createElement("button");b.type="button";b.className="filter"+(value===selected?" active":"");
    b.textContent=value;b.setAttribute("aria-pressed",String(value===selected));
    b.addEventListener("click",()=>click(value));
    el.appendChild(b);
  });
}
function filteredHistory(){
  const q=norm(state.historyText.trim());
  return EVENTS.filter(e=>(state.era==="Tümü"||e.era===state.era)&&(state.group==="Tümü"||e.group===state.group)&&(!q||norm([e.title,e.era,e.group,e.where,e.summary,years(e.year)].join(" ")).includes(q))).sort((a,b)=>state.sortHistory==="desc"?b.year-a.year:a.year-b.year);
}
function filteredAtlas(){
  const q=norm(state.atlasText.trim());
  const rows=PLACES.filter(e=>(state.kind==="Tümü"||e.kind===state.kind)&&(state.continent==="Tümü"||e.continent===state.continent)&&(!q||norm([e.title,e.continent,e.kind,e.summary,e.note].join(" ")).includes(q)));
  return rows.sort((a,b)=>state.sortAtlas==="type"?(a.kind.localeCompare(b.kind,"tr")||a.title.localeCompare(b.title,"tr")):a.title.localeCompare(b.title,"tr"));
}
function renderHistory(){
  const rows=filteredHistory(),el=$("history-list");
  $("history-count").textContent=rows.length+" / "+EVENTS.length+" kayıt";
  $("history-empty").hidden=rows.length>0;
  el.innerHTML=rows.map(e=>'<button type="button" class="event" data-record="'+e.id+'"><span class="event-date">'+esc(years(e.year))+'</span><span><span class="event-tag">'+esc(e.era.toLocaleUpperCase("tr"))+' · '+esc(e.group.toLocaleUpperCase("tr"))+'</span><span class="event-name" style="display:block">'+esc(e.title)+'</span><span class="event-summary">'+esc(e.summary)+'</span></span><span class="event-place">⌖ '+esc(e.where)+'</span></button>').join("");
}
function renderAtlas(){
  const rows=filteredAtlas(),el=$("atlas-list");
  $("atlas-count").textContent=rows.length+" / "+PLACES.length+" konum";
  $("atlas-empty").hidden=rows.length>0;
  el.innerHTML=rows.map(e=>'<button type="button" class="placecard" data-record="'+e.id+'"><span class="pin">'+esc(icon[e.kind]||"⌖")+'</span><span style="min-width:0;flex:1"><b>'+esc(e.title)+'</b><small>'+esc(e.kind)+' · '+esc(e.continent)+'</small></span><span class="arr">↗</span></button>').join("");
  updateMarkers(rows);
}
function renderFeatured(){
  const keys=["h1","h43","p56","p96"];
  // Resolve selected reference cards safely by title to avoid dependence on catalog order.
  const featured=[
    EVENTS.find(e=>e.title==="Göbeklitepe anıtsal yapıları"),
    EVENTS.find(e=>e.title==="İstanbul'un fethi"),
    PLACES.find(e=>e.title==="Amazon Nehri"),
    PLACES.find(e=>e.title==="Machu Picchu")
  ].filter(Boolean);
  $("featured").innerHTML=featured.map(e=>'<button class="spotlight" type="button" data-record="'+e.id+'"><span>'+esc(e.id.startsWith("h")?"TARİH · "+e.era:e.kind+" · "+e.continent)+'</span><h3>'+esc(e.title)+'</h3><p>'+esc(e.summary)+'</p></button>').join("");
}
function renderChips(){
  makeChips("era-filters",eras,state.era,v=>{state.era=v;renderChips();renderHistory()});
  makeChips("history-groups",groups,state.group,v=>{state.group=v;renderChips();renderHistory()});
  makeChips("type-filters",kinds,state.kind,v=>{state.kind=v;renderChips();renderAtlas()});
  makeChips("continent-filters",continents,state.continent,v=>{state.continent=v;renderChips();renderAtlas();if(v!=="Tümü")zoomContinent(v)});
}
function selectPage(page,push=true){
  if(!["home","history","atlas","quiz"].includes(page))page="home";
  state.page=page;
  document.querySelectorAll(".page").forEach(el=>{let active=el.id==="page-"+page;el.classList.toggle("active",active);el.hidden=!active});
  document.querySelectorAll(".navbtn").forEach(el=>{let yes=el.dataset.page===page;el.classList.toggle("active",yes);yes?el.setAttribute("aria-current","page"):el.removeAttribute("aria-current")});
  if(push&&location.hash.slice(1)!==page){history.replaceState(null,"","#"+page)}
  if(page==="atlas"){setTimeout(()=>{createMap();map?.invalidateSize()},30)}
  if(page==="quiz"&&!state.quiz.length)startQuiz();
  window.scrollTo({top:0,behavior:"instant"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>selectPage(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>selectPage(b.dataset.goto)));
window.addEventListener("hashchange",()=>selectPage(decodeURIComponent(location.hash.slice(1)),false));
$("history-search").addEventListener("input",e=>{state.historyText=e.target.value;renderHistory()});
$("atlas-search").addEventListener("input",e=>{state.atlasText=e.target.value;renderAtlas()});
$("history-clear").addEventListener("click",()=>{$("history-search").value="";state.historyText="";renderHistory()});
$("atlas-clear").addEventListener("click",()=>{$("atlas-search").value="";state.atlasText="";renderAtlas()});
$("history-sort").addEventListener("change",e=>{state.sortHistory=e.target.value;renderHistory()});
$("atlas-sort").addEventListener("change",e=>{state.sortAtlas=e.target.value;renderAtlas()});

document.addEventListener("click",e=>{
  const card=e.target.closest("[data-record]");
  if(card){openDetail(byId.get(card.dataset.record));return;}
});
function openDetail(item){
  if(!item)return;
  activeDetail=item;
  const historical=typeof item.year==="number";
  $("detail-type").textContent=historical?"TARİH ANSİKLOPEDİSİ · "+item.era:"COĞRAFYA ATLASI · "+item.kind;
  $("detail-title").textContent=item.title;
  $("detail-meta").innerHTML=historical?'<span>◷ '+esc(years(item.year))+'</span><span>⌖ '+esc(item.where)+'</span><span>'+esc(item.group)+'</span>':'<span>◎ '+esc(item.continent)+'</span><span>◈ '+esc(item.kind)+'</span>';
  $("detail-summary").textContent=item.summary;
  $("detail-note").textContent=historical?"Tarihsel olayın günümüz haritasında gösterilen işareti temsili bir konumdur.":item.note||"";
  $("detail-wiki").href="https://tr.wikipedia.org/w/index.php?search="+encodeURIComponent(item.title.replace(/'nın |'nin |'nun |'nün /g," "));
  $("detail").hidden=false;$("detail-backdrop").hidden=false;
  document.body.style.overflow="hidden";
  $("detail-close").focus();
}
function closeDetail(){
  $("detail").hidden=true;$("detail-backdrop").hidden=true;
  document.body.style.overflow="";
}
$("detail-close").addEventListener("click",closeDetail);
$("detail-backdrop").addEventListener("click",closeDetail);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("detail").hidden)closeDetail()});
$("detail-map").addEventListener("click",()=>{if(activeDetail){const item=activeDetail;closeDetail();selectPage("atlas");setTimeout(()=>focusItem(item),180)}});
function focusItem(item){
  createMap();
  if(map){
    if(specialMarker){map.removeLayer(specialMarker);specialMarker=null}
    if(typeof item.year==="number"){
      specialMarker=L.circleMarker([item.lat,item.lng],{radius:10,color:"#e6ba75",fillColor:"#d6a46c",fillOpacity:.85,weight:2}).addTo(map).bindPopup(esc(item.title)+" · "+esc(years(item.year)));
      specialMarker.openPopup();
    }
    map.flyTo([item.lat,item.lng],Math.max(6,map.getZoom()),{duration:1.1});
    if(typeof item.year!=="number"){
      setTimeout(()=>L.popup({autoPan:true}).setLatLng([item.lat,item.lng]).setContent("<b>"+esc(item.title)+"</b><br><span>"+esc(item.kind)+" · "+esc(item.continent)+"</span>").openOn(map),1050)
    }
  }else{
    document.querySelector("#map-fallback .fallback-text").textContent="Harita servisine erişilemiyor. Konum listesi yine kullanılabilir.";
  }
}
function createMap(){
  if(map)return;
  if(!window.L){
    $("map-fallback").querySelector(".fallback-text").textContent="Harita çevrimiçi yüklenemedi. Atlas kayıtlarını aşağıdan inceleyebilirsin.";
    drawFallback(filteredAtlas());
    return;
  }
  try{
    map=L.map("map",{worldCopyJump:true,zoomControl:true,preferCanvas:true,minZoom:2,maxZoom:16}).setView([22,12],2);
    const tiles=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:16,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> katkıda bulunanlar'});
    tiles.addTo(map);tiles.once("tileload",()=>{loadedTiles=true});
    markers=L.layerGroup().addTo(map);
    updateMarkers(filteredAtlas());
    setTimeout(()=>map.invalidateSize(),150);
  }catch(err){
    console.error(err);map=null;drawFallback(filteredAtlas());
  }
}
function colorFor(kind){return (kind==="Tarihî Yer"?"#e5b36e":kind==="Ülke"?"#8bd4bd":kind==="Dağ"?"#e2bc86":kind==="Nehir"||kind==="Göl"||kind==="Okyanus"||kind==="Deniz"?"#91c6e3":"#cc9d85")}
function updateMarkers(rows){
  if(!map||!markers){if(state.page==="atlas"&&!window.L)drawFallback(rows);return;}
  markers.clearLayers();
  rows.forEach(item=>{
    if(!Number.isFinite(item.lat)||!Number.isFinite(item.lng))return;
    let color=colorFor(item.kind);
    const marker=L.circleMarker([item.lat,item.lng],{radius:6,weight:1,color:"#0a2730",fillColor:color,fillOpacity:.91}).addTo(markers);
    marker.bindPopup('<b>'+esc(item.title)+'</b><br><span>'+esc(item.kind)+" · "+esc(item.continent)+'</span>');
    marker.on("dblclick",()=>openDetail(item));
    marker.on("popupopen",()=>{const button=document.createElement("button");button.type="button";button.className="map-pop-btn";button.textContent="Bilgi kartını aç ↗";button.addEventListener("click",()=>openDetail(item));marker.getPopup().getElement()?.querySelector(".leaflet-popup-content")?.appendChild(button)});
  });
}
function zoomContinent(name){
  if(!map)return;
  const bounds={Avrupa:[[34,-12],[72,43]],Asya:[[-11,25],[78,180]],Afrika:[[-36,-18],[38,53]],"Kuzey Amerika":[[7,-170],[84,-50]],"Güney Amerika":[[-58,-82],[14,-35]],Okyanusya:[[-51,100],[0,180]],Antarktika:[[-85,-180],[-60,180]]};
  if(bounds[name])map.fitBounds(bounds[name],{padding:[20,20],maxZoom:5});
}
$("map-reset").addEventListener("click",()=>{if(map)map.setView([22,12],2);else createMap()});
function drawFallback(rows){
  const el=$("map-fallback");if(!el)return;
  el.replaceChildren();
  const land=document.createElementNS("http://www.w3.org/2000/svg","svg");land.setAttribute("viewBox","0 0 1000 500");land.setAttribute("preserveAspectRatio","none");land.classList.add("worldoutline");
  land.style.cssText="position:absolute;width:100%;height:100%;inset:0;opacity:.32";
  const polys=[
  "M44,112 L104,74 L172,62 L249,84 L275,138 L223,172 L203,235 L167,206 L129,172 L85,174 Z",
  "M209,222 L267,245 L295,318 L280,406 L241,474 L210,389 L191,303 Z",
  "M425,107 L500,80 L559,102 L596,156 L570,188 L517,185 L486,224 L434,196 Z",
  "M459,207 L539,197 L573,269 L556,344 L521,416 L475,364 L447,295 Z",
  "M566,100 L663,63 L759,68 L889,101 L948,168 L871,228 L789,218 L725,256 L631,217 L595,169 Z",
  "M822,328 L893,329 L937,390 L914,440 L839,427 L797,386 Z",
  "M320,452 L720,461 L840,482 L180,486 Z"];
  polys.forEach(path=>{let p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",path);p.setAttribute("fill","#86b6a3");p.setAttribute("stroke","#bee4cc");p.setAttribute("stroke-width","2");land.appendChild(p)});el.appendChild(land);
  for(const item of rows.slice(0,100)){
    const b=document.createElement("button");b.type="button";b.title=item.title;b.setAttribute("aria-label",item.title);
    b.style.cssText="position:absolute;z-index:2;width:7px;height:7px;border:0;border-radius:50%;padding:0;transform:translate(-50%,-50%);box-shadow:0 0 5px #000;background:"+colorFor(item.kind)+";left:"+((item.lng+180)/360*100)+"%;top:"+((90-item.lat)/180*100)+"%";
    b.addEventListener("click",()=>openDetail(item));el.appendChild(b);
  }
  let label=document.createElement("div");label.className="fallback-text";label.textContent="Şematik dünya haritası · Noktalara dokun veya aşağıdaki kayıtları aç";el.appendChild(label);
}

// Quiz: Five chronology questions and five physical-geography questions.
const shuffle=array=>{const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function startQuiz(){
  const poolHistory=shuffle(EVENTS.filter(e=>e.year>0&&e.year<2000)).slice(0,5);
  const poolGeog=shuffle(PLACES.filter(p=>["Dağ","Nehir","Göl","Çöl","Deniz","Tarihî Yer"].includes(p.kind))).slice(0,5);
  state.quiz=shuffle([
    ...poolHistory.map(e=>{
      const wrong=shuffle([...new Set(EVENTS.filter(x=>x.id!==e.id&&x.year!==e.year&&x.era===e.era).map(x=>years(x.year)))]).slice(0,3);
      return {q:"“"+e.title+"” hangi yılda gerçekleşti?",right:years(e.year),options:shuffle([years(e.year),...wrong]),info:e.summary}
    }),
    ...poolGeog.map(p=>{
      const wrong=shuffle([...new Set(PLACES.filter(x=>x.id!==p.id&&x.kind!==p.kind).map(x=>x.title))]).slice(0,3);
      return {q:"Aşağıdakilerden hangisi bir "+p.kind.toLocaleLowerCase("tr")+" örneğidir?",right:p.title,options:shuffle([p.title,...wrong]),info:p.summary}
    })
  ]);
  state.question=0;state.score=0;state.answered=false;renderQuiz();
}
function renderQuiz(){
  const q=state.quiz[state.question],finished=!q;
  $("quiz-progress").textContent=finished?"TAMAMLANDI":"SORU "+(state.question+1)+" / "+state.quiz.length;
  $("quiz-score").textContent=state.score+" DOĞRU";
  $("quiz-bar").style.width=Math.round((finished?1:state.question/state.quiz.length)*100)+"%";
  $("quiz-feedback").textContent="";
  $("quiz-next").hidden=true;
  if(finished){
    $("quiz-question").textContent=state.score+" / "+state.quiz.length+" doğru! "+(state.score>=8?"Harika bir keşif!":"Yeni bir turda daha da iyi olabilirsin.");
    $("quiz-options").replaceChildren();
    return;
  }
  $("quiz-question").textContent=q.q;
  $("quiz-options").replaceChildren();
  q.options.forEach(answer=>{
    const btn=document.createElement("button");btn.type="button";btn.className="quiz-option";btn.textContent=answer;
    btn.addEventListener("click",()=>answerQuiz(answer));$("quiz-options").appendChild(btn);
  });
}
function answerQuiz(answer){
  if(state.answered)return;
  state.answered=true;
  const q=state.quiz[state.question];
  const correct=q.right===answer;
  if(correct)state.score++;
  $("quiz-score").textContent=state.score+" DOĞRU";
  $("quiz-feedback").textContent=(correct?"✓ Doğru! ":"✕ Doğru cevap: "+q.right+". ")+q.info;
  [...$("quiz-options").children].forEach(btn=>{btn.disabled=true;if(btn.textContent===q.right)btn.classList.add("correct");else if(btn.textContent===answer)btn.classList.add("wrong")});
  $("quiz-next").hidden=false;
  $("quiz-next").textContent=state.question===state.quiz.length-1?"Sonucu Gör →":"Sonraki Soru →";
  $("quiz-bar").style.width=Math.round((state.question+1)/state.quiz.length*100)+"%";
}
$("quiz-next").addEventListener("click",()=>{state.question++;state.answered=false;renderQuiz()});
$("quiz-restart").addEventListener("click",startQuiz);

renderChips();renderHistory();renderAtlas();renderFeatured();
selectPage(decodeURIComponent(location.hash.slice(1))||"home",false);
