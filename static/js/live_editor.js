/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditor = function LiveEditor (params) {
        console.log('Live Editor Init...');
        this.init(params);
        console.log('Live Editor Done...');
    }

    LiveEditor.prototype.init = function (params) {
        this.initVars(params);
        this.domOutlineInit();
        this.floatingMenuInit();
        this.bindEvents();
    };

    LiveEditor.prototype.initVars = function (params) {
        this.$editor = $(params.editor).find('iframe');
        this.$codePainel = $('#code-painel').find('textarea');
        this.$editHtmlModal = $('#edit-html-modal');
        this.domOutline = null;
        this.scriptList = [];
    };

    LiveEditor.prototype.domOutlineInit = function () {
        this.domOutline = DomOutline({
            realtime: true,
            onClick: this.sendEventOnClick,
            elem: this.$editor.contents().find('html body'),
            initialPosition: this.$editor.offset()
        });
        this.domOutline.start();
    };

    LiveEditor.prototype.floatingMenuInit = function () {
        window.floatingMenu = new FloatingMenu();
    };

    LiveEditor.prototype.modalEvents = function () {
        var self = this;

        this.$editHtmlModal.on('show.bs.modal', function () {
            var html = self.$currentSelected[0].outerHTML;
            $(this).find('.modal-body textarea').val(html);
        });

        $('#edit-html-modal-save').on('click', function() {
            self.operationInit('edit-html-save');
            self.$editHtmlModal.modal('hide');
        });
    };

    LiveEditor.prototype.bindEvents = function () {
        var self = this;

        this.modalEvents();

        document.addEventListener('domOutlineOnClick', function (e) {
            self.setCurrentElement(self.domOutline.element);
            self.openCurrentSettings();
            self.domOutline.pause();
        }, false);

        document.addEventListener('floatingMenuItemClicked', function (e) {
            self.operationInit(e.detail.operation);
        }, false);

        this.$editor.contents().find('html').on('click', function(e) {
            if (e.toElement != liveEditor.$currentSelected[0]) {
                floatingMenu.close();
                self.domOutline.start();
            }
        });
    };

    LiveEditor.prototype.sendEventOnClick = function () {
        var _event = new Event('domOutlineOnClick');
        document.dispatchEvent(_event);
    }
    LiveEditor.prototype.setCurrentElement = function (elem) {
        this.currentSelected = this.getElementPath(elem);
        this.$currentSelected = this.$editor.contents().find(this.currentSelected);
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
        return els
    };

    LiveEditor.prototype.openCurrentSettings = function () {
        if (this.currentSelected) {
            var $DomOutlineBox = $('.DomOutline_box');

            floatingMenu.create({
                value: this.$currentSelected.prop('tagName').toLowerCase(),
                posLeft: $DomOutlineBox.offset().left + $DomOutlineBox.width(),
                posTop: $DomOutlineBox.offset().top,
                container: this.containerFormat()
            });
            floatingMenu.open();
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
            floatingMenu.close();
            this.domOutline.start();
        }

        if (operation === 'edit-html-save') {
            this.currentSelectedEditHtml();
        }

        this.codePainelUpdate();
    };

    LiveEditor.prototype.currentSelectedRemove = function () {
        var str = '$("' + this.currentSelected + '").remove();';
        this.addToScript(str);
        this.$editor.contents().find(this.currentSelected).remove();
    };

    LiveEditor.prototype.currentSelectedEditHtml = function () {
        var html = this.$editHtmlModal.find('.modal-body textarea').val(),
            str = '$("' + this.currentSelected + '").replaceWith("' + html + '");';

        this.addToScript(str);
        this.$editor.contents().find(this.currentSelected).replaceWith(html)
    };

    LiveEditor.prototype.addToScript = function (str) {
        this.scriptList.push(str);
    };

    LiveEditor.prototype.codePainelUpdate = function () {
        this.$codePainel.val(this.scriptList);
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);