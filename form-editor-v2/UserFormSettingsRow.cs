using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.UserControlForm
{
    [ConnectionKey("Default"), Module("UserControlForm"), TableName("UserFormSettings")]
    [DisplayName("User Form Settings"), InstanceName("User Form Settings")]
    [ReadPermission("Administration:General")]
    [ModifyPermission("Administration:General")]
    public sealed class UserFormSettingsRow : Row<UserFormSettingsRow.RowFields>, IIdRow
    {
        [DisplayName("Id"), Identity, IdProperty]
        public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

        [DisplayName("User Id"), NotNull]
        public int? UserId { get => fields.UserId[this]; set => fields.UserId[this] = value; }

        [DisplayName("Settings"), NotNull]
        public string Settings { get => fields.Settings[this]; set => fields.Settings[this] = value; }

        [DisplayName("Insert Date"), NotNull]
        public DateTime? InsertDate { get => fields.InsertDate[this]; set => fields.InsertDate[this] = value; }

        [DisplayName("Insert User Id"), NotNull]
        public int? InsertUserId { get => fields.InsertUserId[this]; set => fields.InsertUserId[this] = value; }

        [DisplayName("Update Date")]
        public DateTime? UpdateDate { get => fields.UpdateDate[this]; set => fields.UpdateDate[this] = value; }

        [DisplayName("Update User Id")]
        public int? UpdateUserId { get => fields.UpdateUserId[this]; set => fields.UpdateUserId[this] = value; }

        public class RowFields : RowFieldsBase
        {
            public Int32Field Id;
            public Int32Field UserId;
            public StringField Settings;
            public DateTimeField InsertDate;
            public Int32Field InsertUserId;
            public DateTimeField UpdateDate;
            public Int32Field UpdateUserId;
        }
    }
}