-- EN BASİT SORGU
USE [UserControlForm_Default_v1]
GO

-- 1. Tablo var mı?
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPreferences')
    PRINT 'UserPreferences tablosu VAR'
ELSE
    PRINT 'UserPreferences tablosu YOK'

-- 2. Tüm verileri göster
PRINT ''
PRINT 'TÜM VERİLER:'
SELECT * FROM dbo.UserPreferences;

-- 3. Eğer boşsa, kolon yapısını görmek için boş bir satır ekleyelim
IF NOT EXISTS (SELECT 1 FROM dbo.UserPreferences)
BEGIN
    PRINT ''
    PRINT 'Tablo boş görünüyor. Kolon isimlerini görmek için:'
    
    -- Sadece kolon başlıklarını göster
    SELECT TOP 0 * FROM dbo.UserPreferences;
END