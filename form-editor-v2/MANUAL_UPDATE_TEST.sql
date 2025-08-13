-- Test kullanıcısı varsa güncelle, yoksa oluştur

-- Admin bilgilerini göster
PRINT '=== ADMIN BİLGİLERİ ===';
SELECT TOP 1
    Username,
    LEFT(PasswordHash, 20) + '...' as HashFirst20,
    PasswordSalt,
    [Source],
    IsActive
FROM Users
WHERE Username = 'admin';

-- Test kullanıcısı var mı kontrol et
IF EXISTS (SELECT 1 FROM Users WHERE Username = 'test')
BEGIN
    PRINT '';
    PRINT '=== TEST KULLANICISI GÜNCELLEME ===';
    
    -- Test kullanıcısını admin ile aynı yap
    UPDATE test
    SET 
        test.PasswordHash = admin.PasswordHash,
        test.PasswordSalt = admin.PasswordSalt,
        test.[Source] = admin.[Source],
        test.IsActive = 1,
        test.UpdateDate = GETDATE()
    FROM Users test, Users admin
    WHERE test.Username = 'test' AND admin.Username = 'admin';
    
    PRINT 'Test kullanıcısı güncellendi.';
END
ELSE
BEGIN
    PRINT '';
    PRINT '=== TEST KULLANICISI OLUŞTURMA ===';
    
    -- Minimum gerekli alanlarla oluştur
    INSERT INTO Users (Username, DisplayName, Email, [Source], PasswordHash, PasswordSalt, IsActive, InsertDate, InsertUserId)
    SELECT 
        'test',
        'Test Kullanıcısı',
        'test@test.com',
        [Source],
        PasswordHash,
        PasswordSalt,
        1,
        GETDATE(),
        1
    FROM Users WHERE Username = 'admin';
    
    PRINT 'Test kullanıcısı oluşturuldu.';
END

-- Sonuç kontrolü
PRINT '';
PRINT '=== SONUÇ ===';
SELECT 
    u1.Username,
    u1.IsActive,
    CASE 
        WHEN u1.PasswordHash = u2.PasswordHash THEN '✓ Şifreler AYNI'
        ELSE '✗ Şifreler FARKLI - SORUN VAR!'
    END as Durum
FROM Users u1, Users u2
WHERE u1.Username = 'test' AND u2.Username = 'admin';

PRINT '';
PRINT 'Admin şifresi ile test kullanıcısına giriş yapabilmelisiniz.';