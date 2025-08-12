-- Kullanıcı aktivite geçmişi tablosu
-- Her login/logout, sayfa değişimi ve önemli aksiyonları kayıt eder
-- ====================================================================

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'UserActivityHistory')
BEGIN
    CREATE TABLE [dbo].[UserActivityHistory] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [UserId] INT NOT NULL,
        [Username] NVARCHAR(100) NOT NULL,
        [ActivityType] NVARCHAR(50) NOT NULL,  -- 'Login', 'Logout', 'PageView', 'Action'
        [ActivityDetail] NVARCHAR(500),        -- Sayfa adı veya aksiyon detayı
        [IpAddress] NVARCHAR(45),
        [UserAgent] NVARCHAR(500),
        [Timestamp] DATETIME NOT NULL DEFAULT GETDATE(),
        [Duration] INT NULL                    -- Sayfa kalma süresi (saniye)
    )
    
    -- Performans için index'ler
    CREATE INDEX IX_UserActivityHistory_UserId ON UserActivityHistory(UserId)
    CREATE INDEX IX_UserActivityHistory_Timestamp ON UserActivityHistory(Timestamp DESC)
    CREATE INDEX IX_UserActivityHistory_ActivityType ON UserActivityHistory(ActivityType)
    
    PRINT 'UserActivityHistory tablosu oluşturuldu.'
END
ELSE
BEGIN
    PRINT 'UserActivityHistory tablosu zaten mevcut.'
END
GO

-- Test verisi ekle
INSERT INTO UserActivityHistory (UserId, Username, ActivityType, ActivityDetail, IpAddress, Timestamp)
VALUES 
    (1, 'admin', 'Login', 'Dashboard', '127.0.0.1', DATEADD(HOUR, -2, GETDATE())),
    (1, 'admin', 'PageView', 'Form Editor V2', '127.0.0.1', DATEADD(HOUR, -1, GETDATE())),
    (2, 'test', 'Login', 'Dashboard', '127.0.0.1', DATEADD(MINUTE, -30, GETDATE())),
    (2, 'test', 'PageView', 'User Management', '127.0.0.1', DATEADD(MINUTE, -15, GETDATE()))
GO

SELECT TOP 10 * FROM UserActivityHistory ORDER BY Timestamp DESC