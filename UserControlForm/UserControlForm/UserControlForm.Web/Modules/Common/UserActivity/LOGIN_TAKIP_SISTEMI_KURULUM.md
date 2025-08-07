# Login Takip Sistemi - Kurulum ve Kullanım Kılavuzu

## 🎯 Genel Bakış

Bu sistem, kullanıcıların login/logout aktivitelerini gerçek zamanlı olarak takip eder ve Dashboard'da gösterir. SignalR kullanarak anlık güncellemeler sağlar ve IP adreslerinden lokasyon tespiti yapar.

## 📋 Özellikler

- ✅ Gerçek zamanlı online/offline durum takibi
- ✅ IP adresi ve lokasyon bilgisi
- ✅ Browser ve işletim sistemi tespiti
- ✅ Son aktivite zamanı
- ✅ Otomatik güncellenen dashboard widget'ı
- ✅ SignalR ile anlık bildirimler
- ✅ Memory cache kullanımı (DB gerekmez)

## 🚀 Kurulum Adımları

### 1. NPM Paketlerini Yükleyin

```bash
cd UserControlForm.Web
npm install
```

Bu komut `@microsoft/signalr` paketini otomatik olarak yükleyecektir (package.json'a eklenmiştir).

### 2. TypeScript Build

```bash
npm run tsbuild
```

### 3. Projeyi Derleyin ve Çalıştırın

Visual Studio'da projeyi derleyin veya:

```bash
dotnet build
dotnet run
```

## 📁 Eklenen Dosyalar

### Backend

1. **UserActivityTracker.cs**
   - Kullanıcı aktivitelerini memory'de saklar
   - Login/logout kayıtlarını tutar
   - User agent parsing yapar

2. **UserActivityHub.cs**
   - SignalR hub implementation
   - Real-time bağlantı yönetimi
   - IP lokasyon servisi entegrasyonu

3. **UserActivityEndpoint.cs**
   - REST API endpoint'leri
   - Aktivite listesi ve online kullanıcılar

### Frontend

4. **UserActivityWidget.tsx**
   - React tabanlı dashboard widget'ı
   - SignalR client entegrasyonu
   - Otomatik güncelleme (30 saniyede bir heartbeat)

5. **useractivity.css**
   - Widget stil dosyası
   - Responsive tasarım

### Entegrasyon

6. **Startup.cs Değişiklikleri**
   - SignalR servisi eklendi
   - Memory cache eklendi
   - Hub routing eklendi

7. **AccountPage.cs Değişiklikleri**
   - Login event'inde aktivite kaydı
   - Logout event'inde aktivite güncelleme

8. **DashboardIndex.cshtml Değişiklikleri**
   - Widget container eklendi
   - Widget initialization

## 🎨 Kullanım

### Dashboard'da Görüntüleme

Login olduktan sonra Dashboard sayfasında en altta "Kullanıcı Aktiviteleri" widget'ını göreceksiniz.

Widget şunları gösterir:
- Online/Offline durumu (yeşil/kırmızı nokta)
- Kullanıcı adı ve display name
- IP adresi ve lokasyon
- Browser ve işletim sistemi
- Son aktivite zamanı
- Aktivite tipi (Login/Logout)

### Gerçek Zamanlı Güncellemeler

- Bir kullanıcı login olduğunda otomatik olarak listede görünür
- Logout olduğunda durumu "Offline" olarak güncellenir
- Her 30 saniyede bir heartbeat gönderilir
- Tüm değişiklikler anında tüm kullanıcılara yansır

## 🔧 Özelleştirme

### Lokasyon Servisi

Varsayılan olarak ücretsiz `ip-api.com` servisi kullanılır. Değiştirmek için:

```csharp
// UserActivityHub.cs içinde UpdateUserLocation metodunu düzenleyin
var response = await httpClient.GetAsync($"http://ip-api.com/json/{ipAddress}");
```

### Heartbeat Süresi

```typescript
// UserActivityWidget.tsx içinde
this.heartbeatInterval = window.setInterval(() => {
    // ...
}, 30000); // 30 saniye - değiştirilebilir
```

### Temizleme Süresi

Eski kayıtları temizlemek için:

```csharp
// Endpoint üzerinden çağırılabilir
UserActivityTracker.RemoveInactiveUsers(TimeSpan.FromHours(24));
```

## 🛠️ Sorun Giderme

### SignalR Bağlantı Hatası

Browser konsolu açın ve hataları kontrol edin:
- CORS hatası varsa Startup.cs'de CORS ayarlarını kontrol edin
- 404 hatası varsa hub routing'i kontrol edin

### Lokasyon Görünmüyor

- Local IP adresleri için "Local Network" gösterilir
- Firewall ip-api.com'a erişimi engelliyor olabilir
- Rate limit'e takılmış olabilirsiniz (dakikada 45 istek limiti)

### Widget Görünmüyor

1. Browser cache'ini temizleyin
2. F12 ile konsolu açın ve hataları kontrol edin
3. Network sekmesinde SignalR bağlantısını kontrol edin

## 📊 Performans

- Memory cache kullanıldığı için DB yükü yoktur
- SignalR WebSocket kullanır, düşük latency sağlar
- IP lokasyon sorguları asenkron yapılır, UI'yi bloklamaz
- Heartbeat sadece aktif kullanıcılar için gönderilir

## 🔐 Güvenlik

- Sadece authenticated kullanıcılar hub'a bağlanabilir
- User ID otomatik olarak claim'lerden alınır
- IP adresleri sadece lokasyon tespiti için kullanılır
- Hassas bilgi saklanmaz veya loglanmaz

## 📝 Notlar

- Sistem restart edildiğinde memory'deki veriler silinir
- Kalıcı saklama için UserActivityTracker'ı DB kullanacak şekilde değiştirebilirsiniz
- SignalR bağlantısı koptuğunda otomatik reconnect yapılır
- Multiple browser/tab desteği vardır