/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorActions = function LiveEditorActions (liveEditorbase) {
    	this.init(liveEditorbase);
    };

    LiveEditorActions.prototype.init = function (liveEditorbase) {
    	this.liveEditorBase = liveEditorbase;
    };

    LiveEditorActions.prototype.currentSelectedRemove = function () {
        // remove script
        var str = '$("' + this.liveEditorBase.currentSelected + '").remove();';
        this.liveEditorBase.addToScriptList(str);

        // undo script
        var parentPath = this.liveEditorBase.getElementPath(this.liveEditorBase.$currentSelected.parent()),
            oldHtml = this.liveEditorBase.$currentSelected.parent()[0].outerHTML,
            strUndo = "self.$editorIframe.contents().find('" + parentPath + "').replaceWith('" + oldHtml.replace(new RegExp("'", 'g'), '&#39;') + "');";

        this.liveEditorBase.undoList.push(strUndo);

        this.liveEditorBase.$editorIframe.contents().find(this.liveEditorBase.currentSelected).remove();
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        var str = '$("' + this.liveEditorBase.currentSelected + '").attr("easyab-track-' + e + '", 1);';

        this.liveEditorBase.addToScriptGoal(str);
    };

    LiveEditorActions.prototype.currentSelectedEditHtml = function () {
        // remove script
        // to do: test
        var html = this.liveEditorBase.$editHtmlModal.find('.modal-body textarea').val(),
            str = '$("' + this.liveEditorBase.currentSelected + '").replaceWith("' + html + '");';
        this.liveEditorBase.addToScriptList(str);

        // undo script
        // to do: test
        var parentPath = this.liveEditorBase.getElementPath(this.liveEditorBase.$currentSelected.parent()),
            oldHtml = this.liveEditorBase.$currentSelected.parent()[0].outerHTML,
            strUndo = "self.$editorIframe.contents().find('" + parentPath + "').replaceWith('" + oldHtml.replace(new RegExp("'", 'g'), '&#39;') + "');";
        this.liveEditorBase.undoList.push(strUndo);

        this.liveEditorBase.$editorIframe.contents().find(this.liveEditorBase.currentSelected).replaceWith(html);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        // undo script
        // to do: test
        var oldText = this.liveEditorBase.$currentSelected.text(),
            text = this.liveEditorBase.$editTextModal.find('.modal-body textarea').val(),
            str = '$("' + this.liveEditorBase.currentSelected + '").text("' + text + '");';
        this.liveEditorBase.addToScriptList(str);

        // undo script
        // to do: test
        var strUndo = "self.$editorIframe.contents().find('" + this.liveEditorBase.currentSelected + "').text('" + oldText + "');";
        this.liveEditorBase.undoList.push(strUndo);

        this.liveEditorBase.$editorIframe.contents().find(this.liveEditorBase.currentSelected).text(text);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        // undo script
        // to do: test
        var oldClass = this.liveEditorBase.$currentSelected.attr('class') || '',
            classes = this.liveEditorBase.$editClassesModal.find('.modal-body input').val(),
            str = '$("' + this.liveEditorBase.currentSelected + '").attr("class", "' + classes + '");';
        this.liveEditorBase.addToScriptList(str);

        // undo script
        // to do: test
        var strUndo = "self.$editorIframe.contents().find('" + this.liveEditorBase.currentSelected + "').attr('class', '" + oldClass + "');";
        this.liveEditorBase.undoList.push(strUndo);

        this.liveEditorBase.$editorIframe.contents().find(this.liveEditorBase.currentSelected).attr('class', classes);
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);