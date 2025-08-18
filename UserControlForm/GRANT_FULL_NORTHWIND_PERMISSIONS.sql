-- Test kullanıcısına tam Northwind yetkileri ver

-- Test kullanıcısının ID'sini bul
DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';
PRINT 'Test User ID: ' + CAST(@TestUserId AS VARCHAR(10));

-- Northwind rolü yoksa oluştur
IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'Northwind')
BEGIN
    INSERT INTO Roles (RoleName, TenantId) VALUES ('Northwind', 1);
    PRINT 'Northwind rolü oluşturuldu';
END

-- Northwind rolünün ID'sini al
DECLARE @NorthwindRoleId INT;
SELECT @NorthwindRoleId = RoleId FROM Roles WHERE RoleName = 'Northwind';
PRINT 'Northwind Role ID: ' + CAST(@NorthwindRoleId AS VARCHAR(10));

-- Test kullanıcısına Northwind rolünü ver
IF NOT EXISTS (SELECT * FROM UserRoles WHERE UserId = @TestUserId AND RoleId = @NorthwindRoleId)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@TestUserId, @NorthwindRoleId);
    PRINT 'Test kullanıcısına Northwind rolü verildi';
END
ELSE
BEGIN
    PRINT 'Test kullanıcısında Northwind rolü zaten var';
END

-- RolePermissions tablosuna Northwind yetkilerini ekle
DELETE FROM RolePermissions WHERE RoleId = @NorthwindRoleId; -- Önce temizle

INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES 
    (@NorthwindRoleId, 'Northwind', 1),
    (@NorthwindRoleId, 'Northwind:General', 1),
    (@NorthwindRoleId, 'Northwind:Customer', 1),
    (@NorthwindRoleId, 'Northwind:Customer:View', 1),
    (@NorthwindRoleId, 'Northwind:Customer:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Customer:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Product', 1),
    (@NorthwindRoleId, 'Northwind:Product:View', 1),
    (@NorthwindRoleId, 'Northwind:Product:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Product:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Order', 1),
    (@NorthwindRoleId, 'Northwind:Order:View', 1),
    (@NorthwindRoleId, 'Northwind:Order:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Order:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Category', 1),
    (@NorthwindRoleId, 'Northwind:Category:View', 1),
    (@NorthwindRoleId, 'Northwind:Category:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Category:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Supplier', 1),
    (@NorthwindRoleId, 'Northwind:Supplier:View', 1),
    (@NorthwindRoleId, 'Northwind:Supplier:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Supplier:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Shipper', 1),
    (@NorthwindRoleId, 'Northwind:Shipper:View', 1),
    (@NorthwindRoleId, 'Northwind:Shipper:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Shipper:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Employee', 1),
    (@NorthwindRoleId, 'Northwind:Employee:View', 1),
    (@NorthwindRoleId, 'Northwind:Employee:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Employee:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Region', 1),
    (@NorthwindRoleId, 'Northwind:Region:View', 1),
    (@NorthwindRoleId, 'Northwind:Region:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Region:Delete', 1),
    (@NorthwindRoleId, 'Northwind:Territory', 1),
    (@NorthwindRoleId, 'Northwind:Territory:View', 1),
    (@NorthwindRoleId, 'Northwind:Territory:Modify', 1),
    (@NorthwindRoleId, 'Northwind:Territory:Delete', 1);

PRINT 'Tüm Northwind yetkileri eklendi';

-- Alternatif: UserPermissions tablosuna direkt yetki ekle
INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
SELECT @TestUserId, 'Northwind', 1
WHERE NOT EXISTS (SELECT * FROM UserPermissions WHERE UserId = @TestUserId AND PermissionKey = 'Northwind');

INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
SELECT @TestUserId, 'Northwind:General', 1
WHERE NOT EXISTS (SELECT * FROM UserPermissions WHERE UserId = @TestUserId AND PermissionKey = 'Northwind:General');

PRINT 'Kullanıcıya özel yetkiler de eklendi';

-- Sonuçları kontrol et
PRINT '';
PRINT '=== TEST KULLANICISI ROLLERİ ===';
SELECT 
    u.Username,
    r.RoleName
FROM Users u
JOIN UserRoles ur ON u.UserId = ur.UserId
JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'test';

PRINT '';
PRINT '=== NORTHWIND ROLÜ YETKİLERİ ===';
SELECT TOP 10
    rp.PermissionKey,
    rp.Granted
FROM RolePermissions rp
WHERE rp.RoleId = @NorthwindRoleId;

PRINT '';
PRINT '=== TEST KULLANICISI DİREKT YETKİLERİ ===';
SELECT 
    PermissionKey,
    Granted
FROM UserPermissions
WHERE UserId = @TestUserId;

PRINT '';
PRINT 'Script tamamlandı. Test kullanıcısı çıkış yapıp tekrar giriş yapmalı.';