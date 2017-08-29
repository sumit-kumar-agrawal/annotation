var circ = {
	origX: null,
	origY: null,
	fill: 'transparent',
	stroke: 'black',
	strokeWidth: 1,
	pointer: null,
	selectable: false,
	radius: 0,
    originX: 'center', 
	originY: 'center',
	circleObj: null,
}	

circ.addShape = function(){
	circle = new fabric.Circle({
		left: this.pointer.x,
		top: this.pointer.y,
		radius: this.radius,
		strokeWidth: this.strokeWidth,
		stroke: this.stroke,
		selectable: this.selectable,
		fill: this.fill,
		selectable: this.selectable,
		width:2,
		height:2,
	});
	this.circleObj = circle;
	return circle;
}

circ.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	this.circleObj.set({ radius: Math.abs(this.origX - pointer.x) });
}

circ.resetProperties = function(propObject){
	circ.fill = propObject.fill;
	circ.stroke = propObject.stroke;
	circ.strokeWidth = propObject.strokeWidth;
	circ.selectable = propObject.selectable;
}

circ.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}