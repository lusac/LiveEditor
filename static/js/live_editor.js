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
        this.domOutline = null;
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

    LiveEditor.prototype.bindEvents = function () {
        var self = this;

        document.addEventListener('domOutlineOnClick', function (e) {
            self.setCurrentElement(self.domOutline.element);
            self.openCurrentSettings();
            self.domOutline.pause();
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
        console.log('Getting element path...: ' + elem);

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

    LiveEditor.prototype.openCurrentSettings = function () {
        if (this.currentSelected) {
            var $DomOutlineBox = $('.DomOutline_box');

            floatingMenu.create({
                name: this.$currentSelected.prop('tagName').toLowerCase(),
                posLeft: $DomOutlineBox.offset().left + $DomOutlineBox.width(),
                posTop: $DomOutlineBox.offset().top
            });
            floatingMenu.open();
        } else {
            console.log('No item has been selected...');
        }
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);