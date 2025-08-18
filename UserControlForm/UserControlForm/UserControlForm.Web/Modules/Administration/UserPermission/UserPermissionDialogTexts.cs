using Serenity.Localization;

namespace UserControlForm.Administration;

[NestedLocalTexts(Prefix = "Site.UserPermissionDialog.")]
public static class UserPermissionDialogTexts
{
    public static readonly LocalText DialogTitle = new("Edit User Permissions ({0})");
    public static readonly LocalText SaveSuccess = new("Updated user permissions.");
    public static readonly LocalText Permission = new("Permission");
    public static readonly LocalText Grant = new("Grant");
    public static readonly LocalText Revoke = new("Revoke");
}