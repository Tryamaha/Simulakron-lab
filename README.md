# Simülakron Lab 🦣

Telefon kamerasında mamut ve tarih öncesi insanı gösteren etkileşimli bir AR deneyimi.

**İki mod**
- **Canlı kamera:** Kamera görüntüsünün üzerine 3B sahne bindirilir. Dokunarak etkileşim, taşıma, ölçekleme ve fotoğraf çekme.
- **Gerçek AR:** Destekleyen iPhone cihazlarında Safari üzerinden Apple AR Quick Look, Android'de desteklenen AR görüntüleyicisi.

Bu bir **prototip**: kamera modu fiziksel yüzey takibi yapmaz. Gerçek AR modu sistemin yüzey algılamasına dayanır.

## Yayına alma
GitHub → Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.

Yayın adresi: https://tryamaha.github.io/Simulakron-lab/

## Teknoloji
Statik HTML/CSS/JS; [Three.js](https://threejs.org/) ve [model-viewer](https://modelviewer.dev/); özelleştirilmiş orijinal düşük poligonlu mamut ve ilk insan 3D varlığı. Kamera akışı cihaz üzerinde işlenir, sunucuya gönderilmez. CDN bağımlılıkları için internet gerekir.

## Lisans
MIT. Harici bağımlılıkların kendi lisansları geçerlidir.
