describe("Actions", function() {
    beforeEach(function() {
        liveEditorBase = new LiveEditorBase({editor: '#live-editor-test-1', url: 'site.html'});
        $liveEditorBase = $('.live-editor');
    });

    afterEach(function() {
        $liveEditorBase.empty();
        $('.modal').remove();
        $('#code-panel').remove();
        $('.code-panel-button').remove();
        $('ul.dropdown-menu[role]').remove();
    });

    describe("currentSelectedRemove method", function() {
        beforeEach(function() {
            waits(100);
        });

        it("Should add script in scriptList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.actions.currentSelectedRemove();

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>div>p").remove();']);
        });

        it("Should add script in undoList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.actions.currentSelectedRemove();
            var expt = ["self.$editorIframe.contents().find('html>body>div').replaceWith('<div><p>Hello World!</p></div>');"];

            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });

    describe("currentSelectedAddEvent method", function() {
        beforeEach(function() {
            waits(100);
        });

        it("Should add script in scriptList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.actions.currentSelectedAddEvent('custom-event');

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>div>p").attr("easyab-track-custom-event", 1);']);
        });
    });

    describe("currentSelectedEditHtml method", function() {
        beforeEach(function() {
            waits(100);
        });

        // Need change to ace editor.
        // it("Should add script in scriptList", function() {
        //     liveEditorBase.$editHtmlModal.find('.modal-body textarea').val("<small>my custom html</small>");
        //     liveEditorBase.actions.currentSelectedEditHtml();

        //     expect(liveEditorBase.scriptList.length).toEqual(1);
        //     expect(liveEditorBase.scriptList).toEqual(['$("html>body>div>p").replaceWith("<small>my custom html</small>");']);
        // });

        it("Should add script in undoList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.$editHtmlModal.find('.modal-body textarea').val("my custom html");
            liveEditorBase.actions.currentSelectedEditHtml();
            var expt = ['self.$editorIframe.contents().find(\'html>body>div\').replaceWith(\'<div><p>Hello World!</p></div>\');'];

            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });

    describe("currentSelectedEditText method", function() {
        beforeEach(function() {
            waits(100);
        });

        it("Should add script in scriptList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.$editTextModal.find('.modal-body textarea').val("my custom html");
            liveEditorBase.actions.currentSelectedEditText();

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>div>p").text("my custom html");']);
        });

        it("Should add script in undoList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.$editTextModal.find('.modal-body textarea').val("my custom html");
            liveEditorBase.actions.currentSelectedEditText();
            var expt = ['self.$editorIframe.contents().find("html>body>div>p").text("Hello World!");'];

            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });

    describe("currentSelectedEditClasses method", function() {
        beforeEach(function() {
            waits(100);
        });

        it("Should add script in scriptList", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditorBase.actions.currentSelectedEditClasses();

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>div>p").attr("class", "my-class-1 my-class-2");']);
        });

        it("Should add script in undoList - with class", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.$currentSelected.addClass('my-class');
            liveEditorBase.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditorBase.actions.currentSelectedEditClasses();
            var expt = ['self.$editorIframe.contents().find("html>body>div>p").attr("class", "my-class");'];

            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });

        it("Should add script in undoList - with no class", function() {
            var $p = liveEditorBase.$editorIframe.contents().find('p');
            liveEditorBase.setCurrentElement($p);

            liveEditorBase.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditorBase.actions.currentSelectedEditClasses();
            var expt = ['self.$editorIframe.contents().find("html>body>div>p").attr("class", "");'];

            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });
});
