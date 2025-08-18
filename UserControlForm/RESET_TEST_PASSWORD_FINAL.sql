-- Test kullanıcısını tamamen sıfırla ve yeniden oluştur

-- Önce mevcut test kullanıcısını sil
DELETE FROM UserRoles WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM UserPermissions WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM Users WHERE Username = 'test';

-- Admin kullanıcısının bilgilerini göster (referans için)
SELECT TOP 1 
    Username,
    Email,
    PasswordHash,
    PasswordSalt,
    IsActive
FROM Users 
WHERE Username = 'admin';

-- Test kullanıcısını admin'in hash'i ile oluştur
INSERT INTO Users (
    Username,
    DisplayName,
    Email,
    Source,
    PasswordHash,
    PasswordSalt,
    IsActive,
    InsertUserId,
    InsertDate,
    LastDirectoryUpdate
)
SELECT 
    'test' as Username,
    'Test User' as DisplayName,
    'test@test.com' as Email,
    'site' as Source,
    PasswordHash,
    PasswordSalt,
    1 as IsActive,
    1 as InsertUserId,
    GETDATE() as InsertDate,
    GETDATE() as LastDirectoryUpdate
FROM Users 
WHERE Username = 'admin';

-- Test kullanıcısına roller ver
DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';

-- Northwind rolünü ver
DECLARE @NorthwindRoleId INT;
SELECT @NorthwindRoleId = RoleId FROM Roles WHERE RoleName = 'Northwind';

IF @NorthwindRoleId IS NOT NULL AND @TestUserId IS NOT NULL
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@TestUserId, @NorthwindRoleId);
    PRINT 'Northwind rolü verildi';
END

-- Sonucu kontrol et
SELECT 
    u.UserId,
    u.Username,
    u.DisplayName,
    u.Email,
    u.IsActive,
    r.RoleName
FROM Users u
LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
LEFT JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'test';

PRINT 'Test kullanıcısı başarıyla oluşturuldu. Şifre: serenity';