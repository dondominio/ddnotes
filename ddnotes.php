<?php

declare(strict_types=1);

/**
 * DonDominio Notes
 * 
 * @version 1.0
 * @author Soluciones Corporativas IP S.L.
 * @copyright Copyright (c) 2021, SCIP
 * @license Apache-2
 */
class ddnotes extends rcube_plugin
{
    public $task = ".*";
    private $config = [];
    private $user_id;
    public static $default_date_format = "d/m/Y H:i";

    /**
     * The corresponding usable skin path for this plugin.
     *
     * @var string like "skins/larry"
     */
    private $skinPath = '';

    /**
     * The corresponding usable skin name for this plugin.
     *
     * @var string like "larry"
     */
    private $skinName = '';

    /**
     * Plugin initialization
     */
    public function init(): void
    {
        $rcmail         = \rcmail::get_instance();
        $this->user_id  = (int) $rcmail->user->ID;

        $this->skinPath = $this->local_skin_path();
        // Include CSS for taskbar icon
        $this->include_stylesheet($this->local_skin_path() . "/css/main.css");
        // remove prefixed "skins/"
        $this->skinName = substr($this->skinPath, 6);

        // Main task /?task=ddnotes
        $this->register_task("ddnotes");

        // include localization
        $this->add_texts('/localization/', true);

        $this->add_button(array(
            "command"       => "ddnotes",
            "type"          => "link",
            "id"            => "ddnotes",
            "label"         => "ddnotes.taskbar_button",
            "class"         => "button-notes",
            "classsel"      => "button-notes button-selected",
            "innerclass"    => "button-inner",
        ), "taskbar");


        if ($rcmail->task === "ddnotes") {
            // Init plugin configuration and includes
            $this->init_config();
            $this->init_includes();

            // Loads the main page of the plugin
            $this->register_action("index", array($this, "render"));

            /**
             * Ajax actions
             */
            // Action to load an attachment /?task=ddnotes&_action=view&_uid=ATTACHMENTID
            $this->register_action("view", array($this, "view"));
            // Action to upload a file note (.pdf, .txt or images files)
            $this->register_action("upload_file", array($this, "upload"));
            // Image insertion via editor
            $this->register_action("embed", array($this, "embed"));
            // Retrieve notes list
            $this->register_action("refresh_list", array($this, "refresh_list"));

            /**
             * Register <roundcube:objects /> from html
             */
            $rcmail->output->add_handlers([
                "ddnotes_creation_submenu" => [$this, "creation_submenu"],
            ]);

            /**
             * Notes ajax actions (CRUD)
             */
            $this->register_action("new", array($this, "new"));
            $this->register_action("list", array($this, "list"));
            $this->register_action("show", array($this, "show"));
            $this->register_action("update", array($this, "update"));
            $this->register_action("delete", array($this, "delete"));

            /**
             * CSS includes
             */
            $this->include_stylesheet("includes/fontawesome/css/all.min.css");
            $this->include_stylesheet("includes/tinymde/tiny-mde.min.css");

            /**
             * JS includes
             */
            $this->include_script("includes/tinymde/tiny-mde.min.js");
            $this->include_script("includes/marked/marked.min.js");
            $this->include_script("includes/DOMPurify/purify.js");
            $this->include_script($this->local_skin_path() . "/js/main.js");
        }

        /**
         * Send note as attachment via mail/compose hook
         */
        if ($rcmail->task === "mail" && $rcmail->action === "compose") {
            // Init plugin configuration and includes
            $this->init_config();
            $this->init_includes();

            $this->add_hook("message_compose", array($this, "message_compose"));
        }
    }

    /**
     * Include /includes/ folder to includes path
     *
     * @return void
     */
    public function init_includes(): void
    {
        // Add include path for classes
        $include_path = $this->home . '/includes' . PATH_SEPARATOR;
        $include_path .= ini_get('include_path');
        set_include_path($include_path);
    }

    public function init_config(): void
    {
        $rcmail = \rcmail::get_instance();

        // load the plugin configuration
        if (!$this->load_config("defaults.inc.php")) {
            \rcube::raise_error(
                [
                    "code"      => 500,
                    "type"      => "config",
                    "file"      => "DDNotes plugin. File defaults.inc.php not loaded correctly",
                    "line"      => __LINE__ - 5,
                    "message"   => $rcmail->gettext("no_config", "ddnotes")
                ],
                true,
                true
            );
        }
        // Loads local config in case it exists
        $this->load_config("config.inc.php");
        $this->config = \rcmail::get_instance()->config->get("ddnotes_config");

        // Server upload_max_filesize VS DDNotes upload_max_filesize
        $ddnotes_size = $this->config["upload_max_filesize"] ?? 0;
        $app_size = \rcube_utils::max_upload_size();

        $app_size = \rcube_utils::max_upload_size();
        if ($ddnotes_size && $ddnotes_size < $app_size) {
            $app_size = $ddnotes_size;
        }

        $this->config["upload_max_filesize"] = $app_size;

        \rcmail::get_instance()->output->set_env("ddnotes_config", $this->config);
    }

    /**
     * Check if the size is greater than the supported size from the app
     *
     * @param Int $file_size
     * @return boolean 
     */
    public function check_max_upload($file_size): bool
    {
        return $this->config["upload_max_filesize"] >= $file_size;
    }

    /**
     * Check for note max_size
     *
     * @param Int $note_content
     * @return boolean
     */
    public function check_max_note_size($content_size): bool
    {
        $note_size  = $this->config["note_max_filesize"];
        if (is_null($note_size)) {
            return $this->check_max_upload($content_size);
        }

        return $note_size >= $content_size;
    }

    /**
     * Generate creation submenu html and commands
     *
     * @return string
     */
    public function creation_submenu($attrib): string
    {
        $rcmail         = \rcmail::get_instance();
        $text_formats   = $this->config["extensions"]["text"];
        $items          = [];
        $list_class     = "menu listing";
        $items_class    = "create active";

        if ($this->skinName === "larry") {
            $list_class     = "toolbarmenu";
            $items_class    = "active";
        }

        // $rcmail->output->button() already creates <li> wrapper for the button (link-menuitem)
        foreach ($text_formats as $format) {
            $items[] = $rcmail->output->button([
                "command"  => "new_note",
                "label"    => "ddnotes.$format",
                "class"    => $items_class,
                "type"     => "link-menuitem",
                "prop"     => "text/" . $format,
            ]);
        }

        return \html::div(
            ["id" => $attrib["name"], "class" => "popupmenu", "aria-hidden" => "true", "popup-pos" => "down"],
            \html::tag("ul", ["role" => "menu", "class" => $list_class], implode("", $items))
        );
    }

    /**
     * Load template index
     * 
     * @return void
     */
    public function render(): void
    {
        $rcmail = \rcmail::get_instance();
        $rcmail->output->set_pagetitle($this->gettext("browser_title"));

        $rcmail->output->send("ddnotes.index");
    }

    /**
     * Loads and attachment
     *
     * @return void
     */
    public function view(): void
    {
        $rcmail     = \rcmail::get_instance();
        $id         = (int) \rcube_utils::get_input_value("_uid", \rcube_utils::INPUT_GP);
        $note       = \ddnotes_model::findOneById($id, (int) $this->user_id);

        // If note not found, send a 404 headers
        if (is_null($note)) {
            header("HTTP/1.0 404 Not Found");
            exit(0);
        }

        header("Content-Description: Show Attachment");
        header("Content-Disposition: inline; filename=\"" . $note->getTitle() . "." . $note->getExtension() . "\"");
        header("Content-Type: " . $note->getMimeType() . "; charset=" . $rcmail->output->get_charset());
        header("Content-Length: " . $note->getFileSize());
        header("Last-Modified: " . $note->getUpdated()->setTimezone(new DateTimeZone('UTC'))->format("D, d M Y H:i:s \G\M\T"));

        if ($note->isText()) {
            echo $note->getContent();
        } else {
            echo base64_decode($note->getContent());
        }

        exit(0);
    }

    /**
     * Generate a new Note
     *
     * @return void
     */
    public function new(): void
    {
        $rcmail     = \rcmail::get_instance();
        $type       = \rcube_utils::get_input_value("type", \rcube_utils::INPUT_POST);
        $note       = new \ddnotes_model();
        $response   = new \ddnotes_response();

        if (is_null($type) || empty($type)) {
            $type = "text/" . $this->config["extensions"]["text"][0];
        }

        $note->setTitle($rcmail->gettext("new_note", "ddnotes"));
        $note->setMimeType($type);

        $note = $note->save();

        $response->setFromNote($note);
        $rcmail->output->command("plugin.new", $response);
    }

    /**
     * List all notes from a user
     * If you pass a Note ID, it will be send back
     * to the frontend in order to select that
     * note directly on the list
     *
     * @return void
     */
    public function list(): void
    {
        $rcmail     = \rcmail::get_instance();
        $id         = (int) \rcube_utils::get_input_value("id", \rcube_utils::INPUT_POST);
        $response   = new \ddnotes_response();
        $notes      = \ddnotes_model::find((int) $this->user_id);

        if (empty($notes)) {
            $response->setResult(false);
            $rcmail->output->command("plugin.list", $response);
            return;
        }

        if ($id === 0) {
            $response->setId($notes[0]->getId());
        } else {
            $response->setId($id);
        }

        foreach ($notes as $note) {
            $response->addFromNote($note);
        }

        $rcmail->output->command("plugin.list", $response);
    }

    /**
     * Retrieve a note from the database
     *
     * @return void
     */
    public function show(): void
    {
        $rcmail     = \rcmail::get_instance();
        $id         = (int) \rcube_utils::get_input_value("id", \rcube_utils::INPUT_POST);
        $response   = new \ddnotes_response();
        $note       = \ddnotes_model::findOneById($id, (int) $this->user_id);

        if (is_null($note)) {
            $rcmail->output->show_message("ddnotes.no_note", "error");
            return;
        }

        $response->setFromNote($note);

        $rcmail->output->command("plugin.show", $response);
    }

    /**
     * Update note information
     *
     * @return void
     */
    public function update(): void
    {
        $rcmail     = \rcmail::get_instance();
        $id         = (int) \rcube_utils::get_input_value("id", \rcube_utils::INPUT_POST);
        $title      = \rcube_utils::get_input_value("name", \rcube_utils::INPUT_POST);
        $content    = \rcube_utils::get_input_value("content", \rcube_utils::INPUT_POST, true);

        $response   = new \ddnotes_response();
        $note       = \ddnotes_model::findOneById($id, (int) $this->user_id);

        // Check for note
        if (is_null($note)) {
            $response->setResult(false);
            $response->setId($id);
            $rcmail->output->show_message("ddnotes.no_note", "error");
            $rcmail->output->command("plugin.update", $response);
            return;
        }

        // Check note size
        if (!$this->check_max_note_size(strlen($content))) {
            $response->setResult(false);
            $response->setId($id);
            $rcmail->output->show_message("ddnotes.note_size_error", "error");
            $rcmail->output->command("plugin.update", $response);
            return;
        }

        $note->setTitle($title);
        $note->setContent($content);

        /**
         *  if it's not a file, size is not defined correctly
         */
        if ($note->isText()) {
            $note->setFileSize(strlen($content));
        }


        $note = $note->save();

        $response->setFromNote($note);

        $rcmail->output->show_message("ddnotes.update_confirmation", "confirmation");

        $rcmail->output->command("plugin.update", $response);
    }

    /**
     * Delete a note
     *
     * @return void
     */
    public function delete(): void
    {
        $rcmail     = \rcmail::get_instance();
        $id         = (int) \rcube_utils::get_input_value("id", \rcube_utils::INPUT_POST);
        $response   = new \ddnotes_response();
        $note       = \ddnotes_model::findOneById($id, (int) $this->user_id);

        if (is_null($note)) {
            $rcmail->output->show_message("ddnotes.no_note", "error");
            $rcmail->output->command("plugin.delete", $response);
            return;
        }

        $note->delete();

        $rcmail->output->show_message("ddnotes.delete_confirmation", "confirmation");

        $rcmail->output->command("plugin.delete", $response);
    }

    public function upload(): void
    {
        $rcmail         = \rcmail::get_instance();
        $title          = \rcube_utils::get_input_value("title", \rcube_utils::INPUT_POST);
        $mimetype       = \rcube_utils::get_input_value("mime", \rcube_utils::INPUT_POST);
        $content        = \rcube_utils::get_input_value("content", \rcube_utils::INPUT_POST);
        $size           = (int) \rcube_utils::get_input_value("size", \rcube_utils::INPUT_POST);

        $response       = new \ddnotes_response();
        $note           = new \ddnotes_model();

        // Check mimetype
        if (!\ddnotes_model::isValidMime($mimetype)) {
            $response->setResult(false);
            $rcmail->output->show_message("ddnotes.invalid_type", "error");
            $rcmail->output->command("plugin.uploaded", $response);
            return;
        }

        // Check for file size
        if (!$this->check_max_upload($size)) {
            $response->setResult(false);
            $rcmail->output->show_message("ddnotes.file_size_error", "error");
            $rcmail->output->command("plugin.uploaded", $response);
            return;
        }

        // Check for content size
        if (!$this->check_max_note_size(strlen($content))) {
            $response->setResult(false);
            $rcmail->output->show_message("ddnotes.note_size_error", "error");
            $rcmail->output->command("plugin.uploaded", $response);
            return;
        }

        $note->setTitle($title);
        $note->setMimeType($mimetype);
        $note->setFileSize($size);
        $note->setContent($content);

        $note = $note->save();

        $response->setFromNote($note);

        $rcmail->output->show_message("ddnotes.create_confirmation", "confirmation");

        $rcmail->output->command("plugin.uploaded", $response);
    }

    public function embed(): void
    {
        $rcmail     = \rcmail::get_instance();
        header("Content-Type: application/json; charset=" . $rcmail->output->get_charset());

        $id         = (int) \rcube_utils::get_input_value("id", \rcube_utils::INPUT_POST);
        $title      = \rcube_utils::get_input_value("title", \rcube_utils::INPUT_POST);
        $mimetype   = \rcube_utils::get_input_value("mime", \rcube_utils::INPUT_POST);
        $content    = \rcube_utils::get_input_value("content", \rcube_utils::INPUT_POST);
        $size       = (int) \rcube_utils::get_input_value("size", \rcube_utils::INPUT_POST);

        $response   = new \ddnotes_response();

        // Check mimetype
        if (!\ddnotes_model::isValidMime($mimetype)) {
            $response->setResult(false);
            $response->setError("invalid_type");
            echo json_encode($response);
            exit;
        }

        // Check for file size
        if (!$this->check_max_upload($size)) {
            $response->setResult(false);
            $response->setError("file_size_error");
            echo json_encode($response);
            exit;
        }

        // Check for content size
        if (!$this->check_max_note_size($content)) {
            $response->setResult(false);
            $response->setError("note_size_error");
            echo json_encode($response);
            exit;
        }

        $embed = new \ddnotes_model();
        $embed->setParentId($id);
        $embed->setTitle($title);
        $embed->setMimeType($mimetype);
        $embed->setFileSize($size);
        $embed->setContent($content);

        $embed = $embed->save();

        $response->setFromNote($embed);

        echo json_encode(array_merge($response->toArray(), ["link" => $rcmail->url(["_action" => "view", "_uid" => $embed->getId()])]));
        exit;
    }

    public function refresh_list(): void
    {
        $rcmail     = \rcmail::get_instance();
        $response   = new \ddnotes_response();
        $notes      = \ddnotes_model::find((int) $this->user_id);

        foreach ($notes as $note) {
            $response->addFromNote($note);
        }

        header("Content-Type: application/json; charset=" . $rcmail->output->get_charset());
        echo json_encode($response->toArray());
        exit;
    }

    public function message_compose($args): array
    {
        $id = (int) $args["param"]["ddnotes_id"];
        $subject = $this->gettext("compose_subject");
        $note = \ddnotes_model::findOneById($id, (int) $this->user_id);

        if ($id <= 0) {
            return $args;
        }

        if ($note instanceof \ddnotes_model) {
            if ($note->isText()) {
                $content = $note->getContent();
            } else {
                $content = base64_decode($note->getContent());
            }

            $args["attachments"][] = [
                "name" => $note->getTitle() . "." . $note->getExtension(),
                "mimetype" => $note->getMimeType(),
                "data" => $content,
                "size" => $note->getFileSize()
            ];

            $args["param"]["subject"] = $subject;
        }

        return $args;
    }
}
