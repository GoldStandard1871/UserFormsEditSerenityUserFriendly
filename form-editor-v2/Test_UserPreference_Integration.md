# UserPreference Entegrasyonu Test Adımları

## 1. Veritabanı Hazırlığı

### UserPreference Tablosunu Oluşturma
```sql
-- UserPreference_Create.sql dosyasını çalıştırın
```

## 2. Form Editor V2'de Test Adımları

### Test 1: Layout Ayarları
1. Form Editor V2 sayfasını açın
2. "Genişlik Modu" ayarını değiştirin (Normal → Geniş → Kompakt)
3. "Genişlik Ayarlarını Gizle" butonuna tıklayın
4. Sayfayı yenileyin ve ayarların korunduğunu doğrulayın

### Test 2: Field Gizleme/Gösterme
1. Herhangi bir alanın göz ikonuna tıklayarak gizleyin
2. Birkaç alan daha gizleyin
3. "Gizlenen Alanlar" dropdown'ından alanları tekrar gösterin
4. Sayfayı yenileyin ve gizlenen alanların durumunu kontrol edin

### Test 3: Field Genişlik Ayarları
1. Bir alanın genişliğini değiştirin (%25, %50, %75, %100)
2. Birkaç alanın genişliğini farklı değerlere ayarlayın
3. Sayfayı yenileyin ve genişliklerin korunduğunu doğrulayın

### Test 4: Zorunlu Alan Ayarları
1. Bir alanı zorunlu yapın (checkbox işaretleyin)
2. Birkaç alanı daha zorunlu yapın
3. Sayfayı yenileyin ve zorunlu alanların korunduğunu doğrulayın

## 3. Veritabanı Kontrolü

### UserPreference Kayıtlarını Kontrol Etme
```sql
-- CheckUserPreference.sql dosyasını çalıştırın
-- Bu script şunları gösterecek:
-- 1. Toplam kayıt sayısı
-- 2. Son eklenen kayıtlar
-- 3. FormEditorV2 türündeki tüm kayıtlar
-- 4. Kullanıcı bazında özet bilgi
-- 5. Ayar türlerine göre gruplandırılmış kayıtlar
```

### Beklenen Kayıtlar
Her ayar değişikliğinde şu kayıtlar oluşmalı:
- **WidthMode**: "normal", "wide", veya "compact"
- **ShowWidthControls**: "true" veya "false"
- **FormOrder**: Form sıralaması (JSON array)
- **Field_{fieldId}_Hidden**: "true" veya "false"
- **Field_{fieldId}_Width**: "25", "50", "75", veya "100"
- **Field_{fieldId}_Required**: "true" veya "false"

## 4. Doğrulama Kontrolleri

### SQL ile Doğrulama
```sql
-- Belirli bir kullanıcının tüm ayarlarını görüntüleme
DECLARE @UserId INT = 1; -- Kendi kullanıcı ID'nizi girin

SELECT 
    Name,
    Value,
    CreatedDate,
    ModifiedDate
FROM UserPreference
WHERE UserId = @UserId 
    AND PreferenceType = 'FormEditorV2'
ORDER BY Name;
```

### Beklenen Davranışlar
1. ✅ Her ayar değişikliği UserPreference tablosuna kaydedilmeli
2. ✅ Mevcut kayıtlar güncellenirken ModifiedDate değişmeli
3. ✅ Yeni ayarlar CreatedDate ile eklenmeli
4. ✅ PreferenceType her zaman 'FormEditorV2' olmalı
5. ✅ IsActive değeri varsayılan olarak 1 olmalı

## 5. Sorun Giderme

### Kayıt Oluşmuyorsa
1. FormEditorV2Endpoint.cs dosyasında SaveToUserPreference metodunun çağrıldığını kontrol edin
2. Console'da hata mesajı olup olmadığını kontrol edin
3. UserPreference tablosunun var olduğunu doğrulayın
4. SQL Server bağlantı iznini kontrol edin

### Test Sonuçları
- [ ] UserPreference tablosu oluşturuldu
- [ ] Layout ayarları kaydediliyor
- [ ] Field gizleme ayarları kaydediliyor
- [ ] Field genişlik ayarları kaydediliyor
- [ ] Field zorunluluk ayarları kaydediliyor
- [ ] Mevcut kayıtlar güncelleniyor
- [ ] Yeni kayıtlar ekleniyor