using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.Administration;

[ConnectionKey("Default"), Module("Administration"), TableName("AdminRequiredFields")]
[DisplayName("Admin Required Fields"), InstanceName("Admin Required Field")]
[ReadPermission("Administration:General")]
[ModifyPermission("Administration:General")]
public sealed class AdminRequiredFieldsRow : Row<AdminRequiredFieldsRow.RowFields>, IIdRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

    [DisplayName("Dialog Name"), Size(100), NotNull, QuickSearch]
    public string DialogName { get => fields.DialogName[this]; set => fields.DialogName[this] = value; }

    [DisplayName("Field Name"), Size(100), NotNull]
    public string FieldName { get => fields.FieldName[this]; set => fields.FieldName[this] = value; }

    [DisplayName("Is Required"), NotNull]
    public bool? IsRequired { get => fields.IsRequired[this]; set => fields.IsRequired[this] = value; }

    [DisplayName("Created Date"), NotNull]
    public DateTime? CreatedDate { get => fields.CreatedDate[this]; set => fields.CreatedDate[this] = value; }

    [DisplayName("Created By"), NotNull]
    public int? CreatedBy { get => fields.CreatedBy[this]; set => fields.CreatedBy[this] = value; }

    [DisplayName("Updated Date")]
    public DateTime? UpdatedDate { get => fields.UpdatedDate[this]; set => fields.UpdatedDate[this] = value; }

    [DisplayName("Updated By")]
    public int? UpdatedBy { get => fields.UpdatedBy[this]; set => fields.UpdatedBy[this] = value; }

    public class RowFields : RowFieldsBase
    {
        public Int32Field Id;
        public StringField DialogName;
        public StringField FieldName;
        public BooleanField IsRequired;
        public DateTimeField CreatedDate;
        public Int32Field CreatedBy;
        public DateTimeField UpdatedDate;
        public Int32Field UpdatedBy;
    }
}