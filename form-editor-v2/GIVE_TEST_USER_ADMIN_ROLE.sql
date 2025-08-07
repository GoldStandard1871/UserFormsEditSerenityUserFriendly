-- Test kullanıcısına admin rolü verme

-- Önce test kullanıcısının ID'sini bulalım
DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';

-- Admin rolünün ID'sini bulalım
DECLARE @AdminRoleId INT;
SELECT @AdminRoleId = RoleId FROM Roles WHERE RoleName = 'Administrators';

-- Test kullanıcısına admin rolü verelim (eğer yoksa)
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @TestUserId AND RoleId = @AdminRoleId)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId)
    VALUES (@TestUserId, @AdminRoleId);
    PRINT 'Test kullanıcısına admin rolü verildi.';
END
ELSE
BEGIN
    PRINT 'Test kullanıcısı zaten admin rolüne sahip.';
END

-- Kontrol edelim
SELECT 
    u.Username,
    u.DisplayName,
    r.RoleName
FROM Users u
INNER JOIN UserRoles ur ON u.UserId = ur.UserId
INNER JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'test';