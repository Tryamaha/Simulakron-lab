# ◈ Simülakron Atlas — Zaman Kaşifi 3000

**Tarih ansiklopedisi · Dünya atlası · 3D Sihirli Küre · Zaman tüneli · Dönem canlandırmaları (AR) · Gelecek dürbünü**

GitHub Pages: **https://tryamaha.github.io/Simulakron-lab/**

## Bölümler

| Bölüm | Bağlantı | Amaç |
|---|---|---|
| Ana atlas | [Ana Sayfa](./index.html) | 88 tarih maddesi, 108 coğrafya kaydı, filtreler, interaktif harita, bilgi testi |
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
