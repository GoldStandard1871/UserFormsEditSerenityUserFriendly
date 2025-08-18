using FluentMigrator;

namespace UserControlForm.Migrations.DefaultDB;

[Migration(20250201_1000)]
public class DefaultDB_20250201_FieldCustomization : AutoReversingMigration
{
    public override void Up()
    {
        // Admin Required Fields tablosu
        Create.Table("AdminRequiredFields")
            .WithColumn("Id").AsInt32().Identity().PrimaryKey().NotNullable()
            .WithColumn("DialogName").AsString(100).NotNullable()
            .WithColumn("FieldName").AsString(100).NotNullable()
            .WithColumn("IsRequired").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("CreatedDate").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentDateTime)
            .WithColumn("CreatedBy").AsInt32().NotNullable()
            .WithColumn("UpdatedDate").AsDateTime().Nullable()
            .WithColumn("UpdatedBy").AsInt32().Nullable();

        Create.UniqueConstraint("UK_AdminRequiredFields")
            .OnTable("AdminRequiredFields")
            .Columns("DialogName", "FieldName");

        Create.Index("IX_AdminRequiredFields_DialogName")
            .OnTable("AdminRequiredFields")
            .OnColumn("DialogName");

        // User Field Settings tablosu
        Create.Table("UserFieldSettings")
            .WithColumn("Id").AsInt32().Identity().PrimaryKey().NotNullable()
            .WithColumn("UserId").AsInt32().NotNullable()
            .WithColumn("DialogName").AsString(100).NotNullable()
            .WithColumn("FieldName").AsString(100).NotNullable()
            .WithColumn("IsVisible").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("DisplayOrder").AsInt32().NotNullable().WithDefaultValue(0)
            .WithColumn("CreatedDate").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentDateTime)
            .WithColumn("UpdatedDate").AsDateTime().Nullable();

        Create.UniqueConstraint("UK_UserFieldSettings")
            .OnTable("UserFieldSettings")
            .Columns("UserId", "DialogName", "FieldName");

        Create.Index("IX_UserFieldSettings_UserId_DialogName")
            .OnTable("UserFieldSettings")
            .OnColumn("UserId").Ascending()
            .OnColumn("DialogName").Ascending();
    }
}