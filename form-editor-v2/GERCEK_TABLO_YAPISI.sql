-- UserPreferences tablosunun GERÇEK yapısını göster
USE [UserControlForm_Default_v1]
GO

-- 1. Basit kolon listesi
PRINT 'UserPreferences Tablosu Kolonları:'
PRINT '==================================='

-- sp_columns kullanarak kolon bilgilerini al
EXEC sp_columns @table_name = 'UserPreferences';

-- 2. Alternatif yöntem
PRINT ''
PRINT 'Alternatif Görünüm:'
PRINT '==================='
SELECT 
    ORDINAL_POSITION as Sıra,
    COLUMN_NAME as KolonAdı,
    DATA_TYPE as VeriTipi,
    IS_NULLABLE as NullOlabilir
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'UserPreferences'
    AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;

-- 3. Tüm verileri * ile göster
PRINT ''
PRINT 'Tablodaki Mevcut Veriler:'
PRINT '========================'
SELECT TOP 10 * FROM dbo.UserPreferences;

-- 4. Sadece kolon isimlerini göster
PRINT ''
PRINT 'Sadece Kolon İsimleri:'
PRINT '====================='
SELECT name AS KolonAdi
FROM sys.columns 
WHERE object_id = OBJECT_ID('dbo.UserPreferences')
ORDER BY column_id;