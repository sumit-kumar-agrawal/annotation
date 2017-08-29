var triangle_shape = {
	origX: null,
	origY: null,
	fill: 'transparent',
	stroke: 'black',
	strokeWidth: 1,
	pointer: null,
	selectable: false,
	originX: 'center', 
	originY: 'center',
	triangleObj: null,
}	

triangle_shape.addShape = function(){
   let tri = new fabric.Triangle({
		left: this.pointer.x,
		top: this.pointer.y,
		strokeWidth: this.strokeWidth,
		stroke: this.stroke,
		selectable: this.selectable,
		originX: this.originX, 
		originY: this.originY,
		fill: this.fill,
		selectable: this.selectable,
		width: 0,
		height:0,
		
	}); 
	this.triangleObj = tri;
	return tri;
}

triangle_shape.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	this.triangleObj.set({ width: Math.abs(this.origX - pointer.x),height: Math.abs(this.origY - pointer.y)});
}

triangle_shape.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}