using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace UserControlForm.Integration.Pages;

[PageAuthorize(typeof(MovieRow))]
public class MoviePage : Controller
{
    [Route("Integration/Movie")]
    public ActionResult Index()
    {
        return this.GridPage<MovieRow>("@/Integration/Movie/MoviePage");
    }
}