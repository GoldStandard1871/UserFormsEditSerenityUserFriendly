using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.Administration;

[ConnectionKey("Default"), Module("Administration"), TableName("UserFieldSettings")]
[DisplayName("User Field Settings"), InstanceName("User Field Setting")]
[ReadPermission("")]
[ModifyPermission("")]
public sealed class UserFieldSettingsRow : Row<UserFieldSettingsRow.RowFields>, IIdRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

    [DisplayName("User Id"), NotNull]
    public int? UserId { get => fields.UserId[this]; set => fields.UserId[this] = value; }

    [DisplayName("Dialog Name"), Size(100), NotNull]
    public string DialogName { get => fields.DialogName[this]; set => fields.DialogName[this] = value; }

    [DisplayName("Field Name"), Size(100), NotNull]
    public string FieldName { get => fields.FieldName[this]; set => fields.FieldName[this] = value; }

    [DisplayName("Is Visible"), NotNull]
    public bool? IsVisible { get => fields.IsVisible[this]; set => fields.IsVisible[this] = value; }

    [DisplayName("Display Order"), NotNull]
    public int? DisplayOrder { get => fields.DisplayOrder[this]; set => fields.DisplayOrder[this] = value; }

    [DisplayName("Created Date"), NotNull]
    public DateTime? CreatedDate { get => fields.CreatedDate[this]; set => fields.CreatedDate[this] = value; }

    [DisplayName("Updated Date")]
    public DateTime? UpdatedDate { get => fields.UpdatedDate[this]; set => fields.UpdatedDate[this] = value; }

    public class RowFields : RowFieldsBase
    {
        public Int32Field Id;
        public Int32Field UserId;
        public StringField DialogName;
        public StringField FieldName;
        public BooleanField IsVisible;
        public Int32Field DisplayOrder;
        public DateTimeField CreatedDate;
        public DateTimeField UpdatedDate;
    }
}