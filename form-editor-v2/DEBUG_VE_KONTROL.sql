-- =====================================================
-- FORM EDITOR V2 - DEBUG VE KONTROL SCRİPTİ
-- =====================================================
USE [UserControlForm_Default_v1]
GO

PRINT '========================================'
PRINT 'FORM EDITOR V2 - VERİ KONTROL'
PRINT '========================================'
PRINT ''

-- 1. Tablo var mı kontrol et
IF OBJECT_ID('dbo.UserPreferences', 'U') IS NOT NULL
BEGIN
    PRINT '✓ UserPreferences tablosu mevcut'
    
    -- Tablo yapısını göster
    PRINT ''
    PRINT 'TABLO YAPISI:'
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'UserPreferences'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT '✗ UserPreferences tablosu BULUNAMADI!'
    PRINT 'Önce UserControlForm_UserPreferences_Schema.sql scriptini çalıştırın!'
    RETURN;
END

-- 2. Herhangi bir FormEditorV2 kaydı var mı?
PRINT ''
PRINT '========================================'
PRINT 'TÜM FORM EDITOR V2 KAYITLARI:'
PRINT '========================================'

DECLARE @TotalCount INT = (SELECT COUNT(*) FROM dbo.UserPreferences WHERE PreferenceType = 'FormEditorV2');

IF @TotalCount = 0
BEGIN
    PRINT '✗ HİÇ KAYIT BULUNAMADI!'
    PRINT ''
    PRINT 'Olası Sebepler:'
    PRINT '1. Henüz "Kaydet" butonuna basmadınız'
    PRINT '2. Kullanıcı ID problemi var'
    PRINT '3. Endpoint çalışmıyor'
    PRINT ''
    PRINT 'Çözüm:'
    PRINT '1. Form Editor V2 sayfasına gidin'
    PRINT '2. Herhangi bir değişiklik yapın (alan genişliği, gizleme vb.)'
    PRINT '3. "Kaydet" butonuna basın'
    PRINT '4. Bu scripti tekrar çalıştırın'
END
ELSE
BEGIN
    PRINT '✓ Toplam ' + CAST(@TotalCount AS VARCHAR) + ' kayıt bulundu'
    PRINT ''
    
    -- Tüm kayıtları göster
    SELECT 
        UserPreferenceId as [ID],
        UserId as [Kullanıcı],
        Name as [Ayar Adı],
        CASE 
            WHEN LEN(Value) > 100 THEN LEFT(Value, 100) + '...'
            ELSE Value
        END as [Değer],
        CreatedDate as [Oluşturma],
        ModifiedDate as [Güncelleme],
        IsActive as [Aktif]
    FROM dbo.UserPreferences
    WHERE PreferenceType = 'FormEditorV2'
    ORDER BY UserId, CreatedDate DESC;
END

-- 3. Users tablosunu kontrol et
PRINT ''
PRINT '========================================'
PRINT 'KULLANICI BİLGİLERİ:'
PRINT '========================================'

IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
BEGIN
    SELECT TOP 5
        UserId,
        Username,
        DisplayName
    FROM dbo.Users
    ORDER BY UserId;
    
    PRINT ''
    PRINT 'NOT: Form Editor V2''ye giriş yaptığınız kullanıcının ID''sini not edin.'
END
ELSE
BEGIN
    PRINT 'Users tablosu bulunamadı - Kullanıcı bilgileri gösterilemiyor'
END

-- 4. Son 10 dakikada eklenen/güncellenen kayıtlar
PRINT ''
PRINT '========================================'
PRINT 'SON 10 DAKİKADAKİ DEĞİŞİKLİKLER:'
PRINT '========================================'

SELECT 
    UserPreferenceId,
    UserId,
    Name,
    CASE 
        WHEN LEN(Value) > 50 THEN LEFT(Value, 50) + '...'
        ELSE Value
    END as Value,
    CreatedDate,
    ModifiedDate,
    CASE 
        WHEN ModifiedDate IS NULL THEN 'YENİ KAYIT'
        ELSE 'GÜNCELLENDİ'
    END as [İşlem]
FROM dbo.UserPreferences
WHERE PreferenceType = 'FormEditorV2'
    AND (CreatedDate >= DATEADD(MINUTE, -10, GETDATE()) 
         OR ModifiedDate >= DATEADD(MINUTE, -10, GETDATE()))
ORDER BY COALESCE(ModifiedDate, CreatedDate) DESC;

-- 5. Test verisi ekleme (isteğe bağlı)
PRINT ''
PRINT '========================================'
PRINT 'TEST VERİSİ EKLEMEK İÇİN:'
PRINT '========================================'
PRINT 'Aşağıdaki komutu çalıştırın (UserId''yi değiştirin):'
PRINT ''
PRINT '/*'
PRINT 'DECLARE @TestUserId INT = 1; -- Kendi kullanıcı ID''nizi yazın'
PRINT ''
PRINT 'INSERT INTO dbo.UserPreferences (UserId, PreferenceType, Name, Value, CreatedDate, IsActive)'
PRINT 'VALUES (@TestUserId, ''FormEditorV2'', ''TEST_AllSettings'', ''{}'', GETDATE(), 1);'
PRINT ''
PRINT 'PRINT ''Test verisi eklendi!'''
PRINT '*/'

-- 6. Veritabanı bilgisi
PRINT ''
PRINT '========================================'
PRINT 'VERİTABANI BİLGİSİ:'
PRINT '========================================'
PRINT 'Veritabanı: ' + DB_NAME()
PRINT 'Sunucu: ' + @@SERVERNAME
PRINT 'Kullanıcı: ' + SUSER_NAME()
PRINT 'Tarih/Saat: ' + CONVERT(VARCHAR, GETDATE(), 120)

-- 7. Sorun giderme
PRINT ''
PRINT '========================================'
PRINT 'SORUN GİDERME:'
PRINT '========================================'
PRINT '1. Browser konsolunda hata var mı kontrol edin (F12)'
PRINT '2. Network sekmesinde SaveUserSettings isteği gidiyor mu?'
PRINT '3. Visual Studio Output penceresinde debug logları var mı?'
PRINT '4. Connection string doğru mu?'
PRINT ''
PRINT 'Bu scripti F5 ile yenileyerek takip edin...'