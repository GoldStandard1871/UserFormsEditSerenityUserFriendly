-- Test kullanıcısına admin ile aynı rolleri ve yetkileri ver

-- Kullanıcı ID'lerini al
DECLARE @TestUserId INT;
DECLARE @AdminUserId INT;

SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';
SELECT @AdminUserId = UserId FROM Users WHERE Username = 'admin';

IF @TestUserId IS NULL
BEGIN
    PRINT 'HATA: Test kullanıcısı bulunamadı!';
    RETURN;
END

IF @AdminUserId IS NULL
BEGIN
    PRINT 'HATA: Admin kullanıcısı bulunamadı!';
    RETURN;
END

PRINT 'Test User ID: ' + CAST(@TestUserId AS VARCHAR(10));
PRINT 'Admin User ID: ' + CAST(@AdminUserId AS VARCHAR(10));

-- Önce test kullanıcısının mevcut rollerini temizle
DELETE FROM UserRoles WHERE UserId = @TestUserId;
PRINT 'Test kullanıcısının eski rolleri temizlendi';

-- Admin'in tüm rollerini test kullanıcısına kopyala
INSERT INTO UserRoles (UserId, RoleId)
SELECT @TestUserId, RoleId
FROM UserRoles
WHERE UserId = @AdminUserId;

PRINT 'Admin rolleri test kullanıcısına kopyalandı';

-- Önce test kullanıcısının mevcut yetkilerini temizle
DELETE FROM UserPermissions WHERE UserId = @TestUserId;
PRINT 'Test kullanıcısının eski yetkileri temizlendi';

-- Admin'in tüm yetkilerini test kullanıcısına kopyala
INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
SELECT @TestUserId, PermissionKey, Granted
FROM UserPermissions
WHERE UserId = @AdminUserId;

PRINT 'Admin yetkileri test kullanıcısına kopyalandı';

-- Ek olarak Northwind yetkilerini manuel ekle (emin olmak için)
IF NOT EXISTS (SELECT * FROM UserPermissions WHERE UserId = @TestUserId AND PermissionKey = 'Northwind')
BEGIN
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES
        (@TestUserId, 'Northwind', 1),
        (@TestUserId, 'Northwind:General', 1),
        (@TestUserId, 'Northwind:Customer', 1),
        (@TestUserId, 'Northwind:Customer:View', 1),
        (@TestUserId, 'Northwind:Customer:Modify', 1),
        (@TestUserId, 'Northwind:Customer:Delete', 1),
        (@TestUserId, 'Northwind:Product', 1),
        (@TestUserId, 'Northwind:Product:View', 1),
        (@TestUserId, 'Northwind:Product:Modify', 1),
        (@TestUserId, 'Northwind:Order', 1),
        (@TestUserId, 'Northwind:Order:View', 1),
        (@TestUserId, 'Northwind:Order:Modify', 1);
    
    PRINT 'Northwind yetkileri manuel olarak eklendi';
END

-- Sonuçları kontrol et
PRINT '';
PRINT '=== TEST KULLANICISININ YENİ ROLLERİ ===';
SELECT 
    u.Username,
    r.RoleName,
    ur.RoleId
FROM Users u
JOIN UserRoles ur ON u.UserId = ur.UserId
JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'test'
ORDER BY r.RoleName;

PRINT '';
PRINT '=== TEST KULLANICISININ NORTHWIND YETKİLERİ ===';
SELECT 
    PermissionKey,
    Granted
FROM UserPermissions
WHERE UserId = @TestUserId
AND PermissionKey LIKE 'Northwind%'
ORDER BY PermissionKey;

PRINT '';
PRINT '=== TEST vs ADMIN ROL KARŞILAŞTIRMASI ===';
SELECT 
    'test' as Username,
    COUNT(*) as RolCount
FROM UserRoles
WHERE UserId = @TestUserId
UNION ALL
SELECT 
    'admin' as Username,
    COUNT(*) as RolCount
FROM UserRoles
WHERE UserId = @AdminUserId;

PRINT '';
PRINT '=== TEST vs ADMIN YETKİ KARŞILAŞTIRMASI ===';
SELECT 
    'test' as Username,
    COUNT(*) as PermissionCount
FROM UserPermissions
WHERE UserId = @TestUserId
UNION ALL
SELECT 
    'admin' as Username,
    COUNT(*) as PermissionCount
FROM UserPermissions
WHERE UserId = @AdminUserId;

PRINT '';
PRINT 'Script tamamlandı!';
PRINT 'Test kullanıcısı ÇIKIŞ YAPIP TEKRAR GİRİŞ YAPMALI!';
PRINT 'Tarayıcı önbelleğini temizlemek için Ctrl+F5 yapın.';