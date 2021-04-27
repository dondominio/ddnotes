# DonDominio Notes, a Roundcube notes plugin

This plugin was made in order to save user's notes directly on the database, rather than on the filesystem.

You will be able to create text-based notes as plain-text, markdown or html with [EasyMDE Editor](https://github.com/Ionaru/easy-markdown-editor)

Besides, you can also upload PDF files and images to save them as notes. Any type of notes created in the plugin is downloadable at any time.

These technologies have been used to develop it:

- [Roundcube](https://github.com/roundcube/roundcubemail)
- [Tiny-markdown-editor](https://github.com/jefago/tiny-markdown-editor)
- [Marked JS](https://github.com/markedjs/marked)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [FontAwesome](https://fontawesome.com/)

## Installation

Download all files from this repository, rename the parent folder to `ddnotes` and move it to the Roundcube `plugins` folder. 
- Place this plugin folder into `plugins` directory of Roundcube
- Add `ddnotes` to `$config['plugins']` in your Roundcube config

When downloading the plugin from GitHub you will need to create a directory called `ddnotes` and place the files in there, ignoring the root directory in the downloaded archive.


The file structure is the next:

```
📦ddnotes
 ┣ 📂includes
 ┃ ┣ 📂DOMPurify
 ┃ ┣ 📂fontawesome
 ┃ ┣ 📂marked
 ┃ ┣ 📂tinymde
 ┃ ┣ 📜ddnotes_model.php
 ┃ ┗ 📜ddnotes_response.php
 ┣ 📂localization
 ┃ ┣ 📜ca_ES.inc
 ┃ ┣ 📜de_DE.inc
 ┃ ┣ 📜en_US.inc
 ┃ ┣ 📜es_ES.inc
 ┃ ┗ 📜fr_FR.inc
 ┣ 📂skins
 ┃ ┣ 📂elastic
 ┃ ┃ ┣ 📂css
 ┃ ┃ ┃ ┗ 📜main.css
 ┃ ┃ ┣ 📂js
 ┃ ┃ ┃ ┗ 📜main.js
 ┃ ┃ ┗ 📂templates
 ┃ ┃ ┃ ┗ 📜index.html
 ┃ ┗ 📂larry
 ┃   ┣ 📂css
 ┃   ┃ ┗ 📜main.css
 ┃   ┣ 📂images
 ┃   ┃ ┣ 📜note.png
 ┃   ┃ ┣ 📜note_both.png
 ┃   ┃ ┗ 📜note_selected.png
 ┃   ┣ 📂js
 ┃   ┃ ┗ 📜main.js
 ┃   ┗ 📂templates
 ┃     ┗ 📜index.html
 ┣ 📂SQL
 ┃ ┣ 📜mssql.initial.sql
 ┃ ┣ 📜mysql.initial.sql
 ┃ ┣ 📜oracle.initial.sql
 ┃ ┣ 📜postgres.initial.sql
 ┃ ┗ 📜sqlite.initial.sql
 ┣ 📜LICENSE
 ┣ 📜README.md
 ┣ 📜composer.json
 ┣ 📜config.inc.php.dist
 ┣ 📜ddnotes.php
 ┗ 📜defaults.inc.php
```
### Configuration file

*This step is not mandatory. This plugin already comes with a `default.inc.php` with the necessary configuration to run correctly.*

At the fist folder level, you will find a file named `config.inc.php.dist`. You must copy it and rename the copy as `config.inc.php` and edit plugin parameters.


```
cd plugins/ddnotes
cp config.inc.php.dist config.inc.php
```

In this file you can adjust the plugin settings to limit the extensions of the files it allows. Also the `upload_max_filesize` and the `note_max_filesize` of the notes.

```php
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
```

The allowed formats are the followings

#### Images
- .jpeg
- .jpg
- .png

#### Files
- .pdf

#### Text
- .txt
- .md (markdown)
- .html

This is the extensions default configuration at `config.inc.php.dist`
```php
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
```

### Editing `config.inc.php`

If you want to change the notes formats allowed, for example do not allow .html files, just delete `"html"` from the `"text"` array.

The indexes `"image"`, `"application"` and `"text"` must always exist even if they are empty.

### MySQL tables

This plugin saves the information in a database, so it is necessary to create a table where to save this information. To do this, we will use the creation files from the `SQL` folder, depending on the database we use. You can open them and run their content directly. In the case of MySQL you could do it from PHPMyAdmin or through terminal:

```bash
mysql -u USER -p PASS < /folder/to/roundcube/plugins/ddnotes/SQL/mysql.initial.sql
```

### Supported languages

- es - Spanish
- ca - Catalan
- en - English
- fr - French
- de - Germany