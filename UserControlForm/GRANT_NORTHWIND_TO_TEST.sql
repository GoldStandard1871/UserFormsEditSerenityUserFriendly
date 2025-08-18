-- Test kullanıcısına Northwind yetkilerini ver
-- UserRoles tablosuna Northwind rolü ekle (eğer yoksa)

-- Önce Northwind rolünü oluştur
IF NOT EXISTS (SELECT * FROM Roles WHERE RoleName = 'Northwind')
BEGIN
    INSERT INTO Roles (RoleName, TenantId) VALUES ('Northwind', 1);
END

-- Test kullanıcısının ID'sini bul
DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';

-- Northwind rolünün ID'sini bul
DECLARE @NorthwindRoleId INT;
SELECT @NorthwindRoleId = RoleId FROM Roles WHERE RoleName = 'Northwind';

-- Test kullanıcısına Northwind rolünü ver
IF NOT EXISTS (SELECT * FROM UserRoles WHERE UserId = @TestUserId AND RoleId = @NorthwindRoleId)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@TestUserId, @NorthwindRoleId);
END

-- RolePermissions tablosuna Northwind yetkilerini ekle
IF NOT EXISTS (SELECT * FROM RolePermissions WHERE RoleId = @NorthwindRoleId AND PermissionKey = 'Northwind')
BEGIN
    INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES (@NorthwindRoleId, 'Northwind', 1);
    INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES (@NorthwindRoleId, 'Northwind:General', 1);
    INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES (@NorthwindRoleId, 'Northwind:Customer:View', 1);
    INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES (@NorthwindRoleId, 'Northwind:Customer:Modify', 1);
    INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES (@NorthwindRoleId, 'Northwind:Product:View', 1);
    INSERT INTO RolePermissions (RoleId, PermissionKey, Granted) VALUES (@NorthwindRoleId, 'Northwind:Product:Modify', 1);
END

PRINT 'Test kullanıcısına Northwind yetkileri verildi';