-- Test kullanıcısının şifresini admin ile aynı yap
-- Bu script'i SQL Server Management Studio'da çalıştırın

-- 1. Önce mevcut durumu kontrol et
PRINT '=== MEVCUT DURUM ==='
SELECT 
    UserId,
    Username,
    DisplayName,
    IsActive,
    [Source],
    CASE WHEN PasswordHash IS NOT NULL THEN 'VAR' ELSE 'YOK' END as HashDurumu,
    CASE WHEN PasswordSalt IS NOT NULL THEN 'VAR' ELSE 'YOK' END as SaltDurumu
FROM Users
WHERE Username IN ('admin', 'test')
ORDER BY Username;

-- 2. Admin'in hash ve salt değerlerini test'e kopyala
PRINT '';
PRINT '=== ŞİFRE KOPYALAMA ==='
UPDATE Users
SET 
    PasswordHash = (SELECT TOP 1 PasswordHash FROM Users WHERE Username = 'admin'),
    PasswordSalt = (SELECT TOP 1 PasswordSalt FROM Users WHERE Username = 'admin'),
    [Source] = 'site',
    IsActive = 1,
    UpdateDate = GETDATE()
WHERE Username = 'test';

PRINT 'Test kullanıcısının şifresi admin ile aynı yapıldı.';

-- 3. Sonucu kontrol et
PRINT '';
PRINT '=== GÜNCELLEME SONRASI ==='
SELECT 
    u1.Username,
    CASE 
        WHEN u1.PasswordHash = u2.PasswordHash THEN '✓ Şifreler AYNI'
        ELSE '✗ Şifreler FARKLI'
    END as SifreDurumu,
    u1.IsActive,
    u1.[Source]
FROM Users u1
CROSS JOIN Users u2
WHERE u1.Username = 'test' AND u2.Username = 'admin';

-- 4. Eğer test kullanıcısı yoksa oluştur
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'test')
BEGIN
    PRINT '';
    PRINT '=== TEST KULLANICISI OLUŞTURULUYOR ==='
    
    -- Admin kullanıcısından kopyala
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
        'test' as Username,
        'Test Kullanıcısı' as DisplayName,
        'test@test.com' as Email,
        'site' as [Source],
        PasswordHash,
        PasswordSalt,
        1 as IsActive,
        GETDATE() as InsertDate,
        1 as InsertUserId,
        GETDATE() as UpdateDate,
        1 as UpdateUserId
    FROM Users
    WHERE Username = 'admin';
    
    PRINT 'Test kullanıcısı oluşturuldu.';
END

PRINT '';
PRINT '========================================';
PRINT 'İŞLEM TAMAMLANDI!';
PRINT 'Admin şifresi ile test kullanıcısına giriş yapabilirsiniz.';
PRINT '========================================';

-- 5. Test için kullanıcı bilgilerini göster
SELECT TOP 2
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    [Source]
FROM Users
WHERE Username IN ('admin', 'test')
ORDER BY Username;