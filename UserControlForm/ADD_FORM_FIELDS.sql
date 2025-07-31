-- UserFormTemplates tablosuna yeni alanlar eklemek için
-- Tarih: 2025-07-25

USE [UserControlForm_Default_v1]
GO

-- Description alanını ekle
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[UserFormTemplates]') AND name = 'Description')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates]
    ADD [Description] [nvarchar](500) NULL
    PRINT 'Description alanı eklendi.'
END

-- Purpose alanını ekle
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[UserFormTemplates]') AND name = 'Purpose')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates]
    ADD [Purpose] [nvarchar](1000) NULL
    PRINT 'Purpose alanı eklendi.'
END

-- Instructions alanını ekle
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[UserFormTemplates]') AND name = 'Instructions')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates]
    ADD [Instructions] [nvarchar](2000) NULL
    PRINT 'Instructions alanı eklendi.'
END

PRINT 'Yeni alanlar başarıyla eklendi!'