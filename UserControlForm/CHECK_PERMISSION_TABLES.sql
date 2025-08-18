-- Yetki tablolarını kontrol et
SELECT 'Users Tablosu:' AS [Tablo];
SELECT UserId, Username, DisplayName, IsActive FROM Users;

SELECT '' AS [---];

SELECT 'Roles Tablosu:' AS [Tablo];
SELECT RoleId, RoleName FROM Roles;

SELECT '' AS [---];

SELECT 'UserRoles Tablosu:' AS [Tablo];
SELECT ur.*, u.Username, r.RoleName 
FROM UserRoles ur
JOIN Users u ON ur.UserId = u.UserId
JOIN Roles r ON ur.RoleId = r.RoleId;

SELECT '' AS [---];

SELECT 'UserPermissions Tablosu:' AS [Tablo];
SELECT up.*, u.Username 
FROM UserPermissions up
JOIN Users u ON up.UserId = u.UserId
WHERE u.Username = 'test';

SELECT '' AS [---];

SELECT 'RolePermissions Tablosu:' AS [Tablo];
SELECT * FROM RolePermissions WHERE PermissionKey LIKE 'Northwind%';