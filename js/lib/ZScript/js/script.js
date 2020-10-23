	const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
	const hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}).join('');

	const hexToRgb = hex =>
	  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
				 ,(m, r, g, b) => '#' + r + r + g + g + b + b)
		.substring(1).match(/.{2}/g)
		.map(x => parseInt(x, 16));
			
			
	var Behaviours = [
		{
			name: 'On First frame do something',
			jsname : 'AnimatorOnFirstFrame',
			description : "This behavior detect first frame",
			'Action': [ 'action' , []]
		},
		
		{
			name: 'Fly in a circle',
			jsname : 'AnimatorFlyCircle',
			description : 'Lets the 2D scene node move in a circle. ',
			'Center': [ 'vect2d' , '[0.0, 0.0]'],
			'Radius': [ 'float' , '50'],
			'Speed': [ 'float' , '0.1']
		},
		
		{
			name: 'Rotate',
			jsname : 'AnimatorRotation',
			description : 'Lets a 2D scene node rotate around itself.',
			'Speed': [ 'float' , '45']
		},
		{
			name: 'Fly along a line',
			jsname : 'AnimatorFlyStraight',
			description : 'Fly along a line between two points',
			'Start': [ 'vect2d' , '[0.0, 0.0]'],
			'End': [ 'vect2d' , '[100.0, 100.0]'],
			'TimeForWay': [ 'int' , '1000'],
			'Loop': [ 'bool' , false]
		},
		{
			name: 'Follow a path',
			jsname : 'AnimatorFollowPath',
			description : 'Scene node animator making entity s move along a path.',
			'TimeNeeded': [ 'int' , '5000'],
			'PathToFollow': [ 'array' , []],
			'LookIntoMovementDirection': [ 'bool' , false],
			'AdditionalRotation': [ 'int' , '-90'],
			'TimeDisplacement': [ 'int' , '0'],
			'EndMode':['combo','Start Again',['Start Again','Stop']]
		},
		{
			name: 'Collide When Moved',
			jsname : 'AnimatorCollisionResponse',
			description : "This behavior makes it possible to move 2D objects within a 2D world without letting them go through walls. ",
			'AffectedByGravity': [ 'bool' , false]
		},		
		/* {
			name: 'Collide When Moved',
			jsname : 'AnimatorCollide',
			description : "This behavior makes it possible to move 2D objects within a 2D world without letting them go through walls. ",
			'AffectedByGravity': [ 'bool' , false]
		}, */
		[
		'Behaviour triggered by events',
		/* {
			name: 'When Clicked do something',
			jsname : 'AnimatorOnClick',
			description : 'Triggers a user defineable action when the user clicks on the 2D object this behavior is attached to.',
			'Action': [ 'action' , []],  
			'NoClickWhenOccluded': [ 'bool' , false]
		}, */
		{
			name: 'Every Frame do something',
			jsname : 'AnimatorOnEveryFrame',
			description : "This behavior detect every frame",
			'Action': [ 'action' , []]
		},
		{
			name: 'When Mouse do something',
			jsname : 'AnimatorOnMouse',
			description : 'Triggers a user defineable action when the user moves the mouse cursor over the 2D object this behavior is attached to.',
			'MouseEvent' : ['combo', 'Mouse Click', ['Mouse Click','Mouse Down','Mouse Up','Mouse Over','Mouse Out']],
			'NoClickWhenOccluded': [ 'bool' , false],
			'Action': [ 'action' , []]	
		},
		{
			name: 'When a key is pressed do something',
			jsname : 'AnimatorOnKey',
			description : 'Allows reacting to key events, when for example a key is pressed on the keyboard or the mouse. Also, on Android, you can react to the android menu key by selecting "App Menu key".',
			'Key' : ['combo', 'A', ['Left Mouse Button','Right Mouse Button','Escape','Enter','Tab','Shift','Control','Space','Left','Up','Right','Down','Delete','App Menu Key','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9']],
			'KeyEvent' : ['combo', 'Key Pressed Down', ['Key Pressed','Key Pressed Down','Key Pressed Up']],
			'Action': [ 'action' , []]	
		},
		{
			name: 'Every few seconds do something',
			jsname : 'AnimatorTimer',
			description : 'A behavior which executes an action all the time, with a definable interval. Usually, this is also called a "Timer". ',
			'IntervalMS': [ 'int' , '5000'],
			'Action': [ 'action' , []]
		},
		{
			name: 'On proximity do something',
			jsname : 'AnimatorOnProximity',
			description : 'Animator for doing automatic collision detection and response.',
			'NearToNodes': [ 'node' , ''],
			'TriggeredWhen' : ['combo', 'Enters Radius', ['Leaves Radius','Enters Radius']],
			'Action': [ 'action' , []]
		}
		],
		[
		
		'Effect Behaviours',
		
		{
			name: 'Animate a texture',
			jsname : 'AnimatorAnimateTexture',
			description : 'Changes the texture of the 2D object this behavior is attached to',
			'TimePerFrame': [ 'int' , '200'],
			'Textures': [ 'array' , []],
			'Loop': [ 'bool' , true]
			
		}
		
		],
		[
		
		'Game Behaviours',
		
		{
			name: 'Top-Down Player',
			jsname : 'AnimatorTopDownMovement',
			description : 'Simple 2D Top-Down Movement Player',
			'Speed': [ 'float' , '0.2'],
			'StandAnimation': [ 'animation' , ''],
			'WalkLeftAnimation': [ 'animation' , ''],
			'WalkRightAnimation': [ 'animation' , ''],
			'WalkUpAnimation': [ 'animation' , ''],
			'WalkDownAnimation': [ 'animation' , '']
		},
		{
			name: '2D Jump "n" Run Player',
			jsname : 'Animator2DJumpNRun',
			description : 'Simple 2D Jump "n" Run Player',
			'Speed': [ 'float' , '0.2'],
			'JumpSpeed': [ 'float' , '0.2'],
			'JumpLengthMs': [ 'int' , '200'],
			'PauseAfterJump': [ 'bool' , false],
			'StandAnimation': [ 'animation' , ''],
			'WalkLeftAnimation': [ 'animation' , ''],
			'WalkRightAnimation': [ 'animation' , ''],
		},
		{
			name: 'Object controlled by keyboard',
			jsname : 'AnimatorKeyboardControlled',
			description : 'A behavior which makes it possible to control a 2d object by the keyboard input, and also trigger animations, if wanted.',
			'MoveSpeed': [ 'float' , '0.1'],
			'RotateSpeed': [ 'float' , '45'],
			'JumpSpeed': [ 'float' , '0.2'],
			'RunSpeed': [ 'float' , '0.2'],
			'StandAnimation': [ 'animation' , ''],
			'WalkAnimation': [ 'animation' , ''],
			'RunAnimation': [ 'animation' , ''],
			'JumpAnimation': [ 'animation' , ''],
			'AdditionalRotationForLooking': [ 'float' , '-90'],
			'UseAcceleration': [ 'bool' , false],
			'AccelerationSpeed': [ 'float' , '0.1'],
			'DecelerationSpeed': [ 'float' , '0.1'],
			'JumpSpeed': [ 'float' , '0.2'],
			'PauseAfterJump': [ 'bool' , false]
		},
		
		{
			name: 'Game actor whit Health(Player, Bots AI, ect)',
			jsname : 'AnimatorGameAI',
			description : 'Makes it possible to create controlled ingame actors, like Monsters, Soldiers etc, walking around in the environment.',
			'Mode':['combo','This is the Player',['This is the Player','Stand Still','Randomly Patrol']],
			'PatrolRadius': [ 'float' , '150'],
			'PatrolWaitTimeMs': [ 'int' , '4000'],
			'Health': [ 'float' , '100'],
			'MovementSpeed': [ 'float' , '50'],
			'Tags':['string','anyactor'],
			'AttacksActorsWithTags':['string','anyactor'],
			'CanFly': [ 'bool' , true],
			'ActivationRadius': [ 'float' , '200'],
			'StandAnimation': [ 'animation' , ''],
			'WalkAnimation': [ 'animation' , ''],
			'DieAnimation': [ 'animation' , ''],
			'AttackAnimation': [ 'animation' , ''],
			'ActionOnAttack': [ 'action' , []],
			'ActionOnActivate': [ 'action' , []],
			'ActionOnHit': [ 'action' , []],
			'ActionOnDie': [ 'action' , []],
			'RotationForLooking':['bool',false],
			'AdditionalRotationForLooking': [ 'float' , '0.0']
		},
		{
			name: 'Object moved by physics engine',
			jsname : 'AnimatorPhysicsEngine',
			description : 'A behavior which moves an object based on the rules of a simulated "real" world. ',
			'Shape': [ 'combo' , 'Box', ['Box','Circle']],
			'Mass' : ['float', '5.0'],
			'Position': [ 'vect2d' , '[0.0, 0.0]'],
			'Size': [ 'vect2d' , '[50.0, 50.0]'],
			'AutoSize':[ 'bool', false],
			'Radius' : ['float' ,'25.0'],
			'length' : ['float' ,'2.0']
		}
		
		]
		/* {
			name: 'fly Along Circle',
			jsname : 'flyAlongCircle',
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
		
		/* {
			name: 'Fly in a circle',
			jsname : 'AnimatorFlyCircle',
			description : 'Scene node animator making {@link CL3D.SceneNode}s move in a circle',
			'Center': [ 'vect3d' , '[0.0, 0.0, 0.0]'],
			'Direction': [ 'vect3d' , '[0.0, 1.0, 0.0]'],
			'Radius' : [ 'int' , '500'],
			'Speed' : ['float' , '0.001']
		},
		
		
		{
			name: 'Rotate',
			jsname : 'AnimatorRotation',
			description : 'Lets a 2D scene node rotate around itself.',
			'Rotation': [ 'vect3d' , '[0.3, 0.0, 0.0]']
		},
		
		{
			name: 'Fly along a line',
			jsname : 'AnimatorFlyStraight',
			description : 'Makes a 2D scene node fly along a straight line.',
			'Start': [ 'vect3d' , '[0.0, 0.0, 0.0]'],
			'End': [ 'vect3d' , '[100.0, 100.0, 100.0]'],
			'TimeForWay': [ 'int' , '1000'],
			'Loop': [ 'bool' , true],
		},
		
		{
			name: 'Collide When Moved',
			jsname : 'AnimatorCollisionResponse',
			description : "This behavior makes it possible to move 2D objects within a 2D world without letting them go through walls. For example simply attach this behavior to the active camera, and when moving it, it won't be possible to go through walls anymore, where 'walls' are 2D objects which have the 'collision' attribute checked in their property window. See collision for further information about this.",
			'Size': [ 'vect3d' , '[6.0, 12.0, 6.0]'],
			'RelativePosition': [ 'vect3d' , '[0.0, 3.0, 0.0]'],
			'AffectedByGravity': [ 'bool' , true],
			'EnableInclination': [ 'bool' , false]
		},
		
		[
		'Behaviour triggered by events',
		{
			name: 'When Clicked do something',
			jsname : 'AnimatorOnClick',
			description : 'Triggers a user defineable action when the user clicks on the 2D object this behavior is attached to.',
			'Action': [ 'action' , []],
			'BoundingBoxTestOnly': [ 'bool' , false],  
			'NoClickWhenOccluded': [ 'bool' , false]
		} ,
		
		{
			name: 'When Cursor Moved Over do something',
			jsname : 'AnimatorOnMove',
			description : 'Triggers a user defineable action when the user moves the mouse cursor over the 2D object this behavior is attached to.',
			'BoundingBoxTestOnly': [ 'bool' , false],  
			'NoActionWhenOccluded': [ 'bool' , true],
			'ActionOnEnterMouse': [ 'action' , []],
			'ActionOnLeaveMouse': [ 'action' , []]
		},
		
		{
			name: 'Every few seconds do something',
			jsname : 'AnimatorTimer',
			description : 'A behavior which executes an action all the time, with a definable interval. Usually, this is also called a "Timer". ',
			'IntervalMS': [ 'int' , '5000'],
			'Action': [ 'action' , []]
			
		},
		
		{
			name: 'When a key is pressed do something',
			jsname : 'AnimatorOnKeyPress',
			description : 'Allows reacting to key events, when for example a key is pressed on the keyboard or the mouse. Also, on Android, you can react to the android menu key by selecting "App Menu key".',
			'Key' : ['combo', 'A', ['Left Mouse Button','Right Mouse Button','Escape','Enter','Tab','Shift','Control','Space','Left','Up','Right','Down','Delete','App Menu Key','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9']],
			'KeyEvent' : ['combo', 'Key Pressed Down', ['Key Pressed Down','Key Pressed Up']],
			'Action': [ 'action' , []]	
		} 
		],
		
		[
		
			'Effect Behaviours',
		
		{
			name: 'Animate a texture',
			jsname : 'AnimatorAnimateTexture',
			description : 'Changes the texture of the 2D object this behavior is attached to',
			'TimePerFrame': [ 'int' , '200'],
			'Changewhichmaterial' : ['combo', 'Change material whit index', ['Change material whit index','Change all meterials of node']],
			'Index': [ 'int' , '0'],
			'Textures': [ 'array' , []],
			'Loop': [ 'bool' , true]
			
		}
		
		] */
		
	];
	
		var behClipBoard = null;
		var actClipBoard = null;
	
	//call the init to setup 
		LiteGUI.init();

		//create a main container and split it in two
		var mainarea = new LiteGUI.Area({id:"mainarea",content_id:"canvasarea", autoresize: true, inmediateResize: true});
		mainarea.split("horizontal",[200,null], true);
		LiteGUI.add( mainarea );

		//create a left panel
		var side_panel = new LiteGUI.Panel("sidepanel",{title:"Behaviour Manager", width: 200});
		mainarea.getSection(0).add( side_panel );


		
		function createBeh(e , flag){
			
			/* var beh  = document.createElement('button');
				beh.data = getBehByName(this.textContent);
				console.log(beh.data);
				beh.textContent  = this.textContent; */
				//console.log(this.textContent);
				
				//var beh  = document.createElement('button');
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
					
					var dataCount = 0;
					widgets.addSeparator();
					
					for(var i in selected.data){
					
					
						if(Array.isArray(selected.data[i])){
							
							dataCount++;
							
							switch(selected.data[i][0]){
								
								case 'combo':
								
								widgets.addCombo(i,selected.data[i][1],{values:selected.data[i][2],callback: function(v){selected.data[this.name][1] = v;saveToEditor();}});
						
								break;
								
								case 'array':
								
								widgets.addArray(i, selected.data[i][1] ,{data_type: 'String',callback: function(v){saveToEditor();}});
						
								break;
								
								case 'int':
								
								widgets.addNumber(i, selected.data[i][1] , {precision:0 , callback:function(v) {selected.data[this.textContent][1] = v;saveToEditor();}});
						
								break;
								
								case 'float':
								
								widgets.addNumber(i, selected.data[i][1],{precision:1 , callback:function(v) {selected.data[this.textContent][1] = v;saveToEditor();}});
							
								break;
								
								case 'slider':
								
								widgets.addSlider(i, selected.data[i][1],{precision:1,min:0,max:1 , callback:function(v) {
									
									var a = this.textContent.trim();
									selected.data[a][1] = v;
								
								}});
							
								break;
								
								case 'string':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v;saveToEditor();}});
							
								break;
								
								case 'texture':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v;saveToEditor();}});
							
								break;
								
								case 'node1':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v;saveToEditor();}});
							
								break;
								
								case 'vect3d':
								
								widgets.addVector3(i, JSON.parse(selected.data[i][1]),{precision:2  , callback:function(v) {selected.data[this.textContent][1] = JSON.stringify(v);saveToEditor();}});
							
								break;
								
								case 'vect2d':
								
								widgets.addVector2(i, JSON.parse(selected.data[i][1]),{precision:2  , callback:function(v) {selected.data[this.textContent][1] = JSON.stringify(v);saveToEditor();}});
							
								break;
								
								case 'bool':
								
								widgets.addCheckbox(i, selected.data[i][1], {callback:function(v) {selected.data[this.children[0].textContent][1] = v;saveToEditor();}});
							
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
									iframe.id = 'actionFrame';
									iframe.style.position = 'fixed';
									iframe.style.width = '100%';
									iframe.style.height = '100%';
									iframe.style.top = '0px';
									iframe.style.left = '0px';
									iframe.src = 'Action.html';
									iframe.frameBorder = 0;
									iframe.elem = this;
									document.body.appendChild(iframe); 
									
									iframe.contentWindow.onunload = function(){
										saveToEditor();
									}
									}}).querySelector('input').readOnly = true;
								
								break;
								
								case 'node':
									
									if(!selected.data[i][2])
										selected.data[i][2] = '';
									
									var ent;
									
									var val = selected.data[i][2];
									
									if(val){
										if(val == 1)
											ent = window.parent.Editor.scene;
										else
											ent = window.parent.Editor.getEntityById(val);	
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

									var x = window.parent.tree.root.cloneNode(true);
									x.style.overflow = 'auto';
									
									var arr = x.querySelectorAll('button');
									
									for(var i in arr)
										if(arr[i].style)
										arr[i].style.pointerEvents = 'none';
									
									x.onmouseout = function(){window.parent.Editor.update()};
									x.onmouseover = function(e){
										
										var t = e.target;
										var sn;
										var id;
										
										if(!t.querySelector('.incontent'))
											t = t.parentElement;
										
										sn = t.querySelector('.incontent').innerHTML;
										
										id = t.parentElement.getAttribute('data-item_id');
										
			
										if(id){
											
											var e = window.parent.Editor.getEntityById(id);
											var en = new window.parent.Editor.createEntity();
											en.x = e.x;
											en.y = e.y;
											en.width = e.width;
											en.height = e.height;
											en.color = 'rgb(255,0,0)';
											en.opacity = 0.5;
											en.__draw(window.parent.Editor.drawContext);
											//window.parent.Editor.update();
										}
										
									}
									x.onclick = function(e){
										
										window.parent.Editor.update();
										
										var t = e.target;
										var sn;
										var id;
										
										if(!t.querySelector('.incontent'))
											t = t.parentElement;
										
										sn = t.querySelector('.incontent').innerHTML;
										
										id = t.parentElement.getAttribute('data-item_id');
										if(id == null)id = 1;
					
											
										a.close();
										
										var sel = window.parent.Editor.selected || window.parent.Editor.scene;
										var cId = sel.__guid || (sel.id + 1);
										
										if(cId == id){
											sn = '';
											id = '';
										}
										
										self.setValue(sn);
										selected.data[self.name][1] = sn;
										selected.data[self.name][2] = id;
										self.querySelector('input').style.border = 'none';
										saveToEditor();
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
										saveToEditor();
										//this.querySelector('select').style.border = 'none';
									}});
									//if(err)e.querySelector('select').style.border = '1px solid red';
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
				saveToEditor();
		
		}
		
		function getCmen(){
		
			var cmen = [];
			
			for(var i in Behaviours){
				
				if(!Array.isArray(Behaviours[i]))
				{
					 cmen.push({
					 'text': Behaviours[i].name,
					 'events':{'click': createBeh},
					});
			
				}else{
					
					var obj = {};
					obj.text = Behaviours[i][0];
					obj.sub = [];
					
					for(var ii in Behaviours[i]){
						
						if(Behaviours[i][ii].name)
							
						obj.sub.push({
						 'text': Behaviours[i][ii].name,
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
		div.style.flexDirection = 'row';
		//div.style.alignItems = 'stretch';
		
		var div1 = document.createElement('div');
		//div1.style.border = '1px red solid';
		//div1.style.width = '10%';
		div1.style.display = 'flex';
		div1.style.justifyContent = 'flex-start';
		div1.style.alignItems = 'stretch';
		div1.style.flexDirection = 'column';
		
		var addButton = iconButton('plus');
		//var addButton  = document.createElement('button');
		//addButton.textContent  = '+';
		//addButton.style.margin = '3px 1px';
		addButton.onclick = function(e){
			
			e.stopPropagation();
			menu.display(e);
			window.addEventListener("click", documentClick);
			
		
		}
		div1.appendChild(addButton);
		
		var removeButton  = iconButton('trash');;
		//removeButton.textContent  = '-';
		//removeButton.style.margin = '3px 1px';
		removeButton.onclick = function(){
			if(selected){
				
				if(selected.previousElementSibling) 
					var prev = selected.previousElementSibling;
				if(!prev)
					var prev = selected.nextElementSibling;
				
				selected.parentElement.removeChild(selected);
				//main_panel.header.textContent = 'Behaviour';
				main_panel.content.innerHTML = '';
				selected = null;
				
				saveToEditor();
				
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
				saveToEditor();
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
				saveToEditor();	
			}
		
		}
		div1.appendChild(downButton);
		
		var copyButton  = iconButton('copy');
		//copyButton.textContent  = 'c';
		//copyButton.style.margin = '3px 1px';
		copyButton.onclick = function(){
			if(selected){
					
				behClipBoard = clone(selected.data);

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
		
					
				if(behClipBoard){
					
					var data = clone(behClipBoard);
					createBeh(null, data);
					//saveToEditor();
							
				}
		
		}
		div1.appendChild(pasteButton);
		
		var playButton  = document.createElement('button');
		playButton.textContent  = '>';
		playButton.style.margin = '3px 1px';
		playButton.onclick = function(){
			
			var sel = window.parent.Editor.selected;
			if(!sel) sel = window.parent.Editor.scene;
			
			var behs = parseBehaviors();
			sel.animators = JSON.stringify(behs);
			return;
		
			var dialog = new LiteGUI.Dialog({ id: 'Scene Editor', title:'Scene Editor', close: true, minimize: false,  scroll: false, resizable:false, draggable: false, detachable: false });
			dialog.content.parentElement.style.width = '90%';
			dialog.content.parentElement.style.height = '90%';
			dialog.show('fade');
			dialog.makeModal();
			d  = dialog;
			//dialog.content.width = '90%';
			//dialog.content.height = '90%';
			
			var iframe = document.createElement('iframe'); 
			dialog.content.style.width = '100%';
			dialog.content.style.height = '100%';
			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.src = 'copperlitch/editor.html';
			iframe.frameBorder = 0;
			dialog.content.appendChild(iframe); 
			
			
			dialog.center(); 		
							
			
		
		}
		//div1.appendChild(playButton);
		
		var div2 = document.createElement('div');
		
		div2.style.border = 'groove #777777';
		//div2.style.border = '1px red solid';
		//div2.style.borderLeft = 'none';
		
		div2.style.display = 'block';
		div2.style.overflowY = 'auto';
		div2.style.height = '100%';
		div2.style.width = '100%';
		
		div.appendChild(div1); 
		div.appendChild(div2);
		
		/* var widgets = new LiteGUI.Inspector();
		widgets.addSeparator();
		widgets.addButtons(null,["Save","Load","New"],{callback: function(v){
			if(v == 'Save'){
				
				var behs = parseBehaviors();
				var json = JSON.stringify(behs,null,'\t');
				var contentType = 'text/plain';
				
				var a = document.createElement("a");
				var file = new Blob([json], {type: contentType});
				a.href = URL.createObjectURL(file);
				LiteGUI.prompt('File Name',function(v){
				if(!v) v = 'untitled';
				a.download = v + '.zs';
				a.click();
				
				});
				
			
			}
			
			if(v == 'Load'){
				
				var input = document.createElement('input');
				input.type = 'file';
				input.accept = '.zs';

				input.onchange = e => { 
				   var file = e.target.files[0]; 
				   
					var reader = new FileReader();
				   reader.readAsText(file,'UTF-8');

				   // here we tell the reader what to do when it's done reading...
				   reader.onload = readerEvent => {
					  var content = readerEvent.target.result; // this is the content!
					  //console.log( content );
					  var data = JSON.parse(content); 
					   for(var i in data){
						
						if(selected){
						selected.parentElement.innerHTML = '';
						selected = null;
						main_panel.content.innerHTML = '';
						}
						
							if(data[i].jsname)createBeh(null, data[i]);
							
						}
		
				   }
				}

				input.click();
				
			}
			
			
			if(v == 'New'){
				if(selected)
				LiteGUI.confirm('Are you sure?', function(v){
					if(v){
						selected.parentElement.innerHTML = '';
						selected = null;
						main_panel.content.innerHTML = '';
					}
				});
			}
			
		}});
		
		
		div.appendChild(widgets.root); */

		//create right panel
		var main_panel = new LiteGUI.Panel("mainpanel",{title:"Properties", width: 200});
		mainarea.getSection(1).add( main_panel );
		
		main_panel.root.style.overflow = 'auto';		
		//main_panel.root.firstChild.style.position = 'fixed';
		
		function saveToEditor(){
			
			var sel = window.top.Editor.selected;
			if(!sel) sel = window.top.Editor.scene;
			
			var behs = parseBehaviors();
			sel.animators = JSON.stringify(behs);
			
		}
		
		function clone(src) {
		
			return JSON.parse(JSON.stringify(src));
  
		}
		
		function getBehByName(name){
		
			for(var i in Behaviours){
				
				if(Array.isArray(Behaviours[i])){
					
					for(var ii in Behaviours[i]){
						 
						 if(Behaviours[i][ii].name == name)
						 return clone(Behaviours[i][ii]);
						
					}
					
				}
				
				if(Behaviours[i].name == name)
				  return clone(Behaviours[i]);
			
			}
		
		
		}
		
		
	function parseBehaviors(){
		
		if(selected == null) return [];
		
		var act = [];
		var par = selected.parentElement.children;
		
		for( var i in par){
			
			if(par[i].data)
			act.push(par[i].data);
			
		}
		
		return act;
	}
	
	
	function selectBeh(content){
		
		if(selected){
			selected.parentElement.innerHTML = '';
			selected = null;
			main_panel.content.innerHTML = '';
			
			if(window.dialog)window.dialog.close();
			var iframe = document.getElementById('actionFrame');
			if(iframe)
				iframe.parentElement.removeChild(iframe);
		}
			
		var data = JSON.parse(content); 
		   for(var i in data){
			
				if(data[i].jsname)createBeh(null, data[i]);
				
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