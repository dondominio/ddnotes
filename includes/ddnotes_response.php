<?php declare(strict_types=1);

/**
 * DonDominio Notes
 * This is a wrapper class for all AJAX responses
 * generated at the backend, to the frontend
 * 
 * @version 1.0
 * @author Soluciones Corporativas IP S.L.
 * @copyright Copyright (c) 2021, SCIP
 * @license Apache-2
 */
class ddnotes_response implements JsonSerializable
{
    private $result = true;
    private $data = [];
    private $error = "";
    private $id = 0;
    private $date_format;

    public function __construct()
    {
        $this->date_format = !isset( (rcmail::get_instance())->user->get_prefs()["date_long"] ) 
            ? ddnotes::$default_date_format : (rcmail::get_instance())->user->get_prefs()["date_long"];
    }

    /**
     * Set response result
     *
     * @param boolean $result
     * @return void
     */
    public function setResult(bool $result) : void
    {
        $this->result = $result;
    }

    /**
     * Set all the data response
     *
     * @param array $data
     * @return void
     */
    public function setData(array $data) : void
    {
        $this->data = $data;
    }

    /**
     * Set the error message
     *
     * @param string $error
     * @return void
     */
    public function setError(string $error) : void
    {
        $this->error = $error;
    }

    /**
     * Add a new element to the data
     *
     * @param array $data
     * @return void
     */
    public function addData(array $data) : void
    {
        $this->data[] = $data;
    }

    /**
     * Set the Note ID to select once load 
     *
     * @param integer $id
     * @return void
     */
    public function setId(int $id) : void
    {
        $this->id = $id;
    }

    /**
     * Set all the data of the response from a Note
     *
     * @param ddnotes_model $note
     * @return void
     */
    public function setFromNote(ddnotes_model $note) : void
    {
        $this->id = $note->getId();
        $this->setData([
            "id"            => $note->getId(),
            "title"         => $note->getTitle(),
            "mimetype"      => [
                                "type"      => $note->parseMime()["type"], 
                                "subtype"   => $note->parseMime()["subtype"],
                                "full"      => $note->parseMime()["type"] . "/" . $note->parseMime()["subtype"],
                            ],
            "mime_string"   => $note->getMimeString(),
            "content"       => [
                                "raw"       => $note->getContent(),
                                "encoded"   => $note->getSrcContent(),
                            ],
            "file_size"     => [
                                "bytes"     => $note->getFileSize(),
                                "readable"  => $note->getHumanFileSize(),
                            ],
            "ts_created"    => $note->getCreated()->format($this->date_format),
            "ts_updated"    => $note->getUpdated()->format($this->date_format),
            "icon"          => $note->getIcon(),
            "isImage"       => $note->isImage(),
            "isText"        => $note->isText(),
            "isFile"        => $note->isFile(),
            "extension"     => $note->getExtension(),
        ]);
    }

    /**
     * At a Note to the response data
     *
     * @param ddnotes_model $note
     * @return void
     */
    public function addFromNote(ddnotes_model $note) : void
    {
        $this->addData([
            "id"            => $note->getId(),
            "title"         => $note->getTitle(),
            "mimetype"      => [
                                "type"      => $note->parseMime()["type"], 
                                "subtype"   => $note->parseMime()["subtype"],
                                "full"      => $note->parseMime()["type"] . "/" . $note->parseMime()["subtype"],
                            ],
            "mime_string"   => $note->getMimeString(),
            "content"       => [
                                "raw"       => $note->getContent(),
                                "encoded"   => $note->getSrcContent(),
                            ],
            "file_size"     => [
                                "bytes"     => $note->getFileSize(),
                                "readable"  => $note->getHumanFileSize(),
                            ],
            "ts_created"    => $note->getCreated()->format($this->date_format),
            "ts_updated"    => $note->getUpdated()->format($this->date_format),
            "icon"          => $note->getIcon(),
            "isImage"       => $note->isImage(),
            "isText"        => $note->isText(),
            "isFile"        => $note->isFile(),
            "extension"     => $note->getExtension(),
        ]);
    }

    /**
     * Information of response as array
     *
     * @return array
     */
    public function toArray() : array
    {
        return [
            "result"    => $this->result,
            "data"      => $this->data,
            "error"     => $this->error,
            "id"        => $this->id,
        ];
    }

    /**
     * JsonSerialize implementation
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return $this->toArray();
    }
}