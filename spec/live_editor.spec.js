describe('LiveEditor', function() {
    beforeEach(function() {
        liveEditor = new LiveEditor({editor: '#live-editor-test', url: 'site.html'});
        $liveEditor = $('.live-editor');
    });

    afterEach(function() {
        $liveEditor.empty();
        $('.modal').remove();
        $('#code-panel').remove();
        $('.code-panel-button').remove();
        $('ul.dropdown-menu[role]').remove();
    })

    describe('Build Iframe', function() {
        it('Should build iframe', function() {
            var $iframe = $liveEditor.find('iframe');
            expect($iframe).toExist();
        });

        it('Initial Loading Spinner', function() {
            var $s = $('.spinner-container');

            expect($s.text()).toBe(' Loading...');
            expect($s.css('display')).toBe('inline');
        });

        it ('Loading Spinner disappears when iframe is fully loaded', function() {
            var $s = $('.spinner-container');

            liveEditor.$editorIframe.on('load', function() {
                expect($s.css('display')).toBe('none');
            });
        });
    });

    describe('Build Modals', function() {
        it('Should build Modals', function() {
            var $m1 = $('#edit-html-modal-live-editor-test'),
                $m2 = $('#edit-text-modal-live-editor-test'),
                $m3 = $('#edit-classes-modal-live-editor-test');

            expect($m1).toExist();
            expect($m2).toExist();
            expect($m3).toExist();
        });
    });

    describe('Build Panel', function() {
        it('Should build Panel', function() {
            var $p = $('#code-panel[live-editor-test]');
            expect($p).toExist();
        });
    });

    describe('Build DOM outline', function() {
        it('Should init DOM outline', function() {
            liveEditor.$editorIframe.on('load', function() {
                var $d = liveEditor.$editorIframe.contents().find('.DomOutline_box');
                expect($d).toExist();
                expect($d.css('display')).toBe('none');
            });
        });
    });

    describe('bindEvents method', function() {
        beforeEach(function() {
            waits(200);
        });

        it('Click in any element should call setCurrentElement method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');

            spyOn(liveEditor, 'setCurrentElement');

            $p.trigger('mousemove').click();

            expect(liveEditor.setCurrentElement).toHaveBeenCalled();
        });

        it('Click in any element should call openCurrentMenu method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            
            spyOn(liveEditor, 'openCurrentMenu');
            
            $p.trigger('mousemove').click();

            expect(liveEditor.openCurrentMenu).toHaveBeenCalled();
        });

        it('Click in floating menu item should call operationInit method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();
            
            spyOn(liveEditor, 'operationInit');
            
            $('ul.dropdown-menu[role] li').click();

            expect(liveEditor.operationInit).toHaveBeenCalled();
        });

        it('When an element is already select and another one is clicked, should call unselectElements method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditor, 'unselectElements');

            liveEditor.$editorIframe.contents().find('h1').trigger('mousemove').click();

            expect(liveEditor.unselectElements).toHaveBeenCalled();
        });

        // it('When an element is already select and ESC keydown, should call unselectElements method', function() {
        //     var $p = liveEditor.$editorIframe.contents().find('p');
        //     $p.trigger('mousemove').click();

        //     spyOn(liveEditor, 'unselectElements');

        //     liveEditor.$editorIframe.contents().find('html').trigger('keyup', {which: 27});

        //     expect(liveEditor.unselectElements).toHaveBeenCalled();
        // });
    });

    describe('setCurrentElement method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('set value to attributes', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');

            expect(liveEditor.hasOwnProperty('currentSelected')).toBe(false);
            expect(liveEditor.hasOwnProperty('$currentSelected')).toBe(false);
            
            liveEditor.setCurrentElement($p)

            expect(liveEditor.currentSelected).toBe('html>body>p');
            expect(liveEditor.$currentSelected).toBe($p);
        });
    });

    describe('getElementPath method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('return correct path', function() {
            var $p = liveEditor.$editorIframe.contents().find('p'),
                path = liveEditor.getElementPath($p);

            expect(path).toBe('html>body>p');
        });
    });

    describe('openCurrentMenu method', function() {
    });

    describe('operationInit method', function() {
    });

    describe('unselectElements method', function() {
    });

    describe('modalEvents method', function() {
    });

    describe('getCurrentParentsPath method', function() {
    });

    describe('addToScriptList method', function() {
    });

    describe('addToScriptGoal method', function() {
    });

    describe('codePanelUpdate method', function() {
    });
});