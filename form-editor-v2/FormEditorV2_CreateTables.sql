-- FormEditorV2 tablosu
CREATE TABLE IF NOT EXISTS FormEditorV2 (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FormName NVARCHAR(200) NOT NULL,
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);

-- UserFormSettings tablosu
CREATE TABLE IF NOT EXISTS UserFormSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Settings NVARCHAR(MAX) NOT NULL,
    InsertDate DATETIME NOT NULL,
    InsertUserId INT NOT NULL,
    UpdateDate DATETIME NULL,
    UpdateUserId INT NULL,
    CONSTRAINT UQ_UserFormSettings_UserId UNIQUE (UserId)
);

-- Örnek form verileri
INSERT INTO FormEditorV2 (FormName, DisplayOrder, IsActive) VALUES
('Müşteri Bilgileri', 1, 1),
('İletişim Bilgileri', 2, 1),
('Adres Bilgileri', 3, 1),
('Finansal Bilgiler', 4, 1),
('Notlar ve Açıklamalar', 5, 1);