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
        
        // Aktivite ge\u00e7mi\u015fi kald\u0131r\u0131ld\u0131
        /*
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
                        // Oturum süresini hesapla
                        var sessionDuration = loginRecord.LogoutTime.Value - loginRecord.LoginTime;
                        var durationText = "";
                        
                        if (sessionDuration.TotalHours >= 1)
                        {
                            durationText = $" (Oturum süresi: {(int)sessionDuration.TotalHours} saat {sessionDuration.Minutes} dakika)";
                        }
                        else if (sessionDuration.TotalMinutes >= 1)
                        {
                            durationText = $" (Oturum süresi: {(int)sessionDuration.TotalMinutes} dakika)";
                        }
                        else
                        {
                            durationText = $" (Oturum süresi: {(int)sessionDuration.TotalSeconds} saniye)";
                        }
                        
                        history.Add(new ActivityHistoryItem
                        {
                            ActivityType = "Logout",
                            ActivityDetail = "Sistemden çıkış yaptı" + durationText,
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
        */
    }
}