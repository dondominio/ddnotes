-- Table structure for ddnotes plugin

CREATE TABLE "ddnotes" (
    "id" integer NOT NULL PRIMARY KEY,
    "user_id" integer NOT NULL
        REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    "parent_id" integer NOT NULL DEFAULT 0,
    "title" varchar(128) NOT NULL,
    "mimetype" varchar(100) NOT NULL,
    "content" long NOT NULL,
    "file_size" bigint NOT NULL,
    "ts_created" timestamp with time zone DEFAULT current_timestamp NOT NULL,
    "ts_updated" timestamp with time zone DEFAULT NULL
);

CREATE SEQUENCE "ddnotes_seq"
    START WITH 1 INCREMENT BY 1 NOMAXVALUE;

CREATE TRIGGER "ddnotes_seq_trig"
BEFORE INSERT ON "ddnotes" FOR EACH ROW
BEGIN
    :NEW."id" := "ddnotes_seq".nextval;
END;
/