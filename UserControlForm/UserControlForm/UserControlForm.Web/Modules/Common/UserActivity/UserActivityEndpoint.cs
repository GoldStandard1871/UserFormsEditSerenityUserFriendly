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
    }
}