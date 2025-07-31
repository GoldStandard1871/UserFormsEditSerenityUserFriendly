using Serenity.Services;
using MyRequest = Serenity.Services.DeleteRequest;
using MyResponse = Serenity.Services.DeleteResponse;
using MyRow = UserControlForm.Administration.UserFormEditorRow;

namespace UserControlForm.Administration;

public interface IUserFormEditorDeleteHandler : IDeleteHandler<MyRow, MyRequest, MyResponse> { }

public class UserFormEditorDeleteHandler : DeleteRequestHandler<MyRow, MyRequest, MyResponse>, IUserFormEditorDeleteHandler
{
    public UserFormEditorDeleteHandler(IRequestContext context)
         : base(context)
    {
    }
}