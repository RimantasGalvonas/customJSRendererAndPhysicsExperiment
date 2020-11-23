class SpriteThing extends Thing {
    renderOntoCanvas(renderer) {
        let positionAndDimensions = this.getSpritePositionAndDimensionsInView();

        // default blue rectangle, for testing
        renderer.context.beginPath();
        renderer.context.rect(positionAndDimensions.positionXInView, positionAndDimensions.positionZInView, positionAndDimensions.widthInPixels, positionAndDimensions.heightInPixels);
        renderer.context.fillStyle = "#8ED6FF";
        renderer.context.fill();
        renderer.context.lineWidth = 2;
        renderer.context.strokeStyle = "black";
        renderer.context.stroke();
    };

    getSpritePositionAndDimensionsInView() {
        let distanceFromCameraToObject = Math.hypot(this.positionXRelativeToCamera, this.positionYRelativeToCamera);

        let widthInPixels = renderer.getPerceivedScaleInPixels(this.scaleX, distanceFromCameraToObject);
        let heightInPixels = renderer.getPerceivedScaleInPixels(this.scaleZ, this.positionYRelativeToCamera);      
        
        let sinOfAngle = this.positionXRelativeToCamera / Math.hypot(this.positionXRelativeToCamera, this.positionYRelativeToCamera);
        let angleToCamera = MathHelper.radiansToDegrees(Math.asin(sinOfAngle));

        let positionXInView = canvas.width * (renderer.camera.fieldOfView/2 + angleToCamera) / renderer.camera.fieldOfView - widthInPixels / 2;
        
        let zCenterPosition = canvas.height / 2 - heightInPixels;
        let cameraAndObjectHeightDifference = this.positionZ - renderer.camera.positionZ;
        let zOffset = renderer.getPerceivedScaleInPixels(cameraAndObjectHeightDifference, this.positionYRelativeToCamera);
        let positionZInView = zCenterPosition - zOffset;

        return {
            positionXInView: positionXInView,
            positionZInView: positionZInView,
            widthInPixels: widthInPixels,
            heightInPixels: heightInPixels
        };
    }
}