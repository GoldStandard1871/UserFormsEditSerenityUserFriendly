using Serenity.Services;
using MyRequest = Serenity.Services.RetrieveRequest;
using MyResponse = Serenity.Services.RetrieveResponse<UserControlForm.Administration.UserFormEditorRow>;
using MyRow = UserControlForm.Administration.UserFormEditorRow;

namespace UserControlForm.Administration;

public interface IUserFormEditorRetrieveHandler : IRetrieveHandler<MyRow, MyRequest, MyResponse> { }

public class UserFormEditorRetrieveHandler : RetrieveRequestHandler<MyRow, MyRequest, MyResponse>, IUserFormEditorRetrieveHandler
{
    public UserFormEditorRetrieveHandler(IRequestContext context)
         : base(context)
    {
    }
}