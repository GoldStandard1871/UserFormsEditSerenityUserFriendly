using FluentMigrator;

namespace UserControlForm.Migrations.DefaultDB;

[DefaultDB, MigrationKey(20250128_1000)]
public class DefaultDB_20250128_1000_AddAdmin2User : Migration
{
    public override void Up()
    {
        // Admin2 kullanıcısını ekle
        Insert.IntoTable("Users").Row(new
        {
            Username = "admin2",
            DisplayName = "Admin 2",
            Email = "admin2@example.com",
            Source = "site",
            PasswordHash = "rfqpSPYs0ekFlPyvIRTXsdhE/qrTHFF+kKsAUla7pFkXL4BgLGlTe89GDX5DBysenMDj8AqbIZPybqvusyCjwQ",
            PasswordSalt = "hJf_F",
            InsertDate = new System.DateTime(2025, 1, 28),
            InsertUserId = 1,
            IsActive = 1
        });
    }

    public override void Down()
    {
        // Admin2 kullanıcısını sil
        Delete.FromTable("Users").Row(new { Username = "admin2" });
    }
}