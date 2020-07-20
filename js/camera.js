function Camera(context, settings) {
        settings = settings || {};
        this.distance = 1000.0;
        this.lookAt = [0, 0];
        this.context = context;
        this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [1.0, 1.0]
        };
		
        //this.addListeners();
        this.updateViewport();
		this.hasBegin = false;
    };

    Camera.prototype.begin = function() {
		this.hasBegin = true;
        this.context.save();
		//this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.applyScale();
        this.applyTranslation();
    }

    Camera.prototype.end = function() {
		this.hasBegin = false;
        this.context.restore();
    }

    Camera.prototype.applyScale = function() {
        this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
    }

    Camera.prototype.applyTranslation = function() {
        this.context.translate(-this.viewport.left, -this.viewport.top);
    }

    Camera.prototype.updateViewport = function() {
		//var scene = Game.scene || Editor.scene;
        this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
        this.viewport.width = this.context.canvas.width;// this.distance * Math.tan(this.fieldOfView);
        this.viewport.height = this.context.canvas.height;//this.viewport.width / this.aspectRatio;
        this.viewport.left = this.lookAt[0] - (this.viewport.width / 2.0);
        this.viewport.top = this.lookAt[1] - (this.viewport.height / 2.0);
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
        this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
    }

    Camera.prototype.zoomTo = function(z) {
        this.distance = z;
        this.updateViewport();
    }

    Camera.prototype.moveTo = function(x, y) {
        this.lookAt[0] = x;
        this.lookAt[1] = y;
        this.updateViewport();
    }
	
	Camera.prototype.set = function(x,y){
		var scene = Game.scene || Editor.scene;
		
		if(x < (this.viewport.width / 2.0))x = this.viewport.width / 2.0;
		if(y < (this.viewport.height / 2.0))y = this.viewport.height / 2.0;
		
		if(x > scene.width - (this.viewport.width / 2.0)) x = scene.width - (this.viewport.width / 2.0);
		if(y > scene.height - (this.viewport.height / 2.0)) y = scene.height - (this.viewport.height / 2.0);
		
		scene.x = x;
		scene.y  = y;
		
		if(this.hasBegin)this.end();
		this.moveTo(x,y);
		this.begin();
		//if(Editor)Editor.update();
	}

    Camera.prototype.screenToWorld = function(x, y, obj) {
        obj = obj || {};
        obj.x = (x / this.viewport.scale[0]) + this.viewport.left;
        obj.y = (y / this.viewport.scale[1]) + this.viewport.top;
        return obj;
    }

    Camera.prototype.worldToScreen = function(x, y, obj) {
        obj = obj || {};
        obj.x = (x - this.viewport.left) * (this.viewport.scale[0]);
        obj.y = (y - this.viewport.top) * (this.viewport.scale[1]);
        return obj;
    }

    Camera.prototype.addListeners = function() {
        // Zoom and scroll around world
		var self = this;
		
        window.onwheel = e => {
            if (e.ctrlKey) {
                // Your zoom/scale factor
                let zoomLevel = this.distance - (e.deltaY * 20);
                if (zoomLevel <= 1) {
                    zoomLevel = 1;
                }

                this.zoomTo(zoomLevel);
            } else {
                // Your track-pad X and Y positions
                var x = this.lookAt[0] + (e.deltaX * 2);
                var y = this.lookAt[1] + (e.deltaY * 2);

                //this.moveTo(x, y);
				this.set(x,y);
            }
        };
		
		window.addEventListener("keydown", function(e) {
			var scene = Game.scene || Editor.scene;
			
			if(e.keyCode == 37){
				scene.x -= 5;
				Editor.update();
				Editor.sceneGui.updateDisplay();
			}
			if(e.keyCode == 38){
				scene.y -= 5;
				Editor.update();
				Editor.sceneGui.updateDisplay();
			}
			if(e.keyCode == 39){
				scene.x += 5;
				Editor.update();
				Editor.sceneGui.updateDisplay();
			}
			if(e.keyCode == 40){
				scene.y += 5;
				Editor.update();
				Editor.sceneGui.updateDisplay();
			}
			
			//self.set(scene.x,scene.y);
	  
	}, false);


        // Center camera on "R"
        window.addEventListener('keydown', e => {
            if (e.key === 'r' && e.ctrlKey) {
				e.preventDefault();
                this.zoomTo(1000);
                //this.moveTo(0, 0);
				this.set(0,0);
				Editor.update();
				Editor.sceneGui.updateDisplay();
            }
        });
		
		var down=false;
		var x=0;
		var y=0;
		var x1=0;
		var y1=0;
		var canvas = document.getElementById('field');

		canvas.addEventListener('mousedown',function(e){
			if(event.which != 3)return;
			
			down = true;
			
			x = e.clientX;
			y = e.clientY
			
			x1 = Editor.scene.x;
			y1 = Editor.scene.y;
			
			
		});

		canvas.addEventListener('mouseup',function(e){
			if(event.which != 3)return;
			down = false;
			canvas.style.cursor = '';
			Editor.isMoving = false;
		});

		canvas.addEventListener('mousemove',function(e){
			if(event.which != 3)return;
			if (down) {
				Editor.isMoving = true;
				canvas.style.cursor = 'move';
				var sx = (x - e.clientX);
				var sy = (y - e.clientY);
				var s = Editor.camera.worldToScreen(Editor.scene.x,Editor.scene.y);
			   Editor.scene.x = x1 + sx;
			   Editor.scene.y = y1 + sy;
			    
			   Editor.update();
			   Editor.sceneGui.updateDisplay();
			}
		});

		canvas.addEventListener('mouseleave',function(e){
			if(event.which != 3)return;
			down = false;
		});
    }