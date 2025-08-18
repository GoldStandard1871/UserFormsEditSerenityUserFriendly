-- UserPreferences tablosunda GlobalFieldSettings kayıtlarını kontrol et

-- Tüm GlobalFieldSettings kayıtlarını göster
PRINT '=== TÜM GLOBAL FIELD SETTINGS ===';
SELECT 
    PreferenceId,
    UserId,
    PreferenceType,
    Name,
    SUBSTRING(Value, 1, 200) as ValuePreview
FROM UserPreferences
WHERE Name LIKE '%GlobalFieldSettings%'
ORDER BY PreferenceId DESC;

-- CustomerDialog için global ayarları göster
PRINT '';
PRINT '=== CUSTOMER DIALOG GLOBAL SETTINGS ===';
SELECT 
    PreferenceId,
    UserId,
    Name,
    Value
FROM UserPreferences
WHERE Name = 'GlobalFieldSettings_CustomerDialog';

-- Test için veri ekle (eğer yoksa)
IF NOT EXISTS (SELECT * FROM UserPreferences WHERE Name = 'GlobalFieldSettings_CustomerDialog')
BEGIN
    INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
    VALUES (
        0, -- UserId 0 = Global (tüm kullanıcılar için)
        'UserFormDesign',
        'GlobalFieldSettings_CustomerDialog',
        '{"requiredFields":["Firma Adı","Müşteri Kodu","Temas Edilen Unvanı"],"savedAt":"2024-01-15T10:00:00","savedBy":"admin"}'
    );
    PRINT 'Test verisi eklendi';
END
ELSE
BEGIN
    -- Mevcut veriyi güncelle
    UPDATE UserPreferences
    SET Value = '{"requiredFields":["Firma Adı","Müşteri Kodu","Temas Edilen Unvanı"],"savedAt":"2024-01-15T10:00:00","savedBy":"admin"}'
    WHERE Name = 'GlobalFieldSettings_CustomerDialog';
    PRINT 'Mevcut veri güncellendi';
END

-- Tekrar kontrol et
PRINT '';
PRINT '=== SONUÇ ===';
SELECT 
    'Global Settings' as Type,
    PreferenceId,
    UserId,
    Name,
    Value
FROM UserPreferences
WHERE Name = 'GlobalFieldSettings_CustomerDialog';