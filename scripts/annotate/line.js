var line_shape = {
	origX: null,
	origY: null,
	fill: 'transparent',
	stroke: 'black',
	strokeWidth: 1,
	pointer: null,
	selectable: false,
	originX: 'center', 
	originY: 'center',
	lineObj: null,
}	

line_shape.addShape = function(){
	var points = [ this.pointer.x, this.pointer.y, this.pointer.x, this.pointer.y ];
	let line = new fabric.Line(points,{
		strokeWidth: this.strokeWidth,
		stroke: this.stroke,
		selectable: this.selectable,
		originX: this.originX, 
		originY: this.originY,
		fill: this.fill,
		selectable: this.selectable,
	});
	this.lineObj = line;
	return line;
}

line_shape.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	this.lineObj.set({ x2: pointer.x, y2: pointer.y });
}

line_shape.resetProperties = function(propObject){
	line_shape.fill = propObject.fill;
	line_shape.stroke = propObject.stroke;
	line_shape.strokeWidth = propObject.strokeWidth;
	line_shape.selectable = propObject.selectable;
}

line_shape.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}