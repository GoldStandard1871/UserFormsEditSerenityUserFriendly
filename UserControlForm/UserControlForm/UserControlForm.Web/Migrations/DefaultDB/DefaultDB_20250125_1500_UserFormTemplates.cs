using FluentMigrator;

namespace UserControlForm.Migrations.DefaultDB;

[DefaultDB, MigrationKey(20250125_1500)]
public class DefaultDB_20250125_1500_UserFormTemplates : AutoReversingMigration
{
    public override void Up()
    {
        Create.Table("UserFormTemplates")
            .WithColumn("TemplateId").AsInt32().IdentityKey(this)
            .WithColumn("FormName").AsString(200).NotNullable()
            .WithColumn("FormDesign").AsString(int.MaxValue).Nullable().WithDefaultValue("{\"fields\":[]}")
            .WithColumn("CreatedBy").AsInt32().Nullable()
                .ForeignKey("FK_UserFormTemplates_CreatedBy", "Users", "UserId")
            .WithColumn("CreatedDate").AsDateTime().Nullable()
            .WithColumn("ModifiedBy").AsInt32().Nullable()
                .ForeignKey("FK_UserFormTemplates_ModifiedBy", "Users", "UserId")
            .WithColumn("ModifiedDate").AsDateTime().Nullable()
            .WithColumn("IsActive").AsBoolean().NotNullable().WithDefaultValue(true);

        Create.Index("IX_UserFormTemplates_FormName")
            .OnTable("UserFormTemplates")
            .OnColumn("FormName").Ascending()
            .WithOptions().Unique();
    }
}