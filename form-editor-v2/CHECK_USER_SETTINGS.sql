-- Kullanıcıya özel ayarları kontrol et
-- =====================================

-- 1. Tüm kullanıcıları listele
SELECT UserId, Username, DisplayName, Email, IsActive 
FROM Users
ORDER BY UserId;

-- 2. UserFormSettings tablosundaki tüm kayıtları göster
SELECT 
    ufs.Id,
    ufs.UserId,
    u.Username,
    LEFT(ufs.Settings, 100) as SettingsPreview,
    ufs.InsertDate,
    ufs.UpdateDate
FROM UserFormSettings ufs
LEFT JOIN Users u ON ufs.UserId = u.UserId
ORDER BY ufs.UserId;

-- 3. Test kullanıcısının ayarlarını kontrol et
DECLARE @TestUserId INT = (SELECT UserId FROM Users WHERE Username = 'test');
DECLARE @AdminUserId INT = (SELECT UserId FROM Users WHERE Username = 'admin');

PRINT '';
PRINT '=== TEST KULLANICISI ===';
PRINT 'Test User ID: ' + CAST(@TestUserId as VARCHAR);

SELECT 
    'Test User Settings' as UserType,
    ufs.Id,
    ufs.UserId,
    u.Username,
    LEFT(ufs.Settings, 200) as SettingsPreview,
    ufs.InsertDate,
    ufs.UpdateDate
FROM UserFormSettings ufs
JOIN Users u ON ufs.UserId = u.UserId
WHERE ufs.UserId = @TestUserId;

PRINT '';
PRINT '=== ADMIN KULLANICISI ===';
PRINT 'Admin User ID: ' + CAST(@AdminUserId as VARCHAR);

SELECT 
    'Admin User Settings' as UserType,
    ufs.Id,
    ufs.UserId,
    u.Username,
    LEFT(ufs.Settings, 200) as SettingsPreview,
    ufs.InsertDate,
    ufs.UpdateDate
FROM UserFormSettings ufs
JOIN Users u ON ufs.UserId = u.UserId
WHERE ufs.UserId = @AdminUserId;

-- 4. Yetkileri kontrol et
PRINT '';
PRINT '=== YETKİ KONTROLÜ ===';

SELECT 
    u.Username,
    up.PermissionKey,
    up.Granted
FROM Users u
LEFT JOIN UserPermissions up ON u.UserId = up.UserId
WHERE u.Username IN ('test', 'admin')
AND (up.PermissionKey LIKE '%Admin%' OR up.PermissionKey LIKE '%FormEditor%')
ORDER BY u.Username, up.PermissionKey;

-- 5. Rolleri kontrol et
PRINT '';
PRINT '=== ROL KONTROLÜ ===';

SELECT 
    u.Username,
    r.RoleName,
    ur.UserId,
    ur.RoleId
FROM Users u
JOIN UserRoles ur ON u.UserId = ur.UserId
JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username IN ('test', 'admin')
ORDER BY u.Username, r.RoleName;

-- 6. Ayarları temizlemek isterseniz (DİKKATLİ KULLANIN!)
/*
-- Test kullanıcısının ayarlarını sil
DELETE FROM UserFormSettings WHERE UserId = @TestUserId;

-- Admin kullanıcısının ayarlarını sil
DELETE FROM UserFormSettings WHERE UserId = @AdminUserId;

-- Tüm ayarları sil
TRUNCATE TABLE UserFormSettings;
*/