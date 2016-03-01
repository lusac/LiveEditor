describe("Modal", function() {
    beforeEach(function() {
        var datas = [
                {
                    name: 'edit-html-modal',
                    title: 'Edit HTML',
                    field: 'textarea'
                }, {
                    name: 'edit-text-modal',
                    title: 'Edit Text',
                    field: 'input'
                }
            ],
            modal1 = new LiveEditorModal({
                editor: 'editor-id',
                data: datas[0]
            }),
            modal2 = new LiveEditorModal({
                editor: 'editor-id',
                data: datas[1]
            });
    });

    afterEach(function() {
        $('#edit-html-modal').remove();
        $('#edit-text-modal').remove();
    });

    describe("Create method", function() {
        it("Should create 2 modals", function() {
            var $m1 = $('#edit-html-modal'),
                $m2 = $('#edit-text-modal');

            expect($m1.length).toEqual(1);
            expect($m2.length).toEqual(1);
        });

        it("Should render title", function() {
            var $t1 = $('#edit-html-modal .modal-title').text(),
                $t2 = $('#edit-text-modal .modal-title').text();

            expect($t1).toEqual('Edit HTML');
            expect($t2).toEqual('Edit Text');
        });

        it("Should render field", function() {
            var $f1 = $('#edit-html-modal .modal-body textarea.form-control'),
                $f2 = $('#edit-text-modal .modal-body input.form-control');

            expect($f1.length).toEqual(1);
            expect($f2.length).toEqual(1);
        });

        it("Should render close button", function() {
            var $b = $('#edit-html-modal .modal-header button[data-dismiss]');

            expect($b.length).toEqual(1);
            expect($b.attr('data-dismiss')).toEqual('modal');
            expect($b.html()).toEqual('<span>×</span>');
        });

        it("Should render cancel button", function() {
            var $b = $('#edit-html-modal .modal-footer button[data-dismiss]');

            expect($b.length).toEqual(1);
            expect($b.attr('data-dismiss')).toEqual('modal');
            expect($b.text()).toEqual('Cancel');
        });

        it("Should render save button", function() {
            var $b = $('#edit-html-modal .modal-footer .save-btn');

            expect($b.length).toEqual(1);
            expect($b.attr('type')).toEqual('submit');
            expect($b.text()).toEqual('Save');
        });
    });
});
