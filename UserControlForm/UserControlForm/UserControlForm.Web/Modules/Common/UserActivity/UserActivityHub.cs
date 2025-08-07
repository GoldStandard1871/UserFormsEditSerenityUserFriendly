using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using Serenity.Web;
using Microsoft.AspNetCore.Http;

namespace UserControlForm.Common.UserActivity
{
    [Authorize]
    public class UserActivityHub : Hub
    {
        private readonly IUserAccessor userAccessor;
        private readonly IHttpContextAccessor httpContextAccessor;
        
        public UserActivityHub(IUserAccessor userAccessor, IHttpContextAccessor httpContextAccessor)
        {
            this.userAccessor = userAccessor;
            this.httpContextAccessor = httpContextAccessor;
        }
        
        public override async Task OnConnectedAsync()
        {
            var user = userAccessor.User;
            if (user?.Identity?.IsAuthenticated == true)
            {
                try 
                {
                    var userId = Convert.ToInt32(userAccessor.User?.GetIdentifier());
                    var username = user.Identity.Name;
                    var displayName = userAccessor.User?.FindFirst("DisplayName")?.Value ?? username;
                    var ipAddress = GetClientIpAddress();
                    var userAgent = httpContextAccessor.HttpContext?.Request.Headers["User-Agent"].ToString();
                    
                    System.Diagnostics.Debug.WriteLine($"[UserActivityHub] OnConnectedAsync - UserId: {userId}, Username: {username}, DisplayName: {displayName}, IP: {ipAddress}");
                    
                    UserActivityTracker.RecordLogin(userId, username, displayName, ipAddress, userAgent, Context.ConnectionId);
                    
                    // Notify all clients about the new online user
                    await Clients.All.SendAsync("UserStatusChanged", userId, true);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"[UserActivityHub] Error in OnConnectedAsync: {ex.Message}");
                }
            }
            else
            {
                System.Diagnostics.Debug.WriteLine($"[UserActivityHub] OnConnectedAsync - User not authenticated");
            }
            
            await base.OnConnectedAsync();
        }
        
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                var user = userAccessor.User;
                if (user?.Identity?.IsAuthenticated == true)
                {
                    var userId = Convert.ToInt32(userAccessor.User?.GetIdentifier());
                    UserActivityTracker.RecordLogout(userId);
                    
                    System.Diagnostics.Debug.WriteLine($"[UserActivityHub] OnDisconnectedAsync - UserId: {userId} disconnected");
                    
                    // Notify all clients about the offline user
                    await Clients.All.SendAsync("UserStatusChanged", userId, false);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[UserActivityHub] Error in OnDisconnectedAsync: {ex.Message}");
            }
            
            await base.OnDisconnectedAsync(exception);
        }
        
        public Task SendHeartbeat()
        {
            var user = userAccessor.User;
            if (user?.Identity?.IsAuthenticated == true)
            {
                var userId = Convert.ToInt32(userAccessor.User?.GetIdentifier());
                UserActivityTracker.UpdateActivity(userId, Context.ConnectionId);
            }
            return Task.CompletedTask;
        }
        
        private string GetClientIpAddress()
        {
            var context = httpContextAccessor.HttpContext;
            
            // Check for forwarded IP
            var forwarded = context.Request.Headers["X-Forwarded-For"].ToString();
            if (!string.IsNullOrEmpty(forwarded))
            {
                return forwarded.Split(',')[0].Trim();
            }
            
            // Check X-Real-IP header
            var realIp = context.Request.Headers["X-Real-IP"].ToString();
            if (!string.IsNullOrEmpty(realIp))
            {
                return realIp;
            }
            
            // Fallback to remote IP
            var remoteIp = context.Connection.RemoteIpAddress?.ToString();
            if (!string.IsNullOrEmpty(remoteIp))
            {
                // Handle IPv6 localhost
                if (remoteIp == "::1")
                {
                    return "127.0.0.1";
                }
                return remoteIp;
            }
            
            return "127.0.0.1"; // Default to localhost if nothing found
        }
    }
}