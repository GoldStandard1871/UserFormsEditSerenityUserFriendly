# Form Özelleştirme - Hızlı Entegrasyon Rehberi

## 🚀 Mevcut Dialog'a 1 Dakikada Entegrasyon

### Adım 1: Import Ekleyin
Dialog dosyanızın en üstüne ekleyin:

```typescript
import { CustomizableEntityDialog, Customizable } from "../../Common/CustomizableEntityDialog";
```

### Adım 2: Class'ı Değiştirin

**ESKİ:**
```typescript
export class MyDialog extends EntityDialog<MyRow> {
```

**YENİ:**
```typescript
@Customizable(true)
export class MyDialog extends CustomizableEntityDialog<MyRow> {
```

### Adım 3: Build & Test
```bash
dotnet build
```

**HEPSI BU KADAR!** ✅

---

## 📋 Özellikler

Dialog açıldığında toolbar'da **"Özelleştir"** butonu görünecek. Bu buton ile:

- ✅ Alan sıralama (Yukarı/Aşağı)
- ✅ Alan gizleme/gösterme
- ✅ Alan genişliği (%25, %33, %50, %75, %100)
- ✅ Zorunlu alan belirleme (Admin için)
- ✅ Kullanıcı bazlı kaydetme

---

## 🔧 Örnek Entegrasyonlar

### UserDialog
```typescript
import { CustomizableEntityDialog, Customizable } from "../../Common/CustomizableEntityDialog";

@Decorators.registerClass()
@Customizable(true)
export class UserDialog extends CustomizableEntityDialog<UserRow> {
    // Kodunuz aynı kalır
}
```

### RoleDialog
```typescript
import { CustomizableEntityDialog, Customizable } from "../../Common/CustomizableEntityDialog";

@Decorators.registerClass()
@Customizable(true)
export class RoleDialog extends CustomizableEntityDialog<RoleRow> {
    // Kodunuz aynı kalır
}
```

---

## ⚙️ Özelleştirmeyi Kapatma

Eğer bir dialog'da özelleştirmeyi kapatmak isterseniz:

```typescript
@Customizable(false) // Kapalı
```

veya decorator'ı hiç eklemeyin.

---

## 🎯 Hangi Dialog'lar Destekleniyor?

Tüm `EntityDialog` tabanlı dialog'lar desteklenir:
- User Dialog
- Role Dialog
- Language Dialog
- Product Dialog
- Order Dialog
- Customer Dialog
- vb...

---

## ❓ Sorun Giderme

### "Özelleştir" butonu görünmüyor
1. Browser cache temizleyin (Ctrl+F5)
2. Build'i kontrol edin
3. CustomizableEntityDialog import edilmiş mi?
4. @Customizable(true) eklenmiş mi?

### Dialog açılmıyor
1. Browser konsolunda hata var mı? (F12)
2. FormFieldOrderDialog dosyası mevcut mu?
3. UserFormEditorService çalışıyor mu?

---

## 📦 Gerekli Dosyalar

Projenizde bu dosyalar olmalı:
- `/Modules/Common/CustomizableEntityDialog.ts`
- `/Modules/Administration/UserFormEditor/FormFieldOrderDialog.tsx`
- `/wwwroot/Content/site/fieldorder.css`

---

## 💾 Veri Depolama

Özelleştirmeler `UserPreferences` tablosunda saklanır:
- Kullanıcı bazlı
- Dialog bazlı
- JSON formatında

---

## 🔐 Yetkilendirme

- **Normal Kullanıcı**: Alan sıralama, gizleme, boyutlandırma
- **Admin**: Yukarıdakilere ek olarak zorunlu alan belirleme

---

## 📝 Not

Entegrasyon sonrası ilk açılışta dialog normal görünür. "Özelleştir" butonuna tıklayıp değişiklik yaptıktan sonra özelleştirmeler kaydedilir ve sonraki açılışlarda uygulanır.