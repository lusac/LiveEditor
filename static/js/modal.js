/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorModal = function LiveEditorModal (params) {
        this.init(params);
    };

    LiveEditorModal.prototype.init = function (params) {
        this.editor = params.editor;
        this.name = params.data.name;
        this.title = params.data.title;
        this.field = params.data.field;
        this.language = params.data.language;

        if (this.language) {
            // TO DO: tests
            this.aceEditorId = this.getID();
        }

        this.create();
        this.bindEvents();
    };

    LiveEditorModal.prototype.create = function () {
        this.$modal = $('<div class="modal fade" tabindex="-1" role="dialog">');

        var $div2 = $('<div class="modal-dialog" role="document">'),
            $div3 = $('<div class="modal-content">'),
            $header = '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
                            '<h4 class="modal-title">' + this.title + '</h4>' +
                        '</div>',
            $field = this.getField(),
            $section = '<div class="modal-body">' +
                            $field[0].outerHTML +
                        '</div>',
            $footer = '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                            '<button type="submit" class="btn btn-primary save-btn">Save</button>' +
                      '</div>';

        this.$modal.attr('id', this.name);

        this.$modal.append(
            $div2.append(
                $div3.append($header, $section, $footer)
            )
        );

        $('body').append(this.$modal);

        if (this.language && this.language != 'css') {
            // TO DO: tests
            this.aceEditor = new LiveEditorAceEditor({
                id: this.aceEditorId,
                language: this.language
            });
        }
    };

    LiveEditorModal.prototype.bindEvents = function () {
        var self = this;

        this.$modal.on('click', '.btn-add', function(e) {
            e.preventDefault();
            self.addNewStyleInput();
        }).on('click', '.btn-remove', function(e) {
            e.preventDefault();
            self.removeStyleInput($(this));
        });
    }

    LiveEditorModal.prototype.getField = function () {
        var $field = '';

        if (this.language == 'css') {
            $field = $('<form role="form" autocomplete="off">');
        } else {
            $field = $('<' + this.field + ' class="form-control" id="' + this.aceEditorId + '">');
        }

        if (this.language) {
            if (this.language != 'css') {
                $field.addClass('ace-editor-field');
            } else {
                $field.append(this.getStyleInput());
            }
        }

        return $field;
    };

    LiveEditorModal.prototype.addNewStyleInput = function () {
        var $controlForm = this.$modal.find('form'),
            $currentEntry = this.$modal.find('.entry:last'),
            $newEntry = this.getStyleInput();

        $controlForm.append($newEntry);
        this.styleInputWithContent($currentEntry);
    };

    LiveEditorModal.prototype.removeStyleInput = function ($elem) {
        $elem.parents('.entry').remove();
    };

    LiveEditorModal.prototype.getStyleInput = function () {
        return $('<div class="entry input-group">'+
                    '<input class="form-control" type="text" placeholder="Ex: background: #000" />'+
                    '<span class="input-group-btn">'+
                        '<button class="btn btn-success btn-add" type="button">'+
                            '<span class="glyphicon glyphicon-plus"></span>'+
                        '</button>'+
                    '</span>'+
                '</div>');
    };

    LiveEditorModal.prototype.styleInputWithContent = function ($input) {
        $input.find('.btn-add')
              .removeClass('btn-add').addClass('btn-remove')
              .removeClass('btn-success').addClass('btn-danger')
              .html('<span class="glyphicon glyphicon-minus"></span>');
    };

    LiveEditorModal.prototype.getID = function () {
        // TO DO: tests
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };

    LiveEditorModal.prototype.setValue = function (value) {
        // TO DO: tests
        if (this.aceEditor) {
            this.aceEditor.aceEditor.setValue(value);
        } else {
            this.$modal.find('.modal-body textarea').val(value);
        }
    };

    LiveEditorModal.prototype.getValue = function () {
        // TO DO: tests
        if (this.aceEditor) {
            return this.aceEditor.aceEditor.getValue();
        } else {
            return this.$modal.find('.modal-body textarea').val();
        }
    };

    window.LiveEditorModal = LiveEditorModal;
})(window, document, $);