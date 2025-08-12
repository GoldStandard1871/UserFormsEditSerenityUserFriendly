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
            if (currentActivity != null)
            {
                // Login kaydı
                if (currentActivity.LoginTime != default(DateTime))
                {
                    history.Add(new ActivityHistoryItem
                    {
                        ActivityType = "Login",
                        ActivityDetail = "Sisteme giriş yaptı",
                        PageName = "Dashboard",
                        Timestamp = currentActivity.LoginTime,
                        Icon = "fa-sign-in",
                        BadgeColor = "bg-success"
                    });
                }
                
                // Sayfa geçmişi (PageHistory'den)
                if (currentActivity.PageHistory != null && currentActivity.PageHistory.Any())
                {
                    foreach (var visit in currentActivity.PageHistory)
                    {
                        history.Add(new ActivityHistoryItem
                        {
                            ActivityType = "PageView",
                            ActivityDetail = visit.Action ?? $"{visit.PageName} sayfasına gitti",
                            PageName = visit.PageName,
                            Timestamp = visit.VisitTime,
                            Icon = "fa-file-o",
                            BadgeColor = "bg-info"
                        });
                    }
                }
                
                // Mevcut sayfa (eğer henüz history'e eklenmemişse)
                if (currentActivity.IsOnline && !string.IsNullOrEmpty(currentActivity.CurrentPage))
                {
                    var lastPageInHistory = currentActivity.PageHistory?.LastOrDefault();
                    if (lastPageInHistory == null || lastPageInHistory.PageName != currentActivity.CurrentPage)
                    {
                        history.Add(new ActivityHistoryItem
                        {
                            ActivityType = "CurrentPage",
                            ActivityDetail = $"Şu an {currentActivity.CurrentPage} sayfasında",
                            PageName = currentActivity.CurrentPage,
                            Timestamp = currentActivity.LastActivityTime,
                            Icon = "fa-circle",
                            BadgeColor = "bg-primary"
                        });
                    }
                }
                
                // Offline ise çıkış kaydı
                if (!currentActivity.IsOnline)
                {
                    history.Add(new ActivityHistoryItem
                    {
                        ActivityType = "Logout",
                        ActivityDetail = "Sistemden çıkış yaptı",
                        PageName = "",
                        Timestamp = currentActivity.LastActivityTime,
                        Icon = "fa-sign-out",
                        BadgeColor = "bg-danger"
                    });
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