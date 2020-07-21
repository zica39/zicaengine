define(["require", "exports", "./entity", "./game", "./enums", "./scene", "./keys", "./event","./camera"], function (require, exports, entity_1, game_1, enums_1, scene_1, keys_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ko = require("knockout");
    var EditorViewModel = (function () {
        /****************************************************/
        function EditorViewModel() {
            var _this = this;
			//scene 
			this.scene = new scene_1.Scene();
			//set to tree
			this.scene.name = 'Scene';
			this.scene.active = true;
			this.scene.color = 'rgba(255,255,255,1)';
						
			this.settings = window.settings;
			this.snapToGrid = false;
			
			this.asset = {};
			this.asset.web = 'img/web.png';
			this.asset.android = 'img/android.png';
			this.asset.windows = 'img/windows.png';
			this.asset.linux = 'img/linux.png';
			this.asset.mac = 'img/osx.png';
			this.asset.chrome = 'img/chrome.png';
			
			this.asset.icon = 'img/icon.png';
			this.asset.logo = 'img/logo.png';
			
			this.asset.empty = 'img/empty.png';
			this.asset.loading = 'img/loading.gif';
			
			this.asset.notfound = 'img/notfound.png';
	
			var icon = new Image;
			var logo = new Image;
			
			icon.onload = function(){
				Editor.asset.icon = Editor.getBase64Image(this);
				//Game.icon = Editor.asset.icon;
				//Editor.updateAppGUI();
			};
			
			logo.onload = function(){
				Editor.asset.logo = Editor.getBase64Image(this);
				//Game.logo = Editor.asset.logo;
				//Editor.updateAppGUI();
			};
			
			icon.src = this.asset.icon;
			logo.src = this.asset.logo;
			
			this.clipboard = null;
            //holds the entities viewable when editing
            this.entityList = this.scene.children;
			//paused audios 
			this.pausedSongs = [];
			//entity counter;
			this.entityIndex = 0;
            //set to the current entity being dragged, false otherwise
            this.dragging = false;
            //set when scene camera moving
			this.isMoving = false;
			//set to the currently selected entity, false otherwise
			this.selected = null;
			//set to the currently selected image from assete
			this.selectedImage = null;
			//set to the currently selected file from assete
			this.selectedFile = null;
            //last position of the mouse {x, y}
            this.lastMouse = null;
			//on drop entities position of the mouse {x,y}
			this.dropMouse = null;
            //reference to the file dialog element on the page
			this.fileDialog = null;
			//properties gui 
			this.propertiesGui = new dat.GUI({ autoPlace: false });
			var customContainer = document.getElementById('properties');
			customContainer.appendChild(this.propertiesGui.domElement);
			this.propertiesGui.__closeButton.style.visibility = 'hidden';
			//this.propertiesGui.domElement.style.width = "";
			
			this.audio = new Audio();
			this.audio.controls = true;
			this.audio.style.width = '100%';
			this.audio.style.height = '20px';
			this.audio.style.margin = '2.5px';
			this.audio.setAttribute('controlsList',"nodownload");
			
			this.audio.onplaying = function(){
				this.volume = Editor.selected.volume;	
			}
			
			//scene gui 
			this.sceneGui = new dat.GUI({ autoPlace: false , width:'100%'});
			var container = this.sceneGui.domElement;	
			this.sceneGui.__closeButton.style.visibility = 'hidden';
			window.sceneTab.content.appendChild(container);
			this.updateSceneGUI();
			
			//this.scene1 = new scene_1.Scene();
            //this.propertiesViewModel = new properties_1.PropertiesViewModel();
            this.eventViewModel = new event_1.EventViewModel();
			
            //whether or not the game is paused - used for updating the play/pause button icon
            this.gameRunningState = ko.observable(1);
            this.canvas = document.getElementById("field");
			this.canvas.oncontextmenu = function(e){e.preventDefault()};
			
			this.canvas.addEventListener('mousedown', function(){this.focus()});
			
			this.canvas.ondragover = function(e){
				e.preventDefault();
				
				if(e.dataTransfer.files.length > 1){
					e.dataTransfer.effectAllowed = "none";
					e.dataTransfer.dropEffect = "none";
					return false;
				}
					
				//this.style.borderStyle = 'dashed';
			};
			this.canvas.ondragleave = function(e){
				e.preventDefault();
				//this.style.borderStyle = 'solid';
			};
			
			this.canvas.ondrop = function(e) {
				//this.style.borderStyle = 'solid';
				e.preventDefault();
				
				var _this = Editor;
				
				if(e.dataTransfer.files.length){
					
					var files = e.dataTransfer.files;
					//var file = files[0];
					//console.log(file.type);
					
					if(files.length > 1) return false;
					
					Editor.fileDialog.value = '';
					Editor.fileDialog.files = files;
					Editor.dropMouse = Mouse.get(e);
					Editor.dropMouse = Editor.camera.screenToWorld(Editor.dropMouse.x,Editor.dropMouse.y);
					Editor.onFileDialogClose();
					
					return;
				}else{
					
					var obj = e.dataTransfer.getData("text");
					if(!obj)return;
				}
				
				//console.log(obj);
				obj = JSON.parse(obj);
				
				if(obj.type == 'Image'){
					
					var img = obj.name;
					
					if(!(img in Game.assets))return false;
				
					var mouse = Mouse.get(e);
					mouse = Editor.camera.screenToWorld(mouse.x,mouse.y);
					
					for (var i = _this.entityList.length - 1; i >= 0; i--) {
						
						var ent_1 = _this.entityList[i];
						
						if (_this.pointInBox(mouse, ent_1)) {
							ent_1.image = img;
							Editor.updateImage();
							return;
						}
					}
					_this.scene.image = img;
					Editor.updateImage();
					return;
					
				}
				
				if(obj.type == 'Audio'){
					
					var audio = obj.name;
					
					if(!(audio in Game.assets))return false;
				
					var mouse = Mouse.get(e);
					mouse = Editor.camera.screenToWorld(mouse.x,mouse.y);
					
					for (var i = _this.entityList.length - 1; i >= 0; i--) {
						
						var ent_1 = _this.entityList[i];
						
						if (_this.pointInBox(mouse, ent_1)) {
							ent_1.audio = audio;
							Editor.updateAudio();
							return;
						}
					}
					//when add scene soung !!!
					//_this.scene.audio = audio;
					//Editor.updateImage();
					return;
				}
				
				if(obj.type == 'entity' || obj.type == 'scene'){
					
					Editor.dropMouse = Mouse.get(e);
					Editor.dropMouse = Editor.camera.screenToWorld(Editor.dropMouse.x,Editor.dropMouse.y);
					Editor.importPrefabs(obj.data);
					return;
					
				}
				
			};
			
            this.drawContext = this.canvas.getContext("2d");
            this.game = new game_1.GameRunner(this.canvas);
			this.game.addScene(this.scene);
			
			this.game.name = 'Game';
			this.game.version = '0.0.1';
			
			this.canvas.width = this.game.width;
			this.canvas.height = this.game.height;
			
			this.scene.x = this.canvas.width/2;
			this.scene.y = this.canvas.height/2;
			this.camera = new Camera(this.drawContext);
			this.game.camera = this.camera;
			
			//app gui 
			this.appGui = new dat.GUI({ autoPlace: false , width:'100%'});
			var container = this.appGui.domElement;	
			this.appGui.__closeButton.style.visibility = 'hidden';
			window.appTab.content.appendChild(container);
			this.updateAppGUI();
			
            this.fileDialog = document.getElementById("file-dialog");
            this.fileDialog.multiple = false;
			
			window.Game = this.game;
            window.Direction = enums_1.Direction;
            window.Editor = this;
            window.addEventListener("beforeunload", function (e) { _this.onWindowUnload(e); });
            window.addEventListener("keydown", function (e) { _this.onWindowKeyDown(e); });
            window.addEventListener("resize", function (e) { _this.onWindowResize(e); });
            this.update();
			this.updateTree();
			this.camera.addListeners();
			document.getElementById('asseteAddButton').style.display = '';
        }
		
		EditorViewModel.prototype.defaultSettings = function(){
			
			for(var i in defaultSettings){
				for(var ii in defaultSettings[i])
					Editor.settings[i][ii] = defaultSettings[i][ii];
			}
			settingsTab.tab.children[1].click();
			openSettingTab();
			//settingsTab.settingsGui.updateDisplay();
		};
		
		EditorViewModel.prototype.closeAllEditors =  function(){
			
			var EE = document.getElementById("editorDiv");
			
			for(var i = 0; i<= EE.children.length -1; i++){
				
				if(EE.children[i].id == 'field')continue;
				
				EE.children[i].setAttribute('hidden' ,"");
				
				
			}
			
		}
		EditorViewModel.prototype.toggleFullScreen = function(elem){
			
		  elem = elem || document.documentElement;
		  if (!document.fullscreenElement && !document.mozFullScreenElement &&
			!document.webkitFullscreenElement && !document.msFullscreenElement) {
			if (elem.requestFullscreen) {
			  elem.requestFullscreen();
			} else if (elem.msRequestFullscreen) {
			  elem.msRequestFullscreen();
			} else if (elem.mozRequestFullScreen) {
			  elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
			  elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
			document.getElementById('fsicon').className = 'fa fa-compress';
		  } else {
			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.msExitFullscreen) {
			  document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			}
			
			document.getElementById('fsicon').className = 'fa fa-expand';
		  }	
			
		};
		
		EditorViewModel.prototype.openEditor =  function(name){
			
			this.closeAllEditors();
			var EE = document.getElementById(name);
				
			if(EE.hasAttribute('hidden'))
			EE.removeAttribute('hidden');
			else
			EE.setAttribute('hidden' ,"");
			
		};
		
		EditorViewModel.prototype.addFontDialog = function(obj){
							
		};
		
		EditorViewModel.prototype.addList = function(f,obj){
			
			var select = document.createElement('select');
			select.obj = obj;
			select.onchange = function(e){
				
				this.style.fontFamily = this.value;
				this.obj.font = this.value;
				Editor.update();
				
			}
			
			var fonts = ["Arial","Arial Black","Comic Sans MS","Consolas",
			"Courier New","Georgia","Impact","Lucida Console",
			"Lucida Sans Unicode", "Microsoft Sans Serif",
			"Segoe Print", "Segoe Script" , "Segoe UI",
			"Symbol", "Tahoma" , "Times New Roman","Trebuchet MS","Trebuchet MS",
			"Verdana"]
	
			for(var i = 0 ; i<= fonts.length-1; i++){
				var opt = document.createElement('option');
				opt.label = fonts[i];
				opt.style.fontFamily = fonts[i];
				
				if(fonts[i] == obj.font){
					select.style.fontFamily = obj.font;
					opt.selected = 'selected';
				}
				opt.value = fonts[i];
				select.appendChild(opt);
			}
			//var index = this.game.scenes.indexOf(this.scene);
			
			
			var a = f.add({a:5},'a');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
	
			var c = document.createElement('span');
			c.className = 'property-name';
			c.innerHTML = 'Fonts';
			b.appendChild(c);
			
			
			var div = document.createElement('div');
			div.className = 'c';
			select.style.width = '100%';
			div.appendChild(select);	
			b.appendChild(div);
			
		};
		
		/* EditorViewModel.prototype.setAsset = function(asset){
			
		
			
		}; */
		
		EditorViewModel.prototype.getAsset = function(){
			
			var scenes = this.game.scenes;
			var assete = {};
			
			for(var i in scenes){
				
				var scene = scenes[i];
				if(scene.image)
					assete[scene.image] = scene.image.substr(scene.image.lastIndexOf('/')+1);
				//if(scene.__image.data)
				//assete[scene.__image.data.path1] = scene.__image.data;
				
				for(var ii in scene.children){
					
					var ent = scene.children[ii];
						if(ent.image)
							assete[ent.image] = ent.image.substr(ent.image.lastIndexOf('/')+1);
					//if(ent.__image.data)
						//assete[ent.__image.data.path1] = ent.__image.data;
						
				}
				
			}
		
			return assete;
		};
		
		EditorViewModel.prototype.addSelect = function(obj){
			
			var select = document.createElement('select');
			select.onchange = function(e){
				Editor.selected.attachTo = this.value;
				
			}
			var child = Editor.scene.children;
			
			var opt = document.createElement('option');
				opt.label = ''; //Editor.scene.name;
				opt.value = '';//Editor.scene.id;
				select.appendChild(opt);
				
			for(var i = 0 ; i<= child.length-1; i++){
				if( child[i] == Editor.selected )continue;
				if( child[i].attachTo == Editor.selected.__guid)continue;
				var opt = document.createElement('option');
				opt.label = child[i].name;
				opt.value = child[i].__guid;
				if(child[i].__guid == obj.attachTo)opt.selected = 'selected';
				select.appendChild(opt);
			}
			if(select.selectedIndex == 0)Editor.selected.attachTo = '';
			
			var a = this.propertiesGui.add({a:5},'a');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			
			var c = document.createElement('span');
			c.className = 'property-name';
			c.innerHTML = 'attachTo';
			b.appendChild(c);
					
			var div = document.createElement('div');
			div.className = 'c';
			select.style.width = '60%';
			div.appendChild(select);
			b.appendChild(div);
			
		};
		
		EditorViewModel.prototype.log = function(text){
			
			sandbox.model.log(text);
			
		};
		
		EditorViewModel.prototype.error = function(err){
			
			var text = err.name+': '+err.message; //+' '+err.lineNumber;
			sandbox.model.error(text);
			console_tab.click();
			
		};
		
		EditorViewModel.prototype.clearConsole = function(){
			
			sandbox.model.destroy();
			
		};
		
		EditorViewModel.prototype.updateEntity = function(){
			
			if(Editor.selected){
		
				Editor.updatePropertiesGui();
				Editor.updateTree();
				
			}
			
			//Error becouse Game.icon haven't name!!!
			
			Editor.updateSceneGUI(true);
			Editor.updateAppGUI();
			
			Editor.update();
			
			
		};
		
		EditorViewModel.prototype.updateImage = function(img){
			
			for(var i = 0; i<= Game.scenes.length-1;i++){
				
			if((Game.scenes[i].image == img))Game.scenes[i].__image = null;
				
				for (var _i = 0, _a = Game.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if((ent.image == img))ent.__image = null;
				}
			
			}
			
			this.updateEntity();
		};
		
		EditorViewModel.prototype.updateAudio = function(audio){
			
			for(var i = 0; i<= Game.scenes.length-1;i++){
				
			//if((Game.scenes[i].image == img))Game.scenes[i].__image = null;
				
				for (var _i = 0, _a = Game.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if((ent.image == audio))ent.__audio = null;
				}
			
			}
			
			this.updateEntity();
		};
		
		EditorViewModel.prototype.removeImage = function(){
			
			if(!(Game.icon in this.game.assets))Game.icon = '';
			if(!(Game.logo in this.game.assets))Game.logo = '';
			
			for(var i = 0; i<= Game.scenes.length-1;i++){
				
			if(!(Game.scenes[i].image in this.game.assets))Game.scenes[i].image = '';
				
				for (var _i = 0, _a = Game.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(!(ent.image in this.game.assets))ent.image = '';
				}
			
			}
			this.updateEntity();
		};
		
		
		EditorViewModel.prototype.removeAduio = function(){
			
			for(var i = 0; i<= Game.scenes.length-1;i++){
				
			//if(!(Game.scenes[i].image in this.game.assets))Game.scenes[i].image = '';
				
				for (var _i = 0, _a = Game.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(!(ent.audio in this.game.assets))ent.audio = '';
				}
			
			}
			this.updateEntity();
		};
		
		EditorViewModel.prototype.stopAllSounds = function(){
			
			for(var i = 0; i<= Game.scenes.length-1;i++){
				
				for (var _i = 0, _a = Game.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{
						ent.stopAudio();
						ent.__audio = null;
					}
				}
			
			}
			
		};
		
		
		EditorViewModel.prototype.pauseAllSounds = function(){
			this.pausedSongs = [];
			
			for(var i = 0; i<= Game.scenes.length-1;i++){
				
				for (var _i = 0, _a = Game.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{
						ent.pauseAudio();
						this.pausedSongs.push(ent);
					}
				}
			
			}
			
		};
		
		EditorViewModel.prototype.resumeAllSounds = function(){
			
			for(var i = 0; i<= this.pausedSongs.length-1;i++){
				
				this.pausedSongs[i].playAudio();
			}
			
		};
		
		EditorViewModel.prototype.addMap = function(obj){
			
			var div = document.createElement('div');
			div.style.display = 'flex';
			div.style.alignItems = 'center';
			div.style.flexDirection = 'column';
			div.style.border = 'white 1px solid';
			div.obj = obj;
			
			div.onclick = function(e){

				if(e.target.tagName != 'IMG')return;
				if(!Editor.selectedFile)return;
				if(Editor.selectedFile.type != 'Image')return;
				
				var img = Editor.selectedFile.name;
				
				this.obj.map = img;
				this.firstElementChild.src = Game.assets[img];
				var x = this.lastElementChild.firstElementChild;
				this.lastElementChild.innerHTML = img;
				this.lastElementChild.appendChild(x);
				
				if(obj.width<this.firstElementChild.naturalWidth)
				obj.width = this.firstElementChild.naturalWidth;
				if(obj.height<this.firstElementChild.naturalHeight)
				obj.height = this.firstElementChild.naturalHeight;
				
				Editor.update();
				Editor.sceneGui.updateDisplay();
				
			};
			
			div.ondragover = function(e){
				e.preventDefault();
				this.style.borderStyle = 'dashed';
			};
			div.ondragleave = function(e){
				e.preventDefault();
				this.style.borderStyle = 'solid';
			};
			
			div.ondrop = function(e) {
				this.style.borderStyle = 'solid';
				e.preventDefault();
				
				var img = e.dataTransfer.getData("text");
				img = JSON.parse(img);
				
				if(img.type == 'Image')img = img.name;
				//console.log(img);
				
				if(!(img in Game.assets))return false;
				
				this.obj.map = img;
				//this.obj.__image.data = data; // data for assete
				this.firstElementChild.src = Game.assets[img];
				var x = this.lastElementChild.firstElementChild;
				this.lastElementChild.innerHTML = img;
				this.lastElementChild.appendChild(x);
				
				if(obj.width<this.firstElementChild.naturalWidth)
				obj.width = this.firstElementChild.naturalWidth;
				if(obj.height<this.firstElementChild.naturalHeight)
				obj.height = this.firstElementChild.naturalHeight;
				
				Editor.update();
				Editor.sceneGui.updateDisplay()
			};
   		
			var img = document.createElement('img');
			img.style.width = '75px';
			img.style.height = '75px';
			img.style.marginTop = '5px';
			img.style.background = 'url(img/empty.png)';
			
			img.ondragstart = function(e) {
				e.preventDefault();
				return false;
			};
			
			/* if(this.game)
				if(!(obj.image in this.game.assets)){
					obj.image = ''; 
					this.update();
				} */
				
			if(obj.map)
			img.setAttribute('src',(obj.map in Game.assets)?Game.assets[obj.map]:this.asset.notfound);
			div.appendChild(img);
			
			 var iconDelete = (document.createElement('div'));
			iconDelete.style.display = 'inline-flex';
			iconDelete.style.width = '12px';
			iconDelete.style.height = '12px';
			iconDelete.style.backgroundImage = "url(img/delete.png)";
			iconDelete.style.backgroundSize = "100%";
			iconDelete.obj = obj;
			iconDelete.img = img;
			iconDelete.onclick = function(){
				this.obj.map = '';
				//this.obj.__image.data = null;
				this.img.alt = '';
				this.img.src = '';
				this.img.style.border = '1px solid white';
				
				var par = this.parentElement;
				this.parentElement.innerHTML = 'none';
				par.appendChild(this);
				
				//obj.width = Editor.canvas.width;
				//obj.height = Editor.canvas.height;
				Editor.update();
				Editor.sceneGui.updateDisplay();
			};
			//div.appendChild(iconDelete);
			
			var name = document.createElement('p');
			name.style.textAlign = 'center';
			name.innerHTML = obj.map;//obj.image.substr(obj.image.lastIndexOf('/')+1);
			if(name.innerHTML == '')name.innerHTML = 'none';
			
			name.appendChild(iconDelete);
			div.appendChild(name);
			
			
			return div;
		};
		
		EditorViewModel.prototype.addImage = function(obj){
			
			var div = document.createElement('div');
			div.style.display = 'flex';
			div.style.alignItems = 'center';
			div.style.flexDirection = 'column';
			div.style.border = 'white 1px solid';
			div.obj = obj;
			
			div.onclick = function(e){

				if(e.target.tagName != 'IMG')return;
				if(!Editor.selectedFile)return;
				if(Editor.selectedFile.type != 'Image')return;
				
				var img = Editor.selectedFile.name;
				
				if(!(img in Game.assets))return false;
				
				this.obj.image = img;
				this.firstElementChild.src = Game.assets[img];
				var x = this.lastElementChild.firstElementChild;
				this.lastElementChild.innerHTML = img;
				this.lastElementChild.appendChild(x);
				Editor.update();
				
			};
			
			div.ondragover = function(e){
				e.preventDefault();
				this.style.borderStyle = 'dashed';
			};
			div.ondragleave = function(e){
				e.preventDefault();
				this.style.borderStyle = 'solid';
			};
			
			div.ondrop = function(e) {
				this.style.borderStyle = 'solid';
				e.preventDefault();
				
				var img = e.dataTransfer.getData("text");
				img = JSON.parse(img);
				
				if(img.type == 'Image')img = img.name;
				//console.log(img);
				
				if(!(img in Game.assets))return false;
				
				this.obj.image = img;
				//this.obj.__image.data = data; // data for assete
				this.firstElementChild.src = Game.assets[img];
				var x = this.lastElementChild.firstElementChild;
				this.lastElementChild.innerHTML = img;
				this.lastElementChild.appendChild(x);
				Editor.update();
			};
   		
			var img = document.createElement('img');
			img.style.width = '75px';
			img.style.height = '75px';
			img.style.marginTop = '5px';
			img.style.background = 'url(img/empty.png)';
			
			img.ondragstart = function(e) {
				e.preventDefault();
				return false;
			};
			
			/* if(this.game)
				if(!(obj.image in this.game.assets)){
					obj.image = ''; 
					this.update();
				} */
				
			if(obj.image)
			img.setAttribute('src',(obj.image in Game.assets)?Game.assets[obj.image]:this.asset.notfound);
			div.appendChild(img);
			
			 var iconDelete = (document.createElement('div'));
			iconDelete.style.display = 'inline-flex';
			iconDelete.style.width = '12px';
			iconDelete.style.height = '12px';
			iconDelete.style.backgroundImage = "url(img/delete.png)";
			iconDelete.style.backgroundSize = "100%";
			iconDelete.obj = obj;
			iconDelete.img = img;
			iconDelete.onclick = function(){
				this.obj.image = '';
				//this.obj.__image.data = null;
				this.img.alt = '';
				this.img.src = '';
				//this.img.style.border = '1px solid white';
				
				var par = this.parentElement;
				this.parentElement.innerHTML = 'none';
				par.appendChild(this);
				
				Editor.update();
			};
			//div.appendChild(iconDelete);
			
			var name = document.createElement('p');
			name.style.textAlign = 'center';
			name.innerHTML = obj.image;//obj.image.substr(obj.image.lastIndexOf('/')+1);
			if(name.innerHTML == '')name.innerHTML = 'none';
			
			name.appendChild(iconDelete);
			div.appendChild(name);
			
			
			return div;
		};
		
		EditorViewModel.prototype.addLogoImage = function(obj){
			
			var div = document.createElement('div');
			div.style.display = 'flex';
			div.style.alignItems = 'center';
			div.style.flexDirection = 'column';
			div.style.border = 'white 1px solid';
			div.obj = obj;
			
			div.onclick = function(e){

				if(e.target.tagName != 'IMG')return;
				if(!Editor.selectedFile)return;
				if(Editor.selectedFile.type != 'Image')return;
				
				var img = Editor.selectedFile.name;
				
				if((img == Game.logo))return false;
			
				Game.logo = img;//Game.assets[img];
				this.firstElementChild.src = Game.assets[img];
			};
			
			div.ondragover = function(e){
				e.preventDefault();
				this.style.borderStyle = 'dashed';
			};
			div.ondragleave = function(e){
				e.preventDefault();
				this.style.borderStyle = 'solid';
			};
			
			div.ondrop = function(e) {
				this.style.borderStyle = 'solid';
				e.preventDefault();
				
				var img = e.dataTransfer.getData("text");
				img = JSON.parse(img);
				
				if(img.type == 'Image')img = img.name;
				//console.log(img);
				
				if((img == Game.logo))return false;
				
				//this.obj.image = img;
				//this.obj.__image.data = data; // data for assete
				Game.logo = img;//Game.assets[img];
				this.firstElementChild.src = Game.assets[img];
	
				//var x = this.lastElementChild.firstElementChild;
				//this.lastElementChild.innerHTML = img;
				//this.lastElementChild.appendChild(x);
				
				//Editor.update();
			};
   		
			var img = document.createElement('img');
			img.style.width = '75px';
			img.style.height = '75px';
			img.style.marginTop = '5px';
			img.style.background = 'url(img/empty.png)';
			img.ondragstart = function(e) {
				e.preventDefault();
				return false;
			};
			
			
			if(obj.logo)
			img.setAttribute('src',Game.assets[Game.logo]);
			else
			img.setAttribute('src',this.asset.logo);
		
			div.appendChild(img);
			
			 var iconDelete = (document.createElement('div'));
			iconDelete.style.display = 'inline-flex';
			iconDelete.style.width = '12px';
			iconDelete.style.height = '12px';
			iconDelete.style.backgroundImage = "url(img/delete.png)";
			iconDelete.style.backgroundSize = "100%";
			iconDelete.img = img;
			iconDelete.onclick = function(){
				
				iconDelete.img.src = Editor.asset.logo;
				Game.logo = '';//Editor.asset.logo;
			}
			
			
			var name = document.createElement('p');
			name.style.textAlign = 'center';
			name.innerHTML = 'Logo';
		
			div.appendChild(name);
			name.appendChild(iconDelete);
			
			
			return div;
		};
		
		EditorViewModel.prototype.addIconImage = function(obj){
			
			var div = document.createElement('div');
			div.style.display = 'flex';
			div.style.alignItems = 'center';
			div.style.flexDirection = 'column';
			div.style.border = 'white 1px solid';
			div.obj = obj;
			
			div.onclick = function(e){

				if(e.target.tagName != 'IMG')return;
				if(!Editor.selectedFile)return;
				if(Editor.selectedFile.type != 'Image')return;
				
				var img = Editor.selectedFile.name;
				
				if((img == Game.icon))return false;
			
				Game.icon = img;//Game.assets[img];
				this.firstElementChild.src = Game.assets[img];
			};
			
			div.ondragover = function(e){
				e.preventDefault();
				this.style.borderStyle = 'dashed';
			};
			div.ondragleave = function(e){
				e.preventDefault();
				this.style.borderStyle = 'solid';
			};
			
			div.ondrop = function(e) {
				this.style.borderStyle = 'solid';
				e.preventDefault();
				
				var img = e.dataTransfer.getData("text");
				img = JSON.parse(img);
				
				if(img.type == 'Image')img = img.name;
				//console.log(img);
				
				if((img == Game.icon))return false;
				
				//this.obj.image = img;
				//this.obj.__image.data = data; // data for assete
				Game.icon = img;//Game.assets[img];
				this.firstElementChild.src = Game.assets[img];
	
				//var x = this.lastElementChild.firstElementChild;
				//this.lastElementChild.innerHTML = img;
				//this.lastElementChild.appendChild(x);
				
				//Editor.update();
			};
   		
			var img = document.createElement('img');
			img.style.width = '75px';
			img.style.height = '75px';
			img.style.marginTop = '5px';
			img.style.background = 'url(img/empty.png)';
			img.ondragstart = function(e) {
				e.preventDefault();
				return false;
			};
			
			
			if(obj.icon)
			img.setAttribute('src',Game.assets[Game.icon]);
			else
			img.setAttribute('src',this.asset.icon);	
		
			div.appendChild(img);
			
			 var iconDelete = (document.createElement('div'));
			iconDelete.style.display = 'inline-flex';
			iconDelete.style.width = '12px';
			iconDelete.style.height = '12px';
			iconDelete.style.backgroundImage = "url(img/delete.png)";
			iconDelete.style.backgroundSize = "100%";
			iconDelete.img = img;
			iconDelete.onclick = function(){
				
				iconDelete.img.src = Editor.asset.icon;
				Game.icon = '';//Editor.asset.icon;
			}
			
			
			var name = document.createElement('p');
			name.style.textAlign = 'center';
			name.innerHTML = 'Icon';
		
			div.appendChild(name);
			name.appendChild(iconDelete);
			
			
			return div;
		};
		
		EditorViewModel.prototype.addButton = function(icon,obj){
			
			var addButton = document.createElement('button');
			addButton.style.background = 'transparent';
			addButton.style.border = 'none';
			//addButton.style.outline = '-1px solid white';
			//addButton.setAttribute('onclick' , 'Editor.addScene()');
			var a = document.createElement('a');
			a.className = 'fa fa-'+ icon;
			a.setAttribute('aria-hidden',"true");
			addButton.appendChild(a);
			addButton.obj = obj;
			return addButton;
			
		};
		
		EditorViewModel.prototype.updateAsset = function(){
			
			window.frames[0].ImageManager.HTMLBuilder.clear();
			
			for(var i in Game.assets){
				
				var data = {};
				data.id = i;
				data.fileBody = Game.assets[i];
				data.fileName = i;
				data.favorite = false;
				window.frames[0].ImageManager.HTMLBuilder.AppendImage(data);
				
			}
			
		}
		
		EditorViewModel.prototype.updateTree = function(flag){
			
			
			var selected = null;
			mytree.content = this.scene.name;
			
			for(var i = 0 ; i<= mytree.children.length-1; i++){
				mytree.children[i].content = mytree.children[i].obj.name;
				
				if(this.selected == mytree.children[i].obj){
					 selected = mytree.children[i];
				}
			}
			litetree.updateTree(mytree);
			
			for(var i = 0 ; i<= mytree.children.length-1; i++){
				
				var obj = mytree.children[i].obj;
				mytree.children[i].DOM.children[0].children[2].innerHTML = '';
				
				var button = this.addButton((obj.locked?'lock':'unlock'),obj);
				mytree.children[i].DOM.children[0].children[2].appendChild(button);
				button.onclick = function(){
					this.obj.locked = !this.obj.locked;
					this.firstElementChild.className = 'fa fa-'+ (this.obj.locked?'lock':'unlock');
					
					Editor.update();
				};
				
				var button = this.addButton((obj.visible?'eye':'eye-slash'),obj);
				mytree.children[i].DOM.children[0].children[2].appendChild(button);
				button.onclick = function(){
					this.obj.visible = !this.obj.visible;
					this.firstElementChild.className = 'fa fa-'+ (this.obj.visible?'eye':'eye-slash');
					Editor.updatePropertiesGui();
					Editor.update();
					Editor.updateTree();
				};
			}
			
			var button = this.addButton((true?'caret-down':'caret-up'));
			button.disabled = 'disabled';
			mytree.DOM.children[0].children[2].innerHTML = '';
			mytree.DOM.children[0].children[2].appendChild(button);
			if(this.selected == null)mytree.DOM.style.background = 'black';
			//mytree.DOM.style.display = 'none';
			//mytree.DOM.children[0].children[2].innerHTML = '';
			
			if(selected){
				
				selected = selected.DOM;
				selected.style.background = 'black';
				
				//var top = root.root.scrollTop
				selected.scrollIntoViewIfNeeded();
				//root.root.scrollTop = top;
				if(flag)widgets.root.scrollTop = 0;
				
			}
			
		};
		EditorViewModel.prototype.updateSceneGUI = function(flag){
			
			this.sceneGui.domElement.style.width = ""?undefined:this.propertiesGui.domElement.style.width = "";
			this.sceneGui.destroy();
			var arr = [];
			this.sceneGui.__controllers.forEach(function(e){arr.push(e);});
			arr.forEach(function(e){Editor.sceneGui.remove(e)});
			
			if(!flag){
				
			mytree.id = this.scene.id; 
			mytree.content = this.scene.name;
			mytree.children = [];
			
			}
			
			var scene = this.scene;
			
			this.sceneGui.add(scene,'name');
			this.sceneGui.add(scene,'active');
			//this.sceneGui.addColor(scene,'color');
			//this.sceneGui.add(scene,'bgImage');
			
			
			var f1 = this.sceneGui.addFolder('Background');
			f1.open();
			f1.add(scene,'opacity',0,1);
			f1.add(scene,'drawColor');
			f1.addColor(scene,'color');
			f1.add(scene,'drawImage');
			///////////////////////////
			//f1.add(obj,'image');
			var a = f1.add({a:true},'a');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			b.style.height = 'auto';
			b.appendChild(this.addImage(scene));
			//////////////////////////
			f1.add(scene,'aspectRatio');
			
			
			var f1 = this.sceneGui.addFolder('World');
			f1.open();
			f1.add(scene,'width');
			f1.add(scene,'height');
			var a = f1.add({a:true},'a');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			b.style.height = 'auto';
			b.appendChild(this.addMap(scene));
			
			
			var f1 = this.sceneGui.addFolder('Camera');
			f1.open();
			//f1.add(scene,'useCamera');
			f1.add(scene,'x');
			f1.add(scene,'y');
		
			/* var f1 = this.sceneGui.addFolder('World');
			f1.add(scene,'width').min(0);
			f1.add(scene,'height').min(0); */
			
			/* if(flag){
			this.canvas.width = this.scene.width;
			this.canvas.height = this.scene.height;
			} */
			
			for (var i in this.sceneGui.__controllers) {
			this.sceneGui.__controllers[i].onChange(function(e){
				
				Editor.update();
				if(this.property == 'name'){Editor.updateTree();Editor.updateAppGUI();}
				if(this.property == 'active'){
					var game = Editor.game;
					var scene = Editor.scene;
					if(e == true)
					for(var i = 0 ; i<= game.scenes.length-1; i++){
						if(scene == game.scenes[i])continue;
						game.scenes[i].active = false;
						
					}else{
						scene.active = true;
						this.value = true;	
					}
					
				}
			}); 
		 }
		 
		 for (var i in this.sceneGui.__folders) {
					
				for (var i1 in this.sceneGui.__folders[i].__controllers) {
					
					this.sceneGui.__folders[i].__controllers[i1].onChange(function(e){
					
						if(this.property == 'width')
							if(e<Editor.canvas.width)Editor.scene.width = Editor.canvas.width;
						if(this.property == 'height')
							if(e<Editor.canvas.height)Editor.scene.height = Editor.canvas.height;
						
						/* if(this.property == 'width')Editor.canvas.width = e;
						if(this.property == 'height')Editor.canvas.height = e; */
						Editor.update();
					}); 
					
				}
					
			}
			
		};
		
		EditorViewModel.prototype.updateAppGUI = function(flag){
			
			this.appGui.domElement.style.width = ""?undefined:this.propertiesGui.domElement.style.width = "";
			this.appGui.destroy();
			var arr = [];
			this.appGui.__controllers.forEach(function(e){arr.push(e);});
			arr.forEach(function(e){Editor.appGui.remove(e)});
			
			
			var game = this.game;
			
			/////Scenes
			var f1 = this.appGui.addFolder('Scene Manager');
			f1.domElement.querySelector('li.title').style.background = 'black';
			f1.open();
			
			var select = document.createElement('select');
			select.onchange = function(e){
				
				Editor.setScene(Editor.game.scenes[this.value]);
				
			}
			for(var i = 0 ; i<= game.scenes.length-1; i++){
				var opt = document.createElement('option');
				opt.label = game.scenes[i].name;
				//opt.value = game.scenes[i].uId;
				opt.value = this.game.scenes.indexOf(game.scenes[i]);
				if(game.scenes[i] == this.scene)opt.selected = 'selected';
				select.appendChild(opt);
			}
			//var index = this.game.scenes.indexOf(this.scene);
			
			
			var a = this.appGui.add({a:5},'a');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			//b.style.display = 'flex';
			//b.style.justifyContent = 'space-between';
			//document.createTextNode('Scenes')
			var c = document.createElement('span');
			c.className = 'property-name';
			c.innerHTML = 'Scenes';
			b.appendChild(c);
			//b.appendChild(select);
			var addButton = document.createElement('button');
			addButton.style.background = 'black';
			addButton.setAttribute('onclick' , 'Editor.addScene()');
			var icon = document.createElement('a');
			icon.className = 'fa fa-plus'
			icon.setAttribute('aria-hidden',"true");
			addButton.appendChild(icon);
			//b.appendChild(addButton);
			
			var removeButton = document.createElement('button');
			removeButton.style.background = 'black';
			removeButton.setAttribute('onclick' , 'Editor.removeScene()');
			var icon = document.createElement('a');
			icon.className = 'fa fa-trash'
			icon.setAttribute('aria-hidden',"true");
			removeButton.appendChild(icon);
			//b.appendChild(removeButton);
			
			var div = document.createElement('div');
			div.className = 'c';
			select.style.width = 'calc(100% - 50px)';
			div.appendChild(select);
			div.appendChild(addButton);
			div.appendChild(removeButton);
			b.appendChild(div);
			//this.appGui.add(this,'addScene');
			//this.appGui.add(this,'removeScene');
			////////////////////////////////////////////
			
			var f1 = this.appGui.addFolder('App Inforamtion');
			f1.domElement.querySelector('li.title').style.background = 'black';
			f1.open();
			this.appGui.add(game,'name');
			this.appGui.add(game,'version');
			this.appGui.add(game,'author');
			
			var des = this.appGui.add(game,'description');
			var a =des.domElement.parentElement.parentElement;
			a.innerHTML = '';
			var b = new LiteGUI.Inspector();
			var c = b.addTextarea('description',game.description,{height:'60px'});
			c.style.lineHeight = 1;
			c.style.height = 'auto';
			c.children[1].firstChild.firstChild.onchange = function(){Editor.game.description = this.value;};
			c.children[1].firstChild.firstChild.style.width = '100%';
			c.children[1].firstChild.firstChild.style.resize = 'vertical';
			a.appendChild(b.root)
			a.style.height = 'auto';
			/* var scenes  = {};
			for(var i = 0 ; i<= game.scenes.length-1; i++){
				scenes[game.scenes[i].name] = game.scenes[i].uId;
			}
			var text = {};
			text.scenes = this.scene.uId;
			
			this.appGui.add(text, 'scenes', scenes ); */
			
			/////////////////////////////////////////
			//ICON
			var a = this.appGui.add({icon:true},'icon');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			b.style.height = 'auto';
			b.appendChild(this.addIconImage(game));
			
			////////////////////////////////////////
		
			var f1 = this.appGui.addFolder('Logo');
			f1.open();
			/////////////////////////////////////////
			//LOGO
			var a = f1.add({logo:true},'logo');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			b.style.height = 'auto';
			b.appendChild(this.addLogoImage(game));
			
			////////////////////////////////////////
			
			f1.add(game,'showProgress');
			
			var f1 = this.appGui.addFolder('Canvas');
			f1.add(game,'width').min(0);
			f1.add(game,'height').min(0);
			//f1.add(game,'autoSize');
			f1.add(game,'pointerLock');
			f1.add(game,'autoResize');
			f1.add(game,'fullScreen');
			f1.open();
			
			if(flag){
			this.canvas.width = this.game.width;
			this.canvas.height = this.game.height;
			}
			
			for (var i in this.appGui.__controllers) {
			this.appGui.__controllers[i].onChange(function(e){
				
				Editor.update();
				
			}); 
		 }
		 
		 for (var i in this.appGui.__folders) {
					
				for (var i1 in this.appGui.__folders[i].__controllers) {
					
					this.appGui.__folders[i].__controllers[i1].onChange(function(e){
					
					if(this.property == 'width'){
						Editor.canvas.width = e;
						if(Editor.scene.width<e)Editor.scene.width = e;
						Editor.sceneGui.updateDisplay();
						Editor.update();
					}
					if(this.property == 'height'){
						Editor.canvas.height = e;
						if(Editor.scene.height<e)Editor.scene.height = e;
						Editor.sceneGui.updateDisplay();
						Editor.update();
					}
					Editor.update();
			}); 
					
				}
					
			}
			
		};
		
		EditorViewModel.prototype.setScene = function(scene){
			
			this.scene = scene;
			this.updateSceneGUI();
			this.updateAppGUI();
			
			this.entityList = this.scene.children;
            this.selected = null;
			this.entityIndex = 0;
			Editor.update();
            Editor.updatePropertiesGui();
			
            this.eventViewModel.selectEntity(null);
            this.eventViewModel.updateEventEditor();
			
			mytree.children.length = 0;
			for (var _i = 0, _a = this.entityList; _i < _a.length; _i++){
				var ent = _a[_i];
				mytree.children.push({id:ent.__guid ,content:ent.name,obj:ent});
			}
			
			this.updateTree();
			
			
		};
		
		EditorViewModel.prototype.addScene = function(){
			
			this.scene = new scene_1.Scene();
			this.scene.name = 'Scene';
			this.scene.color = 'rgba(255,255,255,1)';
			this.updateSceneGUI();
				
			this.game.addScene(this.scene);
			this.updateAppGUI();
			
			this.entityList = this.scene.children;//[];
            this.selected = null;
			this.entityIndex = 0;
			Editor.update();
            Editor.updatePropertiesGui();
			//this.propertiesViewModel.selectEntity(null);
            this.eventViewModel.selectEntity(null);
            this.eventViewModel.updateEventEditor();
			mytree.children.length = 0;
			this.updateTree();	
		};
		
		EditorViewModel.prototype.removeScene = function(){
			
			if(this.game.scenes.length == 1)return;
			
			var index = this.game.scenes.indexOf(this.scene);
			this.game.scenes.splice(index,1);
			if(index>0)
			while(index--){
				if(this.game.scenes[index])break;
			}
			this.scene = this.game.scenes[index];
			if(this.game.scenes.length == 1)this.scene.active = true;
			
			this.updateSceneGUI();
			this.updateAppGUI();
			
			this.entityList = this.scene.children;//[];
            this.selected = null;
			this.entityIndex = 0;
			Editor.update();
            Editor.updatePropertiesGui();
            this.eventViewModel.selectEntity(null);
            this.eventViewModel.updateEventEditor();
			mytree.children.length = 0;
			this.updateTree();	
		};
		
		EditorViewModel.prototype.updatePropertiesGui = function () {
			
			this.propertiesGui.domElement.style.width = ""?undefined:this.propertiesGui.domElement.style.width = "";
			this.propertiesGui.destroy();
			var arr = [];
			this.propertiesGui.__controllers.forEach(function(e){arr.push(e);});
			arr.forEach(function(e){Editor.propertiesGui.remove(e)});
			
			var obj = this.selected;
			if(obj == null) return;
			//if(obj.locked) return;
			
			litetree.updateTree(mytree);
			
			this.propertiesGui.add(obj,'name');
			//this.addSelect(obj);
			
			this.propertiesGui.add(obj,'position',['absolute','fixed']);
			
			if(obj.position == 'fixed'){
			this.propertiesGui.add(obj,'X',0,this.canvas.width);
			this.propertiesGui.add(obj,'Y',0,this.canvas.height);
			}
			
			if(obj.position == 'absolute'){
			this.propertiesGui.add(obj,'x',0,this.scene.width);
			this.propertiesGui.add(obj,'y',0,this.scene.height);
			}
			
			this.propertiesGui.add(obj,'width');
			this.propertiesGui.add(obj,'height');
			
			this.propertiesGui.add(obj,'angle',0,360);
			this.propertiesGui.add(obj,'visible');
			this.propertiesGui.add(obj,'collides');
			//this.propertiesGui.add(obj,'collision');
			
			this.propertiesGui.add(obj,'priority').min(0).step(1);
			this.propertiesGui.add(obj,'velX');
			this.propertiesGui.add(obj,'velY');
			
			var f1 = this.propertiesGui.addFolder('Border');
			f1.open();
			f1.add(obj, 'drawBorder');
			f1.addColor(obj, 'borderColor');
			f1.add(obj, 'borderWidth');
			f1.add(obj,'borderStyle',['solid','dashed']);
			
			var f1 = this.propertiesGui.addFolder('Background');
			f1.open();
			f1.add(obj,'opacity',0,1)
			f1.add(obj,'drawColor');
			f1.addColor(obj,'color');
			f1.add(obj,'drawImage');
			///////////////////////////
			//f1.add(obj,'image');
			//var title = f1.add({'image':true},'image');
			//title.domElement.parentElement.querySelector('div.c').innerHTML = '';
			
			var a = f1.add({a:true},'a');
			var b = a.domElement.parentElement.parentElement;
			a.domElement.parentElement.innerHTML = '';
			b.style.height = 'auto';
			b.appendChild(this.addImage(obj));
			//////////////////////////
			f1.add(obj,'aspectRatio');
			
			var f1 = this.propertiesGui.addFolder('Animation');
			f1.open();
			f1.add(obj, 'animation',obj.getAnimations());
			f1.add(obj, 'fps').min(0);
			f1.add(obj, 'animLoop');
			
			var f1 = this.propertiesGui.addFolder('Text');
			f1.open();
			f1.add(obj, 'text');
			//f1.add(obj, 'font');
			this.addList(f1,obj);
			f1.add(obj, 'fontSize',0);
			f1.add(obj, 'fontBold');
			f1.add(obj, 'fontItalic');
			//f1.add(obj, 'fontUnderline');
			f1.addColor(obj, 'fontColor');
			
			var f1 = this.propertiesGui.addFolder('Audio');
			f1.open();
			//f1.add(obj, 'audio');
			/////////////////////////////////
			var a = f1.add(obj,'audio');
			var box = a.domElement;
			var el = a.domElement.children[0];
			
			var iconDelete = (document.createElement('div'));
			iconDelete.style.position = 'absolute';
			iconDelete.style.right = '1px';
			iconDelete.style.width = '13%';
			iconDelete.style.height = '100%';
			iconDelete.style.marginTop = '2px';
			iconDelete.style.marginBottom = '2px';
			iconDelete.style.cursor = 'pointer';
			iconDelete.style.backgroundPosition = 'center';
			iconDelete.style.backgroundRepeat = 'no-repeat';
			iconDelete.style.backgroundImage = "url(img/delete.png)";
			iconDelete.style.backgroundSize = "100%";
			iconDelete.obj = obj;
			iconDelete.el = el;
			iconDelete.onclick = function(){
				this.obj.audio = '';
				el.value = '';
				Editor.audio.src = '';
				Editor.update();
			}
			
			box.appendChild(iconDelete);
				
			
			el.readOnly = true;
			el.placeholder = 'none';
			el.style.borderStyle = 'solid';
			el.style.borderWidth = '1px';
			el.style.webkitUserSelect = 'none';
			
			//console.log(el.audio);
			//el.value = obj.audio;
			
			el.ondragover = function(e){
				e.preventDefault();
				this.style.borderStyle = 'dashed';
			};
			el.ondragleave = function(e){
				e.preventDefault();
				this.style.borderStyle = 'solid';
			};
			
			el.ondrop = function(e) {
				this.style.borderStyle = 'solid';
				e.preventDefault();
				
				var audio = e.dataTransfer.getData("text");
				audio = JSON.parse(audio);
				
				if(audio.type == 'Audio')audio = audio.name;
				
				if(!(audio in Game.assets))return false;
				
				this.value = audio;
				Editor.selected.audio = audio;
				Editor.audio.src = Game.assets[audio]?Game.assets[audio]:'';
				Editor.update();
			}
			//////////////////////////////////
			
			/////////////////////////////////////
			var a = f1.add({audio:'a'},'audio');
			var box = a.domElement.parentElement;
			box.innerHTML = '';
			
			this.audio.pause();
			this.audio.src = Game.assets[obj.audio]?Game.assets[obj.audio]:'';
		
			box.appendChild(this.audio);
			
			/////////////////////////////////////
			
			f1.add(obj, 'autoplay');
			f1.add(obj, 'loop');
			f1.add(obj, 'volume',0,1);
			f1.add(obj, 'muted');
			
			/* var f1 = this.propertiesGui.addFolder('Animation');
			f1.add(obj, 'animAutoplay');
			f1.add(obj, 'animLoop'); */
			
			/* var f1 = this.propertiesGui.addFolder('Collison');
			f1.add(obj, 'blockedUp');
			f1.add(obj, 'blockedRight');
			f1.add(obj, 'blockedDown');
			f1.add(obj, 'blockedLeft'); */
			
			/* var f1 = this.propertiesGui.addFolder('Events');
			var a = {eventTextEditor:function(){
				code_tab.click();
			}};
			
			f1.add(a, 'eventTextEditor') */
			var f1 = this.propertiesGui.addFolder('');
			f1.domElement.querySelector('li.title').style.background = 'black';
		
		for (var i in this.propertiesGui.__controllers) {
			this.propertiesGui.__controllers[i].onChange(function(e){
				
				if(this.property == 'position'){

					Editor.updatePropertiesGui();
					Editor.updateTree();//error must be fixse;
					return;
				};
				
				Editor.pupdate();
				if(this.property == 'name' || this.property == 'visible')Editor.updateTree();
				
			}); 
		 }
		 
		 for (var i in this.propertiesGui.__folders) {
					
				for (var i1 in this.propertiesGui.__folders[i].__controllers) {
					
					this.propertiesGui.__folders[i].__controllers[i1].onChange(function(e){
					Editor.pupdate();
				
			}); 
					
				}
					
			}
			
			
		}
		
		EditorViewModel.prototype.getEntityById = function (id) {
			
			for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                if(ent.__guid == id) return ent;
            }
			
			return null;
			
		};
		EditorViewModel.prototype.focus = function(entity){
			if(entity.position == 'fixed')return;
			
			Editor.scene.moveCameraAt(entity);
			Editor.update();
			
		};
		EditorViewModel.prototype.selectEntity = function(entity) {
			
			var lastSelected = this.selected;
			this.selected = null;
			App.instance.displayList.length = 0;
			
			this.selected = entity;	
			
			if(this.selected){
			App.instance.displayList[0] = new Enity(this.selected);
			App.instance.select();
			App.instance.tool.draw();
			}
			
			if (lastSelected != this.selected) {
				
			this.eventViewModel.selectEntity(this.selected);
			this.eventViewModel.updateEventEditor();
			
			this.updatePropertiesGui();
			this.update();
			}       
			
			
		};
		
		EditorViewModel.prototype.drawGrid = function(context,bw,bh,size){
			
			var context = Editor.drawContext;
			//var bw = Math.max(Editor.scene.width,Editor.canvas.width);
			//var bh = Math.max(Editor.scene.height,Editor.canvas.height);
			var bw = Editor.scene.width;
			var bh = Editor.scene.height;
			var size = Editor.settings.Editor.gridSize;
			var p = 0;
			
			context.beginPath();
			
			for (var x = 0; x <= bw; x += size) {
				context.moveTo(0.5 + x + p, p);
				context.lineTo(0.5 + x + p, bh + p);
			}

			for (var x = 0; x <= bh; x += size) {
				context.moveTo(p, 0.5 + x + p);
				context.lineTo(bw + p, 0.5 + x + p);
			}

			context.strokeStyle = "black";
			context.stroke();
			
			context.closePath();
		}
		
		EditorViewModel.prototype.pupdate = function (e) {
			
			/* var p = e.parentElement.parentElement.firstElementChild.innerHTML;
			p.trim();
			console.log(p)
			console.log(e.value);
			Editor.selected[p] = e.value;
			Editor.update(); */
			
			var _this = this;
			
            //clear screen
			this.scene.__draw(this.drawContext);
		
			//draw all entities as well as a translucent box around them
			for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                ent.__draw(this.drawContext);
            }
			//draw grid
			if(settings.Editor.showGrid)
				this.drawGrid();
			
			App.instance.displayList[0] = new Enity(this.selected);
			App.instance.select();
			App.instance.tool.draw();
		}

        EditorViewModel.prototype.update = function () {
            var _this = this;
			
			this.camera.set(this.scene.x,this.scene.y);
			
			this.scene.__draw(this.drawContext);
			
			/* //clear screen
			this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
			//background
			this.drawContext.fillStyle = this.scene.color;
            this.drawContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
			if(!(this.scene.image instanceof Image))this.scene.image = new Image(); 
			if(this.scene.bgImage)this.scene.image.src = this.scene.bgImage;
			this.drawContext.drawImage(this.scene.image, 0,0 ,this.canvas.width, this.canvas.height);
			 */
			//draw a gold outline around the selected entity on top of everything for visibility
            if (this.selected) App.instance.drawDisplayList();	
			
			//draw all entities as well as a translucent box around them
			for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                ent.__draw(this.drawContext);
            }
			
			//draw grid
			if(settings.Editor.showGrid)
				this.drawGrid();
			
			
			if(this.selected) {
				
				this.drawContext.fillStyle = "#FFF";
				this.drawContext.strokeStyle = "#08F";
				this.drawContext.lineWidth = 2;
				
				if(Editor.isMoving){
					App.instance.displayList.length = 0;
					App.instance.displayList[0] = new Enity(this.selected);
					App.instance.select();
					App.instance.tool.draw();
				}else
					
				App.instance.tool.draw();
				
			}
			
			//this.camera.set(this.scene.x,this.scene.y);
			
            //if (this.game.isStopped)
                //requestAnimationFrame(function () { _this.update(); });
        };
        /**
         * Returns true if a point {x, y} is inside (but not on the edge of) a box {x, y, width, height}
         **/
        EditorViewModel.prototype.pointInBox = function (point, box) {
            return point.x > box.x && point.x < box.x + box.width && point.y > box.y && point.y < box.y + box.height;
        };
        /**
         * Toggles between pausing and playing the game, starting it if it's stopped.
         **/
        EditorViewModel.prototype.togglePlayPauseGame = function () {
           
		   var game = Game;
		   
		   if(run_tab)
			game = run_tab.content.firstChild.contentWindow.Game;
		   
		   if (game.isRunning()) {
                //this.game.pause();
				game.pause();
                this.gameRunningState(3);
				//this.pauseAllSounds();
            }
            else if (game.isPaused()) {
                //this.game.unpause();
				game.unpause();
                this.gameRunningState(2);
				//this.resumeAllSounds();
            }
            else {
				
				/* Editor.lastSelected = Editor.selected;
				Editor.selected = null;
				App.instance.displayList.length = 0;
				App.instance.deselect();
				Editor.propertiesGui.close();
				
				this.eventViewModel.selectEntity(this.selected);
                this.eventViewModel.updateEventEditor(); */
				
				this.eventViewModel.compileScripts();
				//var asset = Editor.getAsset();
				
				openRunTab();
				this.gameRunningState(2);
				return;
				
				/* openPlayTab();
				var win = play_tab.content.firstChild.contentWindow;
				var canvas = win.document.body.firstChild;
				win.Game = new game_1.GameRunner(canvas);
				
				var data = game_1.GameRunner.constructApp(this.game);
				game_1.GameRunner.constructApp(data,win.Game);
				canvas.redraw();
				win.Game.startApp();	
				this.gameRunningState(2);
				return; */
				
				//this.appGui.close();
				this.appGui.domElement.style.pointerEvents = 'none';
				
				var game = game_1.GameRunner.constructApp(this.game);
				
				this.oldGame = game; 
				
				this.scenes = this.game.scenes;
				
				this.game.scenes = [];
				for(var i = 0 ; i<= this.scenes.length-1; i++){
					this.game.scenes[i] = scene_1.Scene.constructScene(this.scenes[i]);
					if(this.scenes[i].active)this.game.scene = this.game.scenes[i]; //this.scene.constructScene();
				}
                //this.game.firstFrame = true;
                
				/* var newEntityList = [];
                //copy each entity and push it onto the game object's entity list
                //that way, we can restore the original states before starting the game
                for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                    var ent = _a[_i];
                    newEntityList.push(entity_1.Entity.constructEntity(ent));
                }
                this.game.start(newEntityList); */
				
				
				//this.game.start(this.game.scene);
                //this.game.recalcPriority();
				//this.game.asset = asset;
				this.game.startApp();
                this.gameRunningState(2);
            }
        };
        EditorViewModel.prototype.stopGame = function () {
			
			/* var game = play_tab.content.firstChild.contentWindow.Game;
			game.stop();
            this.gameRunningState(1);
			//this.stopAllSounds();
			openPlayTab();
			
			return; */
			
            //this.game.stop();
			run_tab.content.firstChild.contentWindow.Game.stop();
            openRunTab();
			this.gameRunningState(1);
			
			return;
			//this.stopAllSounds();
			this.canvas.style.cursor = '';
			
			this.game = game_1.GameRunner.constructApp(this.oldGame , this.game);
			this.game.scenes = this.scenes; 
			this.oldGame = null;
			this.scenes = null;
			
			this.stopAllSounds();
			
			//this.updateAppGUI();
			//this.appGui.open();
			this.appGui.domElement.style.pointerEvents = '';
			
			/* Editor.selected = Editor.lastSelected;
			
			Editor.eventViewModel.selectEntity(Editor.selected);
            Editor.propertiesGui.open();
			//Editor.propertiesViewModel.selectEntity(Editor.selected);
            Editor.eventViewModel.updateEventEditor();
			Editor.selectEntity(this.selected); */
			setTimeout(function(){Editor.update()},100);
        };
		EditorViewModel.prototype.centerEntity = function(newOne){
			var pos = this.camera.viewport;
			
			newOne.x = pos.left + this.canvas.width / 2 - newOne.width/2;
            newOne.y = pos.top + this.canvas.height / 2 - newOne.height/2;
			
			var p = this.camera.worldToScreen(newOne.x,newOne.y);
			Editor.canvas.parentElement.scrollTop = p.y
			Editor.canvas.parentElement.scrollLeft = p.x
		};
		EditorViewModel.prototype.createEntity = function(){
			return new entity_1.Entity();
		};
		EditorViewModel.prototype.copyEntity = function(){
			
			if (!this.selected)return;
           
		   var newEnt = entity_1.Entity.constructEntity(this.selected);
			this.clipboard = newEnt;
			
		};
		
		EditorViewModel.prototype.cutEntity = function(){
			
			if (!this.selected)return;
           
		   var newEnt = entity_1.Entity.constructEntity(this.selected);
		   this.clipboard = newEnt;
		   
		   this.removeSelectedEntity();
			
		};
		
		EditorViewModel.prototype.pasteEntity = function(){
			
			if (!this.clipboard) return;
           
		   var newEnt = entity_1.Entity.constructEntity(this.clipboard);
            newEnt.__guid = newEnt.__generateGUID();
			this.entityList.push(newEnt);
			
			mytree.children.push({id:newEnt.__guid ,content:newEnt.name,obj:newEnt});
			
			this.centerEntity(newEnt);
			
			this.selectEntity(newEnt);
			this.updateTree();
			
			Editor.update();
			
		};
        /**
         * Add a new sprite with default properties to the center of the screen.
         **/
        EditorViewModel.prototype.spawnEntity = function () {
            if (!this.game.isStopped())
                return;
            var newOne = new entity_1.Entity();
			//newOne.parent = this.scene;
			newOne.name = 'Entity' + this.entityIndex++;
            this.centerEntity(newOne);
			
            for (var _i = 0, _a = this.eventViewModel.eventFuncs; _i < _a.length; _i++) {
                var func = _a[_i];
				if(func.funcName == '__global')continue;
                newOne[func.funcName + "String"] = "";
            }
            this.entityList.push(newOne);
			//tree.insertItem( {id:newOne.__guid ,content:newOne.name}, scene.id );
			this.selectEntity(newOne);
			mytree.children.push({id:newOne.__guid ,content:newOne.name,obj:newOne});
			this.updateTree(true);
			
			
			
			Editor.update();
            return newOne;
        };
        EditorViewModel.prototype.deselectEntity = function () {
            this.selected = null;
            //this.dragging = null;
			
			Editor.update();
			Editor.updatePropertiesGui();
        };
        EditorViewModel.prototype.duplicateSelectedEntity = function () {
            if (!this.selected)
                return;
            var newEnt = entity_1.Entity.constructEntity(this.selected);
            newEnt.__guid = newEnt.__generateGUID();
			this.entityList.push(newEnt);
			
			mytree.children.push({id:newEnt.__guid ,content:newEnt.name,obj:newEnt});
			
			
			this.selectEntity(newEnt);
			this.updateTree();
			
			Editor.update();
            return newEnt;
        };
        /**
         * Remove the currently selected sprite.
         **/
        EditorViewModel.prototype.removeSelectedEntity = function () {
            if (!this.selected)
                return;
			
			var el = tree.getItem(Editor.selected.__guid);
			mytree.children.splice(mytree.children.indexOf(el.data),1)
			//this.updateTree();
			
            this.entityList.splice(this.entityList.indexOf(this.selected), 1);
            //this.deselectEntity();
			this.selectEntity(null);
			this.updateTree();
			Editor.update();
        };
		//Get game data
		EditorViewModel.prototype.getGameData = function(){
			
			var out = game_1.GameRunner.constructApp(this.game);
			out = JSON.stringify(out);
			out = JSON.parse(out);
			return out;
			
		};
		EditorViewModel.prototype.dataToHTML = function(out){
			
			var html = 
`<!doctype html>
<html class="no-js" lang="">
  <head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="application-name" content="`+out.name+`">
	<meta name="author" content="`+out.author+`">
	<meta name="version" content="`+out.version+`">
	<meta name="description" content="`+out.description+`">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<link rel="icon" href="favicon.ico" type="image/x-icon">

	<title>`+out.name+`</title>
	
	<link rel="stylesheet" type="text/css" href="css/style.css">
	
	<script  src="js/collision.js"></script>
	<script  src="js/keys.js"></script>
	<script  src="js/enums.js"></script>
	<script  src="js/ZICA.js"></script>
	<script  src="js/camera.js"></script>
	<script  src="js/scene.js"></script>
	<script  src="js/entity.js"></script>
	<script  src="js/game.js"></script>
	
  </head>

  <body ontouchstart="" onload="GameRunner.runGame();">
	  <canvas id="field" tabindex="1" ></canvas>`+
(out.showProgress?'\n	  <div id = "progress" class="progress-line"></div>':'')+`	
  </body>
</html>`;
			return html;
		};
		//Export android project as a zip package
		EditorViewModel.prototype.buildAndroid = function(e)
		{
			e.setAttribute('disabled','');
			e.previousElementSibling.src = Editor.asset.loading;
			Editor.log('Building android app...');
			
			 JSZipUtils.getBinaryContent("js/lib/build/android.zip", function(err, data) {
			  if(err) {
				throw err // or handle err
				Editor.error(err);
			  }

			  var zip = new JSZip();
			  zip.load(data);
			
			var out = game_1.GameRunner.constructApp(Editor.game);
			var data = JSON.stringify(out,null,'\n');
			
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			
			var html = Editor.dataToHTML(out);

			zip.file("bin/res/drawable-hdpi/ic_launcher.png", icon,{base64: true});
			zip.file("bin/res/drawable-mdpi/ic_launcher.png", icon,{base64: true});
			zip.file("bin/res/drawable-xhdpi/ic_launcher.png", icon,{base64: true});
			zip.file("bin/res/drawable-xxhdpi/ic_launcher.png", icon,{base64: true});
			
			//assets
			zip.file("bin/assets/index.html", html);
			zip.file("bin/assets/favicon.ico", icon,{base64: true});
			zip.file("bin/assets/Game.game", data);
			
			zip.folder("bin/assets/css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
			zip.folder("bin/assets/css").file("logo.gif", logo, {base64: true});
			
			//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
			zip.folder("bin/assets/js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
			zip.folder("bin/assets/js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
			zip.folder("bin/assets/js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
			zip.folder("bin/assets/js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
			zip.folder("bin/assets/js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
			
			zip.folder("bin/assets/js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
			zip.folder("bin/assets/js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
			zip.folder("bin/assets/js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));
			
			/*   // Your Web Application
			  zip.folder("app/").load(webAppZipBinary);
			  

			  // Your Logo
			  zip.file("app/icons/16.png", document.querySelector("[data-webdgapsize=f16]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/32.png", document.querySelector("[data-webdgapsize=f32]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/64.png", document.querySelector("[data-webdgapsize=f64]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/128.png", document.querySelector("[data-webdgapsize=f128]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/logo.png", document.querySelector("[data-webdgapimgload=webdgapimg]").src.split("base64,")[1],{base64: true});
			 */
			 
			  var config = {};
			  config.name = out.name;
			  config.version = out.version;
			  config.description = out.description;
			  config.author = out.author;
			  config.icon = 'bin/asset/favicon.ico';
		
			 /*  zip.file("config.ini",
			  '[apk]\n'+
			  'name='+ config.name +
			  '\nversion='+ config.version +
			  '\ndescription='+ config.description +
			  '\nauthor='+ config.author +
			  '\nicon='+ config.icon 
			  ); */
			   
			  zip.file("bin/package.json", JSON.stringify(config));
			  
			  // zip.file("index.html", '<!doctype html>\n<html>\n <head>\n    <title>'+ out.name +'</title>\n    <style>\n      iframe {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        overflow: visible;\n        border: 0;\n      }\n    </style>\n  </head>\n <body>\n    <iframe src="app/index.html"></iframe>\n  </body>\n</html>');
			  // zip.file("README", "If WebDGap was at all helpful for you. Would you consider donating to the project?\nhttps://www.paypal.com/cgi-bin/webscr?business=mikethedj4%40yahoo.com&cmd=_xclick&amount=5.0&item_name=Donation&currency_code=USD\n\n");

			  // Export your application
			   var content = zip.generate({type:"blob"});
			   
			   var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
							
				e.removeAttribute('disabled');
				e.previousElementSibling.src = Editor.asset.android;
				Editor.log('done');
			
			 });
			
		}
		//Export Mac project as a zip package
		EditorViewModel.prototype.buildLinux = function(e)
		{
			e.setAttribute('disabled','');
			e.previousElementSibling.src = Editor.asset.loading;
			Editor.log('Building linux app...');
			
			 JSZipUtils.getBinaryContent("js/lib/build/lin.zip", function(err, data1) {
			  if(err) {
				throw err // or handle err
				Editor.error(err);
			  }

			  var zip = new JSZip();
			
			var out = game_1.GameRunner.constructApp(Editor.game);
			var data = JSON.stringify(out,null,'\n');
			
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			
			var html = Editor.dataToHTML(out);
			
			var appName = zip.folder(out.name)
			appName.load(data1);
			//var zip = new JSZip();
			//zip.file("index.html", FileSystem.readFile("app/index.htm"));
			appName.file("app/index.html", html);
			appName.file("app/favicon.ico", icon,{base64: true});
			appName.file("app/Game.game", data);
			
			appName.folder("app/css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
			appName.folder("app/css").file("logo.gif", logo, {base64: true});
			
			//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
			appName.folder("app/js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
			appName.folder("app/js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
			appName.folder("app/js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
			appName.folder("app/js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
			appName.folder("app/js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
			
			appName.folder("app/js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
			appName.folder("app/js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
			appName.folder("app/js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));

			// Your Logo
			appName.file("app/icons/16.png", icon,{base64: true});
			appName.file("app/icons/32.png", icon,{base64: true});
			appName.file("app/icons/64.png", icon,{base64: true});
			appName.file("app/icons/128.png", icon,{base64: true});
			appName.file("app/icons/logo.png", logo,{base64: true});
			  
		    // Files for exported app
			  appName.file("package.json", '{\n  "main"  : "app/index.html",\n  "name"  : "'+ out.name +'",\n  "window": {\n      "toolbar" : false,\n      "icon"    : "app/icons/128.png",\n      "width"   : 1000,\n      "height"  : 600,\n      "position": "center"\n  }\n}');

			  zip.file("make.sh", "if [ -d ${HOME}/"+ out.name.replace(/ /g, "-") +" ]; then\n  typeset LP_FILE=${HOME}/"+ out.name.replace(/ /g, "-") +"/"+ out.name.replace(/ /g, "-") +".desktop\n\n  # Remove the target file if any\n  rm -f ${LP_FILE}\n  printf \"%s[Desktop Entry]\\nName="+ out.name +"\\nPath=${HOME}/"+ out.name.replace(/ /g, "-") +"\\nActions=sudo\\nExec=./"+ out.name.replace(/ /g, "-") +"/nw\\nIcon=${HOME}/"+ out.name.replace(/ /g, "-") +"/app/icons/128.png\\nTerminal=true\\nType=Application\\nStartupNotify=true > ${HOME}/"+ out.name.replace(/ /g, "-") +".desktop\" >> ${LP_FILE}\n\n  echo 'Your application and launcher are now located at ${HOME}/"+ out.name.replace(/ /g, "-") +"'\n  rm README.md\n  rm make.sh\n  cd ../\n  rmdir "+ out.name.replace(/ /g, "-") +"-linsite\n  cd ${HOME}/"+ out.name.replace(/ /g, "-") +"/\n  chmod 775 nw\nfi\n\nif [ ! -d ${HOME}/"+ out.name.replace(/ /g, "-") +" ]; then\n  mv "+ out.name.replace(/ /g, "-") +" ${HOME}\n\n  typeset LP_FILE=${HOME}/"+ out.name.replace(/ /g, "-") +"/"+ out.name.replace(/ /g, "-") +".desktop\n\n  # Remove the target file if any\n  rm -f ${LP_FILE}\n  printf \"%s[Desktop Entry]\\nName="+ out.name +"\\nPath=${HOME}/"+ out.name.replace(/ /g, "-") +"\\nActions=sudo\\nExec=./"+ out.name.replace(/ /g, "-") +"/nw\\nIcon=${HOME}/"+ out.name.replace(/ /g, "-") +"/app/icons/128.png\\nTerminal=true\\nType=Application\\nStartupNotify=true > ${HOME}/"+ out.name.replace(/ /g, "-") +".desktop\" >> ${LP_FILE}\n\n  echo 'Your application and launcher are now located at ${HOME}/"+ out.name.replace(/ /g, "-") +"'\n  rm README.md\n  rm make.sh\n  cd ../\n  rmdir "+ out.name.replace(/ /g, "-") +"-linsite\n  cd ${HOME}/"+ out.name.replace(/ /g, "-") +"/\n  chmod 775 nw\nfi\n\n# For Windows OS\n#if EXIST ${HOME}/"+ out.name.replace(/ /g, "-") +" (\n  #echo Yes\n#) ELSE (\n  #echo No\n#)\n");
			  zip.file("README.md", "### Instructions\n 1. Extract the `"+ out.name.replace(/ /g, "-") +"-linsite.zip` folder anywhere on your computer except the home folder. \n 2. Open a terminal and then navigate to "+ out.name.replace(/ /g, "-") +"'s directory and `run the make.sh file`.\n\n  **example**:\n  cd Downloads/"+ out.name.replace(/ /g, "-") +"-linsite\n\n 3. This will move the "+ out.name.replace(/ /g, "-") +" sibling folder and it's descendants to your home directory and create an application launcher.\n");

			  // Export your application
			   var content = zip.generate({type:"blob"});
			   
			   var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
							
				e.removeAttribute('disabled');
				e.previousElementSibling.src = Editor.asset.linux;
				Editor.log('done');
			
			 });
			
		};
		//Export Mac project as a zip package
		EditorViewModel.prototype.buildMac = function(e)
		{
			e.setAttribute('disabled','');
			e.previousElementSibling.src = Editor.asset.loading;
			Editor.log('Building mac app...');
			
			 JSZipUtils.getBinaryContent("js/lib/build/mac.zip", function(err, data) {
			  if(err) {
				throw err // or handle err
				Editor.error(err);
			  }

			  var zip = new JSZip();
			  zip.load(data);
			
			var out = game_1.GameRunner.constructApp(Editor.game);
			var data = JSON.stringify(out,null,'\n');
			
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			
			var html = Editor.dataToHTML(out);
					
			//var zip = new JSZip();
			//zip.file("index.html", FileSystem.readFile("app/index.htm"));
			zip.file("content/app/index.html", html);
			zip.file("content/app/favicon.ico", icon,{base64: true});
			zip.file("content/app/Game.game", data);
			
			zip.folder("content/app/css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
			zip.folder("content/app/css").file("logo.gif", logo, {base64: true});
			
			//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
			zip.folder("content/app/js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
			zip.folder("content/app/js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
			zip.folder("content/app/js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
			zip.folder("content/app/js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
			zip.folder("content/app/js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
			
			zip.folder("content/app/js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
			zip.folder("content/app/js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
			zip.folder("content/app/js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));
			
			  // Your Web Application
			  //zip.folder("app/").load(webAppZipBinary);

			  // Your Logo
			zip.file("content/app/icons/16.png", icon,{base64: true});
			zip.file("content/app/icons/32.png", icon,{base64: true});
			zip.file("content/app/icons/64.png", icon,{base64: true});
			zip.file("content/app/icons/128.png", icon,{base64: true});
			zip.file("content/app/icons/logo.png", logo,{base64: true});
			  
			  // For Mac Application
			  zip.file("package.json", '{\n  "main"  : "content/index.html",\n  "name"  : "'+ out.name +'",\n  "window": {\n    "toolbar"    : false\n  }\n}');
			  zip.file("content/index.html", '<!doctype html>\n<html>\n <head>\n    <title>'+ out.name +'</title>\n    <style>\n      iframe {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        overflow: visible;\n        border: 0;\n      }\n    </style>\n  </head>\n <body>\n    <iframe src="app/index.html"></iframe>\n\n    <script src="js/main.js"></script>\n  </body>\n</html>');
			  zip.file("content/js/main.js", 'document.addEventListener("DOMContentLoaded", function() {\n  // Load library\n  var gui = require("nw.gui");\n\n  // Reference to window\n  var win = gui.Window.get();\n\n  // Create menu container\n  var Menu = new gui.Menu({\n    type: "menubar"\n  });\n\n  //initialize default mac menu\n  Menu.createMacBuiltin("'+ out.name +'");\n\n  // Get the root menu from the default mac menu\n  var rootMenu = Menu.items[0].submenu;\n  var windowMenu = Menu.items[2].submenu;\n\n  // Append new item to root menu\n  windowMenu.insert(\n    new gui.MenuItem({\n      type: "normal",\n      label: "Toggle Fullscreen",\n      key: "F",\n      modifiers: "cmd",\n      click : function () {\n        win.toggleFullscreen();\n      }\n    })\n  );\n\n  windowMenu.insert(\n    new gui.MenuItem({\n      type: "normal",\n      label: "Reload App",\n      key: "r",\n      modifiers: "cmd",\n      click : function () {\n        win.reload();\n      }\n    })\n  );\n\n  // Remove About Node-Webkit\n  rootMenu.removeAt(0);\n\n  // Append Menu to Window\n  gui.Window.get().menu = Menu;\n});');
			  zip.file("run.sh", "open -a /Applications/"+ out.name.replace(/ /g, "") +".app/Contents/data/"+ out.name.replace(/ /g, "") +".app");
			  // zip.file("README", "If WebDGap was at all helpful for you. Would you consider donating to the project?\nhttps://www.paypal.com/cgi-bin/webscr?business=mikethedj4%40yahoo.com&cmd=_xclick&amount=5.0&item_name=Donation&currency_code=USD\n\n");

			  // Export your application
			   var content = zip.generate({type:"blob"});
			   
			   var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
							
				e.removeAttribute('disabled');
				e.previousElementSibling.src = Editor.asset.mac;
				Editor.log('done');
			
			 });
			
		};
		//Export windows project as a zip package
		EditorViewModel.prototype.buildWindows = function(e)
		{
			e.setAttribute('disabled','');
			e.previousElementSibling.src = Editor.asset.loading;
			Editor.log('Building window app...');
			
			 JSZipUtils.getBinaryContent("js/lib/build/win.zip", function(err, data) {
			  if(err) {
				throw err // or handle err
				Editor.error(err);
			  }

			  var zip = new JSZip();
			  zip.load(data);
			
			var out = game_1.GameRunner.constructApp(Editor.game);
			var data = JSON.stringify(out,null,'\n');
			
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			
			var html = Editor.dataToHTML(out);
					
			//var zip = new JSZip();
			//zip.file("index.html", FileSystem.readFile("app/index.htm"));
			zip.file("package.nw/app/index.html", html);
			zip.file("package.nw/app/favicon.ico", icon,{base64: true});
			zip.file("package.nw/app/Game.game", data);
			
			zip.folder("package.nw/app/css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
			zip.folder("package.nw/app/css").file("logo.gif", logo, {base64: true});
			
			//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
			zip.folder("package.nw/app/js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
			zip.folder("package.nw/app/js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
			zip.folder("package.nw/app/js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
			zip.folder("package.nw/app/js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
			zip.folder("package.nw/app/js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
			
			zip.folder("package.nw/app/js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
			zip.folder("package.nw/app/js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
			zip.folder("package.nw/app/js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));
			
			//zip.file(out.name+ ".exe", FileSystem.readFile("js/lib/build/nw.exe"),{binary:true});
			
			/*   // Your Web Application
			  zip.folder("app/").load(webAppZipBinary);
			  

			  // Your Logo
			  zip.file("app/icons/16.png", document.querySelector("[data-webdgapsize=f16]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/32.png", document.querySelector("[data-webdgapsize=f32]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/64.png", document.querySelector("[data-webdgapsize=f64]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/128.png", document.querySelector("[data-webdgapsize=f128]").src.split('base64,')[1],{base64: true});
			  zip.file("app/icons/logo.png", document.querySelector("[data-webdgapimgload=webdgapimg]").src.split("base64,")[1],{base64: true});
			 */
			 
			  // For 32bit Windows Application
			  var config = {};
			  config.main = 'app/index.html';
			  config.name = out.name;
			  config.version = out.version;
			  config.description = out.description;
			  config.author = out.author;
			  
			  config.window = {};
			  config.window.icon = 'app/favicon.ico';
			  config.window.position = 'center';
			  
			  zip.file("package.nw/package.json", JSON.stringify(config));
			  // zip.file("index.html", '<!doctype html>\n<html>\n <head>\n    <title>'+ out.name +'</title>\n    <style>\n      iframe {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        overflow: visible;\n        border: 0;\n      }\n    </style>\n  </head>\n <body>\n    <iframe src="app/index.html"></iframe>\n  </body>\n</html>');
			  // zip.file("README", "If WebDGap was at all helpful for you. Would you consider donating to the project?\nhttps://www.paypal.com/cgi-bin/webscr?business=mikethedj4%40yahoo.com&cmd=_xclick&amount=5.0&item_name=Donation&currency_code=USD\n\n");

			  // Export your application
			   var content = zip.generate({type:"blob"});
			   
			   var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
				
				e.removeAttribute('disabled');
				e.previousElementSibling.src = Editor.asset.windows;
				Editor.log('done');
			
			 });
			
		};
		
		//Export web project as a zip package
		EditorViewModel.prototype.buildChrome = function(e)
		{
			e.setAttribute('disabled','');
			e.previousElementSibling.src = Editor.asset.loading;
			Editor.log('Building chrome app...');
			
			var out = game_1.GameRunner.constructApp(this.game);
			var data = JSON.stringify(out,null,'\n');
			
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			
			var html = Editor.dataToHTML(out);

					
			var zip = new JSZip();
			var extension = !false;
			
			if(!extension)
			{
				
				zip.file("img/16.png", icon,{base64: true});
				zip.file("img/32.png", icon,{base64: true});
				zip.file("img/64.png", icon,{base64: true});
				zip.file("img/128.png", icon,{base64: true});
				zip.file("img/logo.png", logo,{base64: true});
				
				//zip.file("index.html", FileSystem.readFile("app/index.htm"));
				zip.file("html/app/index.html", html);
				zip.file("html/app/favicon.ico", icon,{base64: true});
				zip.file("html/app/Game.game", data);
				
				zip.folder("html/app/css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
				zip.folder("html/app/css").file("logo.gif", logo, {base64: true});
				
				//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
				zip.folder("html/app/js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
				zip.folder("html/app/js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
				zip.folder("html/app/js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
				zip.folder("html/app/js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
				zip.folder("html/app/js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
				
				zip.folder("html/app/js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
				zip.folder("html/app/js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
				zip.folder("html/app/js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));
				
				var audioCapture, videoCapture, storagePerm, setOffline, listPermissions;
				
				if (true) {
						audioCapture = ", \"audioCapture\"";
					  } else {
						audioCapture = "";
					  }
					  if (true) {
						videoCapture = ", \"videoCapture\"";
					  } else {
						videoCapture = "";
					  }
					  if (true) {
						storagePerm = ", \"storage\", \"fileSystem\", \"unlimitedStorage\"";
					  } else {
						storagePerm = "";
					  }
					  if ( true ) {
						setOffline = "\"offline_enabled\": true";
					  } else {
						setOffline = "\"offline_enabled\": false";
					  }
					  listPermissions = audioCapture + videoCapture + storagePerm;

				 // Files for exported app
					  zip.file("css/reset.css", "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n	margin: 0;\n	padding: 0;\n	border: 0;\n	font-size: 100%;\n	font: inherit;\n	vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n	display: block;\n}\nbody {\n	line-height: 1;\n}\nol, ul {\n	list-style: none;\n}\nblockquote, q {\n	quotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n	content: '';\n	content: none;\n}\ntable {\n	border-collapse: collapse;\n	border-spacing: 0;\n}");
					  zip.file("css/style.css", "webview, iframe {\n    width: 100vw;\n    height: 100vh;\n    border: 0;\n}");
					  zip.file("html/embed.html", "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>"+ out.name +"</title>\n    <link rel=\"stylesheet\" href=\"../css/reset.css\">\n    <link rel=\"stylesheet\" href=\"../css/style.css\">\n  </head>\n  <body>\n    <iframe src=\"app/index.html\">\n  </body>\n</html>");
					  zip.file("js/background.js", "/**\n * Listens for the app launching then creates the window\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function () {\n    runApp();\n});\n\n/**\n * Listens for the app restarting then re-creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n */\nchrome.app.runtime.onRestarted.addListener(function () {\n    runApp();\n});\n\n/**\n * Creates the window for the application.\n *\n * @see http://developer.chrome.com/apps/app.window.html\n */\nfunction runApp() {\n    // Creat a new Chrome app window\n    chrome.app.window.create('html/embed.html', {\"id\":\"embed\",\"frame\":{\"type\":\"chrome\"},\"innerBounds\":{\"width\":1180,\"height\":900}}, onWindowLoaded());\n}\n\n/**\n * Called before the contentWindow's onload event\n *\n * @see http://developer.chrome.com/apps/app.window.html\n */\nfunction onWindowLoaded(popup) {\n    return function (win) {\n        // On window loaded event\n        win.contentWindow.onload = function () {\n            // Get webview \n            var webview = win.contentWindow.document.getElementById('webview');\n\n            // Sign up for 'permissionrequest' event\n            webview.addEventListener('permissionrequest', function (e) {\n                // Allow all permission requests\n                e.request.allow();\n            });\n\n            // Sign up for 'newwindow' event\n            // Emitted when a target='_blank' link is clicked within the webview\n            webview.addEventListener('newwindow', function (e) {\n                // Popup?\n                if (e.initialWidth > 0 && e.initialHeight > 0) {\n                    // Open it in a popup window with a set width and height\n                    return chrome.app.window.create('html/embed.html', { frame: { type: 'chrome' }, innerBounds: { width: e.initialWidth, height: e.initialHeight } }, onWindowLoaded(e));\n                }\n\n                // Open the link in a new browser tab/window\n                win.contentWindow.open(e.targetUrl);\n            });\n\n            // Is this a popup window?\n            if (popup) {\n                // Override webview source with popup's target URL\n                webview.src = popup.targetUrl;\n            }\n        };\n    };\n}\n");
					  zip.file("manifest.json", "{\n   \"app\": {\n      \"background\": {\n         \"pages\": [ \"html/embed.html\" ],\n         \"scripts\": [ \"js/background.js\" ]\n      }\n   },\n   \"description\": \""+ out.description +"\",\n   \"icons\": {\n      \"128\": \"img/128.png\",\n      \"16\" : \"img/16.png\",\n      \"32\" : \"img/32.png\",\n      \"64\" : \"img/64.png\"\n   },\n   \"manifest_version\": 2,\n   \"name\": \""+ out.name +"\",\n   "+ setOffline +",\n   \"permissions\": [ \"http://*/\", \"https://*/\""+ listPermissions +" ],\n   \"version\": \""+ out.version +"\"\n}\n");
					  // zip.file("README", "If WebDGap was at all helpful for you. Would you consider donating to the project?\nhttps://www.paypal.com/cgi-bin/webscr?business=mikethedj4%40yahoo.com&cmd=_xclick&amount=5.0&item_name=Donation&currency_code=USD\n\n");
			}else{
				
				// Export Chrome Popup Extension
				zip.file("assets/16.png", icon,{base64: true});
				zip.file("assets/32.png", icon,{base64: true});
				zip.file("assets/64.png", icon,{base64: true});
				zip.file("assets/128.png", icon,{base64: true});
				zip.file("assets/logo.png", logo,{base64: true});
				
				//zip.file("index.html", FileSystem.readFile("app/index.htm"));
				zip.file("app/index.html", html);
				zip.file("app/favicon.ico", icon,{base64: true});
				zip.file("app/Game.game", data);
				
				zip.folder("app/css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
				zip.folder("app/css").file("logo.gif", logo, {base64: true});
				
				//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
				zip.folder("app/js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
				zip.folder("app/js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
				zip.folder("app/js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
				zip.folder("app/js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
				zip.folder("app/js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
				
				zip.folder("app/js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
				zip.folder("app/js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
				zip.folder("app/js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));
				
				
                  // For Chrome Extension
                  zip.file("background.js", "/**\n * Listens for the app launching, then creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function(launchData) {\n  chrome.app.window.create(\n    'index.html',\n    {\n      id: 'mainWindow',\n      innerBounds: {\n        'width': 800,\n        'height': 600\n      }\n    }\n  );\n});");
                  zip.file("css/style.css", "html, body {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n}\n\nbody {\n  min-width: 300px;\n  min-height: 420px;\n}\n\nwebview, iframe {\n  width: 100%;\n  height: 100%;\n  border: 0;\n}");
                  zip.file("index.html", "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ out.name +"</title>\n    <link rel=\"stylesheet\" href=\"css/style.css\" />\n  </head>\n  <body>\n    <iframe src=\"app/index.html\">\n      Your Chromebook does not support the iFrame html element.\n    </iframe>\n  </body>\n</html>");
                  zip.file("manifest.json", "{\n  \"manifest_version\": 2,\n  \"name\": \""+ out.name +"\",\n  \"short_name\": \""+ out.name +"\",\n  \"description\": \""+ out.description +"\",\n  \"version\": \""+ out.version +"\",\n  \"minimum_chrome_version\": \"38\",\n  \"permissions\": [ \"storage\", \"unlimitedStorage\", \"http://*/\", \"https://*/\" ],\n  \"icons\": {\n    \"16\": \"assets/16.png\",\n    \"32\": \"assets/32.png\",\n    \"64\": \"assets/64.png\",\n    \"128\": \"assets/128.png\"\n  },\n\n  \"browser_action\": {\n    \"default_icon\": \"assets/128.png\",\n    \"default_title\": \""+ out.name +"\",\n    \"default_popup\": \"index.html\"\n  },\n  \n  \"content_security_policy\": \"script-src 'self' 'unsafe-eval'; object-src 'self'\"\n}");
                  // zip.file("README", "If WebDGap was at all helpful for you. Would you consider donating to the project?\nhttps://www.paypal.com/cgi-bin/webscr?business=mikethedj4%40yahoo.com&cmd=_xclick&amount=5.0&item_name=Donation&currency_code=USD\n\n");

				
			}
			
			var content = zip.generate({type:"blob"});
			   
			   var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
				
				e.removeAttribute('disabled');
				e.previousElementSibling.src = Editor.asset.chrome;
				Editor.log('done');
		};
		
		//Export web project as a zip package
		EditorViewModel.prototype.buildWeb = function(e)
		{
			e.setAttribute('disabled','');
			e.previousElementSibling.src = Editor.asset.loading;
			Editor.log('Building web app...');
			
			var out = game_1.GameRunner.constructApp(this.game);
			var data = JSON.stringify(out,null,'\n');
			
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			
			var html = this.dataToHTML(out);
			
			var zip = new JSZip();
			//zip.file("index.html", FileSystem.readFile("app/index.htm"));
			zip.file("index.html", html);
			zip.file("favicon.ico", icon,{base64: true});
			zip.file("Game.game", data);
			
			zip.folder("css").file("style.css", FileSystem.readFile("js/lib/build/style.css"));
			zip.folder("css").file("logo.gif", logo, {base64: true});
			
			//zip.folder("js").file("editor.js", FileSystem.readFile("js/lib/build/editor.js"));
			zip.folder("js").file("game.js", FileSystem.readFile("js/lib/build/ZICA/game.js"));
			zip.folder("js").file("ZICA.js", FileSystem.readFile("js/lib/build/ZICA/ZICA.js"));
			zip.folder("js").file("scene.js", FileSystem.readFile("js/lib/build/ZICA/scene.js"));
			zip.folder("js").file("camera.js", FileSystem.readFile("js/lib/build/ZICA/camera.js"));
			zip.folder("js").file("entity.js", FileSystem.readFile("js/lib/build/ZICA/entity.js"));
			
			zip.folder("js").file("collision.js", FileSystem.readFile("js/lib/build/ZICA/collision.js"));
			zip.folder("js").file("enums.js", FileSystem.readFile("js/lib/build/ZICA/enums.js"));
			zip.folder("js").file("keys.js", FileSystem.readFile("js/lib/build/ZICA/keys.js"));
			
			//zip.folder("js").file("require-config.js", FileSystem.readFile("js/lib/build/require-config.js"));
			//zip.folder("js").folder("lib").file("knockout-3.4.2.js", FileSystem.readFile("js/lib/knockout-3.4.2.js"));
			//zip.folder("js").folder("lib").file("require.js", FileSystem.readFile("js/lib/require.js"));
			//zip.file("nunu.min.js", FileSystem.readFile("nunu.min.js"));
			
			/* var pson = new dcodeIO.PSON.StaticPair();
			var data = pson.toArrayBuffer(Editor.program.toJSON());

			zip.file("app.nsp", Base64Utils.fromArraybuffer(data), {base64: true});
			zip.file("logo.png", FileSystem.readFileBase64(Editor.RUNTIME_PATH + "logo.png"), {base64: true});
			zip.file("fullscreen.png", FileSystem.readFileBase64(Editor.RUNTIME_PATH + "fullscreen.png"), {base64: true});
			zip.file("vr.png", FileSystem.readFileBase64(Editor.RUNTIME_PATH + "vr.png"), {base64: true}); */
			
			var content = zip.generate({type:"blob"});
			   
			   var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
				
				e.removeAttribute('disabled');
				e.previousElementSibling.src = Editor.asset.web;
				Editor.log('done');
			/* zip.generateAsync({type:"blob"}).then(function(content)
			{
				
				var virtualLink = document.createElement("a");
				virtualLink.href = window.URL.createObjectURL(content);;
				virtualLink.download = 'Game.zip';
				virtualLink.dispatchEvent(new MouseEvent("click"));
				
			}); */
		};
		EditorViewModel.prototype.build = function () {
			
			var rawFile = new XMLHttpRequest();
			rawFile.open("POST", 'build.php', false);
			rawFile.onreadystatechange = function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						//hackily download the file by spoofing a click event to an invisible link
						var virtualLink = document.createElement("a");
						virtualLink.href = 'app/Game.zip';
						virtualLink.download = 'Game.zip';
						virtualLink.dispatchEvent(new MouseEvent("click"));
					
					}
				}
			}
			
			var out = game_1.GameRunner.constructApp(this.game);
			//var data = new Blob([JSON.stringify(out,null,'\n')], { type: "application/json" });
			var data = JSON.stringify(out,null,'\n');
			
			rawFile.send(data);	
			
		};
		
		EditorViewModel.prototype.build1 = function (el) {
		
			var rawFile = new XMLHttpRequest();
			rawFile.open("POST", 'build.php', false);
			rawFile.onreadystatechange = function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						this.el.style.display = '';
						this.el.previousElementSibling.src = Editor.asset.web;
						build_tab.content.style.pointerEvents = '';
						build_tab.tab.children[1].style.pointerEvents = '';
			
						//hackily download the file by spoofing a click event to an invisible link
						var virtualLink = document.createElement("a");
						virtualLink.href = 'app/Game.zip';
						virtualLink.download = 'Game.zip';
						virtualLink.dispatchEvent(new MouseEvent("click"));
					
					}
				}
			}
			
			var out = game_1.GameRunner.constructApp(this.game);
			//var data = new Blob([JSON.stringify(out,null,'\n')], { type: "application/json" });
			var data = JSON.stringify(out,null,'\n');
			
			rawFile.el = el;
			el.style.display = 'none';
			el.previousElementSibling.src = 'img/loading.gif';
			build_tab.content.style.pointerEvents='none';
			build_tab.tab.children[1].style.pointerEvents = 'none';
			
			
			//if(Game.icon != Editor.asset.icon)var
			var logo,icon;
			
			if(Game.logo)logo = Game.assets[Game.logo];
			else logo = Editor.asset.logo;
			
			if(Game.icon)icon = Game.assets[Game.icon];
			else icon = Editor.asset.icon;
			
			var logo = logo.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			var icon = icon.replace(/^data:image\/(png|jpg|gif);base64,/, "");
			rawFile.send(logo + 'replace_____separator' + icon + 'replace_____separator' + data);	
			
		};
		
		EditorViewModel.prototype.getBase64Image = function(img) {
			// Create an empty canvas element
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			// Copy the image contents to the canvas
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			// Get the data-URL formatted image
			// Firefox supports PNG and JPEG. You could check img.src to
			// guess the original format, but be aware the using "image/jpg"
			// will re-encode the image.
			var dataURL = canvas.toDataURL("image/png");

			return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");
		};
		
        /**
         * Prompt the user if they really want to delete everything, and then do so
         **/
        EditorViewModel.prototype.newProject = function () {
            if (run_tab || !confirm("Shell will clear everything. Did you save your work?"))
                return;
			
			this.scene = new scene_1.Scene();
			this.scene.name = 'Scene';
			this.scene.active = true;
			this.scene.color = 'rgba(255,255,255,1)';
			this.updateSceneGUI();
			
			this.game = new game_1.GameRunner(this.canvas); 
			Game = this.game;
			this.canvas.width = this.game.width;
			this.canvas.height = this.game.height;
			this.canvas.redraw();
			this.game.name = 'Game';
			this.game.version = '0.0.1';
			this.game.addScene(this.scene);
			this.game.icon = '';
			this.game.logo = '';
			this.updateAppGUI();
			
			this.scene.x = this.canvas.width/2;
			this.scene.y = this.canvas.height/2;
			this.camera = new Camera(this.drawContext);
			this.game.camera = this.camera;
			
            this.entityList = this.scene.children;//[];
            this.selected = null;
			this.entityIndex = 0;
			Editor.update();
            Editor.updatePropertiesGui();
			//this.propertiesViewModel.selectEntity(null);
            this.eventViewModel.selectEntity(null);
            this.eventViewModel.updateEventEditor();
			mytree.children.length = 0;
			this.updateTree();
			this.updateAsset();
			
        };
		/**
         * Show a file dialog for opening up a game project
         **/
        EditorViewModel.prototype.import = function () {
            if (!this.game.isStopped())
                return;
            //open file dialog
			this.fileDialog.accept = '.scene,.entity';
            this.fileDialog.click();
        };
		EditorViewModel.prototype.importPrefabs = function(data){
			
			if(data.isEntity){
			var newEnt = entity_1.Entity.constructEntity(data);
			newEnt.__guid = newEnt.__generateGUID();
			
			if(Editor.dropMouse){
			newEnt.x = Editor.dropMouse.x - newEnt.width/2;
			newEnt.y = Editor.dropMouse.y - newEnt.height/2;
			Editor.dropMouse = null;
			}else
				Editor.centerEntity(newEnt);
			
			Editor.entityList.push(newEnt);
			
			if(newEnt.imageData)
			if(newEnt.image && (newEnt.image in Game.assets)){
				Game.assets[newEnt.image] = newEnt.imageData;
				delete newEnt.imageData;
				Editor.updateImage(newEnt.image);//Ako vazi da mjenja svima slike
				Editor.updateAsset();
			}else{
				Game.assets[newEnt.image] = newEnt.imageData;
				delete newEnt.imageData;
				Editor.updateAsset();
			}
			
			if(newEnt.audioData)
			if(newEnt.audio && (newEnt.audio in Game.assets)){
				Game.assets[newEnt.audio] = newEnt.audioData;
				delete newEnt.audioData;
				Editor.updateAudio(newEnt.audio);//Ako vazi da mjenja svima slike
				Editor.updateAsset();
			}else{
				Game.assets[newEnt.audio] = newEnt.audioData;
				delete newEnt.audioData;
				Editor.updateAsset();
			}

			mytree.children.push({id:newEnt.__guid ,content:newEnt.name,obj:newEnt});
			
			
			Editor.selectEntity(newEnt);
			Editor.updateTree();
			
			Editor.update();
			//return;
		}
		if(data.isScene){
			
			var scene = scene_1.Scene.constructScene(data);
			Editor.game.addScene(scene);
			for(var i in scene.assets){
				if(i in Game.assets){
					Game.assets[i] = scene.assets[i];
					Editor.updateImage(i);
					Editor.updateAudio(i);
				}else
				Game.assets[i] = scene.assets[i];	
			}
			delete scene.assets;
			Editor.setScene(scene);
			Editor.updateAsset();
			//return;
		}
			
		};
        /**
         * Show a file dialog for opening up a game project
         **/
        EditorViewModel.prototype.openProject = function () {
            if (run_tab)
                return;
            //open file dialog
			this.fileDialog.value = '';
			this.fileDialog.accept = '.game';
            this.fileDialog.click();
        };
        /**
         * Download a file describing the game project in the JSON format.
         * Each entity's GUID gets removed, as that stuff shouldn't be saved with the project.
         * Shell means new ones will be created when the project is loaded back up again
         **/
        EditorViewModel.prototype.saveProject = function () {
            /* var out = { entityList: [] };
            //copy each entity so that we can remove their GUIDs
            for (var i = 0; i < this.entityList.length; i++) {
                var copied = entity_1.Entity.constructEntity(this.entityList[i]);
                delete copied.__guid;
                out.entityList.push(copied);
            } */
			// !!! EXPORT SCENE
			//var out = Scene.constructScene(Editor.scene);
            var out = game_1.GameRunner.constructApp(this.game);
			//out.asset = Editor.getAsset();
			
			var data = new Blob([JSON.stringify(out,null,'\n')], { type: "application/json" });
            //hackily download the file by spoofing a click event to an invisible link
            var virtualLink = document.createElement("a");
            virtualLink.setAttribute("download", this.game.name + ".game");
            virtualLink.href = URL.createObjectURL(data);
            virtualLink.dispatchEvent(new MouseEvent("click"));
        };
		EditorViewModel.prototype.shareToPrefabs = function () {
            //TODO
			var out,type;
			
			if(this.selected == null){
				out = scene_1.Scene.constructScene(Editor.scene);
				out.active = false;
				out.assets = {};
				if(out.image)out.assets[out.image] = Game.assets[out.image];
				if(out.map)out.assets[out.map] = Game.assets[out.map];
				for(var i = 0 ; i<= out.children.length-1;i++){
					if(out.children[i].image)out.assets[out.children[i].image] = Game.assets[out.children[i].image];
					if(out.children[i].audio)out.assets[out.children[i].audio] = Game.assets[out.children[i].audio];
				}	
				type = '.scene';
			}
			else{
				out = entity_1.Entity.constructEntity(this.selected);
				if(out.image) out.imageData = Game.assets[out.image];
				if(out.audio) out.audioData = Game.assets[out.audio];
				type = '.entity';
			}
			
			//var data = new Blob([JSON.stringify(out,null,'\n')], { type: "application/json" });
            var data = JSON.stringify(out,null,'\n');
			
			frames[1].ImageManager.dbHelper.CreateImage(out.name + type, data);
			prefabs_tab.click();
        };
        EditorViewModel.prototype.exportProject = function () {
            //TODO
			var out,type;
			
			if(this.selected == null){
				out = scene_1.Scene.constructScene(Editor.scene);
				out.active = false;
				out.assets = {};
				if(out.image)out.assets[out.image] = Game.assets[out.image];
				if(out.map)out.assets[out.map] = Game.assets[out.map];
				for(var i = 0 ; i<= out.children.length-1;i++){
					if(out.children[i].image)out.assets[out.children[i].image] = Game.assets[out.children[i].image];
					if(out.children[i].audio)out.assets[out.children[i].audio] = Game.assets[out.children[i].audio];
				}	
				type = '.scene';
			}
			else{
				out = entity_1.Entity.constructEntity(this.selected);
				if(out.image) out.imageData = Game.assets[out.image];
				if(out.audio) out.audioData = Game.assets[out.audio];
				type = '.entity';
			}
			
			var data = new Blob([JSON.stringify(out,null,'\n')], { type: "application/json" });
            //hackily download the file by spoofing a click event to an invisible link
            var virtualLink = document.createElement("a");
            virtualLink.setAttribute("download", out.name + type);
            virtualLink.href = URL.createObjectURL(data);
            virtualLink.dispatchEvent(new MouseEvent("click"));
        };
        /**
         * Called after the dialog opened through the open button closes
         **/
        EditorViewModel.prototype.onFileDialogClose = function (event) {
            var _this = this;
            //alias name for file dialog
            var dialog = this.fileDialog;
            //must have selected one file
            if (dialog.files.length > 0) {
                var reader = new FileReader();
                //set hook for when reader reads
                reader.onload = function () {
					
                    var data = JSON.parse(reader.result);
					if(data.type){
					
					_this.importPrefabs(data);
					return;
						
					}else
					game_1.GameRunner.constructApp(data,_this.game);
					//console.log(_this.game);
					_this.scene = _this.game.scene;
					var scene = _this.scene;
					
					Editor.updateSceneGUI();
					Editor.updateAppGUI(true);
					Editor.updateAsset();
					
                    _this.entityList = scene.children;
					
					mytree.children.length = 0;
					for (var _i = 0, _a = _this.entityList; _i < _a.length; _i++){
						var ent = _a[_i];
						mytree.children.push({id:ent.__guid ,content:ent.name,obj:ent});
					}
                    
					//for every entity, compile its functions and make sure they're BaseEntities;
                    /* for (var _i = 0, _a = data.entityList; _i < _a.length; _i++) {
                        var ent = _a[_i];
						ent = entity_1.Entity.constructEntity(ent);
                        _this.entityList.push(ent);
						mytree.children.push({id:ent.__guid ,content:ent.name,obj:ent});
				   } */
				   
                    //reset some editor stuff
                    _this.selected = null;
					//Editor.update();
					Editor.updatePropertiesGui();
                    
                    _this.eventViewModel.selectEntity(null);
                    _this.eventViewModel.updateEventEditor();
					
					Editor.updateTree();
					Editor.canvas.redraw();
					Editor.update();
                };
                //read the selected file
                reader.readAsText(dialog.files[0]);
                dialog.value = null;
            }
        };
        /**
         * Handle mouse down events:
         *   - Selecting an entity
         *   - Beginning to drag an entity
         **/
        EditorViewModel.prototype.onCanvasMouseUp = function (event, data) {
            if(event.which != 1)return;
			
			if (!this.game.isStopped() || App.instance.tool.isMoved )
                return;
			var mouse = Mouse.get(event);
			mouse = this.camera.screenToWorld(mouse.x,mouse.y);
            //var mouse = { x: event.pageX, y: event.pageY };
            var lastSelected = this.selected;
            this.selected = null;
			App.instance.displayList.length = 0;
			Editor.update();
			
            //check through every entity and see if we're clicking on it
            for (var i = this.entityList.length - 1; i >= 0; i--) {
                if (this.pointInBox(mouse, this.entityList[i])) {
                   // this.dragging = this.entityList[i];
                    this.lastMouse = mouse;
					if(this.entityList[i].locked)continue;
                    this.selected = this.entityList[i];	
					App.instance.displayList[0] = new Enity(this.selected);
					App.instance.select();
					App.instance.tool.draw();
                    break;
                }
            }
            if (lastSelected != this.selected) {
                this.eventViewModel.selectEntity(this.selected);
                this.eventViewModel.updateEventEditor();
                
				this.updatePropertiesGui();
				this.updateTree();
				//if(this.selected)
				
			}
            //save last mouse position so that it can be used to detect dragging
            this.lastMouse = mouse;
        };
        /**
         * If the user releases the mouse, they are no longer dragging an entity
         **/
        EditorViewModel.prototype.onCanvasMouseDown = function (event) {
            if (!this.game.isStopped())
                return;
            //this.dragging = null;
        };
        /**
         * At the moment, this hook only handles dragging entities around the canvas.
         **/
        EditorViewModel.prototype.onCanvasMouseMove = function (event) {
           
		/* if(Editor.snapToGrid && Editor.selected && App.instance.tool.isMoved){

			var size = Editor.settings.Editor.gridSize;
			var x = Editor.selected.x;
			var y = Editor.selected.y;
			
			x = Math.floor(x/size)*size;
			y = Math.floor(y/size)*size;
			
			Editor.selected.x = x;
			Editor.selected.y = y;
			
			Editor.pupdate();
		
		} */
		   //if(event.witch == 0)this.dragging = false;
		   //else this.dragging = true;
		   
			/* if (!this.game.isStopped())
                return;
            var mouse = { x: event.clientX, y: event.clientY };
            if (this.dragging) {
                this.dragging.x += mouse.x - this.lastMouse.x;
                this.dragging.y += mouse.y - this.lastMouse.y;
                this.propertiesViewModel.updateProperties();
            }
            this.lastMouse = mouse; */
        };
        EditorViewModel.prototype.onCanvasKeyDown = function (event) {
            if (this.game.isStopped() && event.which == keys_1.Keys.delete) {
                event.preventDefault();
                this.removeSelectedEntity();
            }
        };
        /**
         * Intercept application-wide keyboard shortcut events
         **/
        EditorViewModel.prototype.onWindowKeyDown = function (event) {
            if (event.which == keys_1.Keys.s && event.ctrlKey) {
                event.preventDefault();
                this.saveProject();
            }
            else if (event.which == keys_1.Keys.o && event.ctrlKey) {
                event.preventDefault();
                this.openProject();
            }
            else if (event.which == keys_1.Keys.d && event.ctrlKey) {
                event.preventDefault();
                this.duplicateSelectedEntity();
            }
        };
        /**
         * Resize the canvas so that it always properly fills the screen space available
         **/
        EditorViewModel.prototype.onWindowResize = function (event) {
            //this.canvas.width = this.canvas.parentElement.clientWidth;
            //this.canvas.height = this.canvas.parentElement.clientHeight;
			Editor.update();
        };
        /**
         * Confirm the user really wants to leave the page before letting them
         **/
        EditorViewModel.prototype.onWindowUnload = function (event) {
           
			localStorage.setItem('settings',JSON.stringify(this.settings));
			
			event.returnValue = "Any unsaved progress will be lost. Are you sure you want to leave?";
            return event.returnValue;
        };
        return EditorViewModel;
    }());
    exports.EditorViewModel = EditorViewModel;
});