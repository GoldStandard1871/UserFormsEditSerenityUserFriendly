using Serenity.Services;
using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<UserControlForm.Administration.UserFormEditorRow>;
using MyRow = UserControlForm.Administration.UserFormEditorRow;

namespace UserControlForm.Administration;

using UserControlForm.Administration.Endpoints;

public interface IUserFormEditorListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class UserFormEditorListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IUserFormEditorListHandler
{
    public UserFormEditorListHandler(IRequestContext context)
         : base(context)
    {
    }
}