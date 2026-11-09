import * as THREE from "three";
import {tunnelVertex,tunnelFragment} from "./chrono-shaders.js";
import {EXHIBITS,scaleYear} from "./chrono-data.js";
import {createHumanEncounter} from "./chrono-human.js";

/**
 * ChronoWorm renderer. The curved passage is an artistic visualization.
 * Positions along the tunnel are proportional to elapsed CALENDAR years.
 * It does not simulate a traversable relativistic wormhole.
 */
export function createChronoRenderer({canvas,viewport,onProgress=()=>{},onStatus=()=>{},onHuman=()=>{}}){
 let scene,camera,renderer,clock,curve,frames,mat,railing=[],light,human=null,particleGeometry=null,totalParticles=0;
 let smoothFov=72,headTurn={x:0,y:0},desiredHead={x:0,y:0};
 let current=0,target=0,autoplay=false,raf=null,lastRead=-100,speed=1,visualQuality=1,elapsed=0;
 const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||false;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const makeCurve=()=>{
  const pts=[];
  for(let i=0;i<=180;i++){
   const t=i/180;
   pts.push(new THREE.Vector3(
    Math.sin(t*10.2)*1.1+Math.sin(t*19.4)*.6,
    Math.cos(t*8.4)*.68+Math.sin(t*15.2)*.43,
    5-t*280));
  }
  return new THREE.CatmullRomCurve3(pts,false,"centripetal",.5);
 };
 function setup(){
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x030c16);
  camera=new THREE.PerspectiveCamera(72,1,.025,170);
  clock=new THREE.Clock();
  curve=makeCurve();
  // Parallel-transported local frames reduce sudden camera roll in bent sections.
  frames=curve.computeFrenetFrames(700,false);
  const g=new THREE.TubeGeometry(curve,700,4.35,30,false);
  mat=new THREE.ShaderMaterial({
   vertexShader:tunnelVertex,fragmentShader:tunnelFragment,
   side:THREE.BackSide,depthWrite:true,uniforms:{uTime:{value:0},uVelocity:{value:0},uChronology:{value:0},uDetail:{value:1}}
  });
  scene.add(new THREE.Mesh(g,mat));
  const ringGeometry=new THREE.TorusGeometry(3.93,.03,7,108);
  const materials={
   evidence:new THREE.MeshBasicMaterial({color:0x83cbbb,transparent:true,opacity:.75,depthWrite:false}),
   inference:new THREE.MeshBasicMaterial({color:0xe5b57d,transparent:true,opacity:.8,depthWrite:false}),
   fiction:new THREE.MeshBasicMaterial({color:0xc3a1f4,transparent:true,opacity:.8,depthWrite:false})
  };
  for(const item of EXHIBITS){
   const t=clamp(scaleYear(item.year),.00001,.99999),gate=new THREE.Mesh(ringGeometry,materials[item.type]);
   gate.position.copy(curve.getPointAt(t));
   gate.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),curve.getTangentAt(t));
   railing.push({mesh:gate,t,item});
   scene.add(gate);
  }
  // Each archive gate is accompanied by an actual 3D billboard.
  // This makes historical years appear inside the passage while travelling.
  const stamp=(item)=>{
   const c=document.createElement("canvas");c.width=640;c.height=176;
   const x=c.getContext("2d");
   x.fillStyle="rgba(3,16,27,.88)";x.fillRect(0,0,640,176);
   x.strokeStyle=item.type==="fiction"?"#c6a5f4":item.type==="evidence"?"#8ee4d1":"#f3ba83";
   x.lineWidth=4;x.strokeRect(4,4,632,168);
   const year=item.year<0?"MÖ "+Math.abs(item.year):String(item.year);
   x.fillStyle="#f3e7d1";x.font="bold 43px system-ui";x.fillText(year,28,61);
   x.font="bold 30px system-ui";x.fillStyle="#b5e0d8";
   x.fillText(item.label.slice(0,29),28,111);
   x.font="bold 16px system-ui";x.fillStyle="#91b1bd";
   x.fillText((item.type==="fiction"?"GELECEK KURGUSU":item.type==="evidence"?"KANITA DAYALI":"YORUM / ÇIKARIM")+"  •  SİMÜLASYON",28,146);
   const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
   const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:true,depthWrite:false}));
   sprite.scale.set(3.1,.85,1);
   return sprite;
  };
  for(const gate of railing){
    const item=gate.item;
    const plaque=stamp(item);
    const tangent=curve.getTangentAt(gate.t);
    const side=new THREE.Vector3().crossVectors(tangent,new THREE.Vector3(0,1,0)).normalize();
    plaque.position.copy(gate.mesh.position).addScaledVector(side,1.95);
    plaque.position.y+=.72;
    gate.billboard=plaque;
    scene.add(plaque);
  }
  human=createHumanEncounter({THREE,scene,curve,t:scaleYear(2026),notify:onHuman});
  const particleCount=2400,positions=new Float32Array(particleCount*3);
  totalParticles=particleCount;
  let seed=98109;
  const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const up=new THREE.Vector3(0,1,0);
  for(let i=0;i<particleCount;i++){
   const t=.002+rand()*.996,p=curve.getPointAt(t),tangent=curve.getTangentAt(t);
   const normal=new THREE.Vector3().crossVectors(up,tangent).normalize();
   const binormal=new THREE.Vector3().crossVectors(tangent,normal).normalize();
   const theta=rand()*Math.PI*2,r=.4+rand()*3.7;
   p.addScaledVector(normal,Math.cos(theta)*r);
   p.addScaledVector(binormal,Math.sin(theta)*r);
   positions[i*3]=p.x;positions[i*3+1]=p.y;positions[i*3+2]=p.z;
  }
  const pgeo=new THREE.BufferGeometry();
  particleGeometry=pgeo;
  pgeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
  scene.add(new THREE.Points(pgeo,new THREE.PointsMaterial({
   color:0xc1f2de,size:.055,transparent:true,opacity:.88,depthWrite:false,sizeAttenuation:true
  })));
  light=new THREE.PointLight(0x7ad4bd,12,18,2);scene.add(light);
  resize();new ResizeObserver(resize).observe(viewport);window.addEventListener("resize",resize);
  // Small look offset creates a first-person sliding effect without changing calendar time.
  viewport.addEventListener("pointermove",e=>{
    if(e.buttons||e.pressure>0)return;
    const rect=viewport.getBoundingClientRect();
    desiredHead.x=clamp(((e.clientX-rect.left)/rect.width-.5)*.065,-.032,.032);
    desiredHead.y=clamp(((e.clientY-rect.top)/rect.height-.5)*-.045,-.024,.024);
  });
  viewport.addEventListener("pointerleave",()=>{desiredHead.x=0;desiredHead.y=0});
  loop();onStatus("running");
 }
 function resize(){
  if(!renderer)return;
  const w=viewport.clientWidth,h=viewport.clientHeight;if(w<1||h<1)return;
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
 }
 function loop(){
  raf=requestAnimationFrame(loop);
  if(document.hidden)return;
  const dt=Math.min(clock.getDelta(),.06);
  if(autoplay){
   target=clamp(target+dt*.016*speed,0,1);
   if(target>=1){autoplay=false;onStatus("ended");}
  }
  const delta=target-current;
  current+=Math.abs(delta)<.000005?delta:delta*Math.min(1,dt*(reduced?20:3.6));
  const t=clamp(current,.00007,.999);
  const p=curve.getPointAt(t),tangent=curve.getTangentAt(t);
  const index=Math.min(699,Math.floor(t*700));
  const up=frames.normals[index].clone().lerp(frames.normals[index+1],t*700-index).normalize();
  const right=frames.binormals[index].clone().lerp(frames.binormals[index+1],t*700-index).normalize();
  const k=clamp(dt*3.8,0,1);
  headTurn.x+=((reduced?0:desiredHead.x)-headTurn.x)*k;
  headTurn.y+=((reduced?0:desiredHead.y)-headTurn.y)*k;
  camera.position.copy(p).addScaledVector(right,headTurn.x).addScaledVector(up,headTurn.y);
  // Look along the actual tangent: motion through a curved tube rather than jumping between static rings.
  camera.up.copy(up);
  camera.lookAt(p.clone().addScaledVector(tangent,4.0).addScaledVector(right,headTurn.x*1.5));
  const requestedFov=reduced?72:72+(autoplay?Math.min(11,speed*3.8):0);
  smoothFov+=(requestedFov-smoothFov)*Math.min(1,dt*2.5);
  if(Math.abs(camera.fov-smoothFov)>.01){camera.fov=smoothFov;camera.updateProjectionMatrix();}
  light.position.copy(p);
  elapsed+=dt;
  mat.uniforms.uTime.value=elapsed;
  mat.uniforms.uVelocity.value=reduced?0:(autoplay?speed:.05);
  mat.uniforms.uChronology.value=t;
  mat.uniforms.uDetail.value=visualQuality;
  for(const gate of railing){const visible=Math.abs(gate.t-t)<.10;gate.mesh.visible=visible;gate.billboard.visible=visible;}
  human?.visible(t);
  renderer.render(scene,camera);
  if(performance.now()-lastRead>80){lastRead=performance.now();onProgress(current,{autoplay,target});}
 }
 try{setup()}catch(e){console.error("ChronoWorm WebGL:",e);onStatus("unavailable");}
 return {
  isReady:()=>!!renderer&&!!scene,
  loadHuman:()=>human?.load()??Promise.resolve(false),
  setSpeed(v){speed=clamp(Number(v)||1,.15,4)},
  setQuality(v){
    visualQuality=clamp(Number(v)||1,.2,1);
    if(renderer){const maxDpr=Math.min(window.devicePixelRatio||1,1.6);
      renderer.setPixelRatio(maxDpr*(.45+.55*visualQuality));
      resize();
    }
    particleGeometry?.setDrawRange(0,Math.max(500,Math.floor(totalParticles*(.28+.72*visualQuality))));
  },
  go(t){target=clamp(t,0,1);autoplay=false;onStatus("paused")},
  seek(t){target=current=clamp(t,0,1);autoplay=false;onStatus("paused");onProgress(current,{autoplay,target})},
  play(){if(target>.999){target=0;current=0;}autoplay=true;onStatus("playing")},
  pause(){autoplay=false;onStatus("paused")},
  isPlaying:()=>autoplay,
  target:()=>target,
  current:()=>current,
  destroy(){cancelAnimationFrame(raf);human?.dispose();renderer?.dispose();}
 };
}