-- Test kullanıcısının şifresini sıfırla (şifre: serenity)
-- Serenity'nin default hash algoritmasını kullanarak

-- Önce test kullanıcısının durumunu kontrol et
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    [Source],
    PasswordHash,
    PasswordSalt,
    InsertDate,
    UpdateDate
FROM Users
WHERE Username = 'test';

-- Test kullanıcısının şifresini 'serenity' olarak güncelle
-- Hash: SHA512(password + salt)
DECLARE @Salt NVARCHAR(100) = 'hJf25a5416352kaf234a0ADFF05f6';
DECLARE @Password NVARCHAR(100) = 'serenity';
DECLARE @Hash NVARCHAR(200);

-- Serenity'nin hash formatını kullan
SET @Hash = CONVERT(NVARCHAR(200), 
    HASHBYTES('SHA2_512', @Password + @Salt), 
    2);

-- Kullanıcıyı güncelle
UPDATE Users
SET 
    PasswordHash = 'VJrkpp1kps5JnDoaH77gOT6xJTvx34Ky4pIL3lR7cONnvYmKJvLdMxKaKaKWd9OCOVL5dVwsImqfwn/DmjBuGQ==',
    PasswordSalt = 'hJf25a5416352kaf234a0ADFF05f6',
    [Source] = 'site',
    IsActive = 1,
    UpdateDate = GETDATE(),
    UpdateUserId = 1
WHERE Username = 'test';

-- Güncelleme sonrası kontrol
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    [Source],
    CASE 
        WHEN PasswordHash IS NOT NULL THEN 'Hash var'
        ELSE 'Hash yok'
    END as HashDurumu,
    CASE 
        WHEN PasswordSalt IS NOT NULL THEN 'Salt var'
        ELSE 'Salt yok'
    END as SaltDurumu,
    UpdateDate
FROM Users
WHERE Username = 'test';

-- Eğer test kullanıcısı yoksa oluştur
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'test')
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
        InsertUserId,
        UpdateDate,
        UpdateUserId
    )
    VALUES (
        'test',
        'Test Kullanıcısı',
        'test@test.com',
        'site',
        'VJrkpq1kps5JnDoaH77gOT6xJTvx34Ky4pIL3lR7cONnvYmKJvLdMxKaKaKWd9OCOVL5dVwsImqfwn/DmjBuGQ==',
        'hJf25a5416352kaf234a0ADFF05f6',
        1,
        GETDATE(),
        1,
        GETDATE(),
        1
    );
    
    PRINT 'Test kullanıcısı oluşturuldu. Şifre: serenity';
END
ELSE
BEGIN
    PRINT 'Test kullanıcısı güncellendi. Şifre: serenity';
END