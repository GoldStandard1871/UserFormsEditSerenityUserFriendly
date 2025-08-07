-- BASİT TEST - Form Editor V2
USE [UserControlForm_Default_v1]
GO

-- 1. Tablo yapısını göster
PRINT 'UserPreferences tablo yapısı:'
PRINT '=============================='
SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'UserPreferences'
ORDER BY ORDINAL_POSITION;

-- 2. FormEditorV2 kayıtlarını göster
PRINT ''
PRINT 'FormEditorV2 Kayıtları:'
PRINT '======================'
SELECT * FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2';

-- 3. Manuel test verisi ekle
PRINT ''
PRINT 'Test verisi ekleniyor...'

-- Önce eski test verilerini temizle
DELETE FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2' 
  AND Name LIKE 'TEST_%';

-- Yeni test verisi ekle
INSERT INTO dbo.UserPreferences (UserId, PreferenceType, Name, Value, InsertDate)
VALUES 
(1, 'FormEditorV2', 'TEST_WidthMode', 'wide', GETDATE()),
(1, 'FormEditorV2', 'TEST_AllSettings', '{"layoutSettings":{"widthMode":"wide"},"fieldSettings":[]}', GETDATE());

-- Sonuçları göster
PRINT ''
PRINT 'Eklenen test verileri:'
SELECT * FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2'
ORDER BY InsertDate DESC;