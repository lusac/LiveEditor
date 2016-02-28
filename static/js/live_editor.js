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
        this.buildModals(params);
        this.buildPanels(params);

        this.$editorIframe.on('load', function() {
            self.domOutlineInit();
            self.bindEvents();
            self.$editorIframe.show();
            self.$spinnerContainer.hide();
            console.log('*** iframe fully loaded! ***');
        });
    };

    LiveEditor.prototype.initVars = function (params) {
        this.id = params.editor.replace('#', '');
        this.$editor = $(params.editor);
        this.domOutline = null;
        this.scriptList = [];
        this.scriptGoal = [];
    };

    LiveEditor.prototype.buildIframe = function (params) {
        this.$editorIframe = $('<iframe style="display: none;">');
        this.$spinnerContainer = $('<span class="spinner-container"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...</span>');

        this.$editorIframe.attr({
            'src': params.url,
            'width': '100%',
            'height': '100%',
            'frameborder': '0'
        });

        this.$editor.append(this.$spinnerContainer, this.$editorIframe);
        this.$editor.addClass('live-editor');

        this.$editorIframe = this.$editor.find('iframe');
    };

    LiveEditor.prototype.buildModals = function (params) {
        var modals = [
                {
                    name: 'edit-html-modal',
                    title: 'Edit HTML',
                    field: 'textarea'
                }, {
                    name: 'edit-text-modal',
                    title: 'Edit Text',
                    field: 'textarea'
                }, {
                    name: 'edit-classes-modal',
                    title: 'Edit Classes',
                    field: 'input'
                }
            ]

        for (var i=0; i<=modals.length-1; i++) {
            var modal = new LiveEditorModal({
                editor: this.id,
                data: modals[i]
            });
        }

        this.$editHtmlModal = $('#edit-html-modal[' + this.id + ']');
        this.$editTextModal = $('#edit-text-modal[' + this.id + ']');
        this.$editClassesModal = $('#edit-classes-modal[' + this.id + ']');
    };

    LiveEditor.prototype.buildPanels = function () {
        var codePanel = new LiveEditorCodePanel({
            editorName: this.id,
            appendTo: this.$editor.parent()
        });

        this.$codePanel = $('#code-panel[' + this.id + ']').find('textarea');
    }

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
        this.$editHtmlModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                html = current_without_cache.outerHTML;
            $(this).find('.modal-body textarea').val(html);
        });

        // Edit Text
        this.$editTextModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                text = current_without_cache.textContent;
            $(this).find('.modal-body textarea').val(text);
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
            selector = '[' + this.$editor.attr('id') + '] #edit-' + label + '-modal-save',
            saveId = 'edit-' + label + '-save';

        $(selector).on('click', function() {
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
                self.openCurrentSettings();
                self.domOutline.pause();
                console.log('dom clicked!');
            }
        }, false);

        document.addEventListener('floatingMenuItemClicked', function (e) {
            if (self.$editor.attr('id') == e.detail.liveEditor) {
                self.operationInit(e.detail.operation);
            }
        }, false);

        this.$editorIframe.contents().find('html').on('click', function(e) {
            self.unselectElements(e);
        });

        this.$editorIframe.contents().keyup(function(e) {
            if (e.keyCode == 27) { // Esc
                self.unselectElements(e);
            }
        });
    };

    LiveEditor.prototype.unselectElements = function (e) {
        if (e.toElement != this.$currentSelected[0]) {
            this.floatingMenu.close();
            this.domOutline.start();
        }
    };

    LiveEditor.prototype.sendEventOnClick = function (e) {
        var _event = new CustomEvent('domOutlineOnClick', {'detail': e});
        document.dispatchEvent(_event);
    };

    LiveEditor.prototype.setCurrentElement = function (elem) {
        this.currentSelected = this.getElementPath(elem);
        this.$currentSelected = this.$editorIframe.contents().find(this.currentSelected);
        console.log('Current: ' +  this.currentSelected);
    };

    LiveEditor.prototype.getElementPath = function (elem) {
        if (elem.length != 1)
            elem = $(elem);

        var path, node = elem;
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

    LiveEditor.prototype.getCurrentParentPath = function () {
        var a = this.$currentSelected[0];
        var els = [];
        while (a) {
            els.unshift(a);
            a = a.parentNode;
        }
        return els;
    };

    LiveEditor.prototype.openCurrentSettings = function () {
        if (this.currentSelected) {
            var $DomOutlineBox = this.$editorIframe.contents().find('.DomOutline_box'),
                top = this.$editorIframe.offset().top,
                left = this.$editorIframe.offset().left,
                scrollTop = this.$editorIframe.contents().scrollTop();

            this.floatingMenu = new FloatingMenu({
                elemId: this.$editor.attr('id'),
                data: {
                    value: this.$currentSelected.prop('tagName').toLowerCase(),
                    posLeft: left + $DomOutlineBox.offset().left + $DomOutlineBox.width(),
                    posTop: top + $DomOutlineBox.offset().top - scrollTop,
                    container: this.containerFormat()
                }
            });

            this.floatingMenu.open();
        } else {
            console.log('No item has been selected...');
        }
    };

    LiveEditor.prototype.containerFormat = function () {
        var pathList = this.getCurrentParentPath(),
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
            this.currentSelectedRemove();
            this.floatingMenu.close();
            this.domOutline.start();
        }

        if (operation === 'add-event-click') {
            this.currentSelectedAddEvent('click');
        }

        if (operation === 'edit-html-save') {
            this.currentSelectedEditHtml();
        }

        if (operation === 'edit-text-save') {
            this.currentSelectedEditText();
        }

        if (operation === 'edit-classes-save') {
            this.currentSelectedEditClasses();
        }

        this.codePanelUpdate();
    };

    LiveEditor.prototype.currentSelectedRemove = function () {
        var str = '$("' + this.currentSelected + '").remove();';
        this.addToScriptList(str);
        this.$editorIframe.contents().find(this.currentSelected).remove();
    };

    LiveEditor.prototype.currentSelectedAddEvent = function (e) {
        var str = '$("' + this.currentSelected + '").attr("easyab-track-' + e + '", 1);';

        this.addToScriptGoal(str);
    };

    LiveEditor.prototype.currentSelectedEditHtml = function () {
        var html = this.$editHtmlModal.find('.modal-body textarea').val(),
            str = '$("' + this.currentSelected + '").replaceWith("' + html + '");';

        this.addToScriptList(str);
        this.$editorIframe.contents().find(this.currentSelected).replaceWith(html);
    };

    LiveEditor.prototype.currentSelectedEditText = function () {
        var text = this.$editTextModal.find('.modal-body textarea').val(),
            str = '$("' + this.currentSelected + '").text("' + text + '");';

        this.addToScriptList(str);
        this.$editorIframe.contents().find(this.currentSelected).text(text);
    };

    LiveEditor.prototype.currentSelectedEditClasses = function () {
        var classes = this.$editClassesModal.find('.modal-body input').val(),
            str = '$("' + this.currentSelected + '").attr("class", "' + classes + '");';

        this.addToScriptList(str);
        this.$editorIframe.contents().find(this.currentSelected).attr('class', classes);
    };

    LiveEditor.prototype.addToScriptList = function (str) {
        this.scriptList.push(str);
    };

    LiveEditor.prototype.addToScriptGoal = function (str) {
        this.scriptGoal.push(str);

        // workaround... to remove duplicates.
        var result = [];
        $.each(this.scriptGoal, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });

        this.scriptGoal = result;
    };

    LiveEditor.prototype.codePanelUpdate = function () {
        this.$codePanel.val(this.scriptList);
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);