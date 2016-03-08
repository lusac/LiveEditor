describe("Actions", function() {
    beforeEach(function() {
        var html = '<html>' +
                        '<head>' +
                            '<title>Teste Jasmine</title>' +
                        '</head>' +
                        '<body>' +
                            '<h1>Teste Jasmine</h1>' +
                            '<p>Hello World!</p>' +
                        '</body>' +
                    '</html>';
        liveEditorBase = new LiveEditorBase({editor: '#live-editor-test-1', content: html});
        $liveEditorBase = $('.live-editor');

        var $p = liveEditorBase.$editorIframe.contents().find('p');
        liveEditorBase.setCurrentElement($p);
    });

    afterEach(function() {
        $liveEditorBase.empty();
        $('.modal').remove();
        $('#code-panel').remove();
        $('.code-panel-button').remove();
        $('ul.dropdown-menu[role]').remove();
    })

    describe("currentSelectedRemove method", function() {
        it("Should add script in scriptList", function() {
            liveEditorBase.actions.currentSelectedRemove();

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptGoal.length).toEqual(0);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>p").remove();']);
        });

        it("Should add script in undoList", function() {
            liveEditorBase.actions.currentSelectedRemove();
            var expt = ["self.$editorIframe.contents().find('html>body').replaceWith('<body><h1>Teste Jasmine</h1><p>Hello World!</p></body>');"];

            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });

    describe("currentSelectedAddEvent method", function() {
        it("Should add script in scriptGoal", function() {
            liveEditorBase.actions.currentSelectedAddEvent('custom-event');

            expect(liveEditorBase.scriptGoal.length).toEqual(1);
            expect(liveEditorBase.scriptGoal).toEqual(['$("html>body>p").attr("easyab-track-custom-event", 1);']);
            expect(liveEditorBase.scriptList.length).toEqual(0);
        });
    });

    describe("currentSelectedEditHtml method", function() {
        // Need change to ace editor.
        // it("Should add script in scriptList", function() {
        //     liveEditorBase.$editHtmlModal.find('.modal-body textarea').val("<small>my custom html</small>");
        //     liveEditorBase.actions.currentSelectedEditHtml();

        //     expect(liveEditorBase.scriptList.length).toEqual(1);
        //     expect(liveEditorBase.scriptList).toEqual(['$("html>body>p").replaceWith("<small>my custom html</small>");']);
        //     expect(liveEditorBase.scriptGoal.length).toEqual(0);
        // });

        it("Should add script in undoList", function() {
            liveEditorBase.$editHtmlModal.find('.modal-body textarea').val("my custom html");
            liveEditorBase.actions.currentSelectedEditHtml();
            var expt = ['self.$editorIframe.contents().find(\'html>body\').replaceWith(\'<body><h1>Teste Jasmine</h1><p>Hello World!</p></body>\');'];
            
            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });

    describe("currentSelectedEditText method", function() {
        it("Should add script in scriptList", function() {
            liveEditorBase.$editTextModal.find('.modal-body textarea').val("my custom html");
            liveEditorBase.actions.currentSelectedEditText();

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>p").text("my custom html");']);
            expect(liveEditorBase.scriptGoal.length).toEqual(0);
        });

        it("Should add script in undoList", function() {
            liveEditorBase.$editTextModal.find('.modal-body textarea').val("my custom html")
            liveEditorBase.actions.currentSelectedEditText();
            var expt = ['self.$editorIframe.contents().find("html>body>p").text("Hello World!");'];
            
            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });

    describe("currentSelectedEditClasses method", function() {
        it("Should add script in scriptList", function() {
            liveEditorBase.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditorBase.actions.currentSelectedEditClasses();

            expect(liveEditorBase.scriptList.length).toEqual(1);
            expect(liveEditorBase.scriptList).toEqual(['$("html>body>p").attr("class", "my-class-1 my-class-2");']);
            expect(liveEditorBase.scriptGoal.length).toEqual(0);
        });

        it("Should add script in undoList - with class", function() {
            liveEditorBase.$currentSelected.addClass('my-class')
            liveEditorBase.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditorBase.actions.currentSelectedEditClasses();
            var expt = ['self.$editorIframe.contents().find("html>body>p").attr("class", "my-class");'];
            
            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });

        it("Should add script in undoList - with no class", function() {
            liveEditorBase.$editClassesModal.find('.modal-body input').val('my-class-1 my-class-2');
            liveEditorBase.actions.currentSelectedEditClasses();
            var expt = ['self.$editorIframe.contents().find("html>body>p").attr("class", "");'];
            
            expect(liveEditorBase.undoList.length).toEqual(1);
            expect(liveEditorBase.undoList).toEqual(expt);
        });
    });
});
