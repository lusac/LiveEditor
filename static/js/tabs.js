/* global $ */

(function (window, document, $) {
    'use strict';

    var LiveEditorTabs = function LiveEditorTabs (params) {
        this.init(params);
    };

    LiveEditorTabs.prototype.init = function (params) {
        this.$parent = params.parent;
        this.tabs = params.tabs;
        this.create();
    };

    LiveEditorTabs.prototype.create = function () {
        this.$tabs = $('<ul class="nav nav-tabs">');
        this.createTabs(this.tabs);
        this.$parent.append(this.$tabs);
    };

    LiveEditorTabs.prototype.createTabs = function (tabsList) {
        this.$tabs.find('li.active').removeClass('active');

        for(var i=0; i<=tabsList.length-1; i++) {
            var $li = $('<li>'),
                name = this.formatName(tabsList[i]);

            if (i === 0) {
                $li.addClass('active');
            }

            $li.append('<a data-toggle="tab" data-name="' + name + '">' + tabsList[i] + '</a>');

            this.$tabs.append($li);
        }
    };

    LiveEditorTabs.prototype.formatName = function (str) {
        return str.toLowerCase().replace(new RegExp(' ', 'g'), '_');
    };

    LiveEditorTabs.prototype.current = function () {
        return this.$tabs.find('li.active a');
    };

    window.LiveEditorTabs = LiveEditorTabs;
})(window, document, $);