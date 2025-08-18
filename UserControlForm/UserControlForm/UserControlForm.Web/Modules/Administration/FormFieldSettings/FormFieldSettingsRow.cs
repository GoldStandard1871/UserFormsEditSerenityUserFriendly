using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.Administration
{
    [ConnectionKey("Default"), Module("Administration"), TableName("FormFieldSettings")]
    [DisplayName("Form Field Settings"), InstanceName("Field Setting")]
    [ReadPermission("Administration:General")]
    [ModifyPermission("Administration:General")]
    public sealed class FormFieldSettingsRow : Row<FormFieldSettingsRow.RowFields>, IIdRow
    {
        [DisplayName("Id"), Identity, IdProperty]
        public int? Id
        {
            get => fields.Id[this];
            set => fields.Id[this] = value;
        }

        [DisplayName("Dialog Name"), Size(100), NotNull, QuickSearch]
        public string DialogName
        {
            get => fields.DialogName[this];
            set => fields.DialogName[this] = value;
        }

        [DisplayName("Field Name"), Size(100), NotNull]
        public string FieldName
        {
            get => fields.FieldName[this];
            set => fields.FieldName[this] = value;
        }

        [DisplayName("Is Required"), NotNull]
        public bool? IsRequired
        {
            get => fields.IsRequired[this];
            set => fields.IsRequired[this] = value;
        }

        [DisplayName("Display Order")]
        public int? DisplayOrder
        {
            get => fields.DisplayOrder[this];
            set => fields.DisplayOrder[this] = value;
        }

        [DisplayName("Is Hidden"), NotNull]
        public bool? IsHidden
        {
            get => fields.IsHidden[this];
            set => fields.IsHidden[this] = value;
        }

        [DisplayName("Created By")]
        public int? CreatedBy
        {
            get => fields.CreatedBy[this];
            set => fields.CreatedBy[this] = value;
        }

        [DisplayName("Created Date")]
        public DateTime? CreatedDate
        {
            get => fields.CreatedDate[this];
            set => fields.CreatedDate[this] = value;
        }

        [DisplayName("Modified By")]
        public int? ModifiedBy
        {
            get => fields.ModifiedBy[this];
            set => fields.ModifiedBy[this] = value;
        }

        [DisplayName("Modified Date")]
        public DateTime? ModifiedDate
        {
            get => fields.ModifiedDate[this];
            set => fields.ModifiedDate[this] = value;
        }

        public FormFieldSettingsRow()
            : base()
        {
        }

        public FormFieldSettingsRow(RowFields fields)
            : base(fields)
        {
        }

        public class RowFields : RowFieldsBase
        {
            public Int32Field Id;
            public StringField DialogName;
            public StringField FieldName;
            public BooleanField IsRequired;
            public Int32Field DisplayOrder;
            public BooleanField IsHidden;
            public Int32Field CreatedBy;
            public DateTimeField CreatedDate;
            public Int32Field ModifiedBy;
            public DateTimeField ModifiedDate;
        }
    }
}