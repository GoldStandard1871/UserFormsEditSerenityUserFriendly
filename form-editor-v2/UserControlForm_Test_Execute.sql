-- UserControlForm_Default_v1 veritabanı için test scripti
-- Form Editor V2 - UserPreferences Test Script

USE [UserControlForm_Default_v1]
GO

-- Test kullanıcısı için örnek veri ekleme
DECLARE @TestUserId INT = 1; -- Test kullanıcı ID'si (login olan kullanıcının ID'si olmalı)
DECLARE @TestSettings NVARCHAR(MAX) = '{
    "layoutSettings": {
        "widthMode": "wide",
        "showWidthControls": true,
        "formOrder": ["form1", "form2", "form3"]
    },
    "fieldSettings": [
        {
            "fieldId": "CustomerName",
            "hidden": false,
            "width": 50,
            "required": true
        },
        {
            "fieldId": "OrderDate",
            "hidden": true,
            "width": 25,
            "required": false
        }
    ]
}';

-- 1. Test verisi ekleme
PRINT '1. TEST VERİSİ EKLEME'
PRINT '====================='
PRINT 'Kullanıcı ID: ' + CAST(@TestUserId AS VARCHAR)
PRINT ''

-- Layout ayarları ekle
EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @TestUserId, @type = 'FormEditorV2', @name = 'WidthMode', @value = 'wide';

EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @TestUserId, @type = 'FormEditorV2', @name = 'ShowWidthControls', @value = 'true';

-- Field ayarları ekle
EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @TestUserId, @type = 'FormEditorV2', @name = 'Field_CustomerName_Width', @value = '50';

EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @TestUserId, @type = 'FormEditorV2', @name = 'Field_CustomerName_Hidden', @value = 'false';

-- Tüm ayarları JSON olarak da kaydet
EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @TestUserId, @type = 'FormEditorV2', @name = 'AllSettings', @value = @TestSettings;

PRINT 'Test verileri eklendi.'
PRINT ''

-- 2. Eklenen verileri görüntüle
PRINT '2. KULLANICI AYARLARINI GÖRÜNTÜLE (dbo.UserPreferences)'
PRINT '========================================================'

SELECT 
    UserPreferenceId,
    UserId,
    Name,
    CASE 
        WHEN LEN(Value) > 50 THEN LEFT(Value, 50) + '...'
        ELSE Value
    END as Value,
    CreatedDate,
    ModifiedDate,
    IsActive
FROM dbo.UserPreferences
WHERE UserId = @TestUserId
    AND PreferenceType = 'FormEditorV2'
    AND IsActive = 1
ORDER BY 
    CASE 
        WHEN Name = 'AllSettings' THEN 1
        WHEN Name LIKE 'Width%' OR Name LIKE 'Show%' THEN 2
        WHEN Name LIKE 'Field_%' THEN 3
        ELSE 4
    END,
    Name;

-- 3. Farklı kullanıcılar için özet
PRINT ''
PRINT '3. TÜM KULLANICILAR İÇİN ÖZET (dbo.UserPreferences)'
PRINT '===================================================='

SELECT 
    up.UserId,
    u.Username,
    COUNT(*) as [Toplam Ayar],
    COUNT(CASE WHEN up.Name LIKE 'Field_%' THEN 1 END) as [Alan Ayarları],
    COUNT(CASE WHEN up.Name = 'AllSettings' THEN 1 END) as [JSON Ayar],
    MAX(up.CreatedDate) as [İlk Ayar],
    MAX(up.ModifiedDate) as [Son Güncelleme]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.IsActive = 1
GROUP BY up.UserId, u.Username
ORDER BY up.UserId;

-- 4. Ayar değişiklik geçmişi (son 10 değişiklik)
PRINT ''
PRINT '4. SON DEĞİŞİKLİKLER (dbo.UserPreferences)'
PRINT '=========================================='

SELECT TOP 10
    up.UserId,
    u.Username,
    up.Name,
    CASE 
        WHEN LEN(up.Value) > 30 THEN LEFT(up.Value, 30) + '...'
        ELSE up.Value
    END as Value,
    up.ModifiedDate as [Değişiklik Tarihi]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.ModifiedDate IS NOT NULL
ORDER BY up.ModifiedDate DESC;

-- 5. Alan bazında kullanım istatistikleri
PRINT ''
PRINT '5. ALAN BAZINDA KULLANIM (dbo.UserPreferences)'
PRINT '=============================================='

SELECT 
    SUBSTRING(Name, 7, CHARINDEX('_', Name, 7) - 7) as [Alan Adı],
    COUNT(DISTINCT UserId) as [Kullanan Kişi],
    COUNT(CASE WHEN Name LIKE '%_Hidden' AND Value = 'true' THEN 1 END) as [Gizleyen],
    COUNT(CASE WHEN Name LIKE '%_Width' THEN 1 END) as [Genişlik Ayarlayanlar],
    COUNT(CASE WHEN Name LIKE '%_Required' AND Value = 'true' THEN 1 END) as [Zorunlu Yapanlar]
FROM dbo.UserPreferences
WHERE PreferenceType = 'FormEditorV2'
    AND Name LIKE 'Field_%'
    AND IsActive = 1
GROUP BY SUBSTRING(Name, 7, CHARINDEX('_', Name, 7) - 7)
ORDER BY [Kullanan Kişi] DESC;

-- 6. Veritabanı ve tablo bilgisi
PRINT ''
PRINT '6. VERİTABANI BİLGİSİ'
PRINT '===================='
PRINT 'Veritabanı: ' + DB_NAME()
PRINT 'Tablo: dbo.UserPreferences'
PRINT 'Sunucu: ' + @@SERVERNAME
PRINT ''

-- Belirli bir kullanıcının tüm ayarlarını görmek için:
PRINT '-- Belirli bir kullanıcının detaylı ayarları için aşağıdaki sorguyu kullanabilirsiniz:'
PRINT '/*'
PRINT 'DECLARE @UserId INT = 1; -- Kullanıcı ID''sini buraya girin'
PRINT ''
PRINT 'SELECT * FROM dbo.UserPreferences'
PRINT 'WHERE UserId = @UserId'
PRINT '  AND PreferenceType = ''FormEditorV2'''
PRINT '  AND IsActive = 1'
PRINT 'ORDER BY Name;'
PRINT '*/'