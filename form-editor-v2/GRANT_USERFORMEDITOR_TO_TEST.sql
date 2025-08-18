-- Test kullanıcısına UserFormEditor yetkisi verme
-- Tarih: 2025-08-13

USE [UserControlForm_Default_v1]
GO

-- Test kullanıcısının ID'sini bul
DECLARE @TestUserId INT
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test'

IF @TestUserId IS NULL
BEGIN
    PRINT 'HATA: Test kullanıcısı bulunamadı!'
    RETURN
END

PRINT 'Test kullanıcısı bulundu. UserId: ' + CAST(@TestUserId AS VARCHAR(10))

-- UserFormEditor yetkisinin var olup olmadığını kontrol et
IF NOT EXISTS (SELECT * FROM UserPermissions 
               WHERE UserId = @TestUserId 
               AND PermissionKey = 'Administration:UserFormEditor')
BEGIN
    -- Read yetkisi ekle
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
    VALUES (@TestUserId, 'Administration:UserFormEditor', 1)
    
    PRINT 'UserFormEditor yetkisi test kullanıcısına verildi.'
END
ELSE
BEGIN
    -- Yetki varsa aktif olduğundan emin ol
    UPDATE UserPermissions 
    SET Granted = 1
    WHERE UserId = @TestUserId 
    AND PermissionKey = 'Administration:UserFormEditor'
    
    PRINT 'UserFormEditor yetkisi zaten mevcut, aktif edildi.'
END

-- Test kullanıcısına genel Administration yetkisi de verelim
IF NOT EXISTS (SELECT * FROM UserPermissions 
               WHERE UserId = @TestUserId 
               AND PermissionKey = 'Administration')
BEGIN
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted)
    VALUES (@TestUserId, 'Administration', 1)
    
    PRINT 'Administration yetkisi test kullanıcısına verildi.'
END

-- Test kullanıcısının tüm yetkilerini listele
PRINT ''
PRINT 'Test kullanıcısının mevcut yetkileri:'
PRINT '--------------------------------------'

SELECT 
    PermissionKey,
    CASE WHEN Granted = 1 THEN 'Verildi' ELSE 'Reddedildi' END as Durum
FROM UserPermissions
WHERE UserId = @TestUserId
ORDER BY PermissionKey

PRINT ''
PRINT 'İşlem tamamlandı. Test kullanıcısı artık UserFormEditor modülüne erişebilir.'
PRINT 'Test için: test kullanıcısı ile giriş yapın ve Administration > User Form Editor menüsüne gidin.'