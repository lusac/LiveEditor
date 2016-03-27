/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditor = function LiveEditor (params) {
        console.log('Live Editor Init...');
        this.init(params);
        console.log('Live Editor Done...');
    };

    LiveEditor.prototype.init = function (params) {
        var self = this;

        this.initVars(params);
        this.buildIframe(params);
        this.buildTabs();
        this.buildModals(params);
        this.buildPanel(params);
        this.buildToolbar();
        this.initActions();

        this.$editorIframe.on('load', function() {
            self.domOutlineInit();
            self.bindEvents();
            self.$editorIframe.show();
            self.$spinnerContainer.hide();
            self.saveBody();
            self.updateBody();
            self.codePanelUpdate();
            self.dispatchLoadEvent();
            console.log('*** iframe fully loaded! ***');
        });

        this.$editorIframe.addClass('tab-pane__' + this.device);
    };

    LiveEditor.prototype.initVars = function (params) {
        this.device = params.device;
        this.tabsList = params.tabs;
        this.id = params.editor.replace('#', '');
        this.url = params.url;
        this.js = params.js || [];
        this.$editor = $(params.editor);
        this.domOutline = null;
        this.experiments = {};
    };

    LiveEditor.prototype.buildTabs = function () {
        this.tabs = new LiveEditorTabs({
            tabs: this.tabsList,
            parent: this.$header
        });

        this.createExperiments();
    };

    LiveEditor.prototype.createExperiments = function() {
        for(var i=0; i<=this.tabsList.length-1; i++) {
            var name = this.tabs.slugify(this.tabsList[i]);

            if (this.experiments[name] === undefined) {
                this.experiments[name] = {
                    'scriptList': this.js[i] ? [this.js[i]] : [],
                    'undoList': [],
                    'goalList': []
                };
            }
        }
    };

    LiveEditor.prototype.buildIframe = function (params) {
        this.$editorIframe = $('<iframe id="live-editor-iframe">');
        this.$spinnerContainer = $('<span class="spinner-container"><span class="spinner-content"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...</span></span>');

        this.$editorIframe.attr({
            'src': this.url,
            'width': '100%',
            'height': '100%',
            'frameborder': '0',
            'allowfullscreen': ''
        });

        this.$header = $('<header class="live-editor-header">');
        this.$editorIframeContainer = $('<div class="live-editor-iframe-container">');
        this.$editorIframeContainer.append(this.$spinnerContainer, this.$editorIframe);

        this.$editor.append(this.$header, this.$editorIframeContainer);
        this.$editor.addClass('live-editor');
    };

    LiveEditor.prototype.buildModals = function (params) {
        this.editHtmlModal = new LiveEditorModal({
            editor: this.id,
            data: {
                name: 'edit-html-modal-' + this.id,
                title: 'Edit HTML',
                field: 'textarea',
                hasAceEditor: true
            }
        });

        this.editTextModal = new LiveEditorModal({
            editor: this.id,
            data: {
                name: 'edit-text-modal-' + this.id,
                title: 'Edit Text',
                field: 'textarea'
            }
        });

        new LiveEditorModal({
            editor: this.id,
            data: {
                name: 'edit-classes-modal-' + this.id,
                title: 'Edit Classes',
                field: 'input'
            }
        });

        this.$editHtmlModal = $('#edit-html-modal-' + this.id);
        this.$editTextModal = $('#edit-text-modal-' + this.id);
        this.$editClassesModal = $('#edit-classes-modal-' + this.id);
    };

    LiveEditor.prototype.buildPanel = function () {
        this.codePanel = new LiveEditorCodePanel({
            editorName: this.id,
            appendTo: this.$editor.parent()
        });
    };

    LiveEditor.prototype.buildToolbar = function() {
        this.toolbar = new LiveEditorToolbar({
            $appendTo: this.$header
        });
    };

    LiveEditor.prototype.currentMode = function() {
        return this.toolbar.$modeSelect.val();
    };

    LiveEditor.prototype.saveBody = function () {
        this.$iframeBody = this.$editorIframe.contents().find('body');
    };

    LiveEditor.prototype.getIframeBody = function () {
        return this.$editorIframe.contents().find('body');
    };

    LiveEditor.prototype.updateBody = function ($iframeBody) {
        var $body = this.getIframeBody(),
            $iframeBody = $iframeBody || this.$iframeBody,
            mode = this.currentMode();

        this.domOutline.stop();
        this.unselectElements();

        try {
            if (mode == 'edit') {
                $body.replaceWith($iframeBody.clone());
            } else if (mode == 'view') {
                $body.replaceWith($iframeBody);
            }
        }
        catch(err) {
            console.log('Update body error - Mode: ' + mode + ' - error: ' + err);
        }
        finally {
            if (mode == 'edit') {
                this.applyJs();
                this.domOutlineInit();
            }
        }
    };

    LiveEditor.prototype.changeTab = function () {
        this.updateBody();
        this.codePanelUpdate();
        console.log('Change tab!');
    };

    LiveEditor.prototype.initActions = function () {
        this.actions = new LiveEditorActions(this);
    };

    LiveEditor.prototype.applyJs = function (str) {
        // TO DO - test
        var iframeWindow = this.$editorIframe[0].contentWindow,
            scriptList = this.currentExperiment().scriptList;
        // We use replace here to guarantee the jquery been used
        // is from iframe's window.

        if (str !== undefined) {
            eval(str.replace(/\$/g, 'iframeWindow.$'));
        } else {
            for (var i=0, len=scriptList.length; i<=len-1; i++) {
                eval(scriptList[i].replace(/\$/g, 'iframeWindow.$'));
            }
        }
    };

    LiveEditor.prototype.dispatchLoadEvent = function () {
        var _event = new CustomEvent('LiveEditorLoaded', {'detail': {}});
        document.dispatchEvent(_event);
    };

    LiveEditor.prototype.domOutlineInit = function () {
        this.domOutline = new DomOutline({
            realtime: true,
            onClick: this.sendEventOnClick,
            elem: this.$editorIframe.contents().find('html body')
        });
        this.domOutline.start();
    };

    LiveEditor.prototype.modalEvents = function () {
        var self = this;

        // Edit HTML
        this.$editHtmlModal.on('shown.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                html = current_without_cache.outerHTML;
            self.editHtmlModal.setValue(html);
        });

        // Edit Text
        this.$editTextModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                text = current_without_cache.textContent;
            self.editTextModal.setValue(text);
        });

        // Edit Classes
        this.$editClassesModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected),
                classes = current_without_cache.attr('class');
            $(this).find('.modal-body input').val(classes);
        });

        // Rename Modal
        $('#rename-modal').on('show.bs.modal', function () {
            $(this).find('.modal-body input').val('');
        });

        this.bindModalSave(this.$editHtmlModal, 'html');
        this.bindModalSave(this.$editTextModal, 'text');
        this.bindModalSave(this.$editClassesModal, 'classes');
        this.bindModalSave($('#rename-modal'), 'rename-modal');
    };

    LiveEditor.prototype.bindModalSave = function ($modal, label) {
        var self = this,
            saveId = 'edit-' + label + '-save';

        $modal.find('.save-btn').on('click', function() {
            self.operationInit(saveId);
            $modal.modal('hide');
        });
    };

    LiveEditor.prototype.bindEvents = function () {
        var self = this;

        this.modalEvents();

        document.addEventListener('domOutlineOnClick', function () {
            self.setCurrentElement(self.domOutline.element);
            self.openCurrentMenu();
            self.domOutline.pause();

            self.$editorIframe.contents().find('html *').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.unselectElements();
            });

            console.log('dom clicked!');
        }, false);

        document.addEventListener('floatingMenuItemClicked', function (e) {
            self.operationInit(e.detail.operation);
        }, false);

        this.tabs.$tabs.on('click', 'li', function(e) {
            var op = $(this).data('operation');
            if (op) {
                self.operationInit(op);
                console.log(op);
            }
        });

        this.$editorIframe.contents().keyup(function(e) {
            if (e.keyCode == 27) { // Esc
                self.unselectElements();
            }
        });

        this.toolbar.$undoButton.off().on('click', function () {
            if (self.currentExperiment().undoList.length) {
                self.actions.undo();
            }
        });

        this.tabs.$tabs.on('shown.bs.tab', 'a[data-toggle="tab"]', function () {
            self.changeTab();
        });

        $('#code-panel').on('show.bs.collapse', function () {
            self.codePanelUpdate();
        });

        this.toolbar.$modeSelect.on('change', function() {
            self.updateBody();
        });

        this.toolbar.$buttonAddOption.on('click', function() {
            self.addNewOption();
        });

        this.codePanel.$saveButton.on('click', function() {
            self.actions.saveCodePanel();
        });
    };

    LiveEditor.prototype.addNewOption = function () {
        // TODO - CHECK IF THIS NAME DONT EXIST
        var name = 'Test ' + (this.tabsList.length + 1);
        this.tabsList.push(name);
        this.tabs.createTabs([name]);
        this.createExperiments();
        this.updateBody();
        this.toolbar.$toolbar.trigger('add-new-option');
    };

    LiveEditor.prototype.unselectElements = function () {
        if (this.$currentSelected && this.currentSelected) {
            this.floatingMenu.close();
            this.domOutline.stop();
            this.domOutline.start();
            this.$currentSelected = null;
            this.currentSelected = null;
            this.$editorIframe.contents().find('html *').off('click');
        }
    };

    LiveEditor.prototype.sendEventOnClick = function (e) {
        var _event = new CustomEvent('domOutlineOnClick', {'detail': e});
        document.dispatchEvent(_event);
    };

    LiveEditor.prototype.setCurrentElement = function ($elem) {
        this.currentSelected = this.getElementPath($elem);
        this.$currentSelected = this.$editorIframe.contents().find(this.currentSelected);
        console.log('Current: ' +  this.currentSelected);
    };

    LiveEditor.prototype.getElementPath = function ($elem) {
        if ($elem.length != 1)
            $elem = $($elem);

        var path, node = $elem;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var siblings = parent.children(name);
            if (siblings.length > 1) {
                name += ':eq(' + siblings.index(realNode) + ')';
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    };

    LiveEditor.prototype.getCurrentParentsPath = function () {
        var a = this.$currentSelected[0];
        var els = [];
        while (a) {
            els.unshift(a);
            a = a.parentNode;
        }
        return els;
    };

    LiveEditor.prototype.openCurrentMenu = function () {
        if (this.currentSelected) {
            var $domOutlineBox = this.$editorIframe.contents().find('.DomOutline_box'),
                top = this.$editorIframe.offset().top,
                left = this.$editorIframe.offset().left,
                scrollTop = this.$editorIframe.contents().scrollTop();

            this.floatingMenu = new FloatingMenu({
                elemId: this.$editor.attr('id'),
                appendTo: this.$editorIframeContainer,
                data: {
                    value: this.$currentSelected.prop('tagName').toLowerCase(),
                    posLeft: {
                        "iframe_left":left,
                        "box_offset_left": $domOutlineBox.offset().left,
                        "box_width": $domOutlineBox.width(),
                        "iframe_width": this.$editorIframe.width(),
                    },
                    posTop: {
                        "iframe_top": top,
                        "box_offset_top": $domOutlineBox.offset().top,
                        "scroll_top": scrollTop,
                        "iframe_height": this.$editorIframe.height(),
                        "box_heigh": $domOutlineBox.height(),
                    },
                    container: this.containerFormat()
                }
            });

            this.floatingMenu.open();
        } else {
            console.log('No item has been selected...');
        }
    };

    LiveEditor.prototype.containerFormat = function () {
        var pathList = this.getCurrentParentsPath(),
            _list = [];

        for (var i=0; i <= pathList.length - 1; i++) {
            if (pathList[i].tagName) {
                _list.push({
                    value: pathList[i].tagName.toLowerCase(),
                    attrs: {
                        'value': this.getElementPath(pathList[i])
                    }
                });
            }
        }

        return _list;
    };

    LiveEditor.prototype.operationInit = function (operation) {
        if (operation === 'remove') {
            this.actions.currentSelectedRemove();
            this.unselectElements();
        }

        if (operation === 'add-event-click') {
            this.actions.currentSelectedAddEvent('click');
            this.unselectElements();
        }

        if (operation === 'edit-html-save') {
            this.actions.currentSelectedEditHtml();
        }

        if (operation === 'edit-text-save') {
            this.actions.currentSelectedEditText();
        }

        if (operation === 'edit-classes-save') {
            this.actions.currentSelectedEditClasses();
        }

        if (operation === 'edit-rename-modal-save') {
            this.actions.currentOptionRename();
        }

        if (operation === 'delete-option') {
            this.actions.currentOptionDelete();
        }

        if (operation === 'duplicate-option') {
            this.actions.currentOptionDuplicate();
        }

        this.codePanelUpdate();
    };

    LiveEditor.prototype.undoListUpdate = function () {
        this.currentExperiment().undoList.push(this.$iframeBody.clone());
    };

    LiveEditor.prototype.addToScriptList = function (str) {
        // TODO - test js
        var newScript = str.replace(new RegExp('\t|\n', 'g'), ''),
            oldScript = this.currentExperimentScriptList(),
            finalScript = oldScript == undefined ? newScript : oldScript + newScript;

        this.currentExperiment().scriptList.push(finalScript);
    };

    LiveEditor.prototype.codePanelUpdate = function () {
        var str = this.currentExperimentScriptList();
        if (str) {
            this.codePanel.aceEditor.aceEditor.setValue(str, -1);
        }
    };

    LiveEditor.prototype.currentExperiment = function () {
        var currentTab = this.tabs.current();
        return this.experiments[currentTab.attr('data-name')];
    };

    LiveEditor.prototype.currentExperimentScriptList = function() {
        // TODO - test js
        return this.currentExperiment().scriptList.slice(-1)[0];
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);
