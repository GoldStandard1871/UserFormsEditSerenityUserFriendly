-- Test kullanıcısına FormEditor yetkileri verme - BASİT VERSİYON
-- ============================================================

-- 1. Test kullanıcısını kontrol et
SELECT UserId, Username, DisplayName 
FROM Users 
WHERE Username = 'test';

-- 2. Test kullanıcısının UserId'sini al (genelde 2'dir)
-- Eğer yukarıdaki sorgu farklı bir ID döndürdüyse, aşağıdaki 2'yi o ID ile değiştirin
DECLARE @TestUserId INT = 2;  -- Test kullanıcısının ID'si

-- 3. Mevcut yetkileri kontrol et
SELECT * FROM UserPermissions WHERE UserId = @TestUserId;

-- 4. FormEditor:View yetkisi ekle
INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
VALUES (@TestUserId, 'FormEditor:View', 1);

-- 5. FormEditor:Edit yetkisi ekle  
INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
VALUES (@TestUserId, 'FormEditor:Edit', 1);

-- 6. Sonuçları kontrol et
SELECT 
    u.UserId,
    u.Username,
    up.PermissionKey,
    up.Granted
FROM Users u
LEFT JOIN UserPermissions up ON u.UserId = up.UserId
WHERE u.Username = 'test'
ORDER BY up.PermissionKey;

PRINT 'Yetkiler başarıyla eklendi!';
PRINT 'Uygulamayı yeniden başlatın ve test kullanıcısı ile giriş yapın.';