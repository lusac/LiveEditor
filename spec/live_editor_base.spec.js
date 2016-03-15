describe('LiveEditorBase', function() {
    beforeEach(function() {
        liveEditorBase = new LiveEditorBase({editor: '#live-editor-test-1', url: 'site.html'});
        $liveEditorBase = $('.live-editor');
    });

    afterEach(function() {
        $liveEditorBase.empty();
        $('.btn-undo').remove();
        $('.modal').remove();
        $('#code-panel').remove();
        $('.code-panel-button').remove();
        $('ul.dropdown-menu[role]').remove();
    });

    describe('iframe onload', function() {
        beforeEach(function() {
            $iframe = $liveEditorBase.find('iframe');
            spyOn(liveEditorBase, 'dispatchLoadEvent');
            spyOn(liveEditorBase, 'domOutlineInit');
            spyOn(liveEditorBase, 'bindEvents');
            spyOn(liveEditorBase, 'applyJs');
            spyOn(liveEditorBase, 'codePanelUpdate');
            $iframe.load();
        });

        it('Should call dispatchLoadEvent method', function() {
            expect(liveEditorBase.dispatchLoadEvent).toHaveBeenCalled();
        });

        it('Should call domOutlineInit method', function() {
            expect(liveEditorBase.domOutlineInit).toHaveBeenCalled();
        });

        it('Should call bindEvents method', function() {
            expect(liveEditorBase.bindEvents).toHaveBeenCalled();
        });

        it('Should call applyJs method', function() {
            expect(liveEditorBase.applyJs).toHaveBeenCalled();
        });

        it('Should call codePanelUpdate method', function() {
            expect(liveEditorBase.codePanelUpdate).toHaveBeenCalled();
        });
    });

    describe('Build Iframe', function() {
        it('Should build iframe', function() {
            var $iframe = $liveEditorBase.find('iframe');
            expect($iframe).toExist();
        });

        it('Initial Loading Spinner', function() {
            var $s = $('.spinner-container');

            expect($s.text()).toBe(' Loading...');
            expect($s.css('display')).toBe('inline');
        });

        it ('Loading Spinner disappears when iframe is fully loaded', function() {
            var $s = $('.spinner-container');

            liveEditorBase.$editorIframe.on('load', function() {
                expect($s.css('display')).toBe('none');
            });
        });
    });

    describe('Build Modals', function() {
        beforeEach(function() {
            waits(100);
            liveEditorBase.$editorIframe.load();
        });

        it('Should build Modals', function() {
            var $m1 = $('#edit-html-modal-live-editor-test-1'),
                $m2 = $('#edit-text-modal-live-editor-test-1'),
                $m3 = $('#edit-classes-modal-live-editor-test-1');

            expect($m1).toExist();
            expect($m2).toExist();
            expect($m3).toExist();
        });
    });

    describe('Build Panel', function() {
        beforeEach(function() {
            waits(100);
            liveEditorBase.$editorIframe.load();
        });

        it('Should build Panel', function() {
            var $p = $('#code-panel[live-editor-test-1]');
            expect($p).toExist();
        });
    });

    describe('Build DOM outline', function() {
        beforeEach(function() {
            waits(100);
            liveEditorBase.$editorIframe.load();
        });

        it('Should init DOM outline', function() {
            liveEditorBase.$editorIframe.on('load', function() {
                var $d = liveEditorBase.$editorIframe.contents().find('.DomOutline_box');
                expect($d).toExist();
                expect($d.css('display')).toBe('none');
            });
        });
    });

    describe('bindEvents method', function() {
        beforeEach(function() {
            waits(100);
            liveEditorBase.$editorIframe.load();
        });

        it('Click in any element should call setCurrentElement method', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');

            spyOn(liveEditorBase, 'setCurrentElement');

            $p.trigger('mousemove').click();

            expect(liveEditorBase.setCurrentElement).toHaveBeenCalled();
        });

        it('Click in any element should call openCurrentMenu method', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');

            spyOn(liveEditorBase, 'openCurrentMenu');

            $p.trigger('mousemove').click();

            expect(liveEditorBase.openCurrentMenu).toHaveBeenCalled();
        });

        it('Click in floating menu item should call operationInit method', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditorBase, 'operationInit');

            $('ul.dropdown-menu[role] li').click();

            expect(liveEditorBase.operationInit).toHaveBeenCalled();
        });

        it('When an element is already select and another one is clicked, should call unselectElements method', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditorBase, 'unselectElements');

            liveEditorBase.$editorIframe.contents().find('h1').trigger('mousemove').click();

            expect(liveEditorBase.unselectElements).toHaveBeenCalled();
        });

        it('Undo button click should call codePanelUpdate method if undoList is not empty', function() {
            liveEditorBase.scriptList.push('$("p").remove();');
            liveEditorBase.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            spyOn(liveEditorBase, 'codePanelUpdate');

            $('.btn-undo').click();

            expect(liveEditorBase.codePanelUpdate).toHaveBeenCalled();
        });

        it('Undo button click should not call codePanelUpdate method if undoList is empty', function() {
            spyOn(liveEditorBase, 'codePanelUpdate');

            $('.btn-undo').click();

            expect(liveEditorBase.codePanelUpdate).not.toHaveBeenCalled();
        });

        it('Undo button click should remove last item from undoList var', function() {
            liveEditorBase.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');
            liveEditorBase.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            expect(liveEditorBase.undoList.length).toBe(2);

            $('.btn-undo').click();

            expect(liveEditorBase.undoList.length).toBe(1);
        });

        it('Undo button click should remove last item from scriptList var', function() {
            liveEditorBase.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');
            liveEditorBase.scriptList.push('$("p").remove();');
            liveEditorBase.scriptList.push('$("p").remove();');

            expect(liveEditorBase.scriptList.length).toBe(2);

            $('.btn-undo').click();
            
            expect(liveEditorBase.scriptList.length).toBe(1);
        });

        it('Undo button click should run last undoList script', function() {
            liveEditorBase.undoList.push('self.$editorIframe.contents().find("body div").append("<small>Hello World</small>");');

            $('.btn-undo').click();

            expect(liveEditorBase.$editorIframe.contents().find("small").length).toBe(1);
        });

        // it('When an element is already select and ESC keydown, should call unselectElements method', function() {
        //     var $p = liveEditorBase.$editorIframe.contents().find('p');
        //     $p.trigger('mousemove').click();

        //     spyOn(liveEditorBase, 'unselectElements');

        //     liveEditorBase.$editorIframe.contents().find('html').trigger('keyup', {which: 27});

        //     expect(liveEditorBase.unselectElements).toHaveBeenCalled();
        // });
    });

    describe('setCurrentElement method', function() {
        beforeEach(function() {
            waits(100);
            liveEditorBase.$editorIframe.load();
        });

        it('set value to attributes', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');

            expect(liveEditorBase.hasOwnProperty('currentSelected')).toBe(false);
            expect(liveEditorBase.hasOwnProperty('$currentSelected')).toBe(false);

            liveEditorBase.setCurrentElement($p);

            expect(liveEditorBase.currentSelected).toBe('html>body>div>p');
            expect(liveEditorBase.$currentSelected).toBe($p);
        });
    });

    describe('getElementPath method', function() {
        beforeEach(function() {
            waits(100);
            liveEditorBase.$editorIframe.load();
        });

        it('return correct path', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p'),
                path = liveEditorBase.getElementPath($p);

            expect(path).toBe('html>body>div>p');
        });
    });

    describe('dispatchLoadEvent method', function() {
        it('Should dispatch an event', function() {
            var counter = 0;

            document.addEventListener('LiveEditorLoaded', function (e) {
                counter ++;
            }, false);

            liveEditorBase.dispatchLoadEvent();

            expect(counter).toBe(1);
        });
    });

    describe('buildButtons method', function() {
        it('Should render undo button', function() {
            var $undoButton = $('.btn-undo');
            expect($undoButton).toExist();

            liveEditorBase.buildButtons();
            expect($('.btn-undo').length).toBe(2);
        });
    });

    describe('addToUndoList method', function() {
        it('Should append formated string inside undoList var', function() {
            liveEditorBase.addToUndoList('\nMy test\t with\t tabs\n and\t\n paragraphs');

            expect(liveEditorBase.undoList.length).toBe(1);
            expect(liveEditorBase.undoList[0]).toBe('My test with tabs and paragraphs');
        });
    });

    describe('addToScriptList method', function() {
        it('Should append formated string inside scriptList var', function() {
            liveEditorBase.addToScriptList('\nMy test\t with\t tabs\n and\t\n paragraphs');

            expect(liveEditorBase.scriptList.length).toBe(1);
            expect(liveEditorBase.scriptList[0]).toBe('My test with tabs and paragraphs');
        });
    });

    describe('codePanelUpdate method', function() {
        it('Should update aceEditor value with scriptList content', function() {
            liveEditorBase.scriptList.push('item 1');
            liveEditorBase.scriptList.push('item 2');
            liveEditorBase.scriptList.push('item 3');

            liveEditorBase.codePanelUpdate();

            var aceEditorValue = liveEditorBase.codePanel.aceEditor.aceEditor.getValue();

            expect(aceEditorValue).toBe('item 1 item 2 item 3')
        });
    });

    describe('operationInit method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('always call codePanelUpdate method', function() {
            spyOn(liveEditorBase, 'codePanelUpdate');

            liveEditorBase.operationInit('fake');

            expect(liveEditorBase.codePanelUpdate).toHaveBeenCalled();
        });

        it('remove operation', function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            spyOn(liveEditorBase.actions, 'currentSelectedRemove');
            spyOn(liveEditorBase, 'unselectElements');

            liveEditorBase.operationInit('remove');

            expect(liveEditorBase.actions.currentSelectedRemove).toHaveBeenCalled();
            expect(liveEditorBase.unselectElements).toHaveBeenCalled();
        });

        it('add-event-click', function() {
            spyOn(liveEditorBase, 'unselectElements');
            spyOn(liveEditorBase.actions, 'currentSelectedAddEvent');

            liveEditorBase.operationInit('add-event-click');

            expect(liveEditorBase.unselectElements).toHaveBeenCalled();
            expect(liveEditorBase.actions.currentSelectedAddEvent).toHaveBeenCalledWith('click');
        });

        it('edit-html-save', function() {
            spyOn(liveEditorBase.actions, 'currentSelectedEditHtml');

            liveEditorBase.operationInit('edit-html-save');

            expect(liveEditorBase.actions.currentSelectedEditHtml).toHaveBeenCalled();
        });

        it('edit-text-save', function() {
            spyOn(liveEditorBase.actions, 'currentSelectedEditText');

            liveEditorBase.operationInit('edit-text-save');

            expect(liveEditorBase.actions.currentSelectedEditText).toHaveBeenCalled();
        });

        it('edit-classes-save', function() {
            spyOn(liveEditorBase.actions, 'currentSelectedEditClasses');

            liveEditorBase.operationInit('edit-classes-save');

            expect(liveEditorBase.actions.currentSelectedEditClasses).toHaveBeenCalled();
        });
    });

    describe('openCurrentMenu method', function() {
    });

    describe('unselectElements method', function() {
    });

    describe('modalEvents method', function() {
    });

    describe('getCurrentParentsPath method', function() {
    });
});
