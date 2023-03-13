-- Table structure for ddnotes plugin

CREATE TABLE IF NOT EXISTS `ddnotes` (
 `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` int(10) UNSIGNED NOT NULL,
 `parent_id` int(10) UNSIGNED NOT NULL DEFAULT 0,
 `title` varchar(128) NOT NULL,
 `mimetype` varchar(100) NOT NULL,
 `content` longblob NOT NULL,
 `file_size` bigint(20) NOT NULL,
 `ts_created` timestamp NOT NULL DEFAULT current_timestamp(),
 `ts_updated` timestamp NOT NULL DEFAULT current_timestamp(),
  INDEX `user_id_fk_dd_notes` (`user_id`),
  PRIMARY KEY (`id`),
  CONSTRAINT `user_id_fk_ddnotes` FOREIGN KEY (`user_id`)
   REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

