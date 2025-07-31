using Serenity.ComponentModel;
using System;
using System.ComponentModel;

namespace UserControlForm.Administration.Columns;

[ColumnsScript("Administration.UserFormEditor")]
[BasedOnRow(typeof(UserFormEditorRow), CheckNames = true)]
public class UserFormEditorColumns
{
    [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
    public int TemplateId { get; set; }
    
    [EditLink]
    public string FormName { get; set; }
    
    public string CreatedByUsername { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public string ModifiedByUsername { get; set; }
    
    public DateTime ModifiedDate { get; set; }
}