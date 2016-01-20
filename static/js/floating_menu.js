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
        var name = params.name || '(element)',
            posTop = params.posTop || 0,
            posLeft = params.posLeft || 0,
            menuHtml = this.newItem({name: name, is_header: true});

        menuHtml += this.newItem({name: 'Edit Element', operation: 'edit-element'});
        menuHtml += this.newItem({klass: 'divider'});
        menuHtml += this.newItem({name: 'Move and Resize', operation: 'move-and-resize'});
        menuHtml += this.newItem({name: 'Remove', operation: 'remove'});
        menuHtml += this.newItem({klass: 'divider'});
        menuHtml += this.newItem({name: 'Select Container', items: params.container});

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
            }
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

        if (params.operation) {
            $li.attr('data-operation', params.operation);
        }

        if (params.is_header) {
            $li.addClass('dropdown-header')
               .append('(' + params.name + ')');
        } else if (params.name) {
            $li.append('<a tabindex="-1" href="#">' + params.name + '</a>');
        }

        if (params.klass) {
            $li.addClass(params.klass);
        }

        if (params.items) {
            var menuHtml = '<ul class="dropdown-menu">';

            for (var i=0; i<=params.items.length-1; i++) {
                var tagName = params.items[i].tagName;
                if (tagName) {
                    menuHtml += '<li class="container-item-el"><a tabindex="-1" href="#">' + tagName.toLowerCase() + '</a></li>';
                }
            }

            menuHtml += '</ul>';

            $li.addClass('dropdown-submenu');
            $li.append(menuHtml);
        }

        return $li.prop('outerHTML');
    }

    window.FloatingMenu = FloatingMenu;
})(window, document, $);