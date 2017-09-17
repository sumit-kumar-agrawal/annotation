var normalTextBox = {
	origX: null,
	origY: null,
	textColor: 'black',
	pointer: null,
	selectable: true,
	textboxObj: null,
	fontFamily: 'Arial',
	fontSize: '14',	
	backgroundColor: 'transparent',
}

normalTextBox.addShape = function(){
	this.textboxObj = new fabric.Textbox('',{
			left: this.origX,
			top: this.origY,
			fill: this.textColor,
			selectable: this.selectable,
			fontSize: this.fontSize,
			fontFamily: this.fontFamily,
			hasRotatingPoint: false,
			backgroundColor: this.backgroundColor,
		});
	
	return this.textboxObj;
}

normalTextBox.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	if(this.origX > pointer.x){
		this.textboxObj.set({ left: Math.abs(pointer.x) });
	}
	if(this.origY > pointer.y){
		this.textboxObj.set({ top: Math.abs(pointer.y) });
	}
	this.textboxObj.width =  Math.abs(this.origX - pointer.x);
}

normalTextBox.resetProperties = function(propObject){
	normalTextBox.backgroundColor = propObject.fill;
	normalTextBox.textColor = propObject.textColor;
	normalTextBox.fontSize = propObject.fontSize;
	normalTextBox.fontFamily = propObject.fontFamily;
}

normalTextBox.initiateEditing = function(canvas){
	if (this.textboxObj.width < 200) this.textboxObj.width = 200;
	canvas.setActiveObject(shape);
	this.textboxObj.enterEditing();
	this.textboxObj.hiddenTextarea.focus();
}

normalTextBox.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}