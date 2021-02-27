// additonal functions 
		
		var defaultSettings = {};
		
		defaultSettings.Editor = {};
		defaultSettings.Editor.__split = ['horizonta','vertical'];
		defaultSettings.Editor.split = 'vertical';
		defaultSettings.Editor.showGrid = false;
		defaultSettings.Editor.gridSize = 50;
		//defaultSettings.Editor.splitColor = 'rgb(0,0,0)'
		
		defaultSettings.Assete = {};
		defaultSettings.Assete.iconSize = 100;
			
		var settings = localStorage.getItem('settings');
		if(settings) settings = JSON.parse(settings);
		else
		settings = defaultSettings;
		
		
		var iconButton = function(icon,func){
			
			var addButton = document.createElement('button');
			addButton.style.background = 'transparent';
			addButton.style.border = 'none';
			//addButton.style.outline = '-1px solid white';
			//addButton.setAttribute('onclick' , 'Editor.addScene()');
			var a = document.createElement('a');
			a.className = 'fa fa-'+ icon;
			a.setAttribute('aria-hidden',"true");
			addButton.appendChild(a);
			addButton.onclick = func;
			return addButton;
			
		};
		
		var addIconToTab = function(tab,icon,func){
			
			var tit = tab.title.innerHTML;
			tab.title.innerHTML = '';
			var button = iconButton(icon,func);
			if(!func) button.disabled = 'disabled';
			tab.title.appendChild(button);
			tab.title.innerHTML += tit;
			
		};
		
		//call the init to setup 
		LiteGUI.init();
		
		//var mainarea = new LiteGUI.Area({content_id:"workarea", height: "30px", autoresize: true, inmediateResize: true, minSplitSize: 200 });
		//LiteGUI.add( mainarea );
		//create a main container and split it in two
		var mainarea = new LiteGUI.Area({id:"mainarea",content_id:"canvasarea",height: "calc(100% - 30px)", autoresize: true, inmediateResize: true});
		mainarea.split("horizontal",[250,null], true);
		mainarea.root.style.overflow = 'hidden';
		LiteGUI.add( mainarea );

		//create a left panel
		var side_panel = new LiteGUI.Panel("sidepanel",{title:"", width: 200});
		//--side_panel.root.style.overflowY = 'auto';
		mainarea.getSection(0).add( side_panel );

		//create a inspector (widget container)
		/////////////////////////////////////
		var root = side_panel;
		//tabs 
		var tabs_widget = new LiteGUI.Tabs();
		//tabs_widget.addTab("Info");
		var graph_tab = tabs_widget.addTab("SceneGraph",{selected:true, width: "100%", height: 100});
		addIconToTab(graph_tab,'list',null);
		graph_tab.title.parentElement.onclick = function(){widgets.root.style.display = '';};
		
		var sceneTab = tabs_widget.addTab("Scene");
		sceneTab.content.style.width = '100%';
		sceneTab.content.style.height = 'calc(100vh - 36px)';//50
		sceneTab.content.style.overflow = 'auto';
		
		addIconToTab(sceneTab,'globe',null);
		sceneTab.title.onclick = function(){widgets.root.style.display = 'none';};
		//sceneTab.title.onclick = function(){Editor.updateSceneGUI()};
		
		var appTab = tabs_widget.addTab("App");
		appTab.content.style.width = '100%';
		appTab.content.style.height = 'calc(100vh - 36px)';//50
		appTab.content.style.overflow = 'auto';
		
		addIconToTab(appTab,'desktop',null);
		appTab.title.onclick = function(){widgets.root.style.display = 'none';};
		
		/*var gui = new dat.GUI({ autoPlace: false , width:'100%'});
		var container = gui.domElement;	
		gui.__closeButton.style.visibility = 'hidden';
		
		sceneTab.content.appendChild(container);
		
		//demo scene 
		var scene = {
		id:0,
		name:'Scene',
		color:'#ffffff',
		width : 400,
		height : 400
		}
		
		gui.add(scene,'name');
		gui.addColor(scene,'color');
		
		var f1 = gui.addFolder('Canvas');
		f1.add(scene,'width');
		f1.add(scene,'height');*/
		
		//sceneTab.content.children[0].style.width = '100%';
		//var f1 = this.propertiesGui.addFolder('Text');
			
		
		//tabs_widget.getTabContent("Tree").appendChild( LiteGUI.createElement( "strong",null,"Example of code inside tab container") );
		
		
		//tree
		var mytree = { 
				
		};

		var litetree = new LiteGUI.Tree( mytree, { allow_rename: false });
		//mytree.DOM.children[0].children[2].innerHTML = '';
		//mytree.DOM.style.display = 'none';
		
		var addButton = document.createElement('button');
			addButton.style.background = 'transparent';
			addButton.style.border = 'none';
			var a = document.createElement('a');
			a.className = 'fa fa-caret-down';
			a.setAttribute('aria-hidden',"true");
			addButton.appendChild(a);
			
			addButton.disabled = 'disabled';
			mytree.DOM.children[0].children[2].innerHTML = '';
			mytree.DOM.children[0].children[2].appendChild(addButton);
			
		LiteGUI.bind( litetree.root, "item_selected", function(e) {
			
			var entity = Editor.getEntityById(e.detail.data.id);
			
			if(entity)if(entity.locked)return;
			Editor.selectEntity(entity);
			
			if(entity){
			Editor.focus(entity);
			}
			
			if(this.selected == null)Editor.updateTree();
			e.detail.data.DOM.style.background = 'black';
			
			
			
			//console.log("Node selected: ", e.detail); 
		});
		var tree_tab_content = tabs_widget.getTabContent("SceneGraph");
		tree_tab_content.appendChild( litetree.root );

		tree = litetree;
		//litetree.insertItem( {id:"FOO"}, "Child2",2 );
		//litetree.removeItem( "SubChild1" );
		//litetree.moveItem( "FOO", "Child3" );
		//litetree.insertItem( {id:"MAX"}, "Child1" );
		
		litetree.root.parentElement.style.overflow = 'auto';
		root.add( tabs_widget );
	
		var div2 = document.createElement('div');
		div2.className = 'sidebar-controls';
		div2.id = 'treetool';
		var color = '#1a1a1a';
		
		var button = document.getElementById('up-button');
		button.style.height = '20px';
		button.style.fontSize = '10px';
		button.style.backgroundColor = color;
		button.onclick  = function(){
		if(!Editor.selected) return;
		
		var array = Editor.scene.children;
		var array1 = mytree.children;
		
		var oldIndex = array.indexOf(Editor.selected);
		if(oldIndex == 0) return;
		var newIndex = oldIndex--;
		
		array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
		array1.splice(newIndex, 0, array1.splice(oldIndex, 1)[0]);
		Editor.updateTree();
		Editor.update();
		}
		div2.appendChild(button);
		var button = document.getElementById('down-button');
		button.style.height = '20px';
		button.style.fontSize = '10px';
		button.style.backgroundColor = color;
		button.onclick  = function(){
		if(!Editor.selected) return;
		
		var array = Editor.scene.children;
		var array1 = mytree.children;
		
		var oldIndex = array.indexOf(Editor.selected);
		if(oldIndex == array.length-1) return;
		var newIndex = oldIndex++;
		
		array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
		array1.splice(newIndex, 0, array1.splice(oldIndex, 1)[0]);
		
		Editor.updateTree();
		Editor.update();
		}
		div2.appendChild(button);
		
		var button = document.getElementById('file-import-button');
		button.style.height = '20px';
		button.style.fontSize = '10px';
		button.style.backgroundColor = color;
		div2.appendChild(button);
		
		var button = document.getElementById('file-export-button');
		button.style.height = '20px';
		button.style.fontSize = '10px';
		button.style.backgroundColor = color;
		div2.appendChild(button);
		
		var button = document.getElementById('file-share-button');
		button.style.height = '20px';
		button.style.fontSize = '10px';
		button.style.backgroundColor = color;
		div2.appendChild(button);
		
		tree_tab_content.parentElement.appendChild(div2);
		
		//side panel widget
		widgets = new LiteGUI.Inspector();
		widgets.onchange = function(name,value,widget) {
			console.log("Widget change: " + name + " -> " + value );
		};
		root.content.appendChild(widgets.root);

		widgets.root.appendChild( LiteGUI.createElement( "strong",null,"") );//Properties
		
		var div = widgets.addContainer();
		div.id = 'properties';
		div.style.marginTop = '5px';
		//widgets.root.appendChild(div);
		
		widgets.root.style.overflowY = 'auto';
		widgets.root.style.height = 'calc(100% - 110px)';
		
		/////////////////////////////////////
		
		var mainarea1 = new LiteGUI.Area({id:"mainarea1", content_id:"canvasarea",height: "calc(100% - 30px)", autoresize: true, inmediateResize: true});
		
		if(settings.Editor.split == 'vertical')
		mainarea1.split("vertical",['70%',null], true);
		else
		mainarea1.split("horizontal",['55%',null], true);
		
		mainarea1.root.style.overflow = 'hidden';
		mainarea1.root.style.height = '';
		mainarea.getSection(1).add( mainarea1 );
		
		//create right panel
		var main_panel = new LiteGUI.Panel("mainpanel");
		mainarea1.getSection(0).add(main_panel);
		//create some tabs
		var tabs = new LiteGUI.Tabs({id:"tabs", size: "full" });
		
		var scene_tab = tabs.addTab("Scene Editor", { height: "95%" });
		addIconToTab(scene_tab,'edit',null);
		scene_tab.content.style.display = 'flex';
		scene_tab.content.style.flexDirection = 'column';
		scene_tab.content.style.overflow = 'hidden';
		
		var toolbar = document.createElement('div');
		toolbar.id = 'scene_toolbar';
		toolbar.style.overflow = 'hidden';
		toolbar.style.background = '#aaa';
		toolbar.style.outline = '1px solid black';
		toolbar.style.outlineOffset = '-1px';
		toolbar.style.width = '100%';
		toolbar.style.display = 'flex';
		
		
		var tdiv = document.getElementById('sce_toolbar');
		tdiv.style.width = '100%';
		//tdiv.style.fontSize = '10px';
		tdiv.style.overflow = 'hidden';
		toolbar.appendChild(tdiv);
		
		var snapbar = document.getElementById('snapbar');
		snapbar.style.position = 'absolute';
		snapbar.style.width = 'auto';
		snapbar.style.right = '4px';
		snapbar.style.bottom = '0px';
		
		snapbar.querySelector('#grid-show-button').showGrid = settings.Editor.showGrid;
		snapbar.querySelector('#grid-show-button').style.backgroundColor = settings.Editor.showGrid?'black':'';
		
		snapbar.querySelector('#grid-show-button').onclick = function(){
		this.showGrid = !this.showGrid;
		
		Editor.settings.Editor.showGrid = this.showGrid;
		this.style.backgroundColor = settings.Editor.showGrid?'black':'';
		
		if(settingsTab)
		settingsTab.settingsGui.updateDisplay();

		Editor.update();
		
		}
		
		snapbar.querySelector('#snap-button').snapToGrid = false;
		snapbar.querySelector('#snap-button').onclick = function(){
		this.snapToGrid = !this.snapToGrid;
		Editor.snapToGrid = this.snapToGrid;
		this.style.backgroundColor = Editor.snapToGrid?'black':'';
		}
		
		snapbar.querySelector('#focus-button').onclick = function(){
		if(!Editor.selected)return;
		Editor.focus(Editor.selected);
		}
		
		
		var snap_controls = document.getElementById('snap-controls');
		snap_controls.removeAttribute('hidden');
		snap_controls.style.display = 'table';
		snap_controls.style.border = '1px solid black';
		snap_controls.style.margin = '4px';
		snap_controls.style.background = '#72728f';
		snap_controls.style.position = 'absolute';
		snap_controls.style.width = 'auto';
		snap_controls.style.right = '0px';
		snap_controls.style.bottom = '23px';
		
		snap_controls.children[0].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.x -= Editor.selected.width;
		Editor.selected.y -= Editor.selected.height;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[1].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.y -= Editor.selected.height;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[2].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.x += Editor.selected.width;
		Editor.selected.y -= Editor.selected.height;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[4].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.x -= Editor.selected.width;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[5].onclick = function(){
		this.copyMode = !this.copyMode;
		var checked = '<i class="fa fa-check-square-o"  aria-hidden="true"></i>'
		var empty = '<i class="fa fa-square-o"  aria-hidden="true"></i>';
		this.innerHTML = (this.copyMode?checked:empty);
		}
		
		snap_controls.children[6].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.x += Editor.selected.width;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[8].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.x -= Editor.selected.width;
		Editor.selected.y += Editor.selected.height;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[9].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.y += Editor.selected.height;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}
		
		snap_controls.children[10].onclick = function(){
		if(!Editor.selected) return;
		if(this.parentElement.children[5].copyMode)document.getElementById('duplicate-sprite-button').click();
		Editor.selected.x += Editor.selected.width;
		Editor.selected.y += Editor.selected.height;
		Editor.pupdate();
		Editor.propertiesGui.updateDisplay();
		}

		//toolbar.appendChild(snap_controls);
		
		
		
		var canvasDiv = document.createElement('div');
		canvasDiv.style.overflow = 'auto';
		//canvasDiv.style.width = 'calc(100% - 83px)';
		canvasDiv.style.height = '100%';
		
		var canvas = document.getElementById('field');
		canvasDiv.appendChild(canvas);
		
		
		canvasDiv.appendChild(snap_controls);
		canvasDiv.appendChild(snapbar);
		
		scene_tab.content.appendChild(toolbar);
		scene_tab.content.appendChild(canvasDiv);
		
		scene_tab.tab.onclick = function(){Editor.canvas.redraw();};
		
		canvas.redraw = function() {
		
		if(tabs.current_tab[0] == 'Scene Editor'){
		scene_tab.content.style.display = 'flex';
		scene_tab.content.style.overflow = 'hidden';
		}
		
		if(!Game.autoSize){
		scene_tab.content.style.overflow = 'auto';
		return;
		}
		
		scene_tab.content.style.overflow = 'hidden';
		var rect = this.parentNode.getClientRects()[0];
		
		if(!rect)return;

		this.width = rect.width;
		this.height = rect.height;
		
		Game.width = rect.width;
		Game.height = rect.height;
		
		/*if(Game.autoSize && Game.fullScreen){
			this.width = window.innerWidth;
			this.height = window.innerWidth;
			Game.width = this.width;
			Game.height = this.height;
		}*/
		
		Editor.update();
		Editor.updateAppGUI();
		
		
		}
		
		//scene_tab.content.style.overflow = 'auto';
		
		//var code_tab = tabs.addTab("Event Editor", { size: "full" });
		//code_tab.content.appendChild(document.getElementById('EventEditor'));
		//code_tab.content.style.overflow = 'hidden';
		//code_tab.tab.onclick = function(){Editor.eventViewModel.initEditor();}
		
		//var code_tab = tabs.addTab("File Manager", { size: "full" });
		//code_tab.content.style.overflow = 'hidden';
		//code_tab.content.appendChild(document.getElementById('filemanager'));
		
		var settingsTab = null;
		
		function openSettingTab(){
			if(tabs.getTab("Settings")){tabs.getTab("Settings").click();return};
		
		settingsTab = tabs.addTab("Settings", { selected:true, closable:true , size: "full" });
		addIconToTab(settingsTab,'cog',null);
		settingsTab.content.style.overflowY = 'auto';
			
			settingsTab.settingsGui = new dat.GUI({ autoPlace: false , width:'100%'});
			var container = settingsTab.settingsGui.domElement;	
			settingsTab.settingsGui.__closeButton.style.visibility = 'hidden';
			settingsTab.content.appendChild(container);
			
			
			var settings = Editor.settings;
			
			for(var i in settings){
				
				if(settings[i] instanceof Object){
					
					var f1 = settingsTab.settingsGui.addFolder(i);
					f1.open();
					
					for(var ii in settings[i]){
						
						if(ii.includes("__"))continue;
						
						if(ii.includes("Color"))f1.addColor(settings[i],ii);
						else f1.add(settings[i],ii,settings[i]['__'+ii]);
					
					}
				}
			
			}
			
			settingsTab.defaultSettings = function(){
			Editor.defaultSettings();
			if(document.getElementById('grid-show-button').showGrid)
				document.getElementById('grid-show-button').click();
				Editor.update();
			};
			
			settingsTab.reloadEditor = function(){location.reload();};
			
			settingsTab.settingsGui.add(settingsTab,'defaultSettings');
			settingsTab.settingsGui.add(settingsTab,'reloadEditor');
			
			for (var i in settingsTab.settingsGui.__controllers) {
			settingsTab.settingsGui.__controllers[i].onChange(function(e){
				
				//Editor.update();
				//if(this.property == 'name'){Editor.updateTree();Editor.updateAppGUI();}
				
			}); 
		 }
		 
		 for (var i in settingsTab.settingsGui.__folders) {
					
				for (var i1 in settingsTab.settingsGui.__folders[i].__controllers) {
					
					settingsTab.settingsGui.__folders[i].__controllers[i1].onFinishChange(function(e){
					
					if(this.property == 'showGrid' || this.property == 'gridSize'){
						document.getElementById('grid-show-button').click();
						Editor.update();
					}
					/* if(this.property == 'width')Editor.canvas.width = e;
					if(this.property == 'height')Editor.canvas.height = e; */
					//Editor.update();
			}); 
					
				}
					
			}
		
		settingsTab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		function openAboutTab(){
			if(tabs.getTab("About")){tabs.getTab("About").click();return};
		
		var code_tab = tabs.addTab("About", { selected:true, closable:true , size: "full" });
		addIconToTab(code_tab,'info-circle',null);
		code_tab.content.style.overflow = 'hidden';
		
		var div = document.createElement('div');
		div.style.height = '75%';
		div.style.backgroundImage = 'url(img/logo.png)';
		div.style.backgroundRepeat = 'no-repeat';
		div.style.backgroundPosition = 'center';
		div.style.backgroundSize = 'contain';
		
		var div1 = document.createElement('div');
		div1.innerHTML = '<center><h2>ZICA ENGINE V0.1.0</h2>'+
		'<p>Create 2D games & apps without programming.</p>' +
		'<br><center>Copyright © 2020 Željko Ivanović</center>';
		
		
		code_tab.content.appendChild(div);
		code_tab.content.appendChild(div1);
		
		code_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		var run_tab = null;
		
		function openRunTab(){
			if(tabs.getTab("Run")){tabs.getTab("Run").destroy();scene_tab.click();window.run_tab = null;return};
		
		window.run_tab = tabs.addTab("Run", { selected:true,height: "95%",width:"100%" });
		addIconToTab(run_tab,'play',null);
		window.run_tab.content.style.overflow = 'hidden';
		
		var iframe = document.createElement('iframe');
		iframe.id = 'run_game';
		iframe.setAttribute('allowFullScreen', '');
		run_tab.content.appendChild(iframe);
		iframe.style.top = '0px';
		iframe.style.left = '0px';
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.style.overflow = 'hidden';
		
		//iframe.src = 'app/index.htm';
		iframe.src = 'js/lib/app/index.htm';
		
		/*if(Editor.settings.detachTab){
				tabs.detachTab('Run');
				iframe.contentWindow.top = 0;
				iframe.contentWindow.left = 0;
				iframe.contentWindow.width = window.outerWidth;
				iframe.contentWindow.height = window.outerHeight;
		}*/
		
		iframe.onload = function(){
		
			bubbleIframeMouseMove(this);
			
			var out = Editor.getGameData();
			this.contentWindow.gameData = out;
			this.contentWindow.document.getElementsByTagName('canvas')[0].focus();
			
		}
		//code_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		
		function openBuildTab(){
			if(tabs.getTab("Build")){tabs.getTab("Build").click();return};
		
		window.build_tab = tabs.addTab("Build", { selected:true, closable:true , size: "full" });
		addIconToTab(build_tab,'android',null);
		//build_tab.content.style.overflow = 'hidden';
		build_tab.content.style.boxSizing = 'border-box';
		var build = document.getElementById('build').cloneNode(true);
		build.removeAttribute('hidden');
		
		build_tab.content.appendChild(build);
		
		build_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		function openPaintTab(){
		
		var tab = tabs.getTab('Image Editor');
		if(tab)tab.destroy();

		if(tabs.getTab("Image Editor")){tabs.getTab("Image Editor").click();return};
		
		window.paint_tab = tabs.addTab("Image Editor", { selected:true, closable:true , size: "full" });
		addIconToTab(paint_tab,'paint-brush',null);
		paint_tab.content.style.overflow = 'hidden';
		
		var paint = document.createElement('iframe');
		paint.name = 'Image Editor';
		paint.style.position = 'absolute';
		paint.style.top = '0px';
		paint.style.left = '0px';
		paint.style.width = '100%';
		paint.style.height = '100%';
		paint.src = 'js/lib/literallycanvas/index.html';
		paint_tab.content.appendChild(paint);
		bubbleIframeMouseMove(paint);
		
		
		paint_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		function openAudioEditorTab(){
		
		var tab = tabs.getTab('Audio Editor');
		if(tab)tab.destroy();

		if(tabs.getTab("Audio Editor")){tabs.getTab("Audio Editor").click();return};
		
		window.audioEditor_tab = tabs.addTab("Audio Editor", { selected:true, closable:true , size: "full" });
		addIconToTab(audioEditor_tab,'file-audio-o',null);
		audioEditor_tab.content.style.overflow = 'hidden';
		
		var audioEditor = document.createElement('iframe');
		audioEditor.name = 'Audio Editor';
		audioEditor.style.position = 'absolute';
		audioEditor.style.top = '0px';
		audioEditor.style.left = '0px';
		audioEditor.style.width = '100%';
		audioEditor.style.height = '100%';
		audioEditor.src = 'js/lib/audioEditor/index.html';
		audioEditor_tab.content.appendChild(audioEditor);
		bubbleIframeMouseMove(audioEditor);
		
		
		audioEditor_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		function openTextEditorTab(type){
		
		if(!type)type = 'javascript';
		
		var tab = tabs.getTab('Text Editor');
		if(tab)tab.destroy();

		if(tabs.getTab("Text Editor")){tabs.getTab("Text Editor").click();return};
		
		window.textEditor_tab = tabs.addTab("Text Editor", { selected:true, closable:true , size: "full" });
		addIconToTab(textEditor_tab,'file-text-o',null);
		textEditor_tab.content.style.overflow = 'hidden';
		
		var textEditorDiv = document.createElement('div');
		textEditorDiv.name = 'Text Editor';
		textEditorDiv.style.position = 'absolute';
		textEditorDiv.style.top = '0px';
		textEditorDiv.style.left = '0px';
		textEditorDiv.style.width = '100%';
		textEditorDiv.style.height = '100%';
		textEditor_tab.content.appendChild(textEditorDiv);
		
		var value = Game.assets[Editor.selectedText];
		
		var textEditor = window["monaco"].editor.create(textEditorDiv, {
                value: value,
                language: type,
                fontFamily: "Inconsolata-g",
                lineNumbers: "on",
                fontSize: 13,
				//contextmenu:false,
				automaticLayout: true, // the important part
				theme : "vs-dark"
            });
        textEditor.getModel().updateOptions({ tabSize: 2 });
		
		textEditor.fileName = Editor.selectedText;
		
		var _this = textEditor;
		textEditor.onDidChangeModelContent(function (e) {
				if(Game.assets[_this.fileName])
				Game.assets[_this.fileName] = _this.getValue();
		});
		
		textEditor_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		
		function openMapEditorTab(){
		
		var tab = tabs.getTab('RPG Map Editor');
		if(tab)tab.destroy();

		if(tabs.getTab("RPG Map Editor")){tabs.getTab("RPG Map Editor").click();return};
		
		window.mapEditor_tab = tabs.addTab("RPG Map Editor", { selected:true, closable:true , size: "full" });
		addIconToTab(mapEditor_tab,'map-o',null);
		mapEditor_tab.content.style.overflow = 'hidden';
		
		var mapEditor = document.createElement('iframe');
		mapEditor.name = 'RPG Map Editor';
		mapEditor.style.position = 'absolute';
		mapEditor.style.top = '0px';
		mapEditor.style.left = '0px';
		mapEditor.style.width = '100%';
		mapEditor.style.height = '100%';
		mapEditor.src = 'js/lib/rpg-map-editor/index.html';
		mapEditor_tab.content.appendChild(mapEditor);
		bubbleIframeMouseMove(mapEditor);
		
		
		mapEditor_tab.tab.children[1].onclick = function(){scene_tab.click()}
		
		}
		//closable:true 
		//widgets.addButton(null,"Detach Code tab", function() { tabs.detachTab("Code"); });
			
		main_panel.add(tabs);
		
		//create right panel
		var main_panel1 = new LiteGUI.Panel("mainpanel1");
		mainarea1.getSection(1).add(main_panel1);
		main_panel1.root.style.backgroundColor = '#000';
		//create some tabs
		var tabs1 = new LiteGUI.Tabs({id:"tabs1", size: "full" });
		
		var console_tab = tabs1.addTab("Console", { size: "full" });
			
		addIconToTab(console_tab,'terminal',null);
			
		console_tab.content.style.overflow = 'hidden';
		console_tab.content.id = 'sandbox';
		console_tab.content.innerHTML = 'sandbox loading...';
		console_tab.tab.onclick = function(){sandbox.textarea.focus();};
		
		var assete_tab = tabs1.addTab("Assets", { selected:true,size: "full" });
			
		addIconToTab(assete_tab,'image',null);
		assete_tab.content.style.overflow = 'hidden';
		assete_tab.content.appendChild(document.getElementById('filemanager'));	
		
		var div = document.createElement('div');
		div.style.display = 'none';
		div.id = 'asseteAddButton';
		div.className = 'fab fa fa-plus-circle';
		//div.innerHTML = ' + ';
		div.style.position = 'absolute';
		div.style.right = '10px';
		div.style.bottom = '10px';
		//div.classList.add('fa fa-add');
		div.onclick = function(){
			frames[0].files.value = '';
			frames[0].files.click();
		}
		
		assete_tab.content.appendChild(div);
		
		function bubbleIframeMouseMove(iframe){
		// Save any previous onmousemove handler
		var existingOnMouseMove = iframe.contentWindow.onmousemove;

		// Attach a new onmousemove listener
		iframe.contentWindow.onmousemove = function(e){
			// Fire any existing onmousemove listener 
			if(existingOnMouseMove) existingOnMouseMove(e);

			// Create a new event for the this window
			var evt = document.createEvent("MouseEvents");

			// We'll need this to offset the mouse move appropriately
			var boundingClientRect = iframe.getBoundingClientRect();

			// Initialize the event, copying exiting event values
			// for the most part
			evt.initMouseEvent( 
				"mousemove", 
				true, // bubbles
				false, // not cancelable 
				window,
				e.detail,
				e.screenX,
				e.screenY, 
				e.clientX + boundingClientRect.left, 
				e.clientY + boundingClientRect.top, 
				e.ctrlKey, 
				e.altKey,
				e.shiftKey, 
				e.metaKey,
				e.button, 
				null // no related element
			);

			// Dispatch the mousemove event on the iframe element
			iframe.dispatchEvent(evt);
		};
}

			
		//var assete = document.getElementById('asseteTab');
		//assete_tab.content.appendChild(assete);
		//assete_tab.content.id = 'body';
		//assete_tab.content.classList.add('dropArea');
		//assete_tab.content.style.overflowX = 'hidden';
		//assete.removeAttribute('hidden');
		
		var code_tab = tabs1.addTab("Code", { size: "full" });
		addIconToTab(code_tab,'code',null);
		code_tab.content.appendChild(document.getElementById('EventEditor'));
		code_tab.content.style.overflow = 'hidden';
		//code_tab.tab.onclick = function(){/*Editor.eventViewModel.initEditor();*/}
		
		var prefabs_tab = tabs1.addTab("Prefabs", { size: "full" });
			
		addIconToTab(prefabs_tab,'gift',null);
		prefabs_tab.content.style.overflow = 'hidden';
		prefabs_tab.content.appendChild(document.getElementById('prefabsTab'));	
		
		var div = document.createElement('div');
		div.id = 'prefabsAddButton';
		div.className = 'fab fa fa-plus-circle';
		div.style.position = 'absolute';
		div.style.right = '10px';
		div.style.bottom = '10px';
	
		div.onclick = function(){
			frames[1].document.getElementById('files').value = '';
			frames[1].document.getElementById('files').click()
		}
		
		prefabs_tab.content.appendChild(div);
		
		
		var zscript_tab = tabs1.addTab("ZScript", { size: "full" });
			
		addIconToTab(zscript_tab,'puzzle-piece',null);
		zscript_tab.content.style.overflow = 'hidden';
		zscript_tab.content.appendChild(document.getElementById('ZScript'));	
		
		
		var animation_tab = tabs1.addTab("Animation", {size: "full" });
			
		addIconToTab(animation_tab,'magic',null);
		animation_tab.content.style.overflow = 'hidden';
		animation_tab.content.appendChild(document.getElementById('animaiton'));	
		
		/*
		var animation_tab = tabs1.addTab("Animation", {size: "full" });
			
		addIconToTab(animation_tab,'magic',null);
		animation_tab.content.style.overflow = 'hidden';
		animation_tab.content.appendChild(document.getElementById('timeline'));	
		*/
		
		main_panel1.add(tabs1);
		
		
		jQuery(document).ready(function($) {
			// Create the sandbox:
			window.sandbox = new Sandbox.View({
				el : $('#sandbox'),
				model : new Sandbox.Model(),
				resultPrefix : "> ",
				helpText : "type javascript commands into the console, hit enter to evaluate. \n[up/down] to scroll through history, ':clear' to reset it. \n[alt + return/up/down] for returns and multi-line editing.",
				tabCharacter : "  ",
				placeholder : "// type code here and hit enter (:help for info)"
			});
			//sandbox.model.destroy();
			
			var con = sandbox.el[0];
			con.style.borderRadius = 0;

			var cbox = sandbox.output[0];
			cbox.style.position = 'static';
			cbox.style.left = '0px';
			cbox.style.top = '0px';
			cbox.style.height = '100%';
			
			sandbox.textarea.focus();
			var tea = sandbox.textarea[0];
			
			bubbleIframeMouseMove(document.getElementById('filemanager'));
			bubbleIframeMouseMove(document.getElementById('prefabsTab'));
			bubbleIframeMouseMove(document.getElementById('ZScript'));
			bubbleIframeMouseMove(document.getElementById('animaiton'));
			
			//frames[1].full.dom.click();
			//frames[1].full.dom.style.display = 'none';
			
			document.addEventListener('keydown', function(e) {
				if(e.which == 116) {
					
					e.preventDefault();
					
					if(Game.state == 1){
					document.getElementById('play-pause-button').click();
					return;
					}
					if(Game.state == 2)document.getElementById('stop-button').click();
	
				}
				
				if (event.keyCode === 8) {
					var doPrevent = true;
					var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
					var d = $(event.srcElement || event.target);
					var disabled = d.prop("readonly") || d.prop("disabled");
					if (!disabled) {
						if (d[0].isContentEditable) {
							doPrevent = false;
						} else if (d.is("input")) {
							var type = d.attr("type");
							if (type) {
								type = type.toLowerCase();
							}
							if (types.indexOf(type) > -1) {
								doPrevent = false;
							}
						} else if (d.is("textarea")) {
							doPrevent = false;
						}
					}
					if (doPrevent) {
						event.preventDefault();
						return false;
					}
				}
			});
		
			mainarea.onresize = function() { 
			Editor.canvas.redraw();
			//if(run_tab)run_tab.content.firstChild.contentDocument.body.firstChild.redraw();
			};
			mainarea1.onresize = function() { 
			Editor.canvas.redraw();
			//if(run_tab)run_tab.content.firstChild.contentDocument.body.firstChild.redraw();
			};
			window.onresize = function() { 
			Editor.canvas.redraw();
			//if(run_tab)run_tab.content.firstChild.contentDocument.body.firstChild.redraw();
			};
			
		});