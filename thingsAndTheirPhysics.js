class Thing {
	positionX = 0;
	positionY = 0;
	positionZ = 0;
	rotationZ = 0;
	scaleX = 0;
	scaleY = 0;
	scaleZ = 0;
	image = null;
	physicsModule = null;
	attachedCamera = null;

	constructor(x = 0, y = 0, z = 0, scaleX = 0, scaleY = 0, scaleZ = 0, lifetime = null) {
		this.positionX = x;
		this.positionY = y;
		this.positionZ = z;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.scaleZ = scaleZ;
		this.lifetime = lifetime; // in number of frames or null for infinite
	};

	calculateNewPosition() { // TODO: observer pattern or something would be good here
		if (!this.physicsModule) {
			return;
		}

		if (this.attachedCamera) {
			var attachedCameraOffsetX = this.positionX - this.attachedCamera.positionX;
			var attachedCameraOffsetY = this.attachedCamera.positionY - this.positionY;
			var attachedCameraOffsetZ = this.attachedCamera.positionZ - this.positionZ;
		}

		this.physicsModule.calculateNewPosition();

		if (this.attachedCamera) {
			let newRotation = this.rotationZ - this.attachedCamera.rotationZ;
			if (!newRotation) {
				this.attachedCamera.positionX = this.positionX - attachedCameraOffsetX;
				this.attachedCamera.positionY = this.positionY + attachedCameraOffsetY;
				this.attachedCamera.positionZ = this.positionZ + attachedCameraOffsetZ;
				return;
			}
			this.attachedCamera.rotationZ = this.rotationZ;
			let rotatedOffset = MathHelper.rotateCoordinates(attachedCameraOffsetX, attachedCameraOffsetY, newRotation);
			this.attachedCamera.positionX = this.positionX - rotatedOffset.x
			this.attachedCamera.positionY = this.positionY + rotatedOffset.y;
			this.attachedCamera.positionZ = this.positionZ + attachedCameraOffsetZ;
		
		}
	};

	renderOntoCanvas(context, canvas, positionXInView, positionZInView, widthInPixels, heightInPixels) {
		// default blue rectangle, for testing
		context.beginPath();
		context.rect(positionXInView, positionZInView, widthInPixels, heightInPixels);
		context.fillStyle = "#8ED6FF";
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = "black";
		context.stroke();
	};
};

class PhysicsModuleForObject {
	velocityX = 0;
	velocityY = 0;
	velocityZ = 0;
	drag = 0.2; // not tied to fps so with different fps you get different drag - will need to be looked at. And the gradient is too steep anyway
	airDrag = 0.01; // not tied to fps so with different fps you get different drag - will need to be looked at
	gravity = -9.8;
	bounceDampeningFactorThing = 0.6; //TODO: rename. How much velocity is lost when bouncing off. 1 - doesn't bounce, 0 - bounces forever
	object = null; //just the object this module is set onto for easier access to its properties.

	constructor (object) {
		this.object = object;
		object.physicsModule = this;
	}

	applyVelocityConvertedToGlobalVectors(angle, velocity) {
		let velocityX = Math.sin(MathHelper.degreesToRadians(angle)) * velocity;
		let velocityY = Math.cos(MathHelper.degreesToRadians(angle)) * velocity;
		let rotatedVectors = MathHelper.rotateCoordinates(velocityX, velocityY, -this.object.rotationZ)
		this.velocityX = rotatedVectors.x;
		this.velocityY = rotatedVectors.y;
	}

	calculateNewPosition() { // TODO: needs refactoring a lot
		let object = this.object;

		if (object.positionZ <= 0) {
			//On the ground

			if (this.velocityZ <= 0) {
				if (Math.abs(this.velocityZ) > fps / 600) {
					//Hit the ground with enough speed to bounce off
					this.velocityZ = -this.velocityZ * (1 - this.bounceDampeningFactorThing);
				} else {
					//Hit ground but not enough speed to bounce off
					this.velocityZ = 0;
				}
			}
		
			this.velocityY = this.velocityY * (1 - this.drag);
			if (Math.abs(this.velocityY) < fps / 6000) {
				this.velocityY = 0;
			}
			this.velocityX = this.velocityX * (1 - this.drag);
			if (Math.abs(this.velocityX) < fps / 6000) {
				this.velocityX = 0;
			}
			object.positionZ = 0;
		} else {
			//In the air
			this.velocityX = this.velocityX * (1 - this.airDrag)
			this.velocityY = this.velocityY * (1 - this.airDrag)
		}

		if (this.positionZ == 0 && Math.abs(this.velocityZ) < Math.abs(this.gravity / fps)) {
			this.velocityZ = 0;
		} else {
			this.velocityZ = this.velocityZ + this.gravity / fps;
		}					
	
		object.positionX = object.positionX + this.velocityX / fps;
		object.positionY = object.positionY + this.velocityY / fps;
		object.positionZ = object.positionZ + this.velocityZ / fps;
	};
}
