using Serenity.ComponentModel;

namespace UserControlForm.Administration.Forms;

[FormScript("Administration.UserFormEditor")]
[BasedOnRow(typeof(UserFormEditorRow), CheckNames = true)]
public class UserFormEditorForm
{
    [LabelWidth(150)]
    public string FormName { get; set; }
    
    [LabelWidth(150), TextAreaEditor(Rows = 2)]
    public string Description { get; set; }
    
    [LabelWidth(150), TextAreaEditor(Rows = 3)]
    public string Purpose { get; set; }
    
    [LabelWidth(150), TextAreaEditor(Rows = 4)]
    public string Instructions { get; set; }
    
    [HideOnInsert, HideOnUpdate]
    public string FormDesign { get; set; }
}