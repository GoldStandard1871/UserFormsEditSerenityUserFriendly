-- =====================================================
-- KULLANICIYA ÖZEL FORM AYARLARI TEST SENARYOSU
-- =====================================================
USE [UserControlForm_Default_v1]
GO

-- =====================================================
-- SENARYO 1: İKİ FARKLI KULLANICI İÇİN TEST
-- =====================================================
PRINT '=== SENARYO 1: İKİ FARKLI KULLANICI ==='
PRINT ''

-- Kullanıcı 1 için test verileri
DECLARE @User1Id INT = 1;
DECLARE @User1Settings NVARCHAR(MAX) = '{
    "layoutSettings": {
        "widthMode": "wide",
        "showWidthControls": true,
        "formOrder": ["form-0", "form-2", "form-1"],
        "formStructure": [
            {
                "formId": "form-0",
                "formName": "Müşteri Bilgileri",
                "order": 0,
                "hidden": false,
                "fields": [
                    {
                        "fieldId": "field_0_1",
                        "fieldName": "Müşteri Adı",
                        "columnName": "CustomerName",
                        "width": 50,
                        "hidden": false,
                        "order": 1
                    },
                    {
                        "fieldId": "field_0_2",
                        "fieldName": "Telefon",
                        "columnName": "Phone",
                        "width": 25,
                        "hidden": true,
                        "order": 2
                    }
                ]
            }
        ]
    },
    "fieldSettings": [
        {
            "fieldId": "field_0_1",
            "width": 50,
            "hidden": false,
            "required": true
        }
    ]
}';

-- Kullanıcı 2 için test verileri
DECLARE @User2Id INT = 2;
DECLARE @User2Settings NVARCHAR(MAX) = '{
    "layoutSettings": {
        "widthMode": "compact",
        "showWidthControls": false,
        "formOrder": ["form-1", "form-0", "form-2"],
        "formStructure": [
            {
                "formId": "form-0",
                "formName": "Müşteri Bilgileri",
                "order": 1,
                "hidden": true,
                "fields": [
                    {
                        "fieldId": "field_0_1",
                        "fieldName": "Müşteri Adı",
                        "columnName": "CustomerName",
                        "width": 100,
                        "hidden": false,
                        "order": 1
                    }
                ]
            }
        ]
    },
    "fieldSettings": [
        {
            "fieldId": "field_0_1",
            "width": 100,
            "hidden": false,
            "required": false
        }
    ]
}';

-- Kullanıcı 1 için kayıt
PRINT 'Kullanıcı 1 (ID: ' + CAST(@User1Id AS VARCHAR) + ') için ayarlar kaydediliyor...'
EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @User1Id, @type = 'FormEditorV2', @name = 'AllSettings', @value = @User1Settings;

-- Kullanıcı 2 için kayıt
PRINT 'Kullanıcı 2 (ID: ' + CAST(@User2Id AS VARCHAR) + ') için ayarlar kaydediliyor...'
EXEC sp_executesql N'
    IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = @userId AND PreferenceType = @type AND Name = @name AND IsActive = 1)
        UPDATE UserPreferences SET Value = @value, ModifiedDate = GETDATE() 
        WHERE UserId = @userId AND PreferenceType = @type AND Name = @name
    ELSE
        INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) 
        VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @User2Id, @type = 'FormEditorV2', @name = 'AllSettings', @value = @User2Settings;

-- Detaylı ayarları da kaydet
-- Kullanıcı 1
EXEC sp_executesql N'INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @User1Id, @type = 'FormEditorV2', @name = 'WidthMode', @value = 'wide';

EXEC sp_executesql N'INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @User1Id, @type = 'FormEditorV2', @name = 'Field_field_0_1_Width', @value = '50';

-- Kullanıcı 2
EXEC sp_executesql N'INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @User2Id, @type = 'FormEditorV2', @name = 'WidthMode', @value = 'compact';

EXEC sp_executesql N'INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive) VALUES (@userId, @type, @name, @value, GETDATE(), 1)',
    N'@userId INT, @type NVARCHAR(100), @name NVARCHAR(200), @value NVARCHAR(MAX)',
    @userId = @User2Id, @type = 'FormEditorV2', @name = 'Field_field_0_1_Width', @value = '100';

PRINT ''
PRINT '=== KULLANICILARIN AYARLARI ==='
PRINT ''

-- Her iki kullanıcının ayarlarını karşılaştır
SELECT 
    up.UserId,
    u.Username,
    up.Name as [Ayar],
    CASE 
        WHEN LEN(up.Value) > 50 THEN LEFT(up.Value, 50) + '...'
        ELSE up.Value
    END as [Değer],
    up.CreatedDate,
    up.ModifiedDate
FROM UserPreferences up
LEFT JOIN Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.UserId IN (@User1Id, @User2Id)
    AND up.IsActive = 1
ORDER BY up.UserId, up.Name;

-- =====================================================
-- SENARYO 2: FORM YAPISI DEĞİŞİKLİKLERİ
-- =====================================================
PRINT ''
PRINT '=== SENARYO 2: FORM YAPISI KARŞILAŞTIRMASI ==='
PRINT ''

-- JSON içindeki form yapısını göster
SELECT 
    UserId,
    'Form Sırası: ' + 
    CASE UserId
        WHEN @User1Id THEN '"form-0", "form-2", "form-1" (Müşteri önce)'
        WHEN @User2Id THEN '"form-1", "form-0", "form-2" (Farklı sıra)'
    END as [Form Düzeni],
    'Genişlik Modu: ' + 
    CASE UserId
        WHEN @User1Id THEN 'wide (Geniş)'
        WHEN @User2Id THEN 'compact (Dar)'
    END as [Görünüm],
    'Alan Genişlikleri: ' +
    CASE UserId
        WHEN @User1Id THEN 'Müşteri Adı: %50, Telefon: %25 (gizli)'
        WHEN @User2Id THEN 'Müşteri Adı: %100, Form gizli'
    END as [Alan Ayarları]
FROM UserPreferences
WHERE PreferenceType = 'FormEditorV2'
    AND Name = 'AllSettings'
    AND UserId IN (@User1Id, @User2Id)
    AND IsActive = 1;

-- =====================================================
-- SENARYO 3: KULLANICIYA GÖRE FİLTRELEME
-- =====================================================
PRINT ''
PRINT '=== KULLANICI 1 İÇİN TÜM AYARLAR ==='
SELECT * FROM UserPreferences 
WHERE UserId = @User1Id 
    AND PreferenceType = 'FormEditorV2' 
    AND IsActive = 1
ORDER BY Name;

PRINT ''
PRINT '=== KULLANICI 2 İÇİN TÜM AYARLAR ==='
SELECT * FROM UserPreferences 
WHERE UserId = @User2Id 
    AND PreferenceType = 'FormEditorV2' 
    AND IsActive = 1
ORDER BY Name;

-- =====================================================
-- ÖZET BİLGİ
-- =====================================================
PRINT ''
PRINT '=== ÖZET ==='
PRINT '• Her kullanıcı kendi form düzenini görür'
PRINT '• Kullanıcı 1: Geniş mod, Müşteri formu önde'
PRINT '• Kullanıcı 2: Dar mod, Müşteri formu gizli'
PRINT '• Aynı alan farklı genişliklerde görünür'
PRINT '• Form sıralamaları farklı'
PRINT ''
PRINT 'Form Editor V2 sayfasına farklı kullanıcılarla giriş yaparak test edin!'