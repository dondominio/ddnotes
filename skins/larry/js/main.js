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
    const file_upload = $("#ddnotes_file_upload");
    const editor_upload = $("#ddnotes_editor_upload");

    const search_form = $("#ddnotes_search_form");
    const search_input = $("#ddnotes_search_input");

    const delete_button = $("#ddnotes_delete_note");

    const sidebar = $("#ddnotes_sidebar");

    const list = $("#ddnotes_list");
    const content = $("#ddnotes_content_wrapper");

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

        /******************
         * Registro de comandos JS
         *****************/
        ///////////////////////////////////////////////////

        rcmail.addEventListener("init", function () {
            rcmail.register_command("new_note", new_note, true);
            rcmail.register_command("update_note", update_note, true);
            rcmail.register_command("edit_note", edit_note, true);
            rcmail.register_command("delete_note", delete_note, false);
            rcmail.register_command("send_note", send_note, false);
            rcmail.register_command("show_note", show_note, true);
            rcmail.register_command("cancel_upload", cancel_upload, true);
            rcmail.register_command("cancel_edit", cancel_edit, true);
            rcmail.register_command("upload_file", upload_file, true);

            /**
             * Inicializamos el splitter
             * No es necesario crear nada en el html
             */
            if ($(sidebar).length) {
                new rcube_splitter({
                    id: "ddnotes_sidebar_splitter",
                    p1: "#ddnotes_sidebar",
                    p2: "#ddnotes_content",
                    orientation: "v",
                    relative: true,
                    // Pixeles de la izquierda desde donde empieza. Recuerda que hay localstorage
                    start: 250,
                    // Es el mínimo de px que permite encoger
                    min: 200,
                    // Tamaño del splitter
                    size: 12,
                }).init();
            }

            DOMPurify.setConfig({ USE_PROFILES: { html: true } });

            refresh_list(function () {
                show_blank_page();
            });
        });
        ///////////////////////////////////////////////////

        /******************
         * Respuestas del backend
         *****************/
        ///////////////////////////////////////////////////
        rcmail.addEventListener("plugin.new", function (response) {
            if (response.result === true) {
                refresh_list(function () {
                    $(list).find("li:first-child").addClass("selected");
                    $(delete_button).removeClass("disabled");
                    rcmail.enable_command("delete_note", delete_note, true);
                    note = response.data;
                    edit_note();
                });
            }
        });

        rcmail.addEventListener("plugin.show", function (response) {
            if (response.result === false) {
                rcmail.display_message(rcmail.gettext("no_note", "ddnotes"), "error");
                return;
            }

            $(content).empty();
            create_headers(response.data);

            if (response.data.isFile) {
                draw_note_file(response.data);
            }

            if (response.data.isImage) {
                draw_note_image(response.data);
            }

            if (response.data.isText) {
                draw_note_text(response.data);
            }

            rcmail.enable_command("send_note", send_note, true);

        });

        rcmail.addEventListener("plugin.update", function (response) {
            if (response.result === true) {
                refresh_list(function () {
                    $(list).find("li[data-id=" + response.id + "]").click();
                });
            }

            if (response.result === false) {
                rcmail.display_message(rcmail.gettext(response.error, "ddnotes"), "error");
            }
        });

        rcmail.addEventListener("plugin.uploaded", function (response) {
            if (response.result === true) {
                refresh_list(function () {
                    $(list).find("li:first-child").click();
                });
            }

            if (response.result === false) {
                rcmail.display_message(rcmail.gettext(response.error, "ddnotes"), "error");
            }
            console.log(response)
        });

        rcmail.addEventListener("plugin.delete", function (response) {
            if (response.result === true) {
                refresh_list(function () {
                    show_blank_page();
                });
            }

            if (response.result === false) {
                rcmail.display_message(rcmail.gettext(response.error, "ddnotes"), "error");
            }
        });
        ///////////////////////////////////////////////////

        /******************
         * Funciones de los comandos JS
         *****************/
        ///////////////////////////////////////////////////
        function send_note() {
            rcmail.goto_url("mail/compose", {ddnotes_id: note.id});
        }

        function show_note(element) {
            rcmail.http_post("show", {
                id: element.id
            });
        }

        function new_note(type) {
            if (type == "file") {
                $(file_upload).click();
                return;
            }

            rcmail.http_post("new", {
                type: type
            });
        }

        function update_note() {
            let id = note.id;
            let title = $("#ddnotes_note_title");
            let content = $("#ddnotes_editor_textarea").val();

            if ($(title).val().trim().length === 0) {
                rcmail.display_message(rcmail.gettext("empty_title", "ddnotes"), "error");
                $(title).focus();
                return;
            }

            if (note.isText) {
                content = tiny_editor.getContent();
            }

            // Para archivos o imagenes, el contenido es "undefined"
            content = content === undefined ? "" : DOMPurify.sanitize(content);

            rcmail.http_post("update", {
                id: id,
                name: $(title).val(),
                content: content
            });
        }

        function edit_note() {
            $(content).empty();
            create_edit_headers(note);

            if (note.isText) {

                if (note.extension === "txt") {

                    $(content).append(
                        $("<div>", {
                            id: "ddnotes_editor_textarea_wrapper",
                            class: "ddnotes_editor_textarea_wrapper scroller",
                            style: "top: " + $("div.ddnotes_note_headers").outerHeight() + "px;"
                        }).append(
                            $("<textarea>", {
                                id: "ddnotes_editor_textarea",
                                class: "ddnotes_editor_textarea",
                                text: note.content.raw
                            })
                        )
                    );
                }

                if (note.extension === "md" || note.extension === "html") {

                    $(content).append(
                        $("<div>", {
                            id: "ddnotes_editor_textarea_wrapper",
                            class: "ddnotes_editor_textarea_wrapper scroller"
                        }).append(
                            $("<textarea>", {
                                id: "ddnotes_editor_textarea",
                                class: "ddnotes_editor_textarea",
                                text: note.content.raw
                            })
                        )
                    ).append(
                        $("<div>", {
                            id: "tinymde_toolbar",
                            class: "ddnotes_editor_toolbar"
                        })
                    );

                    $("#ddnotes_editor_textarea_wrapper").css({
                        "top": "113px"
                    });

                    generate_editor(note.content.raw);
                }
            }

            if (note.isImage) {
                draw_note_image(note);
            }

            if (note.isFile) {
                draw_note_file(note);
            }
        }

        function delete_note() {
            let selected = $(list).find("li.selected").data();

            if (selected === undefined) {
                rcmail.display_message(rcmail.gettext("no_note", "ddnotes"), "error");
                return;
            }

            if (confirm(rcmail.gettext("delete_popup", "ddnotes"))) {
                rcmail.http_post("delete", {
                    id: selected.id
                });
            }
        }

        function upload_file() {
            var title = $("#ddnotes_note_title");
            var file = $(file_upload)[0].files[0];

            if ($(title).val().trim().length === 0) {
                rcmail.display_message(rcmail.gettext("empty_title", "ddnotes"), "error");
                $(title).focus();
                return;
            }

            var reader = new FileReader();
            // If text file, we need it decoded
            if (file.type === "text/plain") {
                reader.onload = function (f) {
                    var content = f.target.result;

                    rcmail.http_post("upload_file", {
                        title: $(title).val(),
                        mime: file.type,
                        content: content,
                        size: file.size,
                    });
                }
                reader.readAsText(file, "UTF-8");
                //Default reading process for files or images
            } else {
                reader.onload = function (f) {
                    var raw = f.target.result;
                    var content = raw.substring(raw.search(";base64,") + ";base64,".length);

                    rcmail.http_post("upload_file", {
                        title: $(title).val(),
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
        ///////////////////////////////////////////////////
        function cancel_edit(element) {
            $(content).empty();
            show_note(element)
        }

        function cancel_upload() {
            show_blank_page();
        }

        function load_list(response) {
            list.empty();

            response.data.forEach(function (element) {

                let attributes = {
                    "data-id": element.id,
                    "data-title": element.title,
                    "data-extension": element.extension,
                    "data-type": element.mimetype.type,
                    "data-subtype": element.mimetype.subtype,
                    "onclick": "return rcmail.command(\"show_note\", $(this).data())",
                };

                list.append(
                    $("<li>", attributes).addClass("listitem").addClass("ddnotes_list_element").append(
                        $("<a>").append(
                            $("<div>", { class: "ddnotes_list_element_icon" }).append(
                                $("<i>", { class: element.icon })
                            )
                        ).append(
                            $("<div>", { class: "ddnotes_list_element_info" }).append(
                                $("<div>", { class: "ddnotes_list_element_title", text: element.title })
                            ).append(
                                $("<div>", { class: "ddnotes_list_element_footer" }).append(
                                    $("<div>", { class: "ddnotes_list_element_ts", text: element.ts_updated })
                                ).append(
                                    $("<div>", { class: "ddnotes_list_element_size", text: element.file_size.readable })
                                )
                            )
                        )
                    )
                )
            });
        };

        /** 
         * Una vez realizado la petición ajax, se actualizará el sidebar con el 
         * listado de las notas que haya y se ejecutará el callback indicado
        */
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

        /**
         * Mostramos cabecera con información de una nota
         */
        function create_headers(element) {
            note = element;
            let download = "";

            // IE11
            if (!(window.ActiveXObject) && "ActiveXObject" in window) {
                download = $("<div>", { class: "ddnotes_note_headers_actions" }).append(
                    $("<a>", {
                        class: "button fa fa-pencil-alt",
                        href: "#",
                        title: rcmail.gettext("edit_note", "ddnotes"),
                        label: rcmail.gettext("edit_note", "ddnotes"),
                        onclick: "return rcmail.command(\"edit_note\", " + element.id + ")",
                    }).data("note", JSON.stringify(element))
                ).append(
                    $("<a>", {
                        class: "button fas fa-download",
                        href: "/?_task=ddnotes&_action=view&_uid=" + element.id,
                        target: "_blank",
                        title: rcmail.gettext("download", "ddnotes"),
                        label: rcmail.gettext("download", "ddnotes"),
                    })
                )
            } else {
                download = $("<div>", { class: "ddnotes_note_headers_actions" }).append(
                    $("<a>", {
                        class: "button fa fa-pencil-alt",
                        href: "#",
                        title: rcmail.gettext("edit_note", "ddnotes"),
                        label: rcmail.gettext("edit_note", "ddnotes"),
                        onclick: "return rcmail.command(\"edit_note\", " + element.id + ")",
                    }).data("note", JSON.stringify(element))
                ).append(
                    $("<a>", {
                        class: "button fas fa-download",
                        title: rcmail.gettext("download", "ddnotes"),
                        label: rcmail.gettext("download", "ddnotes"),
                        href: element.content.encoded,
                        download: element.title + "." + element.extension,
                    })
                )
            }

            let header = $("<div>", { class: "ddnotes_note_headers" }).append(
                $("<div>", { class: "ddnotes_note_headers_info" }).append(
                    $("<h3>", { title: element.title, text: element.title })
                )
            ).append(download)

            $(content).append(header);
        }

        /**
         * Mostramos cabecera con información de una nueva nota
         */
        function create_new_headers(element) {
            let header = $("<div>", { class: "ddnotes_note_headers" }).append(
                $("<div>", { class: "ddnotes_note_headers_icon" }).append(
                    $("<span>", { class: element.icon + " fa-2x" })
                )
            ).append(
                $("<div>", { class: "ddnotes_note_headers_info" }).append(
                    $("<label>", {
                        for: "ddnotes_note_title",
                        text: rcmail.gettext("note_title_label", "ddnotes")
                    })
                ).append(
                    $("<input>", {
                        type: "text",
                        style: "width: 100%",
                        value: element.title,
                        id: "ddnotes_note_title",
                        name: "ddnotes_note_title",
                    })
                )
            ).append(
                $("<div>", { class: "ddnotes_note_headers_actions" }).append(
                    $("<a>", {
                        class: "button fas fa-save",
                        href: "#",
                        title: rcmail.gettext("upload", "ddnotes"),
                        label: rcmail.gettext("upload", "ddnotes"),
                        onclick: "return rcmail.command(\"upload_file\")",
                    })
                ).append(
                    $("<a>", {
                        class: "button fas fa-times",
                        href: "#",
                        title: rcmail.gettext("cancel", "ddnotes"),
                        label: rcmail.gettext("cancel", "ddnotes"),
                        onclick: "return rcmail.command(\"cancel_upload\")",
                    })
                )
            )
            $(content).append(header);
        }

        /**
         * Mostramos la cabecera con la información de la nota que se esta editando
         */
        function create_edit_headers(element) {
            let header = $("<div>", { class: "ddnotes_note_headers" }).append(
                $("<div>", { class: "ddnotes_note_headers_icon" }).append(
                    $("<span>", { class: element.icon + " fa-2x" })
                )
            ).append(
                $("<div>", { class: "ddnotes_note_headers_info" }).append(
                    $("<label>", {
                        for: "ddnotes_note_title",
                        text: rcmail.gettext("note_title_label", "ddnotes")
                    })
                ).append(
                    $("<input>", {
                        type: "text",
                        value: element.title,
                        id: "ddnotes_note_title",
                    })
                )
            ).append(
                $("<div>", { class: "ddnotes_note_headers_actions" }).append(
                    $("<a>", {
                        class: "button fas fa-save",
                        href: "#",
                        title: rcmail.gettext("upload", "ddnotes"),
                        label: rcmail.gettext("upload", "ddnotes"),
                        onclick: "return rcmail.command(\"update_note\")",
                    })
                ).append(
                    $("<a>", {
                        class: "button fas fa-times",
                        href: "#",
                        title: rcmail.gettext("cancel", "ddnotes"),
                        label: rcmail.gettext("cancel", "ddnotes"),
                        onclick: "return rcmail.command(\"cancel_edit\", " + JSON.stringify(element) + ")",
                    })
                )
            )
            $(content).append(header);
        }

        /**
         * Pintamos una nota del tipo image/*
         * Es necesario calcular el espacio en el top según el header que haya
         * para que el contenido quede donde debería
         */
        function draw_note_image(element) {
            let image = $("<div>", {
                class: "ddnotes_note_image scroller",
                style: "top: " + $("div.ddnotes_note_headers").outerHeight() + "px;"
            }).append(
                $("<img>", { src: element.content.encoded })
            );
            $(content).append(image)
        }

        /**
         * Pintamos una nota del tipo application/*
         */
        function draw_note_file(element) {
            let file = $("<div>", { class: "ddnotes_note_file" }).append(
                $("<span>").append(
                    $("<i>", { class: "fas fa-file fa-5x" })
                ).append(element.file_size.readable)
            )
            $(content).append(file);
        }

        /**
         * Pintamos una nota del tipo text/*
         */
        function draw_note_text(element) {
            let file = $("<div>", {
                class: "ddnotes_note_text scroller",
                style: "top: " + $("div.ddnotes_note_headers").outerHeight() + "px;"
            });

            // Plaintext and html need to escape tags
            if (element.extension === "md" || element.extension === "html") {
                file.append(
                    $("<pre>", {
                        class: "ddnotes_note_text_pre"
                    }).html(DOMPurify.sanitize(marked(element.content.raw)))
                );
            }

            if (element.extension === "txt") {
                file.append(
                    $("<pre>", {
                        class: "ddnotes_note_text_pre",
                        text: element.content.raw,
                    })
                );
            }

            $(content).append(file);
        }

        /**
         * Initialize editor
         */
        function generate_editor(editor_content) {
            tiny_editor = new TinyMDE.Editor({
                element: $("#ddnotes_editor_textarea")[0],
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
                            $(editor_upload).click();
                        }
                    }
                ]
            });

            tiny_editor.setContent(editor_content ? editor_content : "");
        }

        /**
         * Mostramos la página en blanco con el watermark de roundcube
         * Desactivamos el botón para eliminar notas
         */
        function show_blank_page() {
            note = {};
            $(content).empty();

            $(content).append(
                $("<div>", { class: "ddnotes_watermark_wrapper" }).append(
                    $("<img>", { src: "/skins/larry/images/watermark.jpg" })
                )
            );

            $(delete_button).addClass("disabled");
            rcmail.enable_command("delete_note", delete_note, false);
        }

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

        /**
         * @see https://gist.github.com/zentala/1e6f72438796d74531803cc3833c039c
         * @param {int} bytes 
         * @param {int} decimals 
         * @returns {string}
         */
        function formatBytes(bytes, decimals) {
            if (bytes == 0) return '0 Bytes';
            var k = 1024,
                dm = decimals || 2,
                sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        } (String)
        ///////////////////////////////////////////////////

        /******************
         * FrontEnd events
         *****************/
        ///////////////////////////////////////////////////
        /**
         * Search bar submit with Enter
         */
        $(search_form).on("submit", function (event) {
            event.preventDefault();
            $(search_input).trigger("input");
        });

        /**
         * Search bar change event
         */
        $(search_input).on("input", function (event) {
            event.preventDefault();
            let search = event.target.value.toLowerCase();
            let elements = $(list).find("li.ddnotes_list_element");

            if (search.length === 0) {
                elements.show();
                return;
            }

            elements.hide();

            elements.each(function (index, element) {
                let title = $(element).data("title").toLowerCase();

                if (title.search(search) !== -1) {
                    $(element).show();
                }
            });
        });

        /**
         * Add/Remove "selected" class from <li> at note list from sidebar
         * and activate delete button
         */
        $(list).delegate("a", "click", function (event) { event.preventDefault(); return; });
        $(list).delegate("li", "click", function (event) {
            event.preventDefault();
            $(list).children().removeClass("selected");
            $(event.currentTarget).addClass("selected");
            $(delete_button).removeClass("disabled");
            rcmail.enable_command("delete_note", delete_note, true);
        });

        /**
         * Toolbar upload form event
         */
        $(file_upload).on("change", function (event) {
            let input = event.currentTarget;

            if (input.files && input.files[0]) {
                let file = input.files[0];
                // Procesamos el mimetype
                let mime = file.type;
                let mimetype = mime.split("/").shift();
                let mime_subtype = mime.split("/").pop();
                // Cogemos el nombre desde el principio hasta el último punto
                let name = file.name.substring(0, file.name.lastIndexOf("."));
                // Elemento genérico con los datos que tenemos
                let element = {
                    title: name,
                    file_size: { bytes: file.size, readable: formatBytes(file.size) },
                    isFile: false,
                    isImage: true,
                    isText: false,
                    mimetype: { full: mime, subtype: mime_subtype, type: mimetype },
                    content: { raw: null, encoded: null }
                };

                // Check mimetype support
                if (!check_mime(mimetype, mime_subtype)) {
                    show_blank_page();
                    rcmail.display_message(rcmail.gettext("invalid_type", "ddnotes"), "error");
                    return;
                }

                $(content).empty();

                if (mimetype === "image") {
                    let src = URL.createObjectURL(file);
                    element.content.encoded = src;

                    create_new_headers(element);
                    draw_note_image(element);

                } else {
                    create_new_headers(element);
                    draw_note_file(element);
                }
            }
        });

        $(editor_upload).on("change", function (event) {
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
                            id: note.id,
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
         * Note deletion if "Delete" key is pressed and have a note selected
         * from the list
         */
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
                $(list).children().removeClass("selected");
                show_blank_page();
            }
        });
        ///////////////////////////////////////////////////
    }

});