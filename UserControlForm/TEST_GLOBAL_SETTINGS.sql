-- Global zorunlu alan ayarlarını doğrudan veritabanına ekle
-- Bu script'i çalıştırıp test edin

-- Önce mevcut kayıtları kontrol et
PRINT '=== MEVCUT GLOBAL AYARLAR ==='
SELECT 
    UserPreferenceId,
    UserId,
    PreferenceType,
    Name,
    Value
FROM UserPreferences
WHERE UserId = 0 
    AND Name LIKE '%GlobalFieldSettings%'
ORDER BY UserPreferenceId DESC;

-- Eski kayıtları temizle
DELETE FROM UserPreferences 
WHERE UserId = 0 
    AND Name = 'GlobalFieldSettings_CustomerDialog';

-- Yeni global ayar ekle
INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
VALUES (
    0,  -- UserId = 0 means global setting
    'UserFormDesign',
    'GlobalFieldSettings_CustomerDialog',
    '{"requiredFields":["Firma Adı","Müşteri Kodu","Temas Edilen Unvanı"],"savedAt":"2025-01-15T10:00:00","savedBy":"admin"}'
);

PRINT 'Global zorunlu alan ayarları eklendi!'
PRINT ''

-- Sonucu kontrol et
PRINT '=== EKLENEN KAYIT ==='
SELECT 
    UserPreferenceId,
    UserId,
    Name,
    Value
FROM UserPreferences
WHERE UserId = 0 
    AND Name = 'GlobalFieldSettings_CustomerDialog';

-- Test kullanıcısının görebilmesi için kontrol
PRINT ''
PRINT '=== TEST İÇİN KONTROL ==='
PRINT 'UserId=0 olan bu kayıt tüm kullanıcılar tarafından okunabilir olmalı'
PRINT 'Zorunlu alanlar: Firma Adı, Müşteri Kodu, Temas Edilen Unvanı'