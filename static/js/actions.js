/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorActions = function LiveEditorActions (liveEditorbase) {
        this.init(liveEditorbase);
    };

    LiveEditorActions.prototype.init = function (liveEditorbase) {
        this.liveEditorBase = liveEditorbase;
    };

    LiveEditorActions.prototype._changeText = function (selector, text) {
        return '("' + selector + '").text("' + text + '");';
    };

    LiveEditorActions.prototype._changeClass = function (selector, classes) {
        return '("' + selector + '").attr("class", "' + classes + '");';
    };

    LiveEditorActions.prototype.getIframeCurrentElement = function () {
        return this.liveEditorBase.$editorIframe.contents().find(this.liveEditorBase.currentSelected);
    };

    LiveEditorActions.prototype.currentSelectedRemove = function () {
        var str = '$("' + this.liveEditorBase.currentSelected + '").remove();';

        this.liveEditorBase.addToUndoList();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        // TO DO - undo
        var str = '$("' + this.liveEditorBase.currentSelected + '").attr("easyab-track-' + e + '", 1);';
        this.liveEditorBase.addToScriptList(str);
    };

    LiveEditorActions.prototype.currentSelectedEditHtml = function () {
        var html = this.liveEditorBase.editHtmlModal.getValue(),
            str = "$('" + this.liveEditorBase.currentSelected + "').replaceWith('" + html + "');";

        this.liveEditorBase.addToUndoList();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var scriptText = this.liveEditorBase.editTextModal.getValue(),
            strScript = '$' + this._changeText(this.liveEditorBase.currentSelected, scriptText);

        this.liveEditorBase.addToUndoList();
        this.liveEditorBase.addToScriptList(strScript);
        this.liveEditorBase.applyJs(strScript);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        var scriptClasses = this.liveEditorBase.$editClassesModal.find('.modal-body input').val(),
            str = '$' + this._changeClass(this.liveEditorBase.currentSelected, scriptClasses);

        this.liveEditorBase.addToUndoList();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);