-- UserFormSettings tablosunu kontrol et ve düzelt
-- =============================================

-- 1. Mevcut tablo yapısını göster
PRINT '=== MEVCUT TABLO YAPISI ==='
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'UserFormSettings')
BEGIN
    SELECT 
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.CHARACTER_MAXIMUM_LENGTH,
        c.IS_NULLABLE,
        c.COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS c
    WHERE c.TABLE_NAME = 'UserFormSettings'
    ORDER BY c.ORDINAL_POSITION
END
ELSE
BEGIN
    PRINT 'UserFormSettings tablosu bulunamadı!'
END
GO

-- 2. UserId kolonu yoksa ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'UserFormSettings' AND COLUMN_NAME = 'UserId')
BEGIN
    PRINT 'UserId kolonu ekleniyor...'
    ALTER TABLE UserFormSettings ADD UserId INT NULL
    PRINT 'UserId kolonu eklendi.'
END
ELSE
BEGIN
    PRINT 'UserId kolonu zaten mevcut.'
END
GO

-- 3. Mevcut kayıtları kontrol et
PRINT ''
PRINT '=== MEVCUT KAYITLAR ==='
SELECT 
    Id,
    UserId,
    LEN(Settings) as SettingsLength,
    InsertDate,
    UpdateDate
FROM UserFormSettings
ORDER BY Id DESC
GO

-- 4. Eğer UserId NULL olan kayıtlar varsa, onları admin kullanıcısına ata
PRINT ''
PRINT '=== NULL UserId DÜZELTME ==='
UPDATE UserFormSettings 
SET UserId = 1 -- Admin kullanıcısının ID'si (genelde 1)
WHERE UserId IS NULL

PRINT 'NULL UserId değerleri düzeltildi.'
GO

-- 5. UserId kolonunu NOT NULL yap
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'UserFormSettings' AND COLUMN_NAME = 'UserId' AND IS_NULLABLE = 'YES')
BEGIN
    PRINT 'UserId kolonu NOT NULL yapılıyor...'
    ALTER TABLE UserFormSettings ALTER COLUMN UserId INT NOT NULL
    PRINT 'UserId kolonu NOT NULL yapıldı.'
END
GO

-- 6. Index ekle (performans için)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserFormSettings_UserId' AND object_id = OBJECT_ID('UserFormSettings'))
BEGIN
    PRINT 'UserId için index oluşturuluyor...'
    CREATE INDEX IX_UserFormSettings_UserId ON UserFormSettings(UserId)
    PRINT 'Index oluşturuldu.'
END
GO

-- 7. Son durumu göster
PRINT ''
PRINT '=== SON DURUM ==='
SELECT 
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.IS_NULLABLE,
    CASE 
        WHEN pk.COLUMN_NAME IS NOT NULL THEN 'PK'
        WHEN ix.COLUMN_NAME IS NOT NULL THEN 'IX'
        ELSE ''
    END as Constraint_Type
FROM INFORMATION_SCHEMA.COLUMNS c
LEFT JOIN (
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1
    AND TABLE_NAME = 'UserFormSettings'
) pk ON c.COLUMN_NAME = pk.COLUMN_NAME
LEFT JOIN (
    SELECT COL_NAME(ic.object_id, ic.column_id) AS COLUMN_NAME
    FROM sys.index_columns ic
    JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
    WHERE OBJECT_NAME(ic.object_id) = 'UserFormSettings' AND i.is_primary_key = 0
) ix ON c.COLUMN_NAME = ix.COLUMN_NAME
WHERE c.TABLE_NAME = 'UserFormSettings'
ORDER BY c.ORDINAL_POSITION

PRINT ''
PRINT '=== KULLANICI BAŞINA KAYIT SAYISI ==='
SELECT 
    UserId,
    COUNT(*) as KayitSayisi
FROM UserFormSettings
GROUP BY UserId
ORDER BY UserId

PRINT ''
PRINT 'İşlem tamamlandı!'