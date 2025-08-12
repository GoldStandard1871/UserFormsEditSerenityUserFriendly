# Aktivite Sistemi Debug Kontrol Listesi

## 1. Visual Studio Debug Output Kontrolleri

### Login Sırasında Görmeniz Gereken Loglar:

```
[AccountPage] ========================================
[AccountPage] LOGIN SUCCESS for test
[AccountPage] UserId: [ID]
[AccountPage] DisplayName: Test Kullanıcısı
[AccountPage] ========================================
[AccountPage] ✅ UserActivityTracker.RecordLogin called successfully
[UserActivityTracker] RecordLogin called for test at [TIME]
[UserActivityTracker] Added login record #1 for test
```

### SignalR Bağlantısında Görmeniz Gereken Loglar:

```
[UserActivityHub] OnConnectedAsync START - IsAuthenticated: True, Name: test
[UserActivityHub] ✅ User Connected - UserId: [ID], Username: test
[UserActivityTracker] UpdateConnection called for test
[UserActivityHub] Total active users: 1
[UserActivityHub] ✅ UserStatusChanged event sent for user test
```

### Logout/Disconnect Sırasında:

```
[UserActivityHub] OnDisconnectedAsync - UserId: [ID] disconnected
[UserActivityTracker] User test went OFFLINE at [TIME]
[UserActivityTracker] Status set to offline for UserId: [ID]
```

## 2. Browser Console Kontrolleri

Dashboard sayfasında F12 > Console:

```javascript
// Görmeniz gerekenler:
"Current user: test, IsAuthenticated: True"
"Starting SignalR initialization for user: test"
"✅ SignalR connected successfully"
"📊 Connection state: Connected"
"👤 Current user: test"
```

## 3. SQL Kontrolleri

```sql
-- Kullanıcı bilgilerini kontrol et
SELECT UserId, Username, DisplayName, IsActive, [Source]
FROM Users
WHERE Username IN ('test', 'admin');

-- Kullanıcı ID'sini kontrol et (0'dan büyük olmalı)
SELECT UserId, Username 
FROM Users 
WHERE Username = 'test';
```

## 4. Olası Sorunlar ve Çözümleri

### Sorun 1: UserId 0 veya NULL
**Kontrol:** AccountPage loglarında "WARNING: UserId is 0 or invalid"
**Çözüm:** Veritabanında test kullanıcısının UserId'si var mı kontrol edin

### Sorun 2: SignalR Bağlanmıyor
**Kontrol:** Browser console'da "SignalR connection error"
**Çözüm:** 
- SignalR endpoint'i doğru mu? (/userActivityHub)
- Authentication cookie var mı?

### Sorun 3: RecordLogin Çağrılmıyor
**Kontrol:** AccountPage loglarında RecordLogin mesajı yok
**Çözüm:** Login başarılı mı? PasswordValidationResult.Valid dönüyor mu?

## 5. Test Adımları

1. **Visual Studio'da Output > Debug penceresini açın**
2. **Uygulamayı Debug modda başlatın**
3. **Test kullanıcısı ile login yapın**
4. **Debug loglarını kontrol edin**
5. **Browser console'u kontrol edin (F12)**
6. **Admin ile giriş yapıp aktivite panelini kontrol edin**

## 6. Hangi Logları Görüyorsunuz?

Lütfen aşağıdaki bilgileri paylaşın:

- [ ] AccountPage LOGIN SUCCESS logu var mı?
- [ ] UserId değeri 0'dan büyük mü?
- [ ] UserActivityTracker.RecordLogin çağrılıyor mu?
- [ ] SignalR connected successfully mesajı var mı?
- [ ] UserActivityHub OnConnectedAsync çalışıyor mu?
- [ ] Browser console'da hata var mı?

## 7. Quick Fix Script

Eğer hiç log görmüyorsanız, using statement'ları kontrol edin:

```csharp
// AccountPage.cs üstünde olmalı:
using UserControlForm.Common.UserActivity;

// UserActivityHub.cs üstünde olmalı:
using System.Linq;
```