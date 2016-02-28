describe('Floating Menu', function() {

    afterEach(function() {
        $('.dropdown-menu').remove();
    });

    describe('Init method', function() {
        it('Should create a menu', function() {
            var menu = new FloatingMenu({elemId: 'my-id'}),
                $m = $('.dropdown-menu[role]');
            expect($m.length).toEqual(1);
        });
    });

    describe('Create method', function() {
        beforeEach(function() {
            var menu = new FloatingMenu({elemId: 'my-id'});
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
            expect($editStyle.data('toggle')).not.toExist();

            expect($editHTML.data('target')).toBe('#edit-html-modal[my-id]');
            expect($editText.data('target')).toBe('#edit-text-modal[my-id]');
            expect($editClasses.data('target')).toBe('#edit-classes-modal[my-id]');
            expect($editStyle.data('target')).not.toExist();
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

            expect($item1.data('operation')).not.toExist();
            expect($item2.data('operation')).not.toExist();

            expect($item1.data('toggle')).not.toExist();
            expect($item2.data('toggle')).not.toExist();

            expect($item1.data('target')).not.toExist();
            expect($item2.data('target')).not.toExist();
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
            expect($click.data('toggle')).not.toExist();
            expect($click.data('target')).not.toExist();
        });
    });
    
    // describe('BindEvents method', function () {
    //     beforeEach(function() {

    //     });

    //     it('Should dispatch an event', function() {

    //     });
    // });
});
