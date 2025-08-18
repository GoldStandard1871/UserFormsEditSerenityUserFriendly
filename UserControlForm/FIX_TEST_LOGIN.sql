-- Test kullanıcısı giriş sorununu çöz

-- Test kullanıcısını admin'in kopyası olarak güncelle
UPDATE Users
SET 
    PasswordHash = (SELECT PasswordHash FROM Users WHERE Username = 'admin'),
    PasswordSalt = (SELECT PasswordSalt FROM Users WHERE Username = 'admin'),
    IsActive = 1,
    Source = 'site',
    LastDirectoryUpdate = GETDATE()
WHERE Username = 'test';

-- Sonucu kontrol et
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    Source,
    IsActive,
    CASE 
        WHEN PasswordHash IS NULL THEN 'NULL'
        ELSE 'SET'
    END as PasswordStatus,
    CASE 
        WHEN PasswordSalt IS NULL THEN 'NULL'
        ELSE 'SET'
    END as SaltStatus
FROM Users
WHERE Username IN ('test', 'admin');

PRINT 'Test kullanıcısının şifresi admin ile aynı yapıldı (serenity)';