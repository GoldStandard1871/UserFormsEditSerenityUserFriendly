using FluentMigrator;

namespace UserControlForm.Migrations.DefaultDB
{
    [Migration(20250108143000)]
    public class DefaultDB_20250108_FormEditorV2 : Migration
    {
        public override void Up()
        {
            Create.Table("FormEditorV2")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("FormName").AsString(200).NotNullable()
                .WithColumn("DisplayOrder").AsInt32().NotNullable().WithDefaultValue(0)
                .WithColumn("IsActive").AsBoolean().NotNullable().WithDefaultValue(true);

            Create.Table("UserFormSettings")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("UserId").AsInt32().NotNullable()
                .WithColumn("Settings").AsString(int.MaxValue).NotNullable()
                .WithColumn("InsertDate").AsDateTime().NotNullable()
                .WithColumn("InsertUserId").AsInt32().NotNullable()
                .WithColumn("UpdateDate").AsDateTime().Nullable()
                .WithColumn("UpdateUserId").AsInt32().Nullable();

            Create.UniqueConstraint("UQ_UserFormSettings_UserId")
                .OnTable("UserFormSettings")
                .Column("UserId");

            // Örnek veri ekleme
            Insert.IntoTable("FormEditorV2")
                .Row(new { FormName = "Müşteri Bilgileri", DisplayOrder = 1, IsActive = true })
                .Row(new { FormName = "İletişim Bilgileri", DisplayOrder = 2, IsActive = true })
                .Row(new { FormName = "Adres Bilgileri", DisplayOrder = 3, IsActive = true })
                .Row(new { FormName = "Finansal Bilgiler", DisplayOrder = 4, IsActive = true })
                .Row(new { FormName = "Notlar ve Açıklamalar", DisplayOrder = 5, IsActive = true });
        }

        public override void Down()
        {
            Delete.Table("UserFormSettings");
            Delete.Table("FormEditorV2");
        }
    }
}