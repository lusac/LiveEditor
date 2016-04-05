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
        this.$modeSelect = $('<select class="form-control">')
                                .append('<option value="edit">Edit mode</option>')
                                .append('<option value="view">View mode</option>');
        this.$buttonAddOption = $('<button type="button" class="btn btn-default add-option">+ add option</button>');
        this.$undoButton = $('<button type="button" class="btn btn-default btn-undo">Undo</button>');
        this.$codePanelButton = $('<button class="btn btn-primary btn-sm code-panel-button" type="button" data-toggle="collapse" data-target="#code-panel">').text('< edit code >');
        this.$goalButton = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-flag"></span></button>');
        this.$toolbar = $('<ul class="toolbar">');

        this.$toolbar.append($('<li>').append(this.$buttonAddOption));
        this.$toolbar.append($('<li>').append(this.$modeSelect));
        this.$toolbar.append($('<li>').append(this.$undoButton));
        this.$toolbar.append($('<li>').append(this.$codePanelButton));
        this.$toolbar.append($('<li>').append(this.$goalButton));

        this.$appendTo.append(this.$toolbar);
    };

    window.LiveEditorToolbar = LiveEditorToolbar;
})(window, document, $);