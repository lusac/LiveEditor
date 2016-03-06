/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorCodePanel = function LiveEditorCodePanel (params) {
        this.init(params);
    };

    LiveEditorCodePanel.prototype.init = function (params) {
        this.editorName = params.editorName;
        this.editorId = 'code-panel-ace-editor-' + this.editorName
        this.appendTo = params.appendTo || null;
        this.create();
     };

    LiveEditorCodePanel.prototype.create = function () {
        var $button = $('<button class="btn btn-primary btn-sm code-panel-button" type="button" data-toggle="collapse" data-target="#code-panel[' + this.editorName + ']" ' + this.editorName + '="1">').text('< edit code >'),
            $panel = $('<div id="code-panel" class="code-panel collapse" ' + this.editorName + '="1">'),
            html = '<div class="well">' +
                        '<div class="row">' +
                            '<div class="col-xs-9">' +
                                '<div id="' + this.editorId + '" class="ace-editor-field"></div>' +
                            '</div>' +
                            '<div class="col-xs-3 code-panel-buttons-grid">' +
                                '<div class="code-panel-buttons">' +
                                    '<button class="btn btn-default" type="button" data-toggle="collapse" data-target="#code-panel[' + this.editorName + ']">cancel</button>' +
                                    '<button class="btn btn-danger" type="button" data-toggle="collapse" data-target="#code-panel[' + this.editorName + ']">save code</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

        $panel.append(html);

        if (this.appendTo) {
            this.appendTo.append($button, $panel);
        } else {
            $('body').append($button, $panel);
        }

        this.aceEditor = new LiveEditorAceEditor({
            id: this.editorId,
            language: 'javascript'
        });
    };

    window.LiveEditorCodePanel = LiveEditorCodePanel;
})(window, document, $);