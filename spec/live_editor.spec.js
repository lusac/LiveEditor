describe('LiveEditor', function() {
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

    describe('iframe onload', function() {
        beforeEach(function() {
            $iframe = $liveEditor.find('iframe');
            spyOn(liveEditor, 'domOutlineInit');
            spyOn(liveEditor, 'bindEvents');
            spyOn(liveEditor, 'saveBody');
            spyOn(liveEditor, 'updateBody');
            spyOn(liveEditor, 'codePanelUpdate');
            spyOn(liveEditor, 'dispatchLoadEvent');
            spyOn(liveEditor, 'applyJs');
            $iframe.load();
        });


        it('Should call domOutlineInit method', function() {
            expect(liveEditor.domOutlineInit).toHaveBeenCalled();
        });

        it('Should call bindEvents method', function() {
            expect(liveEditor.bindEvents).toHaveBeenCalled();
        });

        it('Should call saveBody method', function() {
            expect(liveEditor.saveBody).toHaveBeenCalled();
        });

        it('Should call updateBody method', function() {
            expect(liveEditor.updateBody).toHaveBeenCalled();
        });

        it('Should call codePanelUpdate method', function() {
            expect(liveEditor.codePanelUpdate).toHaveBeenCalled();
        });

        it('Should call dispatchLoadEvent method', function() {
            expect(liveEditor.dispatchLoadEvent).toHaveBeenCalled();
        });
    });

    describe('Build Tabs', function() {
        it('Should build tabs', function() {
            var $tabs = $liveEditor.find('.nav.nav-tabs');
            expect($tabs).toExist();
            expect($tabs.length).toBe(1);
        });
    });

    describe('Build Iframe', function() {
        beforeEach(function() {
            $s = $('.spinner-container');
            $iframe = $liveEditor.find('iframe');
        });

        it('Should build iframe', function() {
            expect($iframe).toExist();
        });

        it('Should create a container element', function() {
            var $container = $iframe.parent(),
                $spinner = $container.find('.spinner-container');
            expect($container).toHaveClass('live-editor-iframe-container');
            expect($spinner).toExist();
        });

        it('Initial Loading Spinner', function() {
            expect($s.text()).toBe(' Loading...');
            expect($s.css('display')).toBe('inline');
        });

        it ('Loading Spinner disappears when iframe is fully loaded', function() {
            $iframe = $liveEditor.find('iframe');
            $iframe.load();
            expect($s.css('display')).toBe('none');
        });
    });

    describe('Build Modals', function() {
        beforeEach(function() {
            waits(100);
            liveEditor.$editorIframe.load();
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
            liveEditor.$editorIframe.load();
        });

        it('Should build Panel', function() {
            var $p = $('#code-panel[live-editor-test-1]');
            expect($p).toExist();
        });
    });

    describe('Build buildToolbar', function() {
        it('Should render a toolbar ul', function() {
            var $t = $('ul.toolbar');
            expect($t).toExist();
        });

        it('Should render an add option button', function() {
            var $b = $('ul.toolbar li .add-option');
            expect($b).toExist();
            expect($b.text()).toBe('+ add option');
        });

        it('Should render an edit/view mode button', function() {
            var $s = $('ul.toolbar li select.form-control'),
                $opts = $s.find('option');

            expect($s).toExist();
            expect($opts.length).toBe(2);
            expect($opts[0].textContent).toBe('Edit mode');
            expect($opts[1].textContent).toBe('View mode');
        });

        it('Should render an undo button', function() {
            var $b = $('ul.toolbar li .btn-undo');
            expect($b).toExist();
            expect($b.text()).toBe('Undo');
        });
    });

    describe('Build DOM outline', function() {
        beforeEach(function() {
            waits(100);
            liveEditor.$editorIframe.load();
        });

        it('Should init DOM outline', function() {
            liveEditor.$editorIframe.on('load', function() {
                var $d = liveEditor.$editorIframe.contents().find('.DomOutline_box');
                expect($d).toExist();
                expect($d.css('display')).toBe('none');
            });
        });
    });

    describe('bindEvents method', function() {
        beforeEach(function() {
            waits(100);
            liveEditor.$editorIframe.load();
        });

        it('Click in any element should call setCurrentElement method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');

            spyOn(liveEditor, 'setCurrentElement');

            $p.trigger('mousemove').click();

            expect(liveEditor.setCurrentElement).toHaveBeenCalled();
        });

        it('Click in any element should call openCurrentMenu method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');

            spyOn(liveEditor, 'openCurrentMenu');

            $p.trigger('mousemove').click();

            expect(liveEditor.openCurrentMenu).toHaveBeenCalled();
        });

        it('Click in floating menu item should call operationInit method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditor, 'operationInit');

            $('ul.dropdown-menu[role] li').click();

            expect(liveEditor.operationInit).toHaveBeenCalled();
        });

        it('When an element is already select and another one is clicked, should call unselectElements method', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditor, 'unselectElements');

            liveEditor.$editorIframe.contents().find('h1').trigger('mousemove').click();

            expect(liveEditor.unselectElements).toHaveBeenCalled();
        });

        it('Undo button click should call codePanelUpdate method if undoList is not empty', function() {
            liveEditor.experiments.test_1.scriptList.push('$("p").remove();');
            liveEditor.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            spyOn(liveEditor, 'codePanelUpdate');

            $('.btn-undo').click();

            expect(liveEditor.codePanelUpdate).toHaveBeenCalled();
        });

        it('Undo button click should not call codePanelUpdate method if undoList is empty', function() {
            spyOn(liveEditor, 'codePanelUpdate');

            $('.btn-undo').click();

            expect(liveEditor.codePanelUpdate).not.toHaveBeenCalled();
        });

        it('Undo button click should remove last item from undoList var', function() {
            liveEditor.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');
            liveEditor.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            expect(liveEditor.experiments.test_1.undoList.length).toBe(2);

            $('.btn-undo').click();

            expect(liveEditor.experiments.test_1.undoList.length).toBe(1);
        });

        it('Undo button click should remove last item from scriptList var', function() {
            spyOn(liveEditor, 'applyJs');

            liveEditor.experiments.test_1.undoList.push(liveEditor.getIframeBody().clone());
            liveEditor.experiments.test_1.scriptList.push('$("p").remove();');
            liveEditor.experiments.test_1.scriptList.push('$("p").remove();');

            expect(liveEditor.experiments.test_1.scriptList.length).toBe(2);

            $('.btn-undo').click();
            
            expect(liveEditor.experiments.test_1.scriptList.length).toBe(1);
        });

        it('Undo button call updateBody method', function() {
            spyOn(liveEditor, 'updateBody');

            liveEditor.experiments.test_1.undoList.push(liveEditor.getIframeBody().clone());
            $('.btn-undo').click();

            expect(liveEditor.updateBody).toHaveBeenCalled();
        });

        // it('When an element is already select and ESC keydown, should call unselectElements method', function() {
        //     var $p = liveEditor.$editorIframe.contents().find('p');
        //     $p.trigger('mousemove').click();

        //     spyOn(liveEditor, 'unselectElements');

        //     liveEditor.$editorIframe.contents().find('html').trigger('keyup', {which: 27});

        //     expect(liveEditor.unselectElements).toHaveBeenCalled();
        // });

        it('tab click should call changeTab method', function() {
            spyOn(liveEditor, 'changeTab');
            $('.nav-tabs a[data-toggle="tab"]:last').click();
            expect(liveEditor.changeTab).toHaveBeenCalled();
        });

        it('tab click should call applyJs method', function() {
            spyOn(liveEditor, 'applyJs');
            $('.nav-tabs a[data-toggle="tab"]:last').click();
            expect(liveEditor.applyJs).toHaveBeenCalled();
        });

        it('tab click should call codePanelUpdate method', function() {
            spyOn(liveEditor, 'codePanelUpdate');
            $('.nav-tabs a[data-toggle="tab"]:last').click();
            expect(liveEditor.codePanelUpdate).toHaveBeenCalled();
        });

        it('add option button should call addNewOption method', function() {
            spyOn(liveEditor, 'addNewOption');
            $('.add-option').click();
            expect(liveEditor.addNewOption).toHaveBeenCalled();
        });

        it('mode select button should call updateBody method', function() {
            spyOn(liveEditor, 'updateBody');
            $('select.form-control').trigger('change');
            expect(liveEditor.updateBody).toHaveBeenCalled();
        });
    });

    describe('setCurrentElement method', function() {
        beforeEach(function() {
            waits(100);
            liveEditor.$editorIframe.load();
        });

        it('set value to attributes', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');

            expect(liveEditor.hasOwnProperty('currentSelected')).toBe(false);
            expect(liveEditor.hasOwnProperty('$currentSelected')).toBe(false);

            liveEditor.setCurrentElement($p);

            expect(liveEditor.currentSelected).toBe('html>body>div>p');
            expect(liveEditor.$currentSelected).toBe($p);
        });
    });

    describe('getElementPath method', function() {
        beforeEach(function() {
            waits(100);
            liveEditor.$editorIframe.load();
        });

        it('return correct path', function() {
            var $p = liveEditor.$editorIframe.contents().find('p'),
                path = liveEditor.getElementPath($p);

            expect(path).toBe('html>body>div>p');
        });
    });

    describe('dispatchLoadEvent method', function() {
        it('Should dispatch an event', function() {
            var counter = 0;

            document.addEventListener('LiveEditorLoaded', function (e) {
                counter ++;
            }, false);

            liveEditor.dispatchLoadEvent();

            expect(counter).toBe(1);
        });
    });

    describe('undoListUpdate method', function() {
        beforeEach(function() {
            $iframe.load();
            waits(100);
        });

        it('Should append a clone from body', function() {
            liveEditor.undoListUpdate();
            var $item = liveEditor.experiments.test_1.undoList[0];
            expect(liveEditor.experiments.test_1.undoList.length).toBe(1);
            expect($item.prop('tagName')).toBe('BODY');
        });
    });

    describe('addToScriptList method', function() {
        it('Should append formated string inside scriptList var', function() {
            liveEditor.addToScriptList('\nMy test\t with\t tabs\n and\t\n paragraphs');

            expect(liveEditor.experiments.test_1.scriptList.length).toBe(1);
            expect(liveEditor.experiments.test_1.scriptList[0]).toBe('My test with tabs and paragraphs');
        });
    });

    describe('codePanelUpdate method', function() {
        it('Should update aceEditor value with scriptList content', function() {
            liveEditor.experiments.test_1.scriptList.push('item 1');
            liveEditor.experiments.test_1.scriptList.push('item 2');
            liveEditor.experiments.test_1.scriptList.push('item 3');

            liveEditor.codePanelUpdate();

            var aceEditorValue = liveEditor.codePanel.aceEditor.aceEditor.getValue();

            expect(aceEditorValue).toBe('item 1 item 2 item 3')
        });
    });

    describe('operationInit method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('always call codePanelUpdate method', function() {
            spyOn(liveEditor, 'codePanelUpdate');

            liveEditor.operationInit('fake');

            expect(liveEditor.codePanelUpdate).toHaveBeenCalled();
        });

        it('remove operation', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            spyOn(liveEditor.actions, 'currentSelectedRemove');
            spyOn(liveEditor, 'unselectElements');

            liveEditor.operationInit('remove');

            expect(liveEditor.actions.currentSelectedRemove).toHaveBeenCalled();
            expect(liveEditor.unselectElements).toHaveBeenCalled();
        });

        it('add-event-click', function() {
            spyOn(liveEditor, 'unselectElements');
            spyOn(liveEditor.actions, 'currentSelectedAddEvent');

            liveEditor.operationInit('add-event-click');

            expect(liveEditor.unselectElements).toHaveBeenCalled();
            expect(liveEditor.actions.currentSelectedAddEvent).toHaveBeenCalledWith('click');
        });

        it('edit-html-save', function() {
            spyOn(liveEditor.actions, 'currentSelectedEditHtml');

            liveEditor.operationInit('edit-html-save');

            expect(liveEditor.actions.currentSelectedEditHtml).toHaveBeenCalled();
        });

        it('edit-text-save', function() {
            spyOn(liveEditor.actions, 'currentSelectedEditText');

            liveEditor.operationInit('edit-text-save');

            expect(liveEditor.actions.currentSelectedEditText).toHaveBeenCalled();
        });

        it('edit-classes-save', function() {
            spyOn(liveEditor.actions, 'currentSelectedEditClasses');

            liveEditor.operationInit('edit-classes-save');

            expect(liveEditor.actions.currentSelectedEditClasses).toHaveBeenCalled();
        });
    });

    describe('currentExperiment method', function() {
        it('Return correct value', function() {
            var c = liveEditor.currentExperiment();
            expect(c).toBe(liveEditor.experiments.test_1);
        });
    });

    describe('saveBody method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should save jquery body', function() {
            expect(liveEditor.$iframeBody.prop('tagName')).toBe('BODY');
        });
    });

    describe('currentMode method', function() {
        it('Should return default edition mode', function() {
            var v = liveEditor.$modeSelect.val();
            expect(v).toBe(liveEditor.currentMode());
            expect('edit').toBe(liveEditor.currentMode());
        });

        it('Should return new value after select change', function() {
            liveEditor.$modeSelect.val('view');
            var v = liveEditor.$modeSelect.val();
            expect(v).toBe(liveEditor.currentMode());
            expect('view').toBe(liveEditor.currentMode());
        })
    });

    describe('changeTab method', function() {
        beforeEach(function() {
            spyOn(liveEditor, 'updateBody');
            spyOn(liveEditor, 'codePanelUpdate');
            liveEditor.changeTab();
        });

        it('Should call updateBody method', function() {
            expect(liveEditor.updateBody).toHaveBeenCalled();
        });

        it('Should call codePanelUpdate method', function() {
            expect(liveEditor.codePanelUpdate).toHaveBeenCalled();
        });
    });

    describe('getIframeBody method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return iframe body', function() {
            var $body = liveEditor.getIframeBody();
            expect($body).toBe(liveEditor.$editorIframe.contents().find('body'));
        });
    });

    describe('addNewOption method', function() {
        beforeEach(function() {
            spyOn(liveEditor.tabs, 'createTabs');
            spyOn(liveEditor, 'updateBody');
            spyOn(liveEditor, 'createExperiments');
            liveEditor.addNewOption();
        });

        it('Should append tab name inside tabsList', function() {
            expect(liveEditor.tabsList.length).toBe(3);
            expect(liveEditor.tabsList[2]).toBe('Test 2');

            liveEditor.addNewOption();

            expect(liveEditor.tabsList.length).toBe(4);
            expect(liveEditor.tabsList[3]).toBe('Test 3');
        });

        it('Should call createTabs method', function() {
            expect(liveEditor.tabs.createTabs).toHaveBeenCalledWith(['Test 2']);
        });

        it('Should call createExperiments method', function() {
            expect(liveEditor.createExperiments).toHaveBeenCalled();
        });

        it('Should call updateBody method', function() {
            expect(liveEditor.updateBody).toHaveBeenCalled();
        });
    });

    describe('updateBody method', function() { 
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
