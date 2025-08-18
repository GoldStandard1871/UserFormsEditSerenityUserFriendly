-- Test kullanıcısına Northwind yetkilerini vermenin en basit yolu
-- UserPermissions tablosuna direkt yetki ekle

-- Test kullanıcısının ID'sini bul
DECLARE @TestUserId INT;
SELECT @TestUserId = UserId FROM Users WHERE Username = 'test';

IF @TestUserId IS NOT NULL
BEGIN
    -- Mevcut Northwind yetkilerini temizle
    DELETE FROM UserPermissions WHERE UserId = @TestUserId AND PermissionKey LIKE 'Northwind%';
    
    -- Northwind yetkilerini ekle
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:General', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Customer:View', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Customer:Modify', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Customer:Delete', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Product:View', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Product:Modify', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Product:Delete', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Order:View', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Order:Modify', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Order:Delete', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Category:View', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Category:Modify', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Supplier:View', 1);
    INSERT INTO UserPermissions (UserId, PermissionKey, Granted) VALUES (@TestUserId, 'Northwind:Supplier:Modify', 1);
    
    PRINT 'Test kullanıcısına Northwind yetkileri başarıyla verildi!';
    PRINT 'Kullanıcı ID: ' + CAST(@TestUserId AS VARCHAR);
END
ELSE
BEGIN
    PRINT 'HATA: test kullanıcısı bulunamadı!';
END

-- Kontrol için
SELECT * FROM UserPermissions WHERE UserId = @TestUserId AND PermissionKey LIKE 'Northwind%';