-- DOĞRU TABLOYU BULALIM
USE [UserControlForm_Default_v1]
GO

-- 1. UserFormSettings tablosu yapısı
PRINT '1. UserFormSettings Tablosu:'
PRINT '============================'
EXEC sp_columns @table_name = 'UserFormSettings';

PRINT ''
PRINT 'UserFormSettings verileri:'
SELECT * FROM UserFormSettings;

PRINT ''
PRINT '============================'

-- 2. UserPreferences tablosu yapısı
PRINT '2. UserPreferences Tablosu:'
PRINT '============================'
EXEC sp_columns @table_name = 'UserPreferences';

PRINT ''
PRINT 'UserPreferences verileri:'
SELECT * FROM UserPreferences;

PRINT ''
PRINT '============================'

-- 3. FormEditorV2 tablosu yapısı
PRINT '3. FormEditorV2 Tablosu:'
PRINT '========================'
EXEC sp_columns @table_name = 'FormEditorV2';

PRINT ''
PRINT 'FormEditorV2 verileri:'
SELECT * FROM FormEditorV2;