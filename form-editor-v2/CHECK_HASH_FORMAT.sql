-- Admin kullanıcısının hash formatını kontrol et
SELECT 
    Username,
    LEFT(PasswordHash, 50) as HashFirst50Chars,
    LEN(PasswordHash) as HashLength,
    PasswordSalt,
    LEN(PasswordSalt) as SaltLength,
    [Source]
FROM Users
WHERE Username = 'admin';

-- Test için basit bir kullanıcı oluştur
-- Admin'in hash ve salt'ını kopyala
DECLARE @AdminHash NVARCHAR(200);
DECLARE @AdminSalt NVARCHAR(100);

SELECT 
    @AdminHash = PasswordHash,
    @AdminSalt = PasswordSalt
FROM Users
WHERE Username = 'admin';

PRINT 'Admin Hash: ' + ISNULL(@AdminHash, 'NULL');
PRINT 'Admin Salt: ' + ISNULL(@AdminSalt, 'NULL');

-- testuser adında yeni kullanıcı oluştur
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'testuser')
BEGIN
    INSERT INTO Users (
        Username,
        DisplayName,
        Email,
        [Source],
        PasswordHash,
        PasswordSalt,
        IsActive,
        InsertDate,
        InsertUserId
    )
    VALUES (
        'testuser',
        'Test User',
        'testuser@test.com',
        'site',
        @AdminHash,
        @AdminSalt,
        1,
        GETDATE(),
        1
    );
    
    PRINT '';
    PRINT 'testuser kullanıcısı oluşturuldu.';
    PRINT 'Admin şifresi ile giriş yapabilirsiniz.';
END
ELSE
BEGIN
    UPDATE Users
    SET 
        PasswordHash = @AdminHash,
        PasswordSalt = @AdminSalt,
        [Source] = 'site',
        IsActive = 1
    WHERE Username = 'testuser';
    
    PRINT '';
    PRINT 'testuser güncellendi.';
    PRINT 'Admin şifresi ile giriş yapabilirsiniz.';
END

-- Sonucu göster
SELECT 
    Username,
    DisplayName,
    IsActive,
    [Source],
    CASE 
        WHEN PasswordHash = @AdminHash THEN '✓ Admin ile aynı'
        ELSE '✗ Farklı'
    END as HashDurumu
FROM Users
WHERE Username IN ('admin', 'test', 'testuser')
ORDER BY Username;