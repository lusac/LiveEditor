describe('Toolbar', function() {
    beforeEach(function() {
        setFixtures('<div class="container"></div>');
        toolbar = new LiveEditorToolbar({
            $appendTo: $('.container')
        });
    });

    afterEach(function() {
        $('.container').remove();
    });

    describe('init', function() {
        it('Should set $appendTo attribute with param var', function() {
            var $c = $('.container');
            toolbar_2 = new LiveEditorToolbar({ $appendTo: $c });
            expect(toolbar_2.$appendTo).toBe($c);
        });

        it('Should render a toolbar ul', function() {
            var $t = $('.container ul.live-editor-toolbar');
            expect($t).toExist();
        });

        it('Should render an edit/view mode button', function() {
            var $s = $('.container ul.live-editor-toolbar li select.form-control'),
                $opts = $s.find('option');

            expect($s).toExist();
            expect($opts.length).toBe(2);
            expect($opts[0].textContent).toBe('Edit mode');
            expect($opts[1].textContent).toBe('View mode');
        });

        it('Should render an undo button', function() {
            var $b = $('.container ul.live-editor-toolbar li .btn-undo');
            expect($b).toExist();
            expect($b.html()).toBe('<span class="glyphicon glyphicon-share-alt"></span>');
        });

        it("Should render codePanel button", function() {
            var $btn = $('.container ul.live-editor-toolbar li .code-panel-button');
            expect($btn.length).toEqual(1);
            expect($btn.html()).toEqual('<span class="glyphicon glyphicon-console"></span>');
        });

        it("codePanel button should have data-target attribute", function() {
            var $attr = $('.container ul.live-editor-toolbar li  .code-panel-button').attr('data-target');
            expect($attr).toEqual('#code-panel');
        });
    });
});
