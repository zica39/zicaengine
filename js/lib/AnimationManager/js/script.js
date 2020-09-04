window.onload = main;

let context;
let width;
let height;
let anim;

let now, elapsed, then, startTime;
let fps = 12;
let interval = 1000/fps;
let canvas = document.createElement("canvas");

function main()
{
  
   context = canvas.getContext("2d");
   width = canvas.width;
   height = canvas.height;

   setAnimation();
   startTimer();
   render();
}

function setAnimation(obj){
	
	
	if(!obj)obj = {
		sy:0,
		width:256,
		height:256,
		frameCount:1,
		id: 'standing',
		frame:0
	}
	
	/*Girl asset loading*/
   var animation = new Animation(obj.sy, obj.width, obj.height, obj.frameCount, obj.id);

	//var image = 'imgs/spritestrip.png';
   anim = new Sprite('', 0, 0);
   anim.addAnimation(animation);
   anim.setAnimation(obj.id);
	
}

function startTimer()
{
   then = Date.now();
   startTime = then;
}

function render()
{
   requestAnimationFrame(render);

   now = Date.now();
   elapsed = now - then;

   if(elapsed > interval)
   {
      anim.update();
      then = now - (elapsed % interval);

      context.clearRect(0, 0, canvas.width, canvas.height);
      anim.draw(context);
   }
}
			
			
	var Behaviours = [
		
		{
			name: 'animation',
			'id' : ['info' , ''],
			'frameCount' : [ 'int' , '1'],
			'width' : [ 'int' , '0'],
			'height' : [ 'int' , '0'],
			'sy' : [ 'int' , '0']
			
			/* 'Center': [ 'vect3d' , '[0.0, 0.0, 0.0]'],
			'Direction': [ 'vect3d' , '[0.0, 1.0, 0.0]'],
			'Radius' : [ 'int' , '500'],
			'Speed' : ['float' , '0.001'],
			'useGravity' : ['bool','true'],
			'circleColor' : ['color','ff0000'],
			'littleText' : ['string' , 'Sreten Buljbasic'],
			'onClick': ['action' , []] */
		}
		
	];
	
		var behClipBoard = null;
		var actClipBoard = null;
	
	//call the init to setup 
		LiteGUI.init();

		//create a main container and split it in two
		var mainarea = new LiteGUI.Area("mainarea",{content_id:"canvasarea", autoresize: true, inmediateResize: true});
		mainarea.split("horizontal",[200,null], true);
		LiteGUI.add( mainarea );

		//create a left panel
		var side_panel = new LiteGUI.Panel("sidepanel",{title:"Animations Manager", width: 200});
		mainarea.getSection(0).add( side_panel );


		
		function createBeh(e , flag){
			
				var beh = LiteGUI.createButton();
				beh.style.width = '99%'
				beh.style.margin = '1px';
		
				if(!flag){
				
				beh.data = getBehByName('animation');
				//console.log(beh.data);
				var id = prompt('Insert Animation Id');
				if(doesExists(id))
					alert('This animation alredy exists',id = '');
				
				if(!id)return;
				beh.textContent  = id; //this.textContent;
				beh.data.id[1] = id;
				
				var sel = top.Editor.selected;
				if(sel){
					
					if(sel.__image){
						beh.data.width[1] = sel.__image.naturalWidth;
						beh.data.height[1] = sel.__image.naturalHeight;
					}else{
						
						beh.data.width[1] = canvas.width;
						beh.data.height[1] = canvas.height;
					}
				}
				
				}else{
					
					//console.log(flag);
					
					var obj = getBehByName('animation');
					obj.id[1] = flag.id;
					obj.width[1] = flag.width;
					obj.height[1] = flag.height;
					obj.frameCount[1] = flag.frameCount;
					obj.sy[1] = flag.sy;
					
					beh.data = obj
					beh.textContent = flag.id;					
				}
				
				beh.onclick = function(){
					for(var i=0; i<= this.parentElement.children.length-1; i++)this.parentElement.children[i].removeAttribute('disabled');
					this.setAttribute('disabled','');
					selected = this;
					//main_panel.header.textContent = this.textContent;
					
					main_panel.content.innerHTML = '';
					
					var widgets = new LiteGUI.Inspector();
					
					//widgets.addInfo('id', selected.data.id);
					
					var dataCount = 0;
					widgets.addSeparator();
					
					for(var i in selected.data){
					
					
						if(Array.isArray(selected.data[i])){
							
							dataCount++;
							
							switch(selected.data[i][0]){
								
								case 'info':
								
								widgets.addInfo(i,selected.data[i][1]);
						
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
									saveToEditor();
								
								}});
							
								break;
								
								case 'string':
								
								widgets.addString(i, selected.data[i][1], { callback:function(v) {selected.data[this.textContent][1] = v;saveToEditor();}});
							
								break;
								
								case 'vect2d':
								
								widgets.addVector2(i, JSON.parse(selected.data[i][1]),{precision:2  , callback:function(v) {selected.data[this.textContent][1] = JSON.stringify(v);saveToEditor();}});
							
								break;
								
								case 'bool':
								
								widgets.addCheckbox(i, selected.data[i][1], {callback:function(v) {selected.data[this.children[0].textContent][1] = v;saveToEditor();}});
							
								break;

								
								default: 
							}
						
						}
							
					}
					
					if(dataCount)
					widgets.addSeparator();
				
					main_panel.add( widgets );
					//CREATE Inspector
					
					root = widgets.root;
					root.appendChild(canvas);
					
					//root.style.overflow = 'hidden';
					root.style.height = '100%';
					root.style.width = '100%';
					var rect = root.getClientRects()[0];
					
					if(rect){
					canvas.width = rect.width;
					canvas.height = rect.height;
					}
				
				}
				div2.appendChild(beh);
				beh.scrollIntoViewIfNeeded();
				beh.click();
				saveToEditor();
		
		}
		
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
			
			if(!top.Editor.selected)return;
			
			createBeh(this);
			
			var sel = top.Editor.propertiesGui.domElement.querySelectorAll('select')[2];
			var opt = document.createElement('option');
			opt.value = selected.innerText;
			opt.innerHTML = opt.value;
			sel.appendChild(opt);
			
			//e.stopPropagation();
			//menu.display(e);
			//window.addEventListener("click", documentClick);
			
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
				
				var sel = parent.Editor.propertiesGui.domElement.querySelectorAll('select')[2];
				for(var i = 0;i<=sel.options.length-1;i++)
					if(sel.options.item(i).innerHTML == selected.innerText)
					{sel.removeChild(sel.options.item(i));break;}
				
				var sel = parent.Editor.selected || parent.Editor.scene;
				var anim = selected.innerText;
				
				if(sel.animation == anim)
				sel.animation = '';
				delete sel.animations[anim];
				
				//parent.Editor.propertiesGui.updateDisplay();
				
				parent.Editor.update();
				main_panel.content.innerHTML = '';
				selected = null;
				
				//saveToEditor();
				
				if(prev){
					prev.click();
					prev.scrollIntoViewIfNeeded();
				}
				
			}
		
		}
		div1.appendChild(removeButton);
		
		
		var copyButton  = iconButton('copy');
		//copyButton.textContent  = 'c';
		//copyButton.style.margin = '3px 1px';
		copyButton.onclick = function(){
			if(selected){
					
				behClipBoard = clone(selected.data);

			}
		
		}
		//div1.appendChild(copyButton);
		
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
		//div1.appendChild(pasteButton);
		
		
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

		//create right panel
		var main_panel = new LiteGUI.Panel("mainpanel",{title:"Animation", width: 200});
		mainarea.getSection(1).add( main_panel );
		
		main_panel.root.style.overflow = 'auto';		
		//main_panel.root.firstChild.style.position = 'fixed';
		
		function saveToEditor(){
			
			
			var obj = {};
			
			if(selected){
			obj.id  = selected.data.id[1];
			obj.width  = selected.data.width[1];
			obj.height  = selected.data.height[1];
			obj.frameCount  = selected.data.frameCount[1];
			obj.sy  = selected.data.sy[1];
			
			setAnimation(obj);
			}
			
			var sel = window.parent.Editor.selected;
			if(!sel) sel = window.parent.Editor.scene;
			
			var behs = parseBehaviors();
			var out = {};
			for (var i in behs){
				if(behs[i].id){
					
					out[behs[i].id[1]] = {};
					out[behs[i].id[1]].id  = behs[i].id[1];
					out[behs[i].id[1]].width = behs[i].width[1];
					out[behs[i].id[1]].height = behs[i].height[1];
					out[behs[i].id[1]].frameCount = behs[i].frameCount[1];
					out[behs[i].id[1]].sy = behs[i].sy[1];
					out[behs[i].id[1]].frame = 0;
					
				}	
			}
			
			sel.animations = out;
			parent.Editor.update();
			
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
	
	function doesExists(id){
		
		var behs = parseBehaviors();
		for(var i in behs){
			
			if(behs[i].id)
				if(behs[i].id[1] == id) return true;
			
		}
		
		return false;
	}
	
	
	function selectBeh(content,image){
		
		if(selected){
			selected.parentElement.innerHTML = '';
			selected = null;
			main_panel.content.innerHTML = '';
		}
		
		//selected_image = parent.Game.assets[image];
		//selected_image?selected_image:'';
		
		var data = JSON.parse(JSON.stringify(content)); 
		   for(var i in data){
			
				if(data[i].id)createBeh(null, data[i]);
				
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