using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;

namespace UserControlForm.Administration;

[ConnectionKey("Default"), Module("Administration"), TableName("UserPreferences")]
[DisplayName("User Preferences"), InstanceName("User Preference")]
[ReadPermission("Administration:UserFormEditor")]
[ModifyPermission("Administration:UserFormEditor")]
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

    [DisplayName("Value")]
    public string Value { get => fields.Value[this]; set => fields.Value[this] = value; }

    public class RowFields : RowFieldsBase
    {
        public Int32Field UserPreferenceId;
        public Int32Field UserId;
        public StringField PreferenceType;
        public StringField Name;
        public StringField Value;
    }
}