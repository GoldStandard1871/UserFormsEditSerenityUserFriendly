-- UserFormSettings Tablosu Kontrol
USE [UserControlForm_Default_v1]
GO

-- 1. Tablo yapısı
PRINT 'UserFormSettings Tablo Yapısı:'
PRINT '============================='
SELECT 
    COLUMN_NAME as [Kolon],
    DATA_TYPE as [Tip],
    IS_NULLABLE as [Null?]
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'UserFormSettings'
ORDER BY ORDINAL_POSITION;

-- 2. Mevcut veriler
PRINT ''
PRINT 'UserFormSettings Verileri:'
PRINT '========================='
SELECT 
    Id,
    UserId,
    LEFT(Settings, 100) + CASE WHEN LEN(Settings) > 100 THEN '...' ELSE '' END as Settings_Kisa,
    InsertDate,
    InsertUserId,
    UpdateDate,
    UpdateUserId
FROM UserFormSettings
ORDER BY COALESCE(UpdateDate, InsertDate) DESC;

-- 3. Kullanıcı bazında özet
PRINT ''
PRINT 'Kullanıcı Bazında Özet:'
PRINT '======================'
SELECT 
    UserId,
    COUNT(*) as [Kayıt Sayısı],
    MAX(InsertDate) as [İlk Kayıt],
    MAX(UpdateDate) as [Son Güncelleme]
FROM UserFormSettings
GROUP BY UserId;

-- 4. Test verisi ekle (isteğe bağlı)
PRINT ''
PRINT 'Test verisi eklemek için:'
PRINT '========================'
PRINT '/*'
PRINT 'INSERT INTO UserFormSettings (UserId, Settings, InsertDate, InsertUserId)'
PRINT 'VALUES (1, ''{"test":true}'', GETDATE(), 1);'
PRINT '*/'

-- 5. Son 5 dakikadaki değişiklikler
PRINT ''
PRINT 'Son 5 Dakikadaki İşlemler:'
PRINT '=========================='
SELECT * FROM UserFormSettings
WHERE InsertDate >= DATEADD(MINUTE, -5, GETDATE())
   OR UpdateDate >= DATEADD(MINUTE, -5, GETDATE())
ORDER BY COALESCE(UpdateDate, InsertDate) DESC;