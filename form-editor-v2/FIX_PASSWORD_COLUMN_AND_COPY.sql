-- Önce PasswordHash kolonunun boyutunu kontrol et ve gerekirse genişlet
-- Sonra admin şifresini test kullanıcısına kopyala

-- 1. Mevcut kolon boyutunu kontrol et
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('Users') 
  AND c.name IN ('PasswordHash', 'PasswordSalt');

-- 2. PasswordHash kolonunu genişlet (eğer 86 karakterden küçükse)
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('Users') 
      AND name = 'PasswordHash' 
      AND max_length < 200
)
BEGIN
    ALTER TABLE Users 
    ALTER COLUMN PasswordHash NVARCHAR(200);
    PRINT 'PasswordHash kolonu genişletildi.';
END
ELSE
BEGIN
    PRINT 'PasswordHash kolonu zaten yeterli boyutta.';
END

-- 3. Admin kullanıcısının bilgilerini göster
PRINT '';
PRINT 'Admin kullanıcı bilgileri:';
SELECT 
    UserId,
    Username,
    DisplayName,
    LEN(PasswordHash) as HashLength,
    LEN(PasswordSalt) as SaltLength,
    IsActive,
    [Source]
FROM Users
WHERE Username = 'admin';

-- 4. Test kullanıcısının mevcut durumu
PRINT '';
PRINT 'Test kullanıcı mevcut durumu:';
SELECT 
    UserId,
    Username,
    DisplayName,
    LEN(PasswordHash) as HashLength,
    LEN(PasswordSalt) as SaltLength,
    IsActive,
    [Source]
FROM Users
WHERE Username = 'test';

-- 5. Admin'in hash ve salt değerlerini test kullanıcısına kopyala
UPDATE Users
SET 
    PasswordHash = (SELECT PasswordHash FROM Users WHERE Username = 'admin'),
    PasswordSalt = (SELECT PasswordSalt FROM Users WHERE Username = 'admin'),
    [Source] = (SELECT [Source] FROM Users WHERE Username = 'admin'),
    IsActive = 1,
    UpdateDate = GETDATE(),
    UpdateUserId = 1
WHERE Username = 'test';

PRINT '';
PRINT 'Test kullanıcısının şifresi admin ile aynı yapıldı.';

-- 6. Güncelleme sonrası kontrol
PRINT '';
PRINT 'Güncelleme sonrası karşılaştırma:';
SELECT 
    u1.Username AS Kullanici,
    LEN(u1.PasswordHash) as HashUzunlugu,
    u1.IsActive as Aktif,
    u1.[Source] as Kaynak,
    CASE 
        WHEN u1.PasswordHash = u2.PasswordHash THEN '✓ Aynı'
        ELSE '✗ Farklı'
    END AS HashKarsilastirma,
    CASE 
        WHEN u1.PasswordSalt = u2.PasswordSalt THEN '✓ Aynı'
        ELSE '✗ Farklı'
    END AS SaltKarsilastirma
FROM Users u1
LEFT JOIN Users u2 ON u2.Username = 'admin'
WHERE u1.Username IN ('test', 'admin')
ORDER BY u1.Username;

PRINT '';
PRINT '========================================';
PRINT 'İşlem tamamlandı!';
PRINT 'Artık admin şifresi ile test kullanıcısına giriş yapabilirsiniz.';
PRINT '========================================';

-- 7. Eğer test kullanıcısı yoksa oluştur
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'test')
BEGIN
    -- Admin'den kopyalayarak yeni test kullanıcısı oluştur
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
        [Source],
        PasswordHash,
        PasswordSalt,
        1 as IsActive,
        GETDATE() as InsertDate,
        1 as InsertUserId,
        GETDATE() as UpdateDate,
        1 as UpdateUserId
    FROM Users
    WHERE Username = 'admin';
    
    PRINT '';
    PRINT 'Test kullanıcısı oluşturuldu (admin şifresi ile).';
END