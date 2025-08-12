# 📦 Form Editor V2 ve User Activity Sistemi - Proje Aktarım Rehberi

Bu rehber, Form Editor V2 ve User Activity (Online/Offline) sistemlerini başka bir projeye taşımak için gerekli tüm adımları içerir.

## 🎯 İçindekiler
1. [Form Editor V2 Sistemi](#form-editor-v2-sistemi)
2. [User Activity (Online/Offline) Sistemi](#user-activity-sistemi)
3. [Ortak Gereksinimler](#ortak-gereksinimler)
4. [Kurulum Adımları](#kurulum-adımları)

---

## 📝 Form Editor V2 Sistemi

### 1. Backend Dosyaları (C#)

#### Modules/FormEditor/ klasörüne kopyalanacak dosyalar:
```
✅ FormEditorV2Endpoint.cs       - Ana API endpoint
✅ FormEditorV2Row.cs            - Entity tanımı
✅ FormEditorV2Form.cs           - Form tanımı
✅ FormEditorV2Columns.cs        - Grid kolon tanımları
✅ UserFormSettingsRow.cs        - Kullanıcı ayarları entity
✅ GlobalFormSettingsRow.cs      - Global ayarlar entity
✅ FormEditorPermissionKeys.cs   - Yetki tanımları
✅ FormEditorV2Page.cs          - Sayfa controller
```

### 2. Frontend Dosyaları (TypeScript/React)

#### Modules/FormEditor/ klasörüne kopyalanacak dosyalar:
```
✅ FormEditorV2Widget.tsx        - Ana widget componenti
✅ FormEditorV2.tsx              - Form editor componenti
✅ FormEditorV2Grid.tsx          - Grid componenti
✅ FormEditorV2Page.tsx          - Sayfa componenti
✅ FormEditorV2Interfaces.ts     - TypeScript interface'leri
```

### 3. CSS Dosyaları

#### wwwroot/Content/FormEditor/ klasörüne:
```
✅ FormEditorV2.css             - Ana stil dosyası
```

### 4. Veritabanı Tabloları

#### Çalıştırılacak SQL scriptleri:
```sql
-- 1. UserFormSettings tablosu
CREATE TABLE [dbo].[UserFormSettings] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [Settings] NVARCHAR(MAX) NOT NULL,
    [InsertDate] DATETIME NOT NULL,
    [InsertUserId] INT NOT NULL,
    [UpdateDate] DATETIME NULL,
    [UpdateUserId] INT NULL
)
CREATE INDEX IX_UserFormSettings_UserId ON UserFormSettings(UserId)

-- 2. GlobalFormSettings tablosu (opsiyonel)
CREATE TABLE [dbo].[GlobalFormSettings] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [FormId] NVARCHAR(100) NOT NULL,
    [RequiredFields] NVARCHAR(MAX),
    [UpdatedDate] DATETIME DEFAULT GETDATE(),
    [UpdatedBy] INT
)
```

### 5. ServerTypes Dosyaları (Otomatik Generate)

Modules/ServerTypes/FormEditor/ klasöründe otomatik oluşacaklar:
```
✅ FormEditorV2Service.ts
✅ FormEditorV2Row.ts
✅ FormEditorV2Form.ts
✅ FormEditorV2Columns.ts
✅ GetUserSettingsRequest.ts
✅ GetUserSettingsResponse.ts
✅ SaveUserSettingsRequest.ts
✅ UserFormSettingsRow.ts
✅ GlobalFormSettingsRow.ts
```

---

## 👥 User Activity (Online/Offline) Sistemi

### 1. Backend Dosyaları (C#)

#### Modules/Common/UserActivity/ klasörüne:
```
✅ UserActivityHub.cs           - SignalR Hub
✅ UserActivityTracker.cs       - Activity tracker servisi
✅ UserActivityEndpoint.cs      - API endpoint
```

### 2. Frontend Değişiklikleri

#### Dashboard'a eklenecek kod (DashboardIndex.cshtml):
```html
<!-- 1. SignalR kütüphanesi -->
<script src="https://cdn.jsdelivr.net/npm/@microsoft/signalr@8.0.0/dist/browser/signalr.min.js"></script>

<!-- 2. Online Users bölümü HTML -->
<div class="card online-users-card">
    <div class="card-header">
        <h3 class="card-title">Online Kullanıcılar</h3>
        <span class="online-count badge bg-success">0</span>
    </div>
    <div class="card-body">
        <div id="online-users-list" class="online-users-list">
            <!-- Kullanıcılar buraya dinamik eklenecek -->
        </div>
    </div>
</div>

<!-- 3. SignalR bağlantı scripti -->
<script>
    // Tüm authenticated kullanıcılar için
    @if (User.Identity.IsAuthenticated)
    {
        <text>initializeSignalR();</text>
    }
</script>
```

### 3. CSS Dosyaları

#### wwwroot/Content/site/ klasörüne:
```
✅ useractivity.css            - Online users stilleri
```

### 4. Startup.cs Değişiklikleri

```csharp
// ConfigureServices metoduna ekle:
services.AddSignalR(options =>
{
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
});
services.AddMemoryCache();

// Configure metoduna ekle:
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<UserActivityHub>("/userActivityHub"); // ← Bu satır kritik
});
```

---

## 📦 Ortak Gereksinimler

### NuGet Paketleri
```xml
<!-- Ana paketler -->
<PackageReference Include="Serenity.Assets" Version="8.8.1" />
<PackageReference Include="Serenity.Corelib" Version="8.8.1" />
<PackageReference Include="Serenity.Net.Web" Version="8.8.1" />

<!-- SignalR için -->
<PackageReference Include="Microsoft.AspNetCore.SignalR" Version="8.0.0" />
```

### NPM Paketleri
```json
{
  "dependencies": {
    "@microsoft/signalr": "^8.0.0",
    "@serenity-is/corelib": "latest",
    "jsx-dom": "8.1.5",
    "preact": "10.24.3"
  }
}
```

---

## 🚀 Kurulum Adımları

### 1. Veritabanı Kurulumu
```bash
# SQL scriptlerini çalıştır
1. CREATE_GlobalFormSettings_Table.sql
2. FIX_UserFormSettings_Table.sql
```

### 2. Backend Dosyalarını Kopyala
```bash
# Form Editor V2 dosyaları
- Modules/FormEditor/*.cs dosyalarını kopyala
- UserActivity dosyalarını kopyala
```

### 3. Frontend Dosyalarını Kopyala
```bash
# TypeScript/React dosyaları
- *.tsx, *.ts dosyalarını kopyala
- CSS dosyalarını kopyala
```

### 4. Startup.cs Güncelle
```csharp
// SignalR ve Memory Cache ekle
services.AddSignalR(...);
services.AddMemoryCache();
endpoints.MapHub<UserActivityHub>("/userActivityHub");
```

### 5. Build İşlemleri
```bash
# Backend build
dotnet build

# Frontend build
npm install
npm run build
```

### 6. Migration Oluştur (Opsiyonel)
```csharp
// Migrations klasörüne ekle
public class DefaultDB_20250108_FormEditorV2 : Migration
{
    public override void Up()
    {
        Create.Table("UserFormSettings")...
        Create.Table("GlobalFormSettings")...
    }
}
```

---

## ⚠️ Dikkat Edilmesi Gerekenler

### 1. Authentication Kontrolü
```csharp
// FormEditorV2Endpoint.cs'de UserId alımı
var userId = int.Parse(User.GetIdentifier());
```

### 2. SignalR CORS Ayarları
```csharp
// Eğer farklı domain'den erişim varsa
services.AddCors(options => {
    options.AddPolicy("SignalRPolicy", builder => {
        builder.WithOrigins("http://localhost:5000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});
```

### 3. Database Connection String
```json
// appsettings.json
"Data": {
  "Default": {
    "ConnectionString": "Server=.;Database=YourDB;..."
  }
}
```

### 4. Navigation Menu Ekleme
```csharp
// NavigationItems.cs'ye ekle
[assembly: NavigationMenu("FormEditor", "Form Editör")]
[assembly: NavigationLink("FormEditor/FormEditorV2", "Form Editor V2", 
    typeof(FormEditorV2Page), icon: "fa-edit")]
```

### 5. Permission Keys
```csharp
// PermissionKeys.cs'ye ekle
public const string FormEditor = "FormEditor:FormEditor";
```

---

## 🔍 Test Kontrol Listesi

- [ ] Form Editor V2 sayfası açılıyor mu?
- [ ] Drag & drop çalışıyor mu?
- [ ] Alan gizleme/gösterme çalışıyor mu?
- [ ] Kullanıcıya özel ayarlar kaydediliyor mu?
- [ ] SignalR bağlantısı kuruluyor mu?
- [ ] Online kullanıcılar listesi görünüyor mu?
- [ ] Test kullanıcısı online görünüyor mu?
- [ ] Logout sonrası offline oluyor mu?

---

## 📞 Sorun Giderme

### SignalR Bağlantı Hatası
```javascript
// Browser Console'da kontrol et
console.log("SignalR State:", connection.state);
```

### User Settings Kaydedilmiyor
```sql
-- Veritabanında kontrol et
SELECT * FROM UserFormSettings WHERE UserId = 1
```

### Online Kullanıcı Görünmüyor
```csharp
// Debug logları kontrol et (Visual Studio Output)
System.Diagnostics.Debug.WriteLine($"[UserActivityHub] UserId: {userId}");
```

---

## 📚 Ek Dokümantasyon

- `form-editor-v2/README.md` - Detaylı kullanım kılavuzu
- `form-editor-v2/STAJ_OZETI_FINAL.md` - Teknik detaylar
- `form-editor-v2/ENTEGRASYON_README.md` - Entegrasyon notları

---

**Son Güncelleme:** 2025
**Hazırlayan:** Claude AI Assistant