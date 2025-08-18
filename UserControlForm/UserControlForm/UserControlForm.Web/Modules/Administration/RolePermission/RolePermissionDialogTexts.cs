using Serenity.Localization;

namespace UserControlForm.Administration;

[NestedLocalTexts(Prefix = "Site.RolePermissionDialog.")]
public static class RolePermissionDialogTexts
{
    public static readonly LocalText EditButton = new("Edit Permissions");
    public static readonly LocalText DialogTitle = new("Edit Role Permissions ({0})");
    public static readonly LocalText SaveSuccess = new("Updated role permissions.");
}
