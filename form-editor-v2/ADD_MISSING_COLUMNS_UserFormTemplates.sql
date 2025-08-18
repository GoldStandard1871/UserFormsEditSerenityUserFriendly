-- UserFormTemplates tablosuna eksik kolonları ekleme
-- Tarih: 2025-08-13
-- UserFormEditorRow.cs dosyasındaki tanımlarla uyumlu hale getirmek için

USE [UserControlForm_Default_v1]
GO

-- Description kolonu ekle
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[UserFormTemplates]') AND name = 'Description')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates] 
    ADD [Description] nvarchar(500) NULL
    PRINT 'Description kolonu başarıyla eklendi.'
END
ELSE
BEGIN
    PRINT 'Description kolonu zaten mevcut.'
END
GO

-- Purpose kolonu ekle
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[UserFormTemplates]') AND name = 'Purpose')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates] 
    ADD [Purpose] nvarchar(1000) NULL
    PRINT 'Purpose kolonu başarıyla eklendi.'
END
ELSE
BEGIN
    PRINT 'Purpose kolonu zaten mevcut.'
END
GO

-- Instructions kolonu ekle
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[UserFormTemplates]') AND name = 'Instructions')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates] 
    ADD [Instructions] nvarchar(2000) NULL
    PRINT 'Instructions kolonu başarıyla eklendi.'
END
ELSE
BEGIN
    PRINT 'Instructions kolonu zaten mevcut.'
END
GO

-- Tablo yapısını kontrol et
SELECT 
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS c
WHERE c.TABLE_NAME = 'UserFormTemplates'
ORDER BY c.ORDINAL_POSITION

PRINT ''
PRINT 'UserFormTemplates tablosu güncellendi.'
PRINT 'Şimdi UserFormEditor modülünü kullanabilirsiniz.'