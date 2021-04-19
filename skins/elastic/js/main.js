"use strict";

/**
 * Notes plugin
 * 
 * @version 1.0
 * @author Soluciones Corporativas IP S.L.
 * @copyright Copyright (c) 2021, SCIP
 * @license GNU General Public License, version 3
 */
$( function() {
    ///////////////////////////////////////////////////
    /******************
    * Variables
    *****************/

    // Watermark
    const watermark                     = $("#ddnotes_watermark");

    // Lista <ul> con las notas
    const list                          = $("#ddnotes_notes_list");

    // Form
    const input_form                    = $("#ddnotes_form");
    
    // Campos de título y textarea para la creación de la nota
    const note_title_wrapper            = $("#ddnotes_note_title_wrapper");
    const buttons_wrapper               = $("#ddnotes_buttons_wrapper");
    const editor_wrapper                = $("#ddnotes_editor_wrapper");
    const show_note_wrapper             = $("#ddnotes_show_note_wrapper");
    const upload_image_wrapper          = $("#ddnotes_upload_image_wrapper");
    const upload_file_wrapper           = $("#ddnotes_upload_file_wrapper");
    const show_image_wrapper            = $("#ddnotes_show_image_wrapper");
    const show_file_wrapper             = $("#ddnotes_show_file_wrapper");
    
    // Form inputs
    const form_id                       = $("#ddnotes_form_id");
    const form_type                     = $("#ddnotes_form_type");
    const form_content                  = $("#ddnotes_form_content");
    const form_upload                   = $("#ddnotes_form_upload");
    const form_size                     = $("#ddnotes_form_size");

    // Title and easymde textarea
    const input_note_title              = $("#ddnotes_input_note_title");
    const input_note_content            = $("#ddnotes_input_note_content");
    const input_image_upload            = $("#ddnotes_image_upload");

    // Elementos de la vista de nota
    const note_title                    = $("#ddnotes_note_title");
    const note_content                  = $("#ddnotes_note_content");
    const file_size                     = $("p.ddnotes_file_size");

    // Botones
    const save_button                   = $("#ddnotes_save_button");
    const update_button                 = $("#ddnotes_update_button");
    const cancel_button                 = $("#ddnotes_cancel_button");
    const upload_button                 = $("#ddnotes_upload_button");
    const download_button               = $("#ddnotes_download_button");

    // Menus
    const toolbar_menu                  = $("#ddnotes_toolbar_menu");

    var mde = null;

    const MDEOptions = {
        element: input_note_content[0],
        autoDownloadFontAwesome: false,
        forceSync: true,
        sideBySideFullscreen: false,
        styleSelectedText: false,
        previewImagesInEditor: false,
        uploadImage: false,
        renderingConfig: {
            codeSyntaxHighlighting: true,
            hljs: hljs,
            markedOptions: {
                renderer: new marked.Renderer(),
                highlight: function (code, lang) {
                    if (hljs.getLanguage(lang)) {
                        return hljs.highlight(code, {language: lang, ignoreIllegals: true}).value
                    } else {
                        return hljs.highlight(code, {language: "plaintext", ignoreIllegals: true}).value
                    }
                },
            },
            sanitizerFunction: function(html) {
                return DOMPurify.sanitize(html, {USE_PROFILES: {html: true}});
            },
        },
        toolbar: [
            {
                action: EasyMDE.undo,
                title: rcmail.gettext("undo", "ddnotes"),
                className: "fa fa-undo",
            }, {
                action: EasyMDE.redo,
                title: rcmail.gettext("redo", "ddnotes"),
                className: "fa fa-redo",
            }, "|",
            {
                action: EasyMDE.toggleBold,
                title: rcmail.gettext("bold", "ddnotes"),
                className: "fa fa-bold",
            }, {
                action: EasyMDE.toggleItalic,
                title: rcmail.gettext("italic", "ddnotes"),
                className: "fa fa-italic",
            }, {
                action: EasyMDE.toggleStrikethrough,
                title: rcmail.gettext("strikethrough", "ddnotes"),
                className: "fa fa-strikethrough",
            }, "|", {
                action: EasyMDE.toggleHeading1,
                title: rcmail.gettext("heading", "ddnotes") + " 1",
                icon: "H1",
            }, {
                action: EasyMDE.toggleHeading2,
                title: rcmail.gettext("heading", "ddnotes") + " 2",
                icon: "H2",
            }, {
                action: EasyMDE.toggleHeading3,
                title: rcmail.gettext("heading", "ddnotes") + " 3",
                icon: "H3",
            }, "|", {
                action: EasyMDE.toggleCodeBlock,
                title: rcmail.gettext("code", "ddnotes"),
                className: "fa fa-code",
            }, {
                action: EasyMDE.toggleBlockquote,
                title: rcmail.gettext("quote", "ddnotes"),
                className: "fa fa-quote-left",
            }, {
                action: EasyMDE.toggleUnorderedList,
                title: rcmail.gettext("generic_list", "ddnotes"),
                className: "fa fa-list",
            }, {
                action: EasyMDE.toggleOrderedList,
                title: rcmail.gettext("numbered_list", "ddnotes"),
                className: "fa fa-list-ol",
            }, "|", {
                action: EasyMDE.drawLink,
                title: rcmail.gettext("link", "ddnotes"),
                className: "fa fa-link",
            }, {
                action: EasyMDE.drawImage,
                title: rcmail.gettext("image", "ddnotes"),
                className: "fa fa-image",
            }, {
                name: "upload-image",
                action: () => { $(editor_upload).click() },
                title: rcmail.gettext("upload_image", "ddnotes"),
                className: "far fa-file-image",
            }, "|", {
                action: EasyMDE.drawTable,
                title: rcmail.gettext("table", "ddnotes"),
                className: "fa fa-table",
            }, {
                action: EasyMDE.drawHorizontalRule,
                title: rcmail.gettext("horizontal_rule", "ddnotes"),
                className: "fa fa-minus"
            }, "|", {
                action: EasyMDE.togglePreview,
                title: rcmail.gettext("preview", "ddnotes"),
                className: "fa fa-eye",
            }, {
                action: EasyMDE.toggleSideBySide,
                title: rcmail.gettext("sidebyside", "ddnotes"),
                className: "fa fa-columns"
            }, {
                action: EasyMDE.toggleFullScreen,
                title: rcmail.gettext("fullscreen", "ddnotes"),
                className: "fa fa-expand",
            }, "|", {
                action: 'https://www.markdownguide.org/basic-syntax/',
                title: rcmail.gettext("markdown_guide", "ddnotes"),
                className: "fa fa-question-circle",
            }
        ],
    };

    if (window.rcmail) {

        ///////////////////////////////////////////////////
        /******************
         * Registro de comandos JS
         *****************/

        rcmail.addEventListener("init", function() {
            rcmail.register_command("new_note", new_note, true);
            rcmail.register_command("update_note", update_note, true);
            rcmail.register_command("edit_note", edit_note, true);
            rcmail.register_command("delete_note", delete_note, true);
            rcmail.register_command("show_note", show_note, true);
            rcmail.register_command("cancel_edit", cancel_edit, true);
            rcmail.register_command("upload_file", upload_file, true);

            // Menu events
            rcmail.enable_command("open_submenu", open_creation_submenu);

            marked.setOptions({
                highlight: function (code, lang) {
                    if (hljs.getLanguage(lang)) {
                        return hljs.highlight(code, {language: lang, ignoreIllegals: true}).value
                    } else {
                        return hljs.highlight(code, {language: "plaintext", ignoreIllegals: true}).value
                    }
                },
            });

            DOMPurify.setConfig( { USE_PROFILES: { html:true } } );

            load_notes(0);
        });

        ///////////////////////////////////////////////////
        /******************
         * Registro de callbacks del backend
         *****************/
        rcmail.addEventListener("plugin.new", function ( response ) {
            if (response.result === true) {
                $(form_id).val(response.id);
                $(input_note_title).val(response.data.title);

                refresh_list( function() {
                    list.children().first().addClass("selected");
                });

            }
        });

        rcmail.addEventListener("plugin.list", function ( response ) {
            if ( response.result === true ) {
                load_list(response).then(() => {
                    hide_all();
                    reset_form();
                    list.find("li[data-id=" + response.id + "]").addClass("selected").find("a").click();
                });
            }
        });

        rcmail.addEventListener("plugin.show", function ( response ) {

            if ( response.result === true ) {
                
                hide_all();
                reset_form();
                $(note_content).empty();
                
                $(input_note_title).val(response.data.title);                
                $(note_title).text(response.data.title);
                $(form_id).val(response.data.id);
                
                // Markdown parser
                if (response.data.isText && ( response.data.extension === "md") || response.data.extension === "html" ) {   
                    
                    $(note_content).html( DOMPurify.sanitize(marked(response.data.content.raw)) );
                    hljs.highlightAll();
                }
                
                // Plaintext and html need to escape tags
                if (response.data.isText && response.data.extension === "txt") {
                    $(note_content).text(response.data.content.raw);
                }

                // If a image file, loads an <img> tag with his src
                if (response.data.isImage) {
                    let img = $("<img>", {src: response.data.content.encoded });
                    $(note_content).append(img);
                }

                // If it's a file, shows file wrapper content with file icon
                if (response.data.isFile) {
                    $(file_size).text(response.data.file_size.readable);
                    $(show_file_wrapper).show();
                }

                // Save note object to the edit button at toolbar
                $("a#ddnotes_edit_note").attr("data-note", JSON.stringify(response.data));

                // $(note_icon).removeClass().addClass(response.data.icon + " fa-3x");
                // $(note_created).text(response.data.ts_created);
                // $(note_updated).text(response.data.ts_updated);
                // $(note_type).text(response.data.mimetype.type);
                // $(note_format).text(response.data.mimetype.subtype);
                // $(note_size).text(response.data.file_size.readable);
                $(download_button).attr({
                    href:       response.data.content.encoded,
                    download:   response.data.title + "." + response.data.extension,
                });
                
                download_button.show();
                toolbar_menu.show();
                show_note_wrapper.show();
                watermark.hide();

                if (is_mobile()) {
                    $("#layout-sidebar").removeClass("selected").addClass("hidden");
                    $("#layout-content").removeClass("hidden").addClass("selected");
                    $(toolbar_menu).addClass("hidden");
                }
            }
        });

        rcmail.addEventListener("plugin.update", function ( response ) {
            load_notes(response.id);
        });

        rcmail.addEventListener("plugin.delete", function( response ) {
            hide_all();
            reset_form();
            load_notes(0);
        });

        rcmail.addEventListener("plugin.uploaded", function ( response ) {
            
            if(response.result === true) {
                load_notes(response.data.id); 
            }
        });

        /**
         * Creation submenu popup event
         */
        rcmail.addEventListener("beforeopen_submenu", function ( event ) {
            rcmail.command("menu-open", "ddnotes_creation_submenu", event.target, event);
        });

        ///////////////////////////////////////////////////
        /******************
         * Funciones de los comandos JS
         *****************/
        function show_note(element)
        {
            let id = $(element).data("id");
            rcmail.http_post("show", {
                id: id
            });
        }
        
        function new_note(type)
        {
            if (type == "file") {
                form_upload.click();
                return;
            }

            rcmail.http_post("new", {
                type: type
            });

            hide_all();
            reset_form();
            reset_editor();

            $(form_type).val(type);
            $(input_note_title).val("");
            $(input_note_content).val("");
            $(form_content).val("");

            if (type === "text/plain") {
                input_note_content.show();
                mde.toTextArea();
                mde = null;
            }

            note_title_wrapper.show();
            editor_wrapper.show();
            buttons_wrapper.show();
            save_button.show();
            watermark.hide();

            if (is_mobile()) {
                $("#layout-sidebar").removeClass("selected").addClass("hidden");
                $("#layout-content").removeClass("hidden").addClass("selected");
                $(toolbar_menu).addClass("hidden");
            }
        }

        function update_note()
        {
            let id          = $(form_id).val();             // Note ID
            var title       = $(input_note_title).val();    // Note title
            var mime        = $(form_type).val();           // Mimetype
            var content     = $(input_note_content).val();  // EasyMDE editor content

            if ( $(input_note_title).val().trim().length === 0 ) {
                rcmail.display_message( rcmail.gettext("empty_title", "ddnotes"), "error" );
                $(input_note_title).focus();
                return;
            }

            rcmail.http_post("update", {
                id: id,
                name: title,
                mime: mime,
                content: content
            });
        }

        function edit_note()
        {
            reset_editor();
            hide_all();

            var note = JSON.parse($("a#ddnotes_edit_note").attr("data-note"));

            note_title_wrapper.show();
            buttons_wrapper.show();
            update_button.show();
            cancel_button.show();
            
            $(form_id).val(note.id);
            $(form_type).val(note.mimetype.full);
            
            if (note.isText) {
                $(form_content).val( note.content.raw );
                mde.value( DOMPurify.sanitize( note.content.raw ));

                if (note.extension == "txt") {
                    input_note_content.show();
                    mde.toTextArea();
                    mde = null;
                }

                editor_wrapper.show();
                return;
            }

            if (note.isImage) {
                $(show_image_wrapper).find("img").attr("src", note.content.encoded);
                $(show_image_wrapper).show();
                return;
            }

            if (note.isFile) {
                $(show_file_wrapper).show();
                return;
            }

            if (is_mobile()) {
                $("#layout-sidebar").removeClass("selected").addClass("hidden");
                $("#layout-content").removeClass("hidden").addClass("selected");
                $(toolbar_menu).addClass("hidden");
            }
        }

        function delete_note()
        {
            if (confirm( rcmail.gettext("delete_popup", "ddnotes").replace("%title%", input_note_title.val()) )) {
                rcmail.http_post("delete", {
                    id: form_id.val()
                });
            }
        }

        function upload_file()
        {
            var title       = $(input_note_title).val();    // Note title
            var file        = $(form_upload)[0].files[0];   // EasyMDE editor content

            if ( $(input_note_title).val().trim().length === 0 ) {
                rcmail.display_message( rcmail.gettext("empty_title", "ddnotes"), "error" );
                $(input_note_title).focus();
                return;
            }

            // If text file, we need it decoded
            if ( file.type === "text/plain" ) {
                var reader = new FileReader();
                reader.onload = function (f) {
                    var content = f.target.result;

                    rcmail.http_post("upload_file", {
                        title: title,
                        mime: file.type,
                        content: content,
                        size: file.size,
                    });
                }

                reader.readAsText(file, "UTF-8");
                //Default reading process for files or images
            } else {
                var reader = new FileReader();
                reader.onload = function (f) {
                    var raw = f.target.result;
                    var content = raw.substring( raw.search(";base64,") + ";base64,".length );

                    rcmail.http_post("upload_file", {
                        title: title,
                        mime: file.type,
                        content: content,
                        size: file.size,
                    });
                }

                reader.readAsDataURL(file);
            }
    
        }

        ///////////////////////////////////////////////////
        /******************
         * Funciones locales
         *****************/       
        function load_notes(id)
        {
            watermark.show();
            list.find("li").removeClass("selected");
            rcmail.http_post("list", {
                id: id
            });
        }

        function cancel_edit()
        {
            hide_all();
            reset_editor();
            show_note_wrapper.show();
            toolbar_menu.show();
            download_button.show();
        }

        function reset_editor()
        {
            if (mde instanceof EasyMDE) {
                mde.toTextArea();
                mde = null;
            }
            
            mde = new EasyMDE(MDEOptions);
            mde.value("");
        }

        function reset_form()
        {
            $(input_form).trigger("reset");
            $(form_content).val("");
            $(form_upload).siblings(".custom-file-label").text("");
        }

        function hide_all()
        {
            $("[id$='_wrapper']").hide();
            $("[id$='_button']").hide();
            toolbar_menu.hide();
            input_note_content.hide();
        }

        async function load_list(response) {
            list.empty();        

            response.data.forEach(element => {

                let attributes = {                        
                    "data-id": element.id,
                    "data-title": element.title,
                    "data-extension": element.extension,
                    "data-type": element.mimetype.type,
                    "data-subtype": element.mimetype.subtype,
                    "onclick": "return rcmail.command(\"show_note\", this)",
                };
                
                list.append(
                    $("<li>", attributes).addClass("ddnotes_list_element").append(
                        $("<a>").append(
                            $("<div>", {class: "row align-items-center"}).append(
                                $("<div>", {class: "col text-center", style: "max-width: 50px"}).append(
                                    $("<i>", {class: element.icon})
                                )
                            ).append(
                                $("<div>", {class: "col text-truncate"}).append(
                                    $("<span>", {class: "d-inline-block ddnotes_list_element_title", text: element.title})
                                )   
                            ).append(
                                $("<div>", {class: "col text-black-50 font-italic text-right"}).append(
                                    $("<div>", {class: "row"}).append(
                                        $("<div>", {class: "col-12"}).append(
                                            $("<span>", {class: "ddnotes_list_element_date", text: element.ts_created})
                                        )
                                    ).append(
                                        $("<div>", {class: "col-12"}).append(
                                            $("<span>", {class: "ddnotes_list_element_size", text: element.file_size.readable})
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            });
        };
    
        async function refresh_list(_callback) {
            $.ajax({
                url: rcmail.url("refresh_list"),
                method: "POST",
                data: {}
            }).done(function( response ) {
                load_list(response);
                _callback();
            });
        };

        function get_layout() 
        {
            var doc = $(parent.document.documentElement);

            return {
                mode: doc[0].className.match(/layout-([a-z]+)/) ? RegExp.$1 : "normal",
                touch: doc.is('.touch'),
            };
        }

        function is_mobile()
        {
            var meta = get_layout();

            return meta.mode == 'phone' || meta.mode == 'small';
        };

        ///////////////////////////////////////////////////
        /******************
         * Funciones del menú lateral
         *****************/
        function open_creation_submenu( event )
        {
            rcmail.show_menu("ddnotes_creation_submenu", true, event);
        }

        ///////////////////////////////////////////////////
        /******************
         * Frontend
         *****************/
        /**
         * Note click
         */
        $(list).delegate("a", "click", ( event ) => { event.preventDefault(); return; });
        $(list).delegate("li", "click", ( event ) => {
            event.preventDefault();
            $(list).children().removeClass("selected");
            $(event.currentTarget).addClass("selected");
        });

        /**
         * Image or file upload from the sidebar "Upload" menu
         */
        form_upload.on("change", function( event ) {
            let input = event.currentTarget;

            hide_all();

            $(form_id).val(0);
            $(input_note_title).val("");
            $(input_note_content).val("");

            note_title_wrapper.show();
            buttons_wrapper.show();
            upload_button.show();
            
            if ( input.files && input.files[0] ) {
                var file            = input.files[0];
                var mime            = file.type;
                var mimetype        = mime.split( "/" ).shift();
                var mime_subtype    = mime.split( "/" ).pop();
                var name            = file.name.split(".").shift();

                $(input_note_title).val(name);
                $(form_type).val(mime);
                
                if (mimetype == "application" && mime_subtype !== "pdf") {
                    hide_all();
                    $(input_note_title).val("");
                    $(form_type).val("");
                    $(input_note_content).val("");
                    rcmail.display_message( rcmail.gettext("invalid_type", "ddnotes"), "error");
                    return;
                }

                if (mimetype == "image") {
                    let target = $( upload_image_wrapper ).find( "img" );
                    $( target ).attr( "src", URL.createObjectURL(file));
                    upload_image_wrapper.show();
                } else {
                    upload_file_wrapper.show();
                }

                $(form_size).val(file.size);
                watermark.hide();

                if (is_mobile()) {
                    $("#layout-sidebar").removeClass("selected").addClass("hidden");
                    $("#layout-content").removeClass("hidden").addClass("selected");
                    $(toolbar_menu).addClass("hidden");
                }
            }     
        });

        /**
         * When inserting local image from editor
         */
        input_image_upload.on("change", function( event ) {
            let input = event.currentTarget;

            if ( input.files && input.files[0] ) {
                var file            = input.files[0];
                var mime            = file.type;
                var name            = file.name.split(".").shift();
                var reader          = new FileReader();

                reader.readAsDataURL( file );

                reader.onload = ( e ) => {
                    /**
                     * Base64 image, with mimetype tag
                     */
                    let raw         = e.target.result;

                    /**
                     * Decoded image
                     */
                    let content     = raw.substring( raw.search(";base64,") + ";base64,".length );

                    /**
                     * Position of the text cursor in the md editor
                     */
                    let cursor      = mde.codemirror.getCursor();

                    /**
                     * Upload image and obtain attachment url
                     */
                    $.ajax({
                        url: rcmail.url("embed"),
                        method: "POST",
                        data: { 
                            id: $(form_id).val(),
                            title: name,
                            mime: mime,
                            content: content,
                            size: file.size,
                        }
                    }).done(function( response ) {
                        mde.codemirror.replaceSelection("![" + response.data.title + "](" + response.link + ")");
                    });
                }
            }

        });

        /**
         * Search form submit
         * We stop the submit and trigger a input change in order to search
         */
        $("#ddnotes_search_form").on("submit", ( event ) => {
            event.preventDefault();
            $("#ddnotes_search_input").trigger("input");
        });

        /**
         * Search input change event. We search through the notes
         */
        $("#ddnotes_search_input").on("input", ( event ) => {
            event.preventDefault();
            let search = event.target.value.toLowerCase();
            let notes = $("li.ddnotes_list_element");

            if (search.length === 0) {
                notes.show();
                return;
            }

            notes.hide();

            notes.each((index, element) => {
                let title = $(element).data("title").toLowerCase();

                if (title.search(search) !== -1) {
                    $(element).show();
                }
            } );

        });

        $(document).keyup( ( event ) => {
            let selected = list.find("li.selected").data();
            let focus    = $(document.activeElement).prop("tagName").toLowerCase();

            // Delete key pressed and without focus on an input
            if (event.key === "Delete" && selected !== undefined && focus === "body") {
                delete_note();
            }
        } );

        /**
         * Move throw note list with arrow keys
         */
         $(document).keydown( ( event ) => {
            let focus       = $(document.activeElement).prop("tagName").toLowerCase();
            let prev        = $(list).find("li.selected").prev();
            let next        = $(list).find("li.selected").next();

            // Up arrow
            if (event.keyCode === 38 && focus === "body" && prev.length === 1) {
                $(list).children().removeClass("selected");
                $(prev).click();
            }

            // Down arrow
            if (event.keyCode === 40 && focus === "body" && next.length === 1) {
                $(list).children().removeClass("selected");
                $(next).click();
            }

            // If no note selected, we select the first
            if ($(list).find("li.selected").length === 0) {
                $(list).children().first().click();
            }
        });
    }

});