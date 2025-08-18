-- Zorunlu alanları kesin olarak ekle

-- Önce temizle
DELETE FROM UserPreferences 
WHERE UserId = 0 AND Name = 'GlobalFieldSettings_CustomerDialog';

-- Yeni ekle
INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
VALUES (
    0,  -- Global (tüm kullanıcılar için)
    'UserFormDesign',
    'GlobalFieldSettings_CustomerDialog',
    '{"requiredFields":["Firma Adı","Müşteri Kodu","Temas Edilen Unvanı"],"savedAt":"2025-01-15T10:00:00","savedBy":"admin"}'
);

-- Kontrol
SELECT * FROM UserPreferences 
WHERE UserId = 0 AND Name = 'GlobalFieldSettings_CustomerDialog';

PRINT 'Global zorunlu alanlar eklendi!';
PRINT 'Zorunlu: Firma Adı, Müşteri Kodu, Temas Edilen Unvanı';