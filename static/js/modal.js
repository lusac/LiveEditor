/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorModal = function LiveEditorModal (params) {
        this.init(params);
    };

    LiveEditorModal.prototype.init = function (params) {
        this.editor = params.editor;
        this.aceEditorId = this.getID();
        this.name = params.data.name;
        this.title = params.data.title;
        this.field = params.data.field;
        this.create();
    };

    LiveEditorModal.prototype.create = function () {
        if (this.field == 'textarea') {
            this.field = 'div';
        }

        var $modal = $('<div class="modal fade" tabindex="-1" role="dialog">'),
            $div2 = $('<div class="modal-dialog" role="document">'),
            $div3 = $('<div class="modal-content">'),
            $header = '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
                            '<h4 class="modal-title">' + this.title + '</h4>' +
                        '</div>',
            $field = $('<' + this.field + ' class="form-control" id="' + this.aceEditorId + '">');

        if (this.field === 'div') {
            $field.addClass('ace-editor-field');
        }

        var $section = '<div class="modal-body">' +
                            $field[0].outerHTML +
                        '</div>',
            $footer = '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                            '<button type="submit" class="btn btn-primary save-btn">Save</button>' +
                      '</div>';

        $modal.attr('id', this.name)

        $modal.append(
            $div2.append(
                $div3.append($header, $section, $footer)
            )
        );

        $('body').append($modal);

        if (this.field === 'div') {
            this.aceEditor = new LiveEditorAceEditor({
                id: this.aceEditorId,
                language: 'html'
            });
        }
    };

    LiveEditorModal.prototype.getID  =function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };

    LiveEditorModal.prototype.setValue = function (value) {
        if (this.aceEditor) {
            this.aceEditor.aceEditor.setValue(value, -1);
        }
    };

    LiveEditorModal.prototype.getValue = function () {
        if (this.aceEditor) {
            return this.aceEditor.aceEditor.getValue();
        }
    };

    window.LiveEditorModal = LiveEditorModal;
})(window, document, $);