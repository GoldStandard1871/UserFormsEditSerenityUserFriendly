-- UserPreference tablosu (Form Editor V2 için güncellenmiş versiyon)
-- Bu tablo artık tüm form ayarlarını saklayacak

-- Eğer tablo yoksa oluştur
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserPreference]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserPreference](
        [UserPreferenceId] [int] IDENTITY(1,1) NOT NULL,
        [UserId] [int] NOT NULL,
        [PreferenceType] [nvarchar](100) NOT NULL,
        [Name] [nvarchar](200) NOT NULL,
        [Value] [nvarchar](max) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT (GETDATE()),
        [ModifiedDate] [datetime] NULL,
        [IsActive] [bit] NOT NULL DEFAULT (1),
        CONSTRAINT [PK_UserPreference] PRIMARY KEY CLUSTERED ([UserPreferenceId] ASC)
    )
END

-- Index'leri ekle
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreference_UserId')
    CREATE INDEX IX_UserPreference_UserId ON UserPreference(UserId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreference_PreferenceType')
    CREATE INDEX IX_UserPreference_PreferenceType ON UserPreference(PreferenceType);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreference_Name')
    CREATE INDEX IX_UserPreference_Name ON UserPreference(Name);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreference_IsActive')
    CREATE INDEX IX_UserPreference_IsActive ON UserPreference(IsActive);

-- Composite index for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserPreference_Composite')
    CREATE INDEX IX_UserPreference_Composite ON UserPreference(UserId, PreferenceType, Name, IsActive);

GO

-- Form Editor V2 için örnek kullanım
/*

-- Kullanıcı ayarları kaydetme örneği:
-- Layout ayarları
INSERT INTO UserPreference (UserId, PreferenceType, Name, Value) VALUES
(1, 'FormEditorV2', 'WidthMode', 'normal'),
(1, 'FormEditorV2', 'ShowWidthControls', 'true'),
(1, 'FormEditorV2', 'FormOrder', '["form1", "form2", "form3"]');

-- Field ayarları
INSERT INTO UserPreference (UserId, PreferenceType, Name, Value) VALUES
(1, 'FormEditorV2', 'Field_f1_Hidden', 'false'),
(1, 'FormEditorV2', 'Field_f1_Width', '50'),
(1, 'FormEditorV2', 'Field_f1_Required', 'true'),
(1, 'FormEditorV2', 'Field_f2_Hidden', 'true'),
(1, 'FormEditorV2', 'Field_f2_Width', '75');

-- Tüm ayarları JSON olarak saklama
INSERT INTO UserPreference (UserId, PreferenceType, Name, Value) VALUES
(1, 'FormEditorV2', 'AllSettings', '{"layoutSettings":{"widthMode":"normal","showWidthControls":true},"fieldSettings":[{"fieldId":"f1","hidden":false,"width":50}]}');

*/

-- Kullanıcı ayarlarını görüntüleme
/*
SELECT 
    UserPreferenceId,
    UserId,
    Name,
    Value,
    CreatedDate,
    ModifiedDate,
    IsActive
FROM UserPreference
WHERE PreferenceType = 'FormEditorV2'
    AND UserId = 1
    AND IsActive = 1
ORDER BY Name;
*/