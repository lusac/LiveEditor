var DomOutline=function(options){"use strict";options=options||{};var pub={},self={opts:{namespace:options.namespace||"DomOutline",onClick:options.onClick||false,realtime:options.realtime||false,$elem:options.elem||jQuery("body")},keyCodes:{BACKSPACE:8,ESC:27,DELETE:46},active:false,initialized:false,elements:{}};function writeStylesheet(css){var element=document.createElement("style");element.type="text/css";if(self.opts.$elem){self.opts.$elem.append(element)}else{document.getElementsByTagName("head")[0].appendChild(element)}if(element.styleSheet){element.styleSheet.cssText=css}else{element.innerHTML=css}}function initStylesheet(){var css="";if(self.initialized!==true){css+="."+self.opts.namespace+" {"+"    background: rgba(0, 153, 204, 0.05);"+"    position: fixed;"+"    z-index: 1000000;"+"    pointer-events: none;"+"    outline: 3px solid rgb(0, 153, 204);"+"}"+"."+self.opts.namespace+"_label {"+"    background: #09c;"+"    boroutlineder-radius: 2px;"+"    color: #fff;"+"    font: bold 12px/12px Helvetica, sans-serif;"+"    padding: 4px 6px;"+"    position: fixed;"+"    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);"+"    z-index: 1000001;"+"    pointer-events: none;"+"}"+"."+self.opts.namespace+"_box {"+"    background: rgba(0, 153, 204, 0.05);"+"    position: absolute;"+"    z-index: 1000000;"+"    pointer-events: none;"+"    outline: 3px solid rgb(0, 153, 204);"+"    box-shadow: 6px 6px 2px rgba(0, 0, 0, 0.2);"+"}";writeStylesheet(css);self.initialized=true}}function createOutlineElements(){self.elements.top=jQuery("<div>").addClass(self.opts.namespace).insertAfter(self.opts.$elem);self.elements.bottom=jQuery("<div>").addClass(self.opts.namespace).insertAfter(self.opts.$elem);self.elements.left=jQuery("<div>").addClass(self.opts.namespace).insertAfter(self.opts.$elem);self.elements.right=jQuery("<div>").addClass(self.opts.namespace).insertAfter(self.opts.$elem);self.elements.box=jQuery("<div>").addClass(self.opts.namespace+"_box").insertAfter(self.opts.$elem)}function removeOutlineElements(){jQuery.each(self.elements,function(name,element){element.remove()})}function getScrollTop(){if(!self.elements.window){self.elements.window=jQuery(window)}return self.elements.window.scrollTop()}function stopOnEscape(e){if(e.keyCode===self.keyCodes.ESC||e.keyCode===self.keyCodes.BACKSPACE||e.keyCode===self.keyCodes.DELETE){pub.stop()}return false}function draw(e){if(e.target.className.indexOf(self.opts.namespace)!==-1){return}pub.element=e.target;var scroll_top=getScrollTop(),pos=pub.element.getBoundingClientRect(),top=pos.top+scroll_top,label_text="",label_top=0,label_left=0;self.elements.box.css({top:self.opts.$elem.scrollTop()+pos.top-1,left:pos.left-1,width:pos.width+2,height:pos.height+2})}function clickHandler(e){if(!self.opts.realtime){draw(e)}self.opts.onClick(pub.element);return false}pub.start=function(){removeOutlineElements();initStylesheet();if(self.active!==true){self.active=true;createOutlineElements();self.opts.$elem.bind("keyup."+self.opts.namespace,stopOnEscape);if(self.opts.onClick){setTimeout(function(){self.opts.$elem.bind("click."+self.opts.namespace,clickHandler)},50)}if(self.opts.realtime){self.opts.$elem.bind("mousemove."+self.opts.namespace,draw)}}};pub.stop=function(){self.active=false;removeOutlineElements();self.opts.$elem.unbind("mousemove."+self.opts.namespace).unbind("keyup."+self.opts.namespace).unbind("click."+self.opts.namespace)};pub.pause=function(){self.active=false;self.opts.$elem.unbind("mousemove."+self.opts.namespace).unbind("keyup."+self.opts.namespace).unbind("click."+self.opts.namespace)};return pub};(function(window,document,$){"use strict";var FloatingMenu=function FloatingMenu(params){this.init(params)};FloatingMenu.prototype.init=function(params){this.$menu=$('<ul class="dropdown-menu" role="menu">');this.elemId=params.elemId;$("body").append(this.$menu);this.bindEvents()};FloatingMenu.prototype.create=function(params){var value=params.value||"(element)",posTop=params.posTop||0,posLeft=params.posLeft||0,menuHtml=this.newItem({value:value,is_header:true}),editList=[{value:"Edit HTML",attrs:{"data-operation":"edit-html","data-toggle":"modal","data-target":"#edit-html-modal["+this.elemId+"]"}},{value:"Edit Text",attrs:{"data-operation":"edit-text","data-toggle":"modal","data-target":"#edit-text-modal["+this.elemId+"]"}},{value:"Edit Classes",attrs:{"data-operation":"edit-classes","data-toggle":"modal","data-target":"#edit-classes-modal["+this.elemId+"]"}},{value:"Edit Style",attrs:{"data-operation":"edit-style"}}],events=[{value:"Click",attrs:{"data-operation":"add-event-click"}}];menuHtml+=this.newItem({value:"Edit Element",items:editList});menuHtml+=this.newItem({attrs:{"class":"divider"}});menuHtml+=this.newItem({value:"Move and Resize",attrs:{"data-operation":"move-and-resize"}});menuHtml+=this.newItem({value:"Remove",attrs:{"data-operation":"remove"}});menuHtml+=this.newItem({attrs:{"class":"divider"}});menuHtml+=this.newItem({value:"Select Container",items:params.container});menuHtml+=this.newItem({attrs:{"class":"divider"}});menuHtml+=this.newItem({value:"Create new goal",items:events});this.$menu.append(menuHtml);this.$menu.css({top:posTop-10,left:posLeft+10})};FloatingMenu.prototype.bindEvents=function(){var self=this;this.$menu.on("click","li",function(e){var $el=$(e.toElement).parent(),op=$el.data("operation");if(op){var _event=new CustomEvent("floatingMenuItemClicked",{detail:{operation:op,liveEditor:self.elemId}});document.dispatchEvent(_event);console.log("Operation: "+op)}})};FloatingMenu.prototype.open=function(){this.$menu.show()};FloatingMenu.prototype.close=function(){this.$menu.hide();this.$menu.empty()};FloatingMenu.prototype.newItem=function(params){var $li=$("<li>");if(params.attrs){$li.attr(params.attrs)}if(params.is_header){$li.addClass("dropdown-header").text("<"+params.value+">")}else if(params.value){$li.append('<a tabindex="-1" href="#">'+params.value+"</a>")}if(params.items){var $subMenu=$('<ul class="dropdown-menu">');for(var i=0;i<=params.items.length-1;i++){var $_li=$('<li class="container-item-el">');$_li.attr(params.items[i].attrs).append('<a tabindex="-1" href="#">'+params.items[i].value+"</a>");$subMenu.append($_li)}$li.addClass("dropdown-submenu");$li.append($subMenu)}return $li.prop("outerHTML")};window.FloatingMenu=FloatingMenu})(window,document,$);(function(window,document,$){"use strict";var LiveEditor=function LiveEditor(params){console.log("Live Editor Init...");this.init(params);console.log("Live Editor Done...")};LiveEditor.prototype.init=function(params){var self=this;this.initVars(params);this.buildIframe(params);this.$editorIframe.on("load",function(){self.domOutlineInit();self.bindEvents()})};LiveEditor.prototype.initVars=function(params){this.$editor=$(params.editor);this.$codePainel=$("#code-painel["+params.editor.replace("#","")+"]").find("textarea");this.$editHtmlModal=$("#edit-html-modal["+params.editor.replace("#","")+"]");this.$editTextModal=$("#edit-text-modal["+params.editor.replace("#","")+"]");this.$editClassesModal=$("#edit-classes-modal["+params.editor.replace("#","")+"]");this.domOutline=null;this.scriptList=[];this.scriptGoal=[]};LiveEditor.prototype.buildIframe=function(params){var $iframe=$("<iframe>");$iframe.attr({src:params.url,width:"100%",height:"100%",frameborder:"0"});this.$editor.append($iframe);this.$editor.addClass("live-editor");this.$editorIframe=this.$editor.find("iframe")};LiveEditor.prototype.domOutlineInit=function(){this.domOutline=new DomOutline({realtime:true,onClick:this.sendEventOnClick,elem:this.$editorIframe.contents().find("html body")});this.domOutline.start()};LiveEditor.prototype.modalEvents=function(){var self=this;this.$editHtmlModal.on("show.bs.modal",function(){var current_without_cache=self.$editorIframe.contents().find(self.currentSelected)[0],html=current_without_cache.outerHTML;$(this).find(".modal-body textarea").val(html)});$("["+this.$editor.attr("id")+"] #edit-html-modal-save").on("click",function(){self.operationInit("edit-html-save");self.$editHtmlModal.modal("hide")});this.$editTextModal.on("show.bs.modal",function(){var current_without_cache=self.$editorIframe.contents().find(self.currentSelected)[0],text=current_without_cache.textContent;$(this).find(".modal-body textarea").val(text)});$("["+this.$editor.attr("id")+"] #edit-text-modal-save").on("click",function(){self.operationInit("edit-text-save");self.$editTextModal.modal("hide")});this.$editClassesModal.on("show.bs.modal",function(){var current_without_cache=self.$editorIframe.contents().find(self.currentSelected),classes=current_without_cache.attr("class");$(this).find(".modal-body input").val(classes)});$("["+this.$editor.attr("id")+"] #edit-classes-modal-save").on("click",function(){self.operationInit("edit-classes-save");self.$editClassesModal.modal("hide")})};LiveEditor.prototype.bindEvents=function(){var self=this;this.modalEvents();document.addEventListener("domOutlineOnClick",function(e){if(self.$editorIframe.contents().find($(e.detail)).length>0){self.setCurrentElement(self.domOutline.element);self.openCurrentSettings();self.domOutline.pause();console.log("dom clicked!")}},false);document.addEventListener("floatingMenuItemClicked",function(e){if(self.$editor.attr("id")==e.detail.liveEditor){self.operationInit(e.detail.operation)}},false);this.$editorIframe.contents().find("html").on("click",function(e){self.unselectElements(e)});this.$editorIframe.contents().keyup(function(e){if(e.keyCode==27){self.unselectElements(e)}})};LiveEditor.prototype.unselectElements=function(e){if(e.toElement!=this.$currentSelected[0]){this.floatingMenu.close();this.domOutline.start()}};LiveEditor.prototype.sendEventOnClick=function(e){var _event=new CustomEvent("domOutlineOnClick",{detail:e});document.dispatchEvent(_event)};LiveEditor.prototype.setCurrentElement=function(elem){this.currentSelected=this.getElementPath(elem);this.$currentSelected=this.$editorIframe.contents().find(this.currentSelected);console.log("Current: "+this.currentSelected)};LiveEditor.prototype.getElementPath=function(elem){if(elem.length!=1)elem=$(elem);var path,node=elem;while(node.length){var realNode=node[0],name=realNode.localName;if(!name)break;name=name.toLowerCase();var parent=node.parent();var siblings=parent.children(name);if(siblings.length>1){name+=":eq("+siblings.index(realNode)+")"}path=name+(path?">"+path:"");node=parent}return path};LiveEditor.prototype.getCurrentParentPath=function(){var a=this.$currentSelected[0];var els=[];while(a){els.unshift(a);a=a.parentNode}return els};LiveEditor.prototype.openCurrentSettings=function(){if(this.currentSelected){var $DomOutlineBox=this.$editorIframe.contents().find(".DomOutline_box"),top=this.$editorIframe.offset().top,left=this.$editorIframe.offset().left,scrollTop=this.$editorIframe.contents().scrollTop();this.floatingMenu=new FloatingMenu({elemId:this.$editor.attr("id")});this.floatingMenu.create({value:this.$currentSelected.prop("tagName").toLowerCase(),posLeft:left+$DomOutlineBox.offset().left+$DomOutlineBox.width(),posTop:top+$DomOutlineBox.offset().top-scrollTop,container:this.containerFormat()});this.floatingMenu.open()}else{console.log("No item has been selected...")}};LiveEditor.prototype.containerFormat=function(){var pathList=this.getCurrentParentPath(),_list=[];for(var i=0;i<=pathList.length-1;i++){if(pathList[i].tagName){_list.push({value:pathList[i].tagName.toLowerCase(),attrs:{value:this.getElementPath(pathList[i])}})}}return _list};LiveEditor.prototype.operationInit=function(operation){if(operation==="remove"){this.currentSelectedRemove();this.floatingMenu.close();this.domOutline.start()}if(operation==="add-event-click"){this.currentSelectedAddEvent("click")}if(operation==="edit-html-save"){this.currentSelectedEditHtml()}if(operation==="edit-text-save"){this.currentSelectedEditText()}if(operation==="edit-classes-save"){this.currentSelectedEditClasses()}this.codePainelUpdate()};LiveEditor.prototype.currentSelectedRemove=function(){var str='$("'+this.currentSelected+'").remove();';this.addToScriptList(str);this.$editorIframe.contents().find(this.currentSelected).remove()};LiveEditor.prototype.currentSelectedAddEvent=function(e){var str='$("'+this.currentSelected+'").attr("easyab-track-'+e+'", 1);';this.addToScriptGoal(str)};LiveEditor.prototype.currentSelectedEditHtml=function(){var html=this.$editHtmlModal.find(".modal-body textarea").val(),str='$("'+this.currentSelected+'").replaceWith("'+html+'");';this.addToScriptList(str);this.$editorIframe.contents().find(this.currentSelected).replaceWith(html)};LiveEditor.prototype.currentSelectedEditText=function(){var text=this.$editTextModal.find(".modal-body textarea").val(),str='$("'+this.currentSelected+'").text("'+text+'");';this.addToScriptList(str);this.$editorIframe.contents().find(this.currentSelected).text(text)};LiveEditor.prototype.currentSelectedEditClasses=function(){var classes=this.$editClassesModal.find(".modal-body input").val(),str='$("'+this.currentSelected+'").attr("class", "'+classes+'");';this.addToScriptList(str);this.$editorIframe.contents().find(this.currentSelected).attr("class",classes)};LiveEditor.prototype.addToScriptList=function(str){this.scriptList.push(str)};LiveEditor.prototype.addToScriptGoal=function(str){this.scriptGoal.push(str);var result=[];$.each(this.scriptGoal,function(i,e){if($.inArray(e,result)==-1)result.push(e)});this.scriptGoal=result};LiveEditor.prototype.codePainelUpdate=function(){this.$codePainel.val(this.scriptList)};window.LiveEditor=LiveEditor})(window,document,$);