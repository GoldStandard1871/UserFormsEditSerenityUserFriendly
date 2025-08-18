-- Veritabanı şemasını kontrol et

-- Roles tablosu kolonları
PRINT '=== ROLES TABLOSU KOLONLARI ===';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Roles'
ORDER BY ORDINAL_POSITION;

-- RolePermissions tablosu kolonları
PRINT '';
PRINT '=== ROLEPERMISSIONS TABLOSU KOLONLARI ===';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'RolePermissions'
ORDER BY ORDINAL_POSITION;

-- UserPermissions tablosu kolonları
PRINT '';
PRINT '=== USERPERMISSIONS TABLOSU KOLONLARI ===';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'UserPermissions'
ORDER BY ORDINAL_POSITION;

-- Mevcut roller
PRINT '';
PRINT '=== MEVCUT ROLLER ===';
SELECT * FROM Roles;

-- Test kullanıcısının rolleri
PRINT '';
PRINT '=== TEST KULLANICISININ ROLLERİ ===';
SELECT 
    u.Username,
    r.RoleName,
    ur.UserId,
    ur.RoleId
FROM Users u
LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
LEFT JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'test';

-- Admin kullanıcısının rolleri (karşılaştırma için)
PRINT '';
PRINT '=== ADMIN KULLANICISININ ROLLERİ ===';
SELECT 
    u.Username,
    r.RoleName,
    ur.UserId,
    ur.RoleId
FROM Users u
LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
LEFT JOIN Roles r ON ur.RoleId = r.RoleId
WHERE u.Username = 'admin';

-- RolePermissions örnek kayıtları
PRINT '';
PRINT '=== ROLEPERMISSIONS ÖRNEK KAYITLAR ===';
SELECT TOP 10 * FROM RolePermissions;

-- UserPermissions örnek kayıtları
PRINT '';
PRINT '=== USERPERMISSIONS ÖRNEK KAYITLAR ===';
SELECT TOP 10 * FROM UserPermissions;