describe("CodePanel", function() {
    beforeEach(function() {
        setFixtures('<div class="container"></div>');
        $container = $('.container');

        codePanel = new window.LiveEditorCodePanel({
            editorName: 'test-editor'
        });
    });

    afterEach(function(){
        $('.container').remove();
        $('#code-panel').remove();
        $('.code-panel-button').remove();
    });

    describe("Create method", function() {
        it("Should append panel in the DOM", function() {
            var $panel = $('#code-panel');
            expect($panel.length).toEqual(1);
        });

        it("Should append panel in container element", function() {
            codePanelCustom = new window.LiveEditorCodePanel({
                editorName: 'test-editor-custom',
                appendTo: $container
            });

            var $panel = $('.container #code-panel');
            expect($panel.length).toEqual(1);
        });

        it("Panel should have correct structure", function() {
            var $panel = $('#code-panel'),
                $textarea = $panel.find('textarea'),
                $buttons = $panel.find('button');

            expect($textarea.length).toEqual(1);
            expect($buttons.length).toEqual(2);
            expect($buttons.first().text()).toEqual('cancel');
            expect($buttons.last().text()).toEqual('save code');
        });

        it('Should create an ace editor', function() {
            var $aceEditor = $('.ace_editor');
            expect($aceEditor.length).toEqual(1);
        });

        it('Should have an aceEditor attribute', function() {
            expect(codePanel.hasOwnProperty('aceEditor')).toEqual(true);
            expect(codePanel.aceEditor.constructor).toEqual(LiveEditorAceEditor);
        });

        it('Should have an editorId attribute', function() {
            expect(codePanel.hasOwnProperty('editorId')).toEqual(true);
            expect(codePanel.editorId).toEqual('code-panel-ace-editor-test-editor');
        });
    });
});
