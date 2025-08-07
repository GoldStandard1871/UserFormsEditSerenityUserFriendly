-- UserControlForm_Default_v1 veritabanı için UserPreferences tablosu
-- Form Editor V2 ayarlarını saklayacak

USE [UserControlForm_Default_v1]
GO

-- Eğer tablo yoksa oluştur
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserPreferences]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserPreferences](
        [UserPreferenceId] [int] IDENTITY(1,1) NOT NULL,
        [UserId] [int] NOT NULL,
        [PreferenceType] [nvarchar](100) NOT NULL,
        [Name] [nvarchar](200) NOT NULL,
        [Value] [nvarchar](max) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT (GETDATE()),
        [ModifiedDate] [datetime] NULL,
        [IsActive] [bit] NOT NULL DEFAULT (1),
        CONSTRAINT [PK_UserPreferences] PRIMARY KEY CLUSTERED ([UserPreferenceId] ASC)
    )
    PRINT 'UserPreferences tablosu oluşturuldu.'
END
ELSE
BEGIN
    PRINT 'UserPreferences tablosu zaten mevcut.'
END
GO

-- Index'leri ekle
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreferences_UserId' AND object_id = OBJECT_ID('dbo.UserPreferences'))
BEGIN
    CREATE INDEX IX_UserPreferences_UserId ON UserPreferences(UserId);
    PRINT 'IX_UserPreferences_UserId index oluşturuldu.'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreferences_PreferenceType' AND object_id = OBJECT_ID('dbo.UserPreferences'))
BEGIN
    CREATE INDEX IX_UserPreferences_PreferenceType ON UserPreferences(PreferenceType);
    PRINT 'IX_UserPreferences_PreferenceType index oluşturuldu.'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreferences_Name' AND object_id = OBJECT_ID('dbo.UserPreferences'))
BEGIN
    CREATE INDEX IX_UserPreferences_Name ON UserPreferences(Name);
    PRINT 'IX_UserPreferences_Name index oluşturuldu.'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreferences_IsActive' AND object_id = OBJECT_ID('dbo.UserPreferences'))
BEGIN
    CREATE INDEX IX_UserPreferences_IsActive ON UserPreferences(IsActive);
    PRINT 'IX_UserPreferences_IsActive index oluşturuldu.'
END

-- Composite index for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreferences_Composite' AND object_id = OBJECT_ID('dbo.UserPreferences'))
BEGIN
    CREATE INDEX IX_UserPreferences_Composite ON UserPreferences(UserId, PreferenceType, Name, IsActive);
    PRINT 'IX_UserPreferences_Composite index oluşturuldu.'
END
GO

-- Tablo yapısını kontrol et
PRINT ''
PRINT 'UserPreferences Tablo Yapısı:'
PRINT '============================='
SELECT 
    COLUMN_NAME as [Kolon Adı],
    DATA_TYPE as [Veri Tipi],
    CHARACTER_MAXIMUM_LENGTH as [Max Uzunluk],
    IS_NULLABLE as [Null Olabilir],
    COLUMN_DEFAULT as [Varsayılan Değer]
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'UserPreferences'
    AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;

-- Mevcut kayıt sayısını göster
DECLARE @RecordCount INT = (SELECT COUNT(*) FROM dbo.UserPreferences WHERE PreferenceType = 'FormEditorV2');
PRINT ''
PRINT 'Mevcut FormEditorV2 kayıt sayısı: ' + CAST(@RecordCount AS VARCHAR);
GO