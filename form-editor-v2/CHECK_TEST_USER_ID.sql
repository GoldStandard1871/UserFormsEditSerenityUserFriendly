-- Test kullanıcısının ID'sini kontrol et
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive
FROM Users
WHERE Username = 'test';

-- Tüm kullanıcıları listele
SELECT 
    UserId,
    Username,
    DisplayName,
    Email,
    IsActive
FROM Users
ORDER BY UserId;