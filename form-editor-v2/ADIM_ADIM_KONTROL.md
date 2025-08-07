# Form Editor V2 - Kullanıcı Ayarlarını Görme Rehberi

## 🎯 Hızlı Başlangıç

### 1. SQL Server Management Studio (SSMS) ile:

1. **SSMS'i açın**
2. **Server'a bağlanın** (local veya uzak sunucu)
3. **UserControlForm_Default_v1** veritabanını bulun
4. Sağ tıklayın → **New Query**
5. Aşağıdaki sorguyu yapıştırın ve **F5** tuşuna basın:

```sql
USE [UserControlForm_Default_v1]
GO

SELECT * FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2'
ORDER BY UserId, Name;
```

### 2. Visual Studio ile:

1. **View** menüsü → **SQL Server Object Explorer**
2. SQL Server → (localdb)\... → Databases → **UserControlForm_Default_v1**
3. Tables → **dbo.UserPreferences** → Sağ tık → **View Data**

## 📊 Detaylı Sorgular

### Belirli Bir Kullanıcının Ayarları:
```sql
SELECT * FROM dbo.UserPreferences 
WHERE UserId = 1  -- Kullanıcı ID'nizi yazın
  AND PreferenceType = 'FormEditorV2'
  AND IsActive = 1;
```

### Son Değişiklikler:
```sql
SELECT TOP 10 * FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2'
ORDER BY COALESCE(ModifiedDate, CreatedDate) DESC;
```

## 🔍 Görüntüleme Scriptleri

Projede hazır scriptler var:

1. **GOSTER_KULLANICI_AYARLARI.sql** - Tüm ayarları detaylı gösterir
2. **CANLI_IZLEME_AYARLAR.sql** - Canlı takip için (F5 ile yenileyin)
3. **UserControlForm_Test_Execute.sql** - Test verileri ekler

## 💡 Adım Adım Test:

1. **Form Editor V2 sayfasını açın**
2. **Herhangi bir değişiklik yapın:**
   - Alan genişliğini değiştirin
   - Bir alanı gizleyin
   - Form sırasını değiştirin
3. **"Kaydet" butonuna basın**
4. **SSMS'de F5 ile sorguyu yenileyin**
5. **Yeni kayıtları görün!**

## 📋 Tablo Yapısı:

| Kolon | Açıklama | Örnek Değer |
|-------|----------|-------------|
| UserPreferenceId | Otomatik ID | 1, 2, 3... |
| UserId | Kullanıcı ID | 1 |
| PreferenceType | Ayar tipi | FormEditorV2 |
| Name | Ayar adı | WidthMode, Field_CustomerName_Width |
| Value | Ayar değeri | wide, 50, true |
| CreatedDate | Oluşturma tarihi | 2024-01-15 10:30:00 |
| ModifiedDate | Güncelleme tarihi | 2024-01-15 11:45:00 |
| IsActive | Aktif mi? | 1 (Evet), 0 (Hayır) |

## 🚨 Sorun Giderme:

Eğer veri göremiyorsanız:

1. **Doğru veritabanında mısınız?** → `UserControlForm_Default_v1`
2. **Tablo var mı?** → `dbo.UserPreferences` (s ile biter!)
3. **Login oldunuz mu?** → Kullanıcı ID'niz doğru mu?
4. **Kaydet'e bastınız mı?** → Form'da değişiklik yaptıktan sonra

## 🎉 Başarılı Test Örneği:

Form Editor V2'de alan genişliğini %50 yaptıysanız, SQL'de şunu görürsünüz:

```
UserPreferenceId: 123
UserId: 1
PreferenceType: FormEditorV2
Name: Field_CustomerName_Width
Value: 50
CreatedDate: 2024-01-15 10:30:00
ModifiedDate: NULL
IsActive: 1
```