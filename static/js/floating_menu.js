/* global $ */

(function (window, document, $) {
    'use strict';

    var FloatingMenu = function FloatingMenu (params) {
        this.init(params);
    };

    FloatingMenu.prototype.init = function (params) {
        this.LEFT_GAP = 10;
        this.TOP_GAP = -10;
        this.$menu = $('<ul class="dropdown-menu" role="menu">');
        this.$parent = params.appendTo || $('body');
        this.elemId = params.elemId;
        this.$parent.append(this.$menu);
        this.create(params.data);
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
                    'data-target':'#edit-html-modal-' + this.elemId
                }
            },{
                value: 'Edit Text',
                attrs: {
                    'data-operation': 'edit-text',
                    'data-toggle': 'modal',
                    'data-target':'#edit-text-modal-' + this.elemId
                }
            },{
                value: 'Edit Classes',
                attrs: {
                    'data-operation': 'edit-classes',
                    'data-toggle': 'modal',
                    'data-target':'#edit-classes-modal-' + this.elemId
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
            top: this.defineTop(posTop, this.$menu.height()),
            left: this.defineLeft(posLeft, this.$menu.width()),
        });
    };

    FloatingMenu.prototype.bindEvents = function () {
        var self = this;

        this.$menu.on('click', 'li', function(e) {
            var op = $(this).data('operation');

            if (op) {
                var _event = new CustomEvent('floatingMenuItemClicked', {
                    'detail': {'operation': op, 'liveEditor': self.elemId}
                });

                document.dispatchEvent(_event);
                console.log('Operation: ' + op);
            }
        });
    };

    FloatingMenu.prototype.open = function () {
        this.$menu.show();
    };

    FloatingMenu.prototype.close = function () {
        this.$menu.remove();
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
            $li.append('<a tabindex="-1">' + params.value + '</a>');
        }

        if (params.items) {
            var $subMenu = $('<ul class="dropdown-menu">');

            for (var i=0; i<=params.items.length-1; i++) {
                var $_li = $('<li class="container-item-el">');

                $_li.attr(params.items[i].attrs)
                    .append('<a tabindex="-1">' + params.items[i].value + '</a>');

                $subMenu.append($_li);
            }

            $li.addClass('dropdown-submenu');
            $li.append($subMenu);
        }

        return $li.prop('outerHTML');
    };

    FloatingMenu.prototype.defineLeft = function(leftData, menu_width) {
        if (leftData === 0) {
            return 0;
        }
        var next_location = leftData.iframe_left + leftData.box_offset_left + leftData.box_width + this.LEFT_GAP;
        if (next_location + menu_width >= leftData.iframe_width) {
            next_location = leftData.iframe_left + leftData.box_offset_left - menu_width - this.LEFT_GAP;
        }
        return next_location;
    };

    FloatingMenu.prototype.defineTop = function(topData, menu_height) {
        if (topData === 0) {
            return 0;
        }

        var next_location = topData.iframe_top + topData.box_offset_top - topData.scroll_top + this.TOP_GAP;
        if (next_location + menu_height >= topData.iframe_height) {
            next_location = topData.iframe_top + topData.box_offset_top - topData.scroll_top + topData.box_heigh - menu_height + this.TOP_GAP;
        }

        return next_location;
    };

    window.FloatingMenu = FloatingMenu;
})(window, document, $);
