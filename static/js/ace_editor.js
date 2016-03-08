/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorAceEditor = function LiveEditorAceEditor (params) {
        this.init(params);
    };

    LiveEditorAceEditor.prototype.init = function (params) {
        this.id = params.id;
        this.language = params.language;
        this.buildEditor();
    };

    LiveEditorAceEditor.prototype.buildEditor = function () {
        this.aceEditor = ace.edit(this.id);
        this.aceEditor.$blockScrolling = Infinity;
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.setOption('wrap', 'free');
        this.aceEditor.setTheme('ace/theme/chrome');
        this.aceEditor.getSession().setMode('ace/mode/' + this.language);
    };

    window.LiveEditorAceEditor = LiveEditorAceEditor;
})(window, document, $);