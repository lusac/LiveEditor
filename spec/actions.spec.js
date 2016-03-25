describe("Actions", function() {
    beforeEach(function() {
        liveEditor = new LiveEditor({editor: '#live-editor-test-1', tabs: ['test 1', 'test 2'], url: 'site.html'});
        $liveEditor = $('.live-editor');
    });

    afterEach(function() {
        $liveEditor.empty();
        $('.toolbar').remove();
        $('.modal').remove();
        $('#code-panel').remove();
        $('.code-panel-button').remove();
        $('ul.dropdown-menu[role]').remove();
    });

    describe('currentSelectedRemove method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.actions.currentSelectedRemove();

            expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").remove();']);
        });

        it('Should call applyJs method with params', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.actions.currentSelectedRemove();

            expect(liveEditor.applyJs).toHaveBeenCalledWith('$("html>body>div>p").remove();');
        });

        it('Should call undoListUpdate method', function() {
            spyOn(liveEditor, 'applyJs');
            spyOn(liveEditor, 'undoListUpdate');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.actions.currentSelectedRemove();

            expect(liveEditor.undoListUpdate).toHaveBeenCalled();
        });
    });

    describe('currentSelectedAddEvent method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.actions.currentSelectedAddEvent('custom-event');

            expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").attr("easyab-track-custom-event", 1);']);
        });
    });

    describe('currentSelectedEditHtml method', function() {
        beforeEach(function() {
            waits(100);
        });

        // Need change to ace editor.
        // it('Should add script in scriptList', function() {
        //     liveEditor.$editHtmlModal.find('.modal-body textarea').val('<small>my custom html</small>');
        //     liveEditor.actions.currentSelectedEditHtml();

        //     expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
        //     expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").replaceWith("<small>my custom html</small>");']);
        // });

        // it('Should call applyJs method with params', function() {
        // });

        it('Should call undoListUpdate method', function() {
            spyOn(liveEditor, 'applyJs');
            spyOn(liveEditor, 'undoListUpdate');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editHtmlModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditHtml();

            expect(liveEditor.undoListUpdate).toHaveBeenCalled();
        });
    });

    describe('currentSelectedEditText method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();

            expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").text("my custom html");']);
        });

        it('Should call applyJs method with params', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();

            var str = '$' + liveEditor.actions._changeText('html>body>div>p', 'my custom html');
            expect(liveEditor.applyJs).toHaveBeenCalledWith(str);
        });

        it('Should call undoListUpdate method', function() {
            spyOn(liveEditor, 'applyJs');
            spyOn(liveEditor, 'undoListUpdate');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();

            expect(liveEditor.undoListUpdate).toHaveBeenCalled();
        });
    });

    describe('currentSelectedEditClasses method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditor.actions.currentSelectedEditClasses();

            expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").attr("class", "my-class-1 my-class-2");']);
        });

        it('Should call applyJs method with params', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditor.actions.currentSelectedEditClasses();

            var str = '$' + liveEditor.actions._changeClass('html>body>div>p', 'my-class-1 my-class-2');
            expect(liveEditor.applyJs).toHaveBeenCalledWith(str);
        });

        it('Should call undoListUpdate method', function() {
            spyOn(liveEditor, 'applyJs');
            spyOn(liveEditor, 'undoListUpdate');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$currentSelected.addClass('my-class');
            liveEditor.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditor.actions.currentSelectedEditClasses();

            expect(liveEditor.undoListUpdate).toHaveBeenCalled();
        });
    });
    
    describe('_changeClass method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return string', function() {
            var str = liveEditor.actions._changeClass('.test-class', 'new-class');
            expect(str).toBe('(".test-class").attr("class", "new-class");');
        });
    });

    describe('_changeText method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return string', function() {
            var str = liveEditor.actions._changeText('.test-class', 'My new text');
            expect(str).toBe('(".test-class").text("My new text");');
        });
    });

    describe('getIframeCurrentElement method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return currentElement inside iframe', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            expect(liveEditor.actions.getIframeCurrentElement(), $p);
        });
    });

    describe('currentOptionRename method', function() {
        beforeEach(function() {
            $('#rename-modal').find('.modal-body input').val('New Tab');
        });

        it('Should rename tab name', function() {
            liveEditor.actions.currentOptionRename();
            var label = $('.nav-tabs>li.active>a').text();
            expect(label).toBe('New Tab');
        });

        it('Should rename tab data-name attribute', function() {
            liveEditor.actions.currentOptionRename();
            var $tab = $('.nav-tabs>li.active>a');
            expect($tab).toHaveAttr('data-name', 'new_tab');
        });

        it('Should append caret inside tab', function() {
            liveEditor.actions.currentOptionRename();
            var $caret = $('.nav-tabs>li.active>a span.caret');
            expect($caret).toExist();
        });

        it('Should update liveEditor experiments', function() {
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(true);
            expect(liveEditor.experiments.hasOwnProperty('new_tab')).toBe(false);
            liveEditor.actions.currentOptionRename();
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(false);
            expect(liveEditor.experiments.hasOwnProperty('new_tab')).toBe(true);
        });

        it('Experiments data should not change', function() {
            var oldData = liveEditor.experiments.test_1;
            liveEditor.actions.currentOptionRename();
            var newData = liveEditor.experiments.new_tab;

            expect(oldData).toBe(newData);
        });
    });

    describe('currentOptionDelete method', function() {
        it('Should remove tab element', function() {
            var $tab = $('.nav-tabs>li.active');
            liveEditor.actions.currentOptionDelete();
            expect($tab.parent()).not.toExist();
        });

        it('Should set next tab as active', function() {
            var $tab1 = $('.nav-tabs>li.active'),
                $tab2 = $('.nav-tabs>li:eq(1)');

            liveEditor.actions.currentOptionDelete();

            var $newTab2 = $('.nav-tabs>li:eq(0)');
            expect($tab1.parent()).not.toExist();
            expect($tab2).toBe($newTab2);
            expect($newTab2.hasClass('active')).toBe(true);
        });

        it('Should remove liveEditor experiment from dict', function() {
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(true);
            liveEditor.actions.currentOptionDelete();
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(false);
        });

        it('Do not remove tab if it is the last one', function() {
            // TODO
        });
    });

    describe('currentOptionDuplicate method', function() {

    });
});
