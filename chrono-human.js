/**
 * Museum-style HUMAN REFERENCE ENCOUNTER in ChronoWorm
 *
 * Modern clothed, parametric MakeHuman-based mesh (CC0);
 * NOT a fossil scan or historical likeness. Only 2026 encounter.
 * Downloaded on user request (~17.2 MB) to conserve mobile data.
 *
 * Source: https://www.innerscene.com/tools/library/3d-parts/
 *   placing-an-item-ahead-3d-person-everyday-tasks-3904157a
 * Direct GLB link was resolved from the source's official download page.
 */
const GLB="https://files.innerscene.com/library/placing-an-item-ahead-3d-person-everyday-tasks-3904157a/12e8d991687da04c41f7/task-two-hand-place.glb";
export function createHumanEncounter({THREE,scene,curve,t,notify=()=>{}}){
 const up=new THREE.Vector3(0,1,0),p=curve.getPointAt(t),tangent=curve.getTangentAt(t);
 const side=new THREE.Vector3().crossVectors(tangent,up).normalize();
 const anchor=p.clone().addScaledVector(side,2.25).addScaledVector(up,-1.67);
 const group=new THREE.Group();
 group.position.copy(anchor);
 scene.add(group);
 const floor=new THREE.Mesh(
  new THREE.CylinderGeometry(.87,.98,.15,48),
  new THREE.MeshPhysicalMaterial({color:0x173d44,metalness:.55,roughness:.32,emissive:0x113f43,emissiveIntensity:.6}));
 floor.position.y=-.05;
 group.add(floor);
 const rim=new THREE.Mesh(
  new THREE.TorusGeometry(.89,.018,8,96),
  new THREE.MeshBasicMaterial({color:0x91e2cb,transparent:true,opacity:.8}));
 rim.rotation.x=-Math.PI/2;rim.position.y=.04;group.add(rim);
 const beam=new THREE.Mesh(
  new THREE.CylinderGeometry(.58,.76,2.65,32,1,true),
  new THREE.MeshBasicMaterial({color:0x70dfca,transparent:true,opacity:.075,depthWrite:false,side:THREE.DoubleSide}));
 beam.position.y=1.35;group.add(beam);
 const fake=new THREE.Group();
 // No primitive "person" placeholder: only a spotlight stands until the model is loaded.
 const face=new THREE.PointLight(0xf7d8bb,5,6,2);face.position.set(.8,2.4,1.8);group.add(face);
 let pending=null,figure=null;
 group.visible=false;
 function visible(now){group.visible=Math.abs(t-now)<.036;}
 async function load(){
  if(figure)return true;
  if(pending)return pending;
  notify("İnsan referansı indiriliyor (17,2 MB)...");
  pending=(async()=>{
   const {GLTFLoader}=await import("three/addons/loaders/GLTFLoader.js");
   const gltf=await new Promise((resolve,reject)=>new GLTFLoader().load(GLB,resolve,undefined,reject));
   const root=gltf.scene;
   const box=new THREE.Box3().setFromObject(root);
   if(box.isEmpty())throw Error("GLB boş.");
   const height=box.max.y-box.min.y;
   if(!(height>0))throw Error("Model ölçeği geçersiz");
   const scale=2.55/height,center=box.getCenter(new THREE.Vector3());
   root.scale.setScalar(scale);
   root.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
   root.traverse(o=>{
    if(o.isMesh){
      o.castShadow=true;o.receiveShadow=true;
      if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){
        if(m.map)m.map.colorSpace=THREE.SRGBColorSpace;
        m.roughness=Math.max(.3,m.roughness??.7);
      }}
    }
   });
   group.add(root);figure=root;
   notify("Gerçekçi anatomi ve giysi dokulu modern insan referansı yüklendi. Tarihî kişi değildir.");
   return true;
  })().catch(err=>{pending=null;notify("Model indirilemedi. Kaynak sayfasından açabilir veya tekrar deneyebilirsin.");console.error("Human Encounter:",err);return false;});
  return pending;
 }
 return {load,visible,dispose(){scene.remove(group);group.traverse(obj=>{obj.geometry?.dispose?.();if(obj.material){for(const m of Array.isArray(obj.material)?obj.material:[obj.material])m.dispose?.();}});},sourceUrl:"https://www.innerscene.com/tools/library/3d-parts/placing-an-item-ahead-3d-person-everyday-tasks-3904157a"};
}
