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
            menuHtml = this.newItem({name: name, is_header: true}),
            editList = [{
                operation: 'edit-html',
                value: 'Edit HTML', 
            },{
                operation: 'edit-text',
                value:'Edit Text'
            },{
                operation: 'edit-classes',
                value:'Edit Classes'
            }, {
                operation: 'edit-style',
                value:'Edit Style'
            }];

        menuHtml += this.newItem({name: 'Edit Element', operation: 'edit-element', items: editList});
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
                console.log('Operation: ' + op);
            }

            e.stopPropagation();
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
            var $subMenu = $('<ul class="dropdown-menu">');

            for (var i=0; i<=params.items.length-1; i++) {
                var $_li = $('<li class="container-item-el">');

                if (params.items[i].operation) {
                    $_li.attr('data-operation', params.items[i].operation);
                }

                if (params.items[i].name) {
                    $_li.attr('data-name', params.items[i].name);
                }

                $_li.append('<a tabindex="-1" href="#">' + params.items[i].value + '</a>');
                $subMenu.append($_li);
            }

            $li.addClass('dropdown-submenu');
            $li.append($subMenu);
        }

        return $li.prop('outerHTML');
    }

    window.FloatingMenu = FloatingMenu;
})(window, document, $);