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
        this.editors = params.editors;

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

    LiveEditor.prototype.initLiveEditors = function (params) {
        var jsList = params.js || [];
        for (var i=0; i<=this.editors.length-1; i++) {
            this.liveEditors.push(
                new LiveEditorBase({
                    editor: this.editors[i],
                    url: this.url,
                    js: jsList[i]
                })
            );
        }
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);