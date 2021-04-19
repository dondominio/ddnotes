# DonDominio Notes, a Roundcube notes plugin

This plugin was made in order to save user's notes directly on the database, rather than on the filesystem.

You will be able to create text-based notes as plain-text, markdown or html with [EasyMDE Editor](https://github.com/Ionaru/easy-markdown-editor)

Besides, you can also upload PDF files and images to save them as notes. Any type of notes created in the plugin is downloadable at any time.

These technologies have been used to develop it:

- [Roundcube](https://github.com/roundcube/roundcubemail)
- [EasyMDE](https://github.com/Ionaru/easy-markdown-editor)
- [CodeMirror](https://github.com/codemirror/CodeMirror)
- [Highlight JS](https://github.com/highlightjs/highlight.js/)
- [Marked JS](https://github.com/markedjs/marked)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [FontAwesome](https://fontawesome.com/)

## Installation

Download all files from this repository, rename the parent folder to `ddnotes` and move it to the Roundcube `plugins` folder. 
- Place this plugin folder into `plugins` directory of Roundcube
- Add `ddnotes` to `$config['plugins']` in your Roundcube config

When downloading the plugin from GitHub you will need to create a directory called `ddnotes` and place the files in there, ignoring the root directory in the downloaded archive.


The file structure is the next:

```bash
ddnotes                                                 
├─ SQL                                                  
│  ├─ mssql.initial.sql                                 
│  ├─ mysql.initial.sql                                 
│  ├─ oracle.initial.sql                                
│  ├─ postgres.initial.sql                              
│  └─ sqlite.initial.sql                                
├─ bin                                                  
├─ includes                                             
│  ├─ easymde                                           
│  │  ├─ css                                            
│  │  │  ├─ highlight                      
│  │  │  └─ easymde.css                                 
│  │  └─ js                                             
│  │     ├─ DOMPurify                                   
│  │     ├─ codemirror                                  
│  │     ├─ highlight                                   
│  │     ├─ marked                                      
│  │     └─ easymde.min.js                              
│  ├─ fontawesome                                       
│  ├─ ddnotes_model.php                                 
│  └─ ddnotes_response.php                              
├─ localization                                         
│  ├─ ca_ES.inc                                         
│  ├─ en_US.inc                                         
│  └─ es_ES.inc                                         
├─ skins                                                
│  ├─ elastic                                           
│  │  ├─ css                                            
│  │  │  └─ main.css                                    
│  │  ├─ js                                             
│  │  │  └─ main.js                                     
│  │  └─ templates                                      
│  │     └─ index.html                                  
│  └─ larry                                             
│     ├─ css                                            
│     │  └─ main.css                                    
│     ├─ js                                             
│     │  └─ main.js                                     
│     └─ templates                                      
│        └─ index.html                                  
├─ README.md                                            
├─ composer.json                                        
├─ config.inc.php.dist                                  
└─ ddnotes.php                                          
```

### Configuration file

At the fist folder level, you will find a file named `config.inc.php.dist`. You must copy it and rename the copy as `config.inc.php`.


```
cd plugins/ddnotes
cp config.inc.php.dist config.inc.php
```

In this file you can adjust the plugin settings to limit the extensions of the files it allows. Also the `upload_max_filesize` and the `max size` of the notes.

```php
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
- .md
- .html

This is the extensions default configuration at `config.inc.php.dist`
```php
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