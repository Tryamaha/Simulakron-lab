import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {EVENTS, PLACES} from "./catalog.js";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const label=y=>y<0?"MÖ "+Math.abs(y).toLocaleString("tr-TR"):String(y);
const entries=[...PLACES.map(x=>({...x,historical:false})),...EVENTS.map(x=>({...x,historical:true}))];
const ui={type:"all",search:"",selected:null,autospin:true}, canvasContainer=$("globe");
let renderer,scene,camera,controls,planet,globe,markers=[],clock,raycaster,mouse,pointerDown,activeItem=null;
function toast(s){const e=$("toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2700);}
function geoPoint(lat,lon,r=1.028){let a=THREE.MathUtils.degToRad(lat),b=THREE.MathUtils.degToRad(lon);return new THREE.Vector3(Math.cos(a)*Math.sin(b)*r,Math.sin(a)*r,-Math.cos(a)*Math.cos(b)*r)}
function proceduralMap(){
 const c=document.createElement("canvas");c.width=1024;c.height=512;
 const g=c.getContext("2d");g.fillStyle="#174759";g.fillRect(0,0,1024,512);
 const p=[
 [[-165,65],[-126,74],[-81,51],[-97,17],[-119,13],[-136,33]],
 [[-80,10],[-51,5],[-50,-11],[-67,-53],[-81,-33]],
 [[-12,71],[35,69],[50,46],[20,34],[-16,37]],
 [[-16,36],[43,30],[51,6],[32,-34],[16,-36],[-3,7]],
 [[34,69],[94,74],[180,53],[157,10],[106,-10],[75,17]],
 [[112,-12],[146,-10],[153,-39],[116,-38]],
 [[-48,82],[-38,80],[-42,60],[-60,62]],
 [[-178,-71],[0,-72],[178,-71],[178,-90],[-178,-90]]
 ];
 g.strokeStyle="#326a77";g.globalAlpha=.65;for(let x=0;x<1024;x+=64){g.beginPath();g.moveTo(x,0);g.lineTo(x,512);g.stroke()}for(let y=0;y<512;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(1024,y);g.stroke()}
 g.globalAlpha=1;for(const poly of p){g.beginPath();poly.forEach(([lng,lat],i)=>{let x=(lng+180)/360*1024,y=(90-lat)/180*512;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.fillStyle="#729777";g.fill();g.strokeStyle="#b4c59c";g.stroke()}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function init(){
 try{
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  canvasContainer.appendChild(renderer.domElement);
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(43,1,.05,65);camera.position.set(0,0,3.4);
  scene.add(new THREE.AmbientLight(0xe1f0ec,1.2));
  const light=new THREE.DirectionalLight(0xffebc4,2.8);light.position.set(4,3,4);scene.add(light);
  const back=new THREE.DirectionalLight(0x70c5d3,1);back.position.set(-3,-3,-4);scene.add(back);
  globe=new THREE.Group();scene.add(globe);
  planet=new THREE.Mesh(new THREE.SphereGeometry(1,64,48),new THREE.MeshStandardMaterial({map:proceduralMap(),roughness:.95}));
  globe.add(planet);
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.045,48,32),new THREE.MeshBasicMaterial({color:0x6fc7e4,transparent:true,opacity:.08,side:THREE.BackSide,depthWrite:false}));globe.add(atmosphere);
  const markerGeo=new THREE.SphereGeometry(.022,8,8);
  entries.forEach(e=>{
   let m=new THREE.Mesh(markerGeo,new THREE.MeshBasicMaterial({color:e.historical?0xe7b778:0x70d6c6}));
   m.position.copy(geoPoint(e.lat,e.lng));m.userData.entry=e;globe.add(m);markers.push(m);
  });
  const torus=new THREE.Mesh(new THREE.TorusGeometry(1.23,.002,3,148),new THREE.MeshBasicMaterial({color:0x75aab0,transparent:true,opacity:.3}));torus.rotation.x=1.07;globe.add(torus);
  controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minDistance=1.35;controls.maxDistance=6;controls.rotateSpeed=.62;
  raycaster=new THREE.Raycaster();mouse=new THREE.Vector2();clock=new THREE.Clock();
  renderer.domElement.addEventListener("pointerdown",e=>{pointerDown=[e.clientX,e.clientY]});
  renderer.domElement.addEventListener("pointerup",e=>{if(pointerDown&&Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])<8)pick(e);pointerDown=null});
  window.addEventListener("resize",resize);new ResizeObserver(resize).observe(canvasContainer);
  resize();animate();
  new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",t=>{
   t.colorSpace=THREE.SRGBColorSpace;planet.material.map=t;planet.material.needsUpdate=true;
  },undefined,()=>toast("Uydu görseli yüklenemedi. Şematik Dünya kullanılıyor."));
  $("load-state").hidden=true;
 }catch(e){console.error(e);$("load-state").innerHTML='<div class="globe-error">3D Küre yüklenemedi. WebGL destekleyen Safari/Chrome kullanın; konum listesi kullanılabilir.</div>';}
}
function resize(){if(!renderer)return;const w=canvasContainer.clientWidth,h=canvasContainer.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
function animate(){requestAnimationFrame(animate);let dt=Math.min(clock.getDelta(),.05);if(document.hidden)return;if(ui.autospin&&!pointerDown)globe.rotation.y+=dt*.05;controls.update();renderer.render(scene,camera)}
function pick(e){
 const rect=renderer.domElement.getBoundingClientRect();
 mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(mouse,camera);
 const hit=raycaster.intersectObjects([planet,...markers],false)[0];
 if(hit&&hit.object.userData.entry)choose(hit.object.userData.entry);
}
function filterRows(){
 const q=norm(ui.search.trim());
 return entries.filter(e=>(ui.type==="all"||(ui.type==="history")===e.historical)&&(!q||norm([e.title,e.where,e.continent,e.summary,e.era,e.kind,e.note].join(" ")).includes(q)));
}
function render(){
 const rows=filterRows();
 $("results-count").textContent=String(rows.length);
 $("point-counter").textContent=PLACES.length+" coğrafi konum · "+EVENTS.length+" tarih olayı";
 const box=$("globe-results");box.replaceChildren();
 for(const e of rows.slice(0,175)){
  const b=document.createElement("button");b.type="button";b.className="result"+(ui.selected?.id===e.id?" active":"");
  b.setAttribute("role","listitem");
  b.innerHTML='<span class="bullet '+(e.historical?"hist":"geo")+'"></span><span class="body"><strong>'+esc(e.title)+'</strong><small>'+esc(e.historical?label(e.year)+" · "+e.era:e.kind+" · "+e.continent)+'</small></span><span class="go">⌖</span>';
  b.addEventListener("click",()=>choose(e));box.appendChild(b);
 }
 if(markers.length){
  const ids=new Set(rows.map(x=>x.id));
  for(const m of markers){m.visible=ids.has(m.userData.entry.id);m.scale.setScalar(ui.selected?.id===m.userData.entry.id?2.1:1)}
 }
}
function choose(e){
 ui.selected=e;render();
 $("selected-card").innerHTML='<p class="card-label">'+(e.historical?"◷ TARİHSEL BİLGİ":"◎ COĞRAFYA ATLASI")+'</p><h3>'+esc(e.title)+'</h3><div class="data"><span>'+esc(e.historical?label(e.year):e.kind)+'</span><span>'+esc(e.historical?e.where:e.continent)+'</span></div><p>'+esc(e.summary)+'</p><div class="detail-links"><a href="./#'+(e.historical?"history":"atlas")+'">Ansiklopedide Aç ↗</a><a href="https://tr.wikipedia.org/w/index.php?search='+encodeURIComponent(e.title)+'" target="_blank" rel="noopener noreferrer">Ek araştırma ↗</a></div>';
 if(globe){
  ui.autospin=false;$("rotate-toggle").innerHTML='◷ Otomatik dönüş <b>KAPALI</b>';
  $("rotate-toggle").setAttribute("aria-pressed","false");
  const p=geoPoint(e.lat,e.lng,1).normalize();
  const toFront=new THREE.Quaternion().setFromUnitVectors(p,new THREE.Vector3(0,0,1));
  globe.quaternion.copy(toFront);camera.position.set(0,0,2.65);controls.target.set(0,0,0);controls.update();
 }
}
$("globe-search").addEventListener("input",e=>{ui.search=e.target.value;render()});
document.querySelectorAll(".pill").forEach(b=>b.addEventListener("click",()=>{
 ui.type=b.dataset.kind;
 document.querySelectorAll(".pill").forEach(t=>{t.classList.toggle("active",t===b);t.setAttribute("aria-pressed",String(t===b))});render();
}));
$("rotate-toggle").addEventListener("click",()=>{
 ui.autospin=!ui.autospin;$("rotate-toggle").innerHTML='◷ Otomatik dönüş <b>'+(ui.autospin?"AÇIK":"KAPALI")+'</b>';
 $("rotate-toggle").setAttribute("aria-pressed",String(ui.autospin));
});
$("zoom-in").addEventListener("click",()=>{if(!camera)return;camera.position.multiplyScalar(.8);camera.position.clampLength(1.35,6);controls.update()});
$("zoom-out").addEventListener("click",()=>{if(!camera)return;camera.position.multiplyScalar(1.25);camera.position.clampLength(1.35,6);controls.update()});
$("reset-globe").addEventListener("click",()=>{
 if(!globe)return;ui.selected=null;ui.autospin=true;globe.quaternion.identity();camera.position.set(0,0,3.4);controls.target.set(0,0,0);controls.update();
 $("rotate-toggle").innerHTML='◷ Otomatik dönüş <b>AÇIK</b>';render();
});
render();init();