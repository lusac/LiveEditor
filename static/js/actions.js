/* global $ */

(function (window, document, $) {
    // 'use strict';

    var LiveEditorActions = function LiveEditorActions (liveEditor) {
        this.init(liveEditor);
    };

    LiveEditorActions.prototype.init = function (liveEditor) {
        this.liveEditor = liveEditor;
        this.$currentSelected = this.$draggable = null;
        this.bindEvents();
    };

    LiveEditorActions.prototype._changeText = function (selector, text) {
        return '("' + selector + '").text("' + text + '");';
    };

    LiveEditorActions.prototype._changeClass = function (selector, classes) {
        return '("' + selector + '").attr("class", "' + classes + '");';
    };

    LiveEditorActions.prototype.stringFormat = function(str) {
        // TODO - test js
        return str.replace(new RegExp('\'', 'g'), '&rsquo;').replace(new RegExp('\t|\n', 'g'), '');
    }

    LiveEditorActions.prototype.saveChanges = function (str) {
        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(str);
        this.liveEditor.applyJs(str);
    };

    LiveEditorActions.prototype.bindEvents = function () {
        // TODO - test js
        var self = this;

        this.liveEditor.$editorIframe.contents().on('mousemove', function(e) {
            console.log('moving...');
            if (self.$draggable && self.isDragging) {
                self.$draggable.offset({
                    top: e.pageY - self.$draggable.outerHeight() / 2,
                    left: e.pageX - self.$draggable.outerWidth() / 2
                });
                self.$currentSelected.offset({
                    top: e.pageY - self.$draggable.outerHeight() / 2,
                    left: e.pageX - self.$draggable.outerWidth() / 2
                });
            }
        });

        this.liveEditor.$editorIframe.contents().on('mousedown', function (e) {
            if (self.$draggable) {
                self.isDragging = true;
            }
        });

        this.liveEditor.$editorIframe.contents().on('mouseup', function (e) {
            if (self.$draggable && self.isDragging) {
                self.$draggable.attr('style', '');
                self.isDragging = false;
                self.$currentSelected = self.$draggable = null;
                self.liveEditor.domOutline.start();
            }
        });
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

    LiveEditorActions.prototype.currentSelectedEditText = function () {
        var scriptText = this.stringFormat(this.liveEditor.editTextModal.getValue()),
            strScript = '$' + this._changeText(this.liveEditor.currentSelected, scriptText);

        this.liveEditor.undoListUpdate();
        this.liveEditor.addToScriptList(strScript);
        this.liveEditor.applyJs(strScript);
    };

    LiveEditorActions.prototype.currentSelectedAddEvent = function (e) {
        var str = '$("' + this.liveEditor.currentSelected + '").attr("easyab-track-' + e + '", 1);';
        this.saveChanges(str);
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
        var oldExperiment = this.liveEditor.currentExperiment();

        this.liveEditor.addNewOption();

        var currentName = this.liveEditor.tabs.current().text(),
            currentNameFormated = this.liveEditor.tabs.slugify(currentName);

        this.liveEditor.experiments[currentNameFormated] = oldExperiment;

        this.liveEditor.changeTab();
    };

    LiveEditorActions.prototype.undo = function () {
        var object = this.liveEditor.currentExperiment().undoList.pop();
        this.liveEditor.currentExperiment().scriptList.pop();
        this.liveEditor.updateBody(object);
        this.liveEditor.codePanelUpdate();
    };

    LiveEditorActions.prototype.saveCodePanel = function () {
        var oldScript = this.liveEditor.currentExperimentScriptList(),
            newScript = this.liveEditor.codePanel.aceEditor.aceEditor.getValue(),
            str = newScript.slice(oldScript.length, newScript.length);

        this.saveChanges(str);
    };

    LiveEditorActions.prototype.dragAndDrop = function () {
        // TODO - test js
        console.log('drag!');
        this.$currentSelected = this.liveEditor.$currentSelected;
        this.liveEditor.unselectElements();
        this.liveEditor.domOutline.draw(this.$currentSelected[0]);
        this.liveEditor.domOutline.pause();
        this.$draggable = this.liveEditor.$editorIframe.contents().find('.DomOutline_box');
        this.$draggable.css({
            'cursor': 'move',
            'pointer-events': 'inherit'
        });
    };

    window.LiveEditorActions = LiveEditorActions;
})(window, document, $);