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
        it("Should append button in the DOM", function() {
            var $btn = $('.code-panel-button');
            expect($btn.length).toEqual(1);
        });

        it("Should append panel in the DOM", function() {
            var $panel = $('#code-panel');
            expect($panel.length).toEqual(1);
        });

        it("Should append button in container element", function() {
            codePanelCustom = new window.LiveEditorCodePanel({
                editorName: 'test-editor-custom',
                appendTo: $container
            });

            var $btn = $('.container .code-panel-button');
            expect($btn.length).toEqual(1);
        });

        it("Should append panel in container element", function() {
            codePanelCustom = new window.LiveEditorCodePanel({
                editorName: 'test-editor-custom',
                appendTo: $container
            });

            var $panel = $('.container #code-panel');
            expect($panel.length).toEqual(1);
        });

        it("Button should have data-target attribute", function() {
            var $attr = $('.code-panel-button').attr('data-target');
            expect($attr).toEqual('#code-panel[test-editor]');
        });

        it("Button should have editor attribute", function() {
            var $attr = $('.code-panel-button').attr('test-editor');
            expect($attr).toEqual('1');
        });


        it("Panel should have editor attribute", function() {
            var $attr = $('#code-panel').attr('test-editor');
            expect($attr).toEqual('1');
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
    });
});
