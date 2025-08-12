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
        
        public static void RecordLogin(int userId, string username, string displayName, string ipAddress, string userAgent, string connectionId)
        {
            var activity = new UserActivityInfo
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
            
            // Login geçmişine ekle
            activity.LoginHistoryList.Add(new LoginHistory
            {
                LoginTime = DateTime.Now,
                IpAddress = ipAddress,
                UserAgent = userAgent
            });
            
            _userActivities.AddOrUpdate(userId, activity, (key, existing) => 
            {
                // Eğer kullanıcı zaten online ise yeni login kaydı ekleme
                if (existing.IsOnline)
                {
                    // Sadece connection bilgilerini güncelle
                    existing.ConnectionId = connectionId;
                    existing.LastActivityTime = DateTime.Now;
                    return existing;
                }
                
                // Mevcut kullanıcı offline ise, yeni login olarak kaydet
                existing.IsOnline = true;
                existing.LastActivityTime = DateTime.Now;
                existing.LoginTime = DateTime.Now;
                existing.ConnectionId = connectionId;
                existing.Status = UserStatus.Online;
                existing.IpAddress = ipAddress;
                existing.UserAgent = userAgent;
                
                // Login geçmişine ekle
                if (existing.LoginHistoryList == null)
                    existing.LoginHistoryList = new List<LoginHistory>();
                    
                // Son 10 login kaydını tut
                if (existing.LoginHistoryList.Count >= 10)
                {
                    existing.LoginHistoryList.RemoveAt(0);
                }
                    
                existing.LoginHistoryList.Add(new LoginHistory
                {
                    LoginTime = DateTime.Now,
                    IpAddress = ipAddress,
                    UserAgent = userAgent
                });
                
                return existing;
            });
        }
        
        
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
                }
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