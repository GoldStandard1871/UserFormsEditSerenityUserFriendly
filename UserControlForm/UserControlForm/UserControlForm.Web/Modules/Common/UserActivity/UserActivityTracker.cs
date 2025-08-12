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
            public string CurrentPage { get; set; }
            public string CurrentAction { get; set; }
            public UserStatus Status { get; set; }
            public List<PageVisit> PageHistory { get; set; } = new List<PageVisit>();
        }
        
        public class PageVisit
        {
            public string PageName { get; set; }
            public string Action { get; set; }
            public DateTime VisitTime { get; set; }
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
                CurrentPage = "Dashboard",
                Status = UserStatus.Online,
                PageHistory = new List<PageVisit>()
            };
            
            // İlk sayfa olarak Dashboard'ı ekle
            activity.PageHistory.Add(new PageVisit
            {
                PageName = "Dashboard",
                Action = "Sisteme giriş yaptı",
                VisitTime = DateTime.Now
            });
            
            _userActivities.AddOrUpdate(userId, activity, (key, existing) => 
            {
                // Mevcut kullanıcı varsa, sadece güncelle
                existing.IsOnline = true;
                existing.LastActivityTime = DateTime.Now;
                existing.LoginTime = DateTime.Now;
                existing.ConnectionId = connectionId;
                existing.Status = UserStatus.Online;
                existing.CurrentPage = "Dashboard";
                
                // Login'i history'e ekle
                if (existing.PageHistory == null)
                    existing.PageHistory = new List<PageVisit>();
                    
                existing.PageHistory.Add(new PageVisit
                {
                    PageName = "Dashboard",
                    Action = "Sisteme giriş yaptı",
                    VisitTime = DateTime.Now
                });
                
                return existing;
            });
        }
        
        public static void UpdateCurrentPage(int userId, string pageName, string action = null)
        {
            if (_userActivities.TryGetValue(userId, out var activity))
            {
                // Önceki sayfa ile aynı değilse history'e ekle
                if (activity.CurrentPage != pageName)
                {
                    activity.PageHistory.Add(new PageVisit
                    {
                        PageName = pageName,
                        Action = action ?? "Sayfayı görüntüledi",
                        VisitTime = DateTime.Now
                    });
                    
                    // Son 20 kaydı tut
                    if (activity.PageHistory.Count > 20)
                    {
                        activity.PageHistory.RemoveAt(0);
                    }
                }
                
                activity.CurrentPage = pageName;
                activity.CurrentAction = action;
                activity.LastActivityTime = DateTime.Now;
                activity.Status = UserStatus.Online;
            }
        }
        
        public static void RecordLogout(int userId)
        {
            if (_userActivities.TryGetValue(userId, out var activity))
            {
                activity.IsOnline = false;
                activity.LastActivityTime = DateTime.Now;
                activity.ConnectionId = null;
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