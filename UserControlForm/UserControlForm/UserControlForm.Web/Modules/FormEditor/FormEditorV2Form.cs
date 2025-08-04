using Serenity.ComponentModel;

namespace UserControlForm.FormEditor.Forms
{
    [FormScript("FormEditor.FormEditorV2")]
    [BasedOnRow(typeof(FormEditorV2Row), CheckNames = true)]
    public class FormEditorV2Form
    {
        public string FormName { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }
}