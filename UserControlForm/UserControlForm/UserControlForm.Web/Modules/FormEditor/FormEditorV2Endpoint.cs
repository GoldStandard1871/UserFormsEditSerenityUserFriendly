using Microsoft.AspNetCore.Mvc;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using MyRow = UserControlForm.FormEditor.FormEditorV2Row;

namespace UserControlForm.FormEditor.Endpoints
{
    [Route("Services/FormEditor/FormEditorV2/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class FormEditorV2Endpoint : ServiceEndpoint
    {
        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request,
            [FromServices] IFormEditorV2SaveHandler handler)
        {
            return handler.Create(uow, request);
        }

        [HttpPost, AuthorizeUpdate(typeof(MyRow))]
        public SaveResponse Update(IUnitOfWork uow, SaveRequest<MyRow> request,
            [FromServices] IFormEditorV2SaveHandler handler)
        {
            return handler.Update(uow, request);
        }

        [HttpPost, AuthorizeDelete(typeof(MyRow))]
        public DeleteResponse Delete(IUnitOfWork uow, DeleteRequest request,
            [FromServices] IFormEditorV2DeleteHandler handler)
        {
            return handler.Delete(uow, request);
        }

        [HttpPost]
        public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request,
            [FromServices] IFormEditorV2RetrieveHandler handler)
        {
            return handler.Retrieve(connection, request);
        }

        [HttpPost, AuthorizeList(typeof(MyRow))]
        public ListResponse<MyRow> List(IDbConnection connection, ListRequest request,
            [FromServices] IFormEditorV2ListHandler handler)
        {
            return handler.List(connection, request);
        }

        [HttpPost, AuthorizeUpdate(typeof(MyRow))]
        public ServiceResponse SaveUserSettings(IUnitOfWork uow, SaveUserSettingsRequest request)
        {
            // Zorunlu alanları ayrıştır ve global olarak kaydet
            if (IsAdmin() && request.Settings != null)
            {
                try
                {
                    var parsedSettings = JsonConvert.DeserializeObject<dynamic>(request.Settings);
                    if (parsedSettings?.fieldSettings != null)
                    {
                        var requiredFields = new List<string>();
                        foreach (var field in parsedSettings.fieldSettings)
                        {
                            if (field.required == true)
                            {
                                requiredFields.Add((string)field.fieldId);
                            }
                        }
                        SaveGlobalRequiredFields(uow, requiredFields);
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error parsing required fields: {ex.Message}");
                }
            }
            
            // Kullanıcı ID'sini güvenli şekilde al
            var userId = int.Parse(User.GetIdentifier());
            var username = User.Identity?.Name ?? "Unknown";
            var settings = request.Settings;
            
            System.Diagnostics.Debug.WriteLine($"=== SaveUserSettings DEBUG ===");
            System.Diagnostics.Debug.WriteLine($"UserId: {userId}");
            System.Diagnostics.Debug.WriteLine($"Username: {username}");
            System.Diagnostics.Debug.WriteLine($"Settings length: {settings?.Length ?? 0}");

            var existing = uow.Connection.TryFirst<UserFormSettingsRow>(q => q
                .Select(UserFormSettingsRow.Fields.Id)
                .Where(UserFormSettingsRow.Fields.UserId == userId));

            if (existing != null)
            {
                System.Diagnostics.Debug.WriteLine($"Updating existing record Id: {existing.Id} for UserId: {userId}");
                
                uow.Connection.UpdateById(new UserFormSettingsRow
                {
                    Id = existing.Id,
                    Settings = settings,
                    UpdateDate = DateTime.Now,
                    UpdateUserId = userId
                });
            }
            else
            {
                System.Diagnostics.Debug.WriteLine($"Creating new record for UserId: {userId}");
                
                uow.Connection.Insert(new UserFormSettingsRow
                {
                    UserId = userId,
                    Settings = settings,
                    InsertDate = DateTime.Now,
                    InsertUserId = userId
                });
            }
            
            System.Diagnostics.Debug.WriteLine($"========================");

            return new ServiceResponse();
        }

        [HttpPost, AuthorizeList(typeof(MyRow))]
        public GetUserSettingsResponse GetUserSettings(IDbConnection connection, GetUserSettingsRequest request)
        {
            // Kullanıcı ID'sini güvenli şekilde al
            var userId = int.Parse(User.GetIdentifier());
            var username = User.Identity?.Name ?? "Unknown";
            var isAdmin = username.ToLower() == "admin";
            
            System.Diagnostics.Debug.WriteLine($"=== GetUserSettings DEBUG ===");
            System.Diagnostics.Debug.WriteLine($"UserId: {userId}");
            System.Diagnostics.Debug.WriteLine($"Username: {username}");
            System.Diagnostics.Debug.WriteLine($"IsAdmin: {isAdmin}");
            
            // Debug için tüm kayıtları listele
            var allSettings = connection.List<UserFormSettingsRow>(q => q
                .Select(UserFormSettingsRow.Fields.Id, 
                        UserFormSettingsRow.Fields.UserId));
            
            System.Diagnostics.Debug.WriteLine($"Total settings records: {allSettings.Count}");
            foreach (var s in allSettings)
            {
                System.Diagnostics.Debug.WriteLine($"  - Id: {s.Id}, UserId: {s.UserId}");
            }
            
            var settings = connection.TryFirst<UserFormSettingsRow>(q => q
                .Select(UserFormSettingsRow.Fields.Settings)
                .Where(UserFormSettingsRow.Fields.UserId == userId));

            if (settings != null)
            {
                System.Diagnostics.Debug.WriteLine($"Settings found for UserId: {userId}");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine($"No settings found for UserId: {userId}");
            }
            System.Diagnostics.Debug.WriteLine($"========================");

            // Global zorunlu alanları al
            var requiredFields = GetGlobalRequiredFields(connection);
            
            return new GetUserSettingsResponse
            {
                Settings = settings?.Settings,
                UserId = userId,
                Username = username,
                IsAdmin = isAdmin,
                RequiredFields = requiredFields
            };
        }
        
        private void SaveGlobalRequiredFields(IUnitOfWork uow, List<string> requiredFields)
        {
            var settingKey = "RequiredFields";
            var settingValue = JsonConvert.SerializeObject(requiredFields);
            
            var existing = uow.Connection.TryFirst<GlobalFormSettingsRow>(q => q
                .Select(GlobalFormSettingsRow.Fields.Id)
                .Where(GlobalFormSettingsRow.Fields.SettingKey == settingKey));
            
            if (existing != null)
            {
                uow.Connection.UpdateById(new GlobalFormSettingsRow
                {
                    Id = existing.Id,
                    SettingValue = settingValue,
                    UpdateDate = DateTime.Now,
                    UpdateUserId = int.Parse(User.GetIdentifier())
                });
            }
            else
            {
                uow.Connection.Insert(new GlobalFormSettingsRow
                {
                    SettingKey = settingKey,
                    SettingValue = settingValue,
                    InsertDate = DateTime.Now,
                    InsertUserId = int.Parse(User.GetIdentifier())
                });
            }
            
            System.Diagnostics.Debug.WriteLine($"Global required fields saved: {settingValue}");
        }
        
        private List<string> GetGlobalRequiredFields(IDbConnection connection)
        {
            var settingKey = "RequiredFields";
            var row = connection.TryFirst<GlobalFormSettingsRow>(q => q
                .Select(GlobalFormSettingsRow.Fields.SettingValue)
                .Where(GlobalFormSettingsRow.Fields.SettingKey == settingKey));
            
            if (row != null && !string.IsNullOrEmpty(row.SettingValue))
            {
                try
                {
                    return JsonConvert.DeserializeObject<List<string>>(row.SettingValue);
                }
                catch
                {
                    return new List<string>();
                }
            }
            
            return new List<string>();
        }
        
        private bool IsAdmin()
        {
            var username = User.Identity?.Name;
            return username?.ToLower() == "admin";
        }
    }

    public interface IFormEditorV2SaveHandler : ISaveHandler<MyRow> { }
    public interface IFormEditorV2DeleteHandler : IDeleteHandler<MyRow> { }
    public interface IFormEditorV2RetrieveHandler : IRetrieveHandler<MyRow> { }
    public interface IFormEditorV2ListHandler : IListHandler<MyRow> { }

    public class FormEditorV2SaveHandler : SaveRequestHandler<MyRow>, IFormEditorV2SaveHandler
    {
        public FormEditorV2SaveHandler(IRequestContext context)
             : base(context)
        {
        }
    }

    public class FormEditorV2DeleteHandler : DeleteRequestHandler<MyRow>, IFormEditorV2DeleteHandler
    {
        public FormEditorV2DeleteHandler(IRequestContext context)
             : base(context)
        {
        }
    }

    public class FormEditorV2RetrieveHandler : RetrieveRequestHandler<MyRow>, IFormEditorV2RetrieveHandler
    {
        public FormEditorV2RetrieveHandler(IRequestContext context)
             : base(context)
        {
        }
    }

    public class FormEditorV2ListHandler : ListRequestHandler<MyRow>, IFormEditorV2ListHandler
    {
        public FormEditorV2ListHandler(IRequestContext context)
             : base(context)
        {
        }
    }

    public class SaveUserSettingsRequest : ServiceRequest
    {
        public string Settings { get; set; }
    }

    public class GetUserSettingsRequest : ServiceRequest
    {
    }

    public class GetUserSettingsResponse : ServiceResponse
    {
        public string Settings { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public bool IsAdmin { get; set; }
        public List<string> RequiredFields { get; set; }
    }
}