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
        this.bindEvents();
    };

    LiveEditorTabs.prototype.create = function () {
        this.$tabs = $('<ul class="nav nav-tabs live-editor-tabs">');
        this.createTabs(this.tabs);
        this.buildModals();
        this.$parent.append(this.$tabs);
    };

    LiveEditorTabs.prototype.buildModals = function () {
        this.renameModal = new LiveEditorModal({
            editor: this.id,
            data: {
                name: 'rename-modal',
                title: 'Rename Option',
                field: 'input'
            }
        });
    };

    LiveEditorTabs.prototype.bindEvents = function () {
        var self = this;

        this.$tabs.on('click', 'li.active', function() {
            $(this).find('.dropdown-menu').toggle();
        });

        $(document).on('click', function (e) {
            setTimeout(function() {
                var $dropdown = self.$tabs.find('.dropdown-menu');
                $dropdown.each(function() {
                    if(!$(this).parent().hasClass('active')) {
                        if ($(this).css('display') == 'block') {
                            $(this).toggle();
                        }
                    }
                });
            }, 50);
        });
    };

    LiveEditorTabs.prototype.createTabs = function (tabsList) {
        this.$tabs.find('li.active').removeClass('active');
        // TODO - test js
        var $ul = $('<ul class="dropdown-menu">'),
            params = [{
                attrs: { 'data-operation': 'duplicate-option' },
                value: 'Duplicate option'
            },
            {
                attrs: { 'data-operation': 'delete-option' },
                value: 'Delete option'
            },
            {
                attrs: {
                    'data-operation': 'rename-option',
                    'data-toggle': 'modal',
                    'data-target': '#rename-modal'
                },
                value: 'Rename option'
            }
        ];

        // TODO - test js
        for(var i=0; i<=params.length-1; i++) {
            $ul.append(this.newItem(params[i]));
        }

        for(var i=0; i<=tabsList.length-1; i++) {
            var $li = $('<li>'),
                name = this.slugify(tabsList[i]);

            if (i === 0) {
                $li.addClass('active');
            }

            // TODO - test js
            $li.append('<a data-toggle="tab" data-name="' + name + '">' + tabsList[i] + '<span class="caret"></span></a>');
            $li.append($ul.clone());
            this.$tabs.append($li);
        }
    };

    LiveEditorTabs.prototype.newItem = function (param) {
        // TODO - test js
        var $a = $('<a>').text(param.value),
            $li = $('<li>').append($a);

        if (param.attrs) {
            $li.attr(param.attrs);
        }

        return $li;
    };

    LiveEditorTabs.prototype.slugify = function (str) {
        str = str.toLowerCase().replace(new RegExp(' ', 'g'), '_');

        var with_accents    = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/-,:;'";
        var without_accents = "aaaaaeeeeeiiiiooooouuuunc_______";

        for (var i = 0, l = with_accents.length ; i < l ; i++) {
            str = str.replace(new RegExp(with_accents.charAt(i), 'g'), without_accents.charAt(i));
        }

        return str;
    };

    LiveEditorTabs.prototype.current = function () {
        return this.$tabs.find('li.active>a');
    };

    window.LiveEditorTabs = LiveEditorTabs;
})(window, document, $);