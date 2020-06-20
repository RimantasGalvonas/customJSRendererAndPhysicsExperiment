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
		this.drawGrid();
		//this.buildCube();
		//this.buildCone();

		
		let intersected

		// TODO: vertical still scaling messed up somehow
		// MAKE SURE IT WORKS WHEN COORDINATES FOR LINES ARE GIVEN NOT IN LEFT TO RIGHT ORDER

		// VEIKIA TEST 1 - left to right steep downwards
		// this.drawLineWithSubdivision(-2, 10, 0, 3, 0, 0, 'hsla(0, 0%, 0%, 0.2'); // uncut line
		// this.drawLineWithSubdivision(0, 3.5, 0, 3, 5, 0, 'hsla(0, 0%, 0%, 0.2'); // intersector
		// intersected = MathHelper.cutLineByIntersection(-2, 10, 0, 3, 0, 0, 0, 3.5, 0.5);
		// // Additional - should have no effect
		// // intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 0, 3, 0);
		// // Additional - should shorten a bit
		// // intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 0, 3, 0);
		// // Additional - should not render at all
		// // intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 0, 12, 0);
		// if (intersected) {
		// 	this.drawLineWithSubdivision(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 'hsla(0, 0%, 0%, 1');
		// }

		// VEIKIA TEST 2 - left to right steep upwards
		// this.drawLineWithSubdivision(-3, 0, 0, 2, 10, 0, 'hsla(0, 0%, 0%, 0.2'); // uncut line
		// this.drawLineWithSubdivision(-3, 5, 0, 0, 3.5, 0, 'hsla(0, 0%, 0%, 0.2'); // intersector
		// intersected = MathHelper.cutLineByIntersection(-3, 0, 0, 2, 10, 0, -3, 3.5, -0.5);
		// this.drawLineWithSubdivision(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 'hsla(0, 0%, 0%, 1');

		// VEIKIA TEST 3 - left to right shallow upwards
		// this.drawLineWithSubdivision(0, 0, 0, 2, 8, 0, 'hsla(0, 0%, 0%, 0.2');
		// this.drawLineWithSubdivision(0, 3.5, 0, 6, 6.5, 0, 'hsla(0, 0%, 0%, 0.2');
		// intersected = MathHelper.cutLineByIntersection(0, 3.5, 0, 6, 6.5, 0, 0, 0, 4);
		// this.drawLineWithSubdivision(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 'hsla(0, 0%, 0%, 1');

		// VEIKIA TEST 4 - left to right shallow downwards
		// this.drawLineWithSubdivision(0, 0, 0, -2, 8, 0, 'hsla(0, 0%, 0%, 0.2'); //intersector
		// this.drawLineWithSubdivision(0, 3.5, 0, -6, 6.5, 0, 'hsla(0, 0%, 0%, 0.2'); //uncut line
		// intersected = MathHelper.cutLineByIntersection(0, 3.5, 0, -6, 6.5, 0, 0, 0, -4);
		// // Additional - should have no effect shorter
		// // intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 0, 2, 0);
		// // Additional - should have not render at all
		// // intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 0, 8, 0);
		// // Additional - should be shorter
		// // intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 0, 3.9, 0);
		// if (intersected) {
		// 	this.drawLineWithSubdivision(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 'hsla(0, 0%, 0%, 1');
		// }

		// ŠŪDINAI KAŽKAIP TEST 5 - horizontal
		// this.drawLineWithSubdivision(-10, 5, 0, 10, 6, 0, 'hsla(0, 0%, 0%, 0.2');
		// intersected = MathHelper.cutLineByIntersection(0, 10, 0, 0, 0, 0, -10, 5.5, 0.1);
		// this.drawLineWithSubdivision(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 'hsla(0, 0%, 0%, 1');

		// NEVEIKIA TEST 6 - horizontal line in between two diagonal lines
		// this.drawLineWithSubdivision(0, 3.5, 0, 3, 5, 0, 'hsla(0, 0%, 0%, 0.2');
		// this.drawLineWithSubdivision(-3, 5, 0, 0, 3.5, 0, 'hsla(0, 0%, 0%, 0.2');
		// intersected = MathHelper.cutLineByIntersection(-10, 4.5, 0, 10, 4.5, 0, 0, 3.5, 0.5, 'hsla(0, 0%, 0%, 0.5');
		// intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, -5, 3.5, -0.5, 'hsla(0, 0%, 0%, 0.5');
		// this.drawLineWithSubdivision(intersected.start.x, intersected.start.y, 0, intersected.end.x, intersected.end.y, 0, 'hsla(0, 0%, 0%, 1');


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
			let heightInPixels = this.getPerceivedScaleInPixels(object.scaleZ, yOffsetFromCamera);		
			
			let sinOfAngle = xOffsetFromCamera / Math.hypot(xOffsetFromCamera, yOffsetFromCamera);
			let angleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));


			if (Math.abs(angleToCamera) > this.camera.fieldOfView / 2) {
				//return; This doesn't work, but there should be something here to skip items that are not within the line of sight
			}

			let positionXInView = canvas.width * (this.camera.fieldOfView/2 + angleToCamera) / this.camera.fieldOfView - widthInPixels / 2;
			
 			let zCenterPosition = canvas.height / 2 - heightInPixels;
			let cameraAndObjectHeightDifference = object.positionZ - this.camera.positionZ;
			let zOffset = this.getPerceivedScaleInPixels(cameraAndObjectHeightDifference, yOffsetFromCamera);
			let positionZInView = zCenterPosition - zOffset;

			object.renderOntoCanvas(this.context, this.canvas, positionXInView, positionZInView, widthInPixels, heightInPixels);
		})
	};

	drawGrid() {
		var totalDistance = 10;
		var step = 1;
		var y = this.camera.positionY;
		var x = this.camera.positionX;
		var yOffset = y % step;
		var xOffset = x % step;
		var distance = 0;

		// Horizontal center
		this.drawLineWithinLineOfSight(x - totalDistance, y - yOffset, 0, x + totalDistance, y - yOffset, 0, 0, 'hsla(0, 0%, 0%, 0.5');
		// Vertical center
		this.drawLineWithinLineOfSight(x - xOffset, y + totalDistance, 0, x - xOffset, y - totalDistance, 0, 'hsla(0, 0%, 0%, 0.5');

		for (let distance = 1; distance <= totalDistance; distance = distance + step) {
			let color = 'hsla(0, 0%, 0%, ' + (1 - Math.pow(distance/totalDistance, 0.2)) + ')';


			// Horizontal forward
			this.drawLineWithinLineOfSight(x - totalDistance, y - yOffset + distance, 0, x + totalDistance, y - yOffset + distance, 0, color);

			// Horizontal backward
			this.drawLineWithinLineOfSight(x - totalDistance, y - yOffset - distance, 0, x + totalDistance, y - yOffset - distance, 0, color);

			// Vertical left
			this.drawLineWithinLineOfSight(x - distance - xOffset, y + totalDistance, 0, x - distance - xOffset, y - totalDistance, 0, color);

			// Vertical right
			this.drawLineWithinLineOfSight(x + distance - xOffset, y + totalDistance, 0, x + distance - xOffset, y - totalDistance, 0, color);
		}
	}

	drawLineWithinLineOfSight(aX, aY, aZ, bX, bY, bZ, color = 'hsla(0, 0%, 0%, 0.5') {
		let rotatedA = this.getCoordinatesRelativeToCamera(aX, aY);
		aX = rotatedA.x;
		aY = rotatedA.y;
		let rotatedB = this.getCoordinatesRelativeToCamera(bX, bY);
		bX = rotatedB.x;
		bY = rotatedB.y;
		var lineOfSightSlope = Math.tan(MathHelper.degreesToRadians(this.camera.fieldOfView / 2));
		var cameraX = 0;this.camera.positionX;
		var cameraY = 0;this.camera.positionY;

		var bottomCameraLimitLineStart = 0 + this.camera.positionZ * lineOfSightSlope;
		var bottomCameraLimitLineSlope = 0; // TODO

		let intersected;

		if (aY < bottomCameraLimitLineStart.y && bY < bottomCameraLimitLineStart.y) {
			return;
		}

		// Bottom cut
		intersected = MathHelper.cutLineByIntersection(aX, aY, aZ, bX, bY, bZ, -10, bottomCameraLimitLineStart, 0);
		if (!intersected) {
			return;
		}

		// Right cut
		intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, aZ, intersected.end.x, intersected.end.y, bZ, 0, 0, lineOfSightSlope);
		if (!intersected) {
			return;
		}

		// Left cut
		intersected = MathHelper.cutLineByIntersection(intersected.start.x, intersected.start.y, aZ, intersected.end.x, intersected.end.y, bZ, 0, 0, -lineOfSightSlope);
		if (!intersected) {
			return;
		}
	
		this.drawLine(intersected.start.x, intersected.start.y, aZ, intersected.end.x, intersected.end.y, bZ, color, true);
	}


	drawLine(startX, startY, startZ, endX, endY, endZ, color = 'hsla(0, 0%, 0%, 0.5)', alreadyRotatedToCamera = false) {
		let startPositionInView = this.getPointPositionInView(startX, startY, startZ, alreadyRotatedToCamera);
		let endPositionInView = this.getPointPositionInView(endX, endY, endZ, alreadyRotatedToCamera);

		this.drawLineOntoCanvas(startPositionInView.x, startPositionInView.y, endPositionInView.x, endPositionInView.y, color);
	}

	/*
	 * Needs optimisation maybe
	 */
	drawLineWithSubdivision(startX, startY, startZ, endX, endY, endZ, color = 'hsla(0, 0%, 0%, 0.5)', alreadyRotatedToCamera = false) {
		let lineXLength = endX - startX;
		let lineYLength = endY - startY;
		let lineZLength = endZ - startZ;
		let totalLength = Math.hypot(lineZLength, Math.hypot(lineXLength, lineYLength));
		let numberOfSubdivisions = totalLength * 3;
		let subdivisionXLength;
		let subdivisionYLength;
		let subdivisionZLength;

		if (Math.abs(lineXLength) >= Math.abs(lineYLength) && Math.abs(lineXLength) > Math.abs(lineZLength)) { // Use the longest axis for slope calculation
			let x_y_slope = lineYLength / lineXLength;
			let x_z_slope = lineZLength == 0 ? 0 : lineXLength / lineZLength;
			subdivisionXLength = lineXLength / numberOfSubdivisions;
			subdivisionYLength = x_y_slope == 0 ? 0 :  subdivisionXLength * x_y_slope;
			subdivisionZLength = x_z_slope == 0 ? 0 : subdivisionXLength / x_z_slope;
		} else if (Math.abs(lineYLength) > Math.abs(lineXLength) && Math.abs(lineYLength) > Math.abs(lineZLength)) {
			let y_x_slope = lineXLength / lineYLength;
			let y_z_slope = lineZLength == 0 ? 0 : lineYLength / lineZLength;
			subdivisionYLength = lineYLength / numberOfSubdivisions;
			subdivisionXLength = y_x_slope == 0 ? 0 : subdivisionYLength * y_x_slope;
			subdivisionZLength = y_z_slope == 0 ? 0 : subdivisionYLength / y_z_slope;
		} else {
			let z_x_slope = lineZLength / lineXLength;
			let z_y_slope = lineYLength == 0 ? 0 : lineZLength / lineYLength;
			subdivisionZLength = lineZLength / numberOfSubdivisions;
			subdivisionXLength = z_x_slope == 0 ? 0 : subdivisionZLength / z_x_slope;
			subdivisionYLength = z_y_slope == 0 ? 0 : subdivisionZLength / z_y_slope;
		}
		

		for (let subdivisionNo = 0; subdivisionNo < numberOfSubdivisions; subdivisionNo++) {
			let subdivisionStartX = startX + subdivisionNo * subdivisionXLength;
			let subdivisionEndX = subdivisionStartX + subdivisionXLength;
			let subdivisionStartY = startY + subdivisionNo * subdivisionYLength;
			let subdivisionEndY = subdivisionStartY + subdivisionYLength;
			let subdivisionStartZ = startZ + subdivisionNo * subdivisionZLength;
			let subdivisionEndZ = subdivisionStartZ + subdivisionZLength;

			if (this.isBehindCamera(subdivisionStartX, subdivisionStartY) && this.isBehindCamera(subdivisionEndX, subdivisionEndY)) {
				continue;
			}

			let startPositionInView = this.getPointPositionInView(subdivisionStartX, subdivisionStartY, subdivisionStartZ, alreadyRotatedToCamera);
			let endPositionInView = this.getPointPositionInView(subdivisionEndX, subdivisionEndY, subdivisionEndZ, alreadyRotatedToCamera);

			this.drawLineOntoCanvas(startPositionInView.x, startPositionInView.y, endPositionInView.x, endPositionInView.y, color);
		}
	}

	drawLineOntoCanvas(startX, startY, endX, endY, color = 'hsla(0, 0%, 0%, 0.5)') {
		this.context.beginPath();
		this.context.moveTo(startX, startY);
		this.context.lineTo(endX, endY);
		this.context.strokeStyle = color;
		this.context.stroke();
	}

	/*
	 * Only works with things in front of camera - behind and to the sides returns distooooorted values
	 */ 
	getPointPositionInView(x, y, z, alreadyRotatedToCamera = false)
	{
		let xOffsetFromCamera = x;// - this.camera.positionX;
		let yOffsetFromCamera = y;// - this.camera.positionY;
		let zOffsetFromCamera = this.camera.positionZ - z;

		if (!alreadyRotatedToCamera) {
			let rotatedCoordinates = MathHelper.rotateCoordinates(xOffsetFromCamera, yOffsetFromCamera, this.camera.rotationZ);
			xOffsetFromCamera = rotatedCoordinates.x;
			yOffsetFromCamera = rotatedCoordinates.y;
		}

		let positionXInView;
		let positionYInView;
		
		let sinOfAngle = xOffsetFromCamera / Math.hypot(xOffsetFromCamera, yOffsetFromCamera);
		if (!sinOfAngle) {
			sinOfAngle = 0;
		}
		let horizontalAngleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));
		positionXInView = this.canvas.width * (this.camera.fieldOfView/2 + horizontalAngleToCamera) / this.camera.fieldOfView;

		sinOfAngle = zOffsetFromCamera / Math.hypot(zOffsetFromCamera, yOffsetFromCamera);
		let verticalAngleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));
		positionYInView = this.canvas.height * (this.camera.fieldOfView/2 + verticalAngleToCamera) / this.camera.fieldOfView;

		return {x:positionXInView, y:positionYInView};
	}

	isBehindCamera(x, y) {
		let xOffsetFromCamera = x - this.camera.positionX;
		let yOffsetFromCamera = y - this.camera.positionY;

		let rotatedCoordinates = MathHelper.rotateCoordinates(xOffsetFromCamera, yOffsetFromCamera, this.camera.rotationZ);
		yOffsetFromCamera = rotatedCoordinates.y;

		return yOffsetFromCamera < 0;
	}

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
		this.objects.forEach((object) => {
			let rotatedOffsets = this.getCoordinatesRelativeToCamera(object.positionX, object.positionY);
			object.positionXRelativeToCamera = rotatedOffsets.x;
			object.positionYRelativeToCamera = rotatedOffsets.y;
		});
	};

	getCoordinatesRelativeToCamera(x, y) {
		let xOffsetFromCamera = x - this.camera.positionX;
		let yOffsetFromCamera = y - this.camera.positionY;

		return MathHelper.rotateCoordinates(xOffsetFromCamera, yOffsetFromCamera, this.camera.rotationZ);
	}

	getObjectsSortedByPositionToCamera() {
		// Sorts objects by furthest away so that they are rendered first and the closer ones are rendered over them.
		// concat is to clone the array instead of modifying the original because dumb fucking javascript
		return this.objects.concat().sort(function(a, b) {
		    return b.positionYRelativeToCamera - a.positionYRelativeToCamera;
		});
	}

	getPerceivedScaleInPixels(size, distance) {
		// https://www.easycalculation.com/algebra/angular-diameter-calculator.php
		let angularSize = MathHelper.radiansToDegrees(2 * Math.atan(size / (2 * distance)));

		return this.canvas.width * angularSize / this.camera.fieldOfView;
	};

	buildCube() {
		let startY;
		let startZ;
		let startPositionInView;

		let endX;
		let endY;
		let endZ;
		let endPositionInView;

		let lines = [
			{
				ax: -5, ay: -15, az: 0,
				bx: -5, by: -15, bz: 5
			},
			{
				ax: -5, ay: -10, az: 5,
				bx: -5, by: -10, bz: 0
			},
			{
				ax: 0, ay: -15, az: 5,
				bx: 0, by: -15, bz: 0
			},
			{
				ax: 0, ay: -10, az: 5,
				bx: 0, by: -10, bz: 0
			},
			{
				ax: -5, ay: -10, az: 0,
				bx: 0, by: -10, bz: 0
			},
			{
				ax: -5, ay: -15, az: 0,
				bx: 0, by: -15, bz: 0
			},
			{
				ax: -5, ay: -10, az: 0,
				bx: -5, by: -15, bz: 0
			},
			{
				ax: 0, ay: -10, az: 0,
				bx: 0, by: -15, bz: 0
			},
			{
				ax: -5, ay: -10, az: 5,
				bx: 0, by: -10, bz: 5
			},
			{
				ax: -5, ay: -15, az: 5,
				bx: 0, by: -15, bz: 5
			},
			{
				ax: -5, ay: -10, az: 5,
				bx: -5, by: -15, bz: 5
			},
			{
				ax: 0, ay: -10, az: 5,
				bx: 0, by: -15, bz: 5
			}


		];

		lines.forEach((line) => {
			if (this.isBehindCamera(line.ax-20, line.ay+50) && this.isBehindCamera(line.bx-20, line.by+50)) {
				return;
			}

			this.drawLineWithSubdivision(line.ax-20, line.ay+50, line.az, line.bx-20, line.by+50, line.bz, 'hsla(0, 0%, 0%, 0.5)');			
		});

	}

	buildCone() {
		var step = 360/12;
		var currentDegree = 15;
		var radius = 10;
		var centerX = 20;
		var centerY = 50;
		var height = 10;

		while (currentDegree < 360) {
				let posX = centerX + radius / 2 * Math.sin(MathHelper.degreesToRadians(currentDegree));
				let posY = centerY + radius / 2 * Math.cos(MathHelper.degreesToRadians(currentDegree));

				this.drawLineWithSubdivision(posX, posY, 0, centerX, centerY, height, 'hsla(0, 0%, 0%, 0.5)');

			currentDegree += step;
		}
	}
}