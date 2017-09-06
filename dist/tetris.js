(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var utils = require('./utils.js');
var consts = require('./consts.js');


var lineColor =  consts.GRID_LINE_COLOR;

var boxBorderColor = consts.BOX_BORDER_COLOR;

//Draw a single line in canvas context
var drawLine = function(ctx,p1,p2,color){
	  	    ctx.beginPath();
			ctx.moveTo(p1.x,p1.y);
			ctx.lineTo(p2.x,p2.y);
			
			ctx.lineWidth=1;
			ctx.strokeStyle= color;
			
			ctx.stroke();
			ctx.closePath();
};


//Draw game grids
var drawGrids = function(el,gridSize,colCount,rowCount,color1,color2){

	  

	  var ctx = el.getContext('2d');
	  var width = el.width;
	  var height = el.height;

	  ctx.rect(0, 0, width, height);

      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, color1);   
      grd.addColorStop(1, color2);
      ctx.fillStyle = grd;
      ctx.fill();
      

	  for (var i = 1; i < colCount; i++) {
	  		var x = gridSize*i+0.5;
			drawLine(ctx,{x:x,y:0},{x:x,y:height},lineColor);
	  };
	  for (var i = 1; i < rowCount; i++) {
			var y = gridSize*i+0.5;
			drawLine(ctx,{x:0,y:y},{x:width,y:y},lineColor);
	  };
};

//Draw box of shape (shape is the composition of boxes)
var drawBox = function(ctx,color,x,y,gridSize){
			if (y<0){
				return;
			}

			ctx.beginPath();
			ctx.rect(x,y,gridSize,gridSize);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.strokeStyle= boxBorderColor;
			ctx.lineWidth=.5;
			ctx.stroke();
			ctx.closePath();
}

/*
	Canvas main object, use to draw all games data.
*/
var tetrisCanvas = {

	init:function(scene,preview){
		this.scene = scene;
		// this.preview = preview;
		this.sceneContext = scene.getContext('2d');
		// this.previewContext = preview.getContext('2d');
		this.gridSize = scene.width / consts.COLUMN_COUNT;

		// this.previewGridSize = preview.width / consts.PREVIEW_COUNT;

		this.drawScene();
		
	},

	//Clear game canvas
	clearScene:function(){
		this.sceneContext.clearRect(0, 0, this.scene.width, this.scene.height);
	},
	//Clear preview canvas
	clearPreview:function(){
		this.previewContext.clearRect(0,0,this.preview.width,this.preview.height);
	},
	//Draw game scene, grids
	drawScene:function(){
		this.clearScene();
		drawGrids(this.scene,this.gridSize,
			consts.COLUMN_COUNT,consts.ROW_COUNT,
			consts.SCENE_BG_START,consts.SCENE_BG_END);
	},
	//Draw game data
	drawMatrix:function(matrix){
		for(var i = 0;i<matrix.length;i++){
			var row = matrix[i];
			for(var j = 0;j<row.length;j++){
				if (row[j]!==0){
					drawBox(this.sceneContext,row[j],j*this.gridSize,i*this.gridSize,this.gridSize);
				}
			}
		}	
	},
	//Draw preview data
	drawPreview:function(){
		drawGrids(this.preview,this.previewGridSize,
			consts.PREVIEW_COUNT,consts.PREVIEW_COUNT,
			consts.PREVIEW_BG,consts.PREVIEW_BG);
	},
	//Draw acitve shape in game
	drawShape:function(shape){
		if (!shape){
			return;
		}
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(shape.y + i);
					drawBox(this.sceneContext,shape.color,x,y,gsize);
				}
			}
		}
	},
	//Draw preview shape in preview canvas
	drawPreviewShape:function(shape){
		if (!shape){
			return;
		}
		this.clearPreview();
		var matrix = shape.matrix();
		var gsize = this.previewGridSize;
		var startX = (this.preview.width - gsize*shape.getColumnCount()) / 2;
		var startY = (this.preview.height - gsize*shape.getRowCount()) / 2;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = startX + gsize * j;
					var y = startY + gsize * i;
					drawBox(this.previewContext,shape.color,x,y,gsize);
				}
			}
		}
	}

};



module.exports = tetrisCanvas;
},{"./consts.js":2,"./utils.js":5}],2:[function(require,module,exports){

//colors for shapes
var colors = ['#2CC990', '#42A0EA', '#D9B2FF', '#EDE657', '#FC6042', '#FCB941', '#FFCBCF'];

//sidebar width
var minSideWidth = 120;

//scene column count
var columnCount = 12;

//scene row count;
var rowCount = 20;

// mid column index (0~n-1)
var midColumn = 5;

//previewCount
var previewCount = 6;

//scene gradient start color 
var sceneBgStart = '#D9EEFF';

//scene gradient end color 
var sceneBgEnd = '#ecf0f1';

//preview background color
var previewBg = '#2f2f2f';

//grid line color
var gridLineColor = 'rgba(0,0,0,.2)';

//box border color
var boxBorderColor = 'rgba(100,100,100,1)';

// Game speed
var defaultInterval = 600;


// Level update interval 
var levelInterval = 120 * 1000;

// Level update interval based on # of shapes generated
var levelIntervalForCount = 2;


var exports = module.exports = {};

exports.COLORS =  colors;

exports.ROW_COUNT = rowCount;

exports.COLUMN_COUNT = columnCount;

exports.MID_COLUMN = midColumn;

exports.SCENE_BG_START = sceneBgStart;

exports.SCENE_BG_END = sceneBgEnd;

exports.PREVIEW_BG = previewBg;

exports.PREVIEW_COUNT = previewCount;

exports.GRID_LINE_COLOR = gridLineColor;

exports.BOX_BORDER_COLOR = boxBorderColor;

exports.DEFAULT_INTERVAL = defaultInterval;

exports.LEVEL_INTERVAL = levelInterval;

exports.LEVEL_INTERVAL_COUNT = levelIntervalForCount;


},{}],3:[function(require,module,exports){
var utils = require('./utils.js');
var consts = require('./consts.js');
var shapes = require('./shapes.js');
var views = require('./views.js');
var canvas = require('./canvas.js');




/**
	Init game matrix
*/
var initMatrix = function(rowCount,columnCount){
	var result = [];
	for (var i = 0; i<rowCount;i++){
		var row = [];
		result.push(row);
		for(var j = 0;j<columnCount;j++){
			row.push(0);
		}
	}

	return result;
};

/**
  Clear game matrix
*/
var clearMatrix = function(matrix){
	for(var i = 0;i<matrix.length;i++){
		for(var j = 0;j<matrix[i].length;j++){
			matrix[i][j] = 0;
		}
	}
};


/**
	Check all full rows in game matrix
	return rows number array. eg: [18,19];
*/
var checkFullRows = function(matrix){
	var rowNumbers = [];
  	for(var i = 0;i<matrix.length;i++){
  		var row = matrix[i];
  		var full = true;
  		for(var j = 0;j<row.length;j++){
  			full = full&&row[j]!==0;
  		}
  		if (full){
  			rowNumbers.push(i);
  		}
  	}

  	return rowNumbers;	
};

/**
	Remove one row from game matrix. 
	copy each previous row data to  next row  which row number less than row;
*/
var removeOneRow = function(matrix,row){
	var colCount = matrix[0].length;
	for(var i = row;i>=0;i--){
		for(var j = 0;j<colCount;j++){
			if (i>0){
				matrix[i][j] = matrix[i-1][j];
			}else{
				matrix[i][j] = 0 ;
			}	
		}
	}	
};
/**
	Remove rows from game matrix by row numbers.
*/
var removeRows = function(matrix,rows){
	for(var i in rows){
		removeOneRow(matrix,rows[i]);
	}
};

/**
	Check game data to determin wether the  game is over
*/
var checkGameOver = function(matrix){
	var firstRow = matrix[0];
	for(var i = 0;i<firstRow.length;i++){
		if (firstRow[i]!==0){
			return true;
		};
	}
	return false;
};


/**
	Calculate  the extra rewards add to the score
*/
var calcRewards = function(rows){
	if (rows&&rows.length>1) {
		return Math.pow(2, rows.length - 1)*100;	
	}
	return 0;
};

/**
	Calculate game score
*/
var calcScore = function(rows){
	if (rows&&rows.length){
		return rows.length*100;
	}
	return 0;
};

/**
	Calculate time interval by level, the higher the level,the faster shape moves
*/
var calcIntervalByLevel = function(level){
	return consts.DEFAULT_INTERVAL  - (level-1)*20;
};


// Default max scene size
var defaults = {
	maxHeight:700,
	maxWidth:600
};

/**
	Tetris main object defination
*/
function Tetris(id){
	this.id = id;
	this.init();
}

Tetris.prototype = {

	init:function(options){

		var cfg = this.config = utils.extend(options,defaults);
		
		views.init(this.id, cfg.maxWidth,cfg.maxHeight);

		canvas.init(views.scene,views.preview);

		this.matrix = initMatrix(consts.ROW_COUNT,consts.COLUMN_COUNT);
		this.reset();

		this._initEvents();
		this._fireShape();
	},
	//Reset game
	reset:function(){
		this.running = false;
		this.isGameOver = false;
		this.interval = consts.DEFAULT_INTERVAL;
		this.removedRowsMod4 = 0;
		this.level = 1;
		this.score = 0;
		this.count = 1;
		this.startTime = new Date().getTime();
		this.currentTime = this.startTime;
		this.prevTime = this.startTime;
		this.levelTime = this.startTime;
		clearMatrix(this.matrix);
		views.setLevel(this.level);
		views.setScore(this.score);
		views.setCount(this.count);
		views.setGameOver(this.isGameOver);
		this._draw();
		this.reachable = {
			"L": {maxy: -1, score: 0},
			"LR": {maxy: -1, score: 0},
			"T": {maxy: -1, score: 0},
			"Z": {maxy: -1, score: 0},
			"ZR": {maxy: -1, score: 0},
			"I": {maxy: -1, score: 0},
			"O": {maxy: -1, score: 0},
		}
	},
	//Start game
	start:function(){
		this.running = true;
		window.requestAnimationFrame(utils.proxy(this._refresh,this));
	},
	//Pause game
	pause:function(){
		this.running = false;
		this.currentTime = new Date().getTime();
		this.prevTime = this.currentTime;
	},
	//Game over
	gamveOver:function(){

	},
	// All key event handlers
	_keydownHandler:function(e){
		
		if(!e) { 
			var e = window.event;
		}
		this._keydownHandlerHelper(e.keyCode);
	},
	_keydownHandlerHelper:function(code) {
		if (this.isGameOver||!this.shape){
			return;
		}

		switch(code){
			case 37:
				if (!this.running) return;
				this.shape.goLeft(this.matrix);
				this._draw();
				break;
			case 39:
				if (!this.running) return;
				this.shape.goRight(this.matrix);
				this._draw();
				break;
			case 38:
				if (!this.running) return;
				this.shape.rotate(this.matrix);
				this._draw();
				break;
			case 40:
				if (!this.running) return;
				this.shape.goDown(this.matrix);
				this._draw();
				break;
			case 32:
				if (!this.running) return;
				this.shape.goBottom(this.matrix);
				this._update();
				break;
			case 13:
				if (this.running) {
					this.pause();
					document.getElementById("pause").src = "./img/resume.png";
				}
				else {
					this.start();
					document.getElementById("pause").src = "./img/pause.png";
				}
				break;
			case 66:
				if (!this.running || this.shape.y >= consts.ROW_COUNT - 5) return;
				var x = this.shape.x, y = this.shape.y;
				this.shape = shapes.randomShape();
				this.shape.x = x;
				this.shape.y = y;
				break;
		}
	},
	buttonToLeftWrapper: function() {
		this._keydownHandlerHelper(37);
	},
	buttonToRightWrapper: function() {
		this._keydownHandlerHelper(39);
	},
	buttonRotateWrapper: function() {
		this._keydownHandlerHelper(38);
	},
	buttonDownWrapper: function() {
		this._keydownHandlerHelper(40);
	},
	buttonBottomWrapper: function() {
		this._keydownHandlerHelper(32);
	},
	buttonPauseWrapper: function() {
		this._keydownHandlerHelper(13);
	},
	buttonMagicWrapper: function() {
		this._keydownHandlerHelper(66);
	},
	// Restart game
	_restartHandler:function(){
		this.reset();
		this.start();
	},
	// Bind game events
	_initEvents:function(){
		window.addEventListener('keydown',utils.proxy(this._keydownHandler,this),false);
		views.btnRestart.addEventListener('click',utils.proxy(this._restartHandler,this),false);
		document.getElementById("rotate").addEventListener("click", utils.proxy(this.buttonRotateWrapper, this), false);
		document.getElementById("magic").addEventListener("click", utils.proxy(this.buttonMagicWrapper, this), false);
		document.getElementById("left").addEventListener("click", utils.proxy(this.buttonToLeftWrapper, this), false);
		document.getElementById("bottom").addEventListener("click", utils.proxy(this.buttonBottomWrapper, this), false);
		document.getElementById("right").addEventListener("click", utils.proxy(this.buttonToRightWrapper, this), false);
		document.getElementById("pause").addEventListener("click", utils.proxy(this.buttonPauseWrapper, this), false);
		document.getElementById("down").addEventListener("click", utils.proxy(this.buttonDownWrapper, this), false);
		document.getElementById("instr").addEventListener("click", utils.proxy(this.pause, this), false);
		document.getElementById("back").addEventListener("click", utils.proxy(this.start, this), false);
	},
	// Determine the lowest row that a shape can reach. We (so for) only consider 
	// rotation at the very beginning, and then use left or right to control it.
	_lowestReachableRow(shapeType) {
		var maxy = -1, score = 0;
		var rotations = 0;
		switch (shapeType) {
			case "L":
			case "LR":
			case "T": 
				rotations = 4;
				break;
			case "Z":
			case "ZR":
			case "I":
				rotations = 2;
				break;
			case "O":
				rotations = 1;
				break;
			default:
				rotations = 0;
		}

		for (var k = 0; k < rotations; k++) {
			var shape = shapes.generateShape(shapeType);
			for (var j = 0; j < k; j++)
				shape.rotate(this.matrix);
			shape.y--;
			var cur = [shape.x];
			while (true) {
				var y = shape.y;
				var next = new Array();
				for (var i = 0; i < cur.length; i++) {
										shape.x = cur[i];

					if (next.includes(cur[i]) || !shape.canDown(this.matrix)) continue;
					shape.y = y + 1;
					next.push(cur[i]);
					while (true) {
						shape.goLeft(this.matrix);
						if (next.includes(shape.x)) break;
						next.push(shape.x);
					}
					shape.x = cur[i];
					while (true) {
						shape.goRight(this.matrix);
						if (next.includes(shape.x)) break;
						next.push(shape.x);
					}
				}
				if (next.length > 0 && shape.y + shape.matrix().length - 1 < consts.ROW_COUNT - 1) {
					shape.y = y + 1;
					cur = next;
				} else break;
			}
			var attempt = shape.y + shape.matrix().length - 1;
			if (attempt >= maxy) {
				var boxes = shape.matrix();
				var botRowInShape = boxes[boxes.length - 1];
				var numBoxes = 0;
				for (var i = 0; i < botRowInShape.length; i++)
					numBoxes += botRowInShape[i];
				if (attempt > maxy) {
					maxy = attempt;
					score = numBoxes;
				} else {
					score = Math.max(score, numBoxes);
				}
			}
		}

		this.reachable[shapeType].maxy = maxy;
		this.reachable[shapeType].score = score;
	},
	// Fire a new random shape
	_fireShape:function(){
		// this.shape = this.preparedShape||shapes.randomShape();
		// this.preparedShape = shapes.randomShape();
		// this._draw();
		// canvas.drawPreviewShape(this.preparedShape);
		var types = ["L", "LR", "T", "Z", "ZR", "I", "O"];
		var max_maxy = -1, choices = [];
		for (var i = 0; i < types.length; i++) {
			var type = types[i];
			this._lowestReachableRow(type);
			var attempt = this.reachable[type].maxy;
			if (attempt > max_maxy) {
				max_maxy = attempt;
				choices = [];
				for (var j = 0; j < this.reachable[type].score; j++)
					choices.push(type);
			} else if (attempt == max_maxy)
				for (var j = 0; j < this.reachable[type].score; j++)
					choices.push(type);
		}

		if (choices.length == 1) {
			for (var i = 0; i < types.length - 3; i++)
				choices.push(choices[0]);
			for (var i = 0; i < types.length; i++)
				choices.push(types[i]);
		}
		if (choices.length > 0)
			this.shape = shapes.generateShape(choices[Math.floor(Math.random() * choices.length)]);			
		this._draw();
	},
	
	// Draw game data
	_draw:function(){
		canvas.drawScene(); 
		canvas.drawShape(this.shape);
		canvas.drawMatrix(this.matrix);
	},
	// Refresh game canvas
	_refresh:function(){
		if (!this.running){
			return;
		}
		this.currentTime = new Date().getTime();
		if (this.currentTime - this.prevTime > this.interval ){
			this._update();
			this.prevTime = this.currentTime;
		}
		if (!this.isGameOver){
			window.requestAnimationFrame(utils.proxy(this._refresh,this));	
		}
	},
	// Update game data
	_update:function(){
		if (this.shape.canDown(this.matrix)){
			this.shape.goDown(this.matrix);
		}else{
			this.shape.copyTo(this.matrix);
			this._check();
			this._fireShape();

			this.count++;
			if (this.level < 21) this._checkLevel();
			views.setCount(this.count);
		}
		this._draw();
		this.isGameOver = checkGameOver(this.matrix);
		views.setGameOver(this.isGameOver);
		if (this.isGameOver){
			views.setFinalScore(this.score);
		}
	},
	// Check and update game data
	_check:function(){
		var rows = checkFullRows(this.matrix);
		if (rows.length){
			removeRows(this.matrix,rows);
			
			var score = calcScore(rows);
			var reward = calcRewards(rows);
			this.score += score + reward;
			this.removedRowsMod4 += rows.length;

			views.setScore(this.score);
			views.setReward(reward);

		}
	},
	// Check and update game level			// original one,  based on time
	_checkLevel_origin:function(){
		var currentTime = new Date().getTime();
		if (currentTime - this.levelTime > consts.LEVEL_INTERVAL){
			this.level+=1;
			this.interval = calcIntervalByLevel(this.level);
			views.setLevel(this.level);
			this.levelTime = currentTime;
		}
	},
	// Check and update game level			// new one,  based on count (# of shapes created)
	_checkLevel:function(){
		if (this.removedRowsMod4 >= 4){
			this.level++;
			this.removedRowsMod4 -= 4;
			views.setLevel(this.level == 21 ? "Max" : this.level);
			this.interval = calcIntervalByLevel(this.level);
		}
	}
}


window.Tetris = Tetris;






},{"./canvas.js":1,"./consts.js":2,"./shapes.js":4,"./utils.js":5,"./views.js":6}],4:[function(require,module,exports){
var consts = require('./consts.js');
var COLORS =  consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;

/**
	Defined all shapes used in Tetris game. 
	You can add more shapes if you wish.
*/

function ShapeL(){
	var state1 = [  [1, 0],
					[1, 0],
					[1, 1] ];

	var state2 = [  [0, 0, 1],
					[1, 1, 1] ];

	var state3 = [  [1, 1],
					[0, 1],
					[0, 1] ];

	var state4 = [  [1, 1, 1],
					[1, 0, 0] ];


	this.states = [ state1, state2, state3, state4 ];
	this.x = consts.MID_COLUMN;
	this.y = -3;
	this.flag = 'L';
}

function ShapeLR()
{
	var state1 = [  [0, 1],
					[0, 1],
					[1, 1] ];

	var state2 = [  [1, 1, 1],
					[0, 0, 1] ];

	var state3 = [  [1, 1],
					[1, 0],
					[1, 0] ];

	var state4 = [  [1, 0, 0],
					[1, 1, 1] ];


	this.states = [ state1, state2, state3, state4 ];
	this.x = consts.MID_COLUMN;
	this.y = -3;
	this.flag = 'LR';
}

function ShapeO()
{

	var state1 = [  [1, 1],
					[1, 1] ];


	this.states = [ state1 ];
	this.x = consts.MID_COLUMN;
	this.y = -2;
	this.flag = 'O';
}

function ShapeI()
{
	var state1 = [  [1],
					[1],
					[1],
					[1] ];

	var state2 = [  [1,1,1,1] ];

	this.states = [ state1, state2 ];

	this.x = consts.MID_COLUMN;
	this.y = -4;
	this.flag = 'I';
}

function ShapeT()
{
	var state1 = [  [1, 1, 1],
					[0, 1, 0] ];

	var state2 = [  [1, 0],
					[1, 1],
					[1, 0] ];

	var state3 = [  [0, 1, 0],
					[1, 1, 1] ];

	var state4 = [  [0, 1],
					[1, 1],
					[0, 1] ];

	this.states = [ state1, state2, state3, state4 ];
	this.x = consts.MID_COLUMN;
	this.y = -2;
	this.flag = 'T';
}

function ShapeZ()
{
	var state1 = [  [1, 1, 0],
					[0, 1, 1] ];

	var state2 = [  [0, 1],
					[1, 1],
					[1, 0] ];

	this.states = [ state1, state2 ];
	this.x = consts.MID_COLUMN;
	this.y = -2;
	this.flag = 'Z';
}

function ShapeZR()
{
	var state1 = [  [0, 1, 1],
					[1, 1, 0] ];

	var state2 = [  [1, 0],
					[1, 1],
					[0, 1] ];

	this.states = [ state1, state2 ];
	this.x = consts.MID_COLUMN;
	this.y = -2;
	this.flag = 'ZR';
}

/**
Is shape can move
@param shape: tetris shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isShapeCanMove = function(shape,matrix,action){
	var rows = matrix.length;
	var cols = matrix[0].length;

	var isBoxCanMove = function(box){

		var x = shape.x + box.x;
		var y = shape.y + box.y;
		if (y<0){
			return true;
		}
		if (action === 'left'){
			x--;
			return x>=0 && x<cols && matrix[y][x]==0;
		}else if (action === 'right'){
			x++;
			return x>=0 && x<cols && matrix[y][x]==0;
		}else if (action === 'down'){
			y++;
			return y<rows && matrix[y][x]==0;
		}else if (action === 'rotate'){
			return y<rows && !matrix[y][x];
		}
	};

	var boxes =  action === 'rotate'?shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);

	for(var i in boxes){
		if (!isBoxCanMove(boxes[i])){
			return false;
		}
	}
	return true;
};

/**
 All shapes shares the same method, use prototype for memory optimized
*/
ShapeL.prototype =
ShapeLR.prototype =
ShapeO.prototype =
ShapeI.prototype =
ShapeT.prototype =
ShapeZ.prototype =
ShapeZR.prototype = {

	init:function(){
		this.color = COLORS[Math.floor(Math.random() * 7)];
		this.state = 0;
		this.allBoxes = {};
		this.y = 0;
	},
	// Get boxes matrix which composite the shape
	getBoxes:function(state){

		var boxes = this.allBoxes[state]||[];
		if (boxes.length){
			return boxes;
		}

		var matrix = this.matrix(state);
		for(var i = 0; i<matrix.length;i++){
			var row = matrix[i];
			for(var j = 0; j<row.length;j++){
				if (row[j] === 1){
					boxes.push({x:j,y:i});
				}
			}
		}
		this.allBoxes[state] = boxes;
		return boxes;
	},
	//Get matrix for specified state
	matrix:function(state){
		var st = state!==undefined?state:this.state;
		return this.states[st];
	},
	//Rotate shape
	rotate:function(matrix){
		if (isShapeCanMove(this,matrix,'rotate')){
			this.state = this.nextState();
			//fix position if shape is out of right border
			var right = this.getRight();
			if (right >= COLUMN_COUNT){
				this.x -= right - COLUMN_COUNT + 1;
			}
		}
	},
	//Caculate the max column of the shape
	getColumnCount:function(){
		var mtx = this.matrix();
		var colCount = 0;
		for(var i=0;i<mtx.length;i++){
			colCount = Math.max(colCount,mtx[i].length);
		}
		return colCount;
	},
	//Caculate the max row of the shape
	getRowCount:function(){
		return this.matrix().length;
	},
	//Get the right pos of the shape
	getRight:function(){
		var boxes = this.getBoxes(this.state);
		var right = 0;

		for	(var i in boxes){
			right = Math.max(boxes[i].x,right);
		}
		return this.x + right;
	},
	//Return the next state of the shape
	nextState:function(){
		return (this.state + 1) % this.states.length;
	},
	//Check if the shape can move down
	canDown:function(matrix){
		return isShapeCanMove(this,matrix,'down');
	},
	//Move the shape down 
	goDown:function(matrix){
		if (isShapeCanMove(this,matrix,'down')){
			this.y+=1;
		}
	},
	//Move the shape to the Bottommost
	goBottom:function(matrix){
		while (isShapeCanMove(this,matrix,'down')){
			this.y+=1;
		}
	},
	//Move the shape to the left
	goLeft:function(matrix){
		if (isShapeCanMove(this,matrix,'left')){
			this.x-=1;
		}
	},
	//Move the shape to the right
	goRight:function(matrix){
		if (isShapeCanMove(this,matrix,'right')){
			this.x+=1;
		}
	},
	//Copy the shape data to the game data
	copyTo:function(matrix){
		var smatrix = this.matrix();
		for(var i = 0;i<smatrix.length;i++){
			var row = smatrix[i];
			for(var j = 0;j<row.length;j++){
				if (row[j] === 1){
					var x = this.x + j;
					var y = this.y + i;
					if (x>=0&&x<matrix[0].length&&y>=0&&y<matrix.length){
						matrix[y][x] = this.color;
					}
				}
			}
		}
	}
}

/**
	Create  a random shape for game
*/
function randomShape()
{
	var result = Math.floor( Math.random() * 7 );
	var shape;

	switch(result)
	{
		case 0: shape = new ShapeL();			break;
		case 1: shape = new ShapeO();			break;
		case 2: shape = new ShapeZ();			break;
		case 3: shape = new ShapeT();			break;
		case 4: shape = new ShapeLR();			break;
		case 5: shape = new ShapeZR();			break;
		case 6: shape = new ShapeI();			break;
	}
	shape.init();
	return shape;
}

function generateShape(shapeType) {
	var types = ["L", "LR", "T", "Z", "ZR", "I", "O"];
	var type = (typeof shapeType == "number") ? types[shapeType] : shapeType;
	var shape;
	switch (type) {
		case "L":	shape = new ShapeL();			break;
		case "LR":	shape = new ShapeLR();			break;
		case "T":	shape = new ShapeT();			break;
		case "Z":	shape = new ShapeZ();			break;
		case "ZR":	shape = new ShapeZR();			break;
		case "I":	shape = new ShapeI();			break;
		case "O":	shape = new ShapeO();			break;
	}

	shape.init();
	return shape;
}

module.exports.randomShape = randomShape;
module.exports.generateShape = generateShape;

},{"./consts.js":2}],5:[function(require,module,exports){

var exports = module.exports = {};

var $ = function(id){
	return document.getElementById(id);
};



//if object is plain object
var _isPlainObject = function(obj) {

    if (typeof obj !== 'object') {
        return false;
    }


    if (obj.constructor &&
        !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};
// this method source code is from jquery 2.0.x
// merge object's value and return
var extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = true;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && typeof obj !== 'function') {
        target = {};
    }


    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && _isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};


var proxy = function(fn,context){
    var args = [].slice.call( arguments, 2 );
    proxy = function() {
            return fn.apply( context || this, args.concat( [].slice.call( arguments ) ) );
    };
    return proxy;
};

var aniFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = aniFrame;


exports.$ = $;
exports.extend = extend;
exports.proxy = proxy;

},{}],6:[function(require,module,exports){
/**
 All dom definitions and actions
*/
var utils = require('./utils.js');
var consts = require('./consts.js');

var $ = utils.$;

//doms
var scene = $('scene');
var down = $('down');
var side = $('side');
var info = $('info');
var preview = $('preview');
var level = $('level');
var score = $('score');
var count = $('count');
var rewardInfo = $('rewardInfo');
var reward = $('reward');
var gameOver = $('gameOver');
var btnRestart = $('restart');
var finalScore = $('finalScore');
var instr = $('instr');
var instruction = $('instruction');
var btnBack = $('back');
var i18n = $('i18n');



/**
	Caculate the game container size
*/
var getContainerSize = function(maxW,maxH){

	var dw = document.documentElement.clientWidth;
	var dh = document.documentElement.clientHeight;

	var size = {};
	if (dw>dh){
		size.height = Math.min(maxH,dh);
		size.width = Math.min(size.height / 2, maxW);
	}else{
		size.width = Math.min(maxW,dw);
		size.height =  Math.min(maxH,dh);
	}
	return size;

};

// default
var INFO_HEIGHT = 80;
var CTRL_HEIGHT = 120;

/**
	Layout game elements
*/
var layoutView = function(container,maxW,maxH){
	var size = getContainerSize(maxW,maxH);
	var st = container.style;
	st.height = size.height + 'px';
	st.width = size.width + 'px';
	st.marginTop = (-(size.height/2)) + 'px';
	st.marginLeft = (-(size.width/2)) + 'px';

	//layout scene

	var scene_h = size.height - INFO_HEIGHT - CTRL_HEIGHT;
	var scene_w = size.width;

	var ratio = consts.ROW_COUNT / consts.COLUMN_COUNT;
	if (scene_h / scene_w < consts.ROW_COUNT / consts.COLUMN_COUNT) {
		scene_w = scene_h / ratio;
	} else {
		scene_h = scene_w * ratio;
	}
	scene.height = scene_h * 2;
	scene.width = scene_w * 2;
	scene.style.height = scene_h + "px";
	scene.style.width = scene_w  + "px";
	scene.style.marginLeft = (size.width - scene_w) / 2 + "px";
	//scene.style = "width: " + scene_w + "px; height: " + scene_h + "px;";
	down.style.marginLeft = size.width / 50 + "px";
	down.style.marginRight = size.width / 50 + "px";

	// preview.width = 80;
	// preview.height = 80;

	gameOver.style.width = size.width +'px';
	gameOver.style.height = size.height +'px';
	gameOver.style.marginTop = 0;

}

/**
	Main tetris game view
*/
var tetrisView = {

	init:function(id, maxW,maxH){
	  this.container = $(id);
	  this.scene = scene;
	  this.preview = preview;
	  this.btnRestart = btnRestart;
	  layoutView(this.container,maxW,maxH);
	  this.scene.focus();
	  this.language = "en";
	  this.textMap;
	  this.initText();
	  this._initEvents();

	},
	_initEvents:function(){
		rewardInfo.addEventListener('animationEnd',function(e){ rewardInfo.className = 'invisible'; });
		instr.addEventListener("click", utils.proxy(this.setInstruction, this), false);
		btnBack.addEventListener('click', utils.proxy(this.setInstruction, this), false);
		i18n.addEventListener('click', utils.proxy(function() {
			this.setText(this.language == "en" ? "zh" : "en");
		}, this), false);
	},
	// Update the score 
	setScore:function(scoreNumber){
		score.innerHTML = scoreNumber;	
	},
	// Update the finnal score
	setFinalScore:function(scoreNumber){
		finalScore.innerHTML = scoreNumber;
	},
	// Update the level
	setLevel:function(levelNumber){
		level.innerHTML = levelNumber;
	},
	// Update the count
	setCount:function(countNumber){
		count.innerHTML = countNumber;
	},
	// Update the extra reward score
	setReward:function(rewardScore){
		if (rewardScore>0){
			reward.innerHTML = rewardScore;
			rewardInfo.className = 'fadeOutUp animated';	
		}else{
			rewardInfo.className = 'invisible';
		}
	},
	// Set game over view
	setGameOver:function(isGameOver){
		gameOver.style.display = isGameOver?'block':'none';
	},
	setInstruction: function() {
		if (instruction.style.display == 'block')
			instruction.style.display = 'none';
		else instruction.style.display = 'block';
	},
	initText: function() {
		var en = {};
		en.instr_title = "Instruction";
		en.des = "Unlike normal Tetris, this game tries to give you the block that you want. It's designed for lazy people to waste their time and become even lazier.";
		en.subtitle_info = "Info";
		en.des_level = "Start game with level 1.<br>Increased by 1 when 4 rows are eliminated.<br>Higher level means faster dropping speed.";
		en.des_score = "You will get 100 points for eliminating one row.<br>Bonus points for multiple row at a time.";
		en.des_count = "Number of blocks you've encountered so far.";
		en.subtitle_ctrl = "Control Panel";
		en.des_left = "Move to left";
		en.des_right = "Move to right";
		en.des_rotate = "Rotate 90° counterclockwise";
		en.des_down = "Move down 1 block immediately";
		en.des_bottom = "Go to bottom";
		en.des_magic = "Change the current block randomly";
		en.des_pause = "Pause/ the game";
		en.des_resume = "Resume the game";
		en.i18n = "中文";
		en.back = "Back";

		var zh = {};
		zh.instr_title = "说明";
		zh.des = "与常规的俄罗斯方块不同, 这个游戏想尽办法给你你想要的形状. 专门为懒人设计，让你可以浪费很多时间同时变得更懒.";
		zh.subtitle_info = "信息";
		zh.des_level = "开始时等级为 1 级.<br>每消除 4 行, 等级加一.<br>等级越高, 方块掉落的速度越快.";
		zh.des_score = "消除一行将得到 100 分.<br>同时消除多行会有额外奖励.";
		zh.des_count = "到当前位置遇到的方块总数.";
		zh.subtitle_ctrl = "控制按钮";
		zh.des_left = "向左移动";
		zh.des_right = "向右移动";
		zh.des_rotate = "逆时针旋转90°";
		zh.des_down = "立即下降一格";
		zh.des_bottom = "落到底部";
		zh.des_magic = "随机变换当前方块的形状";
		zh.des_pause = "暂停游戏";
		zh.des_resume = "继续游戏";
		zh.i18n = "English";
		zh.back = "返回";

		this.textMap = {};
		this.textMap.en = en;
		this.textMap.zh = zh;

		this.setText(this.language);
	},
	setText: function(language) {
		this.language = language;
		var text = this.textMap[language];
		var $ = utils.$;
		for (var id in text) {
			$(id).innerHTML = text[id];
		}
	}
};

module.exports = tetrisView;
},{"./consts.js":2,"./utils.js":5}]},{},[3]);
