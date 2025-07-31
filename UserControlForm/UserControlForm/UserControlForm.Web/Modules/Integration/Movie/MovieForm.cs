using Serenity.ComponentModel;

namespace UserControlForm.Integration.Forms;

[FormScript("Integration.Movie")]
[BasedOnRow(typeof(MovieRow), CheckNames = true)]
public class MovieForm
{
    public string Name { get; set; }
    public int Type { get; set; }
    public string Description { get; set; }
}