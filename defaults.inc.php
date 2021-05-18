<?php

$config["ddnotes_config"] = [

    /**
     * Max size of the note. Notes content are saved via `longblob` column type.
     * The size of this column is not the same as the file size at the computer filesystem.
     * So this value must be always greatter than the upload_max_filesize.
     * This value is represented as bytes.
     * null refers to no limit
     */
    "note_max_filesize" => null,

    /**
     * Max size of the files/images uploads.
     * This value must be always smaller than the note_max_filesize.
     * This value is represented as bytes.
     * null refers to server upload_max_filesize
     */
    "upload_max_filesize" => null,

    /**
     * Extensions that plugin supports
     */
    "extensions" => [
        /** 
         * Image extensions for upload
         */ 
        "image" => ["jpg", "jpeg", "png"],

        /**
         * File extensions for upload
         */
        "application" => ["pdf"],

        /**
         * Text file extensions for upload
         * They must be plain text based because they will be used with the editor
         * Tested with "markdown", "plain" and "html"
         * The first extension on this array will be the default at Elastic skin
         */
        "text" => ["plain", "markdown", "html"],
    ]

];

?>