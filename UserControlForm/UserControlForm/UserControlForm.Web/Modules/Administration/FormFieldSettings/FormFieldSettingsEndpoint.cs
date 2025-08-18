using Microsoft.AspNetCore.Mvc;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using Serenity.Web;
using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using MyRow = UserControlForm.Administration.FormFieldSettingsRow;

namespace UserControlForm.Administration.Endpoints
{
    [Route("Services/Administration/FormFieldSettings/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class FormFieldSettingsController : ServiceEndpoint
    {
        [HttpPost]
        public SaveResponse SaveSettings(IUnitOfWork uow, SaveSettingsRequest request)
        {
            // Admin kontrolü
            if (!Permissions.HasPermission("Administration:General"))
                throw new ValidationError("Only administrators can save field settings");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            foreach (var field in request.Fields)
            {
                var connection = uow.Connection;
                
                // Var olan kaydı kontrol et
                var existing = connection.TryFirst<MyRow>(q => q
                    .Select(MyRow.Fields.Id)
                    .Where(MyRow.Fields.DialogName == request.DialogName && 
                           MyRow.Fields.FieldName == field.FieldName));

                if (existing != null)
                {
                    // Güncelle
                    connection.UpdateById(new MyRow
                    {
                        Id = existing.Id,
                        IsRequired = field.IsRequired,
                        DisplayOrder = field.DisplayOrder,
                        IsHidden = field.IsHidden,
                        ModifiedBy = userId,
                        ModifiedDate = DateTime.Now
                    });
                }
                else
                {
                    // Yeni kayıt
                    connection.Insert(new MyRow
                    {
                        DialogName = request.DialogName,
                        FieldName = field.FieldName,
                        IsRequired = field.IsRequired,
                        DisplayOrder = field.DisplayOrder,
                        IsHidden = field.IsHidden,
                        CreatedBy = userId,
                        CreatedDate = DateTime.Now
                    });
                }
            }

            return new SaveResponse();
        }

        [HttpPost]
        public GetSettingsResponse GetSettings(IDbConnection connection, GetSettingsRequest request)
        {
            var fields = connection.List<MyRow>(q => q
                .Select(MyRow.Fields.FieldName, 
                        MyRow.Fields.IsRequired,
                        MyRow.Fields.DisplayOrder,
                        MyRow.Fields.IsHidden)
                .Where(MyRow.Fields.DialogName == request.DialogName)
                .OrderBy(MyRow.Fields.DisplayOrder));

            return new GetSettingsResponse
            {
                Fields = fields.ConvertAll(x => new FieldSetting
                {
                    FieldName = x.FieldName,
                    IsRequired = x.IsRequired ?? false,
                    DisplayOrder = x.DisplayOrder ?? 0,
                    IsHidden = x.IsHidden ?? false
                })
            };
        }
    }

    public class SaveSettingsRequest : ServiceRequest
    {
        public string DialogName { get; set; }
        public List<FieldSetting> Fields { get; set; }
    }

    public class GetSettingsRequest : ServiceRequest
    {
        public string DialogName { get; set; }
    }

    public class GetSettingsResponse : ServiceResponse
    {
        public List<FieldSetting> Fields { get; set; }
    }

    public class FieldSetting
    {
        public string FieldName { get; set; }
        public bool IsRequired { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsHidden { get; set; }
    }
}