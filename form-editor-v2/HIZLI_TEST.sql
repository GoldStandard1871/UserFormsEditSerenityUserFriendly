-- HIZLI TEST - Form Editor V2 Verileri
USE [UserControlForm_Default_v1]
GO

-- 1. Kaç kayıt var?
SELECT COUNT(*) as [Toplam FormEditorV2 Kaydı] 
FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2';

-- 2. Tüm kayıtları göster
SELECT * FROM dbo.UserPreferences 
WHERE PreferenceType = 'FormEditorV2'
ORDER BY CreatedDate DESC;

-- 3. Eğer kayıt yoksa test verisi ekle
IF NOT EXISTS (SELECT 1 FROM dbo.UserPreferences WHERE PreferenceType = 'FormEditorV2')
BEGIN
    PRINT 'Kayıt bulunamadı! Test verisi ekleniyor...'
    
    INSERT INTO dbo.UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive)
    VALUES 
    (1, 'FormEditorV2', 'TEST_WidthMode', 'wide', GETDATE(), 1),
    (1, 'FormEditorV2', 'TEST_AllSettings', '{"test":true}', GETDATE(), 1);
    
    PRINT 'Test verileri eklendi. Scripti tekrar çalıştırın.'
END