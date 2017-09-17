var blurBox = {
	origX: null,
	origY: null,
	blurObj: null,
}

blurBox.addShape = function(){
	blur = new fabric.Rect({
			left: this.origX,
			top: this.origY,
			selectable: true,
			hasRotatingPoint: false,
		});
	this.blurObj = blur;	
	return this.blurObj;
}

blurBox.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	if(this.origX > pointer.x){
		this.blurObj.set({ left: Math.abs(pointer.x) });
	}
	if(this.origY > pointer.y){
		this.blurObj.set({ top: Math.abs(pointer.y) });
	}
	this.blurObj.set({ width: Math.abs(this.origX - pointer.x) });
	this.blurObj.set({ height: Math.abs(this.origY - pointer.y) });

	// if(Math.abs(this.origX - pointer.x) < 360){
	// 	this.blurObj.set({ width: Math.abs(this.origX - pointer.x) });
	// }else{
	// 	this.blurObj.set({ width: 350 });
	// }

	// if(Math.abs(this.origY - pointer.y) < 240 ){
	// 	this.blurObj.set({ height: Math.abs(this.origY - pointer.y) });
	// }else{
	// 	this.blurObj.set({ height: 240 });
	// }
	
	var image = new fabric.util.loadImage('../blur3.png', (img) => {
		this.blurObj .setPatternFill({
		  source: img,
		  repeat: 'repeat'
		});
	});	
}

blurBox.resetProperties = function(propObject){
	
}

blurBox.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}