using MyRow = UserControlForm.Administration.UserRow;

namespace UserControlForm.Administration.Endpoints;
[Route("Services/Administration/User/[action]")]
[ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
public class UserEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(MyRow))]
    public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request, [FromServices] IUserSaveHandler handler)
    {
        return handler.Create(uow, request);
    }

    [HttpPost, AuthorizeUpdate(typeof(MyRow))]
    public SaveResponse Update(IUnitOfWork uow, SaveRequest<MyRow> request, [FromServices] IUserSaveHandler handler)
    {
        return handler.Update(uow, request);
    }

    [HttpPost, AuthorizeDelete(typeof(MyRow))]
    public DeleteResponse Delete(IUnitOfWork uow, DeleteRequest request, [FromServices] IUserDeleteHandler handler)
    {
        return handler.Delete(uow, request);
    }

    public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request, [FromServices] IUserRetrieveHandler handler)
    {
        return handler.Retrieve(connection, request);
    }

    public ListResponse<MyRow> List(IDbConnection connection, UserListRequest request, [FromServices] IUserListHandler handler)
    {
        return handler.List(connection, request);
    }

    [HttpPost]
    public SaveResponse SaveUserSettings(IUnitOfWork uow, SaveUserSettingsRequest request, 
        [FromServices] IUserAccessor userAccessor, [FromServices] IPermissionService permissions)
    {
        if (string.IsNullOrEmpty(request.PreferenceKey))
            throw new ArgumentNullException(nameof(request.PreferenceKey));

        var userId = userAccessor.User?.GetIdentifier() ?? throw new InvalidOperationException("User not found!");
        
        // Global ayar mı kontrol et (admin gerekli)
        bool isGlobal = request.PreferenceKey.StartsWith("GlobalFieldSettings_");
        
        if (isGlobal)
        {
            // Admin kontrolü
            if (!permissions.HasPermission("Administration:General"))
                throw new ValidationError("Only administrators can save global settings");
                
            userId = "0"; // Global ayarlar için UserId = 0
        }

        // UserPreferences tablosuna kaydet
        var existing = uow.Connection.TryFirst<UserPreferenceRow>(q => q
            .Select(UserPreferenceRow.Fields.UserPreferenceId)
            .Where(UserPreferenceRow.Fields.UserId == int.Parse(userId) &&
                   UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                   UserPreferenceRow.Fields.Name == request.PreferenceKey));

        if (existing != null)
        {
            uow.Connection.UpdateById(new UserPreferenceRow
            {
                UserPreferenceId = existing.UserPreferenceId,
                Value = request.Value
            });
        }
        else
        {
            uow.Connection.Insert(new UserPreferenceRow
            {
                UserId = int.Parse(userId),
                PreferenceType = "UserFormDesign",
                Name = request.PreferenceKey,
                Value = request.Value
            });
        }

        return new SaveResponse();
    }

    [HttpPost]
    public GetUserPreferenceResponse GetUserPreference(IDbConnection connection, GetUserPreferenceRequest request, [FromServices] IUserAccessor userAccessor)
    {
        if (string.IsNullOrEmpty(request.PreferenceKey))
            throw new ArgumentNullException(nameof(request.PreferenceKey));

        // Global ayar mı kontrol et - DÜZELTME: Herkes global ayarları okuyabilmeli
        bool isGlobal = request.PreferenceKey.StartsWith("GlobalFieldSettings_");
        
        UserPreferenceRow preference = null;
        
        if (isGlobal)
        {
            // Global ayarlar için UserId = 0 olanı ara
            preference = connection.TryFirst<UserPreferenceRow>(q => q
                .Select(UserPreferenceRow.Fields.Value)
                .Where(UserPreferenceRow.Fields.UserId == 0 &&
                       UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                       UserPreferenceRow.Fields.Name == request.PreferenceKey));
        }
        else
        {
            // Kullanıcıya özel ayar
            var userId = int.Parse(userAccessor.User?.GetIdentifier() ?? "0");
            preference = connection.TryFirst<UserPreferenceRow>(q => q
                .Select(UserPreferenceRow.Fields.Value)
                .Where(UserPreferenceRow.Fields.UserId == userId &&
                       UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                       UserPreferenceRow.Fields.Name == request.PreferenceKey));
        }

        return new GetUserPreferenceResponse
        {
            FormDesign = preference?.Value
        };
    }
}

public class SaveUserSettingsRequest : ServiceRequest
{
    public string PreferenceKey { get; set; }
    public string Value { get; set; }
}

public class GetUserPreferenceRequest : ServiceRequest
{
    public string PreferenceKey { get; set; }
}

public class GetUserPreferenceResponse : ServiceResponse
{
    public string FormDesign { get; set; }
}