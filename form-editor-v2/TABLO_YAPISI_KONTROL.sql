-- UserPreferences tablosunun gerçek yapısını kontrol et
USE [UserControlForm_Default_v1]
GO

-- 1. Tablo var mı?
IF OBJECT_ID('dbo.UserPreferences', 'U') IS NOT NULL
BEGIN
    PRINT 'UserPreferences tablosu mevcut'
    PRINT ''
    PRINT 'TABLO KOLANLARI:'
    PRINT '================'
    
    -- Tüm kolonları listele
    SELECT 
        COLUMN_NAME as [Kolon Adı],
        DATA_TYPE as [Veri Tipi],
        CHARACTER_MAXIMUM_LENGTH as [Max Uzunluk],
        IS_NULLABLE as [Null Olabilir],
        COLUMN_DEFAULT as [Varsayılan]
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'UserPreferences'
        AND TABLE_SCHEMA = 'dbo'
    ORDER BY ORDINAL_POSITION;
    
    -- Kolon isimlerini tek satırda göster
    PRINT ''
    PRINT 'Kolon listesi:'
    DECLARE @cols NVARCHAR(MAX) = '';
    SELECT @cols = @cols + COLUMN_NAME + ', '
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'UserPreferences'
        AND TABLE_SCHEMA = 'dbo'
    ORDER BY ORDINAL_POSITION;
    
    PRINT LEFT(@cols, LEN(@cols)-1);
END
ELSE
BEGIN
    PRINT 'UserPreferences tablosu BULUNAMADI!'
END

-- 2. Tüm verileri göster (kolon isimleri ne olursa olsun)
PRINT ''
PRINT 'TABLODAKI TÜM VERILER:'
PRINT '====================='

SELECT * FROM dbo.UserPreferences;