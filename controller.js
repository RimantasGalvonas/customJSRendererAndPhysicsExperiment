class Controller {
	object = null;
	isMovingForward = false;
	isMovingBackward = false;
	isMovingLeft = false;
	isMovingRight = false;
	isTurningCW = false;
	isTurningCCW = false;
	isJumping = false;

	initForwardButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isMovingForward = true;});
		button.addEventListener('touchstart', function(data) {Controller.isMovingForward = true;});
		button.addEventListener('mouseup', function(data) {Controller.isMovingForward = false});
		button.addEventListener('touchend', function(data) {Controller.isMovingForward = false});
	}

	initBackwardButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isMovingBackward = true;});
		button.addEventListener('touchstart', function(data) {Controller.isMovingBackward = true;});
		button.addEventListener('mouseup', function(data) {Controller.isMovingBackward = false});
		button.addEventListener('touchend', function(data) {Controller.isMovingBackward = false});
	}

	initLeftButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isMovingLeft = true;});
		button.addEventListener('touchstart', function(data) {Controller.isMovingLeft = true;});
		button.addEventListener('mouseup', function(data) {Controller.isMovingLeft = false});
		button.addEventListener('touchend', function(data) {Controller.isMovingLeft = false});
	}

	initRightButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isMovingRight = true;});
		button.addEventListener('touchstart', function(data) {Controller.isMovingRight = true;});
		button.addEventListener('mouseup', function(data) {Controller.isMovingRight = false});
		button.addEventListener('touchend', function(data) {Controller.isMovingRight = false});
	}

	initTurnCWButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isTurningCW = true;});
		button.addEventListener('touchstart', function(data) {Controller.isTurningCW = true;});
		button.addEventListener('mouseup', function(data) {Controller.isTurningCW = false});
		button.addEventListener('touchend', function(data) {Controller.isTurningCW = false});
	}

	initTurnCCWButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isTurningCCW = true;});
		button.addEventListener('touchstart', function(data) {Controller.isTurningCCW = true;});
		button.addEventListener('mouseup', function(data) {Controller.isTurningCCW = false});
		button.addEventListener('touchend', function(data) {Controller.isTurningCCW = false});
	}

	initJumpButton(button) {
		button.addEventListener('mousedown', function(data) {Controller.isJumping = true;});
		button.addEventListener('touchstart', function(data) {Controller.isJumping = true;});
		button.addEventListener('mouseup', function(data) {Controller.isJumping = false});
		button.addEventListener('touchend', function(data) {Controller.isJumping = false});
	}

	control() {
		if (Controller.isTurningCCW) {
			this.object.rotationZ--;
		}

		if (Controller.isTurningCW) {
			this.object.rotationZ++;
		}

		if (Controller.isMovingForward) {
			if (this.object.physicsModule) {
				this.object.physicsModule.applyVelocityConvertedToGlobalVectors(0, 10);
			} else {
				// TODO
			}
		}

		if (Controller.isMovingBackward) {
			if (this.object.physicsModule) {
				this.object.physicsModule.applyVelocityConvertedToGlobalVectors(180, 10);
			} else {
				// TODO
			}
		}

		if (Controller.isMovingLeft) {
			if (this.object.physicsModule) {
				this.object.physicsModule.applyVelocityConvertedToGlobalVectors(270, 10);
			} else {
				// TODO
			}
		}

		if (Controller.isMovingRight) {
			if (this.object.physicsModule) {
				this.object.physicsModule.applyVelocityConvertedToGlobalVectors(90, 10);
			} else {
				// TODO
			}
		}

		if (Controller.isJumping) {
			if (this.object.physicsModule) {
				this.object.physicsModule.velocityZ = 5
				Controller.isJumping = false;
			} else {
				// TODO
			}
		}
	}
}