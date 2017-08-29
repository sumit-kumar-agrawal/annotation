var deltaX,deltaY;
var line_arrow_shape = {
	origX: null,
	origY: null,
	fill: '#333',
	stroke: 'black',
	strokeWidth: 1,
	pointer: null,
	selectable: false,
	originX: 'center', 
	originY: 'center',
	lineObj: null,
	triangleObj: null,
}	

line_arrow_shape.addShape = function(){
	var points = [this.pointer.x, this.pointer.y, this.pointer.x, this.pointer.y];
    
	let line = new fabric.Line(points,{
		strokeWidth: this.strokeWidth,
		stroke: this.stroke,
		selectable: this.selectable,
		originX: this.originX, 
		originY: this.originY,
		fill: this.fill,
		selectable: this.selectable,
	});

	centerX = (line.x1 + line.x2) / 2;
    centerY = (line.y1 + line.y2) / 2;
    deltaX = line.left - centerX;
    deltaY = line.top - centerY;

   let triangle = new fabric.Triangle({
		left: line.get('x1') + deltaX,
		top: line.get('y1') + deltaY,
		originX: this.originX, 
		originY: this.originY,
		fill: this.fill,
		hasBorders: false,
		hasControls: false,
		lockScalingX: true,
		lockScalingY: true,
		lockRotation: true,
		pointType: 'arrow_start',
		angle: -45,
		width: (15 + this.strokeWidth),
		height: (15 + this.strokeWidth),
		
    });
	this.lineObj = line;
	this.triangleObj = triangle;
	return [line, triangle];
}

line_arrow_shape.setCordinate = function(pointer,canvas){
	this.pointer = pointer;
	//line object cordinate set
	this.lineObj.set({
      	x2: pointer.x,
      	y2: pointer.y
    });
	// traing cordinate set
    this.triangleObj.set({
      'left': pointer.x + deltaX,
      'top': pointer.y + deltaY,
      'angle': this.calcArrowAngle(this.lineObj.x1, this.lineObj.y1, this.lineObj.x2, this.lineObj.y2)
    });
	
	
}

line_arrow_shape.calcArrowAngle = function calcArrowAngle(x1, y1, x2, y2) {
    var angle = 0, x, y;

    x = (x2 - x1);
    y = (y2 - y1);

    if (x === 0) {
      angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
      angle = (x > 0) ? 0 : Math.PI;
    } else {
      angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }

    return (angle * 180 / Math.PI + 90);
}

line_arrow_shape.init =  function(object){
	this.pointer = object.pointer;
	this.origX = this.pointer.x;
	this.origY = this.pointer.y;
}