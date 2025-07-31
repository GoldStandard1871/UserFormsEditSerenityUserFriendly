using Serenity.ComponentModel;
using System.ComponentModel;

namespace UserControlForm.Integration.Columns;

[ColumnsScript("Integration.Movie")]
[BasedOnRow(typeof(MovieRow), CheckNames = true)]
public class MovieColumns
{
    [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
    public int Id { get; set; }
    [EditLink]
    public string Name { get; set; }
    public int Type { get; set; }
    public string Description { get; set; }
}