var isDown, shape, selectedObject;
var state, undo = [], redo = [], moveMode = true, maxStrokeWidth = 5;
var minX, minY, maxX, maxY;
var annotate = {
	canvas: null,
	current: null,
	properties: {
		selectable: false,
		fillColor: 'transparent',
		strokeColor: 'black',
		strokeWidth: 1,
		transparentCorners: true,
		cornerSize: 15
	}
};



// 1. get image from dom
// 2. initialize the canvase
// 3. set image on canvas
annotate.ready = function () {
	// let image = new fabric.Image(document.getElementById('baseImage'), {
	// 	selectable: false,
	// 	hoverCursor: 'default',
	// 	strokeDashArray: [2, 2],
	// 	stroke: '#ccc',
	// 	evented: false,
	// });

	this.canvas = new fabric.Canvas('imageCanvas', {
		width: 800,
		height: 689,
		preserveObjectStacking: true
	});
	//this.canvas.add(image);

	// minX = image.oCoords.tl.x;
	// maxX = image.oCoords.br.x;
	// minY = image.oCoords.tl.y;
	// maxY = image.oCoords.br.y;

	for (i = 2; i <= maxStrokeWidth; i++) {
		$('#stroke-width-selector').append($("<option></option>").attr("value", i).text(i));
	}


	// var rect = new fabric.Rect({
	// 	left: 150,
	// 	top: 80,
	// 	width: 160,
	// 	height: 90,
	// 	fill: '#ADC964',
	// 	selectable: false
	// });
	// this.canvas.add(rect);

	// var rect = new fabric.Rect({
	// 	left: 250,
	// 	top: 80,
	// 	width: 100,
	// 	height: 90,
	// 	fill: 'red',
	// 	selectable: false
	// });
	// this.canvas.add(rect);

	this.canvas.on('object:selected', function (event) {
		moveMode = false;
		selectedObject = event.target;
	});

	this.canvas.on('selection:cleared', function () {
		moveMode = true;
	});

	this.canvas.on('mouse:over', (opts) => {
		var selected = opts.target;
		//if (!selected || selected.type == 'image') return;
		selected.selectable = true;
	});
};

annotate.initialize = function (annotationType) {
	this.set(annotationType);
};

annotate.set = function (object) {
	this.current = object;
	this.drawShape();
};



annotate.drawShape = function () {
		this.checkDrawingMode();
		this.canvas.on('mouse:down', o => {
			if (this.canvas.isDrawingMode) return;
			isDown = true;
			var pointer = this.canvas.getPointer(o.e);
			let shapeObj = this.getShapeObj();
			if (shapeObj != 'undefined') {
				shapeObj.init({ pointer: pointer });
				shape = shapeObj.addShape();
				//this.addShapeInCanvas();
				//this.canvas.add(shape);
			} else {
				console.log('Error: shape object could not found.');
			}

		});

		this.canvas.on('mouse:move', o => {
			if (!isDown || this.canvas.isDrawingMode || !moveMode) return;
			//this.setObjectProperties();
			let pointer = this.canvas.getPointer(o.e);
			let shapeObj = this.getShapeObj();
			if (shapeObj != 'undefined') {
				shapeObj.setCordinate(pointer, this.canvas);
				this.canvas.renderAll();
			} else {
				console.log('Error: shape object could not found.');
			}
		});

		this.canvas.on('mouse:up', o => {
			isDown = false;
			if (this.canvas.isDrawingMode) return;
			annotate.addShapeInCanvas();

		});

		

		//this.canvas.observe("object:moving", annotate.checkmove);
	
};

annotate.moveObject = function () {

	//isDown = false;
	//this.resetShapePopertise(this.properties);
};

annotate.sendSelectedObjectBack = function() {
	this.canvas.sendToBack(selectedObject);
}
  
annotate.sendSelectedObjectToFront = function() {
	this.canvas.bringToFront(selectedObject);
	
}


annotate.setObjectProperties = function () {
	//this.properties.selectable = true;
	//this.properties.stroke = 
	this.resetShapePopertise(this.properties);
}
annotate.getShapeObj = function () {
	var shapeObj;
	shapeObj = rect;
	return shapeObj;
};

annotate.addShapeInCanvas = function () {
	if (this.current == 'arrow') {
		this.canvas.add(shape[0], shape[1]);
	} else {
		this.canvas.add(shape);
	}
}

annotate.checkDrawingMode = function () {
	if (this.current == 'pencil') {
		this.canvas.isDrawingMode = true;
	} else {
		this.canvas.isDrawingMode = false;
	}
}

annotate.resetShapePopertise = function (propObj) {
	let prop = {
		fill: propObj.fillColor,
		stroke: propObj.strokeColor,
		strokeWidth: propObj.strokeWidth,
		selectable: propObj.selectable,
		transparentCorners: true,
		cornerSize: 15
	};
	rect.resetProperties(prop);
}


annotate.checkmove = function (e) {
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

annotate.setColor = function (e) {
	if (e.id == 'stroke-color-picker')
		annotate.properties.strokeColor = e.value;
	else if (e.id == 'fill-color-picker')
		annotate.properties.fillColor = e.value;

	annotate.resetShapePopertise(annotate.properties);
};

annotate.setStrokeWidth = function (e) {
	annotate.properties.strokeWidth = e.value;
	annotate.resetShapePopertise(annotate.properties);
};