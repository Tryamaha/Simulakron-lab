import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

const $=id=>document.getElementById(id);
const holder=$("canvas-holder"),video=$("camera"),demo=$("demo-backdrop");
const cameraTab=$("camera-tab"),arTab=$("ar-tab");
const scaleInput=$("scale"),scaleLabel=$("scale-val"),notice=$("notice"),toastEl=$("toast");
let stream=null,facing="environment",mode="camera",model=null,mammoth=null,human=null,trunk=null;
let size=1,viewWidth=0,viewHeight=0,noticeTimer,hitAt=0,hitTarget="";
const pointers=new Map();
let downAt=0,downPos={x:0,y:0},didMove=false,pinchStart=0;

function toast(message){
  toastEl.textContent=message;
  toastEl.classList.add("show");
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>toastEl.classList.remove("show"),3000);
}
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(38,1,.03,40);
cam.position.set(.24,.92,2.7);cam.lookAt(0,.48,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:"high-performance"});
renderer.setClearColor(0x000000,0);
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.5;
holder.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe4f2ed,0x72452b,2.8));
const light=new THREE.DirectionalLight(0xffdeb2,3.4);
light.position.set(-2,4,3);scene.add(light);
const other=new THREE.DirectionalLight(0x93e3c6,1.4);
other.position.set(1,2,-3);scene.add(other);

const sc=document.createElement("canvas");sc.width=sc.height=128;
const cx=sc.getContext("2d"),g=cx.createRadialGradient(64,64,3,64,64,64);
g.addColorStop(0,"rgba(0,0,0,.38)");g.addColorStop(1,"rgba(0,0,0,0)");
cx.fillStyle=g;cx.fillRect(0,0,128,128);
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2,1.25),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false}));
shadow.rotation.x=-Math.PI/2;shadow.position.y=.01;scene.add(shadow);

function resize(){
  const w=holder.clientWidth,h=holder.clientHeight;
  if(w<1||h<1)return;
  viewWidth=w;viewHeight=h;
  cam.aspect=w/h;cam.updateProjectionMatrix();
  renderer.setSize(w,h,false);
}
window.addEventListener("resize",resize);
new ResizeObserver(resize).observe(holder);
resize();

new GLTFLoader().load("./assets/prehistoric-scene.gltf",gltf=>{
  model=gltf.scene;
  mammoth=model.getObjectByName("MammothRig");
  human=model.getObjectByName("HumanRig");
  trunk=model.getObjectByName("TrunkRig");
  model.position.set(0,0,0);
  scene.add(model);
  toast("3D mamut ve ilk insan hazır!");
},undefined,err=>{
  console.error("Model yüklenemedi",err);
  toast("3D model yüklenemedi. İnternet bağlantını kontrol et.");
});

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
function react(e){
  if(!model)return;
  const r=holder.getBoundingClientRect();
  pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));
  raycaster.setFromCamera(pointer,cam);
  const hits=raycaster.intersectObject(model,true);
  if(!hits.length){return;}
  let o=hits[0].object,which="mammoth";
  while(o){if(o.name==="HumanRig"){which="human";break;}if(o.name==="MammothRig"){which="mammoth";break;}o=o.parent;}
  hitAt=performance.now()/1000;hitTarget=which;
  toast(which==="mammoth"?"🦣 Mamut sana tepki verdi!":"🪨 İlk insan seni fark etti!");
  $("hint").classList.add("hide");
}
function gap(){const a=[...pointers.values()];return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}
function setScale(x){
  size=THREE.MathUtils.clamp(x,.5,1.9);
  scaleInput.value=Math.round(size*20)*5;
  scaleLabel.textContent=Math.round(size*100)+"%";
  if(model)model.scale.setScalar(size);
}
holder.addEventListener("pointerdown",e=>{
  if(mode!=="camera")return;
  holder.setPointerCapture?.(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  downAt=performance.now();downPos={x:e.clientX,y:e.clientY};didMove=false;
  pinchStart=gap();
});
holder.addEventListener("pointermove",e=>{
  if(!model||!pointers.has(e.pointerId)||mode!=="camera")return;
  const prev=pointers.get(e.pointerId),dx=e.clientX-prev.x,dy=e.clientY-prev.y;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(Math.hypot(e.clientX-downPos.x,e.clientY-downPos.y)>7)didMove=true;
  if(pointers.size>1){
    const d=gap();if(pinchStart>0&&d>0)setScale(size*d/pinchStart);
    pinchStart=d;
  }else{
    model.position.x=THREE.MathUtils.clamp(model.position.x+dx/viewWidth*2,-1,1);
    model.position.y=THREE.MathUtils.clamp(model.position.y-dy/viewHeight*1.6,-.55,.9);
  }
});
function release(e){
  if(!pointers.has(e.pointerId))return;
  pointers.delete(e.pointerId);pinchStart=gap();
  if(!didMove&&performance.now()-downAt<500)react(e);
}
holder.addEventListener("pointerup",release);
holder.addEventListener("pointercancel",e=>pointers.delete(e.pointerId));

function tick(tms){
  requestAnimationFrame(tick);
  const t=tms/1000;
  const d=t-hitAt;
  const bounce=d>0&&d<1.4?Math.sin(d*15)*Math.exp(-d*2.8):0;
  if(mammoth){
    mammoth.position.y=Math.sin(t*1.45)*.007+(hitTarget==="mammoth"?Math.max(0,bounce)*.035:0);
    mammoth.rotation.y=Math.sin(t*.8)*.025;
  }
  if(trunk)trunk.rotation.z=Math.sin(t*1.7)*.05+(hitTarget==="mammoth"?bounce*.23:0);
  if(human){
    human.rotation.z=Math.sin(t*2)*.012+(hitTarget==="human"?bounce*.13:0);
    human.rotation.y=Math.sin(t*.9)*.035;
  }
  if(mode==="camera")renderer.render(scene,cam);
}
requestAnimationFrame(tick);

async function stopCamera(){
  if(stream)stream.getTracks().forEach(track=>track.stop());
  stream=null;video.pause();video.srcObject=null;video.style.display="none";
  demo.style.display="block";
  $("live-label").textContent="DEMO MODU";
  $("cam-status").textContent="KAMERA KAPALI";
  $("start-text").textContent="Kamerayı Başlat";
}
async function startCamera(){
  if(stream){await stopCamera();toast("Kamera kapatıldı.");return;}
  if(!navigator.mediaDevices?.getUserMedia){toast("Kamera için HTTPS ve güncel Safari/Chrome gerekir.");return;}
  try{
    const s=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:720}}});
    stream=s;video.srcObject=s;
    await video.play();
    video.style.display="block";demo.style.display="none";
    video.style.transform=facing==="user"?"scaleX(-1)":"none";
    $("live-label").textContent="CANLI KAMERA";
    $("cam-status").textContent="KAMERA AÇIK";
    $("start-text").textContent="Kamerayı Durdur";
    toast("Kamera açıldı. Masaya doğru tut!");
  }catch(err){
    console.error(err);await stopCamera();
    toast(err.name==="NotAllowedError"?"Kamera izni engellendi. Safari'den izin ver.":"Kamera açılamadı. Demo modunu deneyebilirsin.");
  }
}
$("start").addEventListener("click",startCamera);
$("flip").addEventListener("click",async()=>{
  facing=facing==="environment"?"user":"environment";
  if(stream){await stopCamera();await startCamera();}
  else toast(facing==="environment"?"Arka kamera seçildi.":"Ön kamera seçildi.");
});
$("demo").addEventListener("click",async()=>{await stopCamera();toast("Demo sahnesi açık.");});
scaleInput.addEventListener("input",()=>setScale(Number(scaleInput.value)/100));
$("reset").addEventListener("click",()=>{
  setScale(1);
  if(model){model.position.set(0,0,0);model.rotation.set(0,0,0);}
  toast("Sahne sıfırlandı.");
});

function switchMode(next){
  if(next===mode)return;
  mode=next;
  cameraTab.classList.toggle("active",next==="camera");
  arTab.classList.toggle("active",next==="ar");
  cameraTab.setAttribute("aria-selected",String(next==="camera"));
  arTab.setAttribute("aria-selected",String(next==="ar"));
  $("camera-view").classList.toggle("active",next==="camera");
  $("ar-view").classList.toggle("active",next==="ar");
  $("ar-view").hidden=next!=="ar";
  $("camera-controls").hidden=next!=="camera";
  $("ar-controls").hidden=next!=="ar";
  if(next==="ar"){
    stopCamera();
    $("live-label").textContent="GERÇEK AR";
    notice.innerHTML='<span class="noticeicon">ⓘ</span><div><strong>Gerçek AR:</strong> Destekleyen iPhone cihazlarında Apple AR Quick Look açılır. Yüzeyi sistem algılar; bu moddaki nesneler dokunma tepkisi vermez.</div>';
  }else{
    notice.innerHTML='<span class="noticeicon">ⓘ</span><div><strong>Kamera modu:</strong> 3D görüntü kameranın üstüne eklenir; nesneler fiziksel masaya sabitlenmez. Sabitleme için Gerçek AR sekmesini kullan.</div>';
    resize();
  }
}
cameraTab.addEventListener("click",()=>switchMode("camera"));
arTab.addEventListener("click",()=>switchMode("ar"));
$("model-viewer").addEventListener("error",e=>{console.error(e);toast("AR modeli yüklenemedi. Safari ile yeniden dene.");});

$("photo").addEventListener("click",async()=>{
  if(!model){toast("3D sahne henüz hazır değil.");return;}
  try{
    const W=Math.round(Math.min(1600,Math.max(900,holder.clientWidth*2)));
    const H=Math.round(W*holder.clientHeight/holder.clientWidth);
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    if(stream&&video.readyState>=2){
      const w=video.videoWidth,h=video.videoHeight;
      const ar=Math.max(W/w,H/h),sw=W/ar,sh=H/ar;
      ctx.drawImage(video,(w-sw)/2,(h-sh)/2,sw,sh,0,0,W,H);
    }else{
      const grad=ctx.createLinearGradient(0,0,0,H);
      grad.addColorStop(0,"#294e54");grad.addColorStop(.65,"#b38c5d");grad.addColorStop(1,"#464d37");ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    }
    ctx.drawImage(renderer.domElement,0,0,W,H);
    const blob=await new Promise(ok=>c.toBlob(ok,"image/png"));
    if(!blob)throw Error("Fotoğraf oluşturulamadı");
    const file=new File([blob],"simulakron-lab.png",{type:"image/png"});
    if(navigator.canShare?.({files:[file]})&&navigator.share){
      try{await navigator.share({files:[file],title:"Simülakron Lab"});return;}catch(err){if(err.name==="AbortError")return;}
    }
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="simulakron-lab.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    toast("Fotoğraf kaydetme işlemi başlatıldı.");
  }catch(err){console.error(err);toast("Fotoğraf oluşturulamadı.");}
});
window.addEventListener("pagehide",()=>{if(stream)stream.getTracks().forEach(t=>t.stop());});
