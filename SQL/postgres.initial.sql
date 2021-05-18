-- Table structure for ddnotes plugin

--
-- Sequence "ddnotes_seq"
-- Name: ddnotes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ddnotes_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

--
-- Table "ddnotes"
-- Name: ddnotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ddnotes (
 "id" integer DEFAULT nextval('ddnotes_seq'::text) PRIMARY KEY,
 "user_id" integer NOT NULL
        REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
 "parent_id" integer NOT NULL DEFAULT 0,
 "title" varchar(128) NOT NULL,
 "mimetype" varchar(100) NOT NULL,
 "content" bytea NULL DEFAULT NULL,
 "file_size" bigint NOT NULL,
 "ts_created" timestamp NOT NULL DEFAULT current_timestamp,
 "ts_updated" timestamp NOT NULL DEFAULT current_timestamp
);