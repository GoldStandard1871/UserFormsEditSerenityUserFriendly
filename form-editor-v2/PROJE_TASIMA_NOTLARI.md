# Form Editor V2 - Proje Taşıma Notları

## 🚨 Kritik Bilgiler

### 1. Veritabanı Yapısı
- **Veritabanı:** `UserControlForm_Default_v1`
- **Ana Tablo:** `dbo.UserFormSettings` (UserPreferences DEĞİL!)
- **Kolon İsimleri:** InsertDate, UpdateDate (CreatedDate, ModifiedDate DEĞİL!)

### 2. Kullanılan Tablolar ve Amaçları

#### UserFormSettings (✅ Kullanılıyor)
```sql
CREATE TABLE UserFormSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Settings NVARCHAR(MAX),
    InsertDate DATETIME NOT NULL,
    InsertUserId INT NOT NULL,
    UpdateDate DATETIME NULL,
    UpdateUserId INT NULL
)
```
- Tüm form ayarları JSON olarak `Settings` kolonunda saklanır
- Her kullanıcı için tek kayıt (güncellenir)

#### UserPreferences (❌ Kullanılmıyor)
- Kolon isimleri uyumsuz
- Bu projede kullanılmıyor

#### FormEditorV2 (❌ Kullanılmıyor)
- Sadece form listesi için
- Kullanıcı ayarları için değil

### 3. Endpoint Değişiklikleri

#### FormEditorV2Endpoint.cs
```csharp
// Doğru import:
using MyRow = UserControlForm.UserControlForm.UserFormSettingsRow;

// Kullanıcı ID alma:
private int GetCurrentUserId() {
    var userId = User.GetIdentifier();
    if (string.IsNullOrEmpty(userId)) {
        return 1; // Test için
    }
    return Convert.ToInt32(userId);
}
```

### 4. Frontend Değişiklikleri

#### FormEditorV2.tsx
- `collectFormStructure()` metodu eklendi - Form yapısını toplar
- `applyFormStructure()` metodu eklendi - Form yapısını uygular
- Console.log'lar debug için eklendi

### 5. SQL Scriptleri

#### Test ve Kontrol:
- `USERFORMSETTINGS_KONTROL.sql` - Ana kontrol scripti
- `GERCEK_TABLO_YAPISI.sql` - Tablo yapısını gösterir
- `TUM_TABLOLARI_KONTROL.sql` - Tüm tabloları listeler

### 6. Proje Taşıma Adımları

1. **Veritabanı Kontrolü:**
   ```sql
   -- Önce tabloları kontrol et
   SELECT * FROM sys.tables WHERE name IN ('UserFormSettings', 'UserPreferences', 'FormEditorV2')
   ```

2. **Tablo Yoksa Oluştur:**
   ```sql
   CREATE TABLE UserFormSettings (
       Id INT IDENTITY(1,1) PRIMARY KEY,
       UserId INT NOT NULL,
       Settings NVARCHAR(MAX),
       InsertDate DATETIME NOT NULL,
       InsertUserId INT NOT NULL,
       UpdateDate DATETIME NULL,
       UpdateUserId INT NULL
   )
   ```

3. **Connection String Kontrolü:**
   - appsettings.json'da `UserControlForm_Default_v1` bağlantısı olmalı

4. **Debug Logları:**
   - Browser Console (F12)
   - Visual Studio Output Window
   - SQL Server Profiler (opsiyonel)

### 7. Sık Karşılaşılan Hatalar

#### Hata 1: "Invalid column name"
- **Sebep:** Yanlış tablo veya kolon isimleri
- **Çözüm:** UserFormSettings tablosu ve doğru kolon isimlerini kullan

#### Hata 2: "Kullanıcı bilgisi bulunamadı"
- **Sebep:** User.GetIdentifier() null dönüyor
- **Çözüm:** Login kontrolü yap veya test için sabit ID kullan

#### Hata 3: Veriler kaydedilmiyor
- **Sebep:** Connection string yanlış veya tablo yok
- **Çözüm:** USERFORMSETTINGS_KONTROL.sql çalıştır

### 8. Test Senaryosu

1. Form Editor V2 sayfasına git
2. Browser konsolu aç (F12)
3. Bir alan genişliğini değiştir
4. "Kaydet" butonuna bas
5. Konsoldaki "Kaydedilecek ayarlar:" logunu kontrol et
6. SQL'de kontrol: `SELECT * FROM UserFormSettings WHERE UserId = 1`

### 9. Önemli Dosyalar

- **Backend:** FormEditorV2Endpoint.cs
- **Frontend:** FormEditorV2.tsx
- **Entity:** UserFormSettingsRow.cs
- **Service:** FormEditorV2Service.ts
- **SQL:** USERFORMSETTINGS_KONTROL.sql

### 10. Notlar

- UserPreferences tablosu entegrasyonu iptal edildi
- Tüm ayarlar tek JSON string olarak saklanıyor
- Her kullanıcı için ayrı kayıt tutuluyor
- Form yapısı da JSON içinde saklanıyor