describe("Tabs", function() {
    beforeEach(function() {
        params = {parent: $('body'), tabs: ["Test 1", "Test 2", "Other Test 3"]};
        tabs = new LiveEditorTabs(params);
    });

    afterEach(function() {
        $('.nav-tabs').remove();
        $('#rename-modal').remove();
    });

    describe('init method', function() {
        afterEach(function() {
            $('#rename-modal').remove();
        });

        it('Should have parent attributes', function() {
            expect(tabs.hasOwnProperty('$parent')).toBe(true);
            expect(tabs.$parent).toBe($('body'));
        });

        it('Should have tabs attributes', function() {
            expect(tabs.hasOwnProperty('tabs')).toBe(true);
            expect(tabs.tabs.toString()).toBe(["Test 1", "Test 2", "Other Test 3"].toString());
        });

        it('Should call create method', function() {
            spyOn(tabs, 'create');
            tabs.init(params);
            expect(tabs.create).toHaveBeenCalled();
        });

        it('Should call bindEvents method', function() {
            spyOn(tabs, 'bindEvents');
            tabs.init(params);
            expect(tabs.bindEvents).toHaveBeenCalled();
        });
    });

    describe('create method', function() {
        afterEach(function() {
            $('#rename-modal').remove();
        });

        it('Should have a nav-tabs object', function() {
            expect(tabs.$tabs).toExist();
        });

        it('Should call createTabs method', function() {
            spyOn(tabs, 'createTabs');
            tabs.create();
            expect(tabs.createTabs).toHaveBeenCalledWith(tabs.tabs);
        });

        it('Should call buildModals method', function() {
            spyOn(tabs, 'buildModals');
            tabs.create();
            expect(tabs.buildModals).toHaveBeenCalled();
        });

        it('Should append tabs inside parent', function() {
            var $tab = $('body>.nav-tabs');
            expect($tab).toExist();
        });
    });

    describe('createTabs method', function() {
        it('Tab should have correct structure', function() {
            var $nav = $('body>.nav-tabs');
            expect($nav.find('>li')).toExist();
            expect($nav.find('>li').length).toBe(3);
            expect($nav.find('>li:eq(0)>a').text()).toBe('Test 1');
            expect($nav.find('>li:eq(1)>a').text()).toBe('Test 2');
            expect($nav.find('>li:eq(2)>a').text()).toBe('Other Test 3');
        });

        it('Tab should have correct data toggle attribute', function() {
            var $a = $('body>.nav-tabs>li>a');
            expect($a.data('toggle')).toBe('tab');
        });

        it('Tab should have correct data name attribute', function() {
            var $a = $('body>.nav-tabs>li:eq(0)>a');
            expect($a.data('name')).toBe('test_1');

            var $a = $('body>.nav-tabs>li:eq(1)>a');
            expect($a.data('name')).toBe('test_2');

            var $a = $('body>.nav-tabs>li:eq(2)>a');
            expect($a.data('name')).toBe('other_test_3');
        });

        it('First tab should be active', function() {
            var $active = $('.active'),
                $liActive = $('.nav-tabs>li:eq(0)');

            expect($active.length).toBe(1);
            expect($liActive).toHaveClass('active');
        });
    });

    describe('buildModals method', function() {
        it('Should create a instance of LiveEditorModal', function() {
            var spy = spyOn(window, 'LiveEditorModal'),
                data = {
                    name: 'rename-modal',
                    title: 'Rename Option',
                    field: 'input'
                };
            tabs.buildModals();
            expect(spy).wasCalledWith({editor:tabs.id, data: data});
        });

        it('Create a attribute instanceof LiveEditorModal', function() {
            expect(tabs.renameModal instanceof LiveEditorModal).toBe(true);
        });
    });

    describe('slugify method', function() {
        it('Should format name', function() {
            expect(tabs.slugify('My beautiful name')).toBe('my_beautiful_name');
            expect(tabs.slugify('Açafrão-da-terra ou cúrcuma')).toBe('acafrao_da_terra_ou_curcuma');
        });
    });

    describe('current method', function() {
        it('Should return current tab', function() {
            var $li = $('li.active a');
            expect(tabs.current()).toBe($li);
        });
    });
});
