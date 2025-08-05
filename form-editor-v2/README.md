# Form Editor V2

Form editörünün geliştirilmiş versiyonu. Kullanıcıların form düzenlemelerini özelleştirebileceği bir sistem.

## Özellikler

1. **Form Sıralama (Drag & Drop)**
   - Formları sürükle-bırak ile istediğiniz sıraya getirebilirsiniz
   - Sıralama otomatik olarak güncellenir

2. **Form Gizleme/Gösterme**
   - Her formun sağ üst köşesindeki göz ikonuna tıklayarak formu gizleyebilirsiniz
   - Gizlenen formlar en üste taşınır ve soluk görünür

3. **3 Farklı Genişlik Modu**
   - Kompakt: 800px maksimum genişlik
   - Normal: 1000px maksimum genişlik
   - Geniş: %100 genişlik

4. **Alan Genişliği Ayarlama**
   - Her alan için %25, %50, %75, %100 genişlik seçenekleri
   - Alanlar otomatik olarak yan yana dizilir
   - Maksimum 4 alan yan yana gelebilir

5. **Kullanıcıya Özel Kaydetme**
   - Tüm ayarlar kullanıcıya özeldir
   - "Kaydet" butonuna basıldığında SQL'e kaydedilir

6. **Varsayılana Dön**
   - "Varsayılana Dön" butonu ile tüm ayarlar sıfırlanabilir

7. **Gelişmiş Alan Gizleme/Gösterme**
   - Form içindeki alanlar tek tek gizlenebilir/gösterilebilir
   - Üst menüde "Gizlenen Alanlar" dropdown'u ile kolay yönetim
   - Gizlenen alan sayısı otomatik gösterilir
   - Tek tıkla gizlenen alanları geri getirme
   - Mouse ile üzerine gelince görünen gizleme butonları

## Kurulum

1. SQL scriptini çalıştırın:
```sql
-- FormEditorV2_CreateTables.sql dosyasındaki scriptleri çalıştırın
```

2. Dosyaları projeye kopyalayın

3. Serenity projesinde navigation menüsüne ekleyin

## Kullanım

1. Form Editör V2 sayfasına gidin
2. Formları sürükleyerek sıralayın
3. Alan genişliklerini ayarlayın
4. Gizlemek istediğiniz form veya alanları gizleyin
5. "Kaydet" butonuna basarak ayarlarınızı kaydedin

## Teknik Detaylar

- TypeScript ve C# ile geliştirilmiştir
- Serenity Framework kullanır
- Kullanıcı ayarları JSON formatında saklanır
- Responsive tasarıma sahiptir