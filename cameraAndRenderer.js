class Camera {
	positionX = null;
	positionY = null;
	positionZ = null;
	fieldOfView = 90;

	constructor (x = 0, y = 0, z = 0) {
		this.positionX = x;
		this.positionY = y;
		this.positionZ = z;
	}
}

class Renderer {
	canvas = null;
	context = null;
	objects = null;
	camera = null;

	constructor(canvas, objects, camera) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.objects = objects;
		this.camera = camera;
	};

	//TODO: camera rotation
	render = function() {
		this.clearCanvas();
		this.drawHorizon();

		let sortedObjects = this.getObjectsSortedByPositionToCamera();

		sortedObjects.forEach((object) => {
			// TODO take camera position into account, something with pythagoras theorem probably
			let distanceFromCameraToObject = Math.abs(camera.positionY - object.positionY);

			// for checking check: https://sizecalc.com/#distance=10meters&physical-size=5meters&perceived-size-units=degrees
			let widthInPixels = this.getPerceivedScaleInPixels(object.scaleX, distanceFromCameraToObject);
			let heightInPixels = this.getPerceivedScaleInPixels(object.scaleZ, distanceFromCameraToObject);

			let xCenterPosition = this.canvas.width / 2 - widthInPixels / 2;
			let xOffset = this.getPerceivedScaleInPixels(object.positionX, distanceFromCameraToObject);
			let positionXInView = xCenterPosition + xOffset;
			let zCenterPosition = canvas.height / 2 - heightInPixels;
			let cameraAndObjectHeightDifference = object.positionZ - camera.positionZ;
			let zOffset = this.getPerceivedScaleInPixels(cameraAndObjectHeightDifference, distanceFromCameraToObject);
			let positionZInView = zCenterPosition - zOffset;

			this.context.beginPath();
			this.context.rect(positionXInView, positionZInView, widthInPixels, heightInPixels);
			this.context.fillStyle = "#8ED6FF";
			this.context.fill();
			this.context.lineWidth = 2;
			this.context.strokeStyle = "black";
			this.context.stroke();

			object.calculateNewPosition();
		})
	};

	clearCanvas = function() {
		this.context.clearRect(0, 0, canvas.width, canvas.height);
	};

	drawHorizon = function() {
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.context.moveTo(0, canvas.height / 2);
		this.context.lineTo(canvas.width, canvas.height / 2);
		this.context.stroke(); 
	};

	getObjectsSortedByPositionToCamera = function() {
		// concat is to clone the array instead of modifying the original because dumb fucking javascript
		// sort objects by furthest away so that they are rendered first and the closer ones are rendered over them.
		// TODO: remove things behind camera
		return this.objects.concat().sort(function(a, b) {
		    return a.positionY - b.positionY; // TODO: gotta be relative to the camera obviously
		});
	};

	getPerceivedScaleInPixels = function(size, distance) {
		// https://www.easycalculation.com/algebra/angular-diameter-calculator.php
		// * (180/Math.PI) thing is rad -> degree conversion
		let angularSize = 2 * Math.atan(size / (2 * distance)) * (180 / Math.PI);

		return this.canvas.width * angularSize / this.camera.fieldOfView;
	};
}
