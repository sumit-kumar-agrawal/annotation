var rect = {
	origX: null,
	origY: null,
	fill: 'transparent',
	stroke: 'black',
	strokeWidth: 1,
	pointer: null,
	selectable: false,
	rectObj: null,
	
}

rect.addShape = function(){
	rectangle = new fabric.Rect({
			left: this.origX,
			top: this.origY,
			fill: this.fill,
			stroke: this.stroke,
			strokeWidth: this.strokeWidth,
			selectable: this.selectable,
		});
	this.rectObj = rectangle;	
	return rectangle;
}

rect.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	if(this.origX > pointer.x){
		this.rectObj.set({ left: Math.abs(pointer.x) });
	}
	if(this.origY > pointer.y){
		this.rectObj.set({ top: Math.abs(pointer.y) });
	}
	this.rectObj.set({ width: Math.abs(this.origX - pointer.x) });
	this.rectObj.set({ height: Math.abs(this.origY - pointer.y) });
}

rect.resetProperties = function(propObject){
	rect.fill = propObject.fill;
	rect.stroke = propObject.stroke;
	rect.strokeWidth = propObject.strokeWidth;
	rect.selectable = propObject.selectable;
}

rect.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}