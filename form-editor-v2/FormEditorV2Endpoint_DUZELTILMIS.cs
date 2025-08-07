using Microsoft.AspNetCore.Mvc;
using Serenity.Services;
using System;
using System.Data;
using Newtonsoft.Json.Linq;
using Serenity;
using UserControlForm.UserControlForm.Entities;
using MyRow = UserControlForm.UserControlForm.UserFormSettingsRow;

namespace UserControlForm.UserControlForm.Endpoints
{
    [Route("Services/UserControlForm/FormEditorV2/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class FormEditorV2Endpoint : ServiceEndpoint
    {
        private int GetCurrentUserId()
        {
            var userId = User.GetIdentifier();
            System.Diagnostics.Debug.WriteLine($"GetCurrentUserId - Raw UserId: {userId}");
            
            if (string.IsNullOrEmpty(userId))
            {
                // Test için sabit ID
                System.Diagnostics.Debug.WriteLine("UYARI: Kullanıcı ID bulunamadı, test için 1 kullanılıyor!");
                return 1;
            }
            
            var userIdInt = Convert.ToInt32(userId);
            System.Diagnostics.Debug.WriteLine($"GetCurrentUserId - Parsed UserId: {userIdInt}");
            return userIdInt;
        }

        [HttpPost, AuthorizeUpdate(typeof(MyRow))]
        public ServiceResponse SaveUserSettings(IUnitOfWork uow, SaveUserSettingsRequest request)
        {
            var userId = GetCurrentUserId();
            var settings = request.Settings;

            System.Diagnostics.Debug.WriteLine($"SaveUserSettings - UserId: {userId}");
            System.Diagnostics.Debug.WriteLine($"Settings: {settings}");

            try
            {
                // UserFormSettings tablosuna kaydet
                var existing = uow.Connection.TryFirst<UserFormSettingsRow>(q => q
                    .Select(UserFormSettingsRow.Fields.Id)
                    .Where(UserFormSettingsRow.Fields.UserId == userId));

                if (existing != null)
                {
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
                    uow.Connection.Insert(new UserFormSettingsRow
                    {
                        UserId = userId,
                        Settings = settings,
                        InsertDate = DateTime.Now,
                        InsertUserId = userId
                    });
                }

                return new ServiceResponse();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"SaveUserSettings Error: {ex.Message}");
                throw new ValidationError($"Ayarlar kaydedilirken hata oluştu: {ex.Message}");
            }
        }

        [HttpPost, AuthorizeList(typeof(MyRow))]
        public GetUserSettingsResponse GetUserSettings(IDbConnection connection, GetUserSettingsRequest request)
        {
            var userId = GetCurrentUserId();
            
            var settings = connection.TryFirst<UserFormSettingsRow>(q => q
                .Select(UserFormSettingsRow.Fields.Settings)
                .Where(UserFormSettingsRow.Fields.UserId == userId));

            return new GetUserSettingsResponse
            {
                Settings = settings?.Settings
            };
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
    }
}