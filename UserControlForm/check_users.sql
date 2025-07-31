-- UserControlForm_Default_v1 veritabanındaki kullanıcıları kontrol et
USE UserControlForm_Default_v1;

-- Tüm kullanıcıları listele
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive,
    InsertDate,
    UpdateDate
FROM Users
ORDER BY Username;

-- admin2 kullanıcısı yoksa oluştur
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin2')
BEGIN
    INSERT INTO Users (Username, DisplayName, Email, Source, PasswordHash, PasswordSalt, InsertDate, InsertUserId, IsActive)
    VALUES (
        'admin2',
        'Admin 2',
        'admin2@example.com',
        'site',
        'rfqpSPYs0ekFlPyvIRTXsdhE/qrTHFF+kKsAUla7pFkXL4BgLGlTe89GDX5DBysenMDj8AqbIZPybqvusyCjwQ', -- şifre: serenity
        'hJf_F',
        GETDATE(),
        1,
        1
    );
    PRINT 'admin2 kullanıcısı oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'admin2 kullanıcısı zaten mevcut.';
END