/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorToolbar = function LiveEditorToolbar (params) {
        this.init(params);
    };

    LiveEditorToolbar.prototype.init = function (params) {
        this.$appendTo = params.$appendTo;
        this.create();
    };

    LiveEditorToolbar.prototype.create = function () {
        // TODO - test js - buttons title
        this.$modeSelect = $('<select class="form-control">')
                                .append('<option value="edit">Edit mode</option>')
                                .append('<option value="view">View mode</option>');

        this.$undoButton = $('<button type="button" class="btn btn-default btn-sm btn-undo" title="undo"><span class="glyphicon glyphicon-share-alt"></span></button>');
        this.$codePanelButton = $('<button class="btn btn-default btn-sm code-panel-button" type="button" data-toggle="collapse" data-target="#code-panel" title="console"><span class="glyphicon glyphicon-console"></span></button>');
        this.$goalButton = $('<button class="btn btn-default btn-sm" type="button" title="mark goals"><span class="glyphicon glyphicon-flag"></span></button>');
        this.$toolbar = $('<ul class="live-editor-toolbar">');

        this.$toolbar.append($('<li>').append(this.$undoButton));
        this.$toolbar.append($('<li>').append(this.$goalButton));
        this.$toolbar.append($('<li>').append(this.$codePanelButton));
        this.$toolbar.append($('<li>').append(this.$modeSelect));

        this.$appendTo.append(this.$toolbar);
    };

    window.LiveEditorToolbar = LiveEditorToolbar;
})(window, document, $);