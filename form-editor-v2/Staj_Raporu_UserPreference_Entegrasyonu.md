# Form Editor V2 - UserPreference Tablosu Entegrasyonu

## Proje Özeti
Form Editor V2 projesinde kullanıcıların yaptığı tüm ayar değişikliklerinin veritabanında detaylı olarak saklanması için UserPreference tablosu entegrasyonu gerçekleştirildi.

## Geliştirme Detayları

### 1. UserPreference Tablo Yapısı
```sql
CREATE TABLE UserPreference (
    UserPreferenceId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PreferenceType NVARCHAR(100) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Value NVARCHAR(MAX),
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedDate DATETIME NULL,
    IsActive BIT NOT NULL DEFAULT 1
);
```

### 2. Backend Entegrasyonu (FormEditorV2Endpoint.cs)

#### SaveToUserPreference Metodu
```csharp
private void SaveToUserPreference(IUnitOfWork uow, int userId, string settingsJson)
{
    var settings = JObject.Parse(settingsJson);
    var preferenceType = "FormEditorV2";
    
    // Layout ayarlarını kaydet
    if (settings["layoutSettings"] != null)
    {
        var layoutSettings = settings["layoutSettings"];
        
        SaveOrUpdatePreference(uow, userId, preferenceType, "WidthMode", 
            layoutSettings["widthMode"]?.ToString() ?? "normal");
        
        SaveOrUpdatePreference(uow, userId, preferenceType, "ShowWidthControls", 
            layoutSettings["showWidthControls"]?.ToString() ?? "true");
    }
    
    // Field ayarlarını kaydet
    if (settings["fieldSettings"] != null)
    {
        var fieldSettings = settings["fieldSettings"] as JArray;
        foreach (var field in fieldSettings)
        {
            var fieldId = field["fieldId"]?.ToString();
            if (!string.IsNullOrEmpty(fieldId))
            {
                // Hidden, Width, Required ayarlarını kaydet
                SaveOrUpdatePreference(uow, userId, preferenceType, 
                    $"Field_{fieldId}_Hidden", field["hidden"].ToString());
                // ... diğer ayarlar
            }
        }
    }
}
```

#### SaveOrUpdatePreference Metodu
```csharp
private void SaveOrUpdatePreference(IUnitOfWork uow, int userId, string preferenceType, string name, string value)
{
    var sql = @"
        IF EXISTS (SELECT 1 FROM UserPreference WHERE UserId = @userId AND PreferenceType = @type AND Name = @name)
            UPDATE UserPreference 
            SET Value = @value, ModifiedDate = GETDATE() 
            WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
        ELSE
            INSERT INTO UserPreference (UserId, PreferenceType, Name, Value, CreatedDate) 
            VALUES (@userId, @type, @name, @value, GETDATE())";
    
    uow.Connection.Execute(sql, new { userId, type = preferenceType, name, value });
}
```

### 3. Kaydedilen Ayar Türleri

#### Layout Ayarları
- **WidthMode**: Form genişlik modu (normal, wide, compact)
- **ShowWidthControls**: Genişlik kontrollerinin görünürlüğü
- **FormOrder**: Formların sıralama bilgisi

#### Field Ayarları
- **Field_{fieldId}_Hidden**: Alanın gizli/görünür durumu
- **Field_{fieldId}_Width**: Alan genişliği (%25, %50, %75, %100)
- **Field_{fieldId}_Required**: Alanın zorunlu olma durumu

### 4. Veritabanı İşlemleri

#### Kayıt Ekleme/Güncelleme
- Yeni ayarlar `CreatedDate` ile eklenir
- Mevcut ayarlar güncellenirken `ModifiedDate` değiştirilir
- Her kayıt kullanıcıya özel olarak saklanır

#### Performans İyileştirmeleri
- Index'ler eklendi (UserId, PreferenceType, Name)
- Tek SQL sorgusu ile INSERT/UPDATE işlemi
- JSON parse edilip sadece değişen ayarlar kaydediliyor

### 5. Test SQL Scriptleri

#### CheckUserPreference.sql
Kullanıcı ayarlarını kontrol etmek için detaylı sorgular:
- Toplam kayıt sayısı
- Son eklenen kayıtlar
- Kullanıcı bazında özet bilgiler
- Ayar türlerine göre gruplandırma

### 6. Güvenlik ve Hata Yönetimi
- Try-catch bloğu ile hata yakalama
- SQL injection koruması (parametreli sorgular)
- Kullanıcı bazlı kayıt izolasyonu

## Teknik Kazanımlar
1. **Granüler Veri Saklama**: Her ayar değişikliği ayrı kayıt olarak saklanıyor
2. **Audit Trail**: CreatedDate ve ModifiedDate ile değişiklik takibi
3. **Performans**: Index'ler ve optimize edilmiş sorgular
4. **Esneklik**: Yeni ayar türleri kolayca eklenebilir
5. **Veri Bütünlüğü**: INSERT/UPDATE tek transaction'da

## Sonuç
UserPreference tablosu entegrasyonu ile Form Editor V2'de yapılan tüm kullanıcı ayarları artık veritabanında detaylı olarak saklanmaktadır. Bu sayede:
- Kullanıcı deneyimi iyileştirildi
- Ayar değişiklikleri takip edilebilir hale geldi
- Raporlama ve analiz imkanı sağlandı
- Sistem yöneticileri kullanıcı tercihlerini görebilir

## Ek Dosyalar
1. `UserPreference_Create.sql` - Tablo oluşturma scripti
2. `CheckUserPreference.sql` - Kontrol ve raporlama scriptleri
3. `Test_UserPreference_Integration.md` - Detaylı test adımları