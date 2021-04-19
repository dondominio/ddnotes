-- Table structure for ddnotes plugin

CREATE TABLE [dbo].[ddnotes] (
	[id] [int] NOT NULL ,
	[user_id] [int] NOT NULL ,
	[parent_id] [int] NOT NULL DEFAULT 0,
	[title] [varchar] (128) COLLATE Latin1_General_CS_AS NOT NULL ,
	[mimetype] [varchar] (100) NOT NULL ,
	[content] [varbinary] (max) NOT NULL ,
	[file_size] [bigint] NOT NULL ,
	[ts_created] [datetime] DEFAULT current_timestamp NOT NULL , 
	[ts_updated] [datetime] DEFAULT current_timestamp NOT NULL ,
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[ddnotes] WITH NOCHECK ADD 
	CONSTRAINT [PK_ddnotes_id] PRIMARY KEY CLUSTERED 
	(
		[id]
	) ON [PRIMARY] 
GO

ALTER TABLE [dbo].[ddnotes] ADD CONSTRAINT [FK_ddnotes_user_id] 
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[users] ([user_id])
    ON DELETE CASCADE ON UPDATE CASCADE
GO