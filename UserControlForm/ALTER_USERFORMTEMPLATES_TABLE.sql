-- UserFormTemplates tablosunda FormDesign kolonunu nullable yapmak için
-- Tarih: 2025-07-25

USE [UserControlForm_Default_v1]
GO

-- FormDesign kolonunu nullable yap
ALTER TABLE [dbo].[UserFormTemplates]
ALTER COLUMN [FormDesign] [nvarchar](max) NULL
GO

-- Mevcut NULL kayıtlar için varsayılan değer ekle (eğer varsa)
UPDATE [dbo].[UserFormTemplates]
SET [FormDesign] = '{"fields":[]}'
WHERE [FormDesign] IS NULL
GO

PRINT 'FormDesign kolonu başarıyla güncellendi ve NULL değer kabul edebilir hale getirildi.'