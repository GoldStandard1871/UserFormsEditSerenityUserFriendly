-- Global Form Settings tablosu oluştur
-- Bu tablo tüm kullanıcılar için geçerli olan ayarları tutar (zorunlu alanlar gibi)
-- ====================================================================

-- 1. Tablo yoksa oluştur
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'GlobalFormSettings')
BEGIN
    CREATE TABLE [dbo].[GlobalFormSettings] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [SettingKey] NVARCHAR(100) NOT NULL,     -- Ayar anahtarı (örn: 'RequiredFields')
        [SettingValue] NVARCHAR(MAX) NOT NULL,   -- JSON formatında ayar değeri
        [InsertDate] DATETIME NOT NULL,
        [InsertUserId] INT NOT NULL,
        [UpdateDate] DATETIME NULL,
        [UpdateUserId] INT NULL
    )
    
    -- Unique index ekle (her ayar anahtarı tek olmalı)
    CREATE UNIQUE INDEX IX_GlobalFormSettings_SettingKey ON GlobalFormSettings(SettingKey)
    
    PRINT 'GlobalFormSettings tablosu oluşturuldu.'
END
ELSE
BEGIN
    PRINT 'GlobalFormSettings tablosu zaten mevcut.'
END
GO

-- 2. İlk kayıt olarak boş zorunlu alanlar ekle
IF NOT EXISTS (SELECT * FROM GlobalFormSettings WHERE SettingKey = 'RequiredFields')
BEGIN
    INSERT INTO GlobalFormSettings (SettingKey, SettingValue, InsertDate, InsertUserId)
    VALUES ('RequiredFields', '[]', GETDATE(), 1)
    
    PRINT 'RequiredFields kaydı eklendi.'
END
GO

-- 3. Test için veri göster
SELECT * FROM GlobalFormSettings
GO

PRINT 'Script tamamlandı!'