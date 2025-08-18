-- Test kullanıcısının durumunu detaylı kontrol et

DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';

PRINT '=== TEST KULLANICISI DETAY ===';
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    Source
FROM Users 
WHERE Username = 'test';

PRINT '';
PRINT '=== TEST KULLANICISININ ROLLERİ ===';
SELECT 
    ur.UserId,
    ur.RoleId,
    r.RoleName
FROM UserRoles ur
JOIN Roles r ON ur.RoleId = r.RoleId
WHERE ur.UserId = @TestUserId;

PRINT '';
PRINT '=== TEST KULLANICISI YETKİLERİ (UserPermissions) ===';
SELECT 
    PermissionKey,
    Granted
FROM UserPermissions
WHERE UserId = @TestUserId
ORDER BY PermissionKey;

PRINT '';
PRINT '=== KARŞILAŞTIRMA: ADMIN ROLLERİ ===';
SELECT 
    ur.UserId,
    ur.RoleId,
    r.RoleName
FROM UserRoles ur
JOIN Roles r ON ur.RoleId = r.RoleId
WHERE ur.UserId = (SELECT UserId FROM Users WHERE Username = 'admin');

PRINT '';
PRINT '=== KARŞILAŞTIRMA: ADMIN YETKİLERİ ===';
SELECT 
    PermissionKey,
    Granted
FROM UserPermissions
WHERE UserId = (SELECT UserId FROM Users WHERE Username = 'admin')
AND PermissionKey LIKE 'Northwind%'
ORDER BY PermissionKey;

PRINT '';
PRINT '=== TÜM NORTHWIND İÇEREN ROLLER ===';
SELECT 
    RoleId,
    RoleName
FROM Roles
WHERE RoleName LIKE '%North%' OR RoleName LIKE '%north%';

PRINT '';
PRINT '=== NORTHWIND ROL YETKİLERİ (RolePermissions) ===';
SELECT 
    rp.RoleId,
    r.RoleName,
    rp.PermissionKey
FROM RolePermissions rp
JOIN Roles r ON rp.RoleId = r.RoleId
WHERE rp.PermissionKey LIKE '%North%'
ORDER BY r.RoleName, rp.PermissionKey;