-- UserFormSettings tablosundaki kayıtları görüntüle
SELECT TOP 10
    Id,
    UserId,
    LEFT(Settings, 500) as SettingsPreview, -- İlk 500 karakter
    InsertDate,
    InsertUserId,
    UpdateDate,
    UpdateUserId
FROM UserFormSettings
ORDER BY UpdateDate DESC, InsertDate DESC;

-- Belirli bir kullanıcının tam ayarlarını görüntüle
-- UserId'yi kendi kullanıcı ID'niz ile değiştirin
/*
SELECT 
    Id,
    UserId,
    Settings,
    InsertDate,
    UpdateDate
FROM UserFormSettings
WHERE UserId = 1; -- Kullanıcı ID'sini değiştirin
*/

-- JSON ayarlarını parse etmek için (SQL Server 2016+)
/*
SELECT 
    Id,
    UserId,
    JSON_VALUE(Settings, '$.layoutSettings.widthMode') as WidthMode,
    JSON_VALUE(Settings, '$.layoutSettings.showWidthControls') as ShowWidthControls,
    JSON_QUERY(Settings, '$.layoutSettings.formOrder') as FormOrder,
    JSON_QUERY(Settings, '$.fieldSettings') as FieldSettings,
    InsertDate,
    UpdateDate
FROM UserFormSettings
WHERE UserId = 1;
*/

-- Gizlenen alan sayısını kontrol et
/*
SELECT 
    UserId,
    LEN(Settings) - LEN(REPLACE(Settings, '"hidden":true', '')) as HiddenFieldCount,
    UpdateDate
FROM UserFormSettings
WHERE Settings LIKE '%"hidden":true%'
ORDER BY UpdateDate DESC;
*/