
        function EditorViewModel() {
			
            this.canvas = document.getElementById("field");
			this.progress = document.getElementById('progress');
			//this.splash = ...
            
            this.game = new GameRunner(this.canvas);
			window.Game = this.game;
			
			this.game.progress = this.progress;
			this.game.startFromFile('Game.game');	
			
        };
		
      //new EditorViewModel();