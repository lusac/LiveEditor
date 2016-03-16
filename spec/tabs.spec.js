describe("Actions", function() {
    beforeEach(function() {
        tabs = new LiveEditorTabs({parent: $('body'), tabs: ["Test 1", "Test 2", "Test 3"]});
    });

    afterEach(function() {
        $('.nav-tabs').remove();
    });

    describe('init method', function() {
        it('Should have parent attributes', function() {
            expect(tabs.hasOwnProperty('$parent')).toBe(true);
            expect(tabs.$parent).toBe($('body'));
        });

        it('Should have tabs attributes', function() {
            expect(tabs.hasOwnProperty('tabs')).toBe(true);
            expect(tabs.tabs.toString()).toBe(["Test 1", "Test 2", "Test 3"].toString());
        });
    });

    describe('create method', function() {
        it('Should append tabs inside parent', function() {
            var $tab = $('body>.nav-tabs');
            expect($tab).toExist();
        });

        it('Tab should have correct structure', function() {
            var $nav = $('body>.nav-tabs');
            expect($nav.find('li')).toExist();
            expect($nav.find('li').length).toBe(3);
            expect($nav.find('li:eq(0) a').text()).toBe('Test 1');
            expect($nav.find('li:eq(1) a').text()).toBe('Test 2');
            expect($nav.find('li:eq(2) a').text()).toBe('Test 3');
        });

        it('Tab should have correct data toggle attribute', function() {
            var $a = $('body>.nav-tabs>li>a');
            expect($a.data('toggle')).toBe('tab');
        });

        // data-name should be 'test-1'
        it('Tab should have correct data name attribute', function() {
            var $a = $('body>.nav-tabs>li>a');
            expect($a.data('name')).toBe('test 1');
        });

        it('First tab should be active', function() {
            var $active = $('.active'),
                $liActive = $('.nav-tabs>li:eq(0)');

            expect($active.length).toBe(1);
            expect($liActive).toHaveClass('active');
        });
    });
});
