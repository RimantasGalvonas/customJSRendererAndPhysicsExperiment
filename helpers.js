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

	/**
	 * intersectingLineX - where the intersecting line begins (camera X)
	 * intersectingLineY - intersecting line's value at x = 0 (camera Y)
	 * intersectingLineSlope - in camera's case - tangent of the field of view
	 */
	static cutLineByIntersection(aX, aY, aZ, bX, bY, bZ, intersectingLineX, intersectingLineY, intersectingLineSlope) {
		let startX;
		let startY;
		let endX;
		let endY;
		let startZ = aZ;
		let endZ = bZ;

		if (aX <= bX) { // draw from left to right
			startX = aX;
			startY = aY;
			endX = bX
			endY = bY;
		} else {
			startX = bX;
			startY = bY;
			endX = aX;
			endY = aY;
		}

		if (startY <= intersectingLineY && endY <= intersectingLineY) {
			return;
		}

		let lineXLength = endX - startX;
		let lineYLength = endY - startY;
		let lineZLength = endZ - startZ;

		let x_y_slope = lineYLength / lineXLength;
		let yPositionAtZeroX = startY - startX * x_y_slope;

		if (x_y_slope == Number.NEGATIVE_INFINITY) {
			endY = Math.max(endY, intersectingLineY + Math.abs(startX - intersectingLineX) * intersectingLineSlope);
		} else {
			let intersection = this.findLineIntersection(x_y_slope, yPositionAtZeroX, intersectingLineSlope, intersectingLineY);

			if (intersection.x == Number.POSITIVE_INFINITY || intersection.x == Number.NEGATIVE_INFINITY) {
				//Never intersects - return original. Might be dumb and need refactoring but later
				return {
					start: {x: startX, y: startY},
					end: {x: endX, y: endY}
				};
			}
			
			if (x_y_slope > intersectingLineSlope) {
				if (x_y_slope < 0) {
					// TEST 4
					startX = Math.max(startX, intersection.x);
					startY = Math.min(startY, intersection.y);
				} else {
					//TEST 2
					startX = Math.max(startX, intersection.x);
					startY = Math.max(startY, intersection.y);
				}
			} else {
				if (x_y_slope < 0) {
					// TEST 1
					endX = Math.min(endX, intersection.x);
					endY = Math.max(endY, intersection.y);	
				} else {
					// TEST 3
					endX = Math.min(endX, intersection.x);
					endY = Math.min(endY, intersection.y);
				}
			}	
		}

		return {
			start: {x: startX, y: startY},
			end: {x: endX, y: endY}
		};
	}

	static findLineIntersection(slope, y_at_0_x, intersector_slope, intersector_y_at_0_x) {
		let xIntersection = (y_at_0_x - intersector_y_at_0_x)/(intersector_slope - slope);
		let yIntersection = xIntersection * slope + y_at_0_x;

		return {x: xIntersection, y: yIntersection};
	}
}