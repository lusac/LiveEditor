;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global $ */

(function (window, document, $) {
    'use strict';

    var FloatingMenu = function FloatingMenu (params) {
        this.init(params);
    };

    FloatingMenu.prototype.init = function (params) {
        this.$menu = $('<ul id="floating-settings" class="dropdown-menu" role="menu">');
        $('body').append(this.$menu);
        this.bindEvents();
    };

    FloatingMenu.prototype.create = function (params) {
        var value = params.value || '(element)',
            posTop = params.posTop || 0,
            posLeft = params.posLeft || 0,
            menuHtml = this.newItem({value: value, is_header: true}),
            editList = [{
                value: 'Edit HTML',
                attrs: {
                    'data-operation': 'edit-html',
                    'data-toggle': 'modal', 
                    'data-target':'#edit-html-modal'
                }
            },{
                value: 'Edit Text',
                attrs: {
                    'data-operation': 'edit-text',
                    'data-toggle': 'modal', 
                    'data-target':'#edit-text-modal'
                }
            },{
                value: 'Edit Classes',
                attrs: {
                    'data-operation': 'edit-classes',
                    'data-toggle': 'modal', 
                    'data-target':'#edit-classes-modal'
                }
            }, {
                value: 'Edit Style',
                attrs: {
                    'data-operation': 'edit-style'
                }
            }],
            events = [{
                value: 'Click',
                attrs: {
                    'data-operation': 'add-event-click'
                }
            }];

        menuHtml += this.newItem({value: 'Edit Element', items: editList });
        menuHtml += this.newItem({attrs: {'class': 'divider'}});
        menuHtml += this.newItem({value: 'Move and Resize', attrs: {'data-operation': 'move-and-resize'}});
        menuHtml += this.newItem({value: 'Remove', attrs: {'data-operation': 'remove'}});
        menuHtml += this.newItem({attrs: {'class': 'divider'}});
        menuHtml += this.newItem({value: 'Select Container', items: params.container});
        menuHtml += this.newItem({attrs: {'class': 'divider'}});
        menuHtml += this.newItem({value: 'Create new goal', items: events});

        this.$menu.append(menuHtml);
        this.$menu.css({
            top: posTop - 10,
            left: posLeft + 10
        });
    };

    FloatingMenu.prototype.bindEvents = function () {
        this.$menu.on('click', 'li', function(e) {
            var $el = $(e.toElement).parent(),
                op = $el.data('operation');

            if (op) {
                var _event = new CustomEvent('floatingMenuItemClicked', {'detail': {'operation': op}});
                document.dispatchEvent(_event);
                console.log('Operation: ' + op);
            }

            // e.stopPropagation();
        });
    };

    FloatingMenu.prototype.open = function () {
        this.$menu.show();
    };

    FloatingMenu.prototype.close = function () {
        this.$menu.hide();
        this.$menu.empty();
    };

    FloatingMenu.prototype.newItem = function (params) {
        var $li = $('<li>');

        if (params.attrs) {
            $li.attr(params.attrs);
        }

        if (params.is_header) {
            $li.addClass('dropdown-header')
               .text('<' + params.value + '>');
        } else if (params.value) {
            $li.append('<a tabindex="-1" href="#">' + params.value + '</a>');
        }

        if (params.items) {
            var $subMenu = $('<ul class="dropdown-menu">');

            for (var i=0; i<=params.items.length-1; i++) {
                var $_li = $('<li class="container-item-el">');

                $_li.attr(params.items[i].attrs)
                    .append('<a tabindex="-1" href="#">' + params.items[i].value + '</a>');

                $subMenu.append($_li);
            }

            $li.addClass('dropdown-submenu');
            $li.append($subMenu);
        }

        return $li.prop('outerHTML');
    }

    window.FloatingMenu = FloatingMenu;
})(window, document, $);
},{}],2:[function(require,module,exports){
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
            self.floatingMenuInit();
            self.bindEvents();
        });
    };

    LiveEditor.prototype.initVars = function (params) {
        this.$editor = $(params.editor);
        this.$codePainel = $('#code-painel').find('textarea');
        this.$editHtmlModal = $('#edit-html-modal');
        this.$editTextModal = $('#edit-text-modal');
        this.$editClassesModal = $('#edit-classes-modal');
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
        window.floatingMenu = window.floatingMenu || new FloatingMenu();
    };

    LiveEditor.prototype.modalEvents = function () {
        var self = this;

        // Edit HTML
        this.$editHtmlModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                html = current_without_cache.outerHTML;
            $(this).find('.modal-body textarea').val(html);
        });

        $('#edit-html-modal-save').on('click', function() {
            self.operationInit('edit-html-save');
            self.$editHtmlModal.modal('hide');
        });

        // Edit Text
        this.$editTextModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected)[0],
                text = current_without_cache.textContent;
            $(this).find('.modal-body textarea').val(text);
        });

        $('#edit-text-modal-save').on('click', function() {
            self.operationInit('edit-text-save');
            self.$editTextModal.modal('hide');
        });

        // Edit Classes
        this.$editClassesModal.on('show.bs.modal', function () {
            var current_without_cache = self.$editorIframe.contents().find(self.currentSelected),
                classes = current_without_cache.attr('class');
            $(this).find('.modal-body input').val(classes);
        });

        $('#edit-classes-modal-save').on('click', function() {
            self.operationInit('edit-classes-save');
            self.$editClassesModal.modal('hide');
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
            floatingMenu.close();
            this.domOutline.start();
        }
    };

    LiveEditor.prototype.sendEventOnClick = function () {
        var _event = new Event('domOutlineOnClick');
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

            floatingMenu.create({
                value: this.$currentSelected.prop('tagName').toLowerCase(),
                posLeft: left + $DomOutlineBox.offset().left + $DomOutlineBox.width(),
                posTop: top + $DomOutlineBox.offset().top - scrollTop,
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
},{}],3:[function(require,module,exports){
/*global document:false*/
/*global window:false*/
/*global jQuery:false*/
/*global setTimeout:false*/

/**
 * Firebug/Web Inspector Outline Implementation using jQuery
 * Tested to work in Chrome, FF, Safari. Buggy in IE ;(
 * Andrew Childs <ac@glomerate.com>
 *
 * Example Setup:
 * var myClickHandler = function (element) { console.log('Clicked element:', element); }
 * var myDomOutline = DomOutline({ onClick: myClickHandler });
 *
 * Public API:
 * myDomOutline.start();
 * myDomOutline.stop();
 */
 
var DomOutline = function (options) {
    'use strict';

    options = options || {};

    var pub = {},
        self = {
            opts: {
                namespace: options.namespace || 'DomOutline',
                onClick: options.onClick || false,
                realtime: options.realtime || false,
                $elem: options.elem || jQuery('body')
            },
            keyCodes: {
                BACKSPACE: 8,
                ESC: 27,
                DELETE: 46
            },
            active: false,
            initialized: false,
            elements: {}
        };

    function writeStylesheet(css) {
        var element = document.createElement('style');
        element.type = 'text/css';

        if (self.opts.$elem) {
            self.opts.$elem.append(element);
        } else {
            document.getElementsByTagName('head')[0].appendChild(element);
        }

        if (element.styleSheet) {
            element.styleSheet.cssText = css; // IE
        } else {
            element.innerHTML = css; // Non-IE
        }
    }

    function initStylesheet() {
        var css = '';

        if (self.initialized !== true) {
            css +=
                '.' + self.opts.namespace + ' {' +
                '    background: rgba(0, 153, 204, 0.05);' +
                '    position: fixed;' +
                '    z-index: 1000000;' +
                '    pointer-events: none;' +
                '    outline: 3px solid rgb(0, 153, 204);' +
                '}' +
                '.' + self.opts.namespace + '_label {' +
                '    background: #09c;' +
                '    boroutlineder-radius: 2px;' +
                '    color: #fff;' +
                '    font: bold 12px/12px Helvetica, sans-serif;' +
                '    padding: 4px 6px;' +
                '    position: fixed;' +
                '    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);' +
                '    z-index: 1000001;' +
                '    pointer-events: none;' +
                '}' +
                '.' + self.opts.namespace + '_box {' +
                '    background: rgba(0, 153, 204, 0.05);' +
                '    position: absolute;' +
                '    z-index: 1000000;' +
                '    pointer-events: none;' +
                '    outline: 3px solid rgb(0, 153, 204);' +
                '    box-shadow: 6px 6px 2px rgba(0, 0, 0, 0.2);' +
                '}';

            writeStylesheet(css);
            self.initialized = true;
        }
    }

    function createOutlineElements() {
        self.elements.top = jQuery('<div>').addClass(self.opts.namespace).insertAfter(self.opts.$elem);
        self.elements.bottom = jQuery('<div>').addClass(self.opts.namespace).insertAfter(self.opts.$elem);
        self.elements.left = jQuery('<div>').addClass(self.opts.namespace).insertAfter(self.opts.$elem);
        self.elements.right = jQuery('<div>').addClass(self.opts.namespace).insertAfter(self.opts.$elem);

        self.elements.box = jQuery('<div>').addClass(self.opts.namespace + '_box').insertAfter(self.opts.$elem);
    }

    function removeOutlineElements() {
        jQuery.each(self.elements, function (name, element) {
            element.remove();
        });
    }

    function getScrollTop() {
        // Verify if is necessary
        if (!self.elements.window) {
            self.elements.window = jQuery(window);
        }
        return self.elements.window.scrollTop();
    }

    function stopOnEscape(e) {
        if (e.keyCode === self.keyCodes.ESC || e.keyCode === self.keyCodes.BACKSPACE || e.keyCode === self.keyCodes.DELETE) {
            pub.stop();
        }

        return false;
    }

    function draw(e) {
        if (e.target.className.indexOf(self.opts.namespace) !== -1) {
            return;
        }

        pub.element = e.target;

        var scroll_top = getScrollTop(),
            pos = pub.element.getBoundingClientRect(),
            top = pos.top + scroll_top,
            label_text = '',
            label_top = 0,
            label_left = 0;

        
        self.elements.box.css({
            top: self.opts.$elem.scrollTop() + pos.top - 1,
            left: pos.left - 1,
            width: pos.width + 2,
            height: pos.height + 2
        });
    }

    function clickHandler(e) {
        if (!self.opts.realtime) {
            draw(e);
        }
        self.opts.onClick(pub.element);
        return false;
    }

    pub.start = function () {
        removeOutlineElements();
        initStylesheet();
        if (self.active !== true) {
            self.active = true;
            createOutlineElements();

            self.opts.$elem.bind('keyup.' + self.opts.namespace, stopOnEscape);
            if (self.opts.onClick) {
                setTimeout(function () {
                    self.opts.$elem.bind('click.' + self.opts.namespace, clickHandler);
                }, 50);
            }

            if (self.opts.realtime) {
                self.opts.$elem.bind('mousemove.' + self.opts.namespace, draw);
            }
        }
    };

    pub.stop = function () {
        self.active = false;
        removeOutlineElements();
        self.opts.$elem.unbind('mousemove.' + self.opts.namespace)
            .unbind('keyup.' + self.opts.namespace)
            .unbind('click.' + self.opts.namespace);
    };

    pub.pause = function () {
        self.active = false;
        self.opts.$elem.unbind('mousemove.' + self.opts.namespace)
            .unbind('keyup.' + self.opts.namespace)
            .unbind('click.' + self.opts.namespace);
    };

    return pub;
}; 
},{}]},{},[3,1,2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXJsZW5lc2FudG9zL3BsYXlncm91bmQvTGl2ZUVkaXRvci9zdGF0aWMvanMvZmxvYXRpbmdfbWVudS5qcyIsIi9Vc2Vycy9kYXJsZW5lc2FudG9zL3BsYXlncm91bmQvTGl2ZUVkaXRvci9zdGF0aWMvanMvbGl2ZV9lZGl0b3IuanMiLCIvVXNlcnMvZGFybGVuZXNhbnRvcy9wbGF5Z3JvdW5kL0xpdmVFZGl0b3Ivc3RhdGljL3ZlbmRvci9qcXVlcnkuZG9tLW91dGxpbmUvanF1ZXJ5LmRvbS1vdXRsaW5lLTEuMC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCAkICovXG5cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGbG9hdGluZ01lbnUgPSBmdW5jdGlvbiBGbG9hdGluZ01lbnUgKHBhcmFtcykge1xuICAgICAgICB0aGlzLmluaXQocGFyYW1zKTtcbiAgICB9O1xuXG4gICAgRmxvYXRpbmdNZW51LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLiRtZW51ID0gJCgnPHVsIGlkPVwiZmxvYXRpbmctc2V0dGluZ3NcIiBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPicpO1xuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMuJG1lbnUpO1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9O1xuXG4gICAgRmxvYXRpbmdNZW51LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtcy52YWx1ZSB8fCAnKGVsZW1lbnQpJyxcbiAgICAgICAgICAgIHBvc1RvcCA9IHBhcmFtcy5wb3NUb3AgfHwgMCxcbiAgICAgICAgICAgIHBvc0xlZnQgPSBwYXJhbXMucG9zTGVmdCB8fCAwLFxuICAgICAgICAgICAgbWVudUh0bWwgPSB0aGlzLm5ld0l0ZW0oe3ZhbHVlOiB2YWx1ZSwgaXNfaGVhZGVyOiB0cnVlfSksXG4gICAgICAgICAgICBlZGl0TGlzdCA9IFt7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICdFZGl0IEhUTUwnLFxuICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdkYXRhLW9wZXJhdGlvbic6ICdlZGl0LWh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAnZGF0YS10b2dnbGUnOiAnbW9kYWwnLCBcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEtdGFyZ2V0JzonI2VkaXQtaHRtbC1tb2RhbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ0VkaXQgVGV4dCcsXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEtb3BlcmF0aW9uJzogJ2VkaXQtdGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICdtb2RhbCcsIFxuICAgICAgICAgICAgICAgICAgICAnZGF0YS10YXJnZXQnOicjZWRpdC10ZXh0LW1vZGFsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnRWRpdCBDbGFzc2VzJyxcbiAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAnZGF0YS1vcGVyYXRpb24nOiAnZWRpdC1jbGFzc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ21vZGFsJywgXG4gICAgICAgICAgICAgICAgICAgICdkYXRhLXRhcmdldCc6JyNlZGl0LWNsYXNzZXMtbW9kYWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnRWRpdCBTdHlsZScsXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEtb3BlcmF0aW9uJzogJ2VkaXQtc3R5bGUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBldmVudHMgPSBbe1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnQ2xpY2snLFxuICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdkYXRhLW9wZXJhdGlvbic6ICdhZGQtZXZlbnQtY2xpY2snXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV07XG5cbiAgICAgICAgbWVudUh0bWwgKz0gdGhpcy5uZXdJdGVtKHt2YWx1ZTogJ0VkaXQgRWxlbWVudCcsIGl0ZW1zOiBlZGl0TGlzdCB9KTtcbiAgICAgICAgbWVudUh0bWwgKz0gdGhpcy5uZXdJdGVtKHthdHRyczogeydjbGFzcyc6ICdkaXZpZGVyJ319KTtcbiAgICAgICAgbWVudUh0bWwgKz0gdGhpcy5uZXdJdGVtKHt2YWx1ZTogJ01vdmUgYW5kIFJlc2l6ZScsIGF0dHJzOiB7J2RhdGEtb3BlcmF0aW9uJzogJ21vdmUtYW5kLXJlc2l6ZSd9fSk7XG4gICAgICAgIG1lbnVIdG1sICs9IHRoaXMubmV3SXRlbSh7dmFsdWU6ICdSZW1vdmUnLCBhdHRyczogeydkYXRhLW9wZXJhdGlvbic6ICdyZW1vdmUnfX0pO1xuICAgICAgICBtZW51SHRtbCArPSB0aGlzLm5ld0l0ZW0oe2F0dHJzOiB7J2NsYXNzJzogJ2RpdmlkZXInfX0pO1xuICAgICAgICBtZW51SHRtbCArPSB0aGlzLm5ld0l0ZW0oe3ZhbHVlOiAnU2VsZWN0IENvbnRhaW5lcicsIGl0ZW1zOiBwYXJhbXMuY29udGFpbmVyfSk7XG4gICAgICAgIG1lbnVIdG1sICs9IHRoaXMubmV3SXRlbSh7YXR0cnM6IHsnY2xhc3MnOiAnZGl2aWRlcid9fSk7XG4gICAgICAgIG1lbnVIdG1sICs9IHRoaXMubmV3SXRlbSh7dmFsdWU6ICdDcmVhdGUgbmV3IGdvYWwnLCBpdGVtczogZXZlbnRzfSk7XG5cbiAgICAgICAgdGhpcy4kbWVudS5hcHBlbmQobWVudUh0bWwpO1xuICAgICAgICB0aGlzLiRtZW51LmNzcyh7XG4gICAgICAgICAgICB0b3A6IHBvc1RvcCAtIDEwLFxuICAgICAgICAgICAgbGVmdDogcG9zTGVmdCArIDEwXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGbG9hdGluZ01lbnUucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJG1lbnUub24oJ2NsaWNrJywgJ2xpJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyICRlbCA9ICQoZS50b0VsZW1lbnQpLnBhcmVudCgpLFxuICAgICAgICAgICAgICAgIG9wID0gJGVsLmRhdGEoJ29wZXJhdGlvbicpO1xuXG4gICAgICAgICAgICBpZiAob3ApIHtcbiAgICAgICAgICAgICAgICB2YXIgX2V2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdmbG9hdGluZ01lbnVJdGVtQ2xpY2tlZCcsIHsnZGV0YWlsJzogeydvcGVyYXRpb24nOiBvcH19KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KF9ldmVudCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ09wZXJhdGlvbjogJyArIG9wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEZsb2F0aW5nTWVudS5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kbWVudS5zaG93KCk7XG4gICAgfTtcblxuICAgIEZsb2F0aW5nTWVudS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJG1lbnUuaGlkZSgpO1xuICAgICAgICB0aGlzLiRtZW51LmVtcHR5KCk7XG4gICAgfTtcblxuICAgIEZsb2F0aW5nTWVudS5wcm90b3R5cGUubmV3SXRlbSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyICRsaSA9ICQoJzxsaT4nKTtcblxuICAgICAgICBpZiAocGFyYW1zLmF0dHJzKSB7XG4gICAgICAgICAgICAkbGkuYXR0cihwYXJhbXMuYXR0cnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5pc19oZWFkZXIpIHtcbiAgICAgICAgICAgICRsaS5hZGRDbGFzcygnZHJvcGRvd24taGVhZGVyJylcbiAgICAgICAgICAgICAgIC50ZXh0KCc8JyArIHBhcmFtcy52YWx1ZSArICc+Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnZhbHVlKSB7XG4gICAgICAgICAgICAkbGkuYXBwZW5kKCc8YSB0YWJpbmRleD1cIi0xXCIgaHJlZj1cIiNcIj4nICsgcGFyYW1zLnZhbHVlICsgJzwvYT4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuaXRlbXMpIHtcbiAgICAgICAgICAgIHZhciAkc3ViTWVudSA9ICQoJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4nKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPD1wYXJhbXMuaXRlbXMubGVuZ3RoLTE7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciAkX2xpID0gJCgnPGxpIGNsYXNzPVwiY29udGFpbmVyLWl0ZW0tZWxcIj4nKTtcblxuICAgICAgICAgICAgICAgICRfbGkuYXR0cihwYXJhbXMuaXRlbXNbaV0uYXR0cnMpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxhIHRhYmluZGV4PVwiLTFcIiBocmVmPVwiI1wiPicgKyBwYXJhbXMuaXRlbXNbaV0udmFsdWUgKyAnPC9hPicpO1xuXG4gICAgICAgICAgICAgICAgJHN1Yk1lbnUuYXBwZW5kKCRfbGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbGkuYWRkQ2xhc3MoJ2Ryb3Bkb3duLXN1Ym1lbnUnKTtcbiAgICAgICAgICAgICRsaS5hcHBlbmQoJHN1Yk1lbnUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRsaS5wcm9wKCdvdXRlckhUTUwnKTtcbiAgICB9XG5cbiAgICB3aW5kb3cuRmxvYXRpbmdNZW51ID0gRmxvYXRpbmdNZW51O1xufSkod2luZG93LCBkb2N1bWVudCwgJCk7IiwiLyogZ2xvYmFsICQgKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIExpdmVFZGl0b3IgPSBmdW5jdGlvbiBMaXZlRWRpdG9yIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xpdmUgRWRpdG9yIEluaXQuLi4nKTtcbiAgICAgICAgdGhpcy5pbml0KHBhcmFtcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMaXZlIEVkaXRvciBEb25lLi4uJyk7XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLmluaXRWYXJzKHBhcmFtcyk7XG4gICAgICAgIHRoaXMuYnVpbGRJZnJhbWUocGFyYW1zKTtcblxuICAgICAgICB0aGlzLiRlZGl0b3JJZnJhbWUub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuZG9tT3V0bGluZUluaXQoKTtcbiAgICAgICAgICAgIHNlbGYuZmxvYXRpbmdNZW51SW5pdCgpO1xuICAgICAgICAgICAgc2VsZi5iaW5kRXZlbnRzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5pbml0VmFycyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy4kZWRpdG9yID0gJChwYXJhbXMuZWRpdG9yKTtcbiAgICAgICAgdGhpcy4kY29kZVBhaW5lbCA9ICQoJyNjb2RlLXBhaW5lbCcpLmZpbmQoJ3RleHRhcmVhJyk7XG4gICAgICAgIHRoaXMuJGVkaXRIdG1sTW9kYWwgPSAkKCcjZWRpdC1odG1sLW1vZGFsJyk7XG4gICAgICAgIHRoaXMuJGVkaXRUZXh0TW9kYWwgPSAkKCcjZWRpdC10ZXh0LW1vZGFsJyk7XG4gICAgICAgIHRoaXMuJGVkaXRDbGFzc2VzTW9kYWwgPSAkKCcjZWRpdC1jbGFzc2VzLW1vZGFsJyk7XG4gICAgICAgIHRoaXMuZG9tT3V0bGluZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2NyaXB0TGlzdCA9IFtdO1xuICAgICAgICB0aGlzLnNjcmlwdEdvYWwgPSBbXTtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUuYnVpbGRJZnJhbWUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciAkaWZyYW1lID0gJCgnPGlmcmFtZT4nKTtcbiAgICAgICAgJGlmcmFtZS5hdHRyKHtcbiAgICAgICAgICAgICdzcmMnOiBwYXJhbXMudXJsLFxuICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICdmcmFtZWJvcmRlcic6ICcwJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlZGl0b3IuYXBwZW5kKCRpZnJhbWUpO1xuICAgICAgICB0aGlzLiRlZGl0b3IuYWRkQ2xhc3MoJ2xpdmUtZWRpdG9yJyk7XG5cbiAgICAgICAgdGhpcy4kZWRpdG9ySWZyYW1lID0gdGhpcy4kZWRpdG9yLmZpbmQoJ2lmcmFtZScpO1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5kb21PdXRsaW5lSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kb21PdXRsaW5lID0gbmV3IERvbU91dGxpbmUoe1xuICAgICAgICAgICAgcmVhbHRpbWU6IHRydWUsXG4gICAgICAgICAgICBvbkNsaWNrOiB0aGlzLnNlbmRFdmVudE9uQ2xpY2ssXG4gICAgICAgICAgICBlbGVtOiB0aGlzLiRlZGl0b3JJZnJhbWUuY29udGVudHMoKS5maW5kKCdodG1sIGJvZHknKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kb21PdXRsaW5lLnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmZsb2F0aW5nTWVudUluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5mbG9hdGluZ01lbnUgPSB3aW5kb3cuZmxvYXRpbmdNZW51IHx8IG5ldyBGbG9hdGluZ01lbnUoKTtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUubW9kYWxFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBFZGl0IEhUTUxcbiAgICAgICAgdGhpcy4kZWRpdEh0bWxNb2RhbC5vbignc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3dpdGhvdXRfY2FjaGUgPSBzZWxmLiRlZGl0b3JJZnJhbWUuY29udGVudHMoKS5maW5kKHNlbGYuY3VycmVudFNlbGVjdGVkKVswXSxcbiAgICAgICAgICAgICAgICBodG1sID0gY3VycmVudF93aXRob3V0X2NhY2hlLm91dGVySFRNTDtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1vZGFsLWJvZHkgdGV4dGFyZWEnKS52YWwoaHRtbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNlZGl0LWh0bWwtbW9kYWwtc2F2ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5vcGVyYXRpb25Jbml0KCdlZGl0LWh0bWwtc2F2ZScpO1xuICAgICAgICAgICAgc2VsZi4kZWRpdEh0bWxNb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBFZGl0IFRleHRcbiAgICAgICAgdGhpcy4kZWRpdFRleHRNb2RhbC5vbignc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3dpdGhvdXRfY2FjaGUgPSBzZWxmLiRlZGl0b3JJZnJhbWUuY29udGVudHMoKS5maW5kKHNlbGYuY3VycmVudFNlbGVjdGVkKVswXSxcbiAgICAgICAgICAgICAgICB0ZXh0ID0gY3VycmVudF93aXRob3V0X2NhY2hlLnRleHRDb250ZW50O1xuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcubW9kYWwtYm9keSB0ZXh0YXJlYScpLnZhbCh0ZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI2VkaXQtdGV4dC1tb2RhbC1zYXZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLm9wZXJhdGlvbkluaXQoJ2VkaXQtdGV4dC1zYXZlJyk7XG4gICAgICAgICAgICBzZWxmLiRlZGl0VGV4dE1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEVkaXQgQ2xhc3Nlc1xuICAgICAgICB0aGlzLiRlZGl0Q2xhc3Nlc01vZGFsLm9uKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfd2l0aG91dF9jYWNoZSA9IHNlbGYuJGVkaXRvcklmcmFtZS5jb250ZW50cygpLmZpbmQoc2VsZi5jdXJyZW50U2VsZWN0ZWQpLFxuICAgICAgICAgICAgICAgIGNsYXNzZXMgPSBjdXJyZW50X3dpdGhvdXRfY2FjaGUuYXR0cignY2xhc3MnKTtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1vZGFsLWJvZHkgaW5wdXQnKS52YWwoY2xhc3Nlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNlZGl0LWNsYXNzZXMtbW9kYWwtc2F2ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5vcGVyYXRpb25Jbml0KCdlZGl0LWNsYXNzZXMtc2F2ZScpO1xuICAgICAgICAgICAgc2VsZi4kZWRpdENsYXNzZXNNb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMubW9kYWxFdmVudHMoKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkb21PdXRsaW5lT25DbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZWxmLnNldEN1cnJlbnRFbGVtZW50KHNlbGYuZG9tT3V0bGluZS5lbGVtZW50KTtcbiAgICAgICAgICAgIHNlbGYub3BlbkN1cnJlbnRTZXR0aW5ncygpO1xuICAgICAgICAgICAgc2VsZi5kb21PdXRsaW5lLnBhdXNlKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmbG9hdGluZ01lbnVJdGVtQ2xpY2tlZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZWxmLm9wZXJhdGlvbkluaXQoZS5kZXRhaWwub3BlcmF0aW9uKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuJGVkaXRvcklmcmFtZS5jb250ZW50cygpLmZpbmQoJ2h0bWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBzZWxmLnVuc2VsZWN0RWxlbWVudHMoZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVkaXRvcklmcmFtZS5jb250ZW50cygpLmtleXVwKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMjcpIHsgLy8gRXNjXG4gICAgICAgICAgICAgICAgc2VsZi51bnNlbGVjdEVsZW1lbnRzKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUudW5zZWxlY3RFbGVtZW50cyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRvRWxlbWVudCAhPSB0aGlzLiRjdXJyZW50U2VsZWN0ZWRbMF0pIHtcbiAgICAgICAgICAgIGZsb2F0aW5nTWVudS5jbG9zZSgpO1xuICAgICAgICAgICAgdGhpcy5kb21PdXRsaW5lLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUuc2VuZEV2ZW50T25DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9ldmVudCA9IG5ldyBFdmVudCgnZG9tT3V0bGluZU9uQ2xpY2snKTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChfZXZlbnQpO1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5zZXRDdXJyZW50RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNlbGVjdGVkID0gdGhpcy5nZXRFbGVtZW50UGF0aChlbGVtKTtcbiAgICAgICAgdGhpcy4kY3VycmVudFNlbGVjdGVkID0gdGhpcy4kZWRpdG9ySWZyYW1lLmNvbnRlbnRzKCkuZmluZCh0aGlzLmN1cnJlbnRTZWxlY3RlZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50OiAnICsgIHRoaXMuY3VycmVudFNlbGVjdGVkKTtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUuZ2V0RWxlbWVudFBhdGggPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICBpZiAoZWxlbS5sZW5ndGggIT0gMSlcbiAgICAgICAgICAgIGVsZW0gPSAkKGVsZW0pO1xuXG4gICAgICAgIHZhciBwYXRoLCBub2RlID0gZWxlbTtcbiAgICAgICAgd2hpbGUgKG5vZGUubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgcmVhbE5vZGUgPSBub2RlWzBdLCBuYW1lID0gcmVhbE5vZGUubG9jYWxOYW1lO1xuICAgICAgICAgICAgaWYgKCFuYW1lKSBicmVhaztcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xuXG4gICAgICAgICAgICB2YXIgc2libGluZ3MgPSBwYXJlbnQuY2hpbGRyZW4obmFtZSk7XG4gICAgICAgICAgICBpZiAoc2libGluZ3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gJzplcSgnICsgc2libGluZ3MuaW5kZXgocmVhbE5vZGUpICsgJyknO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXRoID0gbmFtZSArIChwYXRoID8gJz4nICsgcGF0aCA6ICcnKTtcbiAgICAgICAgICAgIG5vZGUgPSBwYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUuZ2V0Q3VycmVudFBhcmVudFBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gdGhpcy4kY3VycmVudFNlbGVjdGVkWzBdO1xuICAgICAgICB2YXIgZWxzID0gW107XG4gICAgICAgIHdoaWxlIChhKSB7XG4gICAgICAgICAgICBlbHMudW5zaGlmdChhKTtcbiAgICAgICAgICAgIGEgPSBhLnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVscztcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUub3BlbkN1cnJlbnRTZXR0aW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNlbGVjdGVkKSB7XG4gICAgICAgICAgICB2YXIgJERvbU91dGxpbmVCb3ggPSB0aGlzLiRlZGl0b3JJZnJhbWUuY29udGVudHMoKS5maW5kKCcuRG9tT3V0bGluZV9ib3gnKSxcbiAgICAgICAgICAgICAgICB0b3AgPSB0aGlzLiRlZGl0b3JJZnJhbWUub2Zmc2V0KCkudG9wLFxuICAgICAgICAgICAgICAgIGxlZnQgPSB0aGlzLiRlZGl0b3JJZnJhbWUub2Zmc2V0KCkubGVmdCxcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSB0aGlzLiRlZGl0b3JJZnJhbWUuY29udGVudHMoKS5zY3JvbGxUb3AoKTtcblxuICAgICAgICAgICAgZmxvYXRpbmdNZW51LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuJGN1cnJlbnRTZWxlY3RlZC5wcm9wKCd0YWdOYW1lJykudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICBwb3NMZWZ0OiBsZWZ0ICsgJERvbU91dGxpbmVCb3gub2Zmc2V0KCkubGVmdCArICREb21PdXRsaW5lQm94LndpZHRoKCksXG4gICAgICAgICAgICAgICAgcG9zVG9wOiB0b3AgKyAkRG9tT3V0bGluZUJveC5vZmZzZXQoKS50b3AgLSBzY3JvbGxUb3AsXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiB0aGlzLmNvbnRhaW5lckZvcm1hdCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZsb2F0aW5nTWVudS5vcGVuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gaXRlbSBoYXMgYmVlbiBzZWxlY3RlZC4uLicpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmNvbnRhaW5lckZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhdGhMaXN0ID0gdGhpcy5nZXRDdXJyZW50UGFyZW50UGF0aCgpLFxuICAgICAgICAgICAgX2xpc3QgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPD0gcGF0aExpc3QubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGF0aExpc3RbaV0udGFnTmFtZSkge1xuICAgICAgICAgICAgICAgIF9saXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcGF0aExpc3RbaV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpcy5nZXRFbGVtZW50UGF0aChwYXRoTGlzdFtpXSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9saXN0O1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5vcGVyYXRpb25Jbml0ID0gZnVuY3Rpb24gKG9wZXJhdGlvbikge1xuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAncmVtb3ZlJykge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2VsZWN0ZWRSZW1vdmUoKTtcbiAgICAgICAgICAgIGZsb2F0aW5nTWVudS5jbG9zZSgpO1xuICAgICAgICAgICAgdGhpcy5kb21PdXRsaW5lLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnYWRkLWV2ZW50LWNsaWNrJykge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2VsZWN0ZWRBZGRFdmVudCgnY2xpY2snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICdlZGl0LWh0bWwtc2F2ZScpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlbGVjdGVkRWRpdEh0bWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICdlZGl0LXRleHQtc2F2ZScpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlbGVjdGVkRWRpdFRleHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICdlZGl0LWNsYXNzZXMtc2F2ZScpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlbGVjdGVkRWRpdENsYXNzZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29kZVBhaW5lbFVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5jdXJyZW50U2VsZWN0ZWRSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdHIgPSAnJChcIicgKyB0aGlzLmN1cnJlbnRTZWxlY3RlZCArICdcIikucmVtb3ZlKCk7JztcbiAgICAgICAgdGhpcy5hZGRUb1NjcmlwdExpc3Qoc3RyKTtcbiAgICAgICAgdGhpcy4kZWRpdG9ySWZyYW1lLmNvbnRlbnRzKCkuZmluZCh0aGlzLmN1cnJlbnRTZWxlY3RlZCkucmVtb3ZlKCk7XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmN1cnJlbnRTZWxlY3RlZEFkZEV2ZW50ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHN0ciA9ICckKFwiJyArIHRoaXMuY3VycmVudFNlbGVjdGVkICsgJ1wiKS5hdHRyKFwiZWFzeWFiLXRyYWNrLScgKyBlICsgJ1wiLCAxKTsnO1xuXG4gICAgICAgIHRoaXMuYWRkVG9TY3JpcHRHb2FsKHN0cik7XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmN1cnJlbnRTZWxlY3RlZEVkaXRIdG1sID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaHRtbCA9IHRoaXMuJGVkaXRIdG1sTW9kYWwuZmluZCgnLm1vZGFsLWJvZHkgdGV4dGFyZWEnKS52YWwoKSxcbiAgICAgICAgICAgIHN0ciA9ICckKFwiJyArIHRoaXMuY3VycmVudFNlbGVjdGVkICsgJ1wiKS5yZXBsYWNlV2l0aChcIicgKyBodG1sICsgJ1wiKTsnO1xuXG4gICAgICAgIHRoaXMuYWRkVG9TY3JpcHRMaXN0KHN0cik7XG4gICAgICAgIHRoaXMuJGVkaXRvcklmcmFtZS5jb250ZW50cygpLmZpbmQodGhpcy5jdXJyZW50U2VsZWN0ZWQpLnJlcGxhY2VXaXRoKGh0bWwpO1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5jdXJyZW50U2VsZWN0ZWRFZGl0VGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRleHQgPSB0aGlzLiRlZGl0VGV4dE1vZGFsLmZpbmQoJy5tb2RhbC1ib2R5IHRleHRhcmVhJykudmFsKCksXG4gICAgICAgICAgICBzdHIgPSAnJChcIicgKyB0aGlzLmN1cnJlbnRTZWxlY3RlZCArICdcIikudGV4dChcIicgKyB0ZXh0ICsgJ1wiKTsnO1xuXG4gICAgICAgIHRoaXMuYWRkVG9TY3JpcHRMaXN0KHN0cik7XG4gICAgICAgIHRoaXMuJGVkaXRvcklmcmFtZS5jb250ZW50cygpLmZpbmQodGhpcy5jdXJyZW50U2VsZWN0ZWQpLnRleHQodGV4dCk7XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmN1cnJlbnRTZWxlY3RlZEVkaXRDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xhc3NlcyA9IHRoaXMuJGVkaXRDbGFzc2VzTW9kYWwuZmluZCgnLm1vZGFsLWJvZHkgaW5wdXQnKS52YWwoKSxcbiAgICAgICAgICAgIHN0ciA9ICckKFwiJyArIHRoaXMuY3VycmVudFNlbGVjdGVkICsgJ1wiKS5hdHRyKFwiY2xhc3NcIiwgXCInICsgY2xhc3NlcyArICdcIik7JztcblxuICAgICAgICB0aGlzLmFkZFRvU2NyaXB0TGlzdChzdHIpO1xuICAgICAgICB0aGlzLiRlZGl0b3JJZnJhbWUuY29udGVudHMoKS5maW5kKHRoaXMuY3VycmVudFNlbGVjdGVkKS5hdHRyKCdjbGFzcycsIGNsYXNzZXMpO1xuICAgIH07XG5cbiAgICBMaXZlRWRpdG9yLnByb3RvdHlwZS5hZGRUb1NjcmlwdExpc3QgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHRoaXMuc2NyaXB0TGlzdC5wdXNoKHN0cik7XG4gICAgfTtcblxuICAgIExpdmVFZGl0b3IucHJvdG90eXBlLmFkZFRvU2NyaXB0R29hbCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgdGhpcy5zY3JpcHRHb2FsLnB1c2goc3RyKTtcblxuICAgICAgICAvLyB3b3JrYXJvdW5kLi4uIHRvIHJlbW92ZSBkdXBsaWNhdGVzLlxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICQuZWFjaCh0aGlzLnNjcmlwdEdvYWwsIGZ1bmN0aW9uKGksIGUpIHtcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZSwgcmVzdWx0KSA9PSAtMSkgcmVzdWx0LnB1c2goZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2NyaXB0R29hbCA9IHJlc3VsdDtcbiAgICB9O1xuXG4gICAgTGl2ZUVkaXRvci5wcm90b3R5cGUuY29kZVBhaW5lbFVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kY29kZVBhaW5lbC52YWwodGhpcy5zY3JpcHRMaXN0KTtcbiAgICB9O1xuXG4gICAgd2luZG93LkxpdmVFZGl0b3IgPSBMaXZlRWRpdG9yO1xufSkod2luZG93LCBkb2N1bWVudCwgJCk7IiwiLypnbG9iYWwgZG9jdW1lbnQ6ZmFsc2UqL1xuLypnbG9iYWwgd2luZG93OmZhbHNlKi9cbi8qZ2xvYmFsIGpRdWVyeTpmYWxzZSovXG4vKmdsb2JhbCBzZXRUaW1lb3V0OmZhbHNlKi9cblxuLyoqXG4gKiBGaXJlYnVnL1dlYiBJbnNwZWN0b3IgT3V0bGluZSBJbXBsZW1lbnRhdGlvbiB1c2luZyBqUXVlcnlcbiAqIFRlc3RlZCB0byB3b3JrIGluIENocm9tZSwgRkYsIFNhZmFyaS4gQnVnZ3kgaW4gSUUgOyhcbiAqIEFuZHJldyBDaGlsZHMgPGFjQGdsb21lcmF0ZS5jb20+XG4gKlxuICogRXhhbXBsZSBTZXR1cDpcbiAqIHZhciBteUNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7IGNvbnNvbGUubG9nKCdDbGlja2VkIGVsZW1lbnQ6JywgZWxlbWVudCk7IH1cbiAqIHZhciBteURvbU91dGxpbmUgPSBEb21PdXRsaW5lKHsgb25DbGljazogbXlDbGlja0hhbmRsZXIgfSk7XG4gKlxuICogUHVibGljIEFQSTpcbiAqIG15RG9tT3V0bGluZS5zdGFydCgpO1xuICogbXlEb21PdXRsaW5lLnN0b3AoKTtcbiAqL1xuIFxudmFyIERvbU91dGxpbmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHB1YiA9IHt9LFxuICAgICAgICBzZWxmID0ge1xuICAgICAgICAgICAgb3B0czoge1xuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogb3B0aW9ucy5uYW1lc3BhY2UgfHwgJ0RvbU91dGxpbmUnLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IG9wdGlvbnMub25DbGljayB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICByZWFsdGltZTogb3B0aW9ucy5yZWFsdGltZSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICAkZWxlbTogb3B0aW9ucy5lbGVtIHx8IGpRdWVyeSgnYm9keScpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAga2V5Q29kZXM6IHtcbiAgICAgICAgICAgICAgICBCQUNLU1BBQ0U6IDgsXG4gICAgICAgICAgICAgICAgRVNDOiAyNyxcbiAgICAgICAgICAgICAgICBERUxFVEU6IDQ2XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiB7fVxuICAgICAgICB9O1xuXG4gICAgZnVuY3Rpb24gd3JpdGVTdHlsZXNoZWV0KGNzcykge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIGVsZW1lbnQudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICAgICAgaWYgKHNlbGYub3B0cy4kZWxlbSkge1xuICAgICAgICAgICAgc2VsZi5vcHRzLiRlbGVtLmFwcGVuZChlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzczsgLy8gSUVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gY3NzOyAvLyBOb24tSUVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRTdHlsZXNoZWV0KCkge1xuICAgICAgICB2YXIgY3NzID0gJyc7XG5cbiAgICAgICAgaWYgKHNlbGYuaW5pdGlhbGl6ZWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGNzcyArPVxuICAgICAgICAgICAgICAgICcuJyArIHNlbGYub3B0cy5uYW1lc3BhY2UgKyAnIHsnICtcbiAgICAgICAgICAgICAgICAnICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMTUzLCAyMDQsIDAuMDUpOycgK1xuICAgICAgICAgICAgICAgICcgICAgcG9zaXRpb246IGZpeGVkOycgK1xuICAgICAgICAgICAgICAgICcgICAgei1pbmRleDogMTAwMDAwMDsnICtcbiAgICAgICAgICAgICAgICAnICAgIHBvaW50ZXItZXZlbnRzOiBub25lOycgK1xuICAgICAgICAgICAgICAgICcgICAgb3V0bGluZTogM3B4IHNvbGlkIHJnYigwLCAxNTMsIDIwNCk7JyArXG4gICAgICAgICAgICAgICAgJ30nICtcbiAgICAgICAgICAgICAgICAnLicgKyBzZWxmLm9wdHMubmFtZXNwYWNlICsgJ19sYWJlbCB7JyArXG4gICAgICAgICAgICAgICAgJyAgICBiYWNrZ3JvdW5kOiAjMDljOycgK1xuICAgICAgICAgICAgICAgICcgICAgYm9yb3V0bGluZWRlci1yYWRpdXM6IDJweDsnICtcbiAgICAgICAgICAgICAgICAnICAgIGNvbG9yOiAjZmZmOycgK1xuICAgICAgICAgICAgICAgICcgICAgZm9udDogYm9sZCAxMnB4LzEycHggSGVsdmV0aWNhLCBzYW5zLXNlcmlmOycgK1xuICAgICAgICAgICAgICAgICcgICAgcGFkZGluZzogNHB4IDZweDsnICtcbiAgICAgICAgICAgICAgICAnICAgIHBvc2l0aW9uOiBmaXhlZDsnICtcbiAgICAgICAgICAgICAgICAnICAgIHRleHQtc2hhZG93OiAwIDFweCAxcHggcmdiYSgwLCAwLCAwLCAwLjI1KTsnICtcbiAgICAgICAgICAgICAgICAnICAgIHotaW5kZXg6IDEwMDAwMDE7JyArXG4gICAgICAgICAgICAgICAgJyAgICBwb2ludGVyLWV2ZW50czogbm9uZTsnICtcbiAgICAgICAgICAgICAgICAnfScgK1xuICAgICAgICAgICAgICAgICcuJyArIHNlbGYub3B0cy5uYW1lc3BhY2UgKyAnX2JveCB7JyArXG4gICAgICAgICAgICAgICAgJyAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDE1MywgMjA0LCAwLjA1KTsnICtcbiAgICAgICAgICAgICAgICAnICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsnICtcbiAgICAgICAgICAgICAgICAnICAgIHotaW5kZXg6IDEwMDAwMDA7JyArXG4gICAgICAgICAgICAgICAgJyAgICBwb2ludGVyLWV2ZW50czogbm9uZTsnICtcbiAgICAgICAgICAgICAgICAnICAgIG91dGxpbmU6IDNweCBzb2xpZCByZ2IoMCwgMTUzLCAyMDQpOycgK1xuICAgICAgICAgICAgICAgICcgICAgYm94LXNoYWRvdzogNnB4IDZweCAycHggcmdiYSgwLCAwLCAwLCAwLjIpOycgK1xuICAgICAgICAgICAgICAgICd9JztcblxuICAgICAgICAgICAgd3JpdGVTdHlsZXNoZWV0KGNzcyk7XG4gICAgICAgICAgICBzZWxmLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU91dGxpbmVFbGVtZW50cygpIHtcbiAgICAgICAgc2VsZi5lbGVtZW50cy50b3AgPSBqUXVlcnkoJzxkaXY+JykuYWRkQ2xhc3Moc2VsZi5vcHRzLm5hbWVzcGFjZSkuaW5zZXJ0QWZ0ZXIoc2VsZi5vcHRzLiRlbGVtKTtcbiAgICAgICAgc2VsZi5lbGVtZW50cy5ib3R0b20gPSBqUXVlcnkoJzxkaXY+JykuYWRkQ2xhc3Moc2VsZi5vcHRzLm5hbWVzcGFjZSkuaW5zZXJ0QWZ0ZXIoc2VsZi5vcHRzLiRlbGVtKTtcbiAgICAgICAgc2VsZi5lbGVtZW50cy5sZWZ0ID0galF1ZXJ5KCc8ZGl2PicpLmFkZENsYXNzKHNlbGYub3B0cy5uYW1lc3BhY2UpLmluc2VydEFmdGVyKHNlbGYub3B0cy4kZWxlbSk7XG4gICAgICAgIHNlbGYuZWxlbWVudHMucmlnaHQgPSBqUXVlcnkoJzxkaXY+JykuYWRkQ2xhc3Moc2VsZi5vcHRzLm5hbWVzcGFjZSkuaW5zZXJ0QWZ0ZXIoc2VsZi5vcHRzLiRlbGVtKTtcblxuICAgICAgICBzZWxmLmVsZW1lbnRzLmJveCA9IGpRdWVyeSgnPGRpdj4nKS5hZGRDbGFzcyhzZWxmLm9wdHMubmFtZXNwYWNlICsgJ19ib3gnKS5pbnNlcnRBZnRlcihzZWxmLm9wdHMuJGVsZW0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZU91dGxpbmVFbGVtZW50cygpIHtcbiAgICAgICAgalF1ZXJ5LmVhY2goc2VsZi5lbGVtZW50cywgZnVuY3Rpb24gKG5hbWUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFRvcCgpIHtcbiAgICAgICAgLy8gVmVyaWZ5IGlmIGlzIG5lY2Vzc2FyeVxuICAgICAgICBpZiAoIXNlbGYuZWxlbWVudHMud2luZG93KSB7XG4gICAgICAgICAgICBzZWxmLmVsZW1lbnRzLndpbmRvdyA9IGpRdWVyeSh3aW5kb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxmLmVsZW1lbnRzLndpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9wT25Fc2NhcGUoZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBzZWxmLmtleUNvZGVzLkVTQyB8fCBlLmtleUNvZGUgPT09IHNlbGYua2V5Q29kZXMuQkFDS1NQQUNFIHx8IGUua2V5Q29kZSA9PT0gc2VsZi5rZXlDb2Rlcy5ERUxFVEUpIHtcbiAgICAgICAgICAgIHB1Yi5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhdyhlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihzZWxmLm9wdHMubmFtZXNwYWNlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1Yi5lbGVtZW50ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgdmFyIHNjcm9sbF90b3AgPSBnZXRTY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIHBvcyA9IHB1Yi5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgdG9wID0gcG9zLnRvcCArIHNjcm9sbF90b3AsXG4gICAgICAgICAgICBsYWJlbF90ZXh0ID0gJycsXG4gICAgICAgICAgICBsYWJlbF90b3AgPSAwLFxuICAgICAgICAgICAgbGFiZWxfbGVmdCA9IDA7XG5cbiAgICAgICAgXG4gICAgICAgIHNlbGYuZWxlbWVudHMuYm94LmNzcyh7XG4gICAgICAgICAgICB0b3A6IHNlbGYub3B0cy4kZWxlbS5zY3JvbGxUb3AoKSArIHBvcy50b3AgLSAxLFxuICAgICAgICAgICAgbGVmdDogcG9zLmxlZnQgLSAxLFxuICAgICAgICAgICAgd2lkdGg6IHBvcy53aWR0aCArIDIsXG4gICAgICAgICAgICBoZWlnaHQ6IHBvcy5oZWlnaHQgKyAyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgICAgIGlmICghc2VsZi5vcHRzLnJlYWx0aW1lKSB7XG4gICAgICAgICAgICBkcmF3KGUpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYub3B0cy5vbkNsaWNrKHB1Yi5lbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1Yi5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVtb3ZlT3V0bGluZUVsZW1lbnRzKCk7XG4gICAgICAgIGluaXRTdHlsZXNoZWV0KCk7XG4gICAgICAgIGlmIChzZWxmLmFjdGl2ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2VsZi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgY3JlYXRlT3V0bGluZUVsZW1lbnRzKCk7XG5cbiAgICAgICAgICAgIHNlbGYub3B0cy4kZWxlbS5iaW5kKCdrZXl1cC4nICsgc2VsZi5vcHRzLm5hbWVzcGFjZSwgc3RvcE9uRXNjYXBlKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdHMub25DbGljaykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9wdHMuJGVsZW0uYmluZCgnY2xpY2suJyArIHNlbGYub3B0cy5uYW1lc3BhY2UsIGNsaWNrSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRzLnJlYWx0aW1lKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcHRzLiRlbGVtLmJpbmQoJ21vdXNlbW92ZS4nICsgc2VsZi5vcHRzLm5hbWVzcGFjZSwgZHJhdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHViLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZU91dGxpbmVFbGVtZW50cygpO1xuICAgICAgICBzZWxmLm9wdHMuJGVsZW0udW5iaW5kKCdtb3VzZW1vdmUuJyArIHNlbGYub3B0cy5uYW1lc3BhY2UpXG4gICAgICAgICAgICAudW5iaW5kKCdrZXl1cC4nICsgc2VsZi5vcHRzLm5hbWVzcGFjZSlcbiAgICAgICAgICAgIC51bmJpbmQoJ2NsaWNrLicgKyBzZWxmLm9wdHMubmFtZXNwYWNlKTtcbiAgICB9O1xuXG4gICAgcHViLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBzZWxmLm9wdHMuJGVsZW0udW5iaW5kKCdtb3VzZW1vdmUuJyArIHNlbGYub3B0cy5uYW1lc3BhY2UpXG4gICAgICAgICAgICAudW5iaW5kKCdrZXl1cC4nICsgc2VsZi5vcHRzLm5hbWVzcGFjZSlcbiAgICAgICAgICAgIC51bmJpbmQoJ2NsaWNrLicgKyBzZWxmLm9wdHMubmFtZXNwYWNlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHB1Yjtcbn07ICJdfQ==
;