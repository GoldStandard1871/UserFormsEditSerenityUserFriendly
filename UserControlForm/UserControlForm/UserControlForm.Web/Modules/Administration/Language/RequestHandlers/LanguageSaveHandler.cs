using MyRequest = Serenity.Services.SaveRequest<UserControlForm.Administration.LanguageRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = UserControlForm.Administration.LanguageRow;


namespace UserControlForm.Administration;
public interface ILanguageSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }
public class LanguageSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, ILanguageSaveHandler
{
    public LanguageSaveHandler(IRequestContext context)
         : base(context)
    {
    }
}