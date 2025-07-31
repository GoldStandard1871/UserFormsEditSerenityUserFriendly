using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace UserControlForm.Administration.Pages;

[PageAuthorize(typeof(UserFormEditorRow))]
public class UserFormEditorPage : Controller
{
    [Route("Administration/UserFormEditor")]
    public ActionResult Index()
    {
        return this.GridPage("@/Administration/UserFormEditor/UserFormEditorPage",
            "User Form Designer");
    }
}