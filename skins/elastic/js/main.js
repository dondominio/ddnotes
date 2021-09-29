"use strict";

/**
 * Notes plugin
 * 
 * @version 1.0
 * @author Soluciones Corporativas IP S.L.
 * @copyright Copyright (c) 2021, SCIP
 * @license GNU General Public License, version 3
 */


$(function () {
    ///////////////////////////////////////////////////
    /******************
    * Variables
    *****************/

    // Watermark
    const watermark = $("#ddnotes_watermark");

    // Lista <ul> con las notas
    const list = $("#ddnotes_notes_list");

    // Form
    const input_form = $("#ddnotes_form");

    // Campos de título y textarea para la creación de la nota
    const note_title_wrapper = $("#ddnotes_note_title_wrapper");
    const buttons_wrapper = $("#ddnotes_buttons_wrapper");
    const editor_wrapper = $("#ddnotes_editor_wrapper");
    const show_note_wrapper = $("#ddnotes_show_note_wrapper");
    const upload_image_wrapper = $("#ddnotes_upload_image_wrapper");
    const upload_file_wrapper = $("#ddnotes_upload_file_wrapper");
    const show_image_wrapper = $("#ddnotes_show_image_wrapper");
    const show_file_wrapper = $("#ddnotes_show_file_wrapper");

    // Form inputs
    const form_id = $("#ddnotes_form_id");
    const form_type = $("#ddnotes_form_type");
    const form_content = $("#ddnotes_form_content");
    const form_upload = $("#ddnotes_form_upload");
    const form_size = $("#ddnotes_form_size");

    // Title and easymde textarea
    const input_note_title = $("#ddnotes_input_note_title");
    const input_note_content = $("#ddnotes_input_note_content");
    const input_image_upload = $("#ddnotes_image_upload");

    // Elementos de la vista de nota
    const note_title = $("#ddnotes_note_title");
    const note_content = $("#ddnotes_note_content");
    const file_size = $("p.ddnotes_file_size");

    // Botones
    const save_button = $("#ddnotes_save_button");
    const update_button = $("#ddnotes_update_button");
    const cancel_button = $("#ddnotes_cancel_button");
    const upload_button = $("#ddnotes_upload_button");
    const download_button = $("#ddnotes_download_button");

    // Menus
    const toolbar_menu = $("#ddnotes_toolbar_menu");

    /**
      * Editor elements
      */
    var tiny_editor = {};
    var tiny_editor_toolbar = {};

    /**
     * DDNotes element
     */
    var note = {};

    if (window.rcmail) {

        ///////////////////////////////////////////////////
        /******************
         * Registro de comandos JS
         *****************/

        rcmail.addEventListener("init", function () {
            rcmail.register_command("new_note", new_note, true);
            rcmail.register_command("update_note", update_note, true);
            rcmail.register_command("edit_note", edit_note, false);
            rcmail.register_command("send_note", send_note, false);
            rcmail.register_command("delete_note", delete_note, false);
            rcmail.register_command("show_note", show_note, true);
            rcmail.register_command("cancel_edit", cancel_edit, true);
            rcmail.register_command("upload_file", upload_file, true);

            // Menu events
            rcmail.enable_command("open_submenu", open_creation_submenu);

            DOMPurify.setConfig({ USE_PROFILES: { html: true } });

            load_notes(-1);
        });

        ///////////////////////////////////////////////////
        /******************
         * Registro de callbacks del backend
         *****************/
        rcmail.addEventListener("plugin.new", function (response) {
            if (response.result === true) {
                hide_all();
                reset_form();
                $(form_id).val(response.data.id);
                $(input_note_title).val(response.data.title);

                refresh_list(function () {
                    list.children().first().addClass("selected");
                });

                reset_editor();

                $(form_type).val(response.data.mimetype.full);
                $(input_note_title).val(rcmail.gettext("new_note", "ddnotes"));
                $(input_note_content).val("");
                $(form_content).val("");

                note_title_wrapper.show();

                if (response.data.isText) {

                    if (response.data.extension == "txt") {
                        $("#tinymde_toolbar").empty();
                        $("div.TinyMDE").remove();
                        input_note_content.show();
                    }

                }

                editor_wrapper.show();
                buttons_wrapper.show();
                save_button.show();
                watermark.hide();

                if (is_mobile()) {
                    $("#layout-sidebar").removeClass("selected").addClass("hidden");
                    $("#layout-content").removeClass("hidden").addClass("selected");
                    $(toolbar_menu).addClass("hidden");
                }

                rcmail.enable_command("delete_note", delete_note);

            }
        });

        rcmail.addEventListener("plugin.list", function (response) {
            if (response.result === true) {
                load_list(response, function () {
                    hide_all();
                    reset_form();
                    list.find("li[data-id=" + response.id + "]").addClass("selected").find("a").click();
                });
            }
        });

        rcmail.addEventListener("plugin.show", function (response) {

            if (response.result === true) {

                hide_all();
                reset_form();
                $(note_content).empty();

                $(input_note_title).val(response.data.title);
                $(note_title).text(response.data.title);
                $(form_id).val(response.data.id);

                // Markdown parser
                if (response.data.isText && (response.data.extension === "md") || response.data.extension === "html") {

                    $(note_content).html(DOMPurify.sanitize(marked(response.data.content.raw)));
                }

                // Plaintext and html need to escape tags
                if (response.data.isText && response.data.extension === "txt") {
                    $(note_content).text(response.data.content.raw);
                }

                // If a image file, loads an <img> tag with his src
                if (response.data.isImage) {
                    let img = $("<img>", { src: response.data.content.encoded });
                    $(note_content).append(img);
                }

                // If it's a file, shows file wrapper content with file icon
                if (response.data.isFile) {
                    $(file_size).text(response.data.file_size.readable);
                    $(show_file_wrapper).show();
                }

                // Save note object to the edit button at toolbar
                $("a#ddnotes_edit_note").attr("data-note", JSON.stringify(response.data));

                // IE11 Fix. It doesn't process base64 url for file downloads
                if (!(window.ActiveXObject) && "ActiveXObject" in window) {
                    $(download_button).attr({
                        href: "/?_task=ddnotes&_action=view&_uid=" + response.data.id,
                        target: "_blank",
                        title: rcmail.gettext("download", "ddnotes"),
                        label: rcmail.gettext("download", "ddnotes"),
                    });
                } else {
                    $(download_button).attr({
                        href: response.data.content.encoded,
                        download: response.data.title + "." + response.data.extension,
                    });
                }


                download_button.show();
                toolbar_menu.show();
                show_note_wrapper.show();
                watermark.hide();

                if (is_mobile()) {
                    $("#layout-sidebar").removeClass("selected").addClass("hidden");
                    $("#layout-content").removeClass("hidden").addClass("selected");
                    $(toolbar_menu).addClass("hidden");
                }

                rcmail.enable_command("edit_note", edit_note);
                rcmail.enable_command("send_note", send_note);
                rcmail.enable_command("delete_note", delete_note);
            }
        });

        rcmail.addEventListener("plugin.update", function (response) {
            load_notes(response.id);
        });

        rcmail.addEventListener("plugin.delete", function (response) {
            hide_all();
            reset_form();
            refresh_list();
        });

        rcmail.addEventListener("plugin.uploaded", function (response) {

            if (response.result === true) {
                load_notes(response.data.id);
            }
        });

        /**
         * Creation submenu popup event
         */
        rcmail.addEventListener("beforeopen_submenu", function (event) {
            rcmail.command("menu-open", "ddnotes_creation_submenu", event.target, event);
        });

        ///////////////////////////////////////////////////
        /******************
         * Funciones de los comandos JS
         *****************/
        function send_note() {
            rcmail.goto_url("mail/compose", { ddnotes_id: $(form_id).val() });
        }

        function show_note(element) {
            let id = $(element).data("id");
            rcmail.http_post("show", {
                id: id
            });
        }

        function new_note(type) {
            if (type == "file") {
                form_upload.click();
                return;
            }

            rcmail.http_post("new", {
                type: type
            });
        }

        function update_note() {
            let id = $(form_id).val();                  // Note ID
            var title = $(input_note_title).val();      // Note title
            var mime = $(form_type).val();              // Mimetype
            var content = $(input_note_content).val();  // Editor content

            if ($(input_note_title).val().trim().length === 0) {
                rcmail.display_message(rcmail.gettext("empty_title", "ddnotes"), "error");
                $(input_note_title).focus();
                return;
            }

            // Para archivos o imagenes, el contenido es "undefined"
            content = content === undefined ? "" : DOMPurify.sanitize(content);

            rcmail.http_post("update", {
                id: id,
                name: title,
                mime: mime,
                content: content
            });
        }

        function edit_note() {
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
                $(form_content).val(note.content.raw);
                tiny_editor.setContent(note.content.raw);

                if (note.extension == "txt") {
                    $("#tinymde_toolbar").empty();
                    $("div.TinyMDE").remove();
                    input_note_content.show();
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

        function delete_note() {
            if (confirm(rcmail.gettext("delete_popup", "ddnotes").replace("%title%", input_note_title.val()))) {
                rcmail.http_post("delete", {
                    id: form_id.val()
                });
            }
        }

        function upload_file() {
            var title = $(input_note_title).val();    // Note title
            var file = $(form_upload)[0].files[0];   // EasyMDE editor content
            var mime_type = file.type.split("/").shift();
            var mime_subtype = file.type.split("/").pop();

            if ($(input_note_title).val().trim().length === 0) {
                rcmail.display_message(rcmail.gettext("empty_title", "ddnotes"), "error");
                $(input_note_title).focus();
                return;
            }

            // Check for formats
            if (!check_mime(mime_type, mime_subtype)) {
                rcmail.display_message(rcmail.gettext("invalid_format", "ddnotes"), "error");
                return;
            }

            // If text file, we need it decoded
            if (file.type === "text/plain") {
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
                    var content = raw.substring(raw.search(";base64,") + ";base64,".length);

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
        function load_notes(id) {
            watermark.show();
            list.find("li").removeClass("selected");
            rcmail.http_post("list", {
                id: id
            });
        }

        function cancel_edit() {
            hide_all();
            reset_editor();
            show_note_wrapper.show();
            toolbar_menu.show();
            download_button.show();
        }

        function reset_editor() {
            tiny_editor = null;
            tiny_editor_toolbar = null;

            $("div.TinyMDE").remove();

            $(input_note_content).val("");
            $("#tinymde_toolbar").empty();

            tiny_editor = new TinyMDE.Editor({
                element: $(input_note_content)[0],
                content: " "
            });

            tiny_editor_toolbar = new TinyMDE.CommandBar({
                element: $("#tinymde_toolbar")[0],
                editor: tiny_editor,
                commands: ['bold', 'italic', 'strikethrough', '|', 'code', '|', 'h1', 'h2', '|', 'ul', 'ol', '|', 'blockquote', 'hr', '|', 'insertLink', 'insertImage',
                    {
                        name: "upload",
                        title: rcmail.gettext("upload", "ddnotes"),
                        innerHTML: "<span class=\"fas fa-file-import\"></span>",
                        action: function () {
                            $(input_image_upload).click();
                        }
                    }
                ]
            });
        }

        function reset_form() {
            $(input_form).trigger("reset");
            $(form_content).val("");
            $(form_upload).siblings(".custom-file-label").text("");
        }

        function hide_all() {
            $("[id$='_wrapper']").hide();
            $("[id$='_button']").hide();
            toolbar_menu.hide();
            input_note_content.hide();
        }

        function load_list(response, _callback) {
            list.empty();

            response.data.forEach(function (element) {

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
                            $("<div>", { class: "row align-items-center" }).append(
                                $("<div>", { class: "col text-center", style: "max-width: 50px" }).append(
                                    $("<i>", { class: element.icon })
                                )
                            ).append(
                                $("<div>", { class: "col text-truncate" }).append(
                                    $("<span>", { class: "d-inline-block ddnotes_list_element_title", text: element.title })
                                )
                            ).append(
                                $("<div>", { class: "col text-black-50 font-italic text-right" }).append(
                                    $("<div>", { class: "row" }).append(
                                        $("<div>", { class: "col-12" }).append(
                                            $("<span>", { class: "ddnotes_list_element_date", text: element.ts_created })
                                        )
                                    ).append(
                                        $("<div>", { class: "col-12" }).append(
                                            $("<span>", { class: "ddnotes_list_element_size", text: element.file_size.readable })
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            });

            if (_callback && typeof (_callback) == "function") {
                _callback();
            }
        };

        function refresh_list(_callback) {
            $.ajax({
                url: rcmail.url("refresh_list"),
                method: "POST",
                data: {}
            }).done(function (response) {
                load_list(response);
                if (_callback && typeof (_callback) == "function") {
                    _callback();
                }
            });
        };

        function get_layout() {
            var doc = $(parent.document.documentElement);

            return {
                mode: doc[0].className.match(/layout-([a-z]+)/) ? RegExp.$1 : "normal",
                touch: doc.is('.touch'),
            };
        }

        function is_mobile() {
            var meta = get_layout();

            return meta.mode == 'phone' || meta.mode == 'small';
        };

        /**
         * Revisamos si el tipo de archivo subido tiene un formato
         * que aceptamos en la configuración del plugin
         */
        function check_mime(type, subtype) {
            let extensions = rcmail.env.ddnotes_config.extensions;

            return (extensions[type] !== undefined) && (extensions[type].indexOf(subtype) >= 0)

            // return extensions[type].indexOf(subtype) > -1
            // if (type in extensions) {
            //     return (extensions[type].includes(subtype))

            // } else {
            //     return false;
            // }
        } (Boolean)

        ///////////////////////////////////////////////////
        /******************
         * Funciones del menú lateral
         *****************/
        function open_creation_submenu(event) {
            rcmail.show_menu("ddnotes_creation_submenu", true, event);
        }

        ///////////////////////////////////////////////////
        /******************
         * Frontend
         *****************/
        /**
         * Note click
         */
        $(list).delegate("a", "click", function (event) { event.preventDefault(); return; });
        $(list).delegate("li", "click", function (event) {
            event.preventDefault();
            $(list).children().removeClass("selected");
            $(event.currentTarget).addClass("selected");
        });

        /**
         * Image or file upload from the sidebar "Upload" menu
         */
        form_upload.on("change", function (event) {
            let input = event.currentTarget;

            hide_all();

            $(form_id).val(0);
            $(input_note_title).val("");
            $(input_note_content).val("");

            note_title_wrapper.show();
            buttons_wrapper.show();
            upload_button.show();

            if (input.files && input.files[0]) {
                var file = input.files[0];
                var mime = file.type;
                var mimetype = mime.split("/").shift();
                var mime_subtype = mime.split("/").pop();
                var name = file.name.split(".").shift();

                if (!check_mime(mimetype, mime_subtype)) {
                    hide_all();
                    $(input_note_title).val("");
                    $(form_type).val("");
                    $(input_note_content).val("");
                    rcmail.display_message(rcmail.gettext("invalid_format", "ddnotes"), "error");
                    return;
                }

                $(input_note_title).val(name);
                $(form_type).val(mime);

                if (mimetype == "image") {
                    let target = $(upload_image_wrapper).find("img");
                    $(target).attr("src", URL.createObjectURL(file));
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
        input_image_upload.on("change", function (event) {
            let input = event.currentTarget;

            if (input.files && input.files[0]) {
                var file = input.files[0];
                var mime = file.type;
                var name = file.name.split(".").shift();
                var reader = new FileReader();

                reader.readAsDataURL(file);

                reader.onload = function (e) {
                    /**
                     * Base64 image, with mimetype tag
                     */
                    let raw = e.target.result;

                    /**
                     * Decoded image
                     */
                    let content = raw.substring(raw.search(";base64,") + ";base64,".length);

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
                    }).done(function (response) {
                        if (response.result === true) {
                            tiny_editor.paste("![" + response.data.title + "](" + response.link + ")");
                        }

                        if (response.result === false) {
                            rcmail.display_message(rcmail.gettext(response.error, "ddnotes"), "error");
                        }
                    });
                }
            }

        });

        /**
         * Search form submit
         * We stop the submit and trigger a input change in order to search
         */
        $("#ddnotes_search_form").on("submit", function (event) {
            event.preventDefault();
            $("#ddnotes_search_input").trigger("input");
        });

        /**
         * Search input change event. We search through the notes
         */
        $("#ddnotes_search_input").on("input", function (event) {
            event.preventDefault();
            let search = event.target.value.toLowerCase();
            let notes = $("li.ddnotes_list_element");

            if (search.length === 0) {
                notes.show();
                return;
            }

            notes.hide();

            notes.each(function (index, element) {
                let title = $(element).data("title").toLowerCase();

                if (title.search(search) !== -1) {
                    $(element).show();
                }
            });

        });

        $(document).keyup(function (event) {
            let selected = list.find("li.selected").data() !== undefined;
            let focus = $(document.activeElement).prop("tagName").toLowerCase();
            let del = event.keyCode === 46;
            let isFocus = (focus !== "input" && focus !== "textarea" && focus !== "div");
            let isDeletable = (del && isFocus && selected);

            // Delete key pressed and without focus on an input
            if (isDeletable) {
                delete_note();
            }
        });

        /**
         * Move throw note list with arrow keys
         */
        $(document).keydown(function (event) {
            let selected = list.find("li.selected").data() !== undefined;
            let focus = $(document.activeElement).prop("tagName").toLowerCase();
            let prev = $(list).find("li.selected").prev();
            let next = $(list).find("li.selected").next();
            let notFirst = $(prev).length !== 0;
            let notLast = $(next).length !== 0;
            let up = event.keyCode === 38;
            let down = event.keyCode === 40;
            let esc = event.keyCode === 27;
            let isFocus = (focus !== "input" && focus !== "textarea" && focus !== "div");

            // Up arrow
            if (up && notFirst && isFocus) {
                $(list).children().removeClass("selected");
                $(prev).click();
            }

            // Down arrow
            if (down && notLast && isFocus) {
                $(list).children().removeClass("selected");
                $(next).click();
            }

            // If no note selected, we select the first
            if ((up || down) && !selected) {
                $(list).children().first().click();
            }

            // If ESC pressed, remove note show view
            if (esc && isFocus) {
                hide_all();
                $(list).children().removeClass("selected");
                $(watermark).show();
                rcmail.enable_command("edit_note", false);
                rcmail.enable_command("send_note", false);
                rcmail.enable_command("delete_note", false);
            }
        });
    }

});
