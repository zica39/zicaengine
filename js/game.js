define(["require", "exports", "./collision", "./keys", "./scene", "./enums","./camera", "./ZICA", "./p2"], function (require, exports, collision_1, keys_1, scene_1, enums_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State;
    (function (State) {
        State[State["stopped"] = 1] = "stopped";
        State[State["running"] = 2] = "running";
        State[State["paused"] = 3] = "paused";
    })(State || (State = {}));
    var GameRunner = (function () {
        /**
         * Creates a new runnable game
         **/
        function GameRunner(canvas) {
            var _this = this;
            //stores all entities in the game world
			
			this.name = '';
			this.version = '';
			this.author = '';
			this.description = '';
			this.assets = {};
			this.autoSize = false;
			this.autoResize = false;
			this.pointerLock = false;
			this.fullScreen = false;
			this.icon = '';
			this.logo = '';
			this.showProgress = true;
			
			//canvas viewport
			this.x = 0;
			this.y = 0;
			this.width = 400;
			this.height = 400;
			
			//Variables
			this.variables = {};
			
			this.scene = null;
			this.scenes = [];
			
			this.__globalString = "";
			this.__global = function(event){};
			
            this.entityList = [];
            //whether the game is running, paused, or stopped
            this.state = State.stopped;
            this.firstFrame = true;
			this.startTime = 0;
            //object containing 
            this.controls = new Controls();
            this.canvas = canvas;
            this.drawContext = canvas.getContext("2d");
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            this.drawContext.textBaseline = "top";
			
			this.Keys = keys_1.Keys;
			this.Direction = enums_1.Direction;
			
			this.intervals = [];
			
            canvas.addEventListener("keydown", function (e) { _this.onKeyDown(e); });
            canvas.addEventListener("keyup", function (e) { _this.onKeyUp(e); });
			canvas.addEventListener("keypress", function (e) { _this.onKeyPress(e); });
			
			canvas.addEventListener("mousedown", function (e) { _this.onMouseDown(e); });
            canvas.addEventListener("mouseup", function (e) { _this.onMouseUp(e); });
			canvas.addEventListener("mousemove", function (e) { _this.onMouseMove(e); });
            canvas.addEventListener("click", function (e) { _this.onMouseClick(e); });
			
			canvas.addEventListener("touchstart", function (e) { _this.onMouseDown(e); });
            canvas.addEventListener("touchend", function (e) { _this.onMouseUp(e); });
			canvas.addEventListener("touchmove", function (e) { _this.onMouseMove(e); });
			
			/* canvas.addEventListener("touchstart", touchToMouse);
            canvas.addEventListener("touchend", touchToMouse);
			canvas.addEventListener("touchmove", touchToMouse); */
			
			//canvas.addEventListener("keyup", function (e) { _this.onKeyUp(e); });
      
	  }
		 /**
         * Starts the game
         **/
        GameRunner.prototype.startApp = function () {
            var _this = this;
            if (this.state != State.stopped)
                return;
			
			
			if(this.fullScreen)this.fullscreen();
			
			if(this.autoResize){
				this.canvas.style.height = '100%';
				this.canvas.style.width  = '100%';
			}
			
			this.camera = new Camera(this.drawContext);
			/* if(this.autoSize && this.fullScreen){
			this.width = window.innerWidth;
			this.height = window.innerWidth;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			} */
			
			this.firstFrame = true;
			//this.scene.firstFrame = true;
			
            this.entityList = this.scene.children;
			//this.recalcPriority();
			
            this.state = State.running;
			
			//code check
			this.tryUserFunc(function () { Game.__global(null); });
			
			var scene = this.scene;
			
			scene.world = new p2.World({gravity:[0, scene.gravity]});
			
			this.tryUserFunc(function () { scene.__onGameStart(null); });
			
            var _loop_1 = function (ent) {
                this_1.tryUserFunc(function () { ent.__onGameStart(null); });
            };
			
			//initAnimators
			this.tryUserFunc(function () { Game.initAnimators(); });
			
            var this_1 = this;
            //run first frame entity code if it's the start
            for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                _loop_1(ent);
            }
			
			this.resetTimer();			
            requestAnimationFrame(function () { _this.update(); });
        };
		 /**
         * Starts the game from data
         **/
        GameRunner.prototype.startFromData = function (data) {
			
			var self = this;
			self.constructor.constructApp(data,self);
		
			self.canvas.width = self.width;
			self.canvas.height = self.height;
			window.onresize = function(){self.resize();};
			self.resize();
			document.body.style.background = 'none';
			if(self.progress)
			self.progress.parentElement.removeChild(self.progress);
			
			self.startApp();
		};
		 /**
         * Starts the game from file
         **/
        GameRunner.prototype.startFromFile = function (fname) {
			
			var self = this;
			
			var rawFile = new XMLHttpRequest();
			rawFile.open("GET", fname, true);
			
			rawFile.onprogress  = function(evt){

				if ( evt.lengthComputable ) {
					/* var complete = evt.loaded / evt.total;
					var percentComplete =  complete * 100;
					console.log( complete );
					self.progress.value = complete;
					console.log( percentComplete + "%" ); */
				}
			};
			
			rawFile.onerror  = function(e){
				if(!self.progress)return;
				
				self.progress.innerHTML = '<b>Error loading data!!!</b>';
				self.progress.className = 'error';
				
			};
			
			rawFile.onreadystatechange = function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						var txt = rawFile.responseText;
						var data = JSON.parse(txt);
						
						self.constructor.constructApp(data,self);
					
						self.canvas.width = self.width;
						self.canvas.height = self.height;
						window.onresize = function(){self.resize();};
						self.resize();
						document.body.style.background = 'none';
						if(self.progress)
						self.progress.parentElement.removeChild(self.progress);
						
						self.startApp();	
					}
					else rawFile.onerror();
				}
			}
			
			rawFile.send(null);
			
		};
		 /**
         * Resize canvas 
         **/
		GameRunner.prototype.resize = function(){
				
			if(!this.autoSize)return;
			
			var rect = this.canvas.parentNode.getClientRects()[0];
			
			this.width = rect.width;
			this.height = rect.height;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			
		}
        /**
         * Starts the game
         **/
       /*  GameRunner.prototype.start = function (scene) {
            var _this = this;
            if (this.state != State.stopped)
                return;
            this.entityList = scene.children;
            this.state = State.running;
            var _loop_1 = function (ent) {
                this_1.tryUserFunc(function () { ent.__onGameStart(null); });
            };
            var this_1 = this;
            //run first frame entity code if it's the start
            for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                _loop_1(ent);
            }
            requestAnimationFrame(function () { _this.update(); });
        }; */
		
		GameRunner.prototype.pauseSounds = function(scene){
			
			scene.pausedSongs = [];
				
				for (var _i = 0, _a = scene.children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{	
						if(!ent.__audio.paused){
							ent.pauseAudio();
							scene.pausedSongs.push(ent);
						}
					}
				}
		};
		
		GameRunner.prototype.resumeSounds = function(scene){
			
			if(scene.pausedSongs)
			for(var i = 0; i<= scene.pausedSongs.length-1;i++){
				
				scene.pausedSongs[i].playAudio();
			}
			
			scene.pausedSongs = [];
			
		};
		
		GameRunner.prototype.stopSounds = function(scene){
			
			scene.pausedSongs = [];
				
				for (var _i = 0, _a = scene.children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{	
						ent.stopAudio();
						ent.__audio = null;
					}
				}
		};
		
		GameRunner.prototype.stopAllSounds = function(){
			
			var scene = this.scene;
			
			scene.pausedSongs = [];
				
				for (var _i = 0, _a = scene.children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{	
						ent.stopAudio();
					}
				}
		};
		
		/* GameRunner.prototype.pauseAllSounds = function(){
			this.pausedSongs = [];
			
			for(var i = 0; i<= this.scenes.length-1;i++){
				
				for (var _i = 0, _a = this.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{	
						if(!ent.__audio.paused){
							ent.pauseAudio();
							this.pausedSongs.push(ent);
						}
					}
				}
			
			}
			
		};
		GameRunner.prototype.resumeAllSounds = function(){
			
			if(this.pausedSongs)
			for(var i = 0; i<= this.pausedSongs.length-1;i++){
				
				this.pausedSongs[i].playAudio();
			}
			
		};
		GameRunner.prototype.stopAllSounds = function(){
			
			for(var i = 0; i<= this.scenes.length-1;i++){
				
				for (var _i = 0, _a = this.scenes[i].children; _i < _a.length; _i++) {
					var ent = _a[_i];
					
					if(ent.__audio instanceof Audio)
					{
						ent.stopAudio();
						ent.__audio = null;
					}
				}
			
			}
			
		}; */
        /**
         * Stops the game
         **/
        GameRunner.prototype.stop = function () {
           
		    this.state = State.stopped;
			this.stopSounds(this.scene);
			this.controls.keyData = {};
			this.controls.mouse = {};
			this.clearIntervals();
			
			//this.drawContext.clearRect(0,0,this.canvas.width,this.canvas.height);
        };
        /**
         * Pauses the game
         **/
        GameRunner.prototype.pause = function () {
            if (this.state == State.running) {
                this.state = State.paused;
				
				//this.pauseAllSounds();
				this.pauseSounds(this.scene);
            }
        };
        /**
         * Unpauses the game
         **/
        GameRunner.prototype.unpause = function () {
            if (this.state == State.paused) {
                this.state = State.running;
				//this.resumeAllSounds();
				this.resumeSounds(this.scene);
            }
        };
        /**
         * Returns whether or not the game is running
         **/
        GameRunner.prototype.isRunning = function () { return this.state == State.running; };
        /**
         * Returns true if the game is paused
         **/
        GameRunner.prototype.isPaused = function () { return this.state == State.paused; };
        /**
         * Returns true if the game is stopped
         **/
        GameRunner.prototype.isStopped = function () { return this.state == State.stopped; };
        /**
         * Runs the main game loop
         **/
        GameRunner.prototype.update = function () {
			
			if(this.preventDefault){
				this.preventDefault = false;
				return;
			}
            var _this = this;
			
			if (this.isRunning()) {
				 
			//check pointerLock
			if(this.pointerLock && this.state == 2)this.canvas.style.cursor = 'none';else this.canvas.style.cursor = '';
			//set camera
			this.camera.set(this.scene.x,this.scene.y);
			//clear screen
            this.scene.__draw(this.drawContext);
			//update scene 
			var scene = this.scene;
			
			
			var event = this.updateTimer();
			this.tryUserFunc(function () { scene.__onUpdate(event); });
			this.tryUserFunc(function () { _this.updateAnimators(scene,event); });
			
			var fixedTimeStep = 1 / 60; // seconds
			var maxSubSteps = 10; // Max sub steps 
			var deltaTime = event.deltaTime;
			
			scene.world.step(fixedTimeStep, deltaTime, maxSubSteps);
			
			 }
			 
		   //if we aren't paused, update, move, and collide all entities
            if (this.isRunning()) {
				
				var event = this.currentTimer();
				
                for (var i = 0; i < this.entityList.length; i++) {
                    var ent = this.entityList[i];
                    if (!ent.__removeFlag /* && ent.visible */) {
                        this.tryUserFunc(function () { _this.entityList[i].__onUpdate(event); });
						this.tryUserFunc(function () { _this.updateAnimators(_this.entityList[i],event); });	
                    }
                    if (ent.__removeFlag) {
                        this.entityList.splice(i, 1);
                        i--;
                    }
                }
                this.moveAndCollideEntities();
            }
            //recalc priority
			var renderList = this.entityList.slice();
			this.recalcPriority(renderList);
			//draw them all
            for (var _i = 0, _a = renderList; _i < _a.length; _i++) {
                var ent_1 = _a[_i];
                ent_1.__draw(this.drawContext);
            }
			
			//this.camera.set(this.scene.x,this.scene.y);
            
			//update whether or not keys were pressed last frame
            //(allows isHeldOneFrame() to work)
            this.controls.updateKeyData();
            this.firstFrame = false;
			this.scene.firstFrame = false;
            //schedule a update call next frame if needed
            if (!this.isStopped())
                requestAnimationFrame(function () { _this.update(); });
			else
				this.drawContext.clearRect(0,0,this.canvas.width,this.canvas.height);
		};
		GameRunner.prototype.cloneEntity = function(ent){
			
			if(!ent)return null;
			
			// clone
			var clonedAnimators = ent.cloneAnimators();
			var cloned = ent.constructor.constructEntity(ent);
			cloned.__guid = cloned.__generateGUID();
			cloned.animators = clonedAnimators;
			Game.entityList.push(cloned);
			return cloned;
			
		};
        /**
         * Adds an entity to the game world and reorders all entities based on their priority property
         **/
        GameRunner.prototype.addEntity = function (ent) {
			//ent.parent = this.scene;
            this.entityList.push(ent);
            //this.recalcPriority();
        };
        /**
         * Sort entityList in ascending order based on their priority property.
         **/
        /* GameRunner.prototype.recalcPriority1 = function () {
            var list = this.entityList;
            setTimeout(function () {
                list.sort(function (a, b) {
                    return a.priority - b.priority;
                });
            }, 0);
        }; */
		
		/**
         * Sort entityList in ascending order based on their priority property.
         **/
        GameRunner.prototype.recalcPriority = function (list) {
         
			list.sort(function (a, b) { 
			return a.priority - b.priority;
			});
			
        };
        /**
         * Get an entity in the world by its name in O(n) time.
         **/
        GameRunner.prototype.getEntityByName = function (s) {
            for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                if (ent.name === s)
                    return ent;
            }
            return null;
        };
		
		/**
         * Get an entity in the world by its id in O(n) time.
         **/
        GameRunner.prototype.getEntityById = function (s) {
			
			if(s == 1) return Game.scene;
			
            for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                if (ent.__guid === s)
                    return ent;
            }
            return null;
        };
		
		  GameRunner.prototype.getEntitiesByName = function (name) {
            var entities = [];
			for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                if (ent.name === name)
                    entities.push(ent);
            }
            return entities;
        };
		
		GameRunner.prototype.addScene = function(scene)
		{
			if (scene)
			{
				this.scenes.push(scene);
			}
		};
		
		GameRunner.prototype.setActiveScene = function(scene)
		{
			if (scene)
			{
				for (var i = 0; i<this.scenes.length; ++i)this.scenes[i].active = false;
				this.scene = scene;
				this.scene.active = true;
			}
		};
		
		GameRunner.prototype.removeScene = function(scene)
		{
			for (var i = 0; i<this.scenes.length; ++i)
			{
				if (this.scenes[i] === scene)
				{
					this.scenes.splice(i, 1);
					return;
				}
			}
		};
		
		GameRunner.prototype.resetScene = function(scene){
			
			var index = this.scenes.indexOf(scene);
			this.scenes[index] = scene_1.Scene.constructScene(this.backupScenes[index]);
			
			return this.scenes[index];
		};
		
		GameRunner.prototype.switchToScene = function (scene,reset) {
            var _this = this;
			this.preventDefault = true;
			
			this.backupSceneTimer(this.scene);
			this.pauseSounds(this.scene);
		
            //if (this.state != State.stopped)
               // return;
			
			if(reset)//scene.firstFrame = true;
				scene = this.resetScene(scene);
			
			this.controls = new Controls();
			
			this.setActiveScene(scene);	
			this.entityList = this.scene.children;
			
			if(this.scene.firstFrame == false){
				//this.state = State.running;
				//this.resetTimer();
				this.backupTimer(scene);
				this.resumeSounds(scene);
				
				requestAnimationFrame(function () { _this.update(); });
				return;
			}
			
            
			//this.recalcPriority();
			this.stopSounds(this.scene);
            this.state = State.running;
			
			var scene = this.scene;
			this.tryUserFunc(function () { scene.__onGameStart(null); });
			
            var _loop_1 = function (ent) {
                this_1.tryUserFunc(function () { ent.__onGameStart(null); });
            };
			
			this.tryUserFunc(function () { Game.initAnimators(); });
			
            var this_1 = this;
            //run first frame entity code if it's the start
            for (var _i = 0, _a = this.entityList; _i < _a.length; _i++) {
                var ent = _a[_i];
                _loop_1(ent);
            }
			
			this.resetTimer();
            requestAnimationFrame(function () { _this.update(); });
        };
		
		GameRunner.prototype.getSceneByName = function(name)
		{
			for (var i = 0; i<this.scenes.length; ++i)
			{
				if (this.scenes[i].name === name)
				{
					return this.scenes[i];
				}
			}
		};
		
		GameRunner.prototype.getScene = function(index)
		{
			for (var i = 0; i<this.scenes.length; ++i)
			{
				if (i === index)
				{
					return this.scenes[i];
				}
			}
		};
		
		GameRunner.prototype.setVariable = function (name, value) {
			this.variables[name] = value;
		};
		
		GameRunner.prototype.getVariable = function (name) {
			return this.variables[name];
		};
		
		GameRunner.prototype.hasVariable = function (name) {
			return this.variables[name]?true:false;
		};
		
		GameRunner.prototype.removeVariable = function (name) {
			return delete this.variables[name];
		};
		
		GameRunner.prototype.pointInBox = function (point, box) {
            return point.x > box.x && point.x < box.x + box.width && point.y > box.y && point.y < box.y + box.height;
        };
		
		GameRunner.prototype.boxInBox = function (box, box1) {
            return box1.x > box.x && box1.y > box.y && box1.x + box1.width < box.x + box.width && box1.y + box1.height < box.y + box.height;
        };
		
		GameRunner.prototype.updateTimer = function(){
			
			var now = new Date();
			this.timeElapsed += this.deltaTime;
			this.deltaTime = now - this.startTime;
			this.startTime = now;
				
			return {delta:this.deltaTime,timeElapsed:this.timeElapsed};
			
		};
		
		GameRunner.prototype.resetTimer = function(){
			
			//this.firstTime = new Date();
			this.startTime = new Date();
			this.timeElapsed = 0;
			this.deltaTime = 0;
			
			//return {delta:this.deltaTime,timeElapsed = this.timeElapsed};
		};
		
		GameRunner.prototype.currentTimer = function(){
			
			return {delta:this.deltaTime,timeElapsed : this.timeElapsed};			
		};
		
		GameRunner.prototype.backupSceneTimer = function(scene){
			
			//scene.firstTime = this.firstTime;
			scene.timeElapsed = this.timeElapsed;
			
		};
		
		GameRunner.prototype.backupTimer = function(scene){
			
			//this.firstTime = scene.firstTime;
			this.timeElapsed = scene.timeElapsed;
			//this.firstTime = new Date(Date.now() + scene.timeElapsed);
			
			
		};
		
		GameRunner.prototype.print = function(text){	
			
			if(window.parent.Editor){
				window.parent.Editor.clearConsole();
				window.parent.Editor.log(text);
			}
			
		};
		
		GameRunner.prototype.log = function(text){	
			
			if(window.parent.Editor)
				window.parent.Editor.log(text);
			
		};
		
		GameRunner.prototype.error = function(text){	
			
			if(window.parent.Editor)
				window.parent.Editor.error(text);
			
		};
		
		GameRunner.prototype.clearConsole = function(){	
			
			if(window.parent.Editor)
				window.parent.Editor.clearConsole();
			
		};
		
		// Enter fullscreen
		GameRunner.prototype.fullscreen = function(){
			var canvas = this.canvas;
			
			if(canvas.RequestFullScreen){
				canvas.RequestFullScreen();
			}else if(canvas.webkitRequestFullScreen){
				canvas.webkitRequestFullScreen();
			}else if(canvas.mozRequestFullScreen){
				canvas.mozRequestFullScreen();
			}else if(canvas.msRequestFullscreen){
				canvas.msRequestFullscreen();
			}else{
				alert("This browser doesn't supporter fullscreen");
			}
		};

		// Exit fullscreen
		GameRunner.prototype.exitFullscreen = function(){
			var canvas = this.canvas;
		
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}else{
				alert("Exit fullscreen doesn't work");
			}
		};
		
		GameRunner.prototype.switchFullscreen = function(){
			
			var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
			(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
			(document.msFullscreenElement && document.msFullscreenElement !== null);
			
			if(isInFullScreen)this.exitFullscreen();
			else this.fullscreen();
		
		};
		
		GameRunner.prototype.setInterval = function(func,time,self){
			if(( typeof func  != 'function'))return;
			time = Number(time);
			if(!time)return;
			
			return this.intervals.push( setInterval(function(){func.call(self)},time));
		};
		GameRunner.prototype.clearIntervals = function(){
			for(var i = 0; i<=this.intervals.length-1;i++)clearInterval(this.intervals[i]);
			this.intervals.length = 0;		
		};
		GameRunner.prototype.clearInterval = function(interval){
			clearInterval(interval);
		}
		
		//other-ko me udario, direction-njegov pravac
        /**
         * Handle the moving and colliding of all entities in the game world.
         *   0) reset all blocked properties to false
         *   1) update all entity x positions based on their velX
         *   2) check all entity collisions in the x direction, triggering their event hooks
         *   3) update all entity y positions based on their velY
         *   4) check all entity collisions in the y direction, triggering their event hooks
         *
         * Entities with collides=false will not be checked for collision.
         **/
        GameRunner.prototype.moveAndCollideEntities = function () {
           
			this.step(0.05);
			this.CollideEntities();
			
        };

		// Rect collision tests the edges of each rect to
		// test whether the objects are overlapping the other
		GameRunner.prototype.collideRect = function(collider, collidee) {

			// Store the collider and collidee edges
			var l1 = collider.getLeft();
			var t1 = collider.getTop();
			var r1 = collider.getRight();
			var b1 = collider.getBottom();
			
			var l2 = collidee.getLeft();
			var t2 = collidee.getTop();
			var r2 = collidee.getRight();
			var b2 = collidee.getBottom();
			
			// If the any of the edges are beyond any of the
			// others, then we know that the box cannot be
			// colliding
			if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
				return false;
			}
			
			// If the algorithm made it here, it had to collide
			return true;
		};



		GameRunner.prototype.resolveElastic =  function(player, entity) {
			// Find the mid points of the entity and player
			var pMidX = player.getMidX();
			var pMidY = player.getMidY();
			var aMidX = entity.getMidX();
			var aMidY = entity.getMidY();
			
			var STICKY_THRESHOLD = .0004;
			// To find the side of entry calculate based on
			// the normalized sides
			var dx = (aMidX - pMidX) / entity.halfWidth;
			var dy = (aMidY - pMidY) / entity.halfHeight;
			
			// Calculate the absolute change in x and y
			var absDX = Math.abs(dx);
			var absDY = Math.abs(dy);
			
			// If the distance between the normalized x and y
			// position is less than a small threshold (.1 in this case)
			// then this object is approaching from a corner
			if (Math.abs(absDX - absDY) < .1) {

				// If the player is approaching from positive X
				if (dx < 0) {

					// Set the player x to the right side
					player.x = entity.getRight();

				// If the player is approaching from negative X
				} else {

					// Set the player x to the left side
					player.x = entity.getLeft() - player.width;
				}

				// If the player is approaching from positive Y
				if (dy < 0) {

					// Set the player y to the bottom
					player.y = entity.getBottom();

				// If the player is approaching from negative Y
				} else {

					// Set the player y to the top
					player.y = entity.getTop() - player.height;
				}
				
				// Randomly select a x/y direction to reflect velocity on
				if (Math.random() < .5) {

					// Reflect the velocity at a reduced rate
					player.velX = -player.velX * entity.restitution;

					// If the object’s velocity is nearing 0, set it to 0
					// STICKY_THRESHOLD is set to .0004
					if (Math.abs(player.velX) < STICKY_THRESHOLD) {
						player.velX = 0;
					}
				} else {

					player.velY = -player.velY * entity.restitution;
					if (Math.abs(player.velY) < STICKY_THRESHOLD) {
						player.velY = 0;
					}
				}

			// If the object is approaching from the sides
			} else if (absDX > absDY) {

				// If the player is approaching from positive X
				if (dx < 0) {
					player.x = entity.getRight();

				} else {
				// If the player is approaching from negative X
					player.x = entity.getLeft() - player.width;
				}
				
				// Velocity component
				player.velX = -player.velX * entity.restitution;

				if (Math.abs(player.velX) < STICKY_THRESHOLD) {
					player.velX = 0;
				}

			// If this collision is coming from the top or bottom more
			} else {

				// If the player is approaching from positive Y
				if (dy < 0) {
					player.y = entity.getBottom();

				} else {
				// If the player is approaching from negative Y
					player.y = entity.getTop() - player.height;
				}
				
				// Velocity component
				player.velY = -player.velY * entity.restitution;
				if (Math.abs(player.velY) < STICKY_THRESHOLD) {
					player.velY = 0;
				}
			}
		};


		GameRunner.prototype.step = function(elapsed) {
			
			var gx = 0;//GRAVITY_X * elapsed;
			var gy = this.scene.gravity * elapsed;
			var entity;
			var entities = this.entityList;
			
			var KINEMATIC = 'kinematic';
			var DYNAMIC   = 'dynamic';
			//var DISPLACE = 'displace';
			//var ELASTIC = 'elastic';
			
			for (var i = 0, length = entities.length; i < length; i++) {
				entity = entities[i];
				
				switch (entity.physicType) {
					case DYNAMIC:
						entity.velX += entity.ax * elapsed + gx;
						entity.velY += entity.ay * elapsed + gy;
						entity.x  += entity.velX * elapsed;
						entity.y  += entity.velY * elapsed;
						break;
					case KINEMATIC:
						entity.velX += entity.ax * elapsed;
						entity.velY += entity.ay * elapsed;
						entity.x  += entity.velX * elapsed;
						entity.y  += entity.velY * elapsed;
						break;
				}
				entity.updateBounds();
			}
		};

		GameRunner.prototype.CollideEntities = function(){
			
			for (var a = 0; a < this.entityList.length; a++) {
				var entA = this.entityList[a];
				if (!entA.collides)
					continue;
				for (var b = a + 1; b < this.entityList.length; b++) {
					var entB = this.entityList[b];
					if (!entB.collides)
						continue;
					if (this.collideRect(entA, entB)) {
						var entAEvent = {
							other: entB,
							//direction: dirs[0]
						};
						var entBEvent = {
							other: entA,
						   // direction: dirs[1]
						};
						
						if(entA.collision){
							
							//this.resolveElastic(entA,entB);
							
						}
						
						this.tryUserFunc(function () { entA.__onCollision(entAEvent); });
						this.tryUserFunc(function () { entB.__onCollision(entBEvent); });
						
						var event = entAEvent;
						event.name = 'onCollision';
						Game.handleEvent(entA,event);
						
						var event = entBEvent;
						event.name = 'onCollision';
						Game.handleEvent(entB,event);
						
					}
				}
			}
			
		};
        /**
         * Attemps to call a user-defined hook in a safe manner,
         * stopping the game if an exception is thrown.
         **/
        GameRunner.prototype.tryUserFunc = function (func) {
            try {
                func();
            }
            catch (e) {
                console.log(e);
				Game.error(e);
                this.stop();
            }
        };
		GameRunner.prototype.getMouse = function (event) {
			
			var mouse = {x : 0, y : 0};
			var myCan = this.canvas;
			
			var bounds = myCan.getBoundingClientRect();
			// get the mouse coordinates, subtract the canvas top left and any scrolling
			mouse.x = event.clientX - bounds.left;
			mouse.y = event.clientY - bounds.top ;
              // first normalize the mouse coordinates from 0 to 1 (0,0) top left
			  // off canvas and (1,1) bottom right by dividing by the bounds width and height
		   mouse.x /=  bounds.width; 
		   mouse.y /=  bounds.height; 

		   // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

		   mouse.x *= myCan.width;
		   mouse.y *= myCan.height;
		   
		   return mouse;
			
		};
		
		GameRunner.prototype.handleMouseEvent = function(event){
			var evt = {};
			evt.x = this.controls.mouse.x;
			evt.y = this.controls.mouse.y;
			
			evt.key = event.which;
			var type = event.type;
			
			if(this.autoResize){
				
				evt.x = this.getMouse(event).x;
				evt.y = this.getMouse(event).y;
				
			}
			
			var worldPos = this.camera.screenToWorld(evt.x,evt.y);
			evt.x = worldPos.x;
			evt.y = worldPos.y;
			
			event = evt;
			
			
			if(type == 'mousedown')this.mouseBuffer = [];
			
			//draw them all
            for (var _i = -1, _a = this.entityList; _i < _a.length; _i++) {
                
				if(_i<0){
					var ent_1 = this.scene;
					var flag = true;
				}else{
					var ent_1 = _a[_i];
					var flag = this.pointInBox(evt,ent_1)
				}
				
				if(flag){
					
					if(type == 'mousedown'){
						if(ent_1.onmousedown)
							ent_1.onmousedown.call(ent_1,evt);
						
						event.name = 'onMouseDown';
						Game.handleEvent(ent_1,event);
						this.mouseBuffer.push(ent_1);
					}	
					if(type == 'mouseup'){
						if(ent_1.onmouseup)
							ent_1.onmouseup.call(ent_1,evt);
						
						event.name = 'onMouseUp';
						Game.handleEvent(ent_1,event);
						
						if(this.mouseBuffer.includes(ent_1)){
							evt.type = 'click';
							if(ent_1.onclick)
							ent_1.onclick.call(ent_1,evt);
						
							event.name = 'onClick';
							Game.handleEvent(ent_1,event);
						}
					}
					if(type == 'mousemove'){
						if(ent_1.onmouseover)
							ent_1.onmouseover.call(ent_1,evt);
					
						event.name = 'onMouseOver';
						Game.handleEvent(ent_1,event);
					}
				}else{
					if(type == 'mousemove'){
						if(ent_1.onmouseout)
							ent_1.onmouseout.call(ent_1,evt);
						
						event.name = 'onMouseOut';
						Game.handleEvent(ent_1,event);
					}
				};
			};	
		};
		
		GameRunner.prototype.handleKeyEvent = function(event){
		
			var key = event.which;
			var type = event.type;
						
			//draw them all enities
            for (var _i = -1, _a = this.entityList; _i < _a.length; _i++) {
                
				if(_i<0)var ent_1 = this.scene;
				else
				var ent_1 = _a[_i];
		
					if(type == 'keyup'){
						if(ent_1.onkeyup)
							ent_1.onkeyup.call(ent_1,key);
						
						event.name = 'onKeyUp';
						Game.handleEvent(ent_1,event);
					}	
					if(type == 'keydown'){
						if(ent_1.onkeydown)
							ent_1.onkeydown.call(ent_1,key);
						
						event.name = 'onKeyDown';
						Game.handleEvent(ent_1,event);
					}
					if(type == 'keypress'){
						if(ent_1.onkeypress)
							ent_1.onkeypress.call(ent_1,key);		
						
						event.name = 'onKeyPress';
						Game.handleEvent(ent_1,event);
					}
			};	
		};
		
        GameRunner.prototype.onKeyDown = function (event) {
            if (!this.isRunning())
                return;
            this.controls.handleKeyEvent(event, true);
			this.handleKeyEvent(event);
        };
        GameRunner.prototype.onKeyUp = function (event) {
            if (!this.isRunning())
                return;
            this.controls.handleKeyEvent(event, false);
			this.handleKeyEvent(event);
        };
		GameRunner.prototype.onKeyPress = function (event) {
            if (!this.isRunning())
                return;
			this.handleKeyEvent(event);
        };
		
		GameRunner.prototype.onMouseDown = function (event) {
            if (!this.isRunning())
                return;
			this.handleMouseEvent(event);
            this.controls.handleKeyEvent(event, true);
        };
        GameRunner.prototype.onMouseUp = function (event) {
            if (!this.isRunning())
                return;
			
			this.handleMouseEvent(event);
            this.controls.handleKeyEvent(event, false);
        };
		
		GameRunner.prototype.onMouseMove = function (event) {
            if (!this.isRunning())
                return;
			this.handleMouseEvent(event);
            this.controls.handleMouseMoveEvent(event);
        };
		
		GameRunner.prototype.onMouseClick = function (event) {
            if (!this.isRunning())
                return;
			this.handleMouseEvent(event);
        };
		GameRunner.prototype.initAnimators = function(){
			
			var this_1 = this;
            //run first frame entity code if it's the start
            for (var _i = -1, _a = this.entityList; _i < _a.length; _i++) {
                
				if(_i<0)var ent = this.scene;
				else
				var ent = _a[_i];
			
				var code = ent.animators;
				ent.animators = [];
				
                eval(this.BehsToCode(JSON.parse(code)));
            }
			
		};
		
		GameRunner.prototype.updateAnimators = function(ent,event){
            
			for (var i = 0; i < ent.animators.length; i++) {
				ent.animators[i].animateNode(ent,event)
			}
			
		};
		
		GameRunner.prototype.handleEvent = function(ent,event){
			for (var i = 0; i < ent.animators.length; i++) {
				ent.animators[i][event.name](event,ent)
			}
		};
		
		GameRunner.prototype.BehsToCode = function (behs) {
				var code = '';
				
				for(var i in behs)
				
					if(behs[i].jsname) {
						code += 'ent.animators.push(new ZICA.'+ behs[i].jsname + '({';
							//var helpobj = {};
							for(var ii in behs[i]){
								if(Array.isArray(behs[i][ii])){
									
									code += "'" +ii+"'" + ':' + this.replaceAttr(behs[i][ii][0],behs[i][ii][1],behs[i][ii][2]) +',';
									//helpobj[ii] = replaceAttr(behs[i][ii][0],behs[i][ii][1]);
								
								}
							
							}
							//code += JSON.stringify(helpobj);
							code = code.substring(0,code.length-1);
							code += '}));\n';
							
					}
					
				return code;
				}
				
				GameRunner.prototype.ActsToCode = function (acts) {
				var code = '';
				code += 'new ZICA.ActionHandler([';
				for(var i in acts)
				
					if(acts[i].jsname) {
						code += 'new ZICA.Action.'+ acts[i].jsname + '({';
							//var helpobj = {};
							for(var ii in acts[i]){
								if(Array.isArray(acts[i][ii])){
									
									code += "'" +ii+"'" + ':' + this.replaceAttr(acts[i][ii][0],acts[i][ii][1],acts[i][ii][2]) +',';
									//helpobj[ii] = replaceAttr(behs[i][ii][0],behs[i][ii][1]);
								
								}
							
							}
							//code += JSON.stringify(helpobj);
							code = code.substring(0,code.length-1);
							code += '}),';
							
					}
					if(code[code.length-1] == ',')code = code.substring(0,code.length-1);
					code += '])';
				return code;
				}
				
				GameRunner.prototype.replaceAttr = function (type,value,id) {
					
					if(type == 'int' || type == 'float' || type == 'slider') return Number(value);
					if(type == 'bool') return value;
					if(type == 'string') return JSON.stringify(value);
					if(type == 'image') return JSON.stringify(value);
					if(type == 'color') return JSON.stringify(value);
					if(type == 'vect3d') return 'new ZICA.Vect3d('+JSON.parse(value)[0]+','+JSON.parse(value)[1]+','+JSON.parse(value)[2]+')';
					if(type == 'vect2d') return 'new ZICA.Vect2d('+JSON.parse(value)[0]+','+JSON.parse(value)[1]+')';
					
					if(type == 'action') return this.ActsToCode(value);
					
					if(type == 'combo') return JSON.stringify(value);
					if(type == 'propcombo') return JSON.stringify(value);
					if(type == 'array') return JSON.stringify(value);
					
					if(type == 'audio') return JSON.stringify(value);
					if(type == 'animation') return JSON.stringify(value);
					if(type == 'scene') return JSON.stringify(value);
					
				    if(type == 'node') return id?JSON.stringify(id):'null';
					if(type == 'hidden') return JSON.stringify(value);
					//if(type == 'texture') return 'engine.getTextureManager().getTexture("'+value+'", true)' ;
				}
		
		GameRunner.constructApp = function (game , toGame) {
			
			var keys = ['name','version','author','description','width','height','__globalString','assets','autoSize','autoResize','pointerLock','fullScreen','icon','logo','showProgress'];
            
			var result = {};
			if(toGame) result = toGame;
			
			var active = null;
			
			//result.asset = Editor.getAsset(); 
				
            for (var key in game) {
                
				if(key == 'scenes'){
				    result.scenes = [];
					result.backupScenes = [];
					for (var i = 0; i < game.scenes.length; i++) {
					var copied = scene_1.Scene.constructScene(game.scenes[i]);
					var copied1 = scene_1.Scene.constructScene(game.scenes[i]);
					result.scenes.push(copied);
					result.backupScenes.push(copied1);
					if(copied.active)result.scene = copied;
					}
				}else{
					
				if(keys.indexOf(key) != -1)
					result[key] = game[key];
				
				if(game && key == '__globalString')
					result.__global = new Function("event", game[key]);
			
				}
            }
            return result;
        };
		
        return GameRunner;
    }());
    exports.GameRunner = GameRunner;
    var Controls = (function () {
        function Controls() {
            //populates with data of the form {pressed, wasPressed} as each new key is pressed for the first time
            this.keyData = {};
			this.mouse = {x:0,y:0};
        }
        /**
         * Returns whether the player is holding a key.
         * Can take a string describing the key (see keys.js) or the integer keycode.
         **/
        Controls.prototype.isHeld = function (key) {
            if (typeof key !== "number")
                key = keys_1.Keys[key];
            if (!(key in this.keyData)) {
                return false;
            }
            else
                return this.keyData[key].pressed;
        };
        /**
         * Returns whether the player just pressed a key this frame.
         * Can take a string describing the key (see keys.js) or the integer keycode.
         **/
        Controls.prototype.isHeldOneFrame = function (key) {
            if (typeof key !== "number")
                key = keys_1.Keys[key];
            if (!(key in this.keyData)) {
                return false;
            }
            else {
                var data = this.keyData[key];
                return data.pressed && !data.wasPressed;
            }
        };
        /**
         * Update whether or not each key was pressed last frame
         **/
        Controls.prototype.updateKeyData = function () {
            for (var key in this.keyData) {
                var data = this.keyData[key];
                data.wasPressed = data.pressed;
            }
        };
        /**
         * Function merging the handling of key up and key down events.
         * The engine wraps these such that a user can simply poll whether or not a key was pressed whenever they want.
         **/
        Controls.prototype.handleKeyEvent = function (event, isHeldDown) {
				//console.log(event.type);
            if (!(event.which in this.keyData)) {
                this.keyData[event.which] = { pressed: isHeldDown, wasPressed: false };
            }
            else {
                this.keyData[event.which].pressed = isHeldDown;
            }
        };
		
		Controls.prototype.handleMouseMoveEvent = function (event) {
			
           var Mouse = {};
			Mouse.x = 0;
			Mouse.y = 0;
			
			var elem = event.currentTarget;
				
			  
			if (event.touches){
				  
			if (event.touches.length){
				Mouse.x = parseInt(event.touches[0].pageX);
				Mouse.y = parseInt(event.touches[0].pageY);
			}
			}else{
				// mouse events
				Mouse.x = parseInt(event.clientX);
				Mouse.y = parseInt(event.clientY);
			}

			var rect = elem.getBoundingClientRect();
			Mouse.x += elem.scrollLeft - elem.clientLeft - rect.left;
			Mouse.y += elem.scrollTop - elem.clientTop - rect.top;
			this.mouse.x =  Mouse.x;
			this.mouse.y = Mouse.y;
			
			};
		
		
        return Controls;
    }());
});


var touchToMouse = function(event) {
    if (event.touches.length > 1) return; //allow default multi-touch gestures to work
    var touch = event.changedTouches[0];
    var type = "";
    
    switch (event.type) {
    case "touchstart": 
        type = "mousedown"; break;
    case "touchmove":  
        type="mousemove";   break;
    case "touchend":   
        type="mouseup";     break;
    default: 
        return;
    }
    
    // https://developer.mozilla.org/en/DOM/event.initMouseEvent for API
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
            touch.screenX, touch.screenY, 
            touch.clientX, touch.clientY, false, 
            false, false, false, 0, null);
    
	//event.preventDefault();
    touch.target.dispatchEvent(simulatedEvent);
    
};
//document.ontouchstart = touchToMouse;
//document.ontouchmove = touchToMouse;
//document.ontouchend = touchToMouse;

// Go to the end of the file to see the example

/// START OF THE mltext.js LIBRARY
// Library: mllib.js
// Desciption: Extends the CanvasRenderingContext2D that adds two functions: mlFillText and mlStrokeText.
//
// The prototypes are:
//
// function mlFillText(text,x,y,w,h,vAlign,hAlign,lineheight);
// function mlStrokeText(text,x,y,w,h,vAlign,hAlign,lineheight);
//
// Where vAlign can be: "top", "center" or "button"
// And hAlign can be: "left", "center", "right" or "justify"
// Author: Jordi Baylina. (baylina at uniclau.com)
// License: GPL
// Date: 2013-02-21

function mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, fn) {

    // The objective of this part of the code is to generate an array of words. 
    // There will be a special word called '\n' that indicates a separation of paragraphs.
    text = String(text);
	text = text.replace(/\r/g, '');
    var words = [];
    var inLines = text.split('\n');
    var i;
    for (i=0; i < inLines.length; i++)
    {
    	if (i) words.push('\n');
    	words = words.concat( inLines[i].split(' ') );
    }
    // words now contains the array.


    // Next objective is generate an array of lines where each line has a property 
    // called Words with all the words that fits in the line. Each word contains 2 fields:
    // .word for the actual word and .l for the length o the word.
    // If the line is the last line of a paragraps, the property EndOfParagraph will be true
    var sp = this.measureText(' ').width;
    var lines = [];
    var actualline = 0;
    var actualsize = 0;
    var wo;
    lines[actualline] = {};
    lines[actualline].Words = [];
    i = 0;
    while (i < words.length) {
        var word = words[i];
        if (word == "\n") {
            lines[actualline].EndParagraph = true;
            actualline++;
            actualsize = 0;
            lines[actualline] = {};
            lines[actualline].Words = [];
            i++;
        } else {
            wo = {};
            wo.l = this.measureText(word).width;
            if (actualsize === 0) {

                // If the word does not fit in one line, we split the word
                while (wo.l > w) {
                    word = word.slice(0, word.length - 1);
                    wo.l = this.measureText(word).width;
                }

                wo.word = word;
                lines[actualline].Words.push(wo);
                actualsize = wo.l;
                if (word != words[i]) {
                    // if a single letter does not fit in one line, just return without painting nothing.
                    if (word === "") return;
                    words[i] = words[i].slice(word.length, words[i].length);
                } else {
                    i++;
                }
            } else {
                if (actualsize + sp + wo.l > w) {
                    lines[actualline].EndParagraph = false;
                    actualline++;
                    actualsize = 0;
                    lines[actualline] = {};
                    lines[actualline].Words = [];
                } else {
                    wo.word = word;
                    lines[actualline].Words.push(wo);
                    actualsize += sp + wo.l;
                    i++;
                }
            }
        }
    }
    if (actualsize === 0) lines.pop(); // We remove the last line if we have not added any thing here.

    // The last line will be allways the last line of a paragraph even if it does not end with a  /n
    if(lines[actualline])
	lines[actualline].EndParagraph = true;


    // Now we remove any line that does not fit in the heigth.
    var totalH = lineheight * lines.length;
    while (totalH > h) {
        lines.pop();
        totalH = lineheight * lines.length;
    }

    // Now we calculete where we start draw the text.
    var yy;
    if (vAlign == "bottom") {
        yy = y + h - totalH + lineheight;
    } else if (vAlign == "center") {
        yy = y + h / 2 - totalH / 2 + lineheight;
    } else {
        yy = y + lineheight;
    }

    var oldTextAlign = this.textAlign;
    this.textAlign = "left"; // we will draw word by word.

	var maxWidth = 0;
    for (var li in lines) {
    	if (!lines.hasOwnProperty(li)) continue;
        var totallen = 0;
        var xx, usp;


        for (wo in lines[li].Words) {
            if (!lines[li].Words.hasOwnProperty(wo)) continue;
            totallen += lines[li].Words[wo].l;
        }
        // Here we calculate the x position and the distance betwen words in pixels 
        if (hAlign == "center") {
            usp = sp;
            xx = x + w / 2 - (totallen + sp * (lines[li].Words.length - 1)) / 2;
        } else if ((hAlign == "justify") && (!lines[li].EndParagraph)) {
            xx = x;
            usp = (w - totallen) / (lines[li].Words.length - 1);
        } else if (hAlign == "right") {
            xx = x + w - (totallen + sp * (lines[li].Words.length - 1));
            usp = sp;
        } else { // left
            xx = x;
            usp = sp;
        }
        for (wo in lines[li].Words) {
	    	if (!lines[li].Words.hasOwnProperty(wo)) continue;
            if (fn == "strokeText" || fn=="fillStrokeText") {
                this.strokeText(lines[li].Words[wo].word, xx, yy);
            }
            if (fn == "fillText" || fn=="fillStrokeText") {
                this.fillText(lines[li].Words[wo].word, xx, yy);
            }
            xx += lines[li].Words[wo].l + usp;
        }
        maxWidth = Math.max(maxWidth, xx);
        yy += lineheight;
    }
    this.textAlign = oldTextAlign;

    return {
    	width: maxWidth,
    	height: totalH,
    };
}

(function mlInit() {
    CanvasRenderingContext2D.prototype.mlFunction = mlFunction;

    CanvasRenderingContext2D.prototype.mlFillText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
        return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "fillText");
    };

    CanvasRenderingContext2D.prototype.mlStrokeText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
        return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "strokeText");
    };

    CanvasRenderingContext2D.prototype.mlFillStrokeText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
        return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "fillStrokeText");
    };

})();
