using Microsoft.AspNetCore.Mvc;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Serenity.Data;
using UserControlForm.Administration;

namespace UserControlForm.Common.UserActivity
{
    [Route("Services/Common/UserActivity/[action]")]
    [ServiceAuthorize]
    public class UserActivityEndpoint : ServiceEndpoint
    {
        [HttpGet]
        public ListResponse<UserActivityTracker.UserActivityInfo> List([FromServices] ISqlConnections sqlConnections)
        {
            var activities = UserActivityTracker.GetAllActivities();
            
            return new ListResponse<UserActivityTracker.UserActivityInfo>
            {
                Entities = activities,
                TotalCount = activities.Count
            };
        }
        
        [HttpGet]
        public ListResponse<ActivityHistoryItem> GetHistory([FromQuery] int userId)
        {
            var history = new List<ActivityHistoryItem>();
            
            // Memory'den kullanıcı aktivitesini al
            var currentActivity = UserActivityTracker.GetUserActivity(userId);
            if (currentActivity != null && currentActivity.LoginHistoryList != null)
            {
                // Tüm login/logout geçmişini ekle
                foreach (var loginRecord in currentActivity.LoginHistoryList.OrderByDescending(x => x.LoginTime))
                {
                    // Login kaydı
                    history.Add(new ActivityHistoryItem
                    {
                        ActivityType = "Login",
                        ActivityDetail = "Sisteme giriş yaptı",
                        PageName = loginRecord.IpAddress,
                        Timestamp = loginRecord.LoginTime,
                        Icon = "fa-sign-in",
                        BadgeColor = "bg-success"
                    });
                    
                    // Logout kaydı (varsa)
                    if (loginRecord.LogoutTime.HasValue)
                    {
                        history.Add(new ActivityHistoryItem
                        {
                            ActivityType = "Logout",
                            ActivityDetail = "Sistemden çıkış yaptı",
                            PageName = "",
                            Timestamp = loginRecord.LogoutTime.Value,
                            Icon = "fa-sign-out",
                            BadgeColor = "bg-danger"
                        });
                    }
                }
                
                // Şu an online ise ve henüz logout kaydı yoksa
                if (currentActivity.IsOnline)
                {
                    var lastLogin = currentActivity.LoginHistoryList.LastOrDefault();
                    if (lastLogin != null && !lastLogin.LogoutTime.HasValue)
                    {
                        history.Add(new ActivityHistoryItem
                        {
                            ActivityType = "CurrentStatus",
                            ActivityDetail = "Şu an çevrimiçi",
                            PageName = currentActivity.IpAddress,
                            Timestamp = DateTime.Now,
                            Icon = "fa-circle",
                            BadgeColor = "bg-primary"
                        });
                    }
                }
            }
            
            return new ListResponse<ActivityHistoryItem>
            {
                Entities = history.OrderByDescending(x => x.Timestamp).ToList(),
                TotalCount = history.Count
            };
        }
    }
    
    public class ActivityHistoryItem
    {
        public string ActivityType { get; set; }
        public string ActivityDetail { get; set; }
        public string PageName { get; set; }
        public DateTime Timestamp { get; set; }
        public string Icon { get; set; }
        public string BadgeColor { get; set; }
    }
}