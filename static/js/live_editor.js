/* global $ */
window.cont = 0;
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

    LiveEditor.prototype.bindEvents = function () {
        var self = this;

        document.addEventListener('domOutlineOnClick', function (e) {
            self.setElementPath(self.domOutline.element);
        }, false);

    };

    LiveEditor.prototype.sendEventOnClick = function () {
        var _event = new Event('domOutlineOnClick');
        document.dispatchEvent(_event);
    }
    LiveEditor.prototype.setElementPath = function (elem) {
        this.setCurrentSelected = this.getElementPath(elem);
        console.log("Current: " +  this.setCurrentSelected);
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

    window.LiveEditor = LiveEditor;
})(window, document, $);