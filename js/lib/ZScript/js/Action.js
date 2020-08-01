	const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
		const hex = x.toString(16)
			return hex.length === 1 ? '0' + hex : hex
		}).join('');
		
	const hexToRgb = hex =>
	  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
				 ,(m, r, g, b) => '#' + r + r + g + g + b + b)
		.substring(1).match(/.{2}/g)
		.map(x => parseInt(x, 16));
		
	function rgb(rgb){
		
		var i = rgb.includes('rgba')?5:4;
		var c =  rgb.substring(i, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
		 
		 c[0] = Number(c[0]);
		 c[1] = Number(c[1]);
		 c[2] = Number(c[2]);
		 
		 if(c[3]) c[3] = Number(c[3]);
		 else c[3] = 1;
		
		 
		 return c;

	}
			
	
	var comboProps = {
		'borderStyle':['solid','dashed'],
		'position':['absoulte','fixed']
	};	
	
	var properties = ["name","x","y","width","height","angle","visible","drawImage","aspectRatio","image","loop","muted","autoplay","volume","audio","text","font","fontSize","fontBold","fontItalic","fontColor","velX","velY","opacity","drawColor","color","priority","collides","drawBorder","borderColor","borderWidth","borderStyle","animLoop","fps","position","X","Y"];
	var types = {};
	
	types.combo = ['borderStyle','position'];
	types.audio = ['audio'];
	types.image = ['image'];
	types.slider = ['opacity','volume'];
	types.string = ['name','text','font'];
	types.float = ['x','y','width','height','velX','velY','borderWidth','X','Y'];
	types.int = ['angle','fontSize','priority','fps'];
	types.bool = ['visible','drawImage','aspectRatio','loop','muted','autoplay','fontBold','fontItalic','drawColor','collides','drawBorder','animLoop'];
	types.color = ['color','fontColor','borderColor'];
	
	function getType(p){
		
		for(var i in types)
			if(Array.isArray(types[i]))
				if(types[i].includes(p))
					return i;
				
		return 'hidden';
	}
	//types.image = ['image'];
	//types.audio = ['audio'];
	
	var Actions = [
	/* 	{
			jsname : 'flyAlongCircle',
			name: 'fly Along Circle',
			description : 'example of behavior',
			'Center': [ 'vect3d' , '[0.0, 0.0, 0.0]'],
			'Direction': [ 'vect3d' , '[0.0, 1.0, 0.0]'],
			'Radius' : [ 'int' , '500'],
			'Speed' : ['float' , '0.001'],
			'useGravity' : ['bool','true'],
			'circleColor' : ['color','ff0000'],
			'littleText' : ['string' , 'Sreten Buljbasic'],
			'onClick': ['action' , []]
		}, */
		
		{
			jsname : 'MakeSceneNodeInvisible', 
			name: 'Hide or Unhide a Scene node',
			description : 'Makes a 2D scene node visible or invisible.',
			'InvisibleMakeType' : ['combo', 'Toggle Visiblilty', ['Make Visible' , 'Make Invisible' , 'Toggle Visiblilty']],
			'SceneNodeToMakeInvisible': [ 'node' , ''],
		},
		[
			'Change Position of a Scene node',
			
		{
			jsname : 'ChangeSceneNodePosition', 
			name: 'Set fixsed 2D Position',
			description : 'Lets a 2D scene node change its position.',
			'PositionChangeType': ['hidden', '0' ],
			'SceneNodeToChangePosition': [ 'node' , ''],
			'Position': [ 'vect2d' , '[0.0, 0.0]'] ,
			'UseAnimatedMovement': [ 'bool' , false],
			'TimeNeededForMovementMs': [ 'int' , '1000']	
		},
		
		{
			jsname : 'ChangeSceneNodePosition', 
			name: 'Move by a Vector',
			description : 'Lets a 2D scene node change its position.',
			'PositionChangeType': ['hidden', '1' ],
			'SceneNodeToChangePosition': [ 'node' , ''],
			'Vector': [ 'vect2d' , '[0.0, 0.0]'] ,
			'UseAnimatedMovement': [ 'bool' , false],
			'TimeNeededForMovementMs': [ 'int' , '1000'] 	
		},
		
		{
			jsname : 'ChangeSceneNodePosition', 
			name: 'Set relative to scene node',
			description : 'Lets a 2D scene node change its position.',
			'PositionChangeType': ['hidden', '2' ],
			'SceneNodeToChangePosition': [ 'node' , ''],
			'Position': [ 'vect2d' , '[0.0, 0.0]'],
			'SceneNodeRelativeTo': [ 'node' , ''] ,
			'UseAnimatedMovement': [ 'bool' , false],
			'TimeNeededForMovementMs': [ 'int' , '1000']	
		},
		
		{
			jsname : 'ChangeSceneNodePosition', 
			name: 'Set relative to scene node by percentage',
			description : 'Lets a 2D scene node change its position.',
			'PositionChangeType': ['hidden', '3' ],
			'SceneNodeToChangePosition': [ 'node' , ''],
			'Percentage': [ 'vect2d' , '[0.0, 0.0]'],
			'SceneNodeRelativeTo': [ 'node' , ''] ,
			'UseAnimatedMovement': [ 'bool' , false],
			'TimeNeededForMovementMs': [ 'int' , '1000']
		},
		
		{
			jsname : 'ChangeSceneNodePosition', 
			name: 'Set to random position in area',
			description : 'Lets a 2D scene node change its position.',
			'PositionChangeType': ['hidden', '4' ],
			'SceneNodeToChangePosition': [ 'node' , ''],
			'MinPosition': [ 'vect2d' , '[0.0, 0.0]'],
			'MaxPosition': [ 'vect2d' , '[0.0, 0.0]'],
			'UseAnimatedMovement': [ 'bool' , false],
			'TimeNeededForMovementMs': [ 'int' , '1000']	
		},
		
		{
			jsname : 'ChangeSceneNodePosition', 
			name: 'Set to last mouse position',
			description : 'Lets a 2D scene node change its position.',
			'PositionChangeType': ['hidden', '5' ],
			'SceneNodeToChangePosition': [ 'node' , ''],
			'UseAnimatedMovement': [ 'bool' , false],
			'TimeNeededForMovementMs': [ 'int' , '1000']	
		}
		
		
		],
			
		{
			jsname : 'ChangeSceneNodeRotation', 
			name: 'Change Rotation of a Scene node',
			description : 'Lets a 2D scene node change its rotation. Based on the settings set, it is possible to set it to a new fixed 2d rotation or rotate it a bit relative to the current rotation.',
			'RotationChangeType': ['combo', 'Set absoulte rotation' , ['Set absoulte rotation' , 'Rotate by the rotation'] ],
			'SceneNodeToChangeRotation': [ 'node' , ''],
			'Angle': [ 'int' , '0'],
			'RotateAnimated': [ 'bool' , false],
			'TimeNeededForRotationMs': [ 'int' , '1000']	
		},
		
		{
			jsname : 'ChangeSceneNodeScale', 
			name: 'Change Scale of a Scene node	',
			description : 'Lets a 2D scene node change its scale. Based on the settings set, it is possible to set it to a new fixed 2d scale or scale it a bit relative to the current scale.',
			'ScaleChangeType': ['combo', 'Set absoulte scale' , ['Set absoulte scale' ,'Set relative scale', 'Scale by the vector'] ],
			'SceneNodeToChangeScale': [ 'node' , ''],
			'Size': [ 'vect2d' , '[0.0, 0.0]'],
		},
		
		{
			jsname : 'SetSceneNodeAnimation', 
			name: 'Set Animation of a Scene node	',
			description : 'Makes it possible to change the current animation of an scene node to a new one.',
			'SceneNodeToChangeAnim': [ 'node' , ''],
			'AnimName': [ 'animation' , ''],
			'Loop': [ 'bool' , false]
		},
		
		[
			'Change Properties of a Scene node',
			
			{
			name: 'Change a property',
			jsname : 'ChangeSceneNodeProperty',
			description : 'Changes the property of the 2D object',
			'SceneNodeToChange': [ 'node' , ''],
			'Property' : ['propcombo', 'image', properties],
			'Value': [ 'image' , '']	
			},
			
			{
			name: 'Set a property from other node',
			jsname : 'ChangeSceneNodePropertyFromNode',
			description : 'Changes the property of the 2D object from other node',
			'SceneNodeToChange': [ 'node' , ''],
			'Property' : ['combo', 'image', properties],
			'SceneNodeFrom': [ 'node' , ''],
			},
			
			{
			name: 'Set a property from Variable',
			jsname : 'ChangeSceneNodePropertyVariable',
			description : 'Changes the property of the 2D object from variable',
			'SceneNodeToChange': [ 'node' , ''],
			'Property' : ['combo', 'image', properties],
			'Variable': [ 'string' , '']
			}
			
		],
		
		[
			'Cameras and Scenes',
			
			{	
			name: 'Switch to another scene',
			jsname : 'SwitchToScene',
			description : 'Changes the active scene or restart it',
			'Scene': [ 'scene' , ''],
			'SceneId':['hidden',0],
			'ResetScene': [ 'bool' , false]
			},
			
			{	
			name: 'Restart current scene',
			jsname : 'RestartScene',
			description : 'Restart current scene',
			none:['hidden','']
			}
			
		],
		
		[
			'Game and Sound',
			
		{	
			name: 'Play or Stop Sound',
			jsname : 'ActionPlaySound',
			description : 'Play ,stop or toggle scne node sound',
			'SceneNodeToPlay': [ 'node' , ''],
			'Mode' : ['combo', 'Play Audio', ['Play Audio','Stop Audio','Toggle Audio']]
		},
		
		{	
			name: 'Resume or Pause Sound',
			jsname : 'ActionResumeSound',
			description : 'Resume ,pause or toggle scne node sound',
			'SceneNodeToPlay': [ 'node' , ''],
			'Mode' : ['combo', 'Resume Audio', ['Resume Audio','Pause Audio','Toggle Audio']]
		},
		
		{	
			name: 'Stop all Sounds',
			jsname : 'ActionStopSound',
			description : 'Stop all sounds',
			none:['hidden','']
		},
		
		{	
			name: 'Delete a scene node',
			jsname : 'ActionDeleteSceneNode',
			description : 'Delete a scene node',
			'SceneNodeToDelete': [ 'node' , '']
		},
		
		{	
			name: 'Clone a scene node',
			jsname : 'ActionCloneSceneNode',
			description : 'Clone a scene node and do something whit him',
			'SceneNodeToClone': [ 'node' , ''],
			'ActionToDoWhitClone': [ 'action' , []]
			
		},
		
		{	
			name: 'Restart Behaviors of a scene node',
			jsname : 'RestartBehaviors',
			description : 'Restart Behaviors of a scene node',
			'SceneNodeToRestart': [ 'node' , '']
		}

		],
		
		[
			'Variables and Network',
		
		{	
			name: 'Set or change a variable',
			jsname : 'SetOrChangeAVariable',
			description : 'Set or change a variable',
			'VariableName': [ 'string' , ''],
			'Operation': ['combo', 'Set(=)', ['Set(=)','Add(+)','Substract(-)','Divide(/)','Divide INT(/)','Multiply(*)','Multiply INT(*)']],
			'ValueType': ['combo', 'Value', ['Value','Variable']],
			'Value': [ 'string' , '']
			// MORA SE DODATI I DRUGI NODE
		},
		
		{	
			name: 'If Variable has a value do something',
			jsname : 'IfVariable',
			description : 'If - Else block',
			'VariableName': [ 'string' , ''],
			'ComparisonType': ['combo', 'Is equal to (=)', ['Is equal to (=)','Is not equal to (<>)','Is bigger than (>)','Is smaller than (<)']],
			'ValueType': ['combo', 'Value', ['Value','Variable']],
			'Value': [ 'string' , '1'], //chek types
			'Action': [ 'action' , []],
			'Else': [ 'action' , []]
		},
		
		{	
			name: 'Store or Load variable from disk',
			jsname : 'ActionStoreLoadVariable',
			description : 'Store or Load variable from disk',
			'VariableName': [ 'string' , ''],
			'Load': ['combo', 'Load Variable', ['Load Variable','Save Variable']]
		}
		
		],
		
		[
			'Special',
			
			{	
			name: 'Open website',
			jsname : 'OpenWebpage',
			description : 'Open link',
			'Webpage': [ 'string' , 'http://'],
			'Target': ['combo', '_blank', ['_blank','_self','_top','_parent']],
			},
			
			{
			jsname : 'ExecuteJavaScript',
			name: 'Execute Java Script',
			description : 'Execute java script',
			'JavaScript': [ 'textarea' , '']
			},
			
			{
			jsname : 'ExitApplication',
			name: 'Exit application',
			description : 'Exit application',
			none:['hidden','']
			},
			
			{
			jsname : 'ActionPlayMovie',
			name: 'Set Video to stream',
			description : 'Plays a video, in 2D entity',
			'VideoFileName': [ 'string' , ''],
			'SceneNodeToPlayAt': [ 'node' , ''],
			'PlayLooped': [ 'bool' , false],
			'AutoPlay' : [ 'bool' , true]
			
			},
			
			{
			jsname : 'ActionVideoCommand',
			name: 'Video Command',
			description : 'Play, pause or stop video',
			'SceneNodeToChange': [ 'node' , ''],
			'Command' : ['combo', 'Play', ['Play','Pause','Stop']]
			}
			
		]
		
		/* {
			name: 'Change a texture',
			jsname : 'ChangeSceneNodeTexture',
			description : 'Changes the texture of the 2D object this behavior is attached to',
			'SceneNodeToChange': [ 'node' , ''],
			'TextureChangeType' : ['combo', 'Change all textures', ['Change material whit index','Change all textures']],
			'Index': [ 'int' , '0'],
			'Texture': [ 'texture' , '']	
		}, */
		
		
		
	];
	
	//call the init to setup 
		LiteGUI.init();

		//create a main container and split it in two
		var mainarea = new LiteGUI.Area("mainarea",{content_id:"canvasarea", autoresize: true, inmediateResize: true});
		mainarea.split("horizontal",[200,null], true);
		LiteGUI.add( mainarea );

		//create a left panel
		var side_panel = new LiteGUI.Panel("sidepanel",{title:"Action Manager", width: 200});
		mainarea.getSection(0).add( side_panel );


		
		function createBeh(e,flag){
			
			//var beh  = document.createElement('button');
			//beh.style.width = '100%';
			
			var beh = LiteGUI.createButton();
				beh.style.width = '99%'
				beh.style.margin = '1px';
			
			if(!flag){
				
				beh.data = getBehByName(this.textContent);
				//console.log(beh.data);
				beh.textContent  = this.textContent;
				
			}else{
					beh.data  = flag;
					beh.textContent = flag.name;
				
			}
				
				beh.onclick = function(){
					for(var i=0; i<= this.parentElement.children.length-1; i++)this.parentElement.children[i].removeAttribute('disabled');
					this.setAttribute('disabled','');
					selected = this;
					//main_panel.header.textContent = this.textContent;
					
					main_panel.content.innerHTML = '';
					
					var widgets = new LiteGUI.Inspector();
					
					widgets.addInfo('Name', selected.data.name);
					widgets.addTextarea('Descrption',selected.data.description,{'disabled':true , height: 100});
					
					widgets.addSeparator();
					
					var dataCount = 0;
					
					for(var i in selected.data){
					
					
						if(Array.isArray(selected.data[i])){
							
							dataCount++;
							
							switch(selected.data[i][0]){
								
								case 'textarea':
								//widgets.('Descrption',selected.data.description,{'disabled':true , height: 100});
								var a = widgets.addTextarea(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v}});
								var tx = a.querySelector('textarea');
								tx.style.resize = 'vertical';
								
								tx.onfocus = function(e){
								  this.style.height = 'auto';
								  this.style.height = (this.scrollHeight) + 'px';
								}
								
								tx.oninput = function(e){
								  this.style.height = 'auto';
								  this.style.height = (this.scrollHeight) + 'px';
								}
										
								break;
								
								case 'combo':
								
								widgets.addCombo(i,selected.data[i][1],{values:selected.data[i][2],callback: function(v){selected.data[this.name][1] = v}});
						
								break;
								
								case 'propcombo':
								
								widgets.addCombo(i,selected.data[i][1],{values:selected.data[i][2],callback: function(v){
									selected.data[this.name][1] = v;
									var sel = top.parent.Editor.selected || top.parent.Editor.scene;
									selected.data['Value'][0] = getType(v);
									selected.data['Value'][1] = sel[v];
									
									if(getType(v) == 'combo')
									selected.data['Value'][2] = comboProps[v].slice();
							
									selected.removeAttribute('disabled');
									selected.click();
								}});
						
								break;
								
								case 'int':
								
								widgets.addNumber(i, selected.data[i][1] , {precision:0 , callback:function(v) {selected.data[this.textContent][1] = v}});
						
								break;
								
								case 'float':
								
								widgets.addNumber(i, selected.data[i][1],{precision:1 , callback:function(v) {selected.data[this.textContent][1] = v}});
							
								break;
								
								case 'slider':
								
								widgets.addSlider(i, selected.data[i][1],{precision:1,min:0,max:1 , callback:function(v) {
									
									var a = this.textContent.trim();
									selected.data[a][1] = v;
								
								}});
							
								break;
								
								case 'string':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v}});
							
								break;
								
								case 'scene':									
									
									var index = selected.data['SceneId'][1];
									var Game = top.Game;
									var sce = Game.getScene(index)?Game.getScene(index).name:0;
									
									var scenes = [];
									//scenes.push('');
									
									for(var _i in top.Game.scenes){
										
										var x = top.Game.scenes[_i];
										
										scenes.push(x.name);
									}
									
									/* if(!scenes.indexOf(sce) && sce != ''){
										err = true;
										scenes.push(sce);
									} */
									
									var e = widgets.addCombo(i,sce,{values:scenes,callback: function(v,v1){
										selected.data[this.name][1] = v;
										var sel = this.querySelector('select');
										var index = sel.selectedIndex;
										selected.data['SceneId'][1] = index;
										//this.querySelector('select').style.border = 'none';
									}});
									//if(err)e.querySelector('select').style.border = '1px solid red';
								break;
								case 'animation':									
									
									var anim = selected.data[i][1];
									
									var animations = [];
									
									animations.push('');
									
									for(var _i in top.Editor.selected.animations){
	
											animations.push(_i);
									}
								
									/* if(audios.indexOf(aud)){
										err = true;
										audios.push(aud);
									} */
										
									
									var e = widgets.addCombo(i,anim,{values:animations,callback: function(v){
										selected.data[this.name][1] = v;
										//this.querySelector('select').style.border = 'none';
									}});
									//if(err)e.querySelector('select').style.border = '1px solid red';
									break;
								case 'audio':									
									
									var aud = selected.data[i][1];
									
									var audios = [];
									
									audios.push('');
									
									for(var _i in top.Game.assets){
										
										var type = top.frames[0].ImageManager.HTMLBuilder.getType(_i);
										if(type == 'Audio')
											audios.push(_i);
									}
								
									/* if(audios.indexOf(aud)){
										err = true;
										audios.push(aud);
									} */
										
									
									var e = widgets.addCombo(i,aud,{values:audios,callback: function(v){
										selected.data[this.name][1] = v;
										//this.querySelector('select').style.border = 'none';
									}});
									//if(err)e.querySelector('select').style.border = '1px solid red';
									break;
								
								case 'image':									
										
										var img = selected.data[i][1];
										var err = false;
										
										if(img)
										if(!(img in top.Game.assets))err = true;
										
								var e = widgets.addStringButton(i,selected.data[i][1], { callback_button: function(v) {
									
									var self = this;
									//var a = LiteGUI.alert();
									//window.dialog = a;
									
									var a = new LiteGUI.Dialog({ id: 'selector', title:'Select image', close: true, minimize: false,  scroll: false, resizable:false, draggable: false, detachable: false });
									a.content.parentElement.style.width = '90%';
									a.content.parentElement.style.height = '90%';
									a.show('fade');
									a.makeModal();
									window.dialog = a;
									
									//a.content.parentElement.firstChild.innerHTML = 'Select entity';
									//a.content.parentElement.firstChild.style.height = '30px';
									
									var x = top.frames[0].document.querySelectorAll('li');
									
									var stl = a.content.style;
									
									stl.display = 'flex';
									stl.flexWrap = 'wrap';
									stl.justifyContent = 'center';//'space-between';
									stl.margin = 'auto';
									stl.listStyle = 'none';
									
									var el = document.createElement('li');
									el.style.width = '100px';
									el.style.height = '100px';
									el.style.margin = '5px';
									el.style.padding = '0px';
									el.style.border = '1px solid white';
									el.style.background = 'url(imgs/empty.png)';
									el.onmouseover = function(e){this.style.opacity = '0.5'};
									el.onmouseout = function(e){this.style.opacity = '1'}
									el.onclick = function(e){
									
										self.setValue('');
										selected.data[self.name][1] = '';
										self.querySelector('input').style.border = 'none';
							
										a.close();
									
									}
									a.content.appendChild(el);
									
									for(var  i in x){
										
										var el = x[i];
										
										if(el.style){
										
										el = el.cloneNode(true);
										
										el.style.width = '100px';
										el.style.height = '100px';
										el.style.margin = '5px';
										el.style.padding = '0px';
										el.style.border = '1px solid white';
										
										el.style.cursor = 'pointer';
										el.onmouseover = function(e){this.style.opacity = '0.5'};
										el.onmouseout = function(e){this.style.opacity = '1'}
										el.onclick = function(e){
											
											var name = this.querySelector('.imgName').innerHTML;
											if(!name)name = '';
											
											self.setValue(name);
											selected.data[self.name][1] = name;
											self.querySelector('input').style.border = 'none';
											
											a.close();
										
										}
										var name = el.querySelector('.imgName');
										name.style.display = 'none';
										
										var type = top.frames[0].ImageManager.HTMLBuilder.getType(name.innerHTML);
										
										if(type == 'Image')
										a.content.appendChild(el);
										}
									}
												
									//a.content.appendChild(x)
									a.content.style.overflow = 'auto';
									a.content.style.height = '90%';


								}});
								e.querySelector('input').readOnly = true;
								e.querySelector('input').placeholder = 'none';
								if(err)e.querySelector('input').style.border = '1px solid red';
								break;
								
								case 'texture':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v}});
							
								break;
								
								case 'node1':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v}});
							
								break;
								
								case 'vect3d':
								
								widgets.addVector3(i, JSON.parse(selected.data[i][1]),{precision:2  , callback:function(v) {selected.data[this.textContent][1] = JSON.stringify(v)}});
							
								break;
								
								case 'vect2d':
								
								widgets.addVector2(i, JSON.parse(selected.data[i][1]),{precision:2  , callback:function(v) {selected.data[this.textContent][1] = JSON.stringify(v)}});
							
								break;
								
								case 'bool':
								
								widgets.addCheckbox(i, selected.data[i][1], {callback:function(v) {selected.data[this.children[0].textContent][1] = v}});
							
								break;
								
								case 'color':
								
								var col = selected.data[i][1];
								//console.log(col);
								
								if(col.includes('rgb'))col = rgb(col);
								else
								 col = hexToRgb(col);
								
								//console.log(col);
								
								if(Array.isArray(col)){
								col[0] /= 255;
								col[1] /= 255;
								col[2] /= 255;
								
								delete col[3];
								
								}
								//console.log(col);
								widgets.addColor(i, col , {callback:function(v) { 
								
								var r = Math.ceil(v[0]*255);
								var g = Math.ceil(v[1]*255);
								var b = Math.ceil(v[2]*255);
								
								var a = 'rgb('+r+','+g+','+b+')';
								selected.data[this.textContent][1] = a;
					
								//a = this; selected.data[this.textContent][1] = this.children[1].children[0].value.toLowerCase()
								
								}});
							
								break;
								
								case 'action':
								
								widgets.addStringButton(i,selected.data[i][1].length?'< '+selected.data[i][1].length+' Actions >':"Not set", { callback_button: function(v) {
									
									
								iframe = document.createElement('iframe'); 
									//iframe.sandbox = 'allow-forms allow-scripts allow-top-navigation allow-same-origin';
									iframe.style.position = 'fixed';
									iframe.style.width = '100%';
									iframe.style.height = '100%';
									iframe.style.top = '0px';
									iframe.style.left = '0px';
									iframe.setAttribute('src' , 'Action.html?'+Math.random());
									iframe.frameBorder = 0;
									iframe.elem = this;
									document.body.appendChild(iframe); 
									
									}});
								
								break;
								
								case 'node':
									
									if(!selected.data[i][2])
										selected.data[i][2] = '';
									
									var ent;
									
									var val = selected.data[i][2];
									
									if(val){
										if(val == 1)
											ent = top.Editor.scene;
										else
											ent = top.Editor.getEntityById(val);	
									}
			
									var err = false;
									
									if(ent && val){
										selected.data[i][1] = ent.name;
									}
									else if(!ent && val){
										err = true;
										//selected.data[i][1] = '';
										//selected.data[i+'Id'][1] = '';
									}
										
								var e = widgets.addStringButton(i,selected.data[i][1]?selected.data[i][1]:"", { callback_button: function(v) {
									
									var self = this;
									//var a = LiteGUI.alert();
									//window.dialog = a;
									
									var a = new LiteGUI.Dialog({ id: 'selector', title:'Select entity',height:'70%', close: true, minimize: false,  scroll: false, resizable:false, draggable: false, detachable: false });
									//a.content.parentElement.style.width = '50%';
									//a.content.parentElement.style.height = '50%';
									a.show('fade');
									a.makeModal();
									window.dialog = a;
									
									//a.content.parentElement.firstChild.innerHTML = 'Select entity';
									//a.content.parentElement.firstChild.style.height = '30px';

									var x = top.tree.root.cloneNode(true);
									x.style.overflow = 'auto';
									
									var arr = x.querySelectorAll('button');
									
									for(var i in arr)
										if(arr[i].style)
										arr[i].style.pointerEvents = 'none';
									
									x.onmouseout = function(){top.Editor.update()};
									x.onmouseover = function(e){
										
										var t = e.target;
										var sn;
										var id;
										
										if(!t.querySelector('.incontent'))
											t = t.parentElement;
										
										sn = t.querySelector('.incontent').innerHTML;
										
										id = t.parentElement.getAttribute('data-item_id');
										
			
										if(id){
											
											var e = top.Editor.getEntityById(id);
											var en = new top.Editor.createEntity();
											en.x = e.x;
											en.y = e.y;
											en.width = e.width;
											en.height = e.height;
											en.color = 'rgb(255,0,0)';
											en.opacity = 0.5;
											en.__draw(top.Editor.drawContext);
											//window.parent.Editor.update();
										}
										
									}
									x.onclick = function(e){
										
										top.Editor.update();
										
										var t = e.target;
										var sn;
										var id;
										
										if(!t.querySelector('.incontent'))
											t = t.parentElement;
										
										sn = t.querySelector('.incontent').innerHTML;
										
										id = t.parentElement.getAttribute('data-item_id');
										if(id == null)id = 1;
					
											
										a.close();
										
										var sel = top.Editor.selected || top.Editor.scene;
										var cId = sel.__guid || (sel.id + 1);
										
										if(cId == id){
											sn = '';
											id = '';
										}
										
										self.setValue(sn);
										selected.data[self.name][1] = sn;
										selected.data[self.name][2] = id;
										self.querySelector('input').style.border = 'none';
										//saveToEditor();
									}
									a.content.appendChild(x)
									a.content.style.overflow = 'auto';
									a.content.style.height = '90%';
									//a.content.style.paddingTop = '1px';
									//a.content.parentElement.lastChild.remove(a.content.nextElementSibling);
									
									
									/* a.content.parentElement.style.width = '50%';
									a.content.parentElement.style.width = '50%';
									a.content.style.height = '100%'; */
								
								}});
								e.querySelector('input').readOnly = true;
								e.querySelector('input').placeholder = 'Current Node';
								if(err)e.querySelector('input').style.border = '1px solid red';
								break;
								
								case 'hidden':
								dataCount--;
								break;
								
								default: 
							
							}
						
						}
					
						
						
					}
					
					if(dataCount)
					widgets.addSeparator();
				
					main_panel.add( widgets );
					//CREATE Inspector
					
					
					
				}
				div2.appendChild(beh);
				beh.scrollIntoViewIfNeeded();
				beh.click();
				
		
		}
		
		function getCmen(){
		
			var cmen = [];
			
			for(var i in Actions){
				
				if(!Array.isArray(Actions[i]))
				{
					 cmen.push({
					 'text': Actions[i].name,
					 'events':{'click': createBeh},
					});
			
				}else{
					
					/* var obj = {};
					obj.text = Actions[i].name;
					obj.sub = [];
					
					for(var ii in Actions[i]){
					
						sub.push({
						 'text': Actions[ii].name,
						 'events':{'click': createBeh},
						});
					
					} */
					
					var obj = {};
					obj.text = Actions[i][0];
					obj.sub = [];
					
					for(var ii in Actions[i]){
						
						if(Actions[i][ii].name)
							
						obj.sub.push({
						 'text': Actions[i][ii].name,
						 'events':{'click': createBeh},
						});
					
					}
					
					cmen.push(obj);
				
				}
		
		}
		      return cmen;
		}

			
		var cmen = getCmen();
		menu = new ContextMenu(cmen);
		
		var selected = null; 
		
		var div =  side_panel.content;
		div.style.display = 'flex';
		div.style.flexDirection = 'column';
		//div.style.alignItems = 'stretch';
		
		var div1 = document.createElement('div');
		//div1.style.border = '1px red solid';
		//div1.style.height = '40px';
		div1.style.marginBottom = '5px';
		//div1.style.width = '10%';
		div1.style.display = 'flex';
		div1.style.justifyContent = 'space-around';
		//div1.style.justifyContent = 'flex-start';
		//div1.style.flexDirection = 'column';
		
		//var addButton  = document.createElement('button');
		var addButton = iconButton('plus');
		//addButton.textContent  = '+';
		//addButton.style.margin = '3px 1px';
		addButton.onclick = function(e){
			
			e.stopPropagation();
			menu.display(e);
			window.addEventListener("click", documentClick);
			
		
		}
		div1.appendChild(addButton);
		
		var removeButton  = iconButton('trash');
		//removeButton.textContent  = '-';
		//removeButton.style.margin = '3px 1px';
		removeButton.onclick = function(){
			if(selected){
				if(selected.previousElementSibling) 
					var prev = selected.previousElementSibling;
				if(!prev)
					var prev = selected.nextElementSibling;
				
				selected.parentElement.removeChild(selected);
				//main_panel.header.textContent = 'Action';
				main_panel.content.innerHTML = '';
				selected = null;
				if(prev){
					prev.click();
					prev.scrollIntoViewIfNeeded();
				}
			}
		
		}
		div1.appendChild(removeButton);
		
		var upButton  = iconButton('arrow-up');
		//upButton.textContent  = '^';
		//upButton.style.margin = '3px 1px';
		upButton.onclick = function(){
			if(selected && selected != selected.parentElement.firstChild){
					
				selected.parentElement.insertBefore(selected,selected.previousElementSibling);
				selected.scrollIntoViewIfNeeded();
			}
		
		}
		div1.appendChild(upButton);
		
		var downButton  = iconButton('arrow-down');
		//downButton.textContent  = 'v';
		//downButton.style.margin = '3px 1px';
		downButton.onclick = function(){
			if(selected && selected.nextElementSibling){
					
				selected.parentElement.insertBefore(selected.nextElementSibling,selected);
				selected.scrollIntoViewIfNeeded();	
			}
		
		}
		div1.appendChild(downButton);
		
		var copyButton  = iconButton('copy');
		//copyButton.textContent  = 'c';
		//copyButton.style.margin = '3px 1px';
		copyButton.onclick = function(){
			if(selected){
					
				top.actClipBoard = clone(selected.data);			
			}
		
		}
		div1.appendChild(copyButton);
		
		var cutButton  = iconButton('cut');
		//copyButton.textContent  = 'c';
		//copyButton.style.margin = '3px 1px';
		cutButton.onclick = function(){
			if(selected){
					
				copyButton.click();
				removeButton.click();

			}
		
		}
		div1.appendChild(cutButton);
		
		var pasteButton  = iconButton('paste');
		//pasteButton.textContent  = 'p';
		//pasteButton.style.margin = '3px 1px';
		pasteButton.onclick = function(){
			
				if(top.actClipBoard){
					
					var data = clone(top.actClipBoard);
					createBeh(null, data);
							
				}					
		
		}
		div1.appendChild(pasteButton);
		
		var div2 = document.createElement('div');
		div2.style.border = 'groove #777777';
		
		//div2.style.width = '90%';
		
		div2.style.display = 'block';
		div2.style.overflowY = 'auto';
		div2.style.height = '100%';
		div2.style.width = '100%';
		
		div.appendChild(div1); 
		div.appendChild(div2);
		
		var widgets = new LiteGUI.Inspector();
		//widgets.addSeparator();
		widgets.addButtons(null,["Ok","Cancel","Clear"],{callback: function(v){
			
			if(v == 'Ok'){
				
				parent.selected.data[parent.iframe.elem.name][1] = parseAction().slice(); 
				
				var count = selected?selected.parentElement.childElementCount:0;
				
				parent.iframe.elem.setValue(count>0?'< '+count+' Actions >':'Not set');
				parent.iframe.src = '';
				parent.iframe.parentElement.removeChild(parent.iframe);
				
				
				
			
			}
			
			if(v == 'Cancel'){
				
				parent.iframe.src = '';
				parent.iframe.parentElement.removeChild(parent.iframe);
				
			}
			
			
			if(v == 'Clear'){
				selected.parentElement.innerHTML = '';
				selected = null;
				main_panel.content.innerHTML = '';
				
			}
			
		}});
		div.appendChild(widgets.root);
		
		

		//create right panel
		var main_panel = new LiteGUI.Panel("mainpanel",{title:"Properties", width: 200});
		mainarea.getSection(1).add( main_panel );
		
		main_panel.root.style.overflow = 'auto';		
		//main_panel.root.firstChild.style.position = 'fixed';
		
		
		function clone(src) {
		
			return JSON.parse(JSON.stringify(src));
  
		}
		
/* 		function getBehByName(name){
		
			for(var i in Actions){
				
				if(Actions[i].name == name)
				  return clone(Actions[i]);
			
			}
		
		
		} */
		
		function getBehByName(name){
		
			for(var i in Actions){
				
				if(Array.isArray(Actions[i])){
					
					for(var ii in Actions[i]){
						 
						 if(Actions[i][ii].name == name)
						 return clone(Actions[i][ii]);
						
					}
					
				}
				
				if(Actions[i].name == name)
				  return clone(Actions[i]);
			
			}
		
		
		}
		
	function parseAction(){
		
		if(selected == null) return [];
		
		var act = [];
		var par = selected.parentElement.children;
		
		for( var i in par){
			
			if(par[i].data)
			act.push(par[i].data);
			
		}
		
		return act;
	}
		
	window.onload  = function(){
		
		var acts = parent.selected.data[parent.iframe.elem.name][1];
		
		generate(acts);
	}
	
	function generate(a){
		
		for(var i in a){
			
			if(a[i].jsname)createBeh(null, clone(a[i]));
			
		}
		
	}
	
function iconButton(icon){
			
			var addButton = LiteGUI.createButton();
			var a = document.createElement('a');
			a.className = 'fa fa-'+ icon;
			addButton.appendChild(a);
			
			addButton.style.width = '20px';
			addButton.style.height = '20px';
			
			addButton.style.margin = '3px';
			
			return addButton;
			
		}