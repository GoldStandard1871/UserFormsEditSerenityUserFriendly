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
            public string IpAddress { get; set; }
            public string Location { get; set; }
            public string UserAgent { get; set; }
            public string ConnectionId { get; set; }
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
                IpAddress = ipAddress,
                UserAgent = userAgent,
                ConnectionId = connectionId
            };
            
            _userActivities.AddOrUpdate(userId, activity, (key, existing) => activity);
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