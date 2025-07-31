using MyRequest = UserControlForm.Administration.UserListRequest;
using MyResponse = Serenity.Services.ListResponse<UserControlForm.Administration.UserRow>;
using MyRow = UserControlForm.Administration.UserRow;

namespace UserControlForm.Administration;
public interface IUserListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class UserListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IUserListHandler
{
    public UserListHandler(IRequestContext context)
         : base(context)
    {
    }
}