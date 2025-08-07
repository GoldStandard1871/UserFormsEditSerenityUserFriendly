-- UserPreference tablosunu kontrol et (Form Editor V2 için)
-- Bu script UserPreference tablosundaki Form Editor V2 ayarlarını görüntüler

-- Tablo kontrolü
IF OBJECT_ID('UserPreference', 'U') IS NOT NULL
BEGIN
    PRINT 'UserPreference tablosu mevcut'
    PRINT '================================'
    PRINT ''
    
    -- Genel istatistikler
    PRINT 'GENEL İSTATİSTİKLER:'
    SELECT 
        COUNT(*) as [Toplam Kayıt],
        COUNT(DISTINCT UserId) as [Benzersiz Kullanıcı],
        COUNT(CASE WHEN PreferenceType = 'FormEditorV2' THEN 1 END) as [FormEditorV2 Kayıtları]
    FROM UserPreference;
    
    PRINT ''
    PRINT 'FORM EDITOR V2 AYARLARI:'
    PRINT '------------------------'
    
    -- Son eklenen FormEditorV2 kayıtları
    SELECT TOP 20
        UserPreferenceId,
        UserId,
        Name,
        LEFT(Value, 100) + CASE WHEN LEN(Value) > 100 THEN '...' ELSE '' END as Value,
        CreatedDate,
        ModifiedDate,
        IsActive
    FROM UserPreference
    WHERE PreferenceType = 'FormEditorV2'
    ORDER BY COALESCE(ModifiedDate, CreatedDate) DESC;
    
    -- Kullanıcı bazında özet
    PRINT ''
    PRINT 'KULLANICI BAZINDA ÖZET:'
    SELECT 
        UserId,
        COUNT(*) as [Ayar Sayısı],
        COUNT(CASE WHEN Name LIKE 'Field_%' THEN 1 END) as [Alan Ayarları],
        COUNT(CASE WHEN Name IN ('WidthMode','ShowWidthControls','FormOrder') THEN 1 END) as [Layout Ayarları],
        COUNT(CASE WHEN Name = 'AllSettings' THEN 1 END) as [JSON Ayarı],
        MAX(CreatedDate) as [İlk Kayıt],
        MAX(ModifiedDate) as [Son Güncelleme]
    FROM UserPreference
    WHERE PreferenceType = 'FormEditorV2'
        AND IsActive = 1
    GROUP BY UserId
    ORDER BY UserId;
    
    -- Ayar türlerine göre dağılım
    PRINT ''
    PRINT 'AYAR TÜRLERİNE GÖRE DAĞILIM:'
    SELECT 
        CASE 
            WHEN Name LIKE 'Field_%_Hidden' THEN 'Alan Gizleme'
            WHEN Name LIKE 'Field_%_Width' THEN 'Alan Genişlik'
            WHEN Name LIKE 'Field_%_Required' THEN 'Alan Zorunluluk'
            WHEN Name LIKE 'Field_%_FieldHidden' THEN 'Alan İçi Gizleme'
            WHEN Name = 'WidthMode' THEN 'Genişlik Modu'
            WHEN Name = 'ShowWidthControls' THEN 'Genişlik Kontrolleri'
            WHEN Name = 'FormOrder' THEN 'Form Sıralaması'
            WHEN Name = 'AllSettings' THEN 'Tüm Ayarlar (JSON)'
            ELSE 'Diğer'
        END as [Ayar Türü],
        COUNT(*) as [Sayı]
    FROM UserPreference
    WHERE PreferenceType = 'FormEditorV2'
        AND IsActive = 1
    GROUP BY 
        CASE 
            WHEN Name LIKE 'Field_%_Hidden' THEN 'Alan Gizleme'
            WHEN Name LIKE 'Field_%_Width' THEN 'Alan Genişlik'
            WHEN Name LIKE 'Field_%_Required' THEN 'Alan Zorunluluk'
            WHEN Name LIKE 'Field_%_FieldHidden' THEN 'Alan İçi Gizleme'
            WHEN Name = 'WidthMode' THEN 'Genişlik Modu'
            WHEN Name = 'ShowWidthControls' THEN 'Genişlik Kontrolleri'
            WHEN Name = 'FormOrder' THEN 'Form Sıralaması'
            WHEN Name = 'AllSettings' THEN 'Tüm Ayarlar (JSON)'
            ELSE 'Diğer'
        END
    ORDER BY [Sayı] DESC;
    
    -- Pasif kayıtlar
    DECLARE @InactiveCount INT = (
        SELECT COUNT(*) 
        FROM UserPreference 
        WHERE PreferenceType = 'FormEditorV2' AND IsActive = 0
    );
    
    IF @InactiveCount > 0
    BEGIN
        PRINT ''
        PRINT 'PASİF KAYITLAR: ' + CAST(@InactiveCount AS VARCHAR) + ' adet'
    END
END
ELSE
BEGIN
    PRINT 'UserPreference tablosu bulunamadı!'
    PRINT 'Önce UserPreference_UpdatedSchema.sql scriptini çalıştırın.'
END

-- Belirli bir kullanıcının detaylı ayarlarını görmek için:
/*
DECLARE @UserId INT = 1; -- Kullanıcı ID'sini buraya girin

PRINT ''
PRINT 'KULLANICI ' + CAST(@UserId AS VARCHAR) + ' İÇİN DETAYLI AYARLAR:'
PRINT '---------------------------------------'

SELECT 
    Name,
    Value,
    CreatedDate,
    ModifiedDate,
    IsActive
FROM UserPreference
WHERE UserId = @UserId 
    AND PreferenceType = 'FormEditorV2'
    AND IsActive = 1
ORDER BY 
    CASE 
        WHEN Name = 'AllSettings' THEN 1
        WHEN Name LIKE 'Width%' THEN 2
        WHEN Name LIKE 'Show%' THEN 3
        WHEN Name LIKE 'Form%' THEN 4
        WHEN Name LIKE 'Field_%' THEN 5
        ELSE 6
    END,
    Name;
*/