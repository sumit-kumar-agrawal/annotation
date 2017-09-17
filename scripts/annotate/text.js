var text = {
	origX: null,
	origY: null,
	fill: 'transparent',
	stroke: 'black',
	strokeWidth: 1,
	pointer: null,
	selectable: true,
	radius: 0,
    originX: 'center', 
	originY: 'center',
	textObj: null,
	
}	

text.addShape = function(){
	this.textObj = new fabric.IText("Type Here",{
		left: this.pointer.x,
		top: this.pointer.y,
		fontFamily: 'helvetica',
		fontSize:30,
		fontWeight:400,
		fill:'red', 
		fontStyle: 'normal', 
		cursorDuration:500,    
		selectable: true
	});
	return this.textObj;
}

text.setCordinate = function(pointer,canvas){
	canvas.centerObject(this.textObj);
	canvas.setActiveObject(this.textObj);
	this.textObj.enterEditing();
	this.textObj.selectAll();
	this.textObj.set({ x2: this.pointer.x, y2: (this.pointer.x + 10) });
	this.textObj.setCoords();
	
}

text.resetProperties = function(propObject){
	text.fill = propObject.fill;
	text.stroke = propObject.stroke;
	text.strokeWidth = propObject.strokeWidth;
	text.selectable = propObject.selectable;
}

text.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}