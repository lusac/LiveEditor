describe('LiveEditor', function() {
    beforeEach(function() {
        liveEditorTest = new LiveEditor({editor: '#live-editor-test-1', tabs: ['test 1', 'test 2'], url: 'site.html'});
        $liveEditorTest = $('.live-editor');
    });

    afterEach(function() {
        $liveEditorTest.empty();
        $('.modal').remove();
        $('.toolbar').remove();
        $('#code-panel').remove();
        $('.modal-backdrop').remove();
        $('.code-panel-button').remove();
        $('ul.dropdown-menu[role]').remove();
    });

    describe('iframe onload', function() {
        beforeEach(function() {
            $iframe = $liveEditorTest.find('iframe');
            spyOn(liveEditorTest, 'domOutlineInit');
            spyOn(liveEditorTest, 'bindEvents');
            spyOn(liveEditorTest, 'saveBody');
            spyOn(liveEditorTest, 'updateBody');
            spyOn(liveEditorTest, 'codePanelUpdate');
            spyOn(liveEditorTest, 'dispatchLoadEvent');
            spyOn(liveEditorTest, 'applyJs');
            $iframe.load();
        });


        it('Should call domOutlineInit method', function() {
            expect(liveEditorTest.domOutlineInit).toHaveBeenCalled();
        });

        it('Should call bindEvents method', function() {
            expect(liveEditorTest.bindEvents).toHaveBeenCalled();
        });

        it('Should call saveBody method', function() {
            expect(liveEditorTest.saveBody).toHaveBeenCalled();
        });

        it('Should call updateBody method', function() {
            expect(liveEditorTest.updateBody).toHaveBeenCalled();
        });

        it('Should call codePanelUpdate method', function() {
            expect(liveEditorTest.codePanelUpdate).toHaveBeenCalled();
        });

        it('Should call dispatchLoadEvent method', function() {
            expect(liveEditorTest.dispatchLoadEvent).toHaveBeenCalled();
        });
    });

    describe('Build Tabs', function() {
        it('Should build tabs', function() {
            var $tabs = $liveEditorTest.find('.nav.nav-tabs');
            expect($tabs).toExist();
            expect($tabs.length).toBe(1);
        });
    });

    describe('Build Iframe', function() {
        beforeEach(function() {
            $s = $('.spinner-container');
            $iframe = $liveEditorTest.find('iframe');
        });

        it('Should build iframe', function() {
            expect($iframe).toExist();
        });

        it('Should create a header element', function() {
            var $header = $('header.live-editor-header');
            expect($header).toExist();
        });

        it('Should create a container element', function() {
            var $container = $iframe.parent(),
                $spinner = $container.find('.spinner-container');
            expect($container).toHaveClass('live-editor-iframe-container');
            expect($spinner).toExist();
        });

        it('Header and container elements should be siblings', function() {
            var $header = $('header.live-editor-header'),
                $container = $('.live-editor-iframe-container');
            expect($header.siblings()).toBe($container);
        });

        it('Initial Loading Spinner', function() {
            expect($s.text()).toBe(' Loading...');
            expect($s.css('display')).toBe('inline');
        });

        it ('Loading Spinner disappears when iframe is fully loaded', function() {
            $iframe.load();
            expect($s.css('display')).toBe('none');
        });
    });

    describe('Build Modals', function() {
        beforeEach(function() {
            waits(150);
            liveEditorTest.$editorIframe.load();
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
            waits(150);
            liveEditorTest.$editorIframe.load();
        });

        it('Should build Panel', function() {
            var $p = $('#code-panel');
            expect($p).toExist();
        });
    });

    describe('Build Toolbar', function() {
        beforeEach(function() {
            waits(150);
            liveEditorTest.$editorIframe.load();
        });

        it('Should build Panel', function() {
            var $t = $('ul.toolbar');
            expect($t).toExist();
        });
    });

    describe('Build DOM outline', function() {
        beforeEach(function() {
            waits(150);
            liveEditorTest.$editorIframe.load();
        });

        it('Should init DOM outline', function() {
            liveEditorTest.$editorIframe.on('load', function() {
                var $d = liveEditorTest.$editorIframe.contents().find('.DomOutline_box');
                expect($d).toExist();
                expect($d.css('display')).toBe('none');
            });
        });
    });

    describe('bindEvents method', function() {
        beforeEach(function() {
            waits(150);
            // liveEditorTest.$editorIframe.load();
        });

        it('Click in any element should call setCurrentElement method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');

            spyOn(liveEditorTest, 'setCurrentElement');

            $p.trigger('mousemove').click();

            expect(liveEditorTest.setCurrentElement).toHaveBeenCalled();
        });

        it('Click in any element should call openCurrentMenu method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');

            spyOn(liveEditorTest, 'openCurrentMenu');

            $p.trigger('mousemove').click();

            expect(liveEditorTest.openCurrentMenu).toHaveBeenCalled();
        });

        it('Click in floating menu item should call operationInit method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditorTest, 'operationInit');

            $('ul.dropdown-menu[role] li').click();

            expect(liveEditorTest.operationInit).toHaveBeenCalled();
        });

        it('When an element is already select and another one is clicked, should call unselectElements method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            $p.trigger('mousemove').click();

            spyOn(liveEditorTest, 'unselectElements');

            liveEditorTest.$editorIframe.contents().find('h1').trigger('mousemove').click();

            expect(liveEditorTest.unselectElements).toHaveBeenCalled();
        });

        // it('When an element is already select and ESC keydown, should call unselectElements method', function() {
        //     var $p = liveEditorTest.$editorIframe.contents().find('p');
        //     $p.trigger('mousemove').click();

        //     spyOn(liveEditorTest, 'unselectElements');

        //     liveEditorTest.$editorIframe.contents().find('html').trigger('keyup', {which: 27});

        //     expect(liveEditorTest.unselectElements).toHaveBeenCalled();
        // });

        it('tab click should call changeTab method', function() {
            spyOn(liveEditorTest, 'changeTab');
            $('.nav-tabs a[data-toggle="tab"]:last').click();
            expect(liveEditorTest.changeTab).toHaveBeenCalled();
        });

        it('tab click should call applyJs method', function() {
            spyOn(liveEditorTest, 'applyJs');
            $('.nav-tabs a[data-toggle="tab"]:last').click();
            expect(liveEditorTest.applyJs).toHaveBeenCalled();
        });

        it('tab click should call codePanelUpdate method', function() {
            spyOn(liveEditorTest, 'codePanelUpdate');
            $('.nav-tabs a[data-toggle="tab"]:last').click();
            expect(liveEditorTest.codePanelUpdate).toHaveBeenCalled();
        });

        it('add option button should call addNewOption method', function() {
            spyOn(liveEditorTest, 'addNewOption');
            $('.add-option').click();
            expect(liveEditorTest.addNewOption).toHaveBeenCalled();
        });

        it('mode select button should call updateBody method', function() {
            spyOn(liveEditorTest, 'updateBody');
            $('select.form-control').trigger('change');
            expect(liveEditorTest.updateBody).toHaveBeenCalled();
        });

        it('open code panel should call codePanelUpdate method', function() {
            spyOn(liveEditorTest, 'codePanelUpdate');
            $('#code-panel').trigger('show.bs.collapse');
            expect(liveEditorTest.codePanelUpdate).toHaveBeenCalled();
        });

        it('Undo button click should call undo method if undoList is not empty', function() {
            liveEditorTest.experiments.test_1.scriptList.push('$("p").remove();');
            liveEditorTest.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            spyOn(liveEditorTest.actions, 'undo');

            $('.btn-undo').click();

            expect(liveEditorTest.actions.undo).toHaveBeenCalled();
        });

        it('Undo button click should not call undo method if undoList is empty', function() {
            spyOn(liveEditorTest.actions, 'undo');

            $('.btn-undo').click();

            expect(liveEditorTest.actions.undo).not.toHaveBeenCalled();
        });

        it('document key up should call keyUpEvents method', function() {
            spyOn(liveEditorTest, 'keyUpEvents');

            var e = $.Event("keyup");
            e.which = 37; 
            $(document).trigger(e);

            expect(liveEditorTest.keyUpEvents).toHaveBeenCalled();
        });

        it('iframe document key up should call keyUpEvents method', function() {
            spyOn(liveEditorTest, 'keyUpEvents');

            var e = $.Event("keyup");
            e.which = 37; 
            liveEditorTest.$editorIframe.contents().trigger(e);

            expect(liveEditorTest.keyUpEvents).toHaveBeenCalled();
        });

        // describe('Floating Menu mouse enter', function() {
        //     beforeEach(function() {
        //         var $p = liveEditorTest.$editorIframe.contents().find('p');
        //         liveEditorTest.setCurrentElement($p);
        //         liveEditorTest.openCurrentMenu();

        //         _event ={type: 'mouseenter', stopPropagation: function() {} };
        //         $el = $(document).find('#floating-menu .container-item-el[data-element-path]:first');

        //         spyOn(_event, 'stopPropagation');
        //         spyOn(liveEditorTest.domOutline, 'draw');

        //         // because the bind is been called many
        //         // times for each LiveEditor instances
        //         try {
        //             $el.trigger(_event);
        //         } catch (err) {}
        //     });

        //     it('Container element should call stopPropagation method', function() {
        //         expect(_event.stopPropagation).toHaveBeenCalled();
        //     });

        //     it('Container element should call domOutline draw method', function() {
        //         var el = liveEditorTest.$editorIframe.contents().find($el.data('element-path'))[0];
        //         expect(liveEditorTest.domOutline.draw).toHaveBeenCalledWith(el);
        //     });
        // });
        
        // describe('Floating Menu mouse up', function() {
        //     beforeEach(function() {
        //         var $p = liveEditorTest.$editorIframe.contents().find('p');

        //         liveEditorTest.setCurrentElement($p);
        //         liveEditorTest.openCurrentMenu();

        //         $el = $liveEditorTest.find('#floating-menu .container-item-el[data-element-path]:first');

        //         _event ={type: 'mouseup', stopPropagation: function() {} };

        //         spyOn(_event, 'stopPropagation');
        //         spyOn(liveEditorTest, 'selectElement');

        //         // because the bind is been called many
        //         // times for each LiveEditor instances
        //         try {
        //             $el.trigger(_event);
        //         } catch (err) {}

        //         $el.trigger(_event);
        //     });

        //     it('Mouseup: floating menu container element should call stopPropagation method', function() {
        //         expect(_event.stopPropagation).toHaveBeenCalled();
        //     });

        //     it('Mouseup: floating menu container element should call selectElement method', function() {
        //         expect(liveEditorTest.selectElement).toHaveBeenCalled();
        //     });
        // });

        // describe('Floating Menu mouse leave', function() {
        //     beforeEach(function() {
        //         var $p = liveEditorTest.$editorIframe.contents().find('p');

        //         liveEditorTest.setCurrentElement($p);
        //         liveEditorTest.openCurrentMenu();

        //         $el = $liveEditorTest.find('#select-container');

        //         spyOn(liveEditorTest.domOutline, 'draw');

        //         // because the bind is been called many
        //         // times for each LiveEditor instances
        //         try {
        //             $el.trigger('mouseleave');
        //         } catch (err) {}
        //     });

        //     it('Mouseleave: floating menu container element should call domOutline draw method', function() {
        //         expect(liveEditorTest.domOutline.draw).toHaveBeenCalledWith(liveEditorTest.$currentSelected[0]);
        //     });
        // });
    });

    describe('setCurrentElement method', function() {
        beforeEach(function() {
            waits(150);
            liveEditorTest.$editorIframe.load();
        });

        it('set value to attributes', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');

            expect(liveEditorTest.hasOwnProperty('currentSelected')).toBe(false);
            expect(liveEditorTest.hasOwnProperty('$currentSelected')).toBe(false);

            liveEditorTest.setCurrentElement($p);

            expect(liveEditorTest.currentSelected).toBe('html>body>div>p');
            expect(liveEditorTest.$currentSelected).toBe($p);
        });
    });

    describe('getElementPath method', function() {
        beforeEach(function() {
            waits(150);
            liveEditorTest.$editorIframe.load();
        });

        it('return correct path', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p'),
                path = liveEditorTest.getElementPath($p);

            expect(path).toBe('html>body>div>p');
        });
    });

    describe('dispatchLoadEvent method', function() {
        it('Should dispatch an event', function() {
            var counter = 0;

            document.addEventListener('LiveEditorLoaded', function (e) {
                counter ++;
            }, false);

            liveEditorTest.dispatchLoadEvent();

            expect(counter).toBe(1);
        });
    });

    describe('undoListUpdate method', function() {
        beforeEach(function() {
            $iframe.load();
            waits(150);
        });

        it('Should append a clone from body', function() {
            liveEditorTest.undoListUpdate();
            var $item = liveEditorTest.experiments.test_1.undoList[0];
            expect(liveEditorTest.experiments.test_1.undoList.length).toBe(1);
            expect($item.prop('tagName')).toBe('BODY');
        });
    });

    describe('addToScriptList method', function() {
        it('Should append formated string inside scriptList var', function() {
            liveEditorTest.addToScriptList('\nMy test\t with\t tabs\n and\t\n paragraphs;');

            expect(liveEditorTest.experiments.test_1.scriptList.length).toBe(1);
            expect(liveEditorTest.experiments.test_1.scriptList[0]).toBe('My test with tabs and paragraphs;');

            liveEditorTest.addToScriptList('My new script');

            expect(liveEditorTest.experiments.test_1.scriptList.length).toBe(2);
            expect(liveEditorTest.experiments.test_1.scriptList[1]).toBe('My test with tabs and paragraphs;My new script');
        });

        it('Should call currentExperimentScriptList method', function() {
            spyOn(liveEditorTest, 'currentExperimentScriptList');

            liveEditorTest.addToScriptList('\nMy test\t with\t tabs\n and\t\n paragraphs;');

            expect(liveEditorTest.currentExperimentScriptList).toHaveBeenCalled();
        });
    });

    describe('codePanelUpdate method', function() {
        it('Should update aceEditor value with scriptList content', function() {
            liveEditorTest.experiments.test_1.scriptList.push('item 1');
            liveEditorTest.experiments.test_1.scriptList.push('item 1 item 2');
            liveEditorTest.experiments.test_1.scriptList.push('item 1 item 2 item 3');

            liveEditorTest.codePanelUpdate();

            var aceEditorValue = liveEditorTest.codePanel.aceEditor.aceEditor.getValue();

            expect(aceEditorValue).toBe('item 1 item 2 item 3')
        });
    });

    describe('operationInit method', function() {
        beforeEach(function() {
            waits(150);
        });

        it('always call codePanelUpdate method', function() {
            spyOn(liveEditorTest, 'codePanelUpdate');

            liveEditorTest.operationInit('fake');

            expect(liveEditorTest.codePanelUpdate).toHaveBeenCalled();
        });

        it('remove operation', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);

            spyOn(liveEditorTest.actions, 'currentSelectedRemove');
            spyOn(liveEditorTest, 'unselectElements');

            liveEditorTest.operationInit('remove');

            expect(liveEditorTest.actions.currentSelectedRemove).toHaveBeenCalled();
            expect(liveEditorTest.unselectElements).toHaveBeenCalled();
        });

        it('add-event-click', function() {
            spyOn(liveEditorTest, 'unselectElements');
            spyOn(liveEditorTest.actions, 'currentSelectedAddEvent');

            liveEditorTest.operationInit('add-event-click');

            expect(liveEditorTest.unselectElements).toHaveBeenCalled();
            expect(liveEditorTest.actions.currentSelectedAddEvent).toHaveBeenCalledWith('click');
        });

        it('add-event-scroll', function() {
            spyOn(liveEditorTest, 'unselectElements');
            spyOn(liveEditorTest.actions, 'currentSelectedAddEvent');

            liveEditorTest.operationInit('add-event-scroll');

            expect(liveEditorTest.unselectElements).toHaveBeenCalled();
            expect(liveEditorTest.actions.currentSelectedAddEvent).toHaveBeenCalledWith('scroll');
        });

        it('edit-html-save', function() {
            spyOn(liveEditorTest.actions, 'currentSelectedEditHtml');

            liveEditorTest.operationInit('edit-html-save');

            expect(liveEditorTest.actions.currentSelectedEditHtml).toHaveBeenCalled();
        });

        it('edit-text-save', function() {
            spyOn(liveEditorTest.actions, 'currentSelectedEditText');

            liveEditorTest.operationInit('edit-text-save');

            expect(liveEditorTest.actions.currentSelectedEditText).toHaveBeenCalled();
        });

        it('edit-classes-save', function() {
            spyOn(liveEditorTest.actions, 'currentSelectedEditClasses');

            liveEditorTest.operationInit('edit-classes-save');

            expect(liveEditorTest.actions.currentSelectedEditClasses).toHaveBeenCalled();
        });

        it('edit-rename-modal-save', function() {
            spyOn(liveEditorTest.actions, 'currentOptionRename');

            liveEditorTest.operationInit('edit-rename-modal-save');

            expect(liveEditorTest.actions.currentOptionRename).toHaveBeenCalled();
        });

        it('delete-option', function() {
            spyOn(liveEditorTest.actions, 'currentOptionDelete');

            liveEditorTest.operationInit('delete-option');

            expect(liveEditorTest.actions.currentOptionDelete).toHaveBeenCalled();
        });

        it('duplicate-option', function() {
            spyOn(liveEditorTest.actions, 'currentOptionDuplicate');

            liveEditorTest.operationInit('duplicate-option');

            expect(liveEditorTest.actions.currentOptionDuplicate).toHaveBeenCalled();
        });
    });

    describe('currentExperiment method', function() {
        it('Return correct value', function() {
            var c = liveEditorTest.currentExperiment();
            expect(c).toBe(liveEditorTest.experiments.test_1);
        });
    });

    describe('saveBody method', function() {
        beforeEach(function() {
            waits(150);
        });

        it('Should save jquery body', function() {
            expect(liveEditorTest.$iframeBody.prop('tagName')).toBe('BODY');
        });

        it('Should remove all script tags from body', function() {
            expect(liveEditorTest.$iframeBody.find('script')).not.toExist();
        });
    });

    describe('currentMode method', function() {
        it('Should return default edition mode', function() {
            var v = liveEditorTest.toolbar.$modeSelect.val();
            expect(v).toBe(liveEditorTest.currentMode());
            expect('edit').toBe(liveEditorTest.currentMode());
        });

        it('Should return new value after select change', function() {
            liveEditorTest.toolbar.$modeSelect.val('view');
            var v = liveEditorTest.toolbar.$modeSelect.val();
            expect(v).toBe(liveEditorTest.currentMode());
            expect('view').toBe(liveEditorTest.currentMode());
        })
    });

    describe('changeTab method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest, 'updateBody');
            spyOn(liveEditorTest, 'codePanelUpdate');
            liveEditorTest.changeTab();
        });

        it('Should call updateBody method', function() {
            expect(liveEditorTest.updateBody).toHaveBeenCalled();
        });

        it('Should call codePanelUpdate method', function() {
            expect(liveEditorTest.codePanelUpdate).toHaveBeenCalled();
        });
    });

    describe('getIframeBody method', function() {
        beforeEach(function() {
            waits(150);
        });

        it('Should return iframe body', function() {
            var $body = liveEditorTest.getIframeBody();
            expect($body).toBe(liveEditorTest.$editorIframe.contents().find('body'));
        });
    });

    describe('addNewOption method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest.tabs, 'createTabs');
            spyOn(liveEditorTest, 'updateBody');
            spyOn(liveEditorTest, 'createExperiments');
            liveEditorTest.addNewOption();
        });

        it('Should append tab name inside tabsList', function() {
            expect(liveEditorTest.tabsList.length).toBe(3);
            expect(liveEditorTest.tabsList[2]).toBe('Test 3');

            liveEditorTest.addNewOption();

            expect(liveEditorTest.tabsList.length).toBe(4);
            expect(liveEditorTest.tabsList[3]).toBe('Test 4');
        });

        it('Should call createTabs method', function() {
            expect(liveEditorTest.tabs.createTabs).toHaveBeenCalledWith(['Test 3']);
        });

        it('Should call createExperiments method', function() {
            expect(liveEditorTest.createExperiments).toHaveBeenCalled();
        });

        it('Should call updateBody method', function() {
            expect(liveEditorTest.updateBody).toHaveBeenCalled();
        });
    });

    describe('updateBody method', function() { 
        beforeEach(function() {
            $iframe = $liveEditorTest.find('iframe').load();
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest, 'unselectElements');
            spyOn(liveEditorTest, 'applyJs');
            spyOn(liveEditorTest, 'domOutlineInit');
        });

        it('Should call domoutline stop method', function() {
            liveEditorTest.updateBody();
            expect(liveEditorTest.domOutline.stop).toHaveBeenCalled();
        });

        it('Should call unselectElements method', function() {
            liveEditorTest.updateBody();
            expect(liveEditorTest.unselectElements).toHaveBeenCalled();
        });

        it('When in view mode, should not call applyJs method', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('view');
            liveEditorTest.updateBody();
            expect(liveEditorTest.applyJs).not.toHaveBeenCalled();
        });

        it('When in view mode, should not call domOutlineInit method', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('view');
            liveEditorTest.updateBody();
            expect(liveEditorTest.domOutlineInit).not.toHaveBeenCalled();
        });

        it('When in edit mode, should call applyJs method', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('edit');
            liveEditorTest.updateBody();
            expect(liveEditorTest.applyJs).toHaveBeenCalled();
        });

        it('When in edit mode, should call domOutlineInit method', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('edit');
            liveEditorTest.updateBody();
            expect(liveEditorTest.domOutlineInit).toHaveBeenCalled();
        });
    });

    describe('updateBody method with waits', function() {
        beforeEach(function() {
            $iframe = $liveEditorTest.find('iframe').load();
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest, 'unselectElements');
            spyOn(liveEditorTest, 'applyJs');
            spyOn(liveEditorTest, 'domOutlineInit');
            waits(200);
        });

        it('When in edit mode should clone body element', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('edit');

            var $body = liveEditorTest.$editorIframe.contents().find('body');

            liveEditorTest.updateBody();

            var $newBody = liveEditorTest.$editorIframe.contents().find('body');

            expect($newBody).toExist();
            expect($newBody).not.toBe($body);
        });

        it('When in view mode should use original body element', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('view');

            var $body = liveEditorTest.$editorIframe.contents().find('body');

            liveEditorTest.updateBody();

            var $newBody = liveEditorTest.$editorIframe.contents().find('body');

            expect($newBody).toBe(liveEditorTest.$iframeBody);
            expect($body).not.toBe($newBody);
        });

        it('has $iframeBody parameter with edit mode (clone body param)', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('edit');
            var $fake = $('<div class="fake-body">');

            liveEditorTest.updateBody($fake);

            var $fakeBody = liveEditorTest.$editorIframe.contents().find('div.fake-body'),
                $body = liveEditorTest.$editorIframe.contents().find('body');

            expect($body).not.toExist();
            expect($fakeBody).toExist();
            expect($fakeBody).not.toBe($fake);
        });

        it('has $iframeBody parameter with view mode (dont clone body param)', function() {
            spyOn(liveEditorTest, 'currentMode').andReturn('view');
            var $fake = $('<div class="fake-body">');

            liveEditorTest.updateBody($fake);

            var $fakeBody = liveEditorTest.$editorIframe.contents().find('div.fake-body'),
                $body = liveEditorTest.$editorIframe.contents().find('body');

            expect($body).not.toExist();
            expect($fakeBody).toExist();
            expect($fakeBody).toBe($fake);
        });
    });

    describe('codePanelUpdate method', function() {
        it('Should call aceEditor setValue method', function() {
            var aceEditor = liveEditorTest.codePanel.aceEditor.aceEditor;
            spyOn(aceEditor, 'setValue');

            liveEditorTest.experiments['test_1'].scriptList.push('my_script_1');
            liveEditorTest.experiments['test_1'].scriptList.push('my_script_1 my_script_2');
            liveEditorTest.codePanelUpdate();

            expect(aceEditor.setValue).toHaveBeenCalledWith('my_script_1 my_script_2', -1);
        });
    });

    describe('currentExperimentScriptList method', function() {
        it('Should return last item from list', function() {
            liveEditorTest.currentExperiment().scriptList.push('item 1');
            liveEditorTest.currentExperiment().scriptList.push('item 2');
            liveEditorTest.currentExperiment().scriptList.push('item 3');
            var scriptList = liveEditorTest.currentExperimentScriptList();

            expect(scriptList).toBe('item 3');
        });
    });

    describe('selectElement method', function() {
        beforeEach(function() {
            liveEditorTest.$editorIframe.load();
            spyOn(liveEditorTest, 'setCurrentElement');
            spyOn(liveEditorTest, 'openCurrentMenu');
            spyOn(liveEditorTest.domOutline, 'pause');
        });

        it('Should close floating menu if it exist', function() {
            liveEditorTest.floatingMenu = new FloatingMenu({ data: { value: 'element' } });;
            spyOn(liveEditorTest.floatingMenu, 'close');

            var oldMenu = liveEditorTest.floatingMenu;
            liveEditorTest.floatingMenu = null;

            liveEditorTest.selectElement();
            expect(oldMenu.close).not.toHaveBeenCalled();
        });

        it('Should not close floating menu if it doest exist', function() {
            liveEditorTest.floatingMenu = new FloatingMenu({ data: { value: 'element' } });;
            spyOn(liveEditorTest.floatingMenu, 'close');
            liveEditorTest.selectElement();
            expect(liveEditorTest.floatingMenu.close).toHaveBeenCalled();
        });

        it('Should call setCurrentElement method', function() {
            liveEditorTest.selectElement();
            expect(liveEditorTest.setCurrentElement).toHaveBeenCalledWith(liveEditorTest.domOutline.element);
        });

        it('Should call openCurrentMenu method', function() {
            liveEditorTest.selectElement();
            expect(liveEditorTest.openCurrentMenu).toHaveBeenCalled();
        });

        it('Should pause domOutline', function() {
            liveEditorTest.selectElement();
            expect(liveEditorTest.domOutline.pause).toHaveBeenCalled();
        });
    });

    describe('keyUpEvents method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest, 'updateBody');
            spyOn(liveEditorTest, 'unselectElements');
        });

        describe('key E', function() {
            beforeEach(function() {
                var key = {which: 69};
                liveEditorTest.keyUpEvents(key);
            });

            it('Should set toolbar modeSelect to Edit', function() {
                var v = liveEditorTest.toolbar.$modeSelect.val();
                expect(v).toBe('edit');
            });

            it('Should call updateBody method', function() {
                expect(liveEditorTest.updateBody).toHaveBeenCalled()
            });
        });

        describe('key V', function() {
            beforeEach(function() {
                var key = {which: 86};
                liveEditorTest.keyUpEvents(key);
            });

            it('Should set toolbar modeSelect to View', function() {
                var v = liveEditorTest.toolbar.$modeSelect.val();
                expect(v).toBe('view');
            });

            it('Should call updateBody method', function() {
                expect(liveEditorTest.updateBody).toHaveBeenCalled()
            });
        });

        describe('key ESC', function() {
            beforeEach(function() {
                var key = {which: 27};
                liveEditorTest.keyUpEvents(key);
            });

            it('Should set toolbar modeSelect to View', function() {
                expect(liveEditorTest.unselectElements).toHaveBeenCalled();
            });
        });
    });

    describe('unselectElements method', function() {
        beforeEach(function() {
            waits(200);
        });

        it('Should call floating menu close method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);
            liveEditorTest.openCurrentMenu();

            spyOn(liveEditorTest.floatingMenu, 'close');
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest.domOutline, 'start');

            liveEditorTest.unselectElements();
            expect(liveEditorTest.floatingMenu.close).toHaveBeenCalled();
        });

        it('Shoud call domOutline stop method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);
            liveEditorTest.openCurrentMenu();

            spyOn(liveEditorTest.floatingMenu, 'close');
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest.domOutline, 'start');

            liveEditorTest.unselectElements();
            expect(liveEditorTest.domOutline.stop).toHaveBeenCalled();
        });

        it('Shoud call domOutline start method', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);
            liveEditorTest.openCurrentMenu();

            spyOn(liveEditorTest.floatingMenu, 'close');
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest.domOutline, 'start');

            liveEditorTest.unselectElements();
            expect(liveEditorTest.domOutline.start).toHaveBeenCalled();
        });

        it('Set currentSelected as null', function() {
            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);
            liveEditorTest.openCurrentMenu();

            spyOn(liveEditorTest.floatingMenu, 'close');
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest.domOutline, 'start');

            liveEditorTest.$currentSelected = 1;
            liveEditorTest.currentSelected = 1;

            liveEditorTest.unselectElements();

            expect(liveEditorTest.$currentSelected).toBe(null);
            expect(liveEditorTest.currentSelected).toBe(null);
        });
    });

    describe('openCurrentMenu method', function() {
    });

    describe('modalEvents method', function() {
    });

    describe('getCurrentParentsPath method', function() {
    });

    describe('containerFormat method', function() {
    });
});
