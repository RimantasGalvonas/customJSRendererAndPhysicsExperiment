class MathHelper {
	static radiansToDegrees(rad) {
		return rad * 180 / Math.PI;
	}

	static degreesToRadians(deg) {
		return deg * Math.PI / 180;
	}

	static rotateCoordinates(x, y, angle) {
		var angleInRads = MathHelper.degreesToRadians(angle);
		var newX = x * Math.cos(angleInRads) - y * Math.sin(angleInRads);
		var newY = x * Math.sin(angleInRads) + y * Math.cos(angleInRads);

		return {x: newX, y: newY};
	}
}