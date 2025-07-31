using FluentMigrator;

namespace UserControlForm.Migrations.DefaultDB
{
    [Migration(20250125160000)]
    public class DefaultDB_20250125_AddFormFields : Migration
    {
        public override void Up()
        {
            // Description alanını ekle
            if (!Schema.Table("UserFormTemplates").Column("Description").Exists())
            {
                Alter.Table("UserFormTemplates")
                    .AddColumn("Description").AsString(500).Nullable();
            }

            // Purpose alanını ekle
            if (!Schema.Table("UserFormTemplates").Column("Purpose").Exists())
            {
                Alter.Table("UserFormTemplates")
                    .AddColumn("Purpose").AsString(1000).Nullable();
            }

            // Instructions alanını ekle
            if (!Schema.Table("UserFormTemplates").Column("Instructions").Exists())
            {
                Alter.Table("UserFormTemplates")
                    .AddColumn("Instructions").AsString(2000).Nullable();
            }
        }

        public override void Down()
        {
            Delete.Column("Instructions").FromTable("UserFormTemplates");
            Delete.Column("Purpose").FromTable("UserFormTemplates");
            Delete.Column("Description").FromTable("UserFormTemplates");
        }
    }
}