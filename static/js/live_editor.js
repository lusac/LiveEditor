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
        this.buildTabs(params);
        this.buildIframe(params);
        this.buildButtons();
        this.buildModals(params);
        this.buildPanel(params);
        this.initActions();

        this.$editorIframe.on('load', function() {
            self.domOutlineInit();
            self.bindEvents();
            self.$editorIframe.show();
            self.$spinnerContainer.hide();
            self.saveBody(); // before applyJs
            self.dispatchLoadEvent();
            self.applyJs();
            self.codePanelUpdate(); // TO DO - tests js
            console.log('*** iframe fully loaded! ***');
        });

        // $(this.editors[i]).parent().addClass('tab-pane__' + this.device);
    };

    LiveEditor.prototype.buildTabs = function () {
        this.currentTab = this.tabs[0].toLowerCase();

        // TO DO - test js
        new LiveEditorTabs({
            tabs: this.tabs,
            parent: this.$editor
        });

        for(var i=0; i<=this.tabs.length-1; i++) {
            var name = this.tabs[i].toLowerCase();

            this.experiments[name] = {
                'scriptList': this.js > 1 ? [this.js[i]] : [],
                'undoList': [],
                'goalList': []
            }
        }
    };

    LiveEditor.prototype.saveBody = function () {
        this.$iframeBody = this.$editorIframe.contents().find('body').clone();
    };

    LiveEditor.prototype.changeTab = function () {
        var $body = this.$editorIframe.contents().find('body');
        this.domOutline.stop();
        $body.empty();
        $body.replaceWith(this.$iframeBody.clone());
        this.domOutlineInit();
    };

    LiveEditor.prototype.initVars = function (params) {
        this.device = params.device;
        this.tabs = params.tabs;
        this.id = params.editor.replace('#', '');
        this.url = params.url;
        this.js = params.js;
        this.$editor = $(params.editor);
        this.domOutline = null;
        this.experiments = {};

        // if (params.js) {
        //     this.addToScriptList(params.js)
        // }
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

        this.$editor.append(this.$spinnerContainer, this.$editorIframe);
        this.$editor.addClass('live-editor');
    };

    LiveEditor.prototype.initActions = function () {
        this.actions = new LiveEditorActions(this);
    };

    LiveEditor.prototype.buildButtons = function () {
        this.$undoButton = $('<button type="button" class="btn btn-default btn-undo">Undo</button>');
        // this.$redoButton = $('<button type="button" class="btn btn-default btn-redo">Redo</button>');

        this.$editor.parent().append(this.$undoButton); //, this.$redoButton);
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

    LiveEditor.prototype.applyJs = function () {
        // TO DO - test
        var iframeWindow = this.$editorIframe[0].contentWindow,
            scriptList = this.experiments[this.currentTab].scriptList;
        // We use replace here to guarantee the jquery been used
        // is from iframe's window.

        for (var i=0, len=scriptList.length; i<=len-1; i++) {
            eval(scriptList[i].replace(/\$/g, 'iframeWindow.$'));
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

        this.bindModalSave(this.$editHtmlModal, 'html');
        this.bindModalSave(this.$editTextModal, 'text');
        this.bindModalSave(this.$editClassesModal, 'classes');
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

        document.addEventListener('domOutlineOnClick', function (e) {
            // same event for all editor. Should better this.
            if (self.$editorIframe.contents().find($(e.detail)).length > 0) {
                self.setCurrentElement(self.domOutline.element);
                self.openCurrentMenu();
                self.domOutline.pause();
                self.$editorIframe.contents().find("html *").on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.unselectElements();
                });
                console.log('dom clicked!');
            }
        }, false);

        document.addEventListener('floatingMenuItemClicked', function (e) {
            if (self.$editor.attr('id') == e.detail.liveEditor) {
                self.operationInit(e.detail.operation);
            }
        }, false);

        this.$editorIframe.contents().find('html').on('click', function(e) {
            self.unselectElements();
        });

        this.$editorIframe.contents().keyup(function(e) {
            if (e.keyCode == 27) { // Esc
                self.unselectElements();
            }
        });

        this.$undoButton.off().on('click', function () {
            if (self.undoList.length) {
                var script = self.undoList.pop();
                self.scriptList.pop();
                self.codePanelUpdate();
                eval(script);
            }
        });

        $('.nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            self.currentTab = $(e.target).data('name');
            self.changeTab();
            self.applyJs();
            self.codePanelUpdate();
            console.log('tab!');
        });
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
            var $DomOutlineBox = this.$editorIframe.contents().find('.DomOutline_box'),
                top = this.$editorIframe.offset().top,
                left = this.$editorIframe.offset().left,
                scrollTop = this.$editorIframe.contents().scrollTop();

            this.floatingMenu = new FloatingMenu({
                elemId: this.$editor.attr('id'),
                appendTo: this.$editor.parent(),
                data: {
                    value: this.$currentSelected.prop('tagName').toLowerCase(),
                    posLeft: {
                        "iframe_left":left,
                        "box_offset_left": $DomOutlineBox.offset().left,
                        "box_width": $DomOutlineBox.width(),
                        "iframe_width": this.$editorIframe.width(),
                    },
                    posTop: {
                        "iframe_top": top,
                        "box_offset_top": $DomOutlineBox.offset().top,
                        "scroll_top": scrollTop,
                        "iframe_height": this.$editorIframe.height(),
                        "box_heigh": $DomOutlineBox.height(),
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

        this.codePanelUpdate();
    };

    LiveEditor.prototype.addToUndoList = function (str) {
        str = str.replace(new RegExp('\t|\n', 'g'), '');
        this.experiments[this.currentTab].undoList.push(str);
    };

    LiveEditor.prototype.addToScriptList = function (str) {
        str = str.replace(new RegExp('\t|\n', 'g'), '');
        this.experiments[this.currentTab].scriptList.push(str);
    };

    LiveEditor.prototype.codePanelUpdate = function () {
        this.codePanel.aceEditor.aceEditor.setValue(this.experiments[this.currentTab].scriptList.join(' '), -1);
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);
