# 📋 Field Customization System - Kolay Aktarım Rehberi

Bu sistem, Serenity dialog'larında alan özelleştirme (sıralama, gizleme, zorunlu alan) imkanı sağlar.

## 🎯 Özellikler

✅ **Admin için:**
- Tüm kullanıcılar için zorunlu alan belirleme
- Zorunlu alanlar tüm kullanıcılarda kırmızı yıldızla gösterilir

✅ **Tüm kullanıcılar için:**
- Alan sıralama (yukarı/aşağı)
- Alan gizleme/gösterme
- Değişiklikler kullanıcıya özel kaydedilir

## 📦 Kurulum Adımları

### 1️⃣ Veritabanı Tablolarını Oluşturun

```sql
-- CREATE_FIELD_CUSTOMIZATION_TABLES.sql dosyasını çalıştırın
-- veya aşağıdaki SQL'i çalıştırın:

CREATE TABLE [dbo].[AdminRequiredFields] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [DialogName] NVARCHAR(100) NOT NULL,
    [FieldName] NVARCHAR(100) NOT NULL,
    [IsRequired] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [CreatedBy] INT NOT NULL,
    [UpdatedDate] DATETIME NULL,
    [UpdatedBy] INT NULL,
    CONSTRAINT UK_AdminRequiredFields UNIQUE([DialogName], [FieldName])
);

CREATE TABLE [dbo].[UserFieldSettings] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [DialogName] NVARCHAR(100) NOT NULL,
    [FieldName] NVARCHAR(100) NOT NULL,
    [IsVisible] BIT NOT NULL DEFAULT 1,
    [DisplayOrder] INT NOT NULL DEFAULT 0,
    [CreatedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [UpdatedDate] DATETIME NULL,
    CONSTRAINT UK_UserFieldSettings UNIQUE([UserId], [DialogName], [FieldName])
);
```

### 2️⃣ Backend Dosyalarını Kopyalayın

Aşağıdaki dosyaları projenize kopyalayın:

```
📁 Modules/Administration/FieldCustomization/
   ├── AdminRequiredFieldsRow.cs
   ├── UserFieldSettingsRow.cs
   └── FieldCustomizationEndpoint.cs
```

### 3️⃣ Frontend Dosyasını Kopyalayın

```
📁 Modules/Common/
   └── DialogFieldCustomizer.ts
```

### 4️⃣ ScriptInit.ts'ye Ekleme Yapın

`Modules/Common/ScriptInit.ts` dosyasına ekleyin:

```typescript
import { DialogFieldCustomizer } from "./DialogFieldCustomizer";

// ... diğer kodlar ...

// Dialog Field Customizer'ı başlat
DialogFieldCustomizer.initialize();
```

### 5️⃣ Build ve Çalıştırma

```bash
# Backend build
dotnet build

# Frontend build (eğer ayrı ise)
npm run build
```

## 🚀 Kullanım

1. Herhangi bir dialog açıldığında **"Özelleştir"** butonu otomatik görünecek
2. Butona tıklayarak özelleştirme panelini açın
3. Alanları sıralayın, gizleyin veya zorunlu yapın
4. Kaydet'e tıklayın

## ⚙️ Özelleştirme

### Dialog Adını Değiştirme

`DialogFieldCustomizer.ts` dosyasında `getDialogName` metodunu güncelleyin:

```typescript
private static getDialogName(dialog: HTMLElement): string {
    // Kendi dialog adlandırma mantığınızı ekleyin
}
```

### Cache Süresini Değiştirme

Varsayılan 5 dakika. Değiştirmek için:

```typescript
// DialogFieldCustomizer.ts içinde
if (cached && cacheTime && (now - cacheTime) < 300000) { // 300000 = 5 dakika
```

## 🔧 Sorun Giderme

### "Özelleştir" butonu görünmüyor
- Browser cache temizleyin (Ctrl+F5)
- Console'da hata kontrolü yapın (F12)

### Zorunlu alanlar görünmüyor
- Admin yetkisi kontrolü yapın
- Browser console'da: `reloadFieldSettings()`

### Değişiklikler kaydedilmiyor
- Veritabanı tablolarının oluştuğunu kontrol edin
- Endpoint'in çalıştığını test edin

## 📝 Notlar

- Sistem otomatik olarak tüm Serenity dialog'larını algılar
- Kullanıcı bazlı ayarlar `UserFieldSettings` tablosunda saklanır
- Admin zorunlu alanları `AdminRequiredFields` tablosunda saklanır
- Cache mekanizması performans için kullanılır (5 dakika)

## 🔐 Güvenlik

- Admin yetkisi kontrolü: `Administration:General`
- Kullanıcılar sadece kendi ayarlarını görebilir/değiştirebilir
- SQL Injection koruması mevcut

## 📞 Destek

Sorun yaşarsanız:
1. Browser console'u kontrol edin
2. Network sekmesinde API çağrılarını kontrol edin
3. Veritabanı tablolarını kontrol edin

---

**Hazırlayan:** Claude AI Assistant
**Tarih:** 2025