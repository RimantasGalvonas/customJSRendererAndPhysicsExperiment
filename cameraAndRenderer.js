class Camera {
	positionX = 0;
	positionY = 0;
	positionZ = 0;
	rotationZ = 0;
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

	render() {
		this.clearCanvas();
		this.drawHorizon();
		this.assignObjectsCoordinatesRelativeToCamera();
		let sortedObjects = this.getObjectsSortedByPositionToCamera();

		sortedObjects.forEach((object) => {
			let xOffsetFromCamera = object.positionXRelativeToCamera;
			let yOffsetFromCamera = object.positionYRelativeToCamera;
			let distanceFromCameraToObject = Math.hypot(xOffsetFromCamera, yOffsetFromCamera);

			if (yOffsetFromCamera < 0) {
				return;
			}

			// for checking: https://sizecalc.com/#distance=10meters&physical-size=5meters&perceived-size-units=degrees
			let widthInPixels = this.getPerceivedScaleInPixels(object.scaleX, distanceFromCameraToObject);
			let heightInPixels = this.getPerceivedScaleInPixels(object.scaleZ, distanceFromCameraToObject);		
			
			let sinOfAngle = xOffsetFromCamera / Math.hypot(xOffsetFromCamera, yOffsetFromCamera);
			let angleToCamera = this.radiansToDegrees(Math.asin(sinOfAngle));


			if (Math.abs(angleToCamera) > this.camera.fieldOfView / 2) {
				//return; This doesn't work, but there should be something here to skip items that are not within the line of sight
			}

			let positionXInView = canvas.width * (this.camera.fieldOfView/2 + angleToCamera) / this.camera.fieldOfView - widthInPixels / 2;
			
 			let zCenterPosition = canvas.height / 2 - heightInPixels;
			let cameraAndObjectHeightDifference = object.positionZ - this.camera.positionZ;
			let zOffset = this.getPerceivedScaleInPixels(cameraAndObjectHeightDifference, distanceFromCameraToObject);
			let positionZInView = zCenterPosition - zOffset;

			object.renderOntoConvas(this.context, this.canvas, positionXInView, positionZInView, widthInPixels, heightInPixels);
		})
	};

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	drawHorizon() {
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.context.moveTo(0, canvas.height / 2);
		this.context.lineTo(canvas.width, canvas.height / 2);
		this.context.stroke(); 
	};

	assignObjectsCoordinatesRelativeToCamera() {

		var cameraAngle = this.degreesToRadians(this.camera.rotationZ);
		var cameraPositionX = this.camera.positionX;
		var cameraPositionY = this.camera.positionY;
		this.objects.forEach((object) => {
			let xOffsetFromCamera = object.positionX - this.camera.positionX;
			let yOffsetFromCamera = object.positionY - this.camera.positionY;
			object.positionXRelativeToCamera = xOffsetFromCamera * Math.cos(cameraAngle) - yOffsetFromCamera * Math.sin(cameraAngle);
			object.positionYRelativeToCamera = xOffsetFromCamera * Math.sin(cameraAngle) + yOffsetFromCamera * Math.cos(cameraAngle);
		});
	};

	getObjectsSortedByPositionToCamera() {
		// Sorts objects by furthest away so that they are rendered first and the closer ones are rendered over them.
		// concat is to clone the array instead of modifying the original because dumb fucking javascript
		return this.objects.concat().sort(function(a, b) {
		    return b.positionYRelativeToCamera - a.positionYRelativeToCamera;
		});
	}

	getPerceivedScaleInPixels(size, distance) {
		// https://www.easycalculation.com/algebra/angular-diameter-calculator.php
		let angularSize = this.radiansToDegrees(2 * Math.atan(size / (2 * distance)));

		return this.canvas.width * angularSize / this.camera.fieldOfView;
	};

	radiansToDegrees(rad) {
		return rad * 180 / Math.PI;
	}

	degreesToRadians(deg) {
		return deg * Math.PI / 180;
	}
}
