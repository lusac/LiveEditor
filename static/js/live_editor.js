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

        this.$editorIframe.on('load', function() {
            self.domOutlineInit();
            self.bindEvents();
        });
    };

    LiveEditor.prototype.initVars = function (params) {
        this.$editor = $(params.editor);
        this.$codePainel = $('#code-painel[' + params.editor.replace('#', '') + ']').find('textarea');
        this.$editHtmlModal = $('#edit-html-modal[' + params.editor.replace('#', '') + ']');
        this.$editTextModal = $('#edit-text-modal[' + params.editor.replace('#', '') + ']');
        this.$editClassesModal = $('#edit-classes-modal[' + params.editor.replace('#', '') + ']');
        this.domOutline = null;
        this.scriptList = [];
        this.scriptGoal = [];
    };

    LiveEditor.prototype.buildIframe = function (params) {
        var $iframe = $('<iframe>');
        $iframe.attr({
            'src': params.url,
            'width': '100%',
            'height': '100%',
            'frameborder': '0'
        });

        this.$editor.append($iframe);
        this.$editor.addClass('live-editor');

        this.$editorIframe = this.$editor.find('iframe');
    };

    LiveEditor.prototype.domOutlineInit = function () {
        this.domOutline = new DomOutline({
            realtime: true,
            onClick: this.sendEventOnClick,
            elem: this.$editorIframe.contents().find('html body')
        });
        this.domOutline.start();
    };

    LiveEditor.prototype.floatingMenuInit = function () {
        this.floatingMenu = new FloatingMenu();
    };

    LiveEditor.prototype.modalEvents = function () {
        var self = this;

        // Edit HTML
        this.$editHtmlModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                html = current_without_cache.outerHTML;
            $(this).find('.modal-body textarea').val(html);
        });

        $('[' + this.$editor.attr('id') + '] #edit-html-modal-save').on('click', function() {
            self.operationInit('edit-html-save');
            self.$editHtmlModal.modal('hide');
        });

        // Edit Text
        this.$editTextModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                text = current_without_cache.textContent;
            $(this).find('.modal-body textarea').val(text);
        });

        $('[' + this.$editor.attr('id') + '] #edit-text-modal-save').on('click', function() {
            self.operationInit('edit-text-save');
            self.$editTextModal.modal('hide');
        });

        // Edit Classes
        this.$editClassesModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected),
                classes = current_without_cache.attr('class');
            $(this).find('.modal-body input').val(classes);
        });

        $('[' + this.$editor.attr('id') + '] #edit-classes-modal-save').on('click', function() {
            self.operationInit('edit-classes-save');
            self.$editClassesModal.modal('hide');
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
            self.operationInit(e.detail.operation);
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

            this.floatingMenuInit();
            this.floatingMenu.create({
                elemId: this.$editor.attr('id'),
                value: this.$currentSelected.prop('tagName').toLowerCase(),
                posLeft: left + $DomOutlineBox.offset().left + $DomOutlineBox.width(),
                posTop: top + $DomOutlineBox.offset().top - scrollTop,
                container: this.containerFormat()
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

        this.codePainelUpdate();
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

    LiveEditor.prototype.codePainelUpdate = function () {
        this.$codePainel.val(this.scriptList);
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);