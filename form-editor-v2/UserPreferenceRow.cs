using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.UserControlForm
{
    [ConnectionKey("Default"), Module("UserControlForm"), TableName("UserPreferences")]
    [DisplayName("User Preference"), InstanceName("User Preference")]
    [ReadPermission("Administration:General")]
    [ModifyPermission("Administration:General")]
    public sealed class UserPreferenceRow : Row<UserPreferenceRow.RowFields>, IIdRow
    {
        [DisplayName("User Preference Id"), Identity, IdProperty]
        public int? UserPreferenceId { get => fields.UserPreferenceId[this]; set => fields.UserPreferenceId[this] = value; }

        [DisplayName("User Id"), NotNull]
        public int? UserId { get => fields.UserId[this]; set => fields.UserId[this] = value; }

        [DisplayName("Preference Type"), Size(100), NotNull]
        public string PreferenceType { get => fields.PreferenceType[this]; set => fields.PreferenceType[this] = value; }

        [DisplayName("Name"), Size(200), NotNull]
        public string Name { get => fields.Name[this]; set => fields.Name[this] = value; }

        [DisplayName("Value"), Size(-1)]
        public string Value { get => fields.Value[this]; set => fields.Value[this] = value; }

        [DisplayName("Insert Date"), NotNull]
        public DateTime? InsertDate { get => fields.InsertDate[this]; set => fields.InsertDate[this] = value; }

        [DisplayName("Update Date")]
        public DateTime? UpdateDate { get => fields.UpdateDate[this]; set => fields.UpdateDate[this] = value; }

        public class RowFields : RowFieldsBase
        {
            public Int32Field UserPreferenceId;
            public Int32Field UserId;
            public StringField PreferenceType;
            public StringField Name;
            public StringField Value;
            public DateTimeField InsertDate;
            public DateTimeField UpdateDate;
        }
    }
}