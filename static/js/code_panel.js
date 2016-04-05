/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorCodePanel = function LiveEditorCodePanel (params) {
        this.init(params);
    };

    LiveEditorCodePanel.prototype.init = function (params) {
        this.editorName = params.editorName;
        this.editorId = 'code-panel-ace-editor-' + this.editorName;
        this.appendTo = params.appendTo || null;
        this.create();
        this.bindEvents();
     };

    LiveEditorCodePanel.prototype.create = function () {
        var $panel = $('<div id="code-panel" class="code-panel collapse">'),
            $html = $('<div class="well">' +
                        '<div class="row">' +
                            '<div class="col-xs-9">' +
                                '<div id="' + this.editorId + '" class="ace-editor-field"></div>' +
                            '</div>' +
                            '<div class="col-xs-3 code-panel-buttons-grid">' +
                                '<div class="code-panel-buttons">' +
                                    '<button class="btn btn-default" type="button" data-toggle="collapse" data-target="#code-panel">cancel</button>' +
                                    '<button class="btn btn-danger" type="button">save code</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');

        this.$saveButton = $html.find('button:last');
        this.$cancelButton = $html.find('button:first');

        $panel.append($html);

        if (this.appendTo) {
            this.appendTo.append($panel);
        } else {
            $('body').append($panel);
        }

        this.aceEditor = new LiveEditorAceEditor({
            id: this.editorId,
            language: 'javascript'
        });
    };

    LiveEditorCodePanel.prototype.bindEvents = function () {
        // TODO - test js - refator
        $('#code-panel').on('show.bs.collapse', function() {
            $('.code-panel-button').addClass('active');
        });

        $('#code-panel').on('hide.bs.collapse', function() {
            $('.code-panel-button').removeClass('active');
        });
    };

    window.LiveEditorCodePanel = LiveEditorCodePanel;
})(window, document, $);