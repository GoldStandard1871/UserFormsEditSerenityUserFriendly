# Form Editor V2 - Kullanıcıya Özel Ayarlar Rehberi

## 🎯 Nasıl Çalışır?

Form Editor V2, her kullanıcının form düzenlemelerini **kullanıcıya özel** olarak kaydeder. İki farklı kullanıcı aynı formu farklı şekilde görebilir.

## 📊 SQL'de Nerede Saklanıyor?

**Veritabanı:** `UserControlForm_Default_v1`  
**Tablo:** `dbo.UserPreferences`  
**Ayar Tipi:** `PreferenceType = 'FormEditorV2'`

## 🔍 Kaydedilen Bilgiler

### 1. **Layout Ayarları**
- `WidthMode`: Genişlik modu (compact/normal/wide)
- `ShowWidthControls`: Genişlik kontrollerinin görünürlüğü
- `FormOrder`: Form sıralaması
- `FormStructure`: Detaylı form yapısı (JSON)

### 2. **Field (Alan) Ayarları**
- `Field_{fieldId}_Width`: Alan genişliği (%25, %50, %75, %100)
- `Field_{fieldId}_Hidden`: Alan gizleme durumu
- `Field_{fieldId}_Required`: Zorunlu alan durumu
- `Field_{fieldId}_FieldHidden`: Alan içi gizleme

### 3. **Tam JSON Ayarları**
- `AllSettings`: Tüm ayarların JSON formatında kopyası

## 🚀 Test Senaryosu

### Adım 1: İlk Kullanıcı (User ID: 1)
1. Form Editor V2 sayfasına girin
2. Şu değişiklikleri yapın:
   - Genişlik modunu "Geniş" yapın
   - Müşteri Adı alanını %50 genişlik yapın
   - Telefon alanını gizleyin
   - Formları sürükleyerek sırayı değiştirin
3. "Kaydet" butonuna basın

### Adım 2: İkinci Kullanıcı (User ID: 2)
1. Farklı bir kullanıcı ile giriş yapın
2. Form Editor V2 sayfasına girin
3. Şu değişiklikleri yapın:
   - Genişlik modunu "Dar" yapın
   - Müşteri formunu tamamen gizleyin
   - Farklı bir form sıralaması yapın
4. "Kaydet" butonuna basın

### Adım 3: SQL'de Kontrol
```sql
-- Her iki kullanıcının ayarlarını görün
SELECT 
    UserId,
    Name,
    Value,
    CreatedDate
FROM dbo.UserPreferences
WHERE PreferenceType = 'FormEditorV2'
ORDER BY UserId, Name;
```

## 📋 SQL Sorgu Örnekleri

### Kullanıcı 1'in Ayarları:
```sql
SELECT * FROM dbo.UserPreferences 
WHERE UserId = 1 
  AND PreferenceType = 'FormEditorV2'
  AND IsActive = 1;
```

### Kullanıcı 2'nin Ayarları:
```sql
SELECT * FROM dbo.UserPreferences 
WHERE UserId = 2 
  AND PreferenceType = 'FormEditorV2'
  AND IsActive = 1;
```

### JSON Ayarlarını Görme:
```sql
SELECT 
    UserId,
    Value as [JSON Ayarları]
FROM dbo.UserPreferences
WHERE PreferenceType = 'FormEditorV2'
  AND Name = 'AllSettings'
  AND IsActive = 1;
```

## 🎨 Örnek Veri Yapısı

```json
{
  "layoutSettings": {
    "widthMode": "wide",
    "showWidthControls": true,
    "formOrder": ["form-0", "form-2", "form-1"],
    "formStructure": [
      {
        "formId": "form-0",
        "formName": "Müşteri Bilgileri",
        "order": 0,
        "hidden": false,
        "fields": [
          {
            "fieldId": "field_0_1",
            "fieldName": "Müşteri Adı",
            "width": 50,
            "hidden": false
          }
        ]
      }
    ]
  },
  "fieldSettings": [
    {
      "fieldId": "field_0_1",
      "width": 50,
      "hidden": false,
      "required": true
    }
  ]
}
```

## 🔐 Güvenlik

- Her kullanıcı sadece kendi ayarlarını görebilir
- `GetCurrentUserId()` metodu ile otomatik kullanıcı tespiti
- SQL injection koruması

## 💡 İpuçları

1. **Canlı İzleme:** `CANLI_IZLEME_AYARLAR.sql` scriptini açık bırakıp F5 ile yenileyin
2. **Test Verileri:** `TEST_KULLANICI_AYARLARI.sql` ile farklı kullanıcılar için test verileri ekleyin
3. **Detaylı Görünüm:** `GOSTER_KULLANICI_AYARLARI.sql` ile tüm ayarları detaylı görün

## 🎯 Sonuç

Artık her kullanıcı:
- Kendi form düzenini kaydedebilir
- Kendi alan genişliklerini ayarlayabilir
- Hangi alanları göreceğini belirleyebilir
- Form sıralamasını özelleştirebilir

Ve tüm bu ayarlar `UserControlForm_Default_v1.dbo.UserPreferences` tablosunda kullanıcıya özel olarak saklanır!