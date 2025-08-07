-- TÜM OLASI TABLOLARI KONTROL ET
USE [UserControlForm_Default_v1]
GO

PRINT 'Form Editor ile ilgili tablolar aranıyor...'
PRINT '=========================================='
PRINT ''

-- 1. UserPreferences tablosu
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPreferences')
BEGIN
    PRINT '1. UserPreferences tablosu:'
    PRINT '   ✓ MEVCUT'
    SELECT TOP 5 * FROM UserPreferences;
END
ELSE
    PRINT '1. UserPreferences tablosu: ✗ YOK'

PRINT ''

-- 2. UserPreference tablosu (s'siz)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPreference')
BEGIN
    PRINT '2. UserPreference tablosu:'
    PRINT '   ✓ MEVCUT'
    SELECT TOP 5 * FROM UserPreference;
END
ELSE
    PRINT '2. UserPreference tablosu: ✗ YOK'

PRINT ''

-- 3. UserFormSettings tablosu
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserFormSettings')
BEGIN
    PRINT '3. UserFormSettings tablosu:'
    PRINT '   ✓ MEVCUT'
    SELECT TOP 5 * FROM UserFormSettings;
END
ELSE
    PRINT '3. UserFormSettings tablosu: ✗ YOK'

PRINT ''

-- 4. FormEditorV2 tablosu
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'FormEditorV2')
BEGIN
    PRINT '4. FormEditorV2 tablosu:'
    PRINT '   ✓ MEVCUT'
    SELECT TOP 5 * FROM FormEditorV2;
END
ELSE
    PRINT '4. FormEditorV2 tablosu: ✗ YOK'

PRINT ''

-- 5. User veya Preference içeren tüm tablolar
PRINT '5. User veya Preference içeren tüm tablolar:'
PRINT '============================================'
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE '%User%' 
   OR TABLE_NAME LIKE '%Preference%'
   OR TABLE_NAME LIKE '%Form%'
   OR TABLE_NAME LIKE '%Settings%'
ORDER BY TABLE_NAME;

-- 6. Veritabanındaki tüm tablolar
PRINT ''
PRINT '6. Veritabanındaki TÜM tablolar:'
PRINT '================================'
SELECT name AS TabloAdi
FROM sys.tables
ORDER BY name;