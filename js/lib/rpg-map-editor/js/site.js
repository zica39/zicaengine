if(top.Editor)
var map = top.Editor.scene.map;

var tileSize = 32;
var mapSize = 48;
var mapData = new Array(mapSize);
var mapFactory = new MapFactory("myCanvas", mapSize, mapSize, tileSize, tileSize);
var selectedAsset = {
    type: 'foregroundAsset',
    x: 0,
    y: 0
}; // Default tile

$(document).ready(function (ev) {
	
	if(top.Editor)
		if(top.Editor.scene.mapData)
			mapData = top.Editor.scene.mapData.slice();
		
	mapData.forEach(function(item, i) { 
	if (item == null) mapData[i] = undefined;
	else mapData[i].forEach(function(item1, i1) {if (item1 == null) mapData[i][i1] = undefined;});
	});
		
    mapFactory.backgroundAsset('images/background.png');
    mapFactory.backgroundAssetMapping(function (i, j) {
        if (typeof mapData[i] === 'undefined' || typeof mapData[i][j] === 'undefined') {
            if (i === 0 || j === 0 || i === mapSize - 1 || j === mapSize - 1) {
                return {
                    x: 4 * tileSize,
                    y: 1 * tileSize
                }; // default background tile on border. 
            }
            else {
                return {
                    x: 7 * tileSize, 
                    y: 3 * tileSize
                }; // default background tile. 
            }
        }
        return mapData[i][j].b;
    });
    mapFactory.foregroundAsset('images/foreground.png');
    mapFactory.foregroundAssetMapping(function (i, j) {
        if (typeof mapData[i] === 'undefined' || typeof mapData[i][j] === 'undefined') {
            return {};
        }
        return mapData[i][j].f;
    });
    mapFactory.cursorAsset('images/cursor.png');
    mapFactory.cursorAssetMapping(function (i, j) {
        return { x: selectedAsset.x, y: selectedAsset.y };
    }); 
    mapFactory.mousedown(function (ev, i, j) {
        applySelectedAsset(i, j);
    });
    mapFactory.pendrawing(function (ev, i, j) {
        applySelectedAsset(i, j);
    });
    mapFactory.rangeselecting(function (ev, leftTopI, leftTopJ, cols, rows) {
        mapFactory.drawCursor(leftTopI, leftTopJ, cols, rows);
    });
    mapFactory.rangeselected(function (ev, leftTopI, leftTopJ, cols, rows) {
        for (var i = leftTopI; i <= leftTopI + cols; i++) {
            for (var j = leftTopJ; j <= leftTopJ + rows; j++) {
                applySelectedAsset(i, j);
            }
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
});

function applySelectedAsset(i, j) {
    if (typeof mapData[i] === 'undefined') {
        mapData[i] = new Array(mapSize);
    }
    if (typeof mapData[i][j] === 'undefined') {
        mapData[i][j] = { // Default value
            b: {
                x: 7 * tileSize,
                y: 3 * tileSize
            },
            f: {}
        };
    }
    switch (selectedAsset.type) {
        case 'foregroundAsset':
            mapData[i][j].f.x = selectedAsset.x;
            mapData[i][j].f.y = selectedAsset.y;
            break;
        case 'backgroundAsset':
            mapData[i][j].b.x = selectedAsset.x;
            mapData[i][j].b.y = selectedAsset.y;
            break;
    }
    mapFactory.restoreTile(i, j);
}

function mouseDownHandler(ev, elementId) {
    selectedAsset.x = Math.trunc(ev.offsetX / 32) * 32;
    selectedAsset.y = Math.trunc(ev.offsetY / 32) * 32;
    selectedAsset.type = elementId;

    var context = null;

    switch (elementId) {
        case 'backgroundAsset':
            mapFactory.cursorAsset('images/background.png');
            context = document.getElementById("selectedBackground").getContext('2d');
            break;
        case 'foregroundAsset':
            mapFactory.cursorAsset('images/cursor.png');
            context = document.getElementById("selectedForeground").getContext('2d');
            break;
    }
    // Display current selected asset.
    context.clearRect(0, 0, tileSize, tileSize);
    context.drawImage(document.getElementById(elementId), selectedAsset.x, selectedAsset.y, tileSize, tileSize, 0, 0, tileSize, tileSize);
}

function mapSizeChanged(element) {
    var value = parseInt($(element).val());

    if (isNaN(value)) return;

    switch ($(element).attr('id')) {
        case 'visibleAreaWidth':
            mapFactory.minVisibleCols = value;
            mapFactory.maxVisibleCols = value;
            break;
        case 'visibleAreaHeight':
            mapFactory.minVisibleRows = value;
            mapFactory.maxVisibleRows = value;
            break;
    }
    mapFactory.update();
}

function responsiveChanged(element) {
    $('#visibleAreaWidth').prop('disabled', element.checked);
    $('#visibleAreaHeight').prop('disabled', element.checked);

    if (element.checked) {
        mapFactory.maxVisibleCols = 0;
        mapFactory.minVisibleCols = 0;
        mapFactory.update();
    } else {
        mapSizeChanged($('#visibleAreaWidth')[0]);
        mapSizeChanged($('#visibleAreaHeight')[0]);
    }
}

function modeChanged(mode) {
    switch (mode) {
        case 'drag':
            mapFactory.mode = "mapDragging";
            break;
        case 'pen':
            mapFactory.mode = "penDrawing";
            break;
        case 'square':
            mapFactory.mode = "rangeOperating";
            break;
    }
}

function save(){
	
	if(!map){
		var id = 1000000;
		id =  Math.round(Math.random()*id) + 1;
		map = 'Map'+id+'.png';
		top.Editor.scene.map = map;
	}
	
	///////////////////////////////
	var width = mapFactory.mapVisibleCols;
	var height = mapFactory.mapVisibleRows;
	
	var w = $('#visibleAreaWidth')[0].value;
	var h = $('#visibleAreaHeight')[0].value;
	
	mapSizeChanged($('#visibleAreaWidth')[0]);
	mapSizeChanged($('#visibleAreaHeight')[0]);
	
	var data = mapFactory.canvas.toDataURL("image/png");
	top.Game.assets[map] = data;
	 
	$('#visibleAreaWidth')[0].value = width;
	$('#visibleAreaHeight')[0].value = height;
	
	mapSizeChanged($('#visibleAreaWidth')[0]);
	mapSizeChanged($('#visibleAreaHeight')[0]);
	
	$('#visibleAreaWidth')[0].value = w;
	$('#visibleAreaHeight')[0].value = h;
	////////////////////////////////////
	
	 top.Editor.scene.mapData = mapData.slice();
	 top.Editor.scene.width = w*tileSize;
	 top.Editor.scene.height = h*tileSize;
	 if(top.Editor.scene.width<top.Editor.canvas.width)top.Editor.scene.width = top.Editor.canvas.width;
	 if(top.Editor.scene.height<top.Editor.canvas.height)top.Editor.scene.height = top.Editor.canvas.height;
	 top.Editor.update();
	 
	 top.Editor.updateAsset();
	 top.Editor.updateImage(map);
	 
	 
}

function resize(){
	
	var width = window.innerWidth - 256;
	var height = window.innerHeight;
	
	var w = Math.ceil(width/tileSize);
	var h = Math.ceil(height/tileSize);
	
	mapFactory.minVisibleCols = w;
    mapFactory.maxVisibleCols = w;
	 
	mapFactory.minVisibleRows = h;
    mapFactory.maxVisibleRows = h;
        
    mapFactory.update();
}

window.onload = resize;
window.onresize = resize;