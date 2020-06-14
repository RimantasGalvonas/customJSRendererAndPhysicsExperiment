class CatThing extends Thing {
	animationFrame = 0;
	image = null;
	catMovedThisFrame = false;

	constructor(x = 0, y = 0, z = 0, scaleX = 0, scaleY = 0, scaleZ = 0, image) {
		super(x, y, z, scaleX, scaleY, scaleZ);
		this.image = image;
	};


	calculateNewPosition() {
		this.catMovedThisFrame = false;
		var startX = Math.round(this.positionX);
		var startY = Math.round(this.positionY);
		var startZ = Math.round(this.positionZ);
		super.calculateNewPosition();
		if (startX != Math.round(this.positionX) || startY != Math.round(this.positionY) || startZ != Math.round(this.positionZ)) {
			this.catMovedThisFrame = true;
		}
	};

	renderOntoCanvas(context, canvas, positionXInView, positionZInView, widthInPixels, heightInPixels) {

		if (this.catMovedThisFrame) {
			//TODO: change animation frame
		}

		context.drawImage(this.image, positionXInView, positionZInView, widthInPixels, heightInPixels);
		
	};
}