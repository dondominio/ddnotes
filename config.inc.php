<?php

$config["ddnotes_config"] = [

    /**
     * Max size of the note. Notes content are saved via `longblob` column type.
     * The size of this column is not the same as the file size at the computer filesystem.
     * So this value must be always greatter than the upload_max_filesize.
     * This value is represented as bytes.
     * Default 26214400 (25MB)
     */
    "note_max_filesize"        => 26214400,

    /**
     * Max size of the files/images uploads.
     * This value must be always smaller than the note_max_filesize.
     * This value is represented as bytes.
     * Default 8388608 (8MB)
     */
    "upload_max_filesize"      => 8388608,

    /**
     * Extensions that plugin supports
     * @see: https://www.freeformatter.com/mime-types-list.html#mime-types-list
     * "type" => [..."subtypes"]
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
         * They must be plain text based because they will be used with the EasyMDE
         * Tested with "markdown", "plain" and "html"
         */
        "text" => ["markdown", "plain", "html"],
    ]

];

?>