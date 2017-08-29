// --- dependant on Fabric JS ---
let fabric = require('/Projects/annotations/node_modules/fabric/dist/fabric.require').fabric;
var annotate = {
    canvas: null,

    // new or existing fabric object on canvas
    current: null,

    // fill color set by the user (default is transparent)
    fillColor: 'transparent',

    // line weight set by the user (default is 3px)
    strokeWidth: 3,

    // line color set by the user (default is red)
    strokColor: 'red'
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
        height: 500,
        selection: false,
        stopContextMenu: true
    });
	console.log(this.canvas);
    this.canvas.add(image);
};

annotate.initialize = function(annotationType) {
	this.current = window['annotate'][annotationType]();
};

annotate.set = function(object) {
    this.current = object;
};

annotate.defaults = {
    rectangle: {
        width: 40,
        height: 40
    },
    circle: {
        radius: 20
    },
    triangle: {
        width: 20,
        height: 30
    }
};

annotate.corner = {
    transparentCorners: false,
    cornerColor: 'yellow',
    cornerStrokeColor: 'blue',
    cornerSize: 8,
    padding: 6,
    cornerStyle: 'circle'
};

annotate.withCorners = function(attributes) {
    Object.assign(attributes, this.corner);
    return attributes;
};

// --------------------------------- Fabric Objects ---------------------------------

annotate.rectangle = function() {
    let attributes = {
        fill: this.fillColor,
        width: this.defaults.rectangle.width,
        height: this.defaults.rectangle.height,
    };
    if(this.fillColor == 'transparent') {
        Object.assign(attributes, {
            strokeWidth: this.strokeWidth,
            stroke: this.strokeColor
        });
    }
    return new fabric.Rect(this.withCorners(attributes));
};

annotate.circle = function() {
    let attributes = {
        radius: this.defaults.circle.radius, 
        fill: this.fillColor
    };
    return new fabric.Circle(this.withCorners(attributes));
}

annotate.triangle = function() {
    let attributes = {
        width: this.defaults.triangle.width, 
        height: this.defaults.triangle.height, 
        fill: this.fillColor
    };
    return new fabric.Triangle(this.withCorners(attributes));
};

annotate.line = function() {
    let attributes = {
        stroke: this.strokColor
    };
    return new fabric.Line([50, 100, 200, 200], this.withCorners(attributes));
};

// --------------------------------- Fabric Objects ---------------------------------