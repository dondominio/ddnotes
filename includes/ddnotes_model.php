<?php declare(strict_types=1);

/**
 * DonDominio Notes
 * Note Model
 * 
 * @version 1.0
 * @author Soluciones Corporativas IP S.L.
 * @copyright Copyright (c) 2021, SCIP
 * @license Apache-2
 * 
 * Mime Types list
 * @see: http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
 */
class ddnotes_model
{
    public static string $tablename = "ddnotes";

    private int $id;
    private int $parent_id;
    private int $user_id;
    private string $mimetype;
    private string $title;
    private string $content;
    private int $file_size;
    private DateTime $created;
    private DateTime $updated;
    
    public function __construct()
    {
        $this->id           = 0;
        $this->parent_id    = 0;
        $this->user_id      = (int) rcmail::get_instance()->user->ID;
        $this->mimetype     = "text/markdown";
        $this->title        = "";
        $this->content      = "";
        $this->file_size    = 0;
        $this->created      = new DateTime();
        $this->updated      = new DateTime();
    }

    /**
     * Note ID
     *
     * @return integer
     */
    public function getId() : int
    {
        return $this->id;
    }

    /**
     * When it's an embeded image, this is a reference to 
     * the parent note
     *
     * @return integer
     */
    public function getParentId() : int
    {
        return $this->parent_id;
    }

    /**
     * Note User ID
     *
     * @return integer
     */
    public function getUserId() : int
    {
        return $this->user_id;
    }

    /**
     * Note type
     *
     * @return string
     */
    public function getMimeType() : string
    {
        return $this->mimetype;
    }

    /**
     * Note title
     *
     * @return string
     */
    public function getTitle() : string
    {
        return $this->title;
    }

    /**
     * Note content
     * At DB is saved on a longblob column (4GB)
     *
     * @return string|false
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * File size on bytes
     *
     * @return integer
     */
    public function getFileSize(): int
    {
        return $this->file_size;
    }

    /**
     * Human readable filesize
     * @see https://stackoverflow.com/a/49588464
     *
     * @return void
     */
    function getHumanFileSize() 
    {
        for($i = 0, $size = $this->file_size; ($size / 1024) > 0.9; $i++, $size /= 1024) {}
        return round($size, [0,0,1,2,2,3,3,4,4][$i]).[" B"," kB"," MB"," GB"," TB"," PB"," EB"," ZB"," YB"][$i];
    }
    
    /**
     * Get DateTime object with creation time
     *
     * @return DateTime
     */
    public function getCreated() : DateTime
    {
        return $this->created;
    }

    /**
     * Get Datetime object with last update|created
     *
     * @return DateTime
     */
    public function getUpdated() : DateTime
    {
        return $this->updated;
    }

    /**
     * Returns an array with the mimetype and his file extension
     *
     * @return array
     */
    public function getMapFileTypeExtension() : array
    {
        return [
            "text/plain"        => "txt",
            "text/markdown"     => "md",
            "text/html"         => "html",
            "application/pdf"   => "pdf",
            "image/jpeg"        => "jpeg",
            "image/jpg"         => "jpg",
            "image/png"         => "png",
        ];
    }

    /**
     * Get the prefix of the URL to base64 encoded
     *
     * @return string
     */
    public function getMimeString() : string
    {
        return "data:" . $this->mimetype . ";base64,";
    }

    /**
     * Final string for the <img src="">|<a href=""> html tag
     *
     * @return string
     */
    public function getSrcContent(): string
    {
        if ($this->isText()) {
            return $this->getMimeString() . base64_encode( $this->getContent() );
        }

        return $this->getMimeString() . $this->getContent();
    }

    /**
     * Return a translated mimetype array ["type", "subtype"]
     *
     * @return array
     */
    public function getHumanMime() : array
    {
        $parse = $this->parseMime();
        return [
            0           => rcmail::get_instance()->gettext($parse["type"], "ddnotes"),
            "type"      => rcmail::get_instance()->gettext($parse["type"], "ddnotes"),
            1           => rcmail::get_instance()->gettext($parse["subtype"], "ddnotes"),
            "subtype"   => rcmail::get_instance()->gettext($parse["subtype"], "ddnotes"),
        ];
    }

    /**
     * Get the note extension from his mimetype
     *
     * @return string
     */
    public function getExtension() : string
    {
        return $this->getMapFileTypeExtension()[$this->getMimeType()];
    }

    /**
     * Get fontawesome css class based on the note type
     *
     * @return string
     */
    public function getIcon() : string
    {
        // Note for default
        $class = "fas fa-sticky-note";
        
        // Image for images
        if ($this->isImage()) {
            $class = "fas fa-file-image";
        }
        
        // PDF for files
        if ($this->isFile()) {
            $class = "fas fa-file-pdf";
        }

        if ($this->isText()) {
            if ($this->parseMime()["subtype"] === "markdown") {
                $class = "fab fa-markdown";
            }
            
            if ($this->parseMime()["subtype"] === "html") {
                $class = "fab fa-html5";
            }

            if ($this->parseMime()["subtype"] === "plain") {
                $class = "fas fa-file-alt";
            }
        }

        return $class;
    }

    /**
     * Set the parent note ID where the embeded image belongs
     *
     * @param integer $parent
     * @return void
     */
    public function setParentId(int $parent) : void
    {
        $this->parent_id = $parent;
    }

    /**
     * Set User ID
     *
     * @return integer
     */
    public function setUserId($user_id) : void
    {
        $this->user_id = $user_id;
    }

    /**
     * Set note mimetype
     * ex: text/markdown
     * ex: application/pdf 
     *
     * @param string $type
     * @return void
     */
    public function setMimeType(string $mime) : void
    {
        $this->mimetype = $mime;
    }

    /**
     * Set Note Title
     *
     * @param string $title
     * @return void
     */
    public function setTitle(string $title) : void
    {
        $this->title = $title;
    }

    /**
     * Set Note Content
     * Files and Images arrive base64 encoded
     *
     * @param string $note
     * @return void
     */
    public function setContent(string $content) : void
    {
        $this->content = $content;
    }

    /**
     * Set filesize. Is supossed to be in bytes
     *
     * @param integer $size
     * @return void
     */
    public function setFileSize(int $size) : void
    {
        $this->file_size = $size;
    }

    /**
     * Checks if note is a image file
     *
     * @return boolean
     */
    public function isImage() : bool
    {
        return $this->parseMime()["type"] === "image";
    }

    /**
     * Checks if note is a text
     * That include plain_text, markdown and html
     *
     * @return boolean
     */
    public function isText() : bool
    {
        return $this->parseMime()["type"] === "text";
    }

    /**
     * Checks if note is a document
     * That only includes PDF files
     *
     * @return boolean
     */
    public function isFile() : bool
    {
        $mime = $this->parseMime();
        return $mime["type"] === "application" && $mime["subtype"] === "pdf";
    }

    /**
     * Returns an array with the type and subtype of the note mimetype
     *
     * @return array
     */
    public function parseMime() : array
    {
        list($type, $subtype) = explode("/", $this->getMimeType());
        return [0 => $type, "type" => $type, 1 => $subtype, "subtype" => $subtype];
    }

    /**
     * Check at plugin configuration if a mimetype is allowed
     *
     * @param string $mime
     * @return boolean
     */
    public static function isValidMime(string $mime) : bool
    {
        list($type, $subtype) = explode("/", $mime);
        $formats = rcmail::get_instance()->config->get("ddnotes_config")["extensions"];

        if ( array_key_exists( $type, $formats ) ) {
            return in_array( $subtype, $formats[$type] );
        }

        return false;

    }

    /**
     * Encuentra todas las notas de un usuario.
     * Esta función no recoge el contenido de la nota
     *
     * @param integer $user_id
     * @return ddnotes_model[]
     */
    public static function find(int $user_id) : array
    {
        $db = rcmail_utils::db();
        $result = $db->query(
            sprintf(   "SELECT `id`, `user_id`, `title`, `mimetype`, `file_size`, `ts_created`, `ts_updated`
                        FROM " . $db->table_name(static::$tablename, true)
                        . " WHERE `user_id` = %d"
                        . " AND `parent_id` = 0"
                        . " ORDER BY `ts_updated` DESC",
                $user_id)
            );

        $results = [];
        while ($result && ($res = $db->fetch_assoc($result))) {
            $note = new static();
            $note->id           = (int) $res["id"];
            $note->user_id      = (int) $res["user_id"];
            $note->title        = $res["title"];
            $note->mimetype     = $res["mimetype"];
            $note->content      = "";
            $note->file_size    = (int) $res["file_size"];
            $note->created      = DateTime::createFromFormat("Y-m-d H:i:s", $res["ts_created"]);
            $note->updated      = DateTime::createFromFormat("Y-m-d H:i:s", $res["ts_updated"]);

            $results[] = $note;
        }

        return $results;
    }

    /**
     * Encuentra una nota según su ID y el ID de usuario
     *
     * @param integer $id
     * @param integer $user_id
     * @return null|ddnotes_model
     */
    public static function findOneById(int $id, int $user_id) : ?ddnotes_model
    {
        $db = rcmail_utils::db();
        $result = $db->query(
            sprintf(    "SELECT * FROM " . $db->table_name(static::$tablename, true)
                        ." WHERE `id` = %d "
                        ." AND `user_id` = %d",
                $id, $user_id)
            );

            $note = null;
        if ($result && ($res = $db->fetch_assoc($result))) {
            $note = new static();

            $note->id           = (int) $res["id"];
            $note->user_id      = (int) $res["user_id"];
            $note->title        = $res["title"];
            $note->mimetype     = $res["mimetype"];
            $note->content      = $res["content"];
            $note->file_size    = (int) $res["file_size"];
            $note->created      = DateTime::createFromFormat("Y-m-d H:i:s", $res["ts_created"]);
            $note->updated      = DateTime::createFromFormat("Y-m-d H:i:s", $res["ts_updated"]);

        }

        return $note;
    }

    public function save() : ddnotes_model
    {
        $save_result = false;
        if ( $this->id > 0 ) {
            $save_result = $this->update();
        } else {
            $save_result = $this->insert();
        }

        return $save_result;
    }

    private function update() : ddnotes_model
    {
        $db = rcmail_utils::db();
        $query = sprintf(    "UPDATE " . $db->table_name(static::$tablename, true)
                            . " SET "
                                . " `title` = \"%s\", `content` = \"%s\", `file_size` = %d, `ts_updated` = \"%s\""
                            . " WHERE `id` = %d "
                                . " AND `user_id` = %d",
                    $db->escape($this->title),
                    $db->escape($this->content),
                    $this->file_size,
                    date("Y-m-d H:i:s"),
                    $this->id,
                    $this->user_id
        );

        // We have a file so we don't update his content or filesize
        if ( !$this->isText() ) {
            $query = sprintf(    "UPDATE " . $db->table_name(static::$tablename, true)
                        . " SET "
                            . " `title` = \"%s\", `ts_updated` = \"%s\""
                        . " WHERE `id` = %d "
                            . " AND `user_id` = %d",
                $db->escape($this->title),
                date('Y-m-d H:i:s'),
                $this->id,
                $this->user_id
            );
        }

        $db->query( $query );

        return $this->findOneById($this->id, $this->user_id);
    }

    private function insert() : ddnotes_model
    {
        $db = rcmail_utils::db();
        $db->query(
            sprintf(    "INSERT INTO " . $db->table_name(static::$tablename, true) . " SET "
                        . "`parent_id` = %d, "
                        . "`user_id` = %d, "
                        . "`title` = \"%s\", "
                        . "`mimetype` = \"%s\", "
                        . "`content` = \"%s\", "
                        . "`file_size` = %d",
                        $this->parent_id,
                        $this->user_id,
                        $db->escape($this->title),
                        $this->mimetype,
                        $db->escape($this->content),
                        $this->file_size
        ));

        if ($insert_id = $db->insert_id($this->tablename)) {
            $this->id = (int) $insert_id;
        }

        return $this->findOneById($this->id, $this->user_id);
    }

    public function delete() : bool
    {
        $db = rcmail_utils::db();
        $db->query(
            sprintf(    "DELETE FROM " . $db->table_name(static::$tablename, true) 
                        . " WHERE `id` = %d"
                        . " OR `parent_id` = %d",
                        $this->id,
                        $this->id,
        ));
        return $db->affected_rows() === 1;
    }

    public function getAttachments() : array
    {
        $db     = rcmail_utils::db();
        $result = $db->query(sprintf(
            "SELECT * FROM " . $db->table_name(static::$tablename, true)
            . " WHERE `parent_id` = %d"
            . " AND `user_id` = %d",
            $this->getId(),
            $this->getUserId()
        ));

        $attachments = [];
        while ($result && ($res = $db->fetch_assoc($result))) {
            $note = new static();
            $note->id           = (int) $res["id"];
            $note->user_id      = (int) $res["user_id"];
            $note->title        = $res["title"];
            $note->mimetype     = $res["mimetype"];
            $note->content      = "";
            $note->file_size    = (int) $res["file_size"];
            $note->created      = DateTime::createFromFormat("Y-m-d H:i:s", $res["ts_created"]);
            $note->updated      = DateTime::createFromFormat("Y-m-d H:i:s", $res["ts_updated"]);

            $results[] = $note;
        }

        return $attachments;
    }
    
}