using Microsoft.AspNetCore.Mvc;
using Serenity.Services;
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
            
            // Debug: Test kullanıcısını kontrol et
            using (var connection = sqlConnections.NewFor<UserRow>())
            {
                // Veritabanındaki tüm aktif kullanıcıları al
                var users = connection.List<UserRow>(q => q
                    .Select(UserRow.Fields.UserId, UserRow.Fields.Username, UserRow.Fields.DisplayName)
                    .Where(UserRow.Fields.IsActive == 1));
                
                // Test için sadece test kullanıcısını ekle (eğer hiç yoksa)
                var testUserExists = activities.Any(a => a.Username == "test");
                if (!testUserExists)
                {
                    var testUser = users.FirstOrDefault(u => u.Username == "test");
                    if (testUser != null)
                    {
                        UserActivityTracker.RecordLogin(
                            userId: testUser.UserId.Value,
                            username: testUser.Username,
                            displayName: testUser.DisplayName ?? testUser.Username,
                            ipAddress: "127.0.0.1",
                            userAgent: "Browser",
                            connectionId: $"manual-{testUser.UserId}"
                        );
                        
                        // Test kullanıcısını offline yap
                        UserActivityTracker.RecordLogout(testUser.UserId.Value);
                    }
                }
                
                // Güncel listeyi al
                activities = UserActivityTracker.GetAllActivities();
            }
            
            return new ListResponse<UserActivityTracker.UserActivityInfo>
            {
                Entities = activities,
                TotalCount = activities.Count
            };
        }
    }
}