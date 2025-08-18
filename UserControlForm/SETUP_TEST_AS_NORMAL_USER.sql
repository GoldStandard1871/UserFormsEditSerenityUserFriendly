-- Test kullanıcısını normal kullanıcı olarak ayarla (admin değil)

-- Kullanıcı ID'lerini al
DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';

IF @TestUserId IS NULL
BEGIN
    PRINT 'HATA: Test kullanıcısı bulunamadı!';
    RETURN;
END

PRINT 'Test User ID: ' + CAST(@TestUserId AS VARCHAR(10));

-- Önce test kullanıcısının mevcut rol ve yetkilerini temizle
DELETE FROM UserRoles WHERE UserId = @TestUserId;
DELETE FROM UserPermissions WHERE UserId = @TestUserId;
PRINT 'Test kullanıcısının eski rol ve yetkileri temizlendi';

-- Sadece normal kullanıcı rollerini ekle
DECLARE @UserRoleId INT;
DECLARE @RegisterRoleId INT;

-- "User" rolü varsa ekle
SELECT @UserRoleId = RoleId FROM Roles WHERE RoleName = 'User';
IF @UserRoleId IS NOT NULL
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@TestUserId, @UserRoleId);
    PRINT 'User rolü eklendi';
END

-- "Registered Users" rolü varsa ekle
SELECT @RegisterRoleId = RoleId FROM Roles WHERE RoleName = 'Registered Users' OR RoleName = 'Register';
IF @RegisterRoleId IS NOT NULL
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@TestUserId, @RegisterRoleId);
    PRINT 'Registered Users rolü eklendi';
END

-- Northwind yetkilerini DOĞRUDAN UserPermissions tablosuna ekle
-- (Rol olmadan direkt yetki veriyoruz)
INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES
    (@TestUserId, 'Northwind', 1),
    (@TestUserId, 'Northwind:General', 1),
    -- Customer yetkileri
    (@TestUserId, 'Northwind:Customer', 1),
    (@TestUserId, 'Northwind:Customer:View', 1),
    (@TestUserId, 'Northwind:Customer:Modify', 1),
    (@TestUserId, 'Northwind:Customer:Delete', 1),
    -- Product yetkileri
    (@TestUserId, 'Northwind:Product', 1),
    (@TestUserId, 'Northwind:Product:View', 1),
    (@TestUserId, 'Northwind:Product:Modify', 1),
    (@TestUserId, 'Northwind:Product:Delete', 1),
    -- Order yetkileri
    (@TestUserId, 'Northwind:Order', 1),
    (@TestUserId, 'Northwind:Order:View', 1),
    (@TestUserId, 'Northwind:Order:Modify', 1),
    (@TestUserId, 'Northwind:Order:Delete', 1),
    -- Category yetkileri
    (@TestUserId, 'Northwind:Category', 1),
    (@TestUserId, 'Northwind:Category:View', 1),
    (@TestUserId, 'Northwind:Category:Modify', 1),
    -- Supplier yetkileri
    (@TestUserId, 'Northwind:Supplier', 1),
    (@TestUserId, 'Northwind:Supplier:View', 1),
    (@TestUserId, 'Northwind:Supplier:Modify', 1),
    -- Shipper yetkileri
    (@TestUserId, 'Northwind:Shipper', 1),
    (@TestUserId, 'Northwind:Shipper:View', 1),
    (@TestUserId, 'Northwind:Shipper:Modify', 1),
    -- Employee yetkileri
    (@TestUserId, 'Northwind:Employee', 1),
    (@TestUserId, 'Northwind:Employee:View', 1),
    (@TestUserId, 'Northwind:Employee:Modify', 1),
    -- Region yetkileri
    (@TestUserId, 'Northwind:Region', 1),
    (@TestUserId, 'Northwind:Region:View', 1),
    (@TestUserId, 'Northwind:Region:Modify', 1),
    -- Territory yetkileri
    (@TestUserId, 'Northwind:Territory', 1),
    (@TestUserId, 'Northwind:Territory:View', 1),
    (@TestUserId, 'Northwind:Territory:Modify', 1);

PRINT 'Northwind yetkileri eklendi';

-- Sonuçları kontrol et
PRINT '';
PRINT '=== TEST KULLANICISININ ROLLERİ ===';
SELECT 
    u.Username,
    r.RoleName
FROM Users u
LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
LEFT JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'test';

PRINT '';
PRINT '=== TEST KULLANICISININ YETKİLERİ ===';
SELECT 
    PermissionKey,
    Granted
FROM UserPermissions
WHERE UserId = @TestUserId
ORDER BY PermissionKey;

PRINT '';
PRINT '=== ÖZET ===';
SELECT 
    'Roller' as Tip,
    COUNT(*) as Adet
FROM UserRoles
WHERE UserId = @TestUserId
UNION ALL
SELECT 
    'Yetkiler' as Tip,
    COUNT(*) as Adet
FROM UserPermissions
WHERE UserId = @TestUserId;

PRINT '';
PRINT '✅ Script tamamlandı!';
PRINT '⚠️ Test kullanıcısı ÇIKIŞ YAPIP TEKRAR GİRİŞ YAPMALI!';
PRINT '⚠️ Tarayıcı önbelleğini temizlemek için Ctrl+F5 yapın.';