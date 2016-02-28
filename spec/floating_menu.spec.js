describe('Floating Menu', function() {

    beforeEach(function() {
        menu = new FloatingMenu({elemId: 'my-id'});
    });

    afterEach(function() {
        $('ul.dropdown-menu[role]').remove();
    });

    describe('Init method', function() {
        it('Should create a menu', function() {
            $m = $('.dropdown-menu[role]');
            expect($m.length).toEqual(1);
        });
    });

    describe('Create method', function() {
        beforeEach(function() {
            menu.create({
                value: 'element',
                posLeft: 150,
                posTop: 130,
                container: [
                    {
                        value: 'Item Value 1',
                        attrs: {
                            'value': 'attr-value-1'
                        }
                    },
                    {
                        value: 'Item Value 2',
                        attrs: {
                            'value': 'attr-value-2'
                        }
                    }
                ]
            });
        });

        it('Should create a header', function() {
            var $h = $('.dropdown-header');
            expect($h.text()).toBe('<element>');
        });

        it('Should create Edit Element item', function() {
            var $i = $('li.dropdown-submenu:eq(0)>a'),
                $li = $('li.dropdown-submenu:eq(0) .dropdown-menu li');

            expect($i.text()).toBe('Edit Element');
            expect($li.length).toBe(4);

            var $editHTML = $('li.dropdown-submenu:eq(0) .dropdown-menu li:eq(0)'),
                $editText = $('li.dropdown-submenu:eq(0) .dropdown-menu li:eq(1)'),
                $editClasses = $('li.dropdown-submenu:eq(0) .dropdown-menu li:eq(2)'),
                $editStyle = $('li.dropdown-submenu:eq(0) .dropdown-menu li:eq(3)');

            // Text
            expect($editHTML.find('a').text()).toBe('Edit HTML');
            expect($editText.find('a').text()).toBe('Edit Text');
            expect($editClasses.find('a').text()).toBe('Edit Classes');
            expect($editStyle.find('a').text()).toBe('Edit Style');

            // Attrs
            expect($editHTML.data('operation')).toBe('edit-html');
            expect($editText.data('operation')).toBe('edit-text');
            expect($editClasses.data('operation')).toBe('edit-classes');
            expect($editStyle.data('operation')).toBe('edit-style');

            expect($editHTML.data('toggle')).toBe('modal');
            expect($editText.data('toggle')).toBe('modal');
            expect($editClasses.data('toggle')).toBe('modal');
            expect($editStyle).not.toHaveAttr('toggle');

            expect($editHTML.data('target')).toBe('#edit-html-modal[my-id]');
            expect($editText.data('target')).toBe('#edit-text-modal[my-id]');
            expect($editClasses.data('target')).toBe('#edit-classes-modal[my-id]');
            expect($editStyle).not.toHaveAttr('target');
        });

        it('Should create Move and Resize item', function() {
            var $i = $('.dropdown-menu[role]>li:eq(3)');

            expect($i.find('a').text()).toBe('Move and Resize');
            expect($i.data('operation')).toBe('move-and-resize');
        });

        it('Should create Remove item', function() {
            var $i = $('.dropdown-menu[role]>li:eq(4)');

            expect($i.find('a').text()).toBe('Remove');
            expect($i.data('operation')).toBe('remove');
        });

        it('Should create Select Container item', function() {
            var $i = $('li.dropdown-submenu:eq(1)>a'),
                $li = $('li.dropdown-submenu:eq(1) .dropdown-menu li');

            expect($i.text()).toBe('Select Container');
            expect($li.length).toBe(2);


            var $item1 = $('li.dropdown-submenu:eq(1) .dropdown-menu li:eq(0)'),
                $item2 = $('li.dropdown-submenu:eq(1) .dropdown-menu li:eq(1)');

            // Text
            expect($item1.find('a').text()).toBe('Item Value 1');
            expect($item2.find('a').text()).toBe('Item Value 2');

            // Attrs
            expect($item1.attr('value')).toBe('attr-value-1');
            expect($item2.attr('value')).toBe('attr-value-2');

            expect($item1).not.toHaveAttr('operation');
            expect($item2).not.toHaveAttr('operation');

            expect($item1).not.toHaveAttr('toggle');
            expect($item2).not.toHaveAttr('toggle');

            expect($item1).not.toHaveAttr('target');
            expect($item2).not.toHaveAttr('target');
        });

        it('Should create Goal item', function() {
            var $i = $('li.dropdown-submenu:eq(2)>a'),
                $li = $('li.dropdown-submenu:eq(2) .dropdown-menu li');

            expect($i.text()).toBe('Create new goal');
            expect($li.length).toBe(1);


            var $click = $('li.dropdown-submenu:eq(2) .dropdown-menu li:eq(0)');

            // Text
            expect($click.find('a').text()).toBe('Click');

            // Attrs
            expect($click.data('operation')).toBe('add-event-click');
            expect($click).not.toHaveAttr('toggle');
            expect($click).not.toHaveAttr('target');
        });
    });
    
    describe('Close method', function () {
        beforeEach(function() {
            menu.create({
                value: 'element',
                posLeft: 150,
                posTop: 130,
                container: [
                    {
                        value: 'Item Value 1',
                        attrs: {
                            'value': 'attr-value-1'
                        }
                    },
                    {
                        value: 'Item Value 2',
                        attrs: {
                            'value': 'attr-value-2'
                        }
                    }
                ]
            });

            $menu = $('ul.dropdown-menu[role]');
        });

        it('Should hide menu', function() {
            menu.close();
            expect($menu.css('display')).toBe('none');
        });

        it('Should empty menu', function() {
            expect($menu.children().length).not.toBe(0);
            menu.close();
            expect($menu.children().length).toBe(0);
        });
    });

    describe('Open method', function () {
        it('Should show up menu', function() {
            var $menu = $('ul.dropdown-menu[role]');

            menu.open();
            expect($menu.css('display')).toBe('block');
        });
    });

    describe('BindEvents method', function () {
        it('Should dispatch an event', function() {
            var _event;

            menu.create({
                value: 'element',
                posLeft: 150,
                posTop: 130
            });

            document.addEventListener('floatingMenuItemClicked', function (e) {
                _event = e;
            }, false);

            var $el = $('[data-operation]:first');
            $el.click()

            expect(_event.detail.operation).toBe('edit-html');
            expect(_event.detail.liveEditor).toBe('my-id');
        });
    });
});
