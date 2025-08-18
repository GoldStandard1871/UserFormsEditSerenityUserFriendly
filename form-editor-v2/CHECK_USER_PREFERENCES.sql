-- UserPreferences tablosundaki FormFieldOrder kayıtlarını kontrol et
-- Bu script UserFormEditor dialog'unda yapılan alan sıralama ve görünürlük ayarlarını gösterir

USE [UserControlForm_Default_v1]
GO

-- Tüm UserFormFieldOrder tercihlerini göster
SELECT 
    p.UserId,
    u.Username,
    p.PreferenceType,
    p.Name as PreferenceKey,
    p.Value as FormDesign,
    LEN(p.Value) as JsonLength
FROM UserPreferences p
LEFT JOIN Users u ON p.UserId = u.UserId
WHERE p.PreferenceType = 'UserPreference'
  AND p.Name LIKE 'UserFormFieldOrder:%'
ORDER BY p.UserId, p.Name

-- Detaylı görünüm - JSON içeriğini göster
PRINT ''
PRINT 'Detaylı JSON içerikleri:'
PRINT '------------------------'

SELECT 
    u.Username,
    p.Name as PreferenceKey,
    p.Value as FormDesign
FROM UserPreferences p
LEFT JOIN Users u ON p.UserId = u.UserId
WHERE p.PreferenceType = 'UserPreference'
  AND p.Name LIKE 'UserFormFieldOrder:%'

-- Belirli bir kullanıcının tercihlerini göster (örnek: admin)
PRINT ''
PRINT 'Admin kullanıcısının form tercihleri:'
PRINT '-------------------------------------'

SELECT 
    p.Name as PreferenceKey,
    p.Value as FormDesign
FROM UserPreferences p
JOIN Users u ON p.UserId = u.UserId
WHERE u.Username = 'admin'
  AND p.PreferenceType = 'UserPreference'
  AND p.Name LIKE 'UserFormFieldOrder:%'

-- Test kullanıcısının tercihlerini göster
PRINT ''
PRINT 'Test kullanıcısının form tercihleri:'
PRINT '------------------------------------'

SELECT 
    p.Name as PreferenceKey,
    p.Value as FormDesign
FROM UserPreferences p
JOIN Users u ON p.UserId = u.UserId
WHERE u.Username = 'test'
  AND p.PreferenceType = 'UserPreference'
  AND p.Name LIKE 'UserFormFieldOrder:%'