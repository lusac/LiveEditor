/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorTabs = function LiveEditorTabs (params) {
        this.init(params);
    };

    LiveEditorTabs.prototype.init = function (params) {
        this.$parent = params.parent;
        this.tabs = params.tabs
        this.create();
    };

    LiveEditorTabs.prototype.create = function () {
        var $tabs = $('<ul class="nav nav-tabs">');

        for(var i=0; i<=this.tabs.length-1; i++) {
            var $li = $('<li>');

            if (i==0) {
                $li.addClass('active');
            }

            $li.append('<a data-toggle="tab" data-name="' + this.tabs[i].toLowerCase() + '">' + this.tabs[i] + '</a>');

            $tabs.append($li);
        }
        this.$parent.append($tabs);
    };

    window.LiveEditorTabs = LiveEditorTabs;
})(window, document, $);