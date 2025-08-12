using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace UserControlForm.Common.UserActivity
{
    public class UserActivityTracker
    {
        private static readonly ConcurrentDictionary<int, UserActivityInfo> _userActivities = new();
        
        public class UserActivityInfo
        {
            public int UserId { get; set; }
            public string Username { get; set; }
            public string DisplayName { get; set; }
            public bool IsOnline { get; set; }
            public DateTime LastActivityTime { get; set; }
            public DateTime LoginTime { get; set; }
            public string IpAddress { get; set; }
            public string Location { get; set; }
            public string UserAgent { get; set; }
            public string ConnectionId { get; set; }
            public UserStatus Status { get; set; }
            public List<LoginHistory> LoginHistoryList { get; set; } = new List<LoginHistory>();
        }
        
        public class LoginHistory
        {
            public DateTime LoginTime { get; set; }
            public DateTime? LogoutTime { get; set; }
            public string IpAddress { get; set; }
            public string UserAgent { get; set; }
        }
        
        public enum UserStatus
        {
            Online,
            Away,    // 5 dakika işlem yok
            Busy,
            Offline
        }
        
        // Gerçek login işlemi (AccountPage'den çağrılır)
        public static void RecordLogin(int userId, string username, string displayName, string ipAddress, string userAgent, string connectionId)
        {
            System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] RecordLogin called for {username} at {DateTime.Now:HH:mm:ss}");
            
            _userActivities.AddOrUpdate(userId, 
                // Yeni kullanıcı için
                key => {
                    var newActivity = new UserActivityInfo
                    {
                        UserId = userId,
                        Username = username,
                        DisplayName = displayName,
                        IsOnline = true,
                        LastActivityTime = DateTime.Now,
                        LoginTime = DateTime.Now,
                        IpAddress = ipAddress,
                        UserAgent = userAgent,
                        ConnectionId = connectionId,
                        Status = UserStatus.Online,
                        LoginHistoryList = new List<LoginHistory>()
                    };
                    
                    // İlk login kaydını ekle
                    newActivity.LoginHistoryList.Add(new LoginHistory
                    {
                        LoginTime = DateTime.Now,
                        IpAddress = ipAddress,
                        UserAgent = userAgent
                    });
                    
                    System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] New user created with first login record");
                    return newActivity;
                },
                // Mevcut kullanıcı için
                (key, existing) => 
                {
                    // Kullanıcı bilgilerini güncelle
                    existing.IsOnline = true;
                    existing.LastActivityTime = DateTime.Now;
                    existing.LoginTime = DateTime.Now;
                    existing.ConnectionId = connectionId;
                    existing.Status = UserStatus.Online;
                    existing.IpAddress = ipAddress;
                    existing.UserAgent = userAgent;
                    existing.DisplayName = displayName;
                    
                    // Login geçmişini koru ve yeni login ekle
                    if (existing.LoginHistoryList == null)
                        existing.LoginHistoryList = new List<LoginHistory>();
                    
                    // Son 10 login kaydını tut
                    if (existing.LoginHistoryList.Count >= 10)
                    {
                        existing.LoginHistoryList.RemoveAt(0);
                    }
                    
                    // Yeni login kaydı ekle
                    existing.LoginHistoryList.Add(new LoginHistory
                    {
                        LoginTime = DateTime.Now,
                        IpAddress = ipAddress,
                        UserAgent = userAgent
                    });
                    
                    System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] Added login record #{existing.LoginHistoryList.Count} for {username}");
                    return existing;
                });
        }
        
        // SignalR connection güncellemesi (login kaydı eklemez)
        public static void UpdateConnection(int userId, string username, string displayName, string ipAddress, string userAgent, string connectionId)
        {
            System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] UpdateConnection called for {username} (UserId: {userId})");
            
            // Kullanıcı zaten varsa ve online ise sadece connection güncelle
            if (_userActivities.TryGetValue(userId, out var existingActivity))
            {
                existingActivity.ConnectionId = connectionId;
                existingActivity.LastActivityTime = DateTime.Now;
                existingActivity.IsOnline = true;
                existingActivity.Status = UserStatus.Online;
                System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] Updated existing user connection: {username} is now ONLINE");
            }
            else
            {
                // Kullanıcı hiç yoksa, sadece temel bilgileri oluştur
                // Login kaydı EKLEME (çünkü bu SignalR bağlantısı, gerçek login değil)
                System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] Creating basic activity record for {username} (no login history)");
                var newActivity = new UserActivityInfo
                {
                    UserId = userId,
                    Username = username,
                    DisplayName = displayName,
                    IsOnline = true,
                    LastActivityTime = DateTime.Now,
                    LoginTime = DateTime.Now,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    ConnectionId = connectionId,
                    Status = UserStatus.Online,
                    LoginHistoryList = new List<LoginHistory>() // Boş liste, login kaydı yok
                };
                
                _userActivities.TryAdd(userId, newActivity);
                System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] User {username} is ONLINE (waiting for real login)");
            }
        }
        
        
        // Gerçek logout işlemi (AccountPage.Signout'tan çağrılır)
        public static void RecordLogout(int userId)
        {
            if (_userActivities.TryGetValue(userId, out var activity))
            {
                activity.IsOnline = false;
                activity.LastActivityTime = DateTime.Now;
                activity.ConnectionId = null;
                activity.Status = UserStatus.Offline;
                
                // Son login kaydına logout zamanını ekle
                var lastLogin = activity.LoginHistoryList?.LastOrDefault();
                if (lastLogin != null && lastLogin.LogoutTime == null)
                {
                    lastLogin.LogoutTime = DateTime.Now;
                    System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] Logout recorded for UserId: {userId} at {DateTime.Now}");
                }
            }
        }
        
        // Sadece online durumunu offline yap ve logout zamanını kaydet
        public static void SetOfflineStatus(int userId)
        {
            if (_userActivities.TryGetValue(userId, out var activity))
            {
                var wasOnline = activity.IsOnline;
                activity.IsOnline = false;
                activity.LastActivityTime = DateTime.Now;
                activity.ConnectionId = null;
                activity.Status = UserStatus.Offline;
                
                // Eğer kullanıcı online idi ve şimdi offline oluyorsa, logout zamanını kaydet
                if (wasOnline)
                {
                    var lastLogin = activity.LoginHistoryList?.LastOrDefault();
                    if (lastLogin != null && lastLogin.LogoutTime == null)
                    {
                        lastLogin.LogoutTime = DateTime.Now;
                        System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] User {activity.Username} went OFFLINE at {DateTime.Now:HH:mm:ss}");
                    }
                }
                
                System.Diagnostics.Debug.WriteLine($"[UserActivityTracker] Status set to offline for UserId: {userId}");
            }
        }
        
        public static void UpdateActivity(int userId, string connectionId = null)
        {
            if (_userActivities.TryGetValue(userId, out var activity))
            {
                activity.LastActivityTime = DateTime.Now;
                activity.IsOnline = true;
                if (!string.IsNullOrEmpty(connectionId))
                    activity.ConnectionId = connectionId;
            }
        }
        
        public static List<UserActivityInfo> GetAllActivities()
        {
            return _userActivities.Values.OrderByDescending(x => x.LastActivityTime).ToList();
        }
        
        public static UserActivityInfo GetUserActivity(int userId)
        {
            _userActivities.TryGetValue(userId, out var activity);
            return activity;
        }
    }
}