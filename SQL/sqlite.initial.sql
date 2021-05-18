-- Table structure for ddnotes plugin

CREATE TABLE ddnotes (
  id integer NOT NULL PRIMARY KEY,
  user_id integer NOT NULL,
  parent_id integer NOT NULL default 0,
  title varchar(128) NOT NULL,
  mimetype varchar(100) NOT NULL,
  content blob NOT NULL,
  file_size bigint NOT NULL,
  ts_created timestamp NOT NULL default current_timestamp,
  ts_updated timestamp NULL default NULL current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);