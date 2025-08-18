-- Movie tablosu oluşturma ve örnek veri ekleme
-- Tarih: 2025-08-13

USE [UserControlForm_Default_v1]
GO

-- Tablo varsa kontrol et
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Movie')
BEGIN
    PRINT 'Movie tablosu zaten mevcut!'
END
ELSE
BEGIN
    -- Movie tablosunu oluştur
    CREATE TABLE [dbo].[Movie](
        [MovieId] [int] IDENTITY(1,1) NOT NULL,
        [Title] [nvarchar](200) NOT NULL,
        [Description] [nvarchar](1000) NULL,
        [Storyline] [nvarchar](max) NULL,
        [Year] [int] NULL,
        [ReleaseDate] [datetime] NULL,
        [Runtime] [int] NULL,
        CONSTRAINT [PK_Movie] PRIMARY KEY CLUSTERED ([MovieId] ASC)
    )
    
    PRINT 'Movie tablosu başarıyla oluşturuldu.'
END
GO

-- Mevcut verileri kontrol et
IF NOT EXISTS (SELECT * FROM Movie)
BEGIN
    -- Örnek film verileri ekle
    INSERT INTO Movie (Title, Description, Storyline, Year, ReleaseDate, Runtime)
    VALUES 
        ('The Shawshank Redemption', 'Two imprisoned men bond over years', 'Andy Dufresne is sentenced to two consecutive life terms in prison for the murders of his wife and her lover and is sentenced to a tough prison. However, only Andy knows he didn''t commit the crimes.', 1994, '1994-10-14', 142),
        ('The Godfather', 'The aging patriarch of an organized crime dynasty', 'The Godfather "Don" Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter''s wedding.', 1972, '1972-03-24', 175),
        ('The Dark Knight', 'Batman faces the Joker', 'Set within a year after the events of Batman Begins, Batman, Lieutenant James Gordon, and new District Attorney Harvey Dent successfully begin to round up the criminals that plague Gotham City.', 2008, '2008-07-18', 152),
        ('12 Angry Men', 'A jury holdout attempts to prevent a miscarriage of justice', 'The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father.', 1957, '1957-04-10', 96),
        ('Schindler''s List', 'Businessman saves Jewish refugees during the Holocaust', 'Oskar Schindler is a vain and greedy German businessman who becomes an unlikely humanitarian amid the barbaric German Nazi reign.', 1993, '1993-12-15', 195),
        ('The Lord of the Rings: The Return of the King', 'Final chapter of the epic trilogy', 'The final confrontation between the forces of good and evil fighting for control of the future of Middle-earth.', 2003, '2003-12-17', 201),
        ('Pulp Fiction', 'Interconnected stories of Los Angeles criminals', 'Jules Winnfield and Vincent Vega are two hit men who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace.', 1994, '1994-10-14', 154),
        ('Fight Club', 'An insomniac office worker forms an underground fight club', 'A nameless first person narrator attends support groups in attempt to subdue his emotional state and relieve his insomniac state.', 1999, '1999-10-15', 139),
        ('Forrest Gump', 'Life story of a slow-witted but kind-hearted man', 'Forrest Gump is a simple man with a low I.Q. but good intentions. He is running through childhood with his best and only friend Jenny.', 1994, '1994-07-06', 142),
        ('Inception', 'A thief who steals corporate secrets through dream-sharing', 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious.', 2010, '2010-07-16', 148)
    
    PRINT '10 örnek film verisi eklendi.'
END
ELSE
BEGIN
    PRINT 'Movie tablosunda zaten veri var.'
END
GO

-- Verileri kontrol et
SELECT COUNT(*) as TotalMovies FROM Movie
SELECT TOP 5 MovieId, Title, Year, Runtime FROM Movie ORDER BY Year DESC

PRINT ''
PRINT 'Movie tablosu kullanıma hazır!'
PRINT 'Integration > Movies menüsünden erişebilirsiniz.'