describe("Actions", function() {
    beforeEach(function() {
        liveEditorTest = new LiveEditor({editor: '#live-editor-test-1', tabs: ['test 1', 'test 2'], url: 'site.html'});
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

    describe('saveChanges method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest, 'undoListUpdate');
            spyOn(liveEditorTest, 'addToScriptList');
            spyOn(liveEditorTest, 'applyJs');
            liveEditorTest.actions.saveChanges('my_script();');
        });

        it('Should call undoListUpdate method', function() {
            expect(liveEditorTest.undoListUpdate).toHaveBeenCalled();
        });

        it('Should call addToScriptList method with prams', function() {
            expect(liveEditorTest.addToScriptList).toHaveBeenCalledWith('my_script();');
        });

        it('Should call applyJs method with params', function() {
            expect(liveEditorTest.applyJs).toHaveBeenCalledWith('my_script();');
        });
    });

    describe('currentSelectedRemove method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest.actions, 'saveChanges');
        });

        it('Should call saveChanges method with param', function() {
            liveEditorTest.currentSelected = 'my_path';
            liveEditorTest.actions.currentSelectedRemove();
            expect(liveEditorTest.actions.saveChanges).toHaveBeenCalledWith('$("my_path").remove();');
        });
    });

    describe('currentSelectedEditHtml method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest.actions, 'saveChanges');
        });

        it('Should call saveChanges method with param', function() {
            liveEditorTest.currentSelected = 'my_path';
            liveEditorTest.editHtmlModal.setValue('Test\t\nsomething\'s');
            liveEditorTest.actions.currentSelectedEditHtml();
            expect(liveEditorTest.actions.saveChanges).toHaveBeenCalledWith('$(\'my_path\').replaceWith(\'Testsomething&rsquo;s\');');
        });
    });

    describe('currentSelectedEditClasses method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest.actions, 'saveChanges');
        });

        it('Should call saveChanges method with param', function() {
            liveEditorTest.currentSelected = 'my_path';
            liveEditorTest.$editClassesModal.find('.modal-body input').val('my-class');
            liveEditorTest.actions.currentSelectedEditClasses();
            expect(liveEditorTest.actions.saveChanges).toHaveBeenCalledWith('$("my_path").attr("class", "my-class");');
        });
    });

    describe('currentSelectedAddEvent method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            spyOn(liveEditorTest, 'applyJs');

            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);

            liveEditorTest.actions.currentSelectedAddEvent('custom-event');

            expect(liveEditorTest.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditorTest.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").attr("easyab-track-custom-event", 1);']);
        });
    });

    describe('currentSelectedEditText method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            spyOn(liveEditorTest, 'applyJs');

            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);

            liveEditorTest.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditorTest.actions.currentSelectedEditText();

            expect(liveEditorTest.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditorTest.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").text("my custom html");']);
        });

        it('Should call applyJs method with params', function() {
            spyOn(liveEditorTest, 'applyJs');

            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);

            liveEditorTest.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditorTest.actions.currentSelectedEditText();

            var str = '$' + liveEditorTest.actions._changeText('html>body>div>p', 'my custom html');
            expect(liveEditorTest.applyJs).toHaveBeenCalledWith(str);
        });

        it('Should call undoListUpdate method', function() {
            spyOn(liveEditorTest, 'applyJs');
            spyOn(liveEditorTest, 'undoListUpdate');

            var $p = liveEditorTest.$editorIframe.contents().find('p');
            liveEditorTest.setCurrentElement($p);

            liveEditorTest.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditorTest.actions.currentSelectedEditText();

            expect(liveEditorTest.undoListUpdate).toHaveBeenCalled();
        });
    });
    
    describe('_changeClass method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return string', function() {
            var str = liveEditorTest.actions._changeClass('.test-class', 'new-class');
            expect(str).toBe('(".test-class").attr("class", "new-class");');
        });
    });

    describe('_changeText method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return string', function() {
            var str = liveEditorTest.actions._changeText('.test-class', 'My new text');
            expect(str).toBe('(".test-class").text("My new text");');
        });
    });

    describe('currentOptionRename method', function() {
        beforeEach(function() {
            $('#rename-modal').find('.modal-body input').val('New Tab');
        });

        it('Should rename tab name', function() {
            liveEditorTest.actions.currentOptionRename();
            var label = $('.nav-tabs>li.active>a').text();
            expect(label).toBe('New Tab');
        });

        it('Should rename tab data-name attribute', function() {
            liveEditorTest.actions.currentOptionRename();
            var $tab = $('.nav-tabs>li.active>a');
            expect($tab).toHaveAttr('data-name', 'new_tab');
        });

        it('Should append caret inside tab', function() {
            liveEditorTest.actions.currentOptionRename();
            var $caret = $('.nav-tabs>li.active>a span.caret');
            expect($caret).toExist();
        });

        it('Should update liveEditor experiments', function() {
            expect(liveEditorTest.experiments.hasOwnProperty('test_1')).toBe(true);
            expect(liveEditorTest.experiments.hasOwnProperty('new_tab')).toBe(false);
            liveEditorTest.actions.currentOptionRename();
            expect(liveEditorTest.experiments.hasOwnProperty('test_1')).toBe(false);
            expect(liveEditorTest.experiments.hasOwnProperty('new_tab')).toBe(true);
        });

        it('Experiments data should not change', function() {
            var oldData = liveEditorTest.experiments.test_1;
            liveEditorTest.actions.currentOptionRename();
            var newData = liveEditorTest.experiments.new_tab;

            expect(oldData).toBe(newData);
        });
    });

    describe('currentOptionDelete method', function() {
        it('Should remove tab element', function() {
            var $tab = $('.nav-tabs>li.active');
            liveEditorTest.actions.currentOptionDelete();
            expect($tab.parent()).not.toExist();
        });

        it('Should set next tab as active', function() {
            var $tab1 = $('.nav-tabs>li.active'),
                $tab2 = $('.nav-tabs>li:eq(1)');

            liveEditorTest.actions.currentOptionDelete();

            var $newTab2 = $('.nav-tabs>li:eq(0)');
            expect($tab1.parent()).not.toExist();
            expect($tab2).toBe($newTab2);
            expect($newTab2.hasClass('active')).toBe(true);
        });

        it('Should remove liveEditor experiment from dict', function() {
            expect(liveEditorTest.experiments.hasOwnProperty('test_1')).toBe(true);
            liveEditorTest.actions.currentOptionDelete();
            expect(liveEditorTest.experiments.hasOwnProperty('test_1')).toBe(false);
        });

        it('Do not remove tab if it is the last one', function() {
            // TODO
        });
    });

    describe('currentOptionDuplicate method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should create a new tab', function() {
            spyOn(liveEditorTest.domOutline, 'stop');

            expect($('.nav-tabs>li').length).toBe(2);

            liveEditorTest.actions.currentOptionDuplicate();

            expect($('.nav-tabs>li').length).toBe(3);
        });

        it('Should add a new experiment in liveEditor equals to the active', function() {
            spyOn(liveEditorTest.domOutline, 'stop');

            expect(Object.keys(liveEditorTest.experiments).length).toBe(2);

            liveEditorTest.actions.currentOptionDuplicate();

            expect(Object.keys(liveEditorTest.experiments).length).toBe(3);
            expect(liveEditorTest.experiments.test_1).toBe(liveEditorTest.experiments.test_3);
        });

        it('Should call addNewOption method', function() {
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest, 'addNewOption');

            liveEditorTest.actions.currentOptionDuplicate();

            expect(liveEditorTest.addNewOption).toHaveBeenCalled();
        });

        it('Should call changeTab method', function() {
            spyOn(liveEditorTest.domOutline, 'stop');
            spyOn(liveEditorTest, 'changeTab');

            liveEditorTest.actions.currentOptionDuplicate();

            expect(liveEditorTest.changeTab).toHaveBeenCalled();
        });
    });

    describe('undo method', function() {
        beforeEach(function() {
            waits(200);
        });

        it('Should remove last item from undoList var', function() {
            liveEditorTest.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');
            liveEditorTest.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            expect(liveEditorTest.experiments.test_1.undoList.length).toBe(2);

            liveEditorTest.actions.undo();

            expect(liveEditorTest.experiments.test_1.undoList.length).toBe(1);
        });

        it('Should remove last item from scriptList var', function() {
            spyOn(liveEditorTest, 'applyJs');

            liveEditorTest.experiments.test_1.undoList.push(liveEditorTest.getIframeBody().clone());
            liveEditorTest.experiments.test_1.scriptList.push('$("p").remove();');
            liveEditorTest.experiments.test_1.scriptList.push('$("p").remove();');

            expect(liveEditorTest.experiments.test_1.scriptList.length).toBe(2);

            liveEditorTest.actions.undo();
            
            expect(liveEditorTest.experiments.test_1.scriptList.length).toBe(1);
        });

        it('Should call codePanelUpdate method', function() {
            spyOn(liveEditorTest, 'codePanelUpdate');

            liveEditorTest.experiments.test_1.undoList.push(liveEditorTest.getIframeBody().clone());
            liveEditorTest.actions.undo();

            expect(liveEditorTest.codePanelUpdate).toHaveBeenCalled();
        });

        it('Should call updateBody method', function() {
            spyOn(liveEditorTest, 'updateBody');

            liveEditorTest.experiments.test_1.undoList.push(liveEditorTest.getIframeBody().clone());
            liveEditorTest.actions.undo();

            expect(liveEditorTest.updateBody).toHaveBeenCalled();
        });
    });

    describe('saveCodePanel method', function() {
        beforeEach(function() {
            spyOn(liveEditorTest.actions, 'saveChanges');
        });

        it('Should call saveChanges method', function() {
            liveEditorTest.experiments.test_1.scriptList.push('alert(1);');
            liveEditorTest.codePanel.aceEditor.aceEditor.setValue('alert(1);alert(2);');

            liveEditorTest.actions.saveCodePanel();

            expect(liveEditorTest.actions.saveChanges).toHaveBeenCalledWith('alert(2);')
        });
    });
});
