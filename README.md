# ◈ Simülakron Atlas V3.2 — CHRONOWORM Ω-9

**İçinden geçilebilen 3D zaman koridoru · Doğrusal tarihsel takvim · Kanıt arşivi · NOAA gözlem verileri · Antropoloji Laboratuvarı · Fizik ve astronomi**

GitHub Pages: **https://tryamaha.github.io/Simulakron-lab/**

## V3.2 — Tamamlanan üç boyutlu koridor geliştirmesi

- **İçinden kayılan gerçek 3D geçit:** Kamera, Catmull–Rom kıvrımlı tüpün yolunu takip eder. Kamera eksenleri hesaplanan Frenet çerçevelerine bağlandı; kıvrımlarda sabit dünya-yukarı vektörüne takılıp perspektif atlaması yapmaz.
- **Görsel kalite:** Çok katmanlı GPU akış lifleri, ışık parçacıkları, 3D yıl kapıları ve yıl/olay etiketleri. Otomatik seyrüseferde alan açısı sınırlı biçimde değişir. Mobil kalite ayarı gerçek çözünürlüğü ve çizilen parçacık sayısını azaltır.
- **Sesli rehber:** Kullanıcının açtığı Arşiv Zekâ Ω-9 anlatımı, duraklardan geçerken tarihsel kanıt/senaryo statüsüyle birlikte konuşur. Canlı yapay zekâ değil; yerel kaynaklı metinlerin cihazın konuşma motoruyla okunmasıdır.
- **Gerçekçi insan karşılaştırması:** 2026 istasyonunda, kullanıcının isteğiyle indirilen, giysi/saç/deri dokuları içeren bir modern insan GLB referansı bulunur (~17,2 MB). Kaynak: [Innerscene / MakeHuman CC0](https://www.innerscene.com/tools/library/3d-parts/placing-an-item-ahead-3d-person-everyday-tasks-3904157a). **Eski insanın birebir yüzü veya tarihsel dönem kıyafeti değildir.** Harici GLB sunucusunun Safari CORS ve ağ davranışı her cihazda doğrulanmamıştır; hata durumunda kaynak sayfasına gitmek mümkündür.
- **Düşük poligonlu eski insan modelleri ana tarih zaman sahnesinden çıkarılmıştır.** Eski AR prototipi ayrı bir deneyim olarak bulunabilir; dönemlere özgü, bilimsel kaynaklı, yüksek ayrıntılı rekonstrüksiyonlar henüz tamamlanmamıştır.
- **Test:** GitHub Actions Node 22 üzerinde `npm test` ve temel ChronoWorm sözdizimi denetimleri çalışır. WebGL, iPhone Safari ve dış GLB sunucusu için gerçek cihaz testleri ayrı gereklidir.

**Bilimsel ayrım:** GPU koridoru Einstein alan denklemlerinden türetilmiş geçilebilir bir solucan deliği modeli değildir. Kronoloji konumu gerçek takvim yılına orantılıdır; kamera hareketinin hızı ve rengi sinematik anlatı efektidir. Gelecek 2050–3000 katmanları kanıtlı gözlem değil, kurgu arşividir.

## Bilimsel V3: CHRONOWORM

- **[ChronoWorm / 3D Zaman Koridoru](./chrono.html):** Kıvrılan ve içinden kayarak geçilen gerçek WebGL 3D tüp geometri. Kaydırma, dokunma, önceki/sonraki dönem, otomatik ileri hareket ve klavye desteği. Kameranın koridor boyunca konumu normalleştirilmiş *gerçek takvim yılı mesafesi* ile değişir; olaylar gerçekte eşit aralıklı olmadığı için 3D konumları da eşit aralıklı değildir.
- **[Antropoloji ve Rekonstrüksiyon](./anthropology.html):** Önceki basit insan modelleri ana zaman sahnesinden kaldırılmıştır. Açık lisanslı, yüksek ayrıntılı Khronos 3D kafatası örneği yalnızca kullanıcı isteyince indirilir. Bu bir kazı buluntusu, tarihî kişiye ait kafatası veya fotogerçek tarihî yüz rekonstrüksiyonu *değildir*.
- **[Atmosfer / İklim Modülü](./chrono.html#earth-science):** NOAA GML 2026-10 sürümünden birebir 47 küresel yıllık CO₂ değeri (1979–2025); 2025 ön veri olarak işaretlenir. Ölçüm olmayan yıllar için **ölçüm icat edilmez**. USGS son buzul maksimumu karşılaştırması farklı tarihsel bağlamıyla sunulur.
- **Kaynak sınıfları:** "Tarihsel/arkeolojik kanıt", "dolaylı kanıt / yorum" ve "gelecek kurgusu". Her durak ne bilindiğini ve ne bilinmediğini açıklar; doğrulanmamış yüzler/kıyafetler gerçek diye sunulmaz.
- **Giriş:** Atlas'a ilk ziyaret otomatik olarak `chrono.html?arrival=1` adresine yönlenir ve, azaltılmış hareket tercihi yoksa, tünel akışı başlar. Sonraki ziyaretlerde ansiklopedi ana sayfası açılır.

### Bilimsel sınırlar

ChronoWorm tüneli fiziksel bir solucan deliğinin geçilebilir olduğunu veya geçmişe yolculuğun mümkün olduğunu kanıtlamaz. Bu, fiziksel olarak yorumlanan bir **takvim ekseninin sanatsal 3D temsili**dir. Atmosfer CO₂ verisi 1979'dan önce bu NOAA yıllık serisinde yoktur ve geleceğe ölçüm yapılmaz. Kafatası örneği ise sanatçı üretimi bir glTF materyal demodur, eski insanların gerçek yüzü değildir. iOS/Android'de özel WebGL ve AR davranışları gerçek cihazda ayrıca test edilmelidir.

### Kaynaklar ve lisans

- [UNESCO: Göbeklitepe](https://whc.unesco.org/en/list/1572) — MÖ 9600–8200 anıtsal yapılar
- [NOAA GML: Küresel CO₂](https://gml.noaa.gov/ccgg/trends/gl_data.html) — Lan, Tans & Thoning 2026-10, 2025 ön veri
- [USGS: Son Buzul Maksimumu ve deniz seviyesi](https://www.usgs.gov/faqs/how-does-present-glacier-extent-and-sea-level-compare-extent-glaciers-and-global-sea-level) — yaklaşık 20 bin yıl önce; MÖ 12.000 için doğrudan sayı olarak kullanılamaz
- [Khronos / ScatteringSkull](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ScatteringSkull) — Vladimir Petkovic, **CC0-1.0**; dış kaynakta barındırılan 3D sanatçı modeli, laboratuvar içinde isteğe bağlı yüklenir

### Otomatik kalite testleri

`npm test` bilim motoru için 9 test ve ChronoWorm kronolojisi/kanıt/NOAA veri bütünlüğü için 9 test çalıştırır; toplam **18 test**. `.github/workflows/science.yml` bu testleri ilgili dosyalarda değişiklik olduğunda GitHub Actions üzerinde yeniden çalıştırır. Matematiksel testlerin başarılı olması, sinematik görselleştirmenin tarihsel olayları fiziksel olarak yeniden ürettiği ya da mobil tarayıcıda sorunsuz çalıştığı anlamına gelmez.

---

## Sentinel Anadolu / Bölgesel Risk Gözlemevi

**[Sentinel Anadolu'yu aç](./sentinel.html)** — Türkiye ve yakın çevresindeki depremler, meteorolojik durumlar ve kamuya açık güvenlik kaynakları.

- **Deprem:** USGS FDSN API, son yedi gün, 33°–44° K / 24°–47° D sınır kutusu, büyüklük filtresi ve kaynak bağlantıları. USGS olayların büyüklük/konum/derinlik tahminlerini güncelleyebilir.
- **Meteoroloji:** Open-Meteo tahmin modeli; Türkiye ve komşu ülkelerden seçilen şehirlerde sıcaklık, yağış, rüzgâr, hamle. Model verisi resmî MGM MeteoUYARI değildir. MGM resmî bağlantısı ayrıca sunulur.
- **Askerî ve güvenlik:** Yalnızca kamuya açık MSB, Dışişleri ve afet/havacılık kurumu açıklamalarına kaynak bağlantıları. **Canlı askerî birlik, uçak, gemi veya hassas tesis takip edilmez.** Haber/duyuru otomatik doğrulanmış olay olarak haritaya işlenmez.
- **Hata davranışı:** API erişim hatasında sıfır olay veya normal hava iddiası üretilmez; “veri alınamadı” denir.
- **Kullanım:** Deprem ve hava servisleri internet gerektirir. Harita OpenStreetMap/Leaflet kullanır. İçerik bir acil durum alarm sistemi değildir.

Kaynaklar: [USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), [USGS FDSN](https://earthquake.usgs.gov/fdsnws/event/1/), [Open-Meteo](https://open-meteo.com/en/docs), [MGM MeteoUYARI](https://www.mgm.gov.tr/meteouyari/turkiye.aspx), [AFAD](https://www.afad.gov.tr/).

## Bölümler

| Bölüm | Bağlantı | Amaç |
|---|---|---|
| Ana atlas | [Ana Sayfa](./index.html) | 88 tarih maddesi, 108 coğrafya kaydı, filtreler, interaktif harita, bilgi testi |
| V3 Zaman Koridoru | [chrono.html](./chrono.html) | Kıvrılan, gezinilebilir 3D dönem tüneli, kanıt kartları, iklim verileri |
| Antropoloji Laboratuvarı | [anthropology.html](./anthropology.html) | Açık lisanslı yüksek ayrıntılı 3D anatomi gösterimi; rekonstrüksiyonun bilimsel sınırları |
| Sihirli Küre | [globe.html](./globe.html) | Dönüş yapan 3D Dünya, temsilî coğrafya ve tarih noktaları |
| AR Zaman Küresi | [globe-ar.html](./globe-ar.html) | Dünya küresini veya tarihsel ve geleceğe ait stilize sahneleri AR ile yerleştirme |
| Zaman Kaşifi | [time.html](./time.html) | MÖ 12.000'den 3000'e 16 durak ve 3D dönem sahneleri |
| 3000 Dürbünü | [telescope.html](./telescope.html) | Canlı kamera, 1–8× dijital görüntü büyütme, yeşil görüntü filtresi, hesaplanan gök haritası, yıl merceği |
| Sihirli Pencere | [magic-window.html](./magic-window.html) | Kamera + kullanıcının seçtiği fotoğraf ile dairesel duvar arkası illüzyonu |
| Mamut Deneyimi | [lab.html](./lab.html) | Tarih öncesi insan ve mamut içeren etkileşimli kamera/AR gösterimi |

**Yeni bilimsel modüller:** [Uzay–Zaman Laboratuvarı](./time.html#physics-lab) ve [Bilimsel Gökyüzü / Kamera Tanılaması](./telescope.html#sky-science).

İlk ziyaret sırasında sinematik **Zaman Kapısı** açılır. İsteyen kullanıcı animasyonu geçebilir; ana sayfadaki *Zaman Kapısı* düğmesiyle tekrar açabilir. `?tunnel=1` parametresi animasyonu doğrudan başlatır.

## Simülakron metodolojisi

Bu projede kullanıcıya üç bilgi düzeyi açıkça gösterilir:

1. **Tarihsel/coğrafi bilgi:** Tarih ve coğrafyaya ilişkin doğrulanabilir iddialar. Ansiklopedi maddeleri kısa, editoryal başlangıç kayıtlarıdır ve bağımsız kaynak kontrolü yapılmalıdır.
2. **Temsilî 3D canlandırma:** Mamutlar, insanlar, yapılar, giysiler ve hareketler. Tarihsel dönemlerden esinlenir, ancak belirli bir tarihi olayı veya gerçek insanın birebir görünümünü sunmaz.
3. **Gelecek kurgusu:** 2050 ve sonrası sahneler geleceğe ilişkin bilgi veya tahmin garantisi değildir. “Ultra Zekâ Ω” gelecekten gelen **kurgusal bir rehber** karakteridir.

**Önemli teknik sınırlar**

- Telefonun normal kamerası opak bir duvarın arkasını görmez. *Sihirli Pencere* yalnızca önceden çekilmiş/kullanıcı tarafından yüklenmiş bir fotoğrafı bindirir.
- Dürbündeki 8× büyütme **dijital zoomdur**; optik teleskop veya mikroskop değildir. Sensörde bulunmayan fiziksel detayları yaratamaz.
- Gökyüzü modundaki yıldız grafiği **sanal** olup gerçek zamanlı yıldız koordinatları veya astronomik teşhis sağlamaz.
- Kameraya bindirilen 3D nesneler kamera modunda fiziksel yüzeye kilitlenmez. Destekleyen mobil cihazlarda **AR Quick Look/Scene Viewer** ile gerçek yüzey yerleştirme denenebilir.
- Canlı video, tarihsel olayların geçmiş görüntülerini veya gelecekteki gerçek olayları göstermez.
- Model sahneleri **stilize, düşük poligonlu prototiplerdir**; fotogerçekçi insan simülasyonu değildir.
- Şu an canlı bulut tabanlı yapay zekâ API'sı bağlı değildir; rehber yerel katalog ve hazırlanmış senaryolara göre çalışır.

## Kullanım

Projeyi GitHub Pages'te yayımlamak için GitHub **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.

Mobil Safari/Chrome kullan. Kamera erişimi için HTTPS gerekir. Canlı kamerayı yalnızca kullanıcı düğmeye bastığında açıyoruz. Kamera görüntüsü bu sürümde uygulamanın arka ucuna yüklenmez; fotoğraf kayıtları cihazda oluşturulur. Sihirli Pencere'de kullanıcı tarafından seçilen fotoğrafın görüntüsü tarayıcı oturumunda kalır. Harita, 3D kütüphaneleri ve Dünya dokusunun yüklenmesi için internet bağlantısı gerekebilir.

## Bilimsel model (v2.0)

**Astronomi:** `science-core.js` ve `science-sky.js`, şimdiki UTC zamanından Julian tarihi, yaklaşık Greenwich ortalama yıldız zamanını (GMST), yıldızların J2000 sağ açıklık/dik açıklık koordinatlarından gözlemciye göre yükseklik ve azimutunu hesaplar. Güneş yönü de yaklaşık ekliptik koordinatlardan dönüştürülür. Gökyüzü gösterimi **kuzey üstte ve zenit merkezde** olan bir ufuk haritasıdır; telefonun baktığı yöne bağlı değildir. Atmosferik kırılma, presesyon, öz hareket, ufuk engelleri, hava durumu ve hassas ephemeris düzeltmeleri uygulanmaz. Konum kullanıcı tarafından elle girilir veya **izin verilirse** tarayıcıdan alınır. Veri, konum belirleme servisine uygulama tarafından gönderilmez.

- US Naval Observatory: https://aa.usno.navy.mil/faq/alt_az
- US Naval Observatory: https://aa.usno.navy.mil/faq/GAST
- US Naval Observatory: https://aa.usno.navy.mil/faq/sun_approx

**Zaman ve fizik:** `time-science.js`, yıl sıfırı içermeyen MÖ/MS tarihsel takvimini hesaplamada astronomik yıl numaralandırmasına dönüştürür, boşlukta ışık yolculuk süresini hesaplar ve Lorentz faktörü `γ = 1 / sqrt(1 - (v/c)^2)` aracılığıyla ideal, sabit hızlı gözlemcinin saatini örnekler. Işık konisi çizimi bir uzay ve bir zaman boyutlu ideal diyagramdır. Tarihî olayların takvim ekseni oransaldır, sinematik aralıkların gösterim süresi oransal değildir. Gelecek tasvirleri kurgu olarak etiketlenir.

- NASA astronomik yıl: https://eclipse.gsfc.nasa.gov/help/dates.html
- NASA ışık yılı: https://science.nasa.gov/exoplanets/what-is-a-light-year/
- NASA görelilik eğitimi: https://spaceplace.nasa.gov/time-travel/en/
- UCLA uzay-zaman diyagramı: https://www.astro.ucla.edu/~wright/st_diags.htm

**Optik ve kamera:** `MediaStreamTrack.getSettings()` ve `getCapabilities()` ile desteklendiğinde gerçek kamera akış çözünürlüğü, kare hızı ve tarayıcının bildirdiği büyütme kabiliyeti görüntülenir. 1–8× görüntü büyütme CSS tabanlı **dijital kırpma**dır; optik zoom ya da termal/IR kameraymış gibi gösterilmez. Yüksek büyütmede sensörden yeni fiziksel bilgi üretilmez.

- MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getCapabilities

### Hesap doğrulama

`tests/science.test.mjs` içerisinde 9 otomatik test bulunur. Node.js 20+ kurulu sistemde:

```bash
npm test
```

Testler Julian tarih, GMST, MÖ/MS geçişi, ışık süresi, Lorentz faktörü, zenit, Polaris ve Güneş'in ekinoks çevresindeki konumunu kapsar. Testler bilimsel hesaplamaların temel tutarlılığını kontrol eder; profesyonel gözlemevi doğruluğu veya iPhone donanımının AR/kamera uyumluluğu sertifikası değildir.

---
## Teknoloji

- Statik HTML, CSS ve JavaScript
- Three.js + OrbitControls: Sihirli Küre ve 3D sahne etkileşimleri
- Google model-viewer: mobil 3D ve destekli AR başlatma
- Leaflet + OpenStreetMap: 2D coğrafya haritası
- Tarayıcı MediaDevices + Canvas 2D: kamera, görsel katmanlar, fotoğraf
- glTF: özgün, prosedürel düşük poligonlu sahneler

## Lisans

Proje kodu MIT lisanslıdır. Harici kütüphaneler, harita verileri ve görseller kendi lisanslarına tabidir.

---
*Bu uygulama eğitim, görselleştirme ve yaratıcı keşif prototipidir. Bilimsel ölçüm cihazı, X-Ray, gözetleme uygulaması veya geleceği bilen bir sistem değildir.*
