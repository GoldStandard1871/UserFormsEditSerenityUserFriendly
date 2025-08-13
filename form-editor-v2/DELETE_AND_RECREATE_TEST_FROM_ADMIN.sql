-- Test kullanıcısını tamamen sil ve admin'den kopyalayarak yeniden oluştur

-- 1. Önce test kullanıcısını tamamen sil
PRINT '=== TEST KULLANICISINI SİLME ==='
DELETE FROM UserPermissions WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM UserRoles WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM UserPreferences WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM Users WHERE Username = 'test';
PRINT 'Test kullanıcısı tamamen silindi.';

-- 2. Admin'den kopyalayarak test kullanıcısını oluştur
PRINT '';
PRINT '=== YENİ TEST KULLANICISI OLUŞTURMA ==='
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
    UpdateUserId,
    LastDirectoryUpdate,
    UserImage,
    MobilePhoneNumber,
    MobilePhoneVerified,
    TwoFactorAuth
)
SELECT 
    'test' as Username,
    'Test Kullanıcısı' as DisplayName,
    'test@test.com' as Email,
    [Source],           -- Admin ile aynı
    PasswordHash,       -- Admin ile aynı
    PasswordSalt,       -- Admin ile aynı
    IsActive,          -- Admin ile aynı
    GETDATE() as InsertDate,
    InsertUserId,
    GETDATE() as UpdateDate,
    UpdateUserId,
    LastDirectoryUpdate,
    NULL as UserImage,
    MobilePhoneNumber,
    MobilePhoneVerified,
    TwoFactorAuth
FROM Users
WHERE Username = 'admin';

PRINT 'Test kullanıcısı admin''den kopyalanarak oluşturuldu.';

-- 3. Test kullanıcısına normal kullanıcı rolü ver
PRINT '';
PRINT '=== ROL ATAMA ==='
DECLARE @TestUserId INT = (SELECT UserId FROM Users WHERE Username = 'test');

-- Registered Users rolünü ver (admin rolü vermeyelim)
INSERT INTO UserRoles (UserId, RoleId)
SELECT @TestUserId, RoleId
FROM Roles
WHERE RoleName IN ('Registered Users', 'Users')
AND RoleId NOT IN (SELECT RoleId FROM UserRoles WHERE UserId = @TestUserId);

PRINT 'Test kullanıcısına rol atandı.';

-- 4. Sonucu kontrol et
PRINT '';
PRINT '=== KARŞILAŞTIRMA ==='
SELECT 
    u1.Username as [Kullanıcı],
    u1.IsActive as [Aktif],
    u1.[Source] as [Kaynak],
    CASE 
        WHEN u1.PasswordHash = u2.PasswordHash THEN '✓ AYNI'
        ELSE '✗ FARKLI'
    END as [Hash],
    CASE 
        WHEN u1.PasswordSalt = u2.PasswordSalt THEN '✓ AYNI'
        ELSE '✗ FARKLI'
    END as [Salt]
FROM Users u1
CROSS JOIN Users u2
WHERE u1.Username = 'test' AND u2.Username = 'admin';

-- 5. Roller
PRINT '';
PRINT '=== ROLLER ==='
SELECT 
    u.Username,
    STRING_AGG(r.RoleName, ', ') as Roller
FROM Users u
LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
LEFT JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username IN ('admin', 'test')
GROUP BY u.Username;

-- 6. Final kontrol
PRINT '';
PRINT '========================================';
PRINT 'İŞLEM TAMAMLANDI!';
PRINT '';
PRINT 'Test kullanıcısı admin ile TAMAMEN AYNI şifreye sahip.';
PRINT 'Admin hangi şifre ile giriş yapıyorsa, test de aynı şifre ile giriş yapabilmeli.';
PRINT '========================================';

-- Debug için detaylı bilgi
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    [Source],
    LEN(PasswordHash) as HashLength,
    LEN(PasswordSalt) as SaltLength,
    InsertDate,
    UpdateDate
FROM Users
WHERE Username IN ('admin', 'test')
ORDER BY Username;