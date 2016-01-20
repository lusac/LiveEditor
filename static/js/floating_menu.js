/* global $ */

(function (window, document, $) {
    'use strict';

    var FloatingMenu = function FloatingMenu (params) {
        this.init(params);
    };

    FloatingMenu.prototype.init = function (params) {
        this.$menu = $('<ul id="floating-settings" class="dropdown-menu" role="menu">');
    };

    FloatingMenu.prototype.create = function (params) {
        var name = params.name || '(element)',
            posTop = params.posTop || 0,
            posLeft = params.posLeft || 0,
            menuHtml = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#"> (' + name + ') </a></li>';
            menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Edit Element</a></li>';
            menuHtml += '<li role="presentation" class="divider"></li>';
            menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Move and Resize</a></li>';
            menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Remove</a></li>';
            menuHtml += '<li role="presentation" class="divider"></li>';
            menuHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Select Container</a></li>';

        this.$menu.empty();
        this.$menu.append(menuHtml);
        this.$menu.css({
            top: posTop - 10,
            left: posLeft + 10
        });

        $('body').append(this.$menu);
    };

    FloatingMenu.prototype.open = function () {
        $('#floating-settings').show();
    };

    FloatingMenu.prototype.close = function () {
        $('#floating-settings').hide();
    };

    window.FloatingMenu = FloatingMenu;
})(window, document, $);