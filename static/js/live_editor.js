/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditor = function LiveEditor (params) {
        console.log('Live Editor Init...');
        this.init(params);
        console.log('Live Editor Done...');
    };

    LiveEditor.prototype.init = function (params) {
        var self = this;

        this.liveEditors = [];

        this.getUrlContent(params);
    };

    LiveEditor.prototype.getUrlContent = function (params) {
        var self = this;

        $.get(params.url, function(data) {
            self.content = data;
            self.initLiveEditors(params);
        });
    };

    LiveEditor.prototype.initLiveEditors = function (params) {
        for (var i=0; i<=params.editors.length-1; i++) {
            this.liveEditors.push(
                new LiveEditorBase({
                    editor: params.editors[i],
                    content: this.content
                })
            );
        }
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);