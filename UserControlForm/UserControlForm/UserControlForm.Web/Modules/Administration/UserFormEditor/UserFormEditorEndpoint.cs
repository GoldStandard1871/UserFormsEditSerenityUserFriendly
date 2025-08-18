using Microsoft.AspNetCore.Mvc;
using Serenity;
using Serenity.Data;
using Serenity.Reporting;
using Serenity.Services;
using Serenity.Web;
using System;
using System.Data;
using System.Globalization;
using MyRow = UserControlForm.Administration.UserFormEditorRow;

namespace UserControlForm.Administration.Endpoints;

[Route("Services/Administration/UserFormEditor/[action]")]
[ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
public class UserFormEditorEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(MyRow))]
    public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request,
        [FromServices] IUserFormEditorSaveHandler handler)
    {
        return handler.Create(uow, request);
    }

    [HttpPost, AuthorizeUpdate(typeof(MyRow))]
    public SaveResponse Update(IUnitOfWork uow, SaveRequest<MyRow> request,
        [FromServices] IUserFormEditorSaveHandler handler)
    {
        return handler.Update(uow, request);
    }

    [HttpPost, AuthorizeDelete(typeof(MyRow))]
    public DeleteResponse Delete(IUnitOfWork uow, DeleteRequest request,
        [FromServices] IUserFormEditorDeleteHandler handler)
    {
        return handler.Delete(uow, request);
    }

    [HttpPost]
    public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request,
        [FromServices] IUserFormEditorRetrieveHandler handler)
    {
        return handler.Retrieve(connection, request);
    }

    [HttpPost, AuthorizeList(typeof(MyRow))]
    public ListResponse<MyRow> List(IDbConnection connection, ListRequest request,
        [FromServices] IUserFormEditorListHandler handler)
    {
        return handler.List(connection, request);
    }

    [HttpPost, AuthorizeUpdate(typeof(MyRow))]
    public SaveResponse SaveUserFormPreference(IUnitOfWork uow, SaveUserFormPreferenceRequest request,
        [FromServices] IUserAccessor userAccessor)
    {
        if (string.IsNullOrEmpty(request.PreferenceKey))
            throw new ArgumentNullException(nameof(request.PreferenceKey));

        if (string.IsNullOrEmpty(request.FormDesign))
            throw new ArgumentNullException(nameof(request.FormDesign));

        var userId = userAccessor.User?.GetIdentifier() ?? 
            throw new InvalidOperationException("User not found!");

        // Check if preference exists
        var existing = uow.Connection.TryFirst<UserPreferenceRow>(q => q
            .Select(UserPreferenceRow.Fields.UserPreferenceId)
            .Where(UserPreferenceRow.Fields.UserId == int.Parse(userId) &&
                   UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                   UserPreferenceRow.Fields.Name == request.PreferenceKey));

        if (existing != null)
        {
            // Update existing
            uow.Connection.UpdateById(new UserPreferenceRow
            {
                UserPreferenceId = existing.UserPreferenceId,
                Value = request.FormDesign
            });
        }
        else
        {
            // Insert new
            uow.Connection.Insert(new UserPreferenceRow
            {
                UserId = int.Parse(userId),
                PreferenceType = "UserFormDesign",
                Name = request.PreferenceKey,
                Value = request.FormDesign
            });
        }

        return new SaveResponse();
    }

    [HttpPost]
    public GetUserFormPreferenceResponse GetUserFormPreference(IDbConnection connection, GetUserFormPreferenceRequest request,
        [FromServices] IUserAccessor userAccessor)
    {
        if (string.IsNullOrEmpty(request.PreferenceKey))
            throw new ArgumentNullException(nameof(request.PreferenceKey));

        var userId = userAccessor.User?.GetIdentifier() ?? 
            throw new InvalidOperationException("User not found!");

        var preference = connection.TryFirst<UserPreferenceRow>(q => q
            .Select(UserPreferenceRow.Fields.Value)
            .Where(UserPreferenceRow.Fields.UserId == int.Parse(userId) &&
                   UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                   UserPreferenceRow.Fields.Name == request.PreferenceKey));

        return new GetUserFormPreferenceResponse
        {
            FormDesign = preference?.Value
        };
    }

    [HttpPost, AuthorizeUpdate(typeof(MyRow))]
    public SaveResponse SaveGlobalPreference(IUnitOfWork uow, SaveGlobalPreferenceRequest request,
        [FromServices] IPermissionService permissions)
    {
        // Sadece admin'ler global ayar kaydedebilir
        if (!permissions.HasPermission("Administration:General"))
            throw new ValidationError("Only administrators can save global preferences");

        if (string.IsNullOrEmpty(request.PreferenceKey))
            throw new ArgumentNullException(nameof(request.PreferenceKey));

        if (string.IsNullOrEmpty(request.FormDesign))
            throw new ArgumentNullException(nameof(request.FormDesign));

        // UserId = 0 global ayar demektir
        var userId = request.UserId ?? 0;

        // Check if preference exists
        var existing = uow.Connection.TryFirst<UserPreferenceRow>(q => q
            .Select(UserPreferenceRow.Fields.UserPreferenceId)
            .Where(UserPreferenceRow.Fields.UserId == userId &&
                   UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                   UserPreferenceRow.Fields.Name == request.PreferenceKey));

        if (existing != null)
        {
            // Update existing
            uow.Connection.UpdateById(new UserPreferenceRow
            {
                UserPreferenceId = existing.UserPreferenceId,
                Value = request.FormDesign
            });
        }
        else
        {
            // Insert new
            uow.Connection.Insert(new UserPreferenceRow
            {
                UserId = userId,
                PreferenceType = "UserFormDesign",
                Name = request.PreferenceKey,
                Value = request.FormDesign
            });
        }

        return new SaveResponse();
    }

    [HttpPost]
    public GetGlobalPreferenceResponse GetGlobalPreference(IDbConnection connection, GetGlobalPreferenceRequest request)
    {
        if (string.IsNullOrEmpty(request.PreferenceKey))
            throw new ArgumentNullException(nameof(request.PreferenceKey));

        // UserId = 0 olan global ayarı al
        var userId = request.UserId ?? 0;

        var preference = connection.TryFirst<UserPreferenceRow>(q => q
            .Select(UserPreferenceRow.Fields.Value)
            .Where(UserPreferenceRow.Fields.UserId == userId &&
                   UserPreferenceRow.Fields.PreferenceType == "UserFormDesign" &&
                   UserPreferenceRow.Fields.Name == request.PreferenceKey));

        return new GetGlobalPreferenceResponse
        {
            FormDesign = preference?.Value
        };
    }
}

public class SaveUserFormPreferenceRequest : ServiceRequest
{
    public string PreferenceKey { get; set; }
    public string FormDesign { get; set; }
}

public class GetUserFormPreferenceRequest : ServiceRequest
{
    public string PreferenceKey { get; set; }
}

public class GetUserFormPreferenceResponse : ServiceResponse
{
    public string FormDesign { get; set; }
}

public class SaveGlobalPreferenceRequest : ServiceRequest
{
    public string PreferenceKey { get; set; }
    public string FormDesign { get; set; }
    public int? UserId { get; set; }
}

public class GetGlobalPreferenceRequest : ServiceRequest
{
    public string PreferenceKey { get; set; }
    public int? UserId { get; set; }
}

public class GetGlobalPreferenceResponse : ServiceResponse
{
    public string FormDesign { get; set; }
}

