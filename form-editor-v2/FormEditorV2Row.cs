using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System.ComponentModel;

namespace UserControlForm.UserControlForm
{
    [ConnectionKey("Default"), Module("UserControlForm"), TableName("FormEditorV2")]
    [DisplayName("Form Editor V2"), InstanceName("Form")]
    [ReadPermission("Administration:General")]
    [ModifyPermission("Administration:General")]
    public sealed class FormEditorV2Row : Row<FormEditorV2Row.RowFields>, IIdRow, INameRow
    {
        [DisplayName("Id"), Identity, IdProperty]
        public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

        [DisplayName("Form Name"), Size(200), NotNull, QuickSearch, NameProperty]
        public string FormName { get => fields.FormName[this]; set => fields.FormName[this] = value; }

        [DisplayName("Display Order"), NotNull]
        public int? DisplayOrder { get => fields.DisplayOrder[this]; set => fields.DisplayOrder[this] = value; }

        [DisplayName("Is Active"), NotNull]
        public bool? IsActive { get => fields.IsActive[this]; set => fields.IsActive[this] = value; }

        public class RowFields : RowFieldsBase
        {
            public Int32Field Id;
            public StringField FormName;
            public Int32Field DisplayOrder;
            public BooleanField IsActive;
        }
    }
}