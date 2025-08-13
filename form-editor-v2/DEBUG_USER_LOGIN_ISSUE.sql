-- Test ve Admin kullanıcılarının durumunu detaylı kontrol et

-- 1. Her iki kullanıcının tam bilgilerini göster
PRINT '=== KULLANICI BİLGİLERİ ===';
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    [Source],
    IsActive,
    PasswordHash,
    PasswordSalt,
    LEN(PasswordHash) as HashLength,
    LEN(PasswordSalt) as SaltLength,
    InsertDate,
    UpdateDate
FROM Users
WHERE Username IN ('admin', 'test')
ORDER BY Username;

-- 2. Hash ve Salt değerlerini karşılaştır
PRINT '';
PRINT '=== HASH KARŞILAŞTIRMA ===';
SELECT 
    'Admin Hash' as [Tip],
    PasswordHash as [Değer],
    LEN(PasswordHash) as [Uzunluk]
FROM Users WHERE Username = 'admin'
UNION ALL
SELECT 
    'Test Hash' as [Tip],
    PasswordHash as [Değer],
    LEN(PasswordHash) as [Uzunluk]
FROM Users WHERE Username = 'test';

-- 3. Salt değerlerini karşılaştır
PRINT '';
PRINT '=== SALT KARŞILAŞTIRMA ===';
SELECT 
    'Admin Salt' as [Tip],
    PasswordSalt as [Değer],
    LEN(PasswordSalt) as [Uzunluk]
FROM Users WHERE Username = 'admin'
UNION ALL
SELECT 
    'Test Salt' as [Tip],
    PasswordSalt as [Değer],
    LEN(PasswordSalt) as [Uzunluk]
FROM Users WHERE Username = 'test';

-- 4. Kullanıcı rollerini kontrol et
PRINT '';
PRINT '=== KULLANICI ROLLERİ ===';
SELECT 
    u.Username,
    r.RoleName,
    ur.UserId,
    ur.RoleId
FROM UserRoles ur
INNER JOIN Users u ON ur.UserId = u.UserId
INNER JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username IN ('admin', 'test')
ORDER BY u.Username, r.RoleName;

-- 5. Source kontrolü
PRINT '';
PRINT '=== SOURCE KONTROLÜ ===';
SELECT 
    Username,
    [Source],
    CASE [Source]
        WHEN 'site' THEN 'Site kullanıcısı (normal login)'
        WHEN 'sign' THEN 'Sign kullanıcısı (normal login)'
        WHEN 'ldap' THEN 'LDAP kullanıcısı (directory login)'
        ELSE 'Bilinmeyen kaynak'
    END as [Açıklama]
FROM Users
WHERE Username IN ('admin', 'test');

-- 6. Admin şifresini test'e kopyala (Source dahil)
PRINT '';
PRINT '=== ŞİFRE KOPYALAMA ===';
PRINT 'Admin şifresi test kullanıcısına kopyalanıyor...';

UPDATE Users
SET 
    PasswordHash = (SELECT TOP 1 PasswordHash FROM Users WHERE Username = 'admin'),
    PasswordSalt = (SELECT TOP 1 PasswordSalt FROM Users WHERE Username = 'admin'),
    [Source] = 'site',  -- Source'u kesinlikle 'site' yap
    IsActive = 1,
    UpdateDate = GETDATE()
WHERE Username = 'test';

PRINT 'Güncelleme tamamlandı.';

-- 7. Güncelleme sonrası kontrol
PRINT '';
PRINT '=== GÜNCELLEME SONRASI KONTROL ===';
SELECT 
    u1.Username,
    u1.[Source],
    u1.IsActive,
    CASE 
        WHEN u1.PasswordHash = u2.PasswordHash THEN '✓ Hash Aynı'
        ELSE '✗ Hash Farklı - ' + CAST(LEN(u1.PasswordHash) as varchar) + ' / ' + CAST(LEN(u2.PasswordHash) as varchar)
    END as HashDurum,
    CASE 
        WHEN u1.PasswordSalt = u2.PasswordSalt THEN '✓ Salt Aynı'
        ELSE '✗ Salt Farklı'
    END as SaltDurum
FROM Users u1
CROSS JOIN Users u2
WHERE u1.Username = 'test' AND u2.Username = 'admin';

-- 8. Eğer hala sorun varsa, yeni bir test2 kullanıcısı oluştur
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'test2')
BEGIN
    PRINT '';
    PRINT '=== YENİ TEST2 KULLANICISI OLUŞTURULUYOR ===';
    
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
    SELECT 
        'test2',
        'Test Kullanıcısı 2',
        'test2@test.com',
        [Source],
        PasswordHash,
        PasswordSalt,
        1,
        GETDATE(),
        UserId,  -- Admin'in UserId'si
        GETDATE(),
        UserId   -- Admin'in UserId'si
    FROM Users
    WHERE Username = 'admin';
    
    PRINT 'test2 kullanıcısı oluşturuldu. Admin şifresi ile giriş yapabilirsiniz.';
    
    -- test2'ye normal kullanıcı rolü ver (opsiyonel)
    DECLARE @Test2UserId INT = (SELECT UserId FROM Users WHERE Username = 'test2');
    DECLARE @UserRoleId INT = (SELECT TOP 1 RoleId FROM Roles WHERE RoleName = 'Users' OR RoleName = 'Registered Users');
    
    IF @UserRoleId IS NOT NULL AND @Test2UserId IS NOT NULL
    BEGIN
        INSERT INTO UserRoles (UserId, RoleId)
        VALUES (@Test2UserId, @UserRoleId);
        PRINT 'test2 kullanıcısına rol atandı.';
    END
END

-- 9. Final kontrol
PRINT '';
PRINT '=== ÖZET ===';
SELECT 
    Username,
    DisplayName,
    [Source],
    IsActive,
    CASE 
        WHEN PasswordHash IS NOT NULL THEN 'VAR (' + CAST(LEN(PasswordHash) as varchar) + ' karakter)'
        ELSE 'YOK'
    END as HashDurumu,
    CASE 
        WHEN PasswordSalt IS NOT NULL THEN 'VAR (' + CAST(LEN(PasswordSalt) as varchar) + ' karakter)'
        ELSE 'YOK'
    END as SaltDurumu
FROM Users
WHERE Username IN ('admin', 'test', 'test2')
ORDER BY Username;

PRINT '';
PRINT '========================================';
PRINT 'SONUÇ:';
PRINT '1. test kullanıcısı admin ile aynı şifreye sahip';
PRINT '2. test2 kullanıcısı da oluşturuldu (yedek)';
PRINT '3. Her iki kullanıcı da admin şifresi ile giriş yapabilmeli';
PRINT '========================================';