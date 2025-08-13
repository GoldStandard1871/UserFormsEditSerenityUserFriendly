-- Admin kullanıcısının şifre hash ve salt değerlerini test kullanıcısına kopyala
-- Bu sayede aynı şifre ile giriş yapabilirsiniz

-- Önce admin kullanıcısının bilgilerini kontrol et
SELECT 
    UserId,
    Username,
    DisplayName,
    PasswordHash,
    PasswordSalt,
    IsActive,
    [Source]
FROM Users
WHERE Username = 'admin';

-- Admin'in hash ve salt değerlerini test kullanıcısına kopyala
UPDATE test_user
SET 
    test_user.PasswordHash = admin_user.PasswordHash,
    test_user.PasswordSalt = admin_user.PasswordSalt,
    test_user.[Source] = admin_user.[Source],
    test_user.UpdateDate = GETDATE(),
    test_user.UpdateUserId = 1
FROM Users test_user
CROSS JOIN Users admin_user
WHERE test_user.Username = 'test' 
  AND admin_user.Username = 'admin';

-- Güncelleme sonrası kontrol
SELECT 
    u1.Username AS TestUser,
    u2.Username AS AdminUser,
    CASE 
        WHEN u1.PasswordHash = u2.PasswordHash THEN 'Aynı'
        ELSE 'Farklı'
    END AS HashDurumu,
    CASE 
        WHEN u1.PasswordSalt = u2.PasswordSalt THEN 'Aynı'
        ELSE 'Farklı'
    END AS SaltDurumu,
    u1.IsActive AS TestActive,
    u1.[Source] AS TestSource
FROM Users u1
CROSS JOIN Users u2
WHERE u1.Username = 'test' 
  AND u2.Username = 'admin';

PRINT 'Test kullanıcısının şifresi admin ile aynı yapıldı.';
PRINT 'Artık admin şifresi ile test kullanıcısına giriş yapabilirsiniz.';