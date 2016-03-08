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
        this.hasAceEditor = false;

        if (params.data.hasAceEditor) {
            // TO DO: tests
            this.hasAceEditor = true;
            this.aceEditorId = this.getID();
        }

        this.create();
    };

    LiveEditorModal.prototype.create = function () {
        if (this.hasAceEditor) {
            // TO DO: tests
            this.field = 'div';
        }

        this.$modal = $('<div class="modal fade" tabindex="-1" role="dialog">');

        var $div2 = $('<div class="modal-dialog" role="document">'),
            $div3 = $('<div class="modal-content">'),
            $header = '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
                            '<h4 class="modal-title">' + this.title + '</h4>' +
                        '</div>',
            $field = $('<' + this.field + ' class="form-control" id="' + this.aceEditorId + '">');

        if (this.hasAceEditor) {
            // TO DO: tests
            $field.addClass('ace-editor-field');
        }

        var $section = '<div class="modal-body">' +
                            $field[0].outerHTML +
                        '</div>',
            $footer = '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                            '<button type="submit" class="btn btn-primary save-btn">Save</button>' +
                      '</div>';

        this.$modal.attr('id', this.name)

        this.$modal.append(
            $div2.append(
                $div3.append($header, $section, $footer)
            )
        );

        $('body').append(this.$modal);

        if (this.hasAceEditor) {
            // TO DO: tests
            this.aceEditor = new LiveEditorAceEditor({
                id: this.aceEditorId,
                language: 'html'
            });
        }
    };

    LiveEditorModal.prototype.getID  =function () {
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