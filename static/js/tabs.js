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
            var $li = $('<li>'),
                name = this.formatName(this.tabs[i]);

            if (i==0) {
                $li.addClass('active');
            }

            $li.append('<a data-toggle="tab" data-name="' + name + '">' + this.tabs[i] + '</a>');

            $tabs.append($li);
        }
        this.$parent.append($tabs);
    };

    LiveEditorTabs.prototype.formatName = function (str) {
        return str.toLowerCase().replace(new RegExp(' ', 'g'), '_');
    }

    window.LiveEditorTabs = LiveEditorTabs;
})(window, document, $);