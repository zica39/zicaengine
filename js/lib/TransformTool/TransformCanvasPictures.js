function App(){
	this.canvas = document.getElementById("field");
	this.ctx = this.canvas.getContext("2d");
	
	this.displayList = [];
	this.tool = new TransformTool(this.ctx);
	
	this.bindHandlers();
	
	this.loader = new ImagesLoader(this.handleImagesLoaded);
	this.loader.load([
		"img/smiley.gif"
	]);
}

App.create = function(){
	App.instance = new App();
	return App.instance;
}
App.instance = null;

App.prototype.bindHandlers = function(){
	// instance-specific event handlers bound to this
	this.up = this.up.bind(this);
	this.down = this.down.bind(this);
	this.move = this.move.bind(this);
	this.render = this.render.bind(this);
	this.handleImagesLoaded = this.handleImagesLoaded.bind(this);
	this.handleDrawSelected = this.handleDrawSelected.bind(this);
};

App.prototype.handleImagesLoaded = function(){
	this.addPictures();
	this.setupTool();
	
	// selects pictures on mouse down
	this.canvas.addEventListener(Mouse.START, this.down);
	
	// draws initial screen
	this.render();
};

App.prototype.addPictures = function(){
	var offx = 150;
	var offy = 100;
	
	var i = 0;
	var n = this.loader.images.length;
	for (i=0; i<n; i++){
		this.displayList.push(new Picture(this.loader.images[i], i*offx, i*offy));
	}
};

App.prototype.setupTool = function(){
	//var controls = this.getCustomControls();
	var controls = ControlSet.getScaler();
	this.tool.setControls(controls);	
};

App.prototype.getCustomControls = function(){
	var translater = new Control(Control.TRANSLATE);
	// translate control is "selected" by clicking
	// on the target's shape, not the control point
	translater.hitTestTarget = true;

	var targetContent = new Control(Control.TARGET);
	// setup a callback to draw the selected picture
	// within the stack of controls
	targetContent.drawCallback = this.handleDrawSelected;
	
	return [
		new Control(Control.ROTATE, 0,0, 0,0, 30),
		new Control(Control.ROTATE, 0,1, 0,0, 30),
		new Control(Control.ROTATE, 1,0, 0,0, 30),
		new Control(Control.ROTATE, 1,1, 0,0, 30),
		targetContent, // renders target between controls
		translater,
		new Control(Control.BORDER),
		new Control(Control.REGISTRATION, .5,.5, 0,0, 10),
		new Control(Control.SKEW_Y, 0,.5, 0,0, 10),
		new Control(Control.SCALE_X, 1,.5, 0,0, 10),
		new Control(Control.SKEW_X, .5,0, 0,0, 10),
		new Control(Control.SCALE_Y, .5,1, 0,0, 10),
		new Control(Control.SCALE, 0,0, 0,0, 10),
		new Control(Control.SCALE, 0,1, 0,0, 10),
		new Control(Control.SCALE, 1,0, 0,0, 10),
		new Control(Control.SCALE, 1,1, 0,0, 10),
		new Control(Control.ROTATE_SCALE, 1,0, 15,-15, 10),
		new Control(Control.SCALE_UNIFORM, 1,1, 15,15, 10),
		new Control(Control.ROTATE, .5,0, 0,-20)
	];
};

App.prototype.down = function(event){
	if(event.which != 1)return;
	
	if (!Editor.game.isStopped())
        return;
	
	Mouse.get(event, this.canvas);
	var controlled = this.tool.start(Mouse.x, Mouse.y);
	
	// if tool wasnt selected and being controlled
	// attempt to make a new selection at this location
	if (!controlled && this.selectImage(Mouse.x, Mouse.y)){
		// selection occurred
		// force select the translate control
		// to be able to start moving right away
		controlled = this.tool.start(Mouse.x, Mouse.y, this.findControlByType(Control.TRANSLATE)); 
	}
	
	if (controlled){
		// events for moving selection
		this.canvas.addEventListener(Mouse.MOVE, this.move);
		document.addEventListener(Mouse.END, this.up);
	}
	
	//requestAnimationFrame(this.render);
	//Editor.update();
	event.preventDefault();
};

App.prototype.move = function(event){
	if(event.which != 1)return;
	
	Mouse.get(event, this.canvas);
	this.applyDynamicControls(event);
	this.tool.move(Mouse.x, Mouse.y);
	
	//requestAnimationFrame(this.render);
	//Editor.propertiesViewModel.updateProperties();
	Editor.propertiesGui.updateDisplay()
	Editor.update();
	event.preventDefault();
};

App.prototype.up = function(event){
	if(event.which != 1)return;
	
	this.tool.end();	
	
	this.canvas.removeEventListener(Mouse.MOVE, this.move);
	document.removeEventListener(Mouse.END, this.up);
	
	//requestAnimationFrame(this.render);
	Editor.update();
	event.preventDefault();
};

App.prototype.applyDynamicControls = function(event){
	// if dynamic, set controls based on 
	// keyboard keys
	var dyn = this.getDynamicControl();
	if (dyn){
		if (event.ctrlKey){
			if (event.shiftKey){
				dyn.type = Control.ROTATE_SCALE;
			}else{
				dyn.type = Control.ROTATE;
			}
		}else if (event.shiftKey){
			dyn.type = Control.SCALE;
		}else{
			dyn.type = Control.TRANSLATE;
		}
	}
};

App.prototype.getDynamicControl = function(){
	var i = 0;
	var n = this.tool.controls.length;
	for (i=0; i<n; i++){
		if (this.tool.controls[i].dynamicUV){
			return this.tool.controls[i];
		}
	}
	return null;
};

App.prototype.findControlByType = function(type){
	var i = 0;
	var n = this.tool.controls.length;
	for (i=0; i<n; i++){
		if (this.tool.controls[i].type == type){
			return this.tool.controls[i];
		}
	}
	return null;
}

App.prototype.selectImage = function(x, y){
	
	//if(this.displayList[0] == null) return; 
	
	var pic = null;
	var t = null;
	
	// walk backwards selecting top-most first
	var i = this.displayList.length;
	while (i--){
		pic = this.displayList[i];
		t = pic.transform;
		
		if (t.matrix.containsPoint(x, y, t.width, t.height)){
			if (this.tool.target !== t){
				
				// select
				this.tool.setTarget(t);
				// reorder for layer rendering
				this.displayList.splice(i,1);
				this.displayList.push(pic);
				return true;
			}
			
			// already selected
			return false;
		}
	}
	
	// deselect
	this.tool.setTarget(null);
	return false;
};

App.prototype.select = function(){
	
	var pic = null;
	var t = null;
	
	pic = this.displayList[0];
	t = pic.transform;
		
		if (this.tool.target !== t){
			
			this.tool.setTarget(t);
			this.tool.angle = pic.obj.angle;
			return true;
		}
	
	
	// deselect
	this.tool.setTarget(null);
	return false;
};

App.prototype.deselect = function(){
	
	this.tool.setTarget(null);
	
}

App.prototype.render = function(){
	
	//Editor.update(); 
	
	//Editor.eventViewModel.selectEntity(Editor.selected);
   // Editor.propertiesViewModel.selectEntity(Editor.selected);
    //Editor.eventViewModel.updateEventEditor();
	
	//this.drawDisplayList();
	//this.tool.draw();
	
	/* this.clear();
	this.drawDisplayList();
	
	// assumes tool and tool target is
	// always drawn on top of rest of the 
	// display list (after drawDisplayList())
	
	// set styles to be used by tool drawings
	this.ctx.fillStyle = "#FFF";
	this.ctx.strokeStyle = "#08F";
	this.ctx.lineWidth = 2;
	this.tool.draw(); */
	
};

App.prototype.clear = function(){
	this.ctx.setTransform(1,0,0,1,0,0); // reset (identity)
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

App.prototype.handleDrawSelected = function(control, ctx){
	control.tool.target.owner.draw(ctx);
	return false;
};

App.prototype.drawDisplayList = function(){
	var targetControl = this.findControlByType(Control.TARGET);
	var i = 0;
	var n = this.displayList.length;
	for (i=0; i<n; i++){
		// let the TARGET control draw the selected image
		// so it can be layered within the controls
		// otherwise draw the other images here
		if (!targetControl || this.tool.target !== this.displayList[i].transform){
			this.displayList[i].draw(this.ctx);
		}
	}
};

/**
 * Display list item showing a picture
 */
function Picture(image, x, y){
	this.image = image;
	var m = new Matrix(1,0,0,1,x,y);
	this.transform = new Transformable(image.width, image.height, m, this);
};

Picture.prototype.draw = function(ctx){
	ctx.save();
	var m = this.transform.matrix;
	ctx.setTransform(m.a,m.b,m.c,m.d, m.x,m.y);
	ctx.drawImage(this.image, 0, 0); // transform handles position
	ctx.restore();
};

function Enity(obj){
	this.obj = obj;
	this.image = obj.__image;
	var m = new Matrix(1,0,0,1,obj.x,obj.y);
	this.transform = new Transformable(obj.width, obj.height, m, this);
};

Enity.prototype.draw = function(ctx){
	
	var t = App.instance.tool.target;
	if(!t)return;
	var m = App.instance.tool.endMatrix;
			
		var x1 = m.x + m.a * t.width + m.c * t.height;
		var y1 = m.y + m.d * t.height + m.b * t.width;
		
		var x = m.x;
		var y = m.y;
	
	if(this.obj.position == 'fixed');
		if(Editor.isMoving)
			return false;

	this.obj.x = x;
	this.obj.y = y;
	
	this.obj.width = (x1-x);
	this.obj.height = (y1-y);
	
	this.obj.__updateFromAbsolute();
	//this.obj.angle += App.instance.tool.angle;
	
	
	/* var m = new Matrix();
			
			m.scale(this.width , this. height);
			
			m.translate(-(this.width/2), -(this.height/2));        
			m.rotate(this.angle * Math.PI / 180);
			m.translate((this.width/2), (this.height/2));
			
			m.translate(this.x , this.y);		
				
			this.__matrix = m;
			
			drawContext.setTransform(m.a,m.b,m.c,m.d, m.x,m.y);
			
			drawContext.fillStyle = this.color;
            drawContext.fillRect(0,0,1,1);
			this.__image.src = this.image;
			drawContext.drawImage(this.__image, 0,0,1,1);
			
			//drawContext.stroke();
			drawContext.fillStyle = this.textColor;
			drawContext.font = this.font;
			drawContext.textAlign = 'center';
			drawContext.textBaseline = 'middle'; 
            drawContext.fillText(this.text, 1/2 , 1/2);
			
			drawContext.restore();  */
	
};

