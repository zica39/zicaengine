define(["require", "exports", "../../../ZICA", ], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ko = require("knockout");
    var EditorViewModel = (function () {
        /****************************************************/
        function EditorViewModel() {
			
            this.canvas = document.getElementById("field");
			this.progress = document.getElementById('progress');
			//this.splash = ...
            
            this.game = new ZICA.GameRunner(this.canvas);
			window.Game = this.game;
			window.p2 = null;
			
			this.game.progress = this.progress;
			if(window.gameData)
			this.game.startFromData(gameData);	
			
        };
		
        return EditorViewModel;
    }());
    exports.EditorViewModel = EditorViewModel;
});