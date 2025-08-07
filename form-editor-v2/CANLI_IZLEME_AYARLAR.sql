-- =====================================================
-- CANLI İZLEME - FORM EDITOR V2 AYARLARI
-- =====================================================
-- Bu sorguyu açık bırakıp F5 ile yenileyerek
-- değişiklikleri canlı görebilirsiniz
-- =====================================================

USE [UserControlForm_Default_v1]
GO

-- Ekranı temizle
PRINT REPLICATE('=', 80)
PRINT 'FORM EDITOR V2 - KULLANICI AYARLARI CANLI İZLEME'
PRINT 'Tarih/Saat: ' + CONVERT(VARCHAR, GETDATE(), 120)
PRINT REPLICATE('=', 80)
PRINT ''

-- =====================================================
-- SON 5 DAKİKADA YAPILAN DEĞİŞİKLİKLER
-- =====================================================
PRINT '>>> SON 5 DAKİKADAKİ DEĞİŞİKLİKLER <<<'
PRINT ''

SELECT 
    up.UserPreferenceId as [ID],
    up.UserId,
    u.Username as [Kullanıcı],
    up.Name as [Ayar],
    up.Value as [Değer],
    CASE 
        WHEN up.ModifiedDate IS NULL THEN 'YENİ'
        ELSE 'GÜNCELLENDİ'
    END as [İşlem],
    COALESCE(up.ModifiedDate, up.CreatedDate) as [Zaman]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND COALESCE(up.ModifiedDate, up.CreatedDate) >= DATEADD(MINUTE, -5, GETDATE())
ORDER BY COALESCE(up.ModifiedDate, up.CreatedDate) DESC;

-- =====================================================
-- AKTİF KULLANICILAR VE AYAR SAYILARI
-- =====================================================
PRINT ''
PRINT '>>> AKTİF KULLANICILAR <<<'
PRINT ''

SELECT 
    up.UserId,
    u.Username as [Kullanıcı Adı],
    COUNT(*) as [Toplam Ayar],
    SUM(CASE WHEN up.Name LIKE 'Field_%' THEN 1 ELSE 0 END) as [Alan Ayarları],
    SUM(CASE WHEN up.Name = 'AllSettings' THEN 1 ELSE 0 END) as [JSON],
    MAX(COALESCE(up.ModifiedDate, up.CreatedDate)) as [Son İşlem]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.IsActive = 1
GROUP BY up.UserId, u.Username
ORDER BY [Son İşlem] DESC;

-- =====================================================
-- MEVCUT TÜM AYARLAR (DETAYLI)
-- =====================================================
PRINT ''
PRINT '>>> TÜM AKTİF AYARLAR <<<'
PRINT ''

SELECT 
    '┌─ ID: ' + CAST(UserPreferenceId AS VARCHAR) + ' ─┐' as [═══════════════],
    '│ Kullanıcı: ' + CAST(UserId AS VARCHAR) + 
    CASE 
        WHEN LEN(u.Username) > 0 THEN ' (' + u.Username + ')'
        ELSE ''
    END as [Kullanıcı Bilgisi],
    '│ Ayar: ' + Name as [Ayar Adı],
    '│ Değer: ' + 
    CASE 
        WHEN LEN(Value) > 50 THEN LEFT(Value, 50) + '...'
        ELSE Value
    END as [Değer],
    '│ Oluşturma: ' + CONVERT(VARCHAR, CreatedDate, 120) as [Oluşturma],
    '│ Güncelleme: ' + ISNULL(CONVERT(VARCHAR, ModifiedDate, 120), 'YOK') as [Güncelleme],
    '└─────────────┘' as [═══════════════]
FROM dbo.UserPreferences up
LEFT JOIN dbo.Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'FormEditorV2'
    AND up.IsActive = 1
ORDER BY up.UserId, up.UserPreferenceId;

-- =====================================================
-- HIZLI KONTROL PANELİ
-- =====================================================
PRINT ''
PRINT '>>> HIZLI KONTROL <<<'
PRINT ''

DECLARE @TotalUsers INT = (SELECT COUNT(DISTINCT UserId) FROM dbo.UserPreferences WHERE PreferenceType = 'FormEditorV2' AND IsActive = 1);
DECLARE @TotalSettings INT = (SELECT COUNT(*) FROM dbo.UserPreferences WHERE PreferenceType = 'FormEditorV2' AND IsActive = 1);
DECLARE @LastUpdate DATETIME = (SELECT MAX(COALESCE(ModifiedDate, CreatedDate)) FROM dbo.UserPreferences WHERE PreferenceType = 'FormEditorV2');

PRINT '• Toplam Kullanıcı: ' + CAST(@TotalUsers AS VARCHAR)
PRINT '• Toplam Ayar: ' + CAST(@TotalSettings AS VARCHAR)
PRINT '• Son Güncelleme: ' + ISNULL(CONVERT(VARCHAR, @LastUpdate, 120), 'YOK')
PRINT ''
PRINT 'F5 tuşuna basarak yenileyin...'
PRINT REPLICATE('=', 80)

-- =====================================================
-- KULLANIM TALİMATI
-- =====================================================
/*
NASIL KULLANILIR?
================

1. SSMS'de bu scripti açın
2. F5 ile çalıştırın
3. Form Editor V2'de değişiklik yapın
4. Tekrar F5'e basarak değişiklikleri görün

İPUCU: Bu pencereyi açık bırakın ve düzenli olarak
F5 ile yenileyerek canlı takip edin!
*/