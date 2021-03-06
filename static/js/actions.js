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

    LiveEditorActions.prototype._addStyle = function (selector, styles) {
        return '("' + selector + '").attr("style", "' + styles + '");';
    };

    LiveEditorActions.prototype.stringFormat = function(str) {
        return str.replace(new RegExp('\'', 'g'), '&rsquo;').replace(new RegExp('\t|\n', 'g'), '');
    }

    LiveEditorActions.prototype.saveChanges = function (str) {
        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(str);
        this.liveEditor.applyJs(str);
    };

    LiveEditorActions.prototype.currentSelectedRemove = function () {
        var str = '$("' + this.liveEditor.currentSelected + '").remove();';
        this.saveChanges(str);
    };

    LiveEditorActions.prototype.currentSelectedEditHtml = function () {
        var html = this.stringFormat(this.liveEditor.editHtmlModal.getValue()),
            str = '$(\'' + this.liveEditor.currentSelected + '\').replaceWith(\'' + html + '\');';
        this.saveChanges(str);
    };

    LiveEditorActions.prototype.currentSelectedEditClasses = function () {
        var scriptClasses = this.liveEditor.$editClassesModal.find('.modal-body input').val(),
            str = '$' + this._changeClass(this.liveEditor.currentSelected, scriptClasses);
        this.saveChanges(str);
    };

    LiveEditorActions.prototype.currentSelectedEditStyle = function () {
        var $inputs = this.liveEditor.$editStyleModal.find('.modal-body input[type=text]'),
            styles = '';

        $inputs.each(function() {
            var val = $(this).val();
            if (val) {
                styles += val + ';';
            }
        });

        var str = '$' + this._addStyle(this.liveEditor.currentSelected, styles);

        this.saveChanges(str);
    };

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var scriptText = this.stringFormat(this.liveEditor.editTextModal.getValue()),
            strScript = '$' + this._changeText(this.liveEditor.currentSelected, scriptText);

        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(strScript);
        this.liveEditor.applyJs(strScript);
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        // TODO - test js - trackValue
        var str = '$("' + this.liveEditor.currentSelected + '").attr("easyab-track-' + e + '", "' + this.liveEditor.trackValue + '");';
        this.saveGoal(str);
        this.saveChanges(str);
    };

    LiveEditorActions.prototype.saveGoal = function (goal) {
        var newScript = goal.replace(new RegExp('\t|\n', 'g'), ''),
            goalListLength = this.liveEditor.currentExperiment().goalList.length,
            oldScript = this.liveEditor.currentExperiment().goalList[goalListLength - 1]
            finalScript = oldScript === undefined ? newScript : oldScript + newScript;

        this.liveEditor.currentExperiment().goalList.push(finalScript);
        this.liveEditor.updateExperimentState();
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
            this.liveEditor.experiments[newNameFormated].title = newName;

            var index = this.liveEditor.tabsList.indexOf(currentName);
            this.liveEditor.tabsList[index] = newName;

            var $currentTab = this.liveEditor.tabs.current();
            $currentTab.attr('data-name', newNameFormated)
                        .text(newName)
                        .append('<span class="caret"></span>');

            delete this.liveEditor.experiments[currentNameFormated];
            this.liveEditor.tabs.current().trigger({
              type:"renamed-option",
              name:currentName
            });
        }
    };

    LiveEditorActions.prototype.currentOptionDelete = function () {
        // TO-DO: test.js
        this.liveEditor.tabs.current().trigger('deleted-option');
        var currentName = this.liveEditor.tabs.current().text(),
            currentNameFormated = this.liveEditor.tabs.slugify(currentName),
            index = this.liveEditor.tabsList.indexOf(currentName);

        this.liveEditor.tabsList.splice(index, 1);
        this.liveEditor.tabs.current().parent().remove();
        this.liveEditor.tabs.$tabs.find('>li:first>a').click();

        delete this.liveEditor.experiments[currentNameFormated];
    };

    LiveEditorActions.prototype.currentOptionDuplicate = function () {
        var oldExperiment = this.liveEditor.currentExperiment();

        this.liveEditor.addNewOption();

        var currentName = this.liveEditor.tabs.current().text(),
            currentNameFormated = this.liveEditor.tabs.slugify(currentName);

        this.liveEditor.experiments[currentNameFormated] = oldExperiment;

        this.liveEditor.changeTab();
        this.liveEditor.tabs.applyTooltip()
    };

    LiveEditorActions.prototype.undo = function () {
        if (this.liveEditor.currentExperiment().undoList.length) {
            var object = this.liveEditor.currentExperiment().undoList.pop();
            this.liveEditor.currentExperiment().scriptList.pop();
            this.liveEditor.updateBody(object);
            this.liveEditor.codePanelUpdate();
        }
    };

    LiveEditorActions.prototype.saveCodePanel = function () {
        var oldScript = this.liveEditor.currentExperimentScriptList(),
            newScript = this.liveEditor.codePanel.aceEditor.aceEditor.getValue(),
            str = newScript.slice(oldScript.length, newScript.length);

        this.saveChanges(str);
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);
