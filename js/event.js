
        function EventViewModel() {
            this.eventEditor = null;
            this.selected = null;
			this.selectDOM = document.getElementById('select-event');
			this.selectDOM.onchange = function(){
				Editor.eventViewModel.updateEventEditor();
			}
            this.eventFuncs = [
				{ funcName: "__global", prettyName: "Global" },
                { funcName: "__onGameStart", prettyName: "Game Start" },
                { funcName: "__onUpdate", prettyName: "Every Frame" },
                { funcName: "__onCollision", prettyName: "On Collision" },
            ];
			
			for(var i in this.eventFuncs){
				var option = document.createElement('option');
				option.label = this.eventFuncs[i].prettyName;
				option.value = this.eventFuncs[i].funcName;
				if(this.eventFuncs[i].prettyName == 'Game Start')option.setAttribute('selected','');
				this.selectDOM.appendChild(option);
			}
            // funcBodyText = ko.observable("");
            //this.chosenEvent = ko.observable("");
			/* this.chosenEvent = function (){
				
				return document.getElementById('select-event').value;
			} */
            /* this.eventEditor = window["monaco"].editor.create(document.getElementById('event-editor'), {
                value: "",
                language: "javascript",
                fontFamily: "Inconsolata-g",
                lineNumbers: "on",
                fontSize: 13,
				theme : "vs-dark"
            });
            this.eventEditor.getModel().updateOptions({ tabSize: 2 }); */
            // showAutocompletion({
            //   "Shell": new Entity(),
            //   "Game": game,
            //   "Direction": {up: 0, down: 1, left: 2, right: 3}
            // });
        }
		EventViewModel.prototype.initEditor = function(){
					
			if(this.isCreated)return;
			
			this.eventEditor = window["monaco"].editor.create(document.getElementById('event-editor'), {
                value: "",
                language: "javascript",
                fontFamily: "Inconsolata-g",
                lineNumbers: "on",
                fontSize: 13,
				//contextmenu:false,
				automaticLayout: true, // the important part
				theme : "vs-dark"
            });
            this.eventEditor.getModel().updateOptions({ tabSize: 2 });
			var self = this;
			this.eventEditor.onDidChangeModelContent(function (e) {
				
				if(self.chosenEvent() == '__global'){	
					Game[self.chosenEvent() + "String"] = self.eventEditor.getValue();	
					return;
				}
				
				if(self.selected)
				self.selected[self.chosenEvent() + "String"] = self.eventEditor.getValue();
			});
			this.isCreated = true;
			this.updateEventEditor();
		};
		
		EventViewModel.prototype.undo = function (){	
			this.eventEditor.getModel().undo();

		};
		
		EventViewModel.prototype.redo = function (){	
			this.eventEditor.getModel().redo();
		};
		
		EventViewModel.prototype.copy = function (){	
			//this.eventEditor.focus();
			//document.execCommand('copy');
			var text = this.getSelection();
			navigator.clipboard.writeText(text);
		};
		EventViewModel.prototype.cut = function (){	
			this.eventEditor.focus();
			document.execCommand('cut');
		};
		EventViewModel.prototype.paste = function (){
			
			this.eventEditor.focus();
			var _this = this;
			navigator.clipboard.readText()
			.then(text => {
				this.eventEditor.trigger('keyboard', 'type', {text: text});
			})
			.catch(err => {
				console.error('Failed to read clipboard contents: ', err);
			});

			//document.execCommand('paste');
		};
		EventViewModel.prototype.getSelection = function(){
			this.eventEditor.focus();
			return this.eventEditor.getModel().getValueInRange(this.eventEditor.getSelection());
		};
		EventViewModel.prototype.find = function (){	
			this.eventEditor.focus();
			this.eventEditor.trigger('source','actions.find');
		};
		EventViewModel.prototype.goToLine = function (){	
			this.eventEditor.focus();
			this.eventEditor.trigger('source','editor.action.gotoLine');
		};
		
		EventViewModel.prototype.chosenEvent = function (){
				
				return document.getElementById('select-event').value;
		};
			
        EventViewModel.prototype.selectEntity = function (ent) {
            this.selected = ent;
        };
        /**
         * Switches the event editor tabs.
         **/
        EventViewModel.prototype.onEventTabClick = function (event, data) {
            this.chosenEvent(data.funcName);
            this.updateEventEditor();
        };
	
        /**
         * Try to compile a function with the code in the event editor box.
         * If there's a syntax error, a popup will come up and neither the function member or its text member will change.
         **/
        EventViewModel.prototype.onEventApplyButtonClick = function (event) {
            try {
                if (this.chosenEvent() == "")
                    return;
				if(this.chosenEvent() == '__global'){
					var func = new Function("event", this.eventEditor.getValue());
					Game[this.chosenEvent()] = func;
					Game[this.chosenEvent() + "String"] = this.eventEditor.getValue();
					this.updateEventEditor();
					return;
				}
				
                var func = new Function("event", this.eventEditor.getValue());
                this.selected[this.chosenEvent()] = func;
                this.selected[this.chosenEvent() + "String"] = this.eventEditor.getValue();
                this.updateEventEditor();
            }
            catch (e) {
                alert(e);
				Editor.error(e);
            }
        };
		
		EventViewModel.prototype.eventApply = function (event) {
            try {
				
				for(var i in this.eventFuncs){
                
				if(this.eventFuncs[i].funcName == '__global')continue;
				var func = new Function("event", this.selected[this.eventFuncs[i].funcName + "String"]);
                this.selected[this.eventFuncs[i].funcName] = func;
                //this.selected[this.chosenEvent() + "String"] = this.eventEditor.getValue();
				
				}
                /* if (this.chosenEvent() == "")
                    return;
                var func = new Function("event", this.eventEditor.getValue());
                this.selected[this.chosenEvent()] = func;
                this.selected[this.chosenEvent() + "String"] = this.eventEditor.getValue(); */
                this.updateEventEditor();
            }
            catch (e) {
                alert(e);
				Editor.error(e);
            }
        };
		EventViewModel.prototype.compileScripts = function(){
			
			try{
				
				Game.__global = new Function("event", Game.__globalString);
				
				for(var i = 0; i<= Game.scenes.length-1;i++){
					
					var scene = Game.scenes[i];
					scene.__onGameStart = new Function("event", scene.__onGameStartString);
					scene.__onUpdate = new Function("event", scene.__onUpdateString);
					
					for(var ii = 0; ii<=scene.children.length-1;ii++){
						var ent = scene.children[ii];
						ent.__onGameStart = new Function("event", ent.__onGameStartString);
						ent.__onUpdate = new Function("event", ent.__onUpdateString);
						ent.__onCollision = new Function("event", ent.__onCollisionString);
					}
				}
			
			}catch(err){
				
				console.log(err);
				Editor.error(err);
			}
					
		};
        /**
         * Unload the contents of the entity's event function string into the Shell box
         **/
        EventViewModel.prototype.updateEventEditor = function () {
           if(!this.eventEditor)return;
		   
		   if(this.selected == null)this.selected = Editor.scene;
		   
		   window.frames[2].selectBeh(this.selected.animators);
		   window.frames[3].selectBeh(this.selected.animations);
		   
		   if(this.chosenEvent() == '__global'){
				 this.eventEditor.setValue(Game[this.chosenEvent() + "String"]);
		   }else{
			   
			   this.eventEditor.setValue(this.selected[this.chosenEvent() + "String"]);
		   }
		   /* if(this.chosenEvent() == '__global'){
				 this.eventEditor.setValue(Game[this.chosenEvent() + "String"]);
				 return;
		   }
		   
		   if (this.chosenEvent() == "")
                return;
            if (!this.selected) {
                this.eventEditor.setValue("");
            }
            else {
		
                this.eventEditor.setValue(this.selected[this.chosenEvent() + "String"]);
            } */
        };
    