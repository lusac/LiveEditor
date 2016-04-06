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

(function (window, document, $) {
    window.DomOutline = {};

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
                    '    z-index: 9999999999;' +
                    '    pointer-events: none;' +
                    '    outline: 3px solid rgb(0, 153, 204);' +
                    '}' +
                    '.' + self.opts.namespace + '_box {' +
                    '    background: rgba(0, 153, 204, 0.05);' +
                    '    position: fixed;' +
                    '    z-index: 9999999999;' +
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

        function draw(e, elem) {
            if (elem === undefined) {
                if (e.target.className.indexOf(self.opts.namespace) !== -1) {
                    return;
                }
            }

            self.active = true;

            pub.element = elem || e.target;

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

            if (self.active) {
                self.opts.onClick(pub.element);
            }

            return false;
        }

        pub.draw = function (elem) {
            draw(null, elem);
        };

        pub.start = function () {
            removeOutlineElements();
            initStylesheet();
            if (self.active !== true) {
                // self.active = true;
                createOutlineElements();

                // self.opts.$elem.bind('keyup.' + self.opts.namespace, stopOnEscape);
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

    window.DomOutline = DomOutline;
})(window, document, $);