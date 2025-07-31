using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.Administration;

[ConnectionKey("Default"), Module("Administration"), TableName("UserFormTemplates")]
[DisplayName("User Form Templates"), InstanceName("User Form Template")]
[ReadPermission("Administration:UserFormEditor")]
[ModifyPermission("Administration:UserFormEditor")]
public sealed class UserFormEditorRow : Row<UserFormEditorRow.RowFields>, IIdRow, INameRow
{
    [DisplayName("Template Id"), Identity, IdProperty]
    public int? TemplateId { get => fields.TemplateId[this]; set => fields.TemplateId[this] = value; }

    [DisplayName("Form Name"), Size(200), NotNull, QuickSearch, NameProperty]
    public string FormName { get => fields.FormName[this]; set => fields.FormName[this] = value; }
    
    [DisplayName("Description"), Size(500)]
    public string Description { get => fields.Description[this]; set => fields.Description[this] = value; }
    
    [DisplayName("Purpose"), Size(1000)]
    public string Purpose { get => fields.Purpose[this]; set => fields.Purpose[this] = value; }
    
    [DisplayName("Instructions"), Size(2000)]
    public string Instructions { get => fields.Instructions[this]; set => fields.Instructions[this] = value; }

    [DisplayName("Form Design")]
    public string FormDesign { get => fields.FormDesign[this]; set => fields.FormDesign[this] = value; }

    [DisplayName("Created By"), ForeignKey("[dbo].[Users]", "UserId"), LeftJoin("jCreatedBy")]
    public int? CreatedBy { get => fields.CreatedBy[this]; set => fields.CreatedBy[this] = value; }

    [DisplayName("Created Date")]
    public DateTime? CreatedDate { get => fields.CreatedDate[this]; set => fields.CreatedDate[this] = value; }

    [DisplayName("Modified By"), ForeignKey("[dbo].[Users]", "UserId"), LeftJoin("jModifiedBy")]
    public int? ModifiedBy { get => fields.ModifiedBy[this]; set => fields.ModifiedBy[this] = value; }

    [DisplayName("Modified Date")]
    public DateTime? ModifiedDate { get => fields.ModifiedDate[this]; set => fields.ModifiedDate[this] = value; }

    [DisplayName("Is Active")]
    public bool? IsActive { get => fields.IsActive[this]; set => fields.IsActive[this] = value; }

    [DisplayName("Created By Username"), Expression("jCreatedBy.[Username]")]
    public string CreatedByUsername { get => fields.CreatedByUsername[this]; set => fields.CreatedByUsername[this] = value; }

    [DisplayName("Modified By Username"), Expression("jModifiedBy.[Username]")]
    public string ModifiedByUsername { get => fields.ModifiedByUsername[this]; set => fields.ModifiedByUsername[this] = value; }

    public class RowFields : RowFieldsBase
    {
        public Int32Field TemplateId;
        public StringField FormName;
        public StringField Description;
        public StringField Purpose;
        public StringField Instructions;
        public StringField FormDesign;
        public Int32Field CreatedBy;
        public DateTimeField CreatedDate;
        public Int32Field ModifiedBy;
        public DateTimeField ModifiedDate;
        public BooleanField IsActive;
        public StringField CreatedByUsername;
        public StringField ModifiedByUsername;
    }
}