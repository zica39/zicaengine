/*
* Project: Image Manager.
* Module: Initialization
* Author: Georgy Bunin (bunin.co.il@gmail.com)
* */

window.ImageManager = window.ImageManager || {};

var AssetManager  = function(){
	this.assets = [];
};

AssetManager.prototype.append = function(obj){
	
	this.assets.push(obj);
	this.update();
};

AssetManager.prototype.remove = function(obj){
	
	this.assets.splice(this.assets.indexOf(obj),1);
	window.parent.Game.assets = {};
	this.update();
	
	var Editor = window.parent.Editor;
	var Game = window.parent.Game;
	
	Editor.removeImage();
	Editor.removeAduio();
	
	if(top.Editor.selectedFile)
		if(obj.fileName == top.Editor.selectedFile.name){
			top.Editor.selectedFile = null;
	}
					
};

AssetManager.prototype.clear = function(){
	
	this.assets.length = 0;
	
	$('#images li img.thumbnail').css('opacity','1');
	top.Editor.selectedFile = null;
	
	this.update();
};

AssetManager.prototype.update = function(){
	
	for(var i = 0;i<= this.assets.length-1;i++){

		window.parent.Game.assets[this.assets[i].id] = this.assets[i].fileBody;	
	}

};

/* AssetManager.generateGUID = function () {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}; */

AssetManager.prototype.getFromId = function(id){
	 
	for(var i = 0; i<= this.assets.length-1;i++){
		if(this.assets[i].id == id)return this.assets[i];	
	}
};

AssetManager.prototype.getFromPath = function(path){
	 
	for(var i = 0; i<= this.assets.length-1;i++){
		if(this.assets[i].fileBody == path)return this.assets[i];	
	}
};

window.ImageManager.assetManager = new AssetManager();

$(document).ready(function() {

    $(".dropArea").each(function(i,e) {
        e.addEventListener("dragenter", ImageManager.ddHelper.dragEnter, false);
        e.addEventListener("dragover",  ImageManager.ddHelper.dragOver, false);
        e.addEventListener("dragexit",  ImageManager.ddHelper.dragLeave, false);
        e.addEventListener("dragleave", ImageManager.ddHelper.dragLeave, false);
        e.addEventListener("drop", ImageManager.ddHelper.drop, false);
    });

    document.body.addEventListener("drop", ImageManager.ddHelper.drop, false);

    function handleFileSelect(evt) { ImageManager.ddHelper.drop(evt); }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    //ImageManager.dbHelper.Init();
    //ImageManager.dbHelper.GetImages();

    // ------------------------------------------------------------------------
    // Filter Favorites (bind events)

    $("#FilterAll").click(function() {
        var allObj = $("#FilterAll");
        var favObj = $("#FilterFavorite");

        if (!allObj.hasClass("green")) {
            allObj.addClass("green").removeClass("black");
            favObj.addClass("black").removeClass("green");
            ImageManager.dbHelper.currentFilter = allObj.attr('id');
            ImageManager.dbHelper.GetImages();
        }
    });

    $("#FilterFavorite").click(function() {
        var allObj = $("#FilterAll");
        var favObj = $("#FilterFavorite");

        if (!favObj.hasClass("green")) {
            favObj.addClass("green").removeClass("black");
            allObj.addClass("black").removeClass("green");
            ImageManager.dbHelper.currentFilter = favObj.attr('id');
            ImageManager.dbHelper.GetImages(true);
        }
    });
});

// public aliases
window.DelImg = ImageManager.HTMLBuilder.RemoveImage;
window.FavImg = ImageManager.HTMLBuilder.ToggleFavorite;
