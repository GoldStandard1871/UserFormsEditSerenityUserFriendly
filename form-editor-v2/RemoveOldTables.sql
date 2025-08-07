-- Eski tabloları kaldırma scripti
-- DİKKAT: Bu script eski FormEditorV2 ve UserFormSettings tablolarını kaldıracaktır!
-- Önce verileri yedeklemeniz önerilir.

-- UserFormSettings tablosundaki verileri UserPreference'a taşı (eğer varsa)
IF OBJECT_ID('dbo.UserFormSettings', 'U') IS NOT NULL
BEGIN
    PRINT 'UserFormSettings tablosundaki veriler UserPreference tablosuna taşınıyor...'
    
    -- Mevcut verileri UserPreference'a taşı
    INSERT INTO UserPreference (UserId, PreferenceType, Name, Value, CreatedDate, ModifiedDate, IsActive)
    SELECT 
        UserId,
        'FormEditorV2' AS PreferenceType,
        'AllSettings' AS Name,
        Settings AS Value,
        InsertDate AS CreatedDate,
        UpdateDate AS ModifiedDate,
        1 AS IsActive
    FROM UserFormSettings
    WHERE NOT EXISTS (
        SELECT 1 FROM UserPreference 
        WHERE UserPreference.UserId = UserFormSettings.UserId 
        AND PreferenceType = 'FormEditorV2' 
        AND Name = 'AllSettings'
    );
    
    PRINT 'Veri taşıma tamamlandı.'
END

-- FormEditorV2 tablosunu kaldır
IF OBJECT_ID('dbo.FormEditorV2', 'U') IS NOT NULL
BEGIN
    PRINT 'FormEditorV2 tablosu kaldırılıyor...'
    DROP TABLE dbo.FormEditorV2;
    PRINT 'FormEditorV2 tablosu kaldırıldı.'
END

-- UserFormSettings tablosunu kaldır
IF OBJECT_ID('dbo.UserFormSettings', 'U') IS NOT NULL
BEGIN
    PRINT 'UserFormSettings tablosu kaldırılıyor...'
    DROP TABLE dbo.UserFormSettings;
    PRINT 'UserFormSettings tablosu kaldırıldı.'
END

-- Temizlik sonrası kontrol
PRINT ''
PRINT 'Kontrol ediliyor...'

IF OBJECT_ID('dbo.FormEditorV2', 'U') IS NULL
    PRINT '✓ FormEditorV2 tablosu başarıyla kaldırıldı.'
ELSE
    PRINT '✗ FormEditorV2 tablosu hala mevcut!'

IF OBJECT_ID('dbo.UserFormSettings', 'U') IS NULL
    PRINT '✓ UserFormSettings tablosu başarıyla kaldırıldı.'
ELSE
    PRINT '✗ UserFormSettings tablosu hala mevcut!'

IF OBJECT_ID('dbo.UserPreference', 'U') IS NOT NULL
    PRINT '✓ UserPreference tablosu mevcut ve kullanıma hazır.'
ELSE
    PRINT '✗ UserPreference tablosu bulunamadı! UserPreference_UpdatedSchema.sql scriptini çalıştırın.'

-- UserPreference tablosundaki FormEditorV2 kayıtlarını göster
PRINT ''
PRINT 'UserPreference tablosundaki FormEditorV2 kayıt sayısı:'
SELECT COUNT(*) AS [FormEditorV2 Kayıt Sayısı]
FROM UserPreference
WHERE PreferenceType = 'FormEditorV2';