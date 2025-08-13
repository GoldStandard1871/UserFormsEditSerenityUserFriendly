using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using UserControlForm.Common.UserActivity;
using System;

namespace UserControlForm.Membership.Pages;
[Route("Account/[action]")]
public partial class AccountPage : Controller
{
    protected ITwoLevelCache Cache { get; }
    protected ITextLocalizer Localizer { get; }
    public AccountPage(ITwoLevelCache cache, ITextLocalizer localizer)
    {
        Localizer = localizer ?? throw new ArgumentNullException(nameof(localizer));
        Cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    [HttpGet]
    public ActionResult Login(int? denied, string activated, string returnUrl)
    {
        if (denied == 1)
            return View(MVC.Views.Errors.AccessDenied,
                ("~/Account/Login?returnUrl=" + Uri.EscapeDataString(returnUrl)));

        ViewData["Activated"] = activated;
        ViewData["HideLeftNavigation"] = true;
        return View(MVC.Views.Membership.Account.Login.LoginPage);
    }

    [HttpGet]
    public ActionResult AccessDenied(string returnURL)
    {
        ViewData["HideLeftNavigation"] = !User.IsLoggedIn();

        return View(MVC.Views.Errors.AccessDenied, (object)returnURL);
    }

    [HttpPost, JsonRequest]
    public Result<ServiceResponse> Login(LoginRequest request,
        [FromServices] IUserPasswordValidator passwordValidator,
        [FromServices] IUserClaimCreator userClaimCreator)
    {

        return this.ExecuteMethod(() =>
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            if (string.IsNullOrEmpty(request.Username))
                throw new ArgumentNullException(nameof(request.Username));

            if (passwordValidator is null)
                throw new ArgumentNullException(nameof(passwordValidator));

            if (userClaimCreator is null)
                throw new ArgumentNullException(nameof(userClaimCreator));

            var username = request.Username;
            System.Diagnostics.Debug.WriteLine($"[AccountPage] Login attempt - Username: {username}, Password length: {request.Password?.Length ?? 0}");
            var result = passwordValidator.Validate(ref username, request.Password);
            System.Diagnostics.Debug.WriteLine($"[AccountPage] Validation result: {result}");
            if (result == PasswordValidationResult.Valid)
            {
                var principal = userClaimCreator.CreatePrincipal(username, authType: "Password");
                
                // Cookie options ile manuel sign in deneyelim
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30)
                };
                
                HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties).GetAwaiter().GetResult();
                
                // Cookie oluşturuldu mu kontrol et
                System.Console.WriteLine($"[AccountPage] SignInAsync completed for {username}");
                System.Diagnostics.Debug.WriteLine($"[AccountPage] Cookie should be created for {username}");
                
                // Login olduğunda kullanıcı aktivitesini kaydet
                try
                {
                    // Önce log at, RecordLogin çağrılıyor mu görelim
                    System.Console.WriteLine($"[AccountPage-CONSOLE] Login successful for: {username}");
                    System.Diagnostics.Trace.WriteLine($"[AccountPage-TRACE] Login successful for: {username}");
                    var userIdClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                    var userId = !string.IsNullOrEmpty(userIdClaim) ? Convert.ToInt32(userIdClaim) : 0;
                    var displayName = principal.FindFirst("DisplayName")?.Value ?? username;
                    var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                    var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
                    
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] ========================================");
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] LOGIN SUCCESS for {username}");
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] UserId: {userId}");
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] DisplayName: {displayName}");
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] IP: {ipAddress}");
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] ========================================");
                    
                    // UserActivityTracker'a login kaydını ekle
                    if (userId > 0)
                    {
                        UserActivityTracker.RecordLogin(userId, username, displayName, ipAddress, userAgent, $"login-{userId}-{DateTime.Now.Ticks}");
                        System.Diagnostics.Debug.WriteLine($"[AccountPage] ✅ UserActivityTracker.RecordLogin called successfully");
                    }
                    else
                    {
                        System.Diagnostics.Debug.WriteLine($"[AccountPage] ⚠️ WARNING: UserId is 0 or invalid for user {username}");
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] ❌ ERROR tracking login: {ex.Message}");
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] Stack: {ex.StackTrace}");
                    // Exception'ı yutuyoruz, login işlemini etkilemesin
                }
                
                return new ServiceResponse();
            }

            if (result == PasswordValidationResult.InactiveUser)
            {
                throw new ValidationError("InactivatedAccount", MembershipValidationTexts.AuthenticationError.ToString(Localizer));
            }

            throw new ValidationError("AuthenticationError", MembershipValidationTexts.AuthenticationError.ToString(Localizer));
        });
    }

    private ActionResult Error(string message)
    {
        return View(MVC.Views.Errors.ValidationError, new ValidationError(message));
    }

    public string KeepAlive()
    {
        return "OK";
    }

    public ActionResult Signout()
    {
        // Track user logout - ÖNCE logout'u kaydet, SONRA sign out yap
        try
        {
            if (User.Identity.IsAuthenticated)
            {
                var userIdStr = User.GetIdentifier();
                if (!string.IsNullOrEmpty(userIdStr))
                {
                    var userId = Convert.ToInt32(userIdStr);
                    UserActivityTracker.RecordLogout(userId);
                    System.Diagnostics.Debug.WriteLine($"[AccountPage] User logged out - UserId: {userId}");
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"[AccountPage] Error recording logout: {ex.Message}");
        }
        
        HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        HttpContext.RequestServices.GetService<IElevationHandler>()?.DeleteToken();
        return new RedirectResult("~/");
    }
}