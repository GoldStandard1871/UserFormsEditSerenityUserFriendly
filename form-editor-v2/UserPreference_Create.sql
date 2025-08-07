-- UserPreference tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS UserPreference (
    UserPreferenceId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PreferenceType NVARCHAR(100) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Value NVARCHAR(MAX),
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedDate DATETIME NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Index ekle
CREATE INDEX IX_UserPreference_UserId ON UserPreference(UserId);
CREATE INDEX IX_UserPreference_PreferenceType ON UserPreference(PreferenceType);
CREATE INDEX IX_UserPreference_Name ON UserPreference(Name);

-- Form Editor V2 için örnek preference kayıtları
/*
INSERT INTO UserPreference (UserId, PreferenceType, Name, Value) VALUES
(1, 'FormEditorV2', 'WidthMode', 'normal'),
(1, 'FormEditorV2', 'ShowWidthControls', 'true'),
(1, 'FormEditorV2', 'Field_f1_Hidden', 'false'),
(1, 'FormEditorV2', 'Field_f1_Width', '50'),
(1, 'FormEditorV2', 'Field_f2_Hidden', 'true'),
(1, 'FormEditorV2', 'Field_f2_Width', '75');
*/