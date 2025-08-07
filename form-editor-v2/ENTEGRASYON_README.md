# Form Editor V2 - Entegrasyon Kılavuzu

## 🎯 Genel Bakış

Form Editor V2, Serenity.is framework'ü üzerine geliştirilmiş, kullanıcıların form düzenini özelleştirmesine olanak tanıyan bir modüldür. Bu kılavuz, modülü başka bir Serenity.is projesine nasıl entegre edeceğinizi adım adım açıklar.

## 📋 Özellikler

- ✅ Satır sıralaması (ok butonları ile)
- ✅ Alan gizleme/gösterme
- ✅ Alan genişliği ayarlama (25%, 50%, 75%, 100%)
- ✅ Kullanıcı bazlı ayar kaydetme (SQL)
- ✅ Otomatik kullanıcı tanıma
- ✅ Gizlenen alanlar listesi

## 🗂️ Dosya Yapısı ve İşlevleri

### 1. Backend Dosyaları

#### 📄 FormEditorV2Endpoint.cs
**Konum:** `Modules/UserControlForm/FormEditorV2/`
**İşlev:** API endpoint'leri ve iş mantığı

```csharp
// Kritik bölümler:
- SaveUserSettings: Kullanıcı ayarlarını kaydetme
- GetUserSettings: Kullanıcı ayarlarını yükleme
- GetCurrentUserId: Otomatik kullanıcı ID tespiti
```

**Bağımlılıklar:**
- `Serenity.Services`
- `Serenity.Data`
- `System.Security.Claims`
- `UserFormSettingsRow` entity

#### 📄 UserFormSettingsRow.cs
**Konum:** `Modules/UserControlForm/UserControlForm/`
**İşlev:** Veritabanı entity tanımı

```csharp
// Tablo yapısı:
- Id (Primary Key)
- UserId (Kullanıcı ID)
- Settings (JSON string)
- InsertDate, InsertUserId
- UpdateDate, UpdateUserId
```

#### 📄 FormEditorV2Service.cs (Otomatik oluşturulur)
**Konum:** `Modules/UserControlForm/FormEditorV2/`
**İşlev:** Servis tanımlamaları

### 2. Frontend Dosyaları

#### 📄 FormEditorV2.tsx
**Konum:** `Modules/UserControlForm/FormEditorV2/`
**İşlev:** Ana React/TypeScript komponenti

**Kritik metodlar:**
```typescript
- initializeFormEditor(): Başlangıç ayarları
- saveSettings(): Ayarları kaydetme
- loadUserSettings(): Ayarları yükleme
- collectFormStructure(): Form yapısını toplama
- applyFormStructure(): Form yapısını uygulama
- moveSelectedRow(): Satır taşıma
- updateHiddenFieldsList(): Gizli alan listesi güncelleme
```

#### 📄 FormEditorV2.css
**Konum:** `Modules/UserControlForm/FormEditorV2/`
**İşlev:** Stil tanımlamaları

**Önemli sınıflar:**
- `.form-row`: Form satırları
- `.form-field`: Form alanları
- `.width-25/50/75/100`: Genişlik ayarları
- `.hidden-field`: Gizli alanlar
- `.hidden-fields-container`: Gizli alan dropdown'ı

#### 📄 FormEditorV2Interfaces.ts
**Konum:** `Modules/UserControlForm/FormEditorV2/`
**İşlev:** TypeScript interface tanımlamaları

```typescript
export interface FormLayoutSettings {
    widthMode: string;
    formOrder: string[];
    formStructure?: any[];
}

export interface FormFieldSettings {
    width?: number;
    hidden?: boolean;
    fieldHidden?: boolean;
    required?: boolean;
}
```

### 3. Veritabanı

#### 📊 UserFormSettings Tablosu
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

## 🚀 Entegrasyon Adımları

### Adım 1: Veritabanı Hazırlığı

1. **Tablo Oluşturma:**
```sql
-- Hedef veritabanında çalıştırın
CREATE TABLE UserFormSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Settings NVARCHAR(MAX),
    InsertDate DATETIME NOT NULL,
    InsertUserId INT NOT NULL,
    UpdateDate DATETIME NULL,
    UpdateUserId INT NULL
)

-- Index ekleyin (performans için)
CREATE INDEX IX_UserFormSettings_UserId ON UserFormSettings(UserId)
```

2. **Connection String Kontrolü:**
- `appsettings.json` dosyasında doğru veritabanı bağlantısını kontrol edin

### Adım 2: Backend Entegrasyonu

1. **Entity Oluşturma:**
   - UserFormSettingsRow.cs dosyasını kopyalayın
   - Namespace'i projenize göre güncelleyin
   - T4 template'leri çalıştırın (Row, Form, Service oluşturulacak)

2. **Endpoint Ekleme:**
   - FormEditorV2Endpoint.cs dosyasını kopyalayın
   - Import satırını güncelleyin:
   ```csharp
   using MyRow = YourProject.YourModule.UserFormSettingsRow;
   ```

3. **Servis Kayıt:**
   - Startup.cs veya Module.cs dosyasında servisi kaydedin

### Adım 3: Frontend Entegrasyonu

1. **TypeScript Dosyaları:**
   - FormEditorV2.tsx
   - FormEditorV2Interfaces.ts
   - FormEditorV2Form.ts (T4'ten oluşacak)
   - FormEditorV2Service.ts (T4'ten oluşacak)

2. **CSS Dosyası:**
   - FormEditorV2.css dosyasını kopyalayın
   - Site.css'e import ekleyin veya bundle'a dahil edin

3. **Grid Kaydı:**
   ```typescript
   // NavigationItems.ts veya benzeri dosyada
   NavigationHelper.addMenu({
       title: 'Form Editor V2',
       path: 'UserControlForm/FormEditorV2'
   });
   ```

### Adım 4: Kullanıcı Kimlik Doğrulama

1. **GetCurrentUserId Metodu:**
```csharp
private int GetCurrentUserId()
{
    var userId = User.GetIdentifier();
    if (string.IsNullOrEmpty(userId))
    {
        // Test ortamı için varsayılan değer
        return 1;
    }
    return Convert.ToInt32(userId);
}
```

2. **Güvenlik Kontrolü:**
   - Endpoint'e [Authorize] attribute ekleyin
   - Kullanıcı bazlı veri filtreleme yapın

### Adım 5: Test ve Doğrulama

1. **Fonksiyon Testleri:**
   - [ ] Form listesi yükleniyor mu?
   - [ ] Ok butonları ile satır taşıma çalışıyor mu?
   - [ ] Alan gizleme çalışıyor mu?
   - [ ] Gizlenen alan sayacı güncelleniyor mu?
   - [ ] Genişlik ayarları çalışıyor mu?
   - [ ] Kaydet butonu çalışıyor mu?

2. **Veritabanı Kontrolü:**
```sql
-- Kayıtları kontrol et
SELECT * FROM UserFormSettings WHERE UserId = [USER_ID]

-- JSON içeriğini kontrol et
SELECT Id, UserId, 
       JSON_VALUE(Settings, '$.layoutSettings.widthMode') as WidthMode,
       LEN(Settings) as SettingsLength
FROM UserFormSettings
```

## 🔧 Özelleştirme

### Genişlik Modları
```typescript
// FormEditorV2.tsx içinde
<select className="width-mode-selector">
    <option value="compact">Kompakt</option>
    <option value="normal">Normal</option>
    <option value="wide">Geniş</option>
</select>
```

### Alan Genişlikleri
```css
/* FormEditorV2.css içinde */
.form-field.width-25 { flex: 0 0 calc(25% - 7.5px); }
.form-field.width-50 { flex: 0 0 calc(50% - 5px); }
.form-field.width-75 { flex: 0 0 calc(75% - 2.5px); }
.form-field.width-100 { flex: 0 0 100%; }
```

## 🐛 Sorun Giderme

### Sık Karşılaşılan Hatalar

1. **"Invalid column name" Hatası:**
   - UserFormSettings tablosunun doğru kolonlara sahip olduğundan emin olun
   - InsertDate/UpdateDate kullanın (CreatedDate/ModifiedDate DEĞİL)

2. **Ayarlar Kaydedilmiyor:**
   - Browser konsolu açın (F12)
   - Network sekmesinde SaveUserSettings çağrısını kontrol edin
   - Response'da hata var mı bakın

3. **Kullanıcı ID Bulunamıyor:**
   - User.GetIdentifier() çalıştığından emin olun
   - Login olduğunuzdan emin olun
   - Test için sabit ID kullanabilirsiniz

### Debug İpuçları

1. **Browser Konsolu:**
```javascript
// Kaydedilecek ayarları görmek için
console.log("Kaydedilecek ayarlar:", settings);
```

2. **C# Debug:**
```csharp
System.Diagnostics.Debug.WriteLine($"UserId: {userId}");
System.Diagnostics.Debug.WriteLine($"Settings: {request.Settings}");
```

## 📚 Ek Kaynaklar

### SQL Kontrol Scriptleri
```sql
-- Tablo yapısını kontrol et
EXEC sp_columns 'UserFormSettings'

-- Son kayıtları görüntüle
SELECT TOP 10 * FROM UserFormSettings ORDER BY Id DESC

-- Belirli kullanıcının ayarları
SELECT * FROM UserFormSettings WHERE UserId = @UserId
```

### TypeScript Type Tanımları
```typescript
interface SaveSettingsRequest {
    Settings: string;
}

interface GetSettingsResponse {
    Settings: string;
}
```

## 🎉 Sonuç

Bu adımları takip ederek Form Editor V2'yi başarıyla entegre edebilirsiniz. Önemli noktalar:

1. ✅ Veritabanı tablosunu oluşturun
2. ✅ Backend dosyalarını kopyalayın ve namespace'leri güncelleyin
3. ✅ Frontend dosyalarını entegre edin
4. ✅ CSS dosyasını projeye dahil edin
5. ✅ Kullanıcı kimlik doğrulamasını kontrol edin
6. ✅ Test edin ve doğrulayın

Sorularınız için proje dokümantasyonuna bakabilir veya PROJE_TASIMA_NOTLARI.md dosyasını inceleyebilirsiniz.