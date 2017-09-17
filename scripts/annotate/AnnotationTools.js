var probe = require('probe-image-size');
var state, undo = [], redo = [], moveMode = true;
var minX, minY, maxX, maxY, isDown, shape, textbox, selectedObj = null;
var jsPdf = require('jspdf');

var state = [];
var mods = 0;
var isRedoing = false;
var h = [];

var AnnotationTool = {
	canvas: null,
	pencilcolor: '#0000',
	markercolor: '#0000',
	current: null,
	clipRect: null,
	properties: {
		selectable: false,
		fillColor: 'transparent',
		strokeColor: 'black',
		strokeWidth: 1,
		fontSize: 14,
		fontFamily: "Arial",
		textColor: 'black'
	}
};

// 1. get image from dom
// 2. initialize the canvase
// 3. set image on canvas
AnnotationTool.ready = function (fs) {

	let canvas_file_path = $('#canvas_image_file_path').val();
	let dimensions = probe.sync(fs.readFileSync(canvas_file_path));

	this.initializeCanvas({
		width: dimensions.width,
		height: dimensions.height,
		canvas_file_path: '.' + canvas_file_path
	});

};

AnnotationTool.initialize = function (annotationType) {
	this.set(annotationType);
};

AnnotationTool.set = function (object) {
	this.current = object;
	this.drawShape();
};

AnnotationTool.isThisShapeObj = function () {
	let shapeObj = this.getShapeObj();
	if (shapeObj == undefined) {
		console.log("Error: Shape object could not found");
		return false;
	} else {
		return shapeObj;
	}
};

AnnotationTool.setCanvasProperties = function () {
	this.canvas.isDrawingMode = true;
	this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
	if (this.current == 'highlighter') {
		this.canvas.freeDrawingBrush.width = 18;
		this.canvas.freeDrawingBrush.color = hexToRgbA(AnnotationTool.markercolor, '0.5');

	}
	else {
		this.canvas.freeDrawingBrush.color = AnnotationTool.pencilcolor;
		this.canvas.freeDrawingBrush.width = parseInt(AnnotationTool.properties.strokeWidth, 10) || 1;
		this.canvas.freeDrawingCursor = 'pointer';
	}
}
AnnotationTool.drawShape = function () {
	if (this.current == 'move') {
		AnnotationTool.moveObject();
	} else if (this.current == 'undo') {
		AnnotationTool.undoAndRedo('undo');
	} else if (this.current == 'redo') {
		AnnotationTool.undoAndRedo('redo');
	} else {
		this.checkDrawingMode();
	}

};

AnnotationTool.reset = function () {
	state, undo = [], redo = [];

	this.canvas.clear();
	this.canvas = null;
	
	clearAndRecreateCanvasDiv();
	let canvas_file_path = $('#canvas_image_file_path').val();

	let dimensions = probe.sync(fs.readFileSync(canvas_file_path));
	this.initializeCanvas({
		width: dimensions.width,
		height: dimensions.height,
		canvas_file_path: '.' + canvas_file_path
	});
	
};

AnnotationTool.getShapeObj = function () {
	var shapeObj;
	if (this.current == 'rectangle') {
		shapeObj = rect;
	} else if (this.current == 'circle') {
		shapeObj = circ;
	} else if (this.current == 'line') {
		shapeObj = line_shape;
	} else if (this.current == 'triangle') {
		shapeObj = triangle_shape;
	} else if (this.current == 'arrow') {
		shapeObj = line_arrow_shape;
	} else if (this.current == 'textbox') {
		shapeObj = normalTextBox;
	} else if (this.current == 'blur') {
		shapeObj = blurBox;
	} else if (this.current == 'pencil' || this.current == 'highlighter') {
		isDown = false;
		this.setCanvasProperties();
		return;
	}
	return shapeObj;
};

AnnotationTool.addShapeInCanvas = function () {
	if (this.canvas.isDrawingMode) return;
	this.canvas.add(shape);
}

AnnotationTool.checkDrawingMode = function () {
	if (this.current == 'pencil' || this.current == 'highlighter') {
		this.setCanvasProperties();
	} else {
		this.canvas.isDrawingMode = false;
	}
}

AnnotationTool.resetShapePopertise = function (propObj) {
	let prop = {
		fill: propObj.fillColor,
		stroke: propObj.strokeColor,
		strokeWidth: propObj.strokeWidth,
		selectable: propObj.selectable,
		fontSize: propObj.fontSize,
		fontFamily: propObj.fontFamily,
		textColor: propObj.textColor
	};
	rect.resetProperties(prop);
	circ.resetProperties(prop);
	line_shape.resetProperties(prop);
	line_arrow_shape.resetProperties(prop);
	normalTextBox.resetProperties(prop);
}



AnnotationTool.replay = function (playStack, saveStack, buttonsOn, canvas, buttonsOff) {
	saveStack.push(state);
	state = playStack.pop();
	//var on = $(buttonsOn);
	//var off = $(buttonsOff);
	// turn both buttons off for the moment to prevent rapid clicking
	//on.prop('disabled', true);
	//off.prop('disabled', true);
	canvas.clear();
	canvas.loadFromJSON(state, function () {
		canvas.renderAll();
		// now turn the buttons back on if applicable
		//on.prop('disabled', false);
		if (playStack.length) {
			//off.prop('disabled', false);
		}
	});
};

AnnotationTool.checkmove = function (e) {
	var obj = e.target;
	obj.setCoords();
	var b = obj.getBoundingRect();
	if (!(b.left >= minX && maxX >= b.left + b.width)) {
		obj.left = obj.lastLeft;
		obj.scaleX = obj.lastScaleX
		obj.scaleY = obj.lastScaleY
	} else {
		obj.lastLeft = obj.left;
		obj.lastScaleX = obj.scaleX
	}
	if (!(maxY >= b.top + b.height && b.top >= minY)) {
		obj.top = obj.lastTop;
		obj.scaleX = obj.lastScaleX
		obj.scaleY = obj.lastScaleY
	} else {
		obj.lastTop = obj.top;
		obj.lastScaleY = obj.scaleY
	}

}

AnnotationTool.getAnnotateImage = function (e) {
	let img = this.canvas.toDataURL();
	var data = img.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	return buf;
}

AnnotationTool.setColor = function (color = '000fff', color_action = 'fill')  {
	if(color_action == 'fill'){
		AnnotationTool.properties.fillColor = color;
	}else{
		if(this.current == 'pencil'){
			AnnotationTool.pencilcolor = (color == '000fff') ? '000000' : color;
			AnnotationTool.properties.strokeColor = color;
			this.setCanvasProperties();
		}else if(this.current == 'highlighter'){
			AnnotationTool.markercolor = (color == '000fff') ? '000000' : color;
			this.setCanvasProperties();
		}else if(this.current == 'textbox'){
			AnnotationTool.properties.textColor = color;
		}
	}
	AnnotationTool.resetShapePopertise(AnnotationTool.properties);
};

AnnotationTool.setFontSize = function (size) {
	AnnotationTool.properties.fontSize = size;
	AnnotationTool.resetShapePopertise(AnnotationTool.properties);
}

AnnotationTool.setFontFamily = function (family) {
	AnnotationTool.properties.fontFamily = family;
	AnnotationTool.resetShapePopertise(AnnotationTool.properties);
}

AnnotationTool.setStrokeWidth = function (e) {
	AnnotationTool.properties.strokeWidth = e.value;
	AnnotationTool.resetShapePopertise(AnnotationTool.properties);
};

AnnotationTool.undoAndRedo = function (action) {
	if (action === 'redo' && redo.length > 0) {
		AnnotationTool.replay(redo, undo, '#undo', AnnotationTool.canvas, this);
	} else if (action === 'undo' && undo.length > 0) {
		AnnotationTool.replay(undo, redo, '#redo', AnnotationTool.canvas, this);
	}
};

AnnotationTool.triggerFillColor = function () {
	$('#fill-color-picker')[0].click();
};

AnnotationTool.sendToBackwards = function () {
	let active_obj = this.canvas.getActiveObject();
	this.canvas.sendBackwards(active_obj);
}

AnnotationTool.bringToForwads = function () {
	let active_obj = this.canvas.getActiveObject();
	this.canvas.bringForward(active_obj);

}

AnnotationTool.enterCropMode = function () {
	this.createCropSelectRect({
		left: (this.canvas.width * 0.1),
		top: (this.canvas.height * 0.1),
		width: (this.canvas.width - (this.canvas.width * 0.3)),
		height: (this.canvas.height - (this.canvas.height * 0.3)),
		visible: true
	});
	this.canvas.isDrawingMode = false;
	this.current = 'crop';
	this.canvas.renderAll();
	AnnotationTool.handleCropBtnVisibility(true);
};

AnnotationTool.crop = function () {
	AnnotationTool.handleCropBtnVisibility(false);
	let rectConfig = getSelectRectConfig();

	this.clipRect.visible = false;
	this.clipRect.selectable = false;

	let scale = 1;
	let x = this.clipRect.left;
	let y = this.clipRect.top;

	x *= 1 / scale;
	y *= 1 / scale;

	let width = rectConfig.width * 1 / scale;
	let height = rectConfig.height * 1 / scale;

	let dataURL = this.canvas.toDataURL({
		left: x,
		top: y,
		width: width,
		height: height
	});

	this.cancelCrop();
	this.canvas.clear();
	this.canvas = null;
	
	clearAndRecreateCanvasDiv();

	this.initializeCanvas({
		width: width,
		height: height,
		canvas_file_path: dataURL
	});
};

AnnotationTool.handleCropBtnVisibility = function (visible) {
	let opacityVal = 0;
	let toolsPointerEvent = 'none';
	if (visible) {
		$('#crop-btn').show();
		$('#cancel-crop-btn').show();
		$('.compare').hide();
		opacityVal = 0.3;
		toolsPointerEvent = 'none';
	} else {
		$('#crop-btn').hide();
		$('#cancel-crop-btn').hide();
		$('.compare').show();
		opacityVal = 1;
		toolsPointerEvent = 'auto';
	}
	$('.mainTools .tools').not('#crop-btn, #cancel-crop-btn').css({ 'opacity': opacityVal, 'pointer-events': toolsPointerEvent });
};

AnnotationTool.createCropSelectRect = function (options) {
	if (AnnotationTool.clipRect) {
		AnnotationTool.clipRect.left = options.left || AnnotationTool.clipRect.left;
		AnnotationTool.clipRect.top = options.top || AnnotationTool.clipRect.top;
		AnnotationTool.clipRect.width = options.width || AnnotationTool.clipRect.width;
		AnnotationTool.clipRect.height = options.height || AnnotationTool.clipRect.height;
	} else {
		AnnotationTool.clipRect = new fabric.Rect({
			originX: 'left',
			originY: 'top',
			left: options.left || 0,
			top: options.top || 0,
			width: options.width,
			height: options.height,
			fill: hexToRgbA('#EBF5FB', 0.5),
			stroke: hexToRgbA('#000000', 0.6),
			strokeWidth: 2,
			selectable: true,
			hasRotatingPoint: false
		});
		this.canvas.add(AnnotationTool.clipRect);
		// this.canvas.setActiveObject(AnnotationTool.clipRect);
	}
	AnnotationTool.clipRect.bringToFront();
	AnnotationTool.clipRect.visible = options.visible || false;
};

AnnotationTool.cancelCrop = function (btnId) {
	this.clipRect.hasBorders = false;
	this.clipRect.hasControls = false;
	this.clipRect.selectable = false;
	this.clipRect.visible = false;
	this.clipRect = null;
	this.current = null;
	AnnotationTool.handleCropBtnVisibility(false);
	if (btnId == 'cancel-crop-btn') this.canvas.renderAll();
};

AnnotationTool.initializeCanvas = function (options) {
	if (this.canvas) this.canvas = null;
	this.canvas = new fabric.Canvas('selectionCanvas', {
		width: options.width,
		height: options.height,
		preserveObjectStacking: true,
		selection: true,
	});

	this.canvas.setBackgroundImage(options.canvas_file_path, this.canvas.renderAll.bind(this.canvas), {
		originX: 'left',
		originY: 'top',
		left: 0,
		top: 0
	});

	minX = 0;
	maxX = options.width;
	minY = 0;
	maxY = options.height;

	this.canvas.observe('object:modified', () => {
		//this.updateModifications();
	});

	this.canvas.observe('object:added', () => {
		this.updateModifications();
		
	});

	this.canvas.on('mouse:down', o => {
		this.removeEmptyTextObjects();
		if (this.current == 'crop' || textbox) return;

		if (this.canvas.isDrawingMode) {
			AnnotationTool.setCanvasProperties();
			this.updateModifications(true);
			return;
		}

		let shapeObj = AnnotationTool.isThisShapeObj();
		if (shapeObj === false) return;

		isDown = true;
		var pointer = this.canvas.getPointer(o.e);
		shapeObj.init({ pointer: pointer });
		shape = shapeObj.addShape();
		//AnnotationTool.addShapeInCanvas();
		//this.updateModifications(true);
	});

	this.canvas.on('mouse:move', o => {
		if (!isDown || this.canvas.isDrawingMode || !moveMode) return;
		let pointer = this.canvas.getPointer(o.e);
		let shapeObj = AnnotationTool.isThisShapeObj();
		if (shapeObj === false) return;
		shapeObj.setCordinate(pointer, this.canvas);
		//this.canvas.renderAll();
	});

	this.canvas.on('mouse:up', o => {
		if (this.current == 'crop' || textbox || (selectedObj != null )) return;
		let shapeObj = AnnotationTool.isThisShapeObj();
		if (shapeObj === false) return;
		isDown = false;
		AnnotationTool.addShapeInCanvas();
		if (this.current == 'textbox') {
			/*** 
			 * This is to initiate edit mode of the text event
			*/
			shapeObj.initiateEditing(this.canvas);
		}
		//this.updateModifications();
	});

	this.canvas.on('object:selected', function (e) {
		moveMode = false;
		e.target.transparentCorners = false;
        e.target.borderColor = '#cccccc';
        e.target.cornerColor = '#0CB7F0';
        e.target.minScaleLimit = 2;
        e.target.cornerStrokeColor = '#0CB7F0';
        e.target.cornerStyle = 'circle';
        e.target.minScaleLimit = 0;
        e.target.lockScalingFlip = true;
        e.target.padding = 5;
        e.target.selectionDashArray = [10, 5];
        e.target.borderDashArray = [10, 5];
        e.target.cornerDashArray = [10, 5];

	});

	this.canvas.on('selection:cleared', function () {
		moveMode = true;
	});

	this.canvas.on('mouse:over', (opts) => {
		selectedObj = opts.target;
		if (selectedObj == undefined) return;
		if (selectedObj.type == 'textbox') {
			textbox = true;
		}
		selectedObj.selectable = true;
	});

	this.canvas.on('mouse:out', (opts) => {
		selectedObj = null;
		textbox = false;
	});

	this.canvas.observe("object:moving", AnnotationTool.checkmove);

};

AnnotationTool.removeEmptyTextObjects = function(){
    this.canvas.getObjects().filter(o => {
		if (o.type === 'textbox' && o.text == "") {
			this.canvas.remove(o);
	    }
    });
}


AnnotationTool.updateModifications = function (savehistory = true) {
	//redo = [];
	//$('#redo').prop('disabled', true);
	// initial call won't have a state
	//if (state) {
		//undo.push(state);
		//$('#undo').prop('disabled', false);
	//}
	//state = JSON.stringify(this.canvas);

	// if (savehistory === true) {
	// 	myjson = JSON.stringify(this.canvas);
	// 	state.push(myjson);
	// }

	if(!isRedoing){
		state = [];
	}
	isRedoing = false;
};


AnnotationTool.redo1 = function(){
	if(state.length>0){
		isRedoing = true;
	    this.canvas.add(state.pop());
	}
}


AnnotationTool.undo1 = function(){
	if(this.canvas._objects.length > 0){
		state.push(this.canvas._objects.pop());
		this.canvas.renderAll();
	}
}

function getSelectRectConfig() {
	let config = {
		width: 0,
		height: 0
	};
	let rectCoords = AnnotationTool.clipRect.oCoords;
	config.width = rectCoords.tr.x - rectCoords.tl.x;
	config.height = rectCoords.bl.y - rectCoords.tl.y;
	return config;
};

function hexToRgbA(color, transparency) {
	color = color.substring(1, 7);
	var r = parseInt(color.substring(0, 2), 16);
	var g = parseInt(color.substring(2, 4), 16);
	var b = parseInt(color.substring(4, 6), 16);
	var a = transparency;
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

function clearAndRecreateCanvasDiv(){
	$('#captured_screenshot_div').empty();
	//------------------
	let elm = `<canvas id="selectionCanvas" class='image-canvas'></canvas>
				<div style="clear:both;"></div>`;
	$(elm).appendTo('#captured_screenshot_div');
	//------------------
}

/********* 
 * Overriding drawControls method of core fabric.
 * Added rotation icon for object
*/
fabric.Object.prototype.drawControls = function (ctx) {
	
	  if (!this.hasControls) {
		  return this;
	  }
	
	  var wh = this._calculateCurrentDimensions(),
		  width = wh.x,
		  height = wh.y,
		  scaleOffset = this.cornerSize,
		  left = -(width + scaleOffset) / 2,
		  top = -(height + scaleOffset) / 2,
		  methodName = this.transparentCorners ? 'stroke' : 'fill';
	
	  ctx.save();
	  ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
	  if (!this.transparentCorners) {
		ctx.strokeStyle = this.cornerStrokeColor;
	  }
	  this._setLineDash(ctx, this.cornerDashArray, null);
	
	  // top-left
	  this._drawControl('tl', ctx, methodName,
		left,
		top);
	
	  // top-right
	  this._drawControl('tr', ctx, methodName,
		left + width,
		top);
	
	  // bottom-left
	  this._drawControl('bl', ctx, methodName,
		left,
		top + height);
	
	  // bottom-right
	  this._drawControl('br', ctx, methodName,
		left + width,
		top + height);
	
	  if (!this.get('lockUniScaling')) {
	
		// middle-top
		this._drawControl('mt', ctx, methodName,
		  left + width / 2,
		  top);
	
		// middle-bottom
		this._drawControl('mb', ctx, methodName,
		  left + width / 2,
		  top + height);
	
		// middle-right
		this._drawControl('mr', ctx, methodName,
		  left + width,
		  top + height / 2);
	
		// middle-left
		this._drawControl('ml', ctx, methodName,
		  left,
		  top + height / 2);
	  }
	
	  // middle-top-rotate
	  if (this.hasRotatingPoint) {
		var rotate = new Image(), rotateLeft, rotateTop;
		rotate.src = '../../images/icons/Annotation-Screen/arrow-rotate-clockwise.png';
		rotateLeft = left + width / 2;
		rotateTop = top - this.rotatingPointOffset;
		ctx.drawImage(rotate, rotateLeft, rotateTop, 15, 15);
	  }
	
	  ctx.restore();
	
	  return this;
	
	}

