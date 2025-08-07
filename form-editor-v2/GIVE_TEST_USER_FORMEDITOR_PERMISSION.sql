-- Test kullanıcısına FormEditor yetkilerini ver
-- =============================================

-- 1. Önce test kullanıcısının ID'sini kontrol edelim
SELECT UserId, Username, DisplayName FROM Users WHERE Username = 'test';

-- 2. FormEditor yetkilerini ekleyelim (eğer yoksa)
-- FormEditor:View yetkisi
IF NOT EXISTS (SELECT 1 FROM UserPermissions WHERE UserId = (SELECT UserId FROM Users WHERE Username = 'test') AND PermissionKey = 'FormEditor:View')
BEGIN
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
    VALUES ((SELECT UserId FROM Users WHERE Username = 'test'), 'FormEditor:View', 1);
    PRINT 'FormEditor:View yetkisi eklendi';
END
ELSE
BEGIN
    UPDATE UserPermissions 
    SET Granted = 1
    WHERE UserId = (SELECT UserId FROM Users WHERE Username = 'test') 
    AND PermissionKey = 'FormEditor:View';
    PRINT 'FormEditor:View yetkisi güncellendi';
END

-- FormEditor:Edit yetkisi (sadece görüntüleme için gerekli değil ama ekleyelim)
IF NOT EXISTS (SELECT 1 FROM UserPermissions WHERE UserId = (SELECT UserId FROM Users WHERE Username = 'test') AND PermissionKey = 'FormEditor:Edit')
BEGIN
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
    VALUES ((SELECT UserId FROM Users WHERE Username = 'test'), 'FormEditor:Edit', 1);
    PRINT 'FormEditor:Edit yetkisi eklendi';
END
ELSE
BEGIN
    UPDATE UserPermissions 
    SET Granted = 1
    WHERE UserId = (SELECT UserId FROM Users WHERE Username = 'test') 
    AND PermissionKey = 'FormEditor:Edit';
    PRINT 'FormEditor:Edit yetkisi güncellendi';
END

-- 3. Test kullanıcısının tüm yetkilerini kontrol edelim
SELECT 
    u.Username,
    up.PermissionKey,
    up.Granted
FROM Users u
LEFT JOIN UserPermissions up ON u.UserId = up.UserId
WHERE u.Username = 'test'
ORDER BY up.PermissionKey;

-- 4. Role tabanlı yetkilendirme için (opsiyonel)
-- Test kullanıcısına bir rol atayalım
DECLARE @TestUserId INT = (SELECT UserId FROM Users WHERE Username = 'test');
DECLARE @UserRoleId INT;

-- User rolü varsa onu kullanalım, yoksa oluşturalım
IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = 'User')
BEGIN
    INSERT INTO Roles (RoleName) VALUES ('User');
END

SET @UserRoleId = (SELECT RoleId FROM Roles WHERE RoleName = 'User');

-- Test kullanıcısını User rolüne ekleyelim
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @TestUserId AND RoleId = @UserRoleId)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId)
    VALUES (@TestUserId, @UserRoleId);
    PRINT 'Test kullanıcısı User rolüne eklendi';
END

-- Role FormEditor yetkilerini verelim
IF NOT EXISTS (SELECT 1 FROM RolePermissions WHERE RoleId = @UserRoleId AND PermissionKey = 'FormEditor:View')
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionKey)
    VALUES (@UserRoleId, 'FormEditor:View');
    PRINT 'User rolüne FormEditor:View yetkisi eklendi';
END

IF NOT EXISTS (SELECT 1 FROM RolePermissions WHERE RoleId = @UserRoleId AND PermissionKey = 'FormEditor:Edit')
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionKey)
    VALUES (@UserRoleId, 'FormEditor:Edit');
    PRINT 'User rolüne FormEditor:Edit yetkisi eklendi';
END

-- 5. Sonuçları kontrol et
PRINT '';
PRINT '=== TEST KULLANICISI YETKİ DURUMU ===';
SELECT 
    'Direkt Yetki' as YetkiTipi,
    PermissionKey,
    CASE Granted WHEN 1 THEN 'Verildi' ELSE 'Reddedildi' END as Durum
FROM UserPermissions 
WHERE UserId = @TestUserId
AND PermissionKey LIKE 'FormEditor%'

UNION ALL

SELECT 
    'Rol Yetkisi' as YetkiTipi,
    rp.PermissionKey,
    'Verildi' as Durum
FROM UserRoles ur
JOIN RolePermissions rp ON ur.RoleId = rp.RoleId
WHERE ur.UserId = @TestUserId
AND rp.PermissionKey LIKE 'FormEditor%';