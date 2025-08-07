# Test Kullanıcısı Yetkilendirme Kılavuzu

## Yapılan Değişiklikler

### 1. Yetki Sistemi Güncellendi
- **Eski:** `Administration:General` yetkisi gerekiyordu
- **Yeni:** `FormEditor:View` ve `FormEditor:Edit` yetkileri tanımlandı

### 2. Değiştirilen Dosyalar:
- `FormEditorV2Row.cs` - Yetki tanımları güncellendi
- `UserFormSettingsRow.cs` - Yetki tanımları güncellendi  
- `NavigationItems.cs` - Menü yetkisi güncellendi
- `FormEditorPermissionKeys.cs` - Yeni yetki anahtarları eklendi

### 3. Zorunlu Alan Yetkilendirmesi
- **Admin Kontrolü:** `FormEditor:ManageRequiredFields` yetkisi veya Admin rolü
- **Normal Kullanıcı:** Sadece zorunlu alan göstergesini (*) görür
- **Admin Kullanıcı:** Zorunlu alan checkbox'ını görebilir ve değiştirebilir

## Test Kullanıcısına Yetki Verme

### SQL ile Yetki Verme:
```sql
-- GIVE_TEST_USER_FORMEDITOR_PERMISSION.sql dosyasını çalıştırın
-- veya aşağıdaki komutları kullanın:

-- Test kullanıcısının ID'sini bulun
DECLARE @TestUserId INT = (SELECT Id FROM Users WHERE Username = 'test');

-- FormEditor:View yetkisi ver
INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
VALUES (@TestUserId, 'FormEditor:View', 1);

-- FormEditor:Edit yetkisi ver  
INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
VALUES (@TestUserId, 'FormEditor:Edit', 1);
```

### Admin Panelinden Yetki Verme:
1. Admin olarak giriş yapın
2. Administration > Users menüsüne gidin
3. Test kullanıcısını bulun ve düzenle butonuna tıklayın
4. Permissions sekmesine gidin
5. `FormEditor:View` ve `FormEditor:Edit` yetkilerini işaretleyin
6. Kaydet

## Yetki Kontrolü

### Test Kullanıcısı Görür:
- ✅ Form Editor V2 menü öğesi
- ✅ Form listesi ve düzenleme özellikleri
- ✅ Alan gizleme/gösterme özellikleri
- ✅ Zorunlu alan göstergesi (*)
- ❌ Zorunlu alan checkbox'ı (sadece görüntüleme)

### Admin Kullanıcısı Görür:
- ✅ Tüm test kullanıcısı özellikleri
- ✅ Zorunlu alan checkbox'ı
- ✅ Zorunlu alan ayarlama yetkisi

## Projeyi Yeniden Başlatma

Visual Studio veya IIS Express kullanıyorsanız:
1. Visual Studio'da Stop butonuna basın
2. Projeyi tekrar çalıştırın (F5 veya Start)
3. Test kullanıcısı ile giriş yapın
4. Form Editor V2 menüsünün göründüğünü kontrol edin

## Test Senaryoları

### 1. Test Kullanıcısı Testi:
- Username: `test`
- Password: (test kullanıcısının şifresi)
- Form Editor V2 sayfasına erişim kontrolü
- Zorunlu alan göstergesini görme kontrolü

### 2. Admin Kullanıcısı Testi:
- Admin olarak giriş yapın
- Zorunlu alan checkbox'ının göründüğünü kontrol edin
- Zorunlu alan ayarlayıp kaydedin
- Test kullanıcısı ile tekrar giriş yapıp ayarların korunduğunu kontrol edin

## Sorun Giderme

### Menü Görünmüyorsa:
1. Tarayıcı önbelleğini temizleyin (Ctrl+F5)
2. Uygulamayı yeniden başlatın
3. SQL scriptini çalıştırarak yetkileri kontrol edin

### Yetki Hatası Alıyorsanız:
1. UserPermissions tablosunu kontrol edin
2. Test kullanıcısının ID'sini doğrulayın
3. Permission key'lerin doğru yazıldığından emin olun