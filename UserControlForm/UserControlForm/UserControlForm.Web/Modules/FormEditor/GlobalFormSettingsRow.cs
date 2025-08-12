using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace UserControlForm.FormEditor
{
    [ConnectionKey("Default"), Module("FormEditor"), TableName("GlobalFormSettings")]
    [DisplayName("Global Form Settings"), InstanceName("Global Form Settings")]
    [ReadPermission("*")]
    [ModifyPermission("Administration:General")]
    public sealed class GlobalFormSettingsRow : Row<GlobalFormSettingsRow.RowFields>, IIdRow
    {
        [DisplayName("Id"), Identity, IdProperty]
        public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

        [DisplayName("Setting Key"), Size(100), NotNull, QuickSearch]
        public string SettingKey { get => fields.SettingKey[this]; set => fields.SettingKey[this] = value; }

        [DisplayName("Setting Value"), NotNull]
        public string SettingValue { get => fields.SettingValue[this]; set => fields.SettingValue[this] = value; }

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
            public StringField SettingKey;
            public StringField SettingValue;
            public DateTimeField InsertDate;
            public Int32Field InsertUserId;
            public DateTimeField UpdateDate;
            public Int32Field UpdateUserId;
        }
    }
}