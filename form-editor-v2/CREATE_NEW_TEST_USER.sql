-- Önce eski test kullanıcısını sil
DELETE FROM UserRoles WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM Users WHERE Username = 'test';

PRINT 'Eski test kullanıcısı silindi.';

-- Yeni test kullanıcısı oluştur (şifre: serenity)
INSERT INTO Users (
    Username,
    DisplayName,
    Email,
    [Source],
    PasswordHash,
    PasswordSalt,
    IsActive,
    InsertDate,
    InsertUserId,
    UpdateDate,
    UpdateUserId
)
VALUES (
    'test',
    'Test Kullanıcısı',
    'test@test.com',
    'site',
    'pbkdf2_sha1$10000$qjPImC2SZ6BjanC2$L4YDiLX2G92cOdrQYADGge/2YhVU2Xk1edqMWF6iYPs=',
    'qjPImC2SZ6BjanC2',
    1,
    GETDATE(),
    1,
    GETDATE(),
    1
);

PRINT 'Yeni test kullanıcısı oluşturuldu.';
PRINT 'Kullanıcı adı: test';
PRINT 'Şifre: serenity';
PRINT '';

-- Kullanıcıya rol ver (opsiyonel)
DECLARE @TestUserId INT = (SELECT UserId FROM Users WHERE Username = 'test');
DECLARE @UserRoleId INT = 2; -- Genelde 2 = Registered Users

IF @TestUserId IS NOT NULL AND @UserRoleId IS NOT NULL
BEGIN
    INSERT INTO UserRoles (UserId, RoleId)
    VALUES (@TestUserId, @UserRoleId);
    PRINT 'Test kullanıcısına Registered Users rolü verildi.';
END

-- Sonucu göster
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    [Source],
    CASE WHEN PasswordHash IS NOT NULL THEN 'VAR' ELSE 'YOK' END as PasswordHash,
    CASE WHEN PasswordSalt IS NOT NULL THEN 'VAR' ELSE 'YOK' END as PasswordSalt
FROM Users
WHERE Username = 'test';

PRINT '';
PRINT '========================================';
PRINT 'İŞLEM TAMAMLANDI!';
PRINT '';
PRINT 'GİRİŞ BİLGİLERİ:';
PRINT 'Kullanıcı adı: test';
PRINT 'Şifre: serenity';
PRINT '========================================';