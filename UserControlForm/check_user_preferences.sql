-- UserControlForm_Default_v1 veritabanındaki kullanıcı tercihlerini kontrol et
USE UserControlForm_Default_v1;

-- Tüm kullanıcı form tercihlerini listele
SELECT 
    up.UserPreferenceId,
    u.Username,
    u.DisplayName,
    up.PreferenceType,
    up.Name as PreferenceKey,
    up.Value as FormDesign
FROM UserPreferences up
INNER JOIN Users u ON up.UserId = u.UserId
WHERE up.PreferenceType = 'UserFormDesign'
ORDER BY u.Username, up.Name;

-- Belirli bir kullanıcının form tercihlerini göster (örnek: admin)
SELECT 
    Name as PreferenceKey,
    Value as FormDesign
FROM UserPreferences
WHERE UserId = (SELECT UserId FROM Users WHERE Username = 'admin')
    AND PreferenceType = 'UserFormDesign';