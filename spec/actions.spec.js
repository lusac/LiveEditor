describe("Actions", function() {
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

    describe('saveChanges method', function() {
        beforeEach(function() {
            spyOn(liveEditor, 'undoListUpdate');
            spyOn(liveEditor, 'addToScriptList');
            spyOn(liveEditor, 'applyJs');
            liveEditor.actions.saveChanges('my_script();');
        });

        it('Should call undoListUpdate method', function() {
            expect(liveEditor.undoListUpdate).toHaveBeenCalled();
        });

        it('Should call addToScriptList method with prams', function() {
            expect(liveEditor.addToScriptList).toHaveBeenCalledWith('my_script();');
        });

        it('Should call applyJs method with params', function() {
            expect(liveEditor.applyJs).toHaveBeenCalledWith('my_script();');
        });
    });

    describe('currentSelectedRemove method', function() {
        beforeEach(function() {
            spyOn(liveEditor.actions, 'saveChanges');
        });

        it('Should call saveChanges method with param', function() {
            liveEditor.currentSelected = 'my_path';
            liveEditor.actions.currentSelectedRemove();
            expect(liveEditor.actions.saveChanges).toHaveBeenCalledWith('$("my_path").remove();');
        });
    });

    describe('currentSelectedEditHtml method', function() {
        beforeEach(function() {
            spyOn(liveEditor.actions, 'saveChanges');
        });

        it('Should call saveChanges method with param', function() {
            liveEditor.currentSelected = 'my_path';
            liveEditor.editHtmlModal.setValue('something');
            liveEditor.actions.currentSelectedEditHtml();
            expect(liveEditor.actions.saveChanges).toHaveBeenCalledWith('$("my_path").replaceWith("something");');
        });
    });

    describe('currentSelectedEditClasses method', function() {
        beforeEach(function() {
            spyOn(liveEditor.actions, 'saveChanges');
        });

        it('Should call saveChanges method with param', function() {
            liveEditor.currentSelected = 'my_path';
            liveEditor.$editClassesModal.find('.modal-body input').val('my-class');
            liveEditor.actions.currentSelectedEditClasses();
            expect(liveEditor.actions.saveChanges).toHaveBeenCalledWith('$("my_path").attr("class", "my-class");');
        });
    });

    describe('currentSelectedAddEvent method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.actions.currentSelectedAddEvent('custom-event');

            expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").attr("easyab-track-custom-event", 1);']);
        });
    });

    describe('currentSelectedEditText method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should add script in scriptList', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();

            expect(liveEditor.experiments.test_1.scriptList.length).toEqual(1);
            expect(liveEditor.experiments.test_1.scriptList).toEqual(['$("html>body>div>p").text("my custom html");']);
        });

        it('Should call applyJs method with params', function() {
            spyOn(liveEditor, 'applyJs');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();

            var str = '$' + liveEditor.actions._changeText('html>body>div>p', 'my custom html');
            expect(liveEditor.applyJs).toHaveBeenCalledWith(str);
        });

        it('Should call undoListUpdate method', function() {
            spyOn(liveEditor, 'applyJs');
            spyOn(liveEditor, 'undoListUpdate');

            var $p = liveEditor.$editorIframe.contents().find('p');
            liveEditor.setCurrentElement($p);

            liveEditor.$editTextModal.find('.modal-body textarea').val('my custom html');
            liveEditor.actions.currentSelectedEditText();

            expect(liveEditor.undoListUpdate).toHaveBeenCalled();
        });
    });
    
    describe('_changeClass method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return string', function() {
            var str = liveEditor.actions._changeClass('.test-class', 'new-class');
            expect(str).toBe('(".test-class").attr("class", "new-class");');
        });
    });

    describe('_changeText method', function() {
        beforeEach(function() {
            waits(100);
        });

        it('Should return string', function() {
            var str = liveEditor.actions._changeText('.test-class', 'My new text');
            expect(str).toBe('(".test-class").text("My new text");');
        });
    });

    describe('currentOptionRename method', function() {
        beforeEach(function() {
            $('#rename-modal').find('.modal-body input').val('New Tab');
        });

        it('Should rename tab name', function() {
            liveEditor.actions.currentOptionRename();
            var label = $('.nav-tabs>li.active>a').text();
            expect(label).toBe('New Tab');
        });

        it('Should rename tab data-name attribute', function() {
            liveEditor.actions.currentOptionRename();
            var $tab = $('.nav-tabs>li.active>a');
            expect($tab).toHaveAttr('data-name', 'new_tab');
        });

        it('Should append caret inside tab', function() {
            liveEditor.actions.currentOptionRename();
            var $caret = $('.nav-tabs>li.active>a span.caret');
            expect($caret).toExist();
        });

        it('Should update liveEditor experiments', function() {
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(true);
            expect(liveEditor.experiments.hasOwnProperty('new_tab')).toBe(false);
            liveEditor.actions.currentOptionRename();
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(false);
            expect(liveEditor.experiments.hasOwnProperty('new_tab')).toBe(true);
        });

        it('Experiments data should not change', function() {
            var oldData = liveEditor.experiments.test_1;
            liveEditor.actions.currentOptionRename();
            var newData = liveEditor.experiments.new_tab;

            expect(oldData).toBe(newData);
        });
    });

    describe('currentOptionDelete method', function() {
        it('Should remove tab element', function() {
            var $tab = $('.nav-tabs>li.active');
            liveEditor.actions.currentOptionDelete();
            expect($tab.parent()).not.toExist();
        });

        it('Should set next tab as active', function() {
            var $tab1 = $('.nav-tabs>li.active'),
                $tab2 = $('.nav-tabs>li:eq(1)');

            liveEditor.actions.currentOptionDelete();

            var $newTab2 = $('.nav-tabs>li:eq(0)');
            expect($tab1.parent()).not.toExist();
            expect($tab2).toBe($newTab2);
            expect($newTab2.hasClass('active')).toBe(true);
        });

        it('Should remove liveEditor experiment from dict', function() {
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(true);
            liveEditor.actions.currentOptionDelete();
            expect(liveEditor.experiments.hasOwnProperty('test_1')).toBe(false);
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
            spyOn(liveEditor.domOutline, 'stop');

            expect($('.nav-tabs>li').length).toBe(2);

            liveEditor.actions.currentOptionDuplicate();

            expect($('.nav-tabs>li').length).toBe(3);
        });

        it('Should add a new experiment in liveEditor equals to the active', function() {
            spyOn(liveEditor.domOutline, 'stop');

            expect(Object.keys(liveEditor.experiments).length).toBe(2);

            liveEditor.actions.currentOptionDuplicate();

            expect(Object.keys(liveEditor.experiments).length).toBe(3);
            expect(liveEditor.experiments.test_1).toBe(liveEditor.experiments.test_3);
        });

        it('Should call addNewOption method', function() {
            spyOn(liveEditor.domOutline, 'stop');
            spyOn(liveEditor, 'addNewOption');

            liveEditor.actions.currentOptionDuplicate();

            expect(liveEditor.addNewOption).toHaveBeenCalled();
        });

        it('Should call changeTab method', function() {
            spyOn(liveEditor.domOutline, 'stop');
            spyOn(liveEditor, 'changeTab');

            liveEditor.actions.currentOptionDuplicate();

            expect(liveEditor.changeTab).toHaveBeenCalled();
        });
    });

    describe('undo method', function() {
        beforeEach(function() {
            waits(200);
        });

        it('Should remove last item from undoList var', function() {
            liveEditor.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');
            liveEditor.experiments.test_1.undoList.push('self.$editorIframe.contents().find("div").append("<p>Hello World</p>");');

            expect(liveEditor.experiments.test_1.undoList.length).toBe(2);

            liveEditor.actions.undo();

            expect(liveEditor.experiments.test_1.undoList.length).toBe(1);
        });

        it('Should remove last item from scriptList var', function() {
            spyOn(liveEditor, 'applyJs');

            liveEditor.experiments.test_1.undoList.push(liveEditor.getIframeBody().clone());
            liveEditor.experiments.test_1.scriptList.push('$("p").remove();');
            liveEditor.experiments.test_1.scriptList.push('$("p").remove();');

            expect(liveEditor.experiments.test_1.scriptList.length).toBe(2);

            liveEditor.actions.undo();
            
            expect(liveEditor.experiments.test_1.scriptList.length).toBe(1);
        });

        it('Should call codePanelUpdate method', function() {
            spyOn(liveEditor, 'codePanelUpdate');

            liveEditor.experiments.test_1.undoList.push(liveEditor.getIframeBody().clone());
            liveEditor.actions.undo();

            expect(liveEditor.codePanelUpdate).toHaveBeenCalled();
        });

        it('Should call updateBody method', function() {
            spyOn(liveEditor, 'updateBody');

            liveEditor.experiments.test_1.undoList.push(liveEditor.getIframeBody().clone());
            liveEditor.actions.undo();

            expect(liveEditor.updateBody).toHaveBeenCalled();
        });
    });

    describe('saveCodePanel method', function() {
        beforeEach(function() {
            spyOn(liveEditor.actions, 'saveChanges');
        });

        it('Should call saveChanges method', function() {
            liveEditor.experiments.test_1.scriptList.push('alert(1);');
            liveEditor.codePanel.aceEditor.aceEditor.setValue('alert(1);alert(2);');

            liveEditor.actions.saveCodePanel();

            expect(liveEditor.actions.saveChanges).toHaveBeenCalledWith('alert(2);')
        });
    });
});
