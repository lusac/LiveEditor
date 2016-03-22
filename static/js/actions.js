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

    LiveEditorActions.prototype._replaceWithUndo = function () {
        var parentPath = this.liveEditorBase.getElementPath(this.liveEditorBase.$currentSelected.parent()),
            oldHtml = this.liveEditorBase.$currentSelected.parent()[0].outerHTML,
            strUndo = "self.$editorIframe.contents().find('" + parentPath + "').replaceWith('" + oldHtml.replace(new RegExp("'", 'g'), '&#39;') + "');";
        this.liveEditorBase.addToUndoList(strUndo);
    };

    LiveEditorActions.prototype.getIframeCurrentElement = function () {
        return this.liveEditorBase.$editorIframe.contents().find(this.liveEditorBase.currentSelected);
    };

    LiveEditorActions.prototype.currentSelectedRemove = function () {
        var str = '$("' + this.liveEditorBase.currentSelected + '").remove();';

        this._replaceWithUndo();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        var str = '$("' + this.liveEditorBase.currentSelected + '").attr("easyab-track-' + e + '", 1);';
        this.liveEditorBase.addToScriptList(str);
    };

    LiveEditorActions.prototype.currentSelectedEditHtml = function () {
        var html = this.liveEditorBase.editHtmlModal.getValue(),
            str = "$('" + this.liveEditorBase.currentSelected + "').replaceWith('" + html + "');";

        this._replaceWithUndo();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var undoText = this.liveEditorBase.$currentSelected.text(),
            strUndo = "self.$editorIframe.contents().find" + this._changeText(this.liveEditorBase.currentSelected, undoText),
            scriptText = this.liveEditorBase.editTextModal.getValue(),
            strScript = '$' + this._changeText(this.liveEditorBase.currentSelected, scriptText);

        this.liveEditorBase.addToScriptList(strScript);
        this.liveEditorBase.addToUndoList(strUndo);
        this.liveEditorBase.applyJs(strScript);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        var undoClass = this.liveEditorBase.$currentSelected.attr('class') || '',
            strUndo = "self.$editorIframe.contents().find" + this._changeClass(this.liveEditorBase.currentSelected, undoClass),
            scriptClasses = this.liveEditorBase.$editClassesModal.find('.modal-body input').val(),
            str = '$' + this._changeClass(this.liveEditorBase.currentSelected, scriptClasses);

        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.addToUndoList(strUndo);
        this.liveEditorBase.applyJs(str);
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);