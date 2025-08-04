using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace UserControlForm.Common.Pages
{
    [PageAuthorize(typeof(UserControlForm.FormEditorV2Row))]
    public class FormEditorV2PageModel : PageModel
    {
    }
}