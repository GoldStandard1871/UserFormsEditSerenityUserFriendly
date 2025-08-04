using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace UserControlForm.FormEditor.Pages
{
    [PageAuthorize(typeof(FormEditorV2Row))]
    public class FormEditorV2Page : Controller
    {
        [Route("FormEditor/FormEditorV2")]
        public ActionResult Index()
        {
            return this.GridPage("@/FormEditor/FormEditorV2Page",
                "Form Editör V2");
        }
    }
}