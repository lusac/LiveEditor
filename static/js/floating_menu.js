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
            }];

        menuHtml += this.newItem({value: 'Edit Element', items: editList });
        menuHtml += this.newItem({attrs: {'class': 'divider'}});
        menuHtml += this.newItem({value: 'Move and Resize', attrs: {'data-operation': 'move-and-resize'}});
        menuHtml += this.newItem({value: 'Remove', attrs: {'data-operation': 'remove'}});
        menuHtml += this.newItem({attrs: {'class': 'divider'}});
        menuHtml += this.newItem({value: 'Select Container', items: params.container});

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
               .append('(' + params.value + ')');
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