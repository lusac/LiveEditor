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
            self.setCurrentElement(self.domOutline.element);
            self.openCurrentSettings();
            self.domOutline.pause();
        }, false);

        this.$editor.contents().find('html').on('click', function(e) {
            if (e.toElement != liveEditor.$currentSelected[0]) {
                $('#floating-settings').remove();
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
        console.log("Current: " +  this.currentSelected);
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
            console.log('Opening float settings...');

            var $DomOutlineBox = $('.DomOutline_box'),
                name = this.$currentSelected.prop("tagName").toLowerCase(),
                menuHtml = '<ul id="floating-settings" class="dropdown-menu" role="menu">';
                    menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#"> (' + name + ') </a></li>';
                    menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Edit Element</a></li>';
                    menuHtml += '<li role="presentation" class="divider"></li>';
                    menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Move and Resize</a></li>';
                    menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Remove</a></li>    '
                    menuHtml += '<li role="presentation" class="divider"></li>';
                    menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Select Container</a></li>    '
                menuHtml += '</ul>';
            $('#floating-settings').remove();
            $('body').append(menuHtml);
            $("#floating-settings").css({
                top: $DomOutlineBox.offset().top - 10,
                left: $DomOutlineBox.offset().left + $DomOutlineBox.width() + 10
            });
            $("#floating-settings").show();
        } else {
            console.log('No item was selected...');
        }
    };

    window.LiveEditor = LiveEditor;
})(window, document, $);