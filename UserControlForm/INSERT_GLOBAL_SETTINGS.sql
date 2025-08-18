-- Global form ayarlarını UserPreferences tablosuna ekle
-- UserId = 0 global ayar demektir (tüm kullanıcılar için geçerli)

-- Önce mevcut global ayarları kontrol et
PRINT '=== MEVCUT GLOBAL AYARLAR ==='
SELECT 
    UserPreferenceId,
    UserId,
    PreferenceType,
    Name,
    SUBSTRING(Value, 1, 200) as ValuePreview
FROM UserPreferences
WHERE UserId = 0 
    AND PreferenceType = 'UserFormDesign'
    AND Name LIKE 'GlobalFieldSettings_%'
ORDER BY UserPreferenceId DESC;

-- CustomerDialog için global zorunlu alan ayarları ekle/güncelle
DECLARE @globalKey NVARCHAR(100) = 'GlobalFieldSettings_CustomerDialog';
DECLARE @globalSettings NVARCHAR(MAX) = '{"requiredFields":["Firma Adı","Müşteri Kodu","Temas Edilen Unvanı"],"savedAt":"' + CONVERT(NVARCHAR, GETDATE(), 126) + '","savedBy":"admin"}';

IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = 0 AND PreferenceType = 'UserFormDesign' AND Name = @globalKey)
BEGIN
    -- Güncelle
    UPDATE UserPreferences
    SET Value = @globalSettings
    WHERE UserId = 0 AND PreferenceType = 'UserFormDesign' AND Name = @globalKey;
    
    PRINT 'Global ayarlar güncellendi: ' + @globalKey;
END
ELSE
BEGIN
    -- Yeni ekle
    INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
    VALUES (0, 'UserFormDesign', @globalKey, @globalSettings);
    
    PRINT 'Global ayarlar eklendi: ' + @globalKey;
END

-- Sonucu kontrol et
PRINT '';
PRINT '=== SONUÇ ==='
SELECT 
    'Global Settings' as Type,
    UserPreferenceId,
    UserId,
    Name,
    Value
FROM UserPreferences
WHERE UserId = 0 
    AND PreferenceType = 'UserFormDesign'
    AND Name = @globalKey;

-- Test için farklı dialog'lara da örnek ekleyelim
DECLARE @productKey NVARCHAR(100) = 'GlobalFieldSettings_ProductDialog';
DECLARE @productSettings NVARCHAR(MAX) = '{"requiredFields":["Ürün Adı","Ürün Kodu","Birim Fiyat"],"savedAt":"' + CONVERT(NVARCHAR, GETDATE(), 126) + '","savedBy":"admin"}';

IF NOT EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = 0 AND PreferenceType = 'UserFormDesign' AND Name = @productKey)
BEGIN
    INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
    VALUES (0, 'UserFormDesign', @productKey, @productSettings);
    PRINT 'Product dialog için global ayarlar eklendi';
END

PRINT '';
PRINT '=== TÜM GLOBAL AYARLAR ==='
SELECT 
    Name,
    Value
FROM UserPreferences
WHERE UserId = 0 
    AND PreferenceType = 'UserFormDesign'
    AND Name LIKE 'GlobalFieldSettings_%';