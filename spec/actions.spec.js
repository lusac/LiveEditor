describe("Actions", function() {
    beforeEach(function() {
        liveEditor = new LiveEditor({editor: '#live-editor-test-1', tabs: ['test 1', 'test 2'], url: 'site.html'});
        $liveEditor = $('.live-editor');
    });

    afterEach(function() {
        $liveEditor.empty();
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

        it('Should add script in undoList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.actions.currentSelectedRemove();
            var expt = ["self.$editorIframe.contents().find('html>body>div').replaceWith('<div><p>Hello World!</p></div>');"];

            expect(liveEditor.experiments.test_1.undoList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.undoList).toEqual(expt);
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

        it('Should add script in undoList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editHtmlModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditHtml();
            var expt = ['self.$editorIframe.contents().find(\'html>body>div\').replaceWith(\'<div><p>Hello World!</p></div>\');'];

            expect(liveEditor.experiments.test_1.undoList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.undoList).toEqual(expt);
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

        it('Should add script in undoList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();
            var expt = ['self.$editorIframe.contents().find("html>body>div>p").text("Hello World!");'];

            expect(liveEditor.experiments.test_1.undoList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.undoList).toEqual(expt);
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

        it('Should add script in undoList - with class', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$currentSelected.addClass('my-class');
            liveEditor.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditor.actions.currentSelectedEditClasses();
            var expt = ['self.$editorIframe.contents().find("html>body>div>p").attr("class", "my-class");'];

            expect(liveEditor.experiments.test_1.undoList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.undoList).toEqual(expt);
        });

        it('Should add script in undoList - with no class', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditor.actions.currentSelectedEditClasses();
            var expt = ['self.$editorIframe.contents().find("html>body>div>p").attr("class", "");'];

            expect(liveEditor.experiments.test_1.undoList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.undoList).toEqual(expt);
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

    describe('_replaceWithUndo method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should call addToUndoList method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);
            
            var oldHtml = liveEditor.$currentSelected.parent()[0].outerHTML,
                expectString = "self.$editorIframe.contents().find('html>body>div').replaceWith('" + oldHtml.replace(new RegExp("'", 'g'), '&#39;') + "');";

            spyOn(liveEditor, 'addToUndoList');

            liveEditor.actions._replaceWithUndo();
            expect(liveEditor.addToUndoList).toHaveBeenCalledWith(expectString);
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
});
