class MapFactory {
    constructor(canvasName, mapCols, mapRows, tileWidth, tileHeight) {
        var _self = this;

        this.tileWidth = typeof tileWidth === "number" ? Math.abs(tileWidth) : 0;
        this.tileHeight = typeof tileHeight === "number" ? Math.abs(tileHeight) : 0;
        this.mapCols = typeof mapCols === "number" ? Math.abs(mapCols) : 0;
        this.mapRows = typeof mapRows === "number" ? Math.abs(mapRows) : 0;
        this.viewOffsetI = 0; // tile
        this.viewOffsetJ = 0; // tile

        this.viewOffsetX = 0; // pixel
        this.viewOffsetY = 0; // pixel

        this.minVisibleRows = Math.min(Math.trunc(document.body.clientHeight / this.tileHeight) /*- 1*/, this.mapRows);
        this.minVisibleCols = 0;
        this.maxVisibleRows = this.minVisibleRows; // Default behavior is fixed rows.
        this.maxVisibleCols = 0;

        this.mode = "mapDragging";

        // in tile
        var initViewOffsetI = 0;
        var initViewOffsetJ = 0;
        var diffViewOffsetI = 0;
        var diffViewOffsetJ = 0;
        // in pixel
        var initMousePosX = 0;
        var initMousePosY = 0;
        var diffMousePosX = 0;
        var diffMousePosY = 0;

        var initViewOffsetX = this.viewOffsetX;
        var initViewOffsetY = this.viewOffsetY;

        var canvas = this["canvas"] = document.getElementById(canvasName);
        var context = this["context"] = canvas.getContext('2d');

        var assetBackground = this["assetBackground"] = new Image();
        var assetForeground = this["assetForeground"] = new Image();
        var assetCursor = this["assetCursor"] = new Image();

        var showCursor = function (ev) {
            var currMousePosI = Math.trunc((ev.offsetX + _self.viewOffsetX) / _self.tileWidth) + _self.viewOffsetI;
            var currMousePosJ = Math.trunc((ev.offsetY + _self.viewOffsetY) / _self.tileHeight) + _self.viewOffsetJ;
            var prevMousePosI = parseInt(canvas.dataset.offsetI);
            var prevMousePosJ = parseInt(canvas.dataset.offsetJ);
            
            if (currMousePosI !== prevMousePosI || currMousePosJ !== prevMousePosJ) {
                //console.log("[%d, %d] [%d, %d]", prevMousePosI, prevMousePosJ, currMousePosI, currMousePosJ);

                canvas.dataset.offsetI = currMousePosI;
                canvas.dataset.offsetJ = currMousePosJ;

                var cac = _self["cac"];

                if (assetCursor.src && cac && typeof cac === "function") {
                    var coor = cac(currMousePosI, currMousePosJ);
                    if (coor && typeof coor.x === 'number' && typeof coor.y === 'number') {
                        _self.drawCursorTile(coor.x, coor.y, currMousePosI, currMousePosJ);
                    } else {
                        canvas.style.cursor = "auto";
                        return true; // Cursor asset is not working. No needs to continue.
                    }
                } else {
                    canvas.style.cursor = "auto";
                    return true; // Same as above.
                }
                canvas.style.cursor = "none";
                _self.restoreTile(prevMousePosI, prevMousePosJ);
            }
            return true;
        };
        var hideCursor = function (ev) { // Hide cursor when mouse leaves
            var initMousePosI = Math.trunc((initMousePosX + _self.viewOffsetX) / _self.tileWidth);
            var initMousePosJ = Math.trunc((initMousePosY + _self.viewOffsetY) / _self.tileHeight);
            var prevMousePosI = parseInt(canvas.dataset.offsetI);
            var prevMousePosJ = parseInt(canvas.dataset.offsetJ);

            //console.log("[%d, %d] [%d, %d]", prevMousePosI, prevMousePosJ, initMousePosI, initMousePosJ);

            for (var i = Math.min(initMousePosI, prevMousePosI); i <= Math.max(initMousePosI, prevMousePosI); i++) {
                for (var j = Math.min(initMousePosJ, prevMousePosJ); j <= Math.max(initMousePosJ, prevMousePosJ); j++) {
                    _self.restoreTile(i, j);
                }
            }
            canvas.dataset.offsetI = initMousePosI;
            canvas.dataset.offsetJ = initMousePosJ;
        };
        var mapDragging = function (ev) { // Dragging map 
            var tempViewOffsetI = _self.viewOffsetI + Math.trunc(diffMousePosX / _self.tileWidth);
            var tempViewOffsetJ = _self.viewOffsetJ + Math.trunc(diffMousePosY / _self.tileHeight);
            var tempViewOffsetX = diffMousePosX % _self.tileWidth - initViewOffsetX;
            var tempViewOffsetY = diffMousePosY % _self.tileHeight - initViewOffsetY;

            var mapVisibleCols = _self["mapVisibleCols"];
            var mapVisibleRows = _self["mapVisibleRows"];

            var update = false;

            //console.log("Before: %d, %d",  _self.viewOffsetY, tempViewOffsetY);
            
            if (tempViewOffsetI * _self.tileWidth + tempViewOffsetX >= 0 && (tempViewOffsetI + mapVisibleCols) * _self.tileWidth + tempViewOffsetX <= _self.mapCols * _self.tileWidth) { 
                if (_self.viewOffsetX != tempViewOffsetX) {
                    _self.viewOffsetX = tempViewOffsetX;
                    update = true;
                }
                if (_self.viewOffsetI != tempViewOffsetI){
                    _self.viewOffsetI = tempViewOffsetI; 
                    update = true;
                }
            }
            if (tempViewOffsetJ * _self.tileHeight + tempViewOffsetY >= 0 && (tempViewOffsetJ + mapVisibleRows) * _self.tileHeight + tempViewOffsetY <= _self.mapRows * _self.tileHeight) {
                if (_self.viewOffsetY != tempViewOffsetY) {
                    _self.viewOffsetY = tempViewOffsetY;
                    update = true;
                }
                if (_self.viewOffsetJ != tempViewOffsetJ){
                    _self.viewOffsetJ = tempViewOffsetJ;
                    update = true;
                }
            }
            //console.log("After: %d, %d",  _self.viewOffsetY, tempViewOffsetY);

            if (update) {
                _self.drawBackground();
                _self.drawForeground();
            }
            canvas.style.cursor = "move";
        };
        var rangeOperating = function (ev, callbackName) {
            var initMousePosI = Math.trunc((initMousePosX + _self.viewOffsetX) / _self.tileWidth);
            var initMousePosJ = Math.trunc((initMousePosY + _self.viewOffsetY) / _self.tileHeight);
            var currMousePosI = Math.trunc((ev.offsetX + _self.viewOffsetX) / _self.tileWidth) + _self.viewOffsetI;
            var currMousePosJ = Math.trunc((ev.offsetY + _self.viewOffsetY) / _self.tileHeight) + _self.viewOffsetJ;
            var prevMousePosI = parseInt(canvas.dataset.offsetI);
            var prevMousePosJ = parseInt(canvas.dataset.offsetJ);

            if (currMousePosI !== prevMousePosI || currMousePosJ !== prevMousePosJ || callbackName === "rangeselected") {
                canvas.dataset.offsetI = currMousePosI;
                canvas.dataset.offsetJ = currMousePosJ;

                for (var i = Math.min(initMousePosI, prevMousePosI); i <= Math.max(initMousePosI, prevMousePosI); i++) {
                    for (var j = Math.min(initMousePosJ, prevMousePosJ); j <= Math.max(initMousePosJ, prevMousePosJ); j++) {
                        _self.restoreTile(i, j);
                    }
                }
                var callback = _self[callbackName];
                if (callback && typeof callback === "function") {
                    callback(ev, Math.min(initMousePosI, currMousePosI), Math.min(initMousePosJ, currMousePosJ),
                        Math.abs(initMousePosI - currMousePosI), Math.abs(initMousePosJ - currMousePosJ)); 
                }
            }
        };
        var penDrawing = function (ev) {
            var callback = _self["pendrawing"];
            if (typeof callback === "function") {
                var currMousePosI = Math.trunc((ev.offsetX + _self.viewOffsetX) / _self.tileWidth) + _self.viewOffsetI;
                var currMousePosJ = Math.trunc((ev.offsetY + _self.viewOffsetY) / _self.tileHeight) + _self.viewOffsetJ;

                callback(ev, currMousePosI, currMousePosJ);
            }
        }
        //-------------------------------//
        canvas.addEventListener("mousedown", function (ev) {
            if (ev.button !== 0) {
                return true;
            }
            initMousePosX = _self.viewOffsetI * _self.tileWidth + ev.offsetX;
            initMousePosY = _self.viewOffsetJ * _self.tileHeight + ev.offsetY;
            diffMousePosX = 0;
            diffMousePosY = 0;

            initViewOffsetI = _self.viewOffsetI;
            initViewOffsetJ = _self.viewOffsetJ;
            diffViewOffsetI = 0;
            diffViewOffsetJ = 0;

            initViewOffsetX = _self.viewOffsetX;
            initViewOffsetY = _self.viewOffsetY;
    
            canvas.style.cursor = "move";
        });
        canvas.addEventListener("mousemove", function (ev) {
            if (ev.which !== 1) {
                return true;
            }

            /* t: tileWidth = 4
             *  
             * Example: Mouse Dragging Towards Left Side
             * I: initViewOffsetI = 0 
             * i: initMousePosX = 9   
             * +---+---+i--+---+---+---+---+---+
             * v        e
             * e:  ev.offsetX = 9       
             * v: viewOffsetI = 0   viewOffsetX = (i - e) % t = 0
             * 
             * +---+---+i--+---+---+---+---+---+
             *  v       e 
             * e:  ev.offsetX = 8  
             * v: viewOffsetI = 0   viewOffsetX = (i - e) % t = 1
             * 
             * +---+---+i--+---+---+---+---+---+
             *    v     e 
             * e:  ev.offsetX = 6  
             * v: viewOffsetI = 0   viewOffsetX = (i - e) % t = 3
             * 
             * +---+---+i--+---+---+---+---+---+
             *     v    e 
             * e:  ev.offsetX = 5  
             * v: viewOffsetI = 1   viewOffsetX = (i - e) % t = 0
             */
            /* Example: Mouse Dragging Towards Right Side
             * I: initViewOffsetI = 1
             * i: initMousePosX = 5 + 1 * t = 9   
             * +---+---+i--+---+---+---+---+---+
             *     v    e 
             * e:  ev.offsetX = 5  
             * v: viewOffsetI = 1   viewOffsetX = t % (i - e) = 0
             * 
             * +---+---+i--+---+---+---+---+---+
             *    v     e 
             * e:  ev.offsetX = 6     
             * v: viewOffsetI = 0   viewOffsetX = t % (i - e) = 3
             * 
             * +---+---+i--+---+---+---+---+---+
             *  v       e 
             * e:  ev.offsetX = 8     
             * v: viewOffsetI = 0   viewOffsetX = t % (i - e) = 1
             * 
             * +---+---+i--+---+---+---+---+---+
             * v        e
             * e:  ev.offsetX = 9     
             * v: viewOffsetI = 0   viewOffsetX = t % (i - e) = 0 
             */

            // The difference between initial and current mouse position.  
            diffMousePosX = initMousePosX - (_self.viewOffsetI * _self.tileWidth + ev.offsetX);
            diffMousePosY = initMousePosY - (_self.viewOffsetJ * _self.tileHeight + ev.offsetY);
            diffViewOffsetI = initViewOffsetI - Math.trunc(diffMousePosX / _self.tileWidth);
            diffViewOffsetJ = initViewOffsetJ - Math.trunc(diffMousePosY / _self.tileHeight);

            switch (_self.mode) {
                case "mapDragging":
                    mapDragging(ev);
                    return true;
                case "rangeOperating":
                    rangeOperating(ev, "rangeselecting");
                    return true;
                case "penDrawing":
                    penDrawing(ev);
                    break;
            }
        });
        canvas.addEventListener("mouseup", function (ev) {
            canvas.style.cursor = "initial";

            if (diffMousePosX % _self.tileWidth === 0 && diffMousePosY % _self.tileHeight === 0) { // Position doesn't change.
                var callback = _self["mousedown"];
                if (typeof callback === "function") {
                    var currMousePosI = Math.trunc((ev.offsetX + _self.viewOffsetX) / _self.tileWidth) + _self.viewOffsetI;
                    var currMousePosJ = Math.trunc((ev.offsetY + _self.viewOffsetY) / _self.tileHeight) + _self.viewOffsetJ;

                    callback(ev, currMousePosI, currMousePosJ);
                }
            }
            else {
                switch (_self.mode) {
                    case "mapDragging":
                        // TODO:
                        break;
                    case "rangeOperating":
                        rangeOperating(ev, "rangeselected");
                        break;
                    case "penDrawing":
                        penDrawing(ev);
                        break;
                }
            }
        });
        //-------------------------------//
        window.addEventListener("resize", function (ev) {
            _self.update();
        });
        //-------------------------------//
        assetBackground.onload = function (ev) {
            _self.drawBackground();
        };
        assetForeground.onload = function (ev) {
            _self.drawForeground();
        };
        assetCursor.onload = function (ev) {
            canvas.addEventListener("mousemove", showCursor);
            canvas.addEventListener("mouseleave", hideCursor);
        };
        //-------------------------------//
        this.updateMapVisibleSize();
        //-------------------------------//
    }
}

MapFactory.prototype.foregroundAsset = function (url) {
    var assetForeground = this["assetForeground"];
    if (typeof url === 'string') {
        assetForeground.src = url;
        return this;
    }
    return assetForeground.src;
};

MapFactory.prototype.backgroundAsset = function (url) {
    var assetBackground = this["assetBackground"];
    if (typeof url === 'string') {
        assetBackground.src = url;
        return this;
    }
    return assetBackground.src;
};

MapFactory.prototype.cursorAsset = function (url) {
    var assetCursor = this["assetCursor"];
    if (typeof url === 'string') {
        assetCursor.src = url;
        return this;
    }
    return assetCursor.src;
};

MapFactory.prototype.backgroundAssetMapping = function (callback) {
    if (typeof callback === 'function') {
        this["bac"] = callback;
        return this;
    }
    return this["bac"];
};

MapFactory.prototype.foregroundAssetMapping = function (callback) {
    if (typeof callback === 'function') {
        this["fac"] = callback;
        return this;
    }
    return this["fac"];
};

MapFactory.prototype.cursorAssetMapping = function (callback) {
    if (typeof callback === 'function') {
        this["cac"] = callback;
        return this;
    }
    return this["cac"];
};

MapFactory.prototype.mousedown = function (callback) {
    if (typeof callback === 'function') {
        this["mousedown"] = callback;
        return this;
    }
    return this["mousedown"];
};

MapFactory.prototype.rangeselecting = function (callback) {
    if (typeof callback === 'function') {
        this["rangeselecting"] = callback;
        return this;
    }
    return this["rangeselecting"];
};

MapFactory.prototype.rangeselected = function (callback) {
    if (typeof callback === 'function') {
        this["rangeselected"] = callback;
        return this;
    }
    return this["rangeselected"];
};

MapFactory.prototype.pendrawing = function (callback) {
    if (typeof callback === 'function') {
        this["pendrawing"] = callback;
        return this;
    }
    return this["pendrawing"];
};

MapFactory.prototype.updateMapVisibleSize = function () {
    var bb = this["canvas"].parentNode.getBoundingClientRect();
    var rows = Math.min(Math.trunc(document.body.clientHeight / this.tileHeight) /*- 1*/, this.mapRows);
    var cols = Math.min(Math.trunc((bb.right - bb.left) / this.tileWidth) - 1, this.mapCols);

    if (this.minVisibleRows > 0 && rows < this.minVisibleRows) {
        rows = this.minVisibleRows;
    }
    else if (this.maxVisibleRows > 0 && this.maxVisibleRows >= this.minVisibleRows && rows > this.maxVisibleRows) {
        rows = this.maxVisibleRows;
    }
    if (this.minVisibleCols > 0 && cols < this.minVisibleCols) {
        cols = this.minVisibleCols;
    }
    else if (this.maxVisibleCols > 0 && this.maxVisibleCols >= this.minVisibleCols && cols > this.maxVisibleCols) {
        cols = this.maxVisibleCols;
    }

    this["mapVisibleCols"] = cols;
    this["mapVisibleRows"] = rows;

    this["canvas"].width = cols * this.tileWidth;
    this["canvas"].height = rows * this.tileHeight;
};

MapFactory.prototype.drawBackground = function () {
    var mapVisibleCols = this["mapVisibleCols"];
    var mapVisibleRows = this["mapVisibleRows"];
    var bac = this["bac"];

    if (this["assetBackground"].src && bac && typeof bac === "function") {
        for (var i = this.viewOffsetI - 1; i <= mapVisibleCols + this.viewOffsetI; i++) {
            for (var j = this.viewOffsetJ - 1; j <= mapVisibleRows + this.viewOffsetJ; j++) {
                var coor = bac(i, j);
                if (coor && typeof coor.x === 'number' && typeof coor.y === 'number') {
                    this.drawBackgroundTile(coor.x, coor.y, i, j);
                }
            }
        }
    }
};

MapFactory.prototype.drawForeground = function () {
    var mapVisibleCols = this["mapVisibleCols"];
    var mapVisibleRows = this["mapVisibleRows"];
    var fac = this["fac"];

    if (this["assetForeground"].src && fac && typeof fac === "function") {
        for (var i = this.viewOffsetI - 1; i <= mapVisibleCols + this.viewOffsetI; i++) {
            for (var j = this.viewOffsetJ - 1; j <= mapVisibleRows + this.viewOffsetJ; j++) {
                var coor = fac(i, j);
                if (coor && typeof coor.x === 'number' && typeof coor.y === 'number') {
                    this.drawForegroundTile(coor.x, coor.y, i, j);
                }
            }
        }
    }
};

MapFactory.prototype.drawCursor = function (i, j, cols, rows) {
    var cac = this["cac"];
    
    cols = isNaN(cols) ? 1 : parseInt(cols);
    rows = isNaN(rows) ? 1 : parseInt(rows);

    if (this["assetCursor"].src && cac && typeof cac === "function") {
        for (var tempI = i; tempI <= i + cols; tempI++) {
            for (var tempJ = j; tempJ <= j + rows; tempJ++) {
                var coor = cac(tempI, tempJ);
                if (coor && typeof coor.x === 'number' && typeof coor.y === 'number') {
                    this.drawCursorTile(coor.x, coor.y, tempI, tempJ);
                }
            }
        }
    }
};

MapFactory.prototype.drawBackgroundTile = function (sourceX, sourceY, i, j) {
    var destX = (i - this.viewOffsetI) * this.tileWidth - this.viewOffsetX;
    var destY = (j - this.viewOffsetJ) * this.tileHeight - this.viewOffsetY;
    var asset = this["assetBackground"];

    this["context"].drawImage(asset,
        sourceX, sourceY, this.tileWidth, this.tileHeight, destX, destY, this.tileWidth, this.tileHeight);
};

MapFactory.prototype.drawForegroundTile = function (sourceX, sourceY, i, j) {
    var destX = (i - this.viewOffsetI) * this.tileWidth - this.viewOffsetX;
    var destY = (j - this.viewOffsetJ) * this.tileHeight - this.viewOffsetY;
    var asset = this["assetForeground"];
    this["context"].drawImage(asset,
        sourceX, sourceY, this.tileWidth, this.tileHeight, destX, destY, this.tileWidth, this.tileHeight);
};

MapFactory.prototype.drawCursorTile = function (sourceX, sourceY, i, j) {
    var destX = (i - this.viewOffsetI) * this.tileWidth - this.viewOffsetX;
    var destY = (j - this.viewOffsetJ) * this.tileHeight - this.viewOffsetY;
    var asset = this["assetCursor"];
    this["context"].drawImage(asset,
        sourceX, sourceY, this.tileWidth, this.tileHeight, destX, destY, this.tileWidth, this.tileHeight);
};

MapFactory.prototype.clearTile = function (i, j) {
    var destX = (i - this.viewOffsetI) * this.tileWidth - this.viewOffsetX;
    var destY = (j - this.viewOffsetJ) * this.tileHeight - this.viewOffsetY;
    this["context"].clearRect(destX, destY, this.tileWidth, this.tileHeight);
};

MapFactory.prototype.restoreTile = function (i, j) {
    var bac = this["bac"];
    var fac = this["fac"];

    var assetBackground = this["assetBackground"];
    var assetForeground = this["assetForeground"];

    this.clearTile(i, j);
    if (assetBackground.src && bac && typeof bac === "function") {
        var coor = bac(i, j);
        if (coor && typeof coor.x === 'number' && typeof coor.y === 'number') {
            this.drawBackgroundTile(coor.x, coor.y, i, j);
        }
    }
    if (assetForeground.src && fac && typeof fac === "function") {
        var coor = fac(i, j);
        if (coor && typeof coor.x === 'number' && typeof coor.y === 'number') {
            this.drawForegroundTile(coor.x, coor.y, i, j);
        }
    }
}

MapFactory.prototype.update = function () {
    this.updateMapVisibleSize();
    this.drawBackground();
    this.drawForeground();
}
