-- Test kullanıcısını sil ve yeniden oluştur (sadece temel kolonlar)

-- 1. Test kullanıcısını sil
PRINT '=== TEST KULLANICISINI SİLME ===';
DELETE FROM UserPermissions WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM UserRoles WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM UserPreferences WHERE UserId IN (SELECT UserId FROM Users WHERE Username = 'test');
DELETE FROM Users WHERE Username = 'test';
PRINT 'Test kullanıcısı silindi.';

-- 2. Admin'in hash ve salt değerlerini al
DECLARE @AdminHash NVARCHAR(500);
DECLARE @AdminSalt NVARCHAR(200);
DECLARE @AdminSource NVARCHAR(50);

SELECT 
    @AdminHash = PasswordHash,
    @AdminSalt = PasswordSalt,
    @AdminSource = [Source]
FROM Users
WHERE Username = 'admin';

PRINT '';
PRINT 'Admin bilgileri alındı.';

-- 3. Test kullanıcısını oluştur
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
    @AdminSource,
    @AdminHash,
    @AdminSalt,
    1,
    GETDATE(),
    1,
    GETDATE(),
    1
);

PRINT 'Test kullanıcısı oluşturuldu.';

-- 4. Karşılaştırma
PRINT '';
PRINT '=== KARŞILAŞTIRMA ===';
SELECT 
    Username,
    IsActive,
    [Source],
    CASE WHEN PasswordHash = @AdminHash THEN '✓ Admin ile aynı' ELSE '✗ Farklı' END as HashDurum,
    CASE WHEN PasswordSalt = @AdminSalt THEN '✓ Admin ile aynı' ELSE '✗ Farklı' END as SaltDurum
FROM Users
WHERE Username IN ('admin', 'test')
ORDER BY Username;

-- 5. Test kullanıcısına rol ver
DECLARE @TestUserId INT = (SELECT UserId FROM Users WHERE Username = 'test');
DECLARE @UserRoleId INT = (SELECT TOP 1 RoleId FROM Roles WHERE RoleName NOT LIKE '%Admin%');

IF @UserRoleId IS NOT NULL
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@TestUserId, @UserRoleId);
    PRINT '';
    PRINT 'Test kullanıcısına rol atandı.';
END

-- 6. Final kontrol
PRINT '';
PRINT '========================================';
PRINT 'İŞLEM TAMAMLANDI!';
PRINT '';
PRINT 'Test kullanıcısı admin ile AYNI şifreye sahip.';
PRINT 'Admin şifresi ile test kullanıcısına giriş yapabilirsiniz.';
PRINT '========================================';

-- Son durum
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    [Source]
FROM Users
WHERE Username IN ('admin', 'test')
ORDER BY Username;