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
| 3000 Dürbünü | [telescope.html](./telescope.html) | Canlı kamera, 1–8× dijital görüntü büyütme, gece filtresi, sanal gökyüzü, yıl merceği |
| Sihirli Pencere | [magic-window.html](./magic-window.html) | Kamera + kullanıcının seçtiği fotoğraf ile dairesel duvar arkası illüzyonu |
| Mamut Deneyimi | [lab.html](./lab.html) | Tarih öncesi insan ve mamut içeren etkileşimli kamera/AR gösterimi |

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
