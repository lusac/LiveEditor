/* global $ */

(function (window, document, $) {
    // 'use strict';

    var LiveEditorActions = function LiveEditorActions (liveEditor) {
        this.init(liveEditor);
    };

    LiveEditorActions.prototype.init = function (liveEditor) {
        this.liveEditor = liveEditor;
    };

    LiveEditorActions.prototype._changeText = function (selector, text) {
        return '("' + selector + '").text("' + text + '");';
    };

    LiveEditorActions.prototype._changeClass = function (selector, classes) {
        return '("' + selector + '").attr("class", "' + classes + '");';
    };

    LiveEditorActions.prototype.getIframeCurrentElement = function () {
        return this.liveEditor.$editorIframe.contents().find(this.liveEditor.currentSelected);
    };

    LiveEditorActions.prototype.currentSelectedRemove = function () {
        var str = '$("' + this.liveEditor.currentSelected + '").remove();';

        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(str);
        this.liveEditor.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        var str = '$("' + this.liveEditor.currentSelected + '").attr("easyab-track-' + e + '", 1);';
        this.liveEditor.addToScriptList(str);
    };

    LiveEditorActions.prototype.currentSelectedEditHtml = function () {
        var html = this.liveEditor.editHtmlModal.getValue(),
            str = "$('" + this.liveEditor.currentSelected + "').replaceWith('" + html + "');";

        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(str);
        this.liveEditor.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var scriptText = this.liveEditor.editTextModal.getValue(),
            strScript = '$' + this._changeText(this.liveEditor.currentSelected, scriptText);

        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(strScript);
        this.liveEditor.applyJs(strScript);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        var scriptClasses = this.liveEditor.$editClassesModal.find('.modal-body input').val(),
            str = '$' + this._changeClass(this.liveEditor.currentSelected, scriptClasses);

        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(str);
        this.liveEditor.applyJs(str);
    };

    LiveEditorActions.prototype.currentOptionRename = function () {
        var newName = $('#rename-modal').find('.modal-body input').val();

        if (newName.length < 1) return 0;

        var newNameFormated = this.liveEditor.tabs.slugify(newName),
            currentName = this.liveEditor.tabs.current().text(),
            currentNameFormated = this.liveEditor.tabs.slugify(currentName),
            currentExperiment = this.liveEditor.experiments[currentNameFormated];

        if (this.liveEditor.experiments[newName] === undefined) {
            this.liveEditor.experiments[newNameFormated] = currentExperiment;

            var index = this.liveEditor.tabsList.indexOf(currentName);
            this.liveEditor.tabsList[index] = newName;

            var $currentTab = this.liveEditor.tabs.current();
            $currentTab.attr('data-name', newNameFormated)
                        .text(newName)
                        .append('<span class="caret"></span>');

            delete this.liveEditor.experiments[currentNameFormated];
        }
    };

    LiveEditorActions.prototype.currentOptionDelete = function () {
        var currentName = this.liveEditor.tabs.current().text(),
            currentNameFormated = this.liveEditor.tabs.slugify(currentName),
            index = this.liveEditor.tabsList.indexOf(currentName);

        this.liveEditor.tabsList.splice(index, 1);
        this.liveEditor.tabs.current().parent().remove();
        this.liveEditor.tabs.$tabs.find('>li:first>a').click();

        delete this.liveEditor.experiments[currentNameFormated];
    };

    LiveEditorActions.prototype.currentOptionDuplicate = function () {
        // TODO - test js
        var oldExperiment = this.liveEditor.currentExperiment();

        this.liveEditor.addNewOption();

        var currentName = this.liveEditor.tabs.current().text(),
            currentNameFormated = this.liveEditor.tabs.slugify(currentName);

        this.liveEditor.experiments[currentNameFormated] = oldExperiment;

        this.liveEditor.changeTab();
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);