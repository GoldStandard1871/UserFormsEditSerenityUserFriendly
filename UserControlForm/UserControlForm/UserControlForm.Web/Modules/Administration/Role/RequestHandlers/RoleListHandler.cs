using MyRequest = Serenity.Services.ListRequest;
using MyResponse = Serenity.Services.ListResponse<UserControlForm.Administration.RoleRow>;
using MyRow = UserControlForm.Administration.RoleRow;


namespace UserControlForm.Administration;
public interface IRoleListHandler : IListHandler<MyRow, MyRequest, MyResponse> { }

public class RoleListHandler : ListRequestHandler<MyRow, MyRequest, MyResponse>, IRoleListHandler
{
    public RoleListHandler(IRequestContext context)
         : base(context)
    {
    }
}