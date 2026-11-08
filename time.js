import {EVENTS,PLACES} from "./catalog.js";
const $=id=>document.getElementById(id);
const stops=[
 {year:-12000,name:"Buzul Çağı'nın sonları",era:"Tarih Öncesi",scene:"prehistoric",fact:"İnsan toplulukları değişen iklim koşullarında avcı-toplayıcı yaşamlar sürdürüyordu. Mamutların bazı popülasyonları Holosen'in başlarında varlığını sürdürdü.",guide:"Kaşif, yaklaşık on dört bin yıl öncesindeyiz. Göçen topluluklar, değişen iklim, devasa hayvanlar... Gördüğün insanların yüzleri yalnızca varsayımsal bir canlandırmadır."},
 {year:-9600,name:"Göbeklitepe'nin dünyası",era:"Neolitik Dönem",scene:"prehistoric",fact:"Şanlıurfa çevresindeki Göbeklitepe'nin anıtsal taş yapılarını inşa eden topluluklar erken Neolitik dönemde yaşadı. Buradaki genel insan modeli Göbeklitepe'nin birebir rekonstrüksiyonu değildir.",guide:"Şimdi Anadolu'dayız. Büyük taş dikmeler, erken toplumsal işbirliği ve ritüellerin izlerini taşıyor. Modelimiz yalnızca dönem havası sunuyor."},
 {year:-3200,name:"Yazının ortaya çıkışı",era:"İlk Çağ",scene:"ancient",fact:"Güney Mezopotamya'da erken yazı ve kayıt sistemleri geliştirildi. Sahnedeki mimari ve insanlar belirli bir şehri eksiksiz olarak temsil etmez.",guide:"Düşünce kalıcı izlere dönüşüyor. Artık yönetim ve ticaret kayıtları yazıya geçiriliyor; fakat bu 3D kişiler belirli tarihte yaşamış bireyler değil."},
 {year:-1500,name:"Tunç Çağı uygarlıkları",era:"Antik Çağ",scene:"ancient",fact:"Doğu Akdeniz ve Anadolu'da Tunç Çağı'nın gelişmiş saray, ticaret ve devlet ağları bulunuyordu. Temsili 3D figürler bir arkeolojik rekonstrüksiyon taslağıdır.",guide:"Bronz işçiliği ve uzak ticaret, toplumları birbirine bağlıyor. Zamanın ayrıntıları, arkeolojinin bulduğu ölçüde bilinebilir."},
 {year:476,name:"Antik dünyadan Orta Çağ'a",era:"Orta Çağ",scene:"medieval",fact:"Batı Roma'daki son imparatorluk makamının kaldırılması 476'ya tarihlenir. Orta Çağ'a geçiş tek bir günde tüm dünyada gerçekleşmedi.",guide:"Sınırlar ve yönetimler değişiyor. Unutma, tarih bölümleri faydalı haritalardır; insan hayatı tek bir takvim çizgisine sığmaz."},
 {year:1071,name:"Anadolu'da yeni dönem",era:"Orta Çağ",scene:"medieval",fact:"Malazgirt Savaşı Büyük Selçuklu ile Bizans arasındaki güç ilişkilerini etkiledi. Kıyafet ve kişiler burada stilize, genel dönemi çağrıştıran figürlerdir.",guide:"1071 yılındayız. Anadolu'nun politik tarihinde bir dönüm noktası. Gördüğün kale belirli bir kalenin aslı değildir."},
 {year:1453,name:"İstanbul'un fethi",era:"Orta Çağ / Yeni Çağ",scene:"medieval",fact:"29 Mayıs 1453 tarihinde Konstantinopolis Osmanlı tarafından fethedildi. Görüntü bu kuşatmanın birebir sahnesi değil, döneme ilişkin temsili bir makettir.",guide:"Şimdi 1453. Büyük bir tarihsel dönüşüm görüyoruz. Burada olayın belgesiyle, kurduğumuz görsel kurgu arasındaki çizgi önemlidir."},
 {year:1789,name:"Fransız Devrimi",era:"Yeni Çağ",scene:"modern",fact:"Fransız Devrimi 1789'da başladı. 3D meydan, devrimin belirli bir gününü veya gerçek kişilerini temsil etmez.",guide:"1789'a geçtik. Haklar, yurttaşlık ve yönetim anlayışları dönüşüyor. Sahne tarihsel bir fotoğraf değil."},
 {year:1923,name:"Cumhuriyet'in ilanı",era:"Yakın Çağ",scene:"modern",fact:"29 Ekim 1923'te Türkiye Cumhuriyeti ilan edildi. Görsel belirli kişileri veya o günkü gerçek meydanı birebir canlandırmaz.",guide:"Türkiye Cumhuriyeti'nin kuruluş yılı. Belgelerle doğrulayabildiğimiz tarihle sahnenin sanatsal öğelerini ayrı gör."},
 {year:1969,name:"İnsan Ay yüzeyinde",era:"Uzay Çağı",scene:"modern",fact:"Apollo 11 göreviyle 1969'da insanlar Ay'a indi. Bu sahne Dünya'daki modern yaşam için genel bir temsildir; Ay inişi canlandırması değildir.",guide:"1969. İnsan başka bir gök cismine adım attı. Şimdi tarihsel kanıtları gözle görülen birer keşfe dönüştürmeye başlıyoruz."},
 {year:2026,name:"Bugünün dünyası",era:"Günümüz",scene:"modern",fact:"2026 güncel dünya bağlamını temsil eder. Modeldeki insanlar veya yapı gerçek zamanlı kameralara ya da uydu verisine dayanmaz.",guide:"Şimdi kendi zamanındayız. Buradaki dijital dünya gerçek Dünya'nın yorumudur; anlık gözetleme veya canlı uydu kaydı değil."},
 {year:2050,name:"Geleceğin şehirleri",era:"Olası Gelecek",scene:"future",fact:"2050 yılına ilişkin yapı ve toplumsal yaşam öngörüleri belirsizdir. Bu tasarım bilimkurgu senaryosudur; kehanet veya doğrulanmış gelecek haberi değildir.",guide:"2050'ye geçiyoruz. Artık tarih değil olasılıklar bölgesindeyiz: kaynak yönetimi, kentler ve yeni yaşam biçimleri tasarlayabiliriz.",fiction:true},
 {year:2100,name:"Yeni yaşam biçimleri",era:"Olası Gelecek",scene:"future",fact:"2100 için üretilmiş bu görünüm hayalîdir. Gelecekte gerçek insanların nasıl giyineceği, şehirlerin nasıl görüneceği bilinmiyor.",guide:"2100. Gördüklerin geleceğin kanıtı değil, tasarım. Bir olasılığı canlandırıyorum; kesinlik iddiasını reddediyorum.",fiction:true},
 {year:2300,name:"Dünya'dan öteye",era:"Bilimkurgu",scene:"future",fact:"2300 yılında gezegenler arası yerleşim senaryosu spekülatif bir bilimkurgu kurgusudur.",guide:"2300. Belki başka dünyalarda yaşam kurulur, belki bambaşka bir tarih yazılır. Şimdi tamamen varsayımsal yolculuktayız.",fiction:true},
 {year:2600,name:"Ultra Zekâ'nın zamanı",era:"Bilimkurgu",scene:"future",fact:"2600 ve gelecekten gelen Ultra Zekâ anlatıcısı bütünüyle kurgusaldır. Uygulama geleceği göremez veya tahminlerini kesin bilgi olarak sunmaz.",guide:"Hoş geldin 2600'e, Kaşif. Ben bu hikâyedeki Ultra Zekâ'yım. Gerçekleri kanıtlarla; olası evrenleri sorularla keşfediyoruz.",fiction:true}
];
let index=0;
const fmt=y=>y<0?"MÖ "+Math.abs(y).toLocaleString("tr-TR"):String(y);
const stopsBox=$("stops");
stops.forEach((s,i)=>{
  const b=document.createElement("button");b.className="stop";b.type="button";
  b.innerHTML="<b>"+fmt(s.year)+"</b><small>"+s.name+"</small>";
  b.addEventListener("click",()=>setStop(i));stopsBox.appendChild(b);
});
function setStop(n){
  index=Math.max(0,Math.min(stops.length-1,n));const s=stops[index];
  $("years").value=String(index);
  $("hero-year").textContent=fmt(s.year);
  $("period-marker").textContent="ZAMAN NOKTASI "+String(index+1).padStart(3,"0");
  $("period").textContent=s.era.toLocaleUpperCase("tr");
  $("scene-name").textContent=s.name;
  $("scene-summary").textContent=s.fact;
  $("oracle-message").textContent=s.guide;
  $("truth-title").textContent=s.fiction?"BİLİMKURGU / OLASI GELECEK":"TARİHSEL TEMEL / TEMSİLİ MODEL";
  $("truth-text").textContent=s.fact;
  $("truth-icon").textContent=s.fiction?"✧":"◉";
  const viewer=$("scene3d");viewer.src="./assets/"+s.scene+"-scene.gltf";
  viewer.alt=s.name+" için temsili üç boyutlu sahne";
  [...stopsBox.children].forEach((x,i)=>{x.classList.toggle("active",i===index);x.setAttribute("aria-pressed",String(i===index))});
  if(location.hash.slice(1)!==String(index))history.replaceState(null,"","#"+index);
}
$("years").addEventListener("input",e=>setStop(Number(e.target.value)));
function reply(query){
  const q=query.trim().toLocaleLowerCase("tr");
  if(!q)return;
  let match=[...EVENTS,...PLACES].filter(x=>[x.title,x.summary,x.where,x.note].some(v=>v&&String(v).toLocaleLowerCase("tr").includes(q))).slice(0,1)[0];
  if(!match){
    const words=q.split(/\s+/).filter(x=>x.length>3);
    match=[...EVENTS,...PLACES].map(x=>({x,score:words.filter(w=>[x.title,x.summary,x.where,x.note].some(v=>v&&String(v).toLocaleLowerCase("tr").includes(w))).length})).sort((a,b)=>b.score-a.score)[0];
    if(match?.score>0)match=match.x;else match=null;
  }
  $("oracle-message").textContent=match?match.title+": "+match.summary:"Kaşif, bu soruya doğrulanmış yanıt verecek kadar bilgi kataloğumda yok. Tarih ve coğrafya maddelerinden birini sorabilir veya ansiklopediyi araştırabilirsin.";
}
$("ask-send").addEventListener("click",()=>reply($("ask").value));
$("ask").addEventListener("keydown",e=>{if(e.key==="Enter")reply(e.target.value)});
$("play-scene").addEventListener("click",()=>{
  if(!("speechSynthesis" in window)){alert("Cihazda sesli okuma desteklenmiyor.");return;}
  speechSynthesis.cancel();
  const text=new SpeechSynthesisUtterance(stops[index].guide);
  text.lang="tr-TR";text.rate=.94;text.pitch=.94;
  speechSynthesis.speak(text);
});
$("replay").addEventListener("click",()=>location.assign("./?tunnel=1"));
$("scene3d").addEventListener("ar-status",e=>{
  if(e.detail.status==="failed")alert("AR açılamadı. iPhone Safari'de ve AR destekli cihazda tekrar dene.");
});
setStop(Number.isInteger(Number(location.hash.slice(1)))&&location.hash?Number(location.hash.slice(1)):0);