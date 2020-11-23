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

    render() { // TODO: this function is a fucking mess for now and it does everything. Will need to be rewritten completely
        this.clearCanvas();
        this.drawHorizon();
        this.assignObjectsCoordinatesRelativeToCamera();
        this.drawGrid();
        this.buildCone();

        let sortedObjects = this.getObjectsSortedByPositionToCamera();

        var self = this;

        sortedObjects.forEach((object) => {
            let xOffsetFromCamera = object.positionXRelativeToCamera;
            let yOffsetFromCamera = object.positionYRelativeToCamera;
            let distanceFromCameraToObject = Math.hypot(xOffsetFromCamera, yOffsetFromCamera);

            if (!this.isPointWithinLineOfSight(object.positionX, object.positionY)) {
                return;
            }

            if (object.is3d === true) { // TODO: should move the sprite rendering below the fuck out of here to its own fucking class. That would make the is3d property unnecessary
                object.renderOntoCanvas(self);
                return;
            }

            // for checking: https://sizecalc.com/#distance=10meters&physical-size=5meters&perceived-size-units=degrees
            let widthInPixels = this.getPerceivedScaleInPixels(object.scaleX, distanceFromCameraToObject);
            let heightInPixels = this.getPerceivedScaleInPixels(object.scaleZ, yOffsetFromCamera);      
            
            let sinOfAngle = xOffsetFromCamera / Math.hypot(xOffsetFromCamera, yOffsetFromCamera);
            let angleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));

            let positionXInView = canvas.width * (this.camera.fieldOfView/2 + angleToCamera) / this.camera.fieldOfView - widthInPixels / 2;
            
            let zCenterPosition = canvas.height / 2 - heightInPixels;
            let cameraAndObjectHeightDifference = object.positionZ - this.camera.positionZ;
            let zOffset = this.getPerceivedScaleInPixels(cameraAndObjectHeightDifference, yOffsetFromCamera);
            let positionZInView = zCenterPosition - zOffset;

            object.renderOntoCanvas(this.context, this.canvas, positionXInView, positionZInView, widthInPixels, heightInPixels);
        })
    };

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

    drawGrid() {
        var totalDistance = 10;
        var step = 1;
        var y = this.camera.positionY;
        var x = this.camera.positionX;
        var yOffset = y % step;
        var xOffset = x % step;
        var distance = 0;
        

        this.drawLineWithSubdivision(x - totalDistance, y - yOffset, 0, x + totalDistance, y - yOffset, 0, 'hsla(0, 0%, 0%, 0.5');
        this.drawLineWithSubdivision(x - xOffset, y + totalDistance, 0, x - xOffset, y - totalDistance, 0, 'hsla(0, 0%, 0%, 0.5');

        for (let distance = 1; distance <= totalDistance; distance = distance + step) {
            let color = 'hsla(0, 0%, 0%, ' + (1 - Math.pow(distance/totalDistance, 0.2)) + ')';
            this.drawLineWithSubdivision(x - totalDistance, y - yOffset + distance, 0, x + totalDistance, y - yOffset + distance, 0, color);
            this.drawLineWithSubdivision(x - totalDistance, y - yOffset - distance, 0, x + totalDistance, y - yOffset - distance, 0, color);
            this.drawLineWithSubdivision(x - distance - xOffset, y + totalDistance, 0, x - distance - xOffset, y - totalDistance, 0, color);
            this.drawLineWithSubdivision(x + distance - xOffset, y + totalDistance, 0, x + distance - xOffset, y - totalDistance, 0, color);
        }
    }

    /*
     * Needs optimisation maybe
     */
    drawLineWithSubdivision(startX, startY, startZ, endX, endY, endZ, color = 'hsla(0, 0%, 0%, 0.5)') {
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

            if (!this.isPointWithinLineOfSight(subdivisionStartX, subdivisionStartY) && !this.isPointWithinLineOfSight(subdivisionEndX, subdivisionEndY)) {
                continue;
            }

            let startPositionInView = this.getPointPositionInView(subdivisionStartX, subdivisionStartY, subdivisionStartZ);
            let endPositionInView = this.getPointPositionInView(subdivisionEndX, subdivisionEndY, subdivisionEndZ);

            this.drawLine(startPositionInView.x, startPositionInView.y, endPositionInView.x, endPositionInView.y, color);
        }
    }

    drawLine(startX, startY, endX, endY, color = 'hsla(0, 0%, 0%, 0.5)') {
        this.context.beginPath();
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    /*
     * Only works with things in front of camera - behind and to the sides returns distooooorted values
     */ 
    getPointPositionInView(x, y, z)
    {
        let xOffsetFromCamera = x - this.camera.positionX;
        let yOffsetFromCamera = y - this.camera.positionY;
        let zOffsetFromCamera = this.camera.positionZ - z;

        let rotatedCoordinates = MathHelper.rotateCoordinates(xOffsetFromCamera, yOffsetFromCamera, this.camera.rotationZ);
        xOffsetFromCamera = rotatedCoordinates.x;
        yOffsetFromCamera = rotatedCoordinates.y;

        let positionXInView;
        let positionYInView;
        
        let sinOfAngle = xOffsetFromCamera / Math.hypot(xOffsetFromCamera, yOffsetFromCamera);
        let horizontalAngleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));
        positionXInView = this.canvas.width * (this.camera.fieldOfView/2 + horizontalAngleToCamera) / this.camera.fieldOfView;

        sinOfAngle = zOffsetFromCamera / Math.hypot(zOffsetFromCamera, yOffsetFromCamera);
        let verticalAngleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));
        positionYInView = this.canvas.height * (this.camera.fieldOfView/2 + verticalAngleToCamera) / this.camera.fieldOfView;

        return {x:positionXInView, y:positionYInView};
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

    isPointWithinLineOfSight(worldX, worldY, worldZ, debug = false) {
        let rotated = this.getCoordinatesRelativeToCamera(worldX, worldY);
        let x = rotated.x;
        let y = rotated.y;

        let lineOfSightSlope = 1/Math.tan(MathHelper.degreesToRadians(this.camera.fieldOfView/2));

        let bottomBoundary = lineOfSightSlope * this.camera.positionZ - worldZ;

        if (y < bottomBoundary) {
            return false
        }

        if (x < 0) {
            lineOfSightSlope = 0 - lineOfSightSlope;
        }

        return (lineOfSightSlope * x < y);
    }
}
