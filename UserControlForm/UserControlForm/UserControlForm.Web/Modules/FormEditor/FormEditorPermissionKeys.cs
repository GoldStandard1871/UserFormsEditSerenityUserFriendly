using Serenity.ComponentModel;
using System.ComponentModel;

namespace UserControlForm.FormEditor;

[NestedPermissionKeys]
[DisplayName("Form Editor")]
public class PermissionKeys
{
    [Description("View Form Editor")]
    public const string View = "FormEditor:View";

    [Description("Edit Form Editor")]
    public const string Edit = "FormEditor:Edit";
    
    [Description("Delete Form Editor")]
    public const string Delete = "FormEditor:Delete";
    
    [Description("Manage Required Fields (Admin Only)")]
    public const string ManageRequiredFields = "FormEditor:ManageRequiredFields";
}