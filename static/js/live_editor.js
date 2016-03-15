/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditor = function LiveEditor (params) {
        // TO DO: tests
        console.log('Live Editor Init...');
        this.init(params);
        console.log('Live Editor Done...');
    };

    LiveEditor.prototype.init = function (params) {
        var self = this;

        this.liveEditors = [];
        this.url = params.url;
        this.$editor = $(params.editor);
        this.device = params.device;

        this.initLiveEditors(params);
        // this.getUrlContent();
    };

    // LiveEditor.prototype.getUrlContent = function () {
    //     var self = this;

    //     $.get(this.url, function(data) {
    //         self.content = data;
    //         self.initLiveEditors();
    //     });
    // };

    LiveEditorBase.prototype.buildIframe = function (params) {
        this.$editorIframe = $('<iframe id="live-editor-iframe">');
        this.$spinnerContainer = $('<span class="spinner-container"><span class="spinner-content"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...</span></span>');

        this.$editorIframe.attr({
            'src': this.url,
            'width': '100%',
            'height': '100%',
            'frameborder': '0',
            'allowfullscreen': ''
        });

        this.$editor.append(this.$spinnerContainer, this.$editorIframe);
        this.$editor.addClass('live-editor');
    };

    LiveEditor.prototype.initLiveEditors = function (params) {
        var jsList = params.js || [];
        for (var i=0; i<=this.editors.length-1; i++) {
            this.liveEditors.push(
                new LiveEditorBase({
                    js: jsList[i]
                })
            );
            $(this.editors[i]).parent().addClass('tab-pane__' + this.device);
        }
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);