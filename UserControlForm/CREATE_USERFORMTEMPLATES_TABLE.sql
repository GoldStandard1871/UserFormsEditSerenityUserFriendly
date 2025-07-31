-- UserFormTemplates Tablosu Oluşturma Script'i
-- Tarih: 2025-07-25
-- Bu script'i SQL Server Management Studio'da çalıştırın

USE [UserControlForm_Default_v1]
GO

-- Tablo zaten varsa uyarı ver
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'UserFormTemplates')
BEGIN
    PRINT 'UserFormTemplates tablosu zaten mevcut!'
END
ELSE
BEGIN
    -- UserFormTemplates tablosunu oluştur
    CREATE TABLE [dbo].[UserFormTemplates](
        [TemplateId] [int] IDENTITY(1,1) NOT NULL,
        [FormName] [nvarchar](200) NOT NULL,
        [FormDesign] [nvarchar](max) NOT NULL,
        [CreatedBy] [int] NULL,
        [CreatedDate] [datetime] NULL,
        [ModifiedBy] [int] NULL,
        [ModifiedDate] [datetime] NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        CONSTRAINT [PK_UserFormTemplates] PRIMARY KEY CLUSTERED ([TemplateId] ASC)
    )
    
    PRINT 'UserFormTemplates tablosu başarıyla oluşturuldu.'
END
GO

-- FormName için unique index oluştur
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserFormTemplates_FormName')
BEGIN
    CREATE UNIQUE INDEX [IX_UserFormTemplates_FormName] ON [dbo].[UserFormTemplates] ([FormName] ASC)
    PRINT 'IX_UserFormTemplates_FormName index başarıyla oluşturuldu.'
END
GO

-- Foreign key constraint'leri ekle
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_UserFormTemplates_CreatedBy')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates] ADD CONSTRAINT [FK_UserFormTemplates_CreatedBy] 
        FOREIGN KEY([CreatedBy]) REFERENCES [dbo].[Users] ([UserId])
    PRINT 'FK_UserFormTemplates_CreatedBy constraint başarıyla oluşturuldu.'
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_UserFormTemplates_ModifiedBy')
BEGIN
    ALTER TABLE [dbo].[UserFormTemplates] ADD CONSTRAINT [FK_UserFormTemplates_ModifiedBy] 
        FOREIGN KEY([ModifiedBy]) REFERENCES [dbo].[Users] ([UserId])
    PRINT 'FK_UserFormTemplates_ModifiedBy constraint başarıyla oluşturuldu.'
END
GO

-- UserPreferences tablosunun varlığını kontrol et
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserPreferences')
BEGIN
    PRINT 'UYARI: UserPreferences tablosu bulunamadı! Bu tablo kullanıcıya özel ayarlar için gereklidir.'
END
ELSE
BEGIN
    PRINT 'UserPreferences tablosu mevcut. Kullanıcıya özel form tasarımları bu tabloda saklanacak.'
    PRINT 'PreferenceType: UserFormDesign'
    PRINT 'Name: Form anahtarı (örn: GridSettings:Admin/UserForm)'
    PRINT 'Value: JSON formatında form tasarımı'
END
GO

PRINT ''
PRINT 'Migration tamamlandı!'
PRINT 'Projeyi şimdi çalıştırabilirsiniz: dotnet run'