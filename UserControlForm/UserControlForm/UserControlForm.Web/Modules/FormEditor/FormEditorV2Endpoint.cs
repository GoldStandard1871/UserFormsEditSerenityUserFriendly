using Microsoft.AspNetCore.Mvc;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Data;
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
            var userId = request.UserId;
            var settings = request.Settings;

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
                    UpdateUserId = int.Parse(User.GetIdentifier())
                });
            }
            else
            {
                uow.Connection.Insert(new UserFormSettingsRow
                {
                    UserId = userId,
                    Settings = settings,
                    InsertDate = DateTime.Now,
                    InsertUserId = int.Parse(User.GetIdentifier())
                });
            }

            return new ServiceResponse();
        }

        [HttpPost, AuthorizeList(typeof(MyRow))]
        public GetUserSettingsResponse GetUserSettings(IDbConnection connection, GetUserSettingsRequest request)
        {
            var userId = request.UserId;
            
            var settings = connection.TryFirst<UserFormSettingsRow>(q => q
                .Select(UserFormSettingsRow.Fields.Settings)
                .Where(UserFormSettingsRow.Fields.UserId == userId));

            return new GetUserSettingsResponse
            {
                Settings = settings?.Settings
            };
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
        public int UserId { get; set; }
        public string Settings { get; set; }
    }

    public class GetUserSettingsRequest : ServiceRequest
    {
        public int UserId { get; set; }
    }

    public class GetUserSettingsResponse : ServiceResponse
    {
        public string Settings { get; set; }
    }
}