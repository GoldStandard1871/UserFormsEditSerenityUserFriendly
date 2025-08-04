using Serenity.ComponentModel;
using System.ComponentModel;

namespace UserControlForm.FormEditor.Columns
{
    [ColumnsScript("FormEditor.FormEditorV2")]
    [BasedOnRow(typeof(FormEditorV2Row), CheckNames = true)]
    public class FormEditorV2Columns
    {
        [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
        public int Id { get; set; }
        [EditLink]
        public string FormName { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }
}