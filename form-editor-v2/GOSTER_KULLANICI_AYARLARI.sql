-- =====================================================
-- FORM EDITOR V2 - KULLANICI AYARLARINI GÖRÜNTÜLEME
-- =====================================================
-- Bu scripti SQL Server Management Studio (SSMS) veya 
-- başka bir SQL aracında çalıştırın
-- =====================================================

USE [UserControlForm_Default_v1]
GO

-- =====================================================
-- 1. TÜM KULLANICI AYARLARINI GÖSTER
-- =====================================================
PRINT '===== TÜM FORM EDITOR V2 AYARLARI ====='
PRINT ''

SELECT 
    UserPreferenceId,
    UserId,
    PreferenceType,
    Name,
    Value,
    CreatedDate,
    ModifiedDate,
    IsActive
FROM dbo.UserPreferences
WHERE PreferenceType = 'FormEditorV2'
ORDER BY UserId, Name;

-- =====================================================
-- 2. BELİRLİ BİR KULLANICININ AYARLARI
-- =====================================================
PRINT ''
PRINT '===== KULLANICI ID: 1 İÇİN AYARLAR ====='
PRINT ''

DECLARE @UserId INT = 1;  -- Buraya kendi kullanıcı ID'nizi yazın

SELECT 
    UserPreferenceId,
    UserId,
    Name as [Ayar Adı],
    Value as [Değer],
    CreatedDate as [Oluşturma Tarihi],
    ModifiedDate as [Güncelleme Tarihi],
    CASE IsActive 
        WHEN 1 THEN 'Aktif' 
        ELSE 'Pasif' 
    END as [Durum]
FROM dbo.UserPreferences
WHERE UserId = @UserId
    AND PreferenceType = 'FormEditorV2'
    AND IsActive = 1
ORDER BY 
    CASE 
        WHEN Name = 'AllSettings' THEN 1
        WHEN Name LIKE 'Width%' OR Name LIKE 'Show%' THEN 2
        WHEN Name LIKE 'Field_%' THEN 3
        ELSE 4
    END,
    Name;

-- =====================================================
-- 3. DETAYLI GÖRÜNÜM - KULLANICI VE AYAR TÜRLERİ
-- =====================================================
PRINT ''
PRINT '===== DETAYLI GÖRÜNÜM ====='
PRINT ''

SELECT 
    up.UserPreferenceId,
    up.UserId,
    u.Username as [Kullanıcı Adı],
    CASE 
        WHEN up.Name = 'AllSettings' THEN 'JSON Ayarlar'
        WHEN up.Name = 'WidthMode' THEN 'Genişlik Modu'
        WHEN up.Name = 'ShowWidthControls' THEN 'Genişlik Kontrolleri'
        WHEN up.Name = 'FormOrder' THEN 'Form Sıralaması'
        WHEN up.Name LIKE 'Field_%_Hidden' THEN 'Alan Gizleme - ' + SUBSTRING(up.Name, 7, CHARINDEX('_', up.Name, 7) - 7)
        WHEN up.Name LIKE 'Field_%_Width' THEN 'Alan Genişlik - ' + SUBSTRING(up.Name, 7, CHARINDEX('_', up.Name, 7) - 7)
        WHEN up.Name LIKE 'Field_%_Required' THEN 'Alan Zorunluluk - ' + SUBSTRING(up.Name, 7, CHARINDEX('_', up.Name, 7) - 7)
        ELSE up.Name
    END as [Ayar Türü],
    up.Value as [Değer],
    up.CreatedDate as [İlk Kayıt],
    up.ModifiedDate as [Son Güncelleme]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.IsActive = 1
ORDER BY up.UserId, up.Name;

-- =====================================================
-- 4. JSON AYARLARIN DETAYLI GÖRÜNÜMÜ
-- =====================================================
PRINT ''
PRINT '===== JSON AYARLAR (AllSettings) ====='
PRINT ''

SELECT 
    up.UserId,
    u.Username as [Kullanıcı],
    up.Value as [JSON Ayarları]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.Name = 'AllSettings'
    AND up.IsActive = 1;

-- =====================================================
-- 5. ÖZET İSTATİSTİKLER
-- =====================================================
PRINT ''
PRINT '===== ÖZET İSTATİSTİKLER ====='
PRINT ''

SELECT 
    COUNT(DISTINCT UserId) as [Toplam Kullanıcı],
    COUNT(*) as [Toplam Ayar Kaydı],
    COUNT(CASE WHEN Name = 'AllSettings' THEN 1 END) as [JSON Kayıtları],
    COUNT(CASE WHEN Name LIKE 'Field_%' THEN 1 END) as [Alan Ayarları],
    COUNT(CASE WHEN Name IN ('WidthMode','ShowWidthControls','FormOrder') THEN 1 END) as [Layout Ayarları],
    MIN(CreatedDate) as [İlk Kayıt Tarihi],
    MAX(ModifiedDate) as [Son Güncelleme Tarihi]
FROM dbo.UserPreferences
WHERE PreferenceType = 'FormEditorV2'
    AND IsActive = 1;

-- =====================================================
-- NASIL KULLANILIR?
-- =====================================================
/*
1. SQL Server Management Studio (SSMS) açın
2. UserControlForm_Default_v1 veritabanına bağlanın
3. Bu scripti kopyalayıp yapıştırın
4. F5 tuşuna basarak çalıştırın

VEYA

1. Visual Studio'da SQL Server Object Explorer açın
2. UserControlForm_Default_v1 veritabanına sağ tıklayın
3. "New Query" seçin
4. Bu scripti yapıştırıp çalıştırın

NOT: @UserId değişkenini kendi kullanıcı ID'niz ile değiştirin!
*/