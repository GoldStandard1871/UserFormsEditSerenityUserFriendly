using Microsoft.AspNetCore.Mvc;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Serenity.Web;
using MyRow = UserControlForm.Administration.UserFieldSettingsRow;

namespace UserControlForm.Administration.Endpoints;

[Route("Services/Administration/FieldCustomization/[action]")]
[ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
public class FieldCustomizationController : ServiceEndpoint
{
    // Admin zorunlu alanları getir
    [HttpPost]
    public GetRequiredFieldsResponse GetRequiredFields(GetRequiredFieldsRequest request, 
        [FromServices] IDbConnection connection)
    {
        if (string.IsNullOrEmpty(request.DialogName))
            throw new ArgumentNullException(nameof(request.DialogName));

        var fields = connection.Query<AdminRequiredFieldsRow>(
            "SELECT * FROM AdminRequiredFields WHERE DialogName = @dialogName AND IsRequired = 1",
            new { dialogName = request.DialogName });

        return new GetRequiredFieldsResponse
        {
            RequiredFields = fields.Select(x => x.FieldName).ToList()
        };
    }

    // Admin zorunlu alanları kaydet
    [HttpPost, ServiceAuthorize("Administration:General")]
    public SaveRequiredFieldsResponse SaveRequiredFields(SaveRequiredFieldsRequest request,
        [FromServices] IDbConnection connection)
    {
        if (string.IsNullOrEmpty(request.DialogName))
            throw new ArgumentNullException(nameof(request.DialogName));

        var userId = int.Parse(User.GetIdentifier());
        
        using (var uow = new UnitOfWork(connection))
        {
            // Önce bu dialog için tüm kayıtları sil
            uow.Connection.Execute(
                "DELETE FROM AdminRequiredFields WHERE DialogName = @dialogName",
                new { dialogName = request.DialogName });

            // Yeni zorunlu alanları ekle
            if (request.RequiredFields != null)
            {
                foreach (var fieldName in request.RequiredFields)
                {
                    var newRow = new AdminRequiredFieldsRow
                    {
                        DialogName = request.DialogName,
                        FieldName = fieldName,
                        IsRequired = true,
                        CreatedDate = DateTime.Now,
                        CreatedBy = userId
                    };
                    uow.Connection.Insert(newRow);
                }
            }

            uow.Commit();
        }

        return new SaveRequiredFieldsResponse { Success = true };
    }

    // Kullanıcı field ayarlarını getir
    [HttpPost]
    public GetUserFieldSettingsResponse GetUserFieldSettings(GetUserFieldSettingsRequest request,
        [FromServices] IDbConnection connection)
    {
        if (string.IsNullOrEmpty(request.DialogName))
            throw new ArgumentNullException(nameof(request.DialogName));

        var userId = int.Parse(User.GetIdentifier());

        var settings = connection.Query<UserFieldSettingsRow>(
            "SELECT * FROM UserFieldSettings WHERE UserId = @userId AND DialogName = @dialogName",
            new { userId = userId, dialogName = request.DialogName });

        return new GetUserFieldSettingsResponse
        {
            Settings = settings.Select(x => new UserFieldSetting
            {
                FieldName = x.FieldName,
                IsVisible = x.IsVisible ?? true,
                DisplayOrder = x.DisplayOrder ?? 0
            }).ToList()
        };
    }

    // Kullanıcı field ayarlarını kaydet
    [HttpPost]
    public SaveUserFieldSettingsResponse SaveUserFieldSettings(SaveUserFieldSettingsRequest request,
        [FromServices] IDbConnection connection)
    {
        if (string.IsNullOrEmpty(request.DialogName))
            throw new ArgumentNullException(nameof(request.DialogName));

        var userId = int.Parse(User.GetIdentifier());

        using (var uow = new UnitOfWork(connection))
        {
            // Önce bu kullanıcı ve dialog için tüm ayarları sil
            uow.Connection.Execute(
                "DELETE FROM UserFieldSettings WHERE UserId = @userId AND DialogName = @dialogName",
                new { userId, dialogName = request.DialogName });

            // Yeni ayarları ekle
            if (request.Settings != null)
            {
                foreach (var setting in request.Settings)
                {
                    var newRow = new UserFieldSettingsRow
                    {
                        UserId = userId,
                        DialogName = request.DialogName,
                        FieldName = setting.FieldName,
                        IsVisible = setting.IsVisible,
                        DisplayOrder = setting.DisplayOrder,
                        CreatedDate = DateTime.Now
                    };
                    uow.Connection.Insert(newRow);
                }
            }

            uow.Commit();
        }

        return new SaveUserFieldSettingsResponse { Success = true };
    }

    // İzinleri kontrol et
    [HttpPost]
    public CheckPermissionsResponse CheckPermissions()
    {
        var isAdmin = Context.Permissions.HasPermission("Administration:General");
        return new CheckPermissionsResponse { IsAdmin = isAdmin };
    }
}

// Request/Response sınıfları
public class GetRequiredFieldsRequest : ServiceRequest
{
    public string DialogName { get; set; }
}

public class GetRequiredFieldsResponse : ServiceResponse
{
    public List<string> RequiredFields { get; set; }
}

public class SaveRequiredFieldsRequest : ServiceRequest
{
    public string DialogName { get; set; }
    public List<string> RequiredFields { get; set; }
}

public class SaveRequiredFieldsResponse : ServiceResponse
{
    public bool Success { get; set; }
}

public class GetUserFieldSettingsRequest : ServiceRequest
{
    public string DialogName { get; set; }
}

public class GetUserFieldSettingsResponse : ServiceResponse
{
    public List<UserFieldSetting> Settings { get; set; }
}

public class SaveUserFieldSettingsRequest : ServiceRequest
{
    public string DialogName { get; set; }
    public List<UserFieldSetting> Settings { get; set; }
}

public class SaveUserFieldSettingsResponse : ServiceResponse
{
    public bool Success { get; set; }
}

public class CheckPermissionsResponse : ServiceResponse
{
    public bool IsAdmin { get; set; }
}

public class UserFieldSetting
{
    public string FieldName { get; set; }
    public bool IsVisible { get; set; }
    public int DisplayOrder { get; set; }
}