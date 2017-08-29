//let fabric = require('/Projects/annotations/node_modules/fabric/dist/fabric.require').fabric;
var isDown, shape;
var state,undo = [],redo = [], moveMode=true;;
var minX, minY, maxX, maxY;
var annotate = {
    canvas: null,
    current: null,
	properties: {
		selectable: false,
		fillColor: 'transparent',
		strokeColor: 'black', 
		strokeWidth: 1
	}
};

 

// 1. get image from dom
// 2. initialize the canvase
// 3. set image on canvas
annotate.ready = function() {
	let image = new fabric.Image(document.getElementById('baseImage'), {
        selectable: false,
        hoverCursor: 'default'
    });
	
	this.canvas = new fabric.Canvas('imageCanvas', {
        width: 800,
        height: 450,
        //selection: false,
        //stopContextMenu: true
    });
	this.canvas.add(image);

	minX = image.oCoords.tl.x;
  	maxX = image.oCoords.br.x;
  	minY = image.oCoords.tl.y;
  	maxY = image.oCoords.br.y;

	this.updateModifications();
	this.canvas.observe('object:modified', () => {
        this.updateModifications();
    });

};

annotate.initialize = function(annotationType) {
	this.set(annotationType);
};

annotate.set = function(object) {
    this.current = object;
	this.drawShape();
};

annotate.setCanvasProperties = function(){
	//this.canvas.isDrawingMode = true;
	//this.canvas.freeDrawingBrush.width = 15
	//this.canvas.freeDrawingBrush.color = e.target.value;
}
annotate.drawShape = function(){
	if(this.current == 'clear'){
		this.canvas.clear().renderAll();
	}else if(this.current == 'undo'){
		this.undo();
	}else if(this.current == 'redo'){
		this.redo();
	}else{
		this.checkDrawingMode();
		this.canvas.on('mouse:down', o => {
			if (this.canvas.isDrawingMode) return;
			isDown = true;
			//this.setObjectProperties();
			var pointer = this.canvas.getPointer(o.e);
			let shapeObj = this.getShapeObj();
			if(shapeObj != 'undefined'){
				shapeObj.init({pointer:pointer});
				shape = shapeObj.addShape();
				this.addShapeInCanvas();
				this.updateModifications(true);
				
    		}else{
				console.log('Error: shape object could not found.');
			}

		});

		this.canvas.on('mouse:move', o => {
			if (!isDown || this.canvas.isDrawingMode || !moveMode) return;
			//this.setObjectProperties();
			let pointer = this.canvas.getPointer(o.e);
			let shapeObj = this.getShapeObj();
			if(shapeObj != 'undefined'){
				shapeObj.setCordinate(pointer,this.canvas);
				this.canvas.renderAll();
			}else{
				console.log('Error: shape object could not found.');
			}	
		});

		this.canvas.on('mouse:up', o => {
			isDown = false;
			if (this.canvas.isDrawingMode) return;
			annotate.addShapeInCanvas();
			
		});

		this.canvas.on('object:selected', function(){
			moveMode = false;
		});

		this.canvas.on('selection:cleared', function(){  
			moveMode = true;      
		});

		this.canvas.on('mouse:over', (opts) => {  
			var selectedObj = opts.target;  
			if(!selectedObj || selectedObj.type == 'image') return;
			selectedObj.selectable = true;
		});

		this.canvas.observe("object:moving", annotate.checkmove);
		this.canvas.observe("object:scaling", annotate.checkscale);

	}	
};

annotate.moveObject = function(){
	
	//isDown = false;
	//this.resetShapePopertise(this.properties);
};

annotate.setObjectProperties = function(){
	this.properties.selectable = true;
	this.resetShapePopertise(this.properties);
}
annotate.getShapeObj = function(){
	var shapeObj;
	if(this.current == 'rectangle'){
		shapeObj = rect;
	}else if(this.current == 'circle'){
		shapeObj = circ;
	}else if(this.current == 'line'){
		shapeObj = line_shape;
	}else if(this.current == 'triangle'){
		shapeObj = triangle_shape;
	}else if(this.current == 'arrow'){
		shapeObj = line_arrow_shape;
	}else if(this.current == 'pencil'){
		isDown = false;
		//this.canvas.isDrawingMode = true;
		this.setCanvasProperties();
		return;
	}
	return shapeObj;
};

annotate.addShapeInCanvas = function(){
	if(this.current == 'arrow'){
		this.canvas.add(shape[0],shape[1]);
	}else{
		this.canvas.add(shape);
	}
}

annotate.checkDrawingMode = function(){
	if(this.current == 'pencil'){
		this.canvas.isDrawingMode = true;
	}else{
		this.canvas.isDrawingMode = false;
	}
}

annotate.resetShapePopertise = function(propObj){
	let prop = {
		fill: propObj.fillColor,
		stroke: propObj.strokeColor,
		strokeWidth: propObj.strokeWidth,
		selectable: propObj.selectable,
	  };
	rect.resetProperties(prop);
	circ.resetProperties(prop); 
	line_shape.resetProperties(prop); 
}

annotate.updateModifications = function() {
	redo = [];
	$('#redo').prop('disabled', true);
	// initial call won't have a state
	if (state) {
		undo.push(state);
		$('#undo').prop('disabled', false);
	}
	state = JSON.stringify(this.canvas);
};

annotate.replay = function(playStack, saveStack, buttonsOn,  canvas,buttonsOff){
	saveStack.push(state);
	state = playStack.pop();
	var on = $(buttonsOn);
	var off = $(buttonsOff);
	// turn both buttons off for the moment to prevent rapid clicking
	on.prop('disabled', true);
	off.prop('disabled', true);
	canvas.clear();
	canvas.loadFromJSON(state, function() {
		canvas.renderAll();
		// now turn the buttons back on if applicable
		on.prop('disabled', false);
		if (playStack.length) {
			off.prop('disabled', false);
		}
	});
};

annotate.checkmove = function(e) {
	var obj = e.target;
  	obj.setCoords();
  	var b = obj.getBoundingRect();
	if (!(b.left >= minX && maxX >= b.left + b.width)) {
		obj.left = obj.lastLeft;
		obj.scaleX= obj.lastScaleX
		obj.scaleY= obj.lastScaleY
	} else {
		obj.lastLeft = obj.left;
		obj.lastScaleX = obj.scaleX
	}
	if (!(maxY >= b.top + b.height && b.top >= minY)) {
		obj.top = obj.lastTop;
		obj.scaleX= obj.lastScaleX
		obj.scaleY= obj.lastScaleY
	} else {
		obj.lastTop = obj.top;
		obj.lastScaleY = obj.scaleY
	}
}

annotate.checkscale = function(e) {
	var obj = e.target;
  	obj.setCoords();
  	var b = obj.getBoundingRect();
  	if (!(b.left >= minX && maxX >= b.left + b.width && maxY >= b.top + b.height && b.top >= minY)) {
  		obj.left = obj.lastLeft;
  		obj.top = obj.lastTop;
  		obj.scaleX= obj.lastScaleX
  		obj.scaleY= obj.lastScaleY
  } else {
  		obj.lastLeft = obj.left;
  		obj.lastTop = obj.top;
  		obj.lastScaleX = obj.scaleX
  		obj.lastScaleY = obj.scaleY      
  }
}