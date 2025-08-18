-- Global form alan ayarları için tablo oluştur

-- Eğer tablo varsa sil (geliştirme için)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FormFieldSettings]') AND type in (N'U'))
DROP TABLE [dbo].[FormFieldSettings]
GO

-- FormFieldSettings tablosu oluştur
CREATE TABLE [dbo].[FormFieldSettings](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [DialogName] [nvarchar](100) NOT NULL,  -- Örn: CustomerDialog
    [FieldName] [nvarchar](100) NOT NULL,   -- Örn: Firma Adı
    [IsRequired] [bit] NOT NULL DEFAULT(0), -- Zorunlu mu?
    [DisplayOrder] [int] NULL,               -- Sıralama
    [IsHidden] [bit] NOT NULL DEFAULT(0),   -- Gizli mi?
    [CreatedBy] [int] NULL,                 -- Kim oluşturdu (UserId)
    [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
    [ModifiedBy] [int] NULL,                -- Kim güncelledi (UserId)
    [ModifiedDate] [datetime] NULL,
    CONSTRAINT [PK_FormFieldSettings] PRIMARY KEY ([Id]),
    CONSTRAINT [UK_FormFieldSettings] UNIQUE ([DialogName], [FieldName])
)
GO

-- Index ekle performans için
CREATE INDEX [IX_FormFieldSettings_DialogName] ON [FormFieldSettings]([DialogName])
GO

-- Test verisi ekle
INSERT INTO [FormFieldSettings] ([DialogName], [FieldName], [IsRequired], [DisplayOrder], [CreatedBy])
VALUES 
    ('CustomerDialog', 'Müşteri Kodu', 0, 0, 1),
    ('CustomerDialog', 'Firma Adı', 1, 1, 1),        -- Zorunlu
    ('CustomerDialog', 'Temas Edilen Unvanı', 1, 2, 1), -- Zorunlu
    ('CustomerDialog', 'Müşteri Temsilcileri', 0, 3, 1),
    ('CustomerDialog', 'Temas Edilen Adı', 0, 4, 1);

PRINT 'FormFieldSettings tablosu oluşturuldu ve test verileri eklendi';

-- Tabloyu kontrol et
SELECT * FROM FormFieldSettings WHERE DialogName = 'CustomerDialog' ORDER BY DisplayOrder;