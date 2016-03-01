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
        this.create();
    };

    LiveEditorModal.prototype.create = function () {
        var $modal = $('<div class="modal fade" tabindex="-1" role="dialog">'),
            $div2 = $('<div class="modal-dialog" role="document">'),
            $div3 = $('<div class="modal-content">'),
            $header = '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
                            '<h4 class="modal-title">' + this.title + '</h4>' +
                        '</div>',
            $field = $('<' + this.field + ' class="form-control">'),
            $section = '<div class="modal-body">' +
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
    };

    window.LiveEditorModal = LiveEditorModal;
})(window, document, $);