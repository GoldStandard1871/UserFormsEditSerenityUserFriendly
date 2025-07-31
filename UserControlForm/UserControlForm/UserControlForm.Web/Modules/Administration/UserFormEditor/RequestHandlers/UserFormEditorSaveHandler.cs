using Serenity;
using Serenity.Data;
using Serenity.Services;
using MyRequest = Serenity.Services.SaveRequest<UserControlForm.Administration.UserFormEditorRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = UserControlForm.Administration.UserFormEditorRow;

namespace UserControlForm.Administration;

public interface IUserFormEditorSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }

public class UserFormEditorSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, IUserFormEditorSaveHandler
{
    public UserFormEditorSaveHandler(IRequestContext context)
         : base(context)
    {
    }

    protected override void ValidateRequest()
    {
        base.ValidateRequest();

        if (!string.IsNullOrEmpty(Row.FormName))
        {
            // Aynı FormName'e sahip başka kayıt var mı kontrol et
            var existingRow = Connection.TryFirst<MyRow>(q => q
                .Select(MyRow.Fields.TemplateId)
                .Where(MyRow.Fields.FormName == Row.FormName));

            if (existingRow != null)
            {
                // Update durumunda kendi kaydımızı hariç tut
                if (IsCreate || existingRow.TemplateId != Row.TemplateId)
                {
                    throw new ValidationError("FormName", "Bu form adı zaten kullanılıyor. Lütfen farklı bir ad girin.");
                }
            }
        }
    }

    protected override void SetInternalFields()
    {
        base.SetInternalFields();

        if (IsCreate)
        {
            Row.CreatedBy = User.GetIdentifier() != null ? int.Parse(User.GetIdentifier()) : null;
            Row.CreatedDate = DateTime.Now;
            
            // FormDesign boşsa varsayılan değer ata
            if (string.IsNullOrEmpty(Row.FormDesign))
            {
                Row.FormDesign = "{\"fields\":[]}";
            }
        }

        Row.ModifiedBy = User.GetIdentifier() != null ? int.Parse(User.GetIdentifier()) : null;
        Row.ModifiedDate = DateTime.Now;
    }
}