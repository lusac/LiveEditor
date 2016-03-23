/* global $ */

(function (window, document, $) {
    // 'use strict';

    var LiveEditorActions = function LiveEditorActions (liveEditorBase) {
        this.init(liveEditorBase);
    };

    LiveEditorActions.prototype.init = function (liveEditorBase) {
        // rename liveEditorBase to liveEditor
        this.liveEditorBase = liveEditorBase;
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

        this.liveEditorBase.undoListUpdate();
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

        this.liveEditorBase.undoListUpdate();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var scriptText = this.liveEditorBase.editTextModal.getValue(),
            strScript = '$' + this._changeText(this.liveEditorBase.currentSelected, scriptText);

        this.liveEditorBase.undoListUpdate();
        this.liveEditorBase.addToScriptList(strScript);
        this.liveEditorBase.applyJs(strScript);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        var scriptClasses = this.liveEditorBase.$editClassesModal.find('.modal-body input').val(),
            str = '$' + this._changeClass(this.liveEditorBase.currentSelected, scriptClasses);

        this.liveEditorBase.undoListUpdate();
        this.liveEditorBase.addToScriptList(str);
        this.liveEditorBase.applyJs(str);
    };

    LiveEditorActions.prototype.currentOptionRename = function () {
        // TODO - test js
        var newName = $('#rename-modal').find('.modal-body input').val();

        if (newName.length < 1) return 0;

        var newNameFormated = this.liveEditorBase.tabs.formatName(newName),
            currentName = this.liveEditorBase.tabs.current().text(),
            currentNameFormated = this.liveEditorBase.tabs.formatName(currentName),
            currentExperiment = this.liveEditorBase.experiments[currentNameFormated];

        if (this.liveEditorBase.experiments[newName] == undefined) {
            this.liveEditorBase.experiments[newNameFormated] = currentExperiment;

            var index = this.liveEditorBase.tabsList.indexOf(currentName);
            this.liveEditorBase.tabsList[index] = newName;

            var $currentTab = this.liveEditorBase.tabs.current();
            $currentTab.attr('data-name', newNameFormated)
                        .text(newName)
                        .append('<span class="caret"></span>');

            delete this.liveEditorBase.experiments[currentNameFormated];
        }
    };

    LiveEditorActions.prototype.currentOptionDelete = function () {
        // TODO - test js
        var currentName = this.liveEditorBase.tabs.current().text(),
            currentNameFormated = this.liveEditorBase.tabs.formatName(currentName),
            index = this.liveEditorBase.tabsList.indexOf(currentName);

        this.liveEditorBase.tabsList.splice(index, 1);
        this.liveEditorBase.tabs.current().parent().remove();
        this.liveEditorBase.tabs.$tabs.find('>li:first>a').click();

        delete this.liveEditorBase.experiments[currentNameFormated];
    };

    LiveEditorActions.prototype.currentOptionDuplicate = function () {
        // TODO - test js
        var oldExperiment = this.liveEditorBase.currentExperiment();

        this.liveEditorBase.addNewOption();

        var currentName = this.liveEditorBase.tabs.current().text(),
            currentNameFormated = this.liveEditorBase.tabs.formatName(currentName);
        
        this.liveEditorBase.experiments[currentNameFormated] = oldExperiment;

        this.liveEditorBase.changeTab();
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);