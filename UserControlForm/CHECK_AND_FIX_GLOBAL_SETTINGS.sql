-- Global ayarların veritabanında olduğundan emin ol

-- 1. Mevcut durumu kontrol et
PRINT '=== MEVCUT GLOBAL AYARLAR KONTROLÜ ===';
SELECT 
    UserPreferenceId,
    UserId,
    PreferenceType,
    Name,
    Value
FROM UserPreferences
WHERE UserId = 0;

-- Eğer boşsa, ekle
IF NOT EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = 0 AND Name = 'GlobalFieldSettings_CustomerDialog')
BEGIN
    PRINT '';
    PRINT '=== GLOBAL AYAR BULUNAMADI, EKLENİYOR ===';
    
    INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
    VALUES (
        0,  -- Global setting
        'UserFormDesign',
        'GlobalFieldSettings_CustomerDialog',
        '{"requiredFields":["Firma Adı","Müşteri Kodu","Temas Edilen Unvanı"],"savedAt":"2025-01-15T10:00:00","savedBy":"admin"}'
    );
    
    PRINT '✅ Global ayarlar eklendi!';
END
ELSE
BEGIN
    PRINT '';
    PRINT '✅ Global ayarlar zaten mevcut!';
END;

-- 2. Sonucu göster
PRINT '';
PRINT '=== SONUÇ ===';
SELECT 
    'Global Settings' as Type,
    Name,
    Value
FROM UserPreferences
WHERE UserId = 0 
    AND Name = 'GlobalFieldSettings_CustomerDialog';

PRINT '';
PRINT 'Bu ayarlar tüm kullanıcılar için geçerli olmalı!';
PRINT 'Zorunlu alanlar: Firma Adı, Müşteri Kodu, Temas Edilen Unvanı';