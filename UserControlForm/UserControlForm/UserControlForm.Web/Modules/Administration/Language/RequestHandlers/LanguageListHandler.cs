using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<UserControlForm.Administration.LanguageRow>;
using MyRow = UserControlForm.Administration.LanguageRow;


namespace UserControlForm.Administration;
public interface ILanguageListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class LanguageListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, ILanguageListHandler
{
    public LanguageListHandler(IRequestContext context)
         : base(context)
    {
    }
}