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
            ];

        modal1 = new LiveEditorModal({
            editor: 'editor-id',
            data: datas[0]
        });

        modal2 = new LiveEditorModal({
            editor: 'editor-id',
            data: datas[1]
        });
    });

    afterEach(function() {
        $('.modal-backdrop').remove();
        $('#edit-html-modal').remove();
        $('#edit-text-modal').remove();
    });

    describe('init method', function() {
        beforeEach(function() {
            params = {
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            }
            modal = new LiveEditorModal(params);
        });

        it('Should call create method', function() {
            spyOn(modal, 'create');
            modal.init(params);
            expect(modal.create).toHaveBeenCalled();
        });

        it('Should call bindEvents method', function() {
            spyOn(modal, 'bindEvents');
            modal.init(params);
            expect(modal.bindEvents).toHaveBeenCalled();
        });
    });

    describe('Create method', function() {
        it('Should create 2 modals', function() {
            var $m1 = $('#edit-html-modal'),
                $m2 = $('#edit-text-modal');

            expect($m1.length).toEqual(1);
            expect($m2.length).toEqual(1);
        });

        it('Should render title', function() {
            var $t1 = $('#edit-html-modal .modal-title').text(),
                $t2 = $('#edit-text-modal .modal-title').text();

            expect($t1).toEqual('Edit HTML');
            expect($t2).toEqual('Edit Text');
        });

        it('Should render field', function() {
            var $f1 = $('#edit-html-modal .modal-body textarea.form-control'),
                $f2 = $('#edit-text-modal .modal-body input.form-control');

            expect($f1.length).toEqual(1);
            expect($f2.length).toEqual(1);
        });

        it('Should render close button', function() {
            var $b = $('#edit-html-modal .modal-header button[data-dismiss]');

            expect($b.length).toEqual(1);
            expect($b.attr('data-dismiss')).toEqual('modal');
            expect($b.html()).toEqual('<span>×</span>');
        });

        it('Should render cancel button', function() {
            var $b = $('#edit-html-modal .modal-footer button[data-dismiss]');

            expect($b.length).toEqual(1);
            expect($b.attr('data-dismiss')).toEqual('modal');
            expect($b.text()).toEqual('Cancel');
        });

        it('Should render save button', function() {
            var $b = $('#edit-html-modal .modal-footer .save-btn');

            expect($b.length).toEqual(1);
            expect($b.attr('type')).toEqual('submit');
            expect($b.text()).toEqual('Save');
        });

        it('Should call getField method', function() {
            spyOn(modal1, 'getField').andReturn('<div></div>');
            modal1.create();
            expect(modal1.getField).toHaveBeenCalled();
        });
    });

    describe('getField method', function() {
        beforeEach(function() {
            modal = new LiveEditorModal({
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            });
        });

        it('Return a form field when language is css', function() {
            var $field = modal.getField();
            expect($field[0].tagName).toBe('DIV');
        });

        it('Return param field when language is not css', function() {
            modal.language = 'any language';
            var $field = modal.getField();
            expect($field[0].tagName).toBe('TEXTAREA');
            expect($field).toHaveId(modal.aceEditorId);
        });

        it('Add class when language is not css', function() {
            modal.language = 'any language';
            var $field = modal.getField();
            expect($field).toHaveClass('ace-editor-field');
            expect($field.find('.entry.input-group')).not.toExist();
        });

        it('Add style input when language is css', function() {
            var $field = modal.getField();
            expect($field).not.toHaveClass('ace-editor-field');
            expect($field.find('.entry.input-group')).toExist();
        });

        it('Return a simple field when there is no language', function() {
            modal.language = null;
            var $field = modal.getField();
            expect($field[0].tagName).toBe('TEXTAREA');
            expect($field).not.toHaveClass('ace-editor-field');
            expect($field.find('.entry.input-group')).not.toExist();
        });
    });

    describe('getStyleInput method', function() {
        beforeEach(function() {
            modal = new LiveEditorModal({
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            });
        });

        it('Should create a correct structure', function() {
            var $entry = modal.getStyleInput();
            expect($entry.find('input[type=text]')).toExist();
            expect($entry.find('.input-group-btn .btn.btn-success.btn-add[type=button] .glyphicon.glyphicon-plus')).toExist();
        });
    });

    describe('deleteInputStyle method', function() {
        beforeEach(function() {
            modal = new LiveEditorModal({
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            });
        });

        it('Should create a correct structure', function() {
            var $entry = modal.getStyleInput(),
                $btn = $entry.find('.btn-add');

            modal.deleteInputStyle($entry);

            expect($btn).not.toHaveClass('btn-add');
            expect($btn).toHaveClass('btn-remove');
            expect($btn).not.toHaveClass('btn-success');
            expect($btn).toHaveClass('btn-danger');
            expect($btn.html()).toBe('<span class="glyphicon glyphicon-minus"></span>');
        });
    });

    describe('bindEvents method', function() {
        beforeEach(function() {
            modal = new LiveEditorModal({
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            });

            _event ={type: 'click', preventDefault: function() {} };
        });

        it('Click on btn-add should call preventDefault method', function() {
            spyOn(_event, 'preventDefault');
            spyOn(modal, 'addNewStyleInput');
            modal.$modal.find('.btn-add').trigger(_event);
            expect(_event.preventDefault).toHaveBeenCalled();
        });

        it('Click on btn-add should call addNewStyleInput method', function() {
            spyOn(modal, 'addNewStyleInput');
            modal.$modal.find('.btn-add').trigger('click');
            expect(modal.addNewStyleInput).toHaveBeenCalled();
        });

        it('Click on btn-remove should call preventDefault method', function() {
            spyOn(_event, 'preventDefault');
            spyOn(modal, 'removeStyleInput');

            var $addBtn = modal.$modal.find('.btn-add');
            $addBtn.trigger(_event);

            var $removeBtn = modal.$modal.find('.btn-remove');
            $removeBtn.trigger(_event);
            
            expect(_event.preventDefault).toHaveBeenCalled();
        });

        it('Click on btn-remove should call removeStyleInput method', function() {
            spyOn(modal, 'removeStyleInput');

            var $addBtn = modal.$modal.find('.btn-add');
            $addBtn.trigger('click');

            var $removeBtn = modal.$modal.find('.btn-remove');
            $removeBtn.trigger('click');

            expect(modal.removeStyleInput).toHaveBeenCalled();
        });
    });

    describe('addNewStyleInput method', function() {
        beforeEach(function() {
            modal = new LiveEditorModal({
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            });
        });

        it('Should call getStyleInput method', function() {
            spyOn(modal, 'getStyleInput').andReturn($('<input>'));
            modal.addNewStyleInput();
            expect(modal.getStyleInput).toHaveBeenCalled();
        });

        it('Should call deleteInputStyle method', function() {
            spyOn(modal, 'deleteInputStyle');
            var $lastEntry = modal.$modal.find('.entry:last');
            modal.addNewStyleInput();
            expect(modal.deleteInputStyle).toHaveBeenCalledWith($lastEntry);
        });

        it('Should append new entry inside form', function() {
            var $entries = modal.$modal.find('.modal-body>div .entry');
            expect($entries.length).toBe(1);

            modal.addNewStyleInput();

            var $entries = modal.$modal.find('.modal-body>div .entry');
            expect($entries.length).toBe(2);
        });

        it('Should not set value to input', function() {
            modal.addNewStyleInput();

            var $entry = modal.$modal.find('.modal-body>div .entry:last');
            expect($entry.find('input').val()).toBe('');
        });

        it('Should set value to input', function() {
            modal.addNewStyleInput('My Value');

            var $entry = modal.$modal.find('.modal-body>div .entry:last');
            expect($entry.find('input').val()).toBe('My Value');
        });
    });

    describe('removeStyleInput method', function() {
        beforeEach(function() {
            modal = new LiveEditorModal({
                editor: 'editor-id',
                data: {
                    name: 'edit-style-modal',
                    title: 'Edit Style',
                    field: 'textarea',
                    language: 'css'
                }
            });
        });

        it('Should remove parent', function() {
            var $entries = modal.$modal.find('.modal-body>div .entry');
            expect($entries.length).toBe(1);

            var $addBtn = modal.$modal.find('.btn-add');
            $addBtn.trigger('click');

            var $entries = modal.$modal.find('.modal-body>div .entry');
            expect($entries.length).toBe(2);

            modal.removeStyleInput($entries.first().find('.btn-remove'));

            var $entries = modal.$modal.find('.modal-body>div .entry');
            expect($entries.length).toBe(1);

            var $btn = modal.$modal.find('form .entry .btn-remove');
            expect($btn).not.toExist();
        });
    });
});
