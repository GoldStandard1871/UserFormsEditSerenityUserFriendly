-- Field Customization System Tables
-- Bu script ile field özelleştirme sistemi için gerekli tabloları oluşturuyoruz

-- 1. Admin tarafından belirlenen zorunlu alanlar tablosu
CREATE TABLE [dbo].[AdminRequiredFields] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [DialogName] NVARCHAR(100) NOT NULL,
    [FieldName] NVARCHAR(100) NOT NULL,
    [IsRequired] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [CreatedBy] INT NOT NULL,
    [UpdatedDate] DATETIME NULL,
    [UpdatedBy] INT NULL,
    CONSTRAINT UK_AdminRequiredFields UNIQUE([DialogName], [FieldName])
);

-- 2. Kullanıcıya özel field ayarları tablosu
CREATE TABLE [dbo].[UserFieldSettings] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [DialogName] NVARCHAR(100) NOT NULL,
    [FieldName] NVARCHAR(100) NOT NULL,
    [IsVisible] BIT NOT NULL DEFAULT 1,
    [DisplayOrder] INT NOT NULL DEFAULT 0,
    [CreatedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [UpdatedDate] DATETIME NULL,
    CONSTRAINT UK_UserFieldSettings UNIQUE([UserId], [DialogName], [FieldName])
);

-- Indexler
CREATE INDEX IX_AdminRequiredFields_DialogName ON AdminRequiredFields(DialogName);
CREATE INDEX IX_UserFieldSettings_UserId_DialogName ON UserFieldSettings(UserId, DialogName);

-- Test verileri (opsiyonel)
/*
INSERT INTO AdminRequiredFields (DialogName, FieldName, IsRequired, CreatedBy)
VALUES 
    ('CustomerDialog', 'CustomerID', 1, 1),
    ('CustomerDialog', 'CompanyName', 1, 1),
    ('CustomerDialog', 'ContactTitle', 1, 1);
*/