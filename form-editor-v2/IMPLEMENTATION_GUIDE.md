# Form Field Customization Implementation Guide

## Özet
Projede tüm Entity Dialog'larda kullanılabilecek alan özelleştirme sistemi oluşturuldu. Bu sistem kullanıcıların form alanlarını yeniden düzenlemesine, gizlemesine, boyutlandırmasına ve zorunlu alan belirlemesine olanak tanır.

## Mimarı

### 1. CustomizableEntityDialog Base Class
`Modules/Common/CustomizableEntityDialog.ts`

Tüm özelleştirilebilir dialog'ların türetileceği base class.

### 2. FormFieldOrderDialog
`Modules/Administration/UserFormEditor/FormFieldOrderDialog.tsx`

Alan özelleştirme arayüzü - drag & drop, visibility, width, required field kontrolü.

## Kullanım

### Seçenek 1: Base Class Inheritance
```typescript
import { CustomizableEntityDialog, Customizable } from '../../Common/CustomizableEntityDialog';

@Decorators.registerClass()
@Customizable(true) // Özelleştirmeyi aktif et
export class MyDialog extends CustomizableEntityDialog<MyRow> {
    // Dialog implementation
}
```

### Seçenek 2: Mixin Pattern (Mevcut Dialog'lar İçin)
```typescript
import { EntityDialog } from '@serenity-is/corelib';
import { applyCustomization } from '../../Common/DialogCustomization';

@Decorators.registerClass()
export class ExistingDialog extends EntityDialog<MyRow> {
    constructor() {
        super();
        applyCustomization(this); // Mixin olarak ekle
    }
}
```

### Seçenek 3: Dialog Decorator
```typescript
import { EntityDialog } from '@serenity-is/corelib';
import { EnableCustomization } from '../../Common/DialogCustomization';

@Decorators.registerClass()
@EnableCustomization({
    showButton: true,
    allowReorder: true,
    allowResize: true,
    allowRequired: true
})
export class MyDialog extends EntityDialog<MyRow> {
    // Dialog implementation
}
```

## Özellikler

### Kullanıcı Tarafı
- **Alan Sıralama**: Yukarı/Aşağı butonları ile sıra değiştirme
- **Alan Gizleme**: Göz ikonu ile alan gizleme/gösterme
- **Alan Boyutlandırma**: %25, %33, %50, %75, %100 genişlik seçenekleri
- **Gizli Alanları Göster**: Gizlenen alanları geçici olarak görüntüleme

### Admin Özellikleri
- **Zorunlu Alan Belirleme**: Checkbox ile alan zorunluluğu ayarlama
- **Global Ayarlar**: Tüm kullanıcılar için geçerli zorunlu alanlar

## Veri Depolama

### UserPreferences Tablosu
```sql
PreferenceType: 'UserPreference'
Name: 'FieldCustomization:{DialogType}:User{UserId}'
Value: JSON formatında özelleştirme verileri
```

### JSON Formatı
```json
{
  "fields": [
    {
      "fieldName": "Username",
      "displayName": "Kullanıcı Adı",
      "order": 0,
      "visible": true,
      "width": "50",
      "required": true
    }
  ]
}
```

## Toolbar Butonu

Dialog toolbar'ına otomatik olarak "Özelleştir" butonu eklenir:
- İkon: fa-sliders
- Pozisyon: Save butonundan sonra
- Tıklandığında FormFieldOrderDialog açılır

## CSS Sınıfları

```css
.width-25 { width: 25%; }
.width-33 { width: 33.333%; }
.width-50 { width: 50%; }
.width-75 { width: 75%; }
.width-100 { width: 100%; }
.field-hidden { display: none; }
.required-star { color: red; }
```

## Implementasyon Adımları

1. **CustomizableEntityDialog.ts** dosyasını Common klasörüne ekleyin
2. İstediğiniz dialog'u CustomizableEntityDialog'dan türetin
3. @Customizable decorator'ını ekleyin
4. Build edin ve test edin

## Test

1. Admin olarak giriş yapın
2. Özelleştirilebilir bir dialog açın (örn: UserDialog)
3. Toolbar'da "Özelleştir" butonuna tıklayın
4. Alanları düzenleyin ve kaydedin
5. Dialog'u kapatıp açın - ayarların korunduğunu görün
6. Test kullanıcısı ile giriş yapın
7. Aynı dialog'u açın - özelleştirmelerin uygulandığını ama admin kontrollerinin olmadığını doğrulayın

## Notlar

- Özelleştirmeler kullanıcı bazlıdır
- Admin zorunlu alan ayarları tüm kullanıcıları etkiler
- Mobile responsive - 768px altında tüm alanlar %100 genişliğe geçer
- Gizlenen alanlar validation'dan muaf tutulur