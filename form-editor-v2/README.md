# Form Editor V2 - Kullanıcı Kılavuzu

Form editörünün geliştirilmiş versiyonu. Kullanıcıların form düzenlemelerini özelleştirebileceği, her kullanıcıya özel ayarların saklandığı kapsamlı bir form yönetim sistemi.

## 🎯 Ana Özellikler

### 1. **Form Sıralama (Drag & Drop)**
- Formları mouse ile tutup sürükleyerek istediğiniz sıraya getirebilirsiniz
- Sol taraftaki drag handle (↕️) ikonunu kullanarak sürükleme yapılır
- Mavi animasyonlu placeholder formun nereye bırakılacağını gösterir

### 2. **Form Aç/Kapa (Collapse)**
- Form başlığına tıklayarak formu açıp kapatabilirsiniz
- Chevron ikonu (▼/▶) formun durumunu gösterir
- Kapatılan formların durumu da kaydedilir

### 3. **Alan Gizleme/Gösterme**
- Her alanın üzerindeki göz ikonuna (👁️) tıklayarak alanı gizleyebilirsiniz
- Üst menüdeki "Gizlenen Alanlar" dropdown'u ile:
  - Toplam gizlenen alan sayısını görebilirsiniz
  - Hangi alanların gizlendiğini listeleyebilirsiniz
  - Tek tıkla gizlenen alanları geri getirebilirsiniz

### 4. **Alan Genişliği Ayarlama**
- Her alan için 4 farklı genişlik seçeneği:
  - %25 - Çeyrek genişlik (4 alan yan yana)
  - %50 - Yarım genişlik (2 alan yan yana)
  - %75 - Üç çeyrek genişlik
  - %100 - Tam genişlik
- Alanlar otomatik olarak flex layout ile dizilir

### 5. **Genişlik ve Gizlilik Kontrolleri**
- "Genişlik ve Gizlilik Ayarları" butonu ile tüm kontrolleri açıp kapatabilirsiniz
- Kapalıyken sadece formları görürsünüz, düzenleme yapamazsınız
- Açık/Kapalı durumu badge ile gösterilir

### 6. **Kullanıcıya Özel Kaydetme**
- ✅ **Her kullanıcının ayarları ayrı saklanır**
- Admin'in yaptığı değişiklikler test kullanıcısını etkilemez
- Her kullanıcı kendi düzenine sahiptir

### 7. **Varsayılana Dön**
- Tüm ayarları tek tıkla sıfırlayabilirsiniz
- Onay istenir, yanlışlıkla sıfırlamayı önler

## 📁 Proje Yapısı

```
form-editor-v2/
├── FormEditorV2.tsx           # Ana TypeScript bileşeni
├── FormEditorV2.css           # Stil dosyası
├── FormEditorV2Endpoint.cs    # Backend API endpoint
├── FormEditorV2Widget.tsx     # Widget versiyonu
├── UserFormSettingsRow.cs     # Entity tanımı
└── SQL Scripts/
    ├── FIX_UserFormSettings_Table.sql    # Tablo düzeltme scripti
    ├── DEBUG_USER_SETTINGS.sql            # Debug ve kontrol scripti
    └── UserPreference_UpdatedSchema.sql  # Şema güncelleme
```

## 🗄️ Veritabanı Yapısı

### UserFormSettings Tablosu

```sql
CREATE TABLE [dbo].[UserFormSettings] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,              -- Kullanıcı ID'si (HER KULLANICI İÇİN AYRI)
    [Settings] NVARCHAR(MAX) NOT NULL,  -- JSON formatında ayarlar
    [InsertDate] DATETIME NOT NULL,
    [InsertUserId] INT NOT NULL,
    [UpdateDate] DATETIME NULL,
    [UpdateUserId] INT NULL
)

-- Performans için index
CREATE INDEX IX_UserFormSettings_UserId ON UserFormSettings(UserId)
```

### Örnek JSON Veri Yapısı

```json
{
  "layoutSettings": {
    "widthMode": "normal",
    "showWidthControls": true,
    "formOrder": []
  },
  "fieldSettings": [
    {
      "fieldId": "f1",
      "width": 50,
      "hidden": false,
      "collapsed": false
    },
    {
      "fieldId": "f2",
      "width": 50,
      "hidden": true,
      "collapsed": false
    }
  ]
}
```

## 🚀 Kurulum

### 1. SQL Script'lerini Çalıştırın

```sql
-- Önce tablo düzeltme scriptini çalıştırın
-- Bu script UserId kolonunu ekler ve index oluşturur
C:\Users\90545\Desktop\asdf\form-editor-v2\FIX_UserFormSettings_Table.sql
```

### 2. Backend Dosyalarını Kopyalayın

- `FormEditorV2Endpoint.cs` → `Modules/FormEditor/`
- `UserFormSettingsRow.cs` → `Modules/FormEditor/`

### 3. Frontend Dosyalarını Kopyalayın

- `FormEditorV2Widget.tsx` → `Modules/FormEditor/`
- `FormEditorV2.css` → `wwwroot/Content/FormEditor/`

### 4. Projeyi Derleyin

```bash
dotnet build
npm run build
```

## 🔧 Yapılan Önemli Değişiklikler

### Backend Değişiklikleri

1. **Kullanıcı ID Yönetimi**
   - ❌ ~~IUserAccessor kullanımı~~ → ✅ `User.GetIdentifier()` direkt kullanım
   - ❌ ~~Request'ten UserId alımı~~ → ✅ Güvenli server-side UserId tespiti
   - ✅ Debug log'ları eklendi

2. **Endpoint Güvenliği**
   ```csharp
   // Eski (güvensiz)
   var userId = request.UserId; 
   
   // Yeni (güvenli)
   var userId = int.Parse(User.GetIdentifier());
   ```

3. **Veritabanı İşlemleri**
   - Her kullanıcı için tek kayıt (Insert veya Update)
   - UserId bazlı filtreleme
   - Transaction yönetimi

### Frontend Değişiklikleri

1. **Gereksiz Kodların Temizlenmesi**
   - ❌ Zorunlu alan checkbox'ları kaldırıldı
   - ❌ Admin kontrolü kaldırıldı
   - ❌ Client-side UserId gönderimi kaldırıldı

2. **UI İyileştirmeleri**
   - ✅ Drag & drop animasyonları eklendi
   - ✅ Gizlenen alanlar dropdown'u eklendi
   - ✅ Toggle butonları için badge'ler eklendi

3. **Performans İyileştirmeleri**
   - Flex layout kullanımı
   - Gereksiz re-render'lar önlendi

## 🐛 Debug ve Sorun Giderme

### Visual Studio Output Penceresi

Debug loglarını görmek için:
1. Visual Studio → View → Output
2. "Show output from:" → Debug seçin

Görünen loglar:
```
=== GetCurrentUserId DEBUG ===
UserId: 1
Username: admin
IsAuthenticated: True
========================
```

### SQL Kontrol Scriptleri

```sql
-- Kullanıcı ayarlarını kontrol et
SELECT * FROM UserFormSettings WHERE UserId = 1  -- Admin
SELECT * FROM UserFormSettings WHERE UserId = 2  -- Test user

-- Debug scripti çalıştır
C:\Users\90545\Desktop\asdf\form-editor-v2\DEBUG_USER_SETTINGS.sql
```

### Browser Console (F12)

Client-side logları görmek için:
```javascript
console.log('🚀 FormEditorV2Widget initializing');
console.log('Saving settings:', settings);
console.log('Loaded settings:', settings);
```

## ⚠️ Bilinen Sorunlar ve Çözümleri

### 1. "Kullanıcı kimliği alınamadı" Hatası
**Çözüm:** Tekrar login olun, session timeout olmuş olabilir.

### 2. Ayarlar Tüm Kullanıcılar İçin Ortak
**Çözüm:** `FIX_UserFormSettings_Table.sql` scriptini çalıştırın.

### 3. DLL Dosyaları Kilitli
**Çözüm:** Visual Studio'yu kapatıp açın veya IIS Express'i durdurun.

## 📝 Test Senaryoları

### Senaryo 1: Kullanıcı İzolasyonu
1. Admin ile giriş yap
2. Bir alanı gizle, genişlikleri değiştir
3. Kaydet
4. Test kullanıcısı ile giriş yap
5. Farklı düzenleme yap, kaydet
6. Admin'e geri dön
7. ✅ Admin'in ayarları korunmuş olmalı

### Senaryo 2: Drag & Drop
1. Form başlıklarından tutarak sırayı değiştir
2. Kaydet
3. Sayfayı yenile
4. ✅ Sıralama korunmuş olmalı

### Senaryo 3: Alan Gizleme
1. Göz ikonuna tıklayarak alanları gizle
2. "Gizlenen Alanlar" dropdown'unu kontrol et
3. Kaydet ve sayfayı yenile
4. ✅ Gizlenen alanlar hatırlanmalı

## 👥 Kullanıcı Rolleri

- **Admin (UserId: 1)**: Tüm özelliklere erişim
- **Test User (UserId: 2)**: Tüm özelliklere erişim
- Her kullanıcının ayarları birbirinden bağımsız

## 🔐 Güvenlik

- UserId server-side'da `User.GetIdentifier()` ile alınır
- Client'tan gelen UserId parametreleri göz ardı edilir
- SQL Injection koruması: Parametreli sorgular kullanılır
- XSS koruması: JSON serialize/deserialize

## 📊 Performans

- Index: `IX_UserFormSettings_UserId` 
- Her kullanıcı için tek kayıt (güncellemeler mevcut kaydın üzerine)
- JSON veri boyutu ortalama 2-5 KB
- Lazy loading: Ayarlar sadece sayfa yüklendiğinde çekilir

## 🎉 Sonuç

Form Editor V2, kullanıcıların kendi form düzenlerini oluşturup saklayabilecekleri, modern ve kullanıcı dostu bir araçtır. Her kullanıcının ayarları güvenli şekilde izole edilmiş ve performanslı bir yapıda saklanmaktadır.

---
**Son Güncelleme:** 2024  
**Versiyon:** 2.0  
**Geliştirici Notları:** Zorunlu alan özellikleri kaldırıldı, kullanıcı izolasyonu düzeltildi.