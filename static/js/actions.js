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
        return '("' + selector + '").text("' + text + '");'
    };

    LiveEditorActions.prototype._changeClass = function (selector, classes) {
        return '("' + selector + '").attr("class", "' + classes + '");'
    };

    LiveEditorActions.prototype._replaceWithUndo = function () {
        // undo script
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

        this.liveEditorBase.addToScriptList(str);
        this._replaceWithUndo();
        this.getIframeCurrentElement().remove();
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        var str = '$("' + this.liveEditorBase.currentSelected + '").attr("easyab-track-' + e + '", 1);';
        this.liveEditorBase.addToScriptGoal(str);
    };

    LiveEditorActions.prototype.currentSelectedEditHtml = function () {
        var html = this.liveEditorBase.$editHtmlModal.find('.modal-body textarea').val(),
            str = '$("' + this.liveEditorBase.currentSelected + '").replaceWith("' + html + '");';

        this.liveEditorBase.addToScriptList(str);
        this._replaceWithUndo();
        this.getIframeCurrentElement().replaceWith(html);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var undoText = this.liveEditorBase.$currentSelected.text(),
            strUndo = "self.$editorIframe.contents().find" + this._changeText(this.liveEditorBase.currentSelected, undoText),
            scriptText = this.liveEditorBase.$editTextModal.find('.modal-body textarea').val(),
            strScript = '$' + this._changeText(this.liveEditorBase.currentSelected, scriptText);
        
        this.liveEditorBase.addToScriptList(strScript);
        this.liveEditorBase.addToUndoList(strUndo);
        this.getIframeCurrentElement().text(scriptText);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        // undo script
        var undoClass = this.liveEditorBase.$currentSelected.attr('class') || '',
            strUndo = "self.$editorIframe.contents().find" + this._changeClass(this.liveEditorBase.currentSelected, undoClass),
            scriptClasses = this.liveEditorBase.$editClassesModal.find('.modal-body input').val(),
            str = '$' + this._changeClass(this.liveEditorBase.currentSelected, scriptClasses);
        
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.addToUndoList(strUndo);
        this.getIframeCurrentElement().attr('class', scriptClasses);
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);