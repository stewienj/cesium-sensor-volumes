define(function(require) {
	'use strict';

	var clone = require('Cesium/Core/clone');
	var defaultValue = require('Cesium/Core/defaultValue');
	var defined = require('Cesium/Core/defined');
	var defineProperties = require('Cesium/Core/defineProperties');
	var destroyObject = require('Cesium/Core/destroyObject');
	var CesiumMath = require('Cesium/Core/Math');
	var PrimitiveType = require('Cesium/Core/PrimitiveType');
	var Cartesian3 = require('Cesium/Core/Cartesian3');
	var Matrix3 = require('Cesium/Core/Matrix3');

	var CustomSensorVolume = require('../custom/custom-sensor-volume');

	function updateDirections(torusSensor) {
		var angleStep = CesiumMath.toRadians(5.0);

		// Adjust the step so we get an integer number of triangles
		var azimuthStep = torusSensor._azimuthSpan / Math.ceil(torusSensor._azimuthSpan / angleStep);
		var azimuthStart = -(torusSensor._azimuthSpan * 0.5);
		var azimuthEnd = (torusSensor._azimuthSpan * 0.5) - (azimuthStep * 0.5);

		// Adjust the step so we get an integer number of triangles
		var elevationStep = torusSensor._elevationSpan / Math.ceil(torusSensor._elevationSpan / angleStep);
		var elevationStart = -(torusSensor._elevationSpan * 0.5);
		var elevationEnd = (torusSensor._elevationSpan * 0.5) - (elevationStep * 0.5);

		var directions = torusSensor._customSensor.directions;
		var count = 0;

		// This calculates the triangles for the top and bottom of the sensor
		[-torusSensor._elevationSpan * 0.5, torusSensor._elevationSpan * 0.5].forEach(function(elevation) {
			var sinElevation = Math.sin(elevation);
			var cosElevation = Math.cos(elevation);
			for (var azimuth = azimuthStart; azimuth < azimuthEnd; azimuth += azimuthStep) {
				var center1 = directions[count];
				if (defined(center1)) {
					center1.x = 0;
					center1.y = 0;
					center1.z = 0;
				} else {
					center1 = new Cartesian3(0, 0, 0);
					directions[count] = center1;
				}
				count++;

				var topAndBottomLeft = directions[count];
				if (!defined(topAndBottomLeft)) {
					topAndBottomLeft = new Cartesian3();
					directions[count] = topAndBottomLeft;
				}
				count++;

				topAndBottomLeft.x = Math.cos(azimuth) * cosElevation;
				topAndBottomLeft.y = Math.sin(azimuth) * cosElevation;
				topAndBottomLeft.z = sinElevation;

				var topAndBottomRight = directions[count];
				if (!defined(topAndBottomRight)) {
					topAndBottomRight = new Cartesian3();
					directions[count] = topAndBottomRight;
				}
				count++;

				var azimuthNext = azimuth + azimuthStep;
				topAndBottomRight.x = Math.cos(azimuthNext) * cosElevation;
				topAndBottomRight.y = Math.sin(azimuthNext) * cosElevation;
				topAndBottomRight.z = sinElevation;
			}
		});

		// This calculates the front face of the sensor and the sides
		for (var elevation = elevationStart; elevation < elevationEnd; elevation += elevationStep) {
			var sinElevationBottom = Math.sin(elevation);
			var cosElevationBottom = Math.cos(elevation);
			var sinElevationTop = Math.sin(elevation + elevationStep);
			var cosElevationTop = Math.cos(elevation + elevationStep);

			// Calculate the sides if rendering less than a full circle
			if (torusSensor._azimuthSpan < CesiumMath.PI * 1.9999) {
				[-torusSensor._azimuthSpan * 0.5, torusSensor._azimuthSpan * 0.5].forEach(function(azimuth) {
					var center = directions[count];
					if (defined(center)) {
						center.x = 0;
						center.y = 0;
						center.z = 0;
					} else {
						center = new Cartesian3(0, 0, 0);
						directions[count] = center;
					}
					count++;

					var sideBottom = directions[count];
					if (!defined(sideBottom)) {
						sideBottom = new Cartesian3();
						directions[count] = sideBottom;
					}
					count++;

					var sideTop = directions[count];
					if (!defined(sideTop)) {
						sideTop = new Cartesian3();
						directions[count] = sideTop;
					}
					count++;

					var sinAzimuth = Math.sin(azimuth);
					var cosAzimuth = Math.cos(azimuth);

					sideBottom.x = cosAzimuth * cosElevationBottom;
					sideBottom.y = sinAzimuth * cosElevationBottom;
					sideBottom.z = sinElevationBottom;

					sideTop.x = cosAzimuth * cosElevationTop;
					sideTop.y = sinAzimuth * cosElevationTop;
					sideTop.z = sinElevationTop;
				});
			}

			// Calculate the front face of the sensor
			for (var azimuth = azimuthStart; azimuth < azimuthEnd; azimuth += azimuthStep) {
				var sinAzimuthLeft = Math.sin(azimuth);
				var cosAzimuthLeft = Math.cos(azimuth);
				var sinAzimuthRight = Math.sin(azimuth + azimuthStep);
				var cosAzimuthRight = Math.cos(azimuth + azimuthStep);

				// Generate all the points, looks like I should be sharing some of these, but that
				// causes issues down the track with points being unintentionally changed.
				var bottomLeft1 = directions[count];
				if (!defined(bottomLeft1)) {
					bottomLeft1 = new Cartesian3();
					directions[count] = bottomLeft1;
				}
				count++;

				var topLeft1 = directions[count];
				if (!defined(topLeft1)) {
					topLeft1 = new Cartesian3();
					directions[count] = topLeft1;
				}
				count++;

				var bottomRight1 = directions[count];
				if (!defined(bottomRight1)) {
					bottomRight1 = new Cartesian3();
					directions[count] = bottomRight1;
				}
				count++;

				var bottomRight2 = directions[count];
				if (!defined(bottomRight2)) {
					bottomRight2 = new Cartesian3();
					directions[count] = bottomRight2;
				}
				count++;

				var topLeft2 = directions[count];
				if (!defined(topLeft2)) {
					topLeft2 = new Cartesian3();
					directions[count] = topLeft2;
				}
				count++;

				var topRight2 = directions[count];
				if (!defined(topRight2)) {
					topRight2 = new Cartesian3();
					directions[count] = topRight2;
				}
				count++;

				bottomLeft1.x = cosAzimuthLeft * cosElevationBottom;
				bottomLeft1.y = sinAzimuthLeft * cosElevationBottom;
				bottomLeft1.z = sinElevationBottom;

				topLeft1.x = cosAzimuthLeft * cosElevationTop;
				topLeft1.y = sinAzimuthLeft * cosElevationTop;
				topLeft1.z = sinElevationTop;

				topLeft2.x = topLeft1.x;
				topLeft2.y = topLeft1.y;
				topLeft2.z = topLeft1.z;

				bottomRight1.x = cosAzimuthRight * cosElevationBottom;
				bottomRight1.y = sinAzimuthRight * cosElevationBottom;
				bottomRight1.z = sinElevationBottom;

				bottomRight2.x = bottomRight1.x;
				bottomRight2.y = bottomRight1.y;
				bottomRight2.z = bottomRight1.z;

				topRight2.x = cosAzimuthRight * cosElevationTop;
				topRight2.y = sinAzimuthRight * cosElevationTop;
				topRight2.z = sinElevationTop;
			}
		}

		// These rotations are inverted because we are rotation clockwise like
		// North - East not anti clockwise like the right hand rule
		var orientation = Matrix3.multiply(Matrix3.fromRotationZ(-torusSensor._azimuth), Matrix3.fromRotationY(-torusSensor._elevation), new Matrix3());

		for (var i = 0; i < count; ++i) {
			Matrix3.multiplyByVector(orientation, directions[i], directions[i]);
		}

		directions.length = count;
		torusSensor._customSensor.directions = directions;
	}

	var TorusSensorVolume = function(options) {
		options = defaultValue(options, defaultValue.EMPTY_OBJECT);

		var customSensorOptions = clone(options);
		customSensorOptions._pickPrimitive = defaultValue(options._pickPrimitive, this);
		customSensorOptions.directions = undefined;
		this._customSensor = new CustomSensorVolume(customSensorOptions);
		this._customSensor.primitiveTypeOverride = PrimitiveType.TRIANGLES;

		this._elevationSpan = defaultValue(options.elevationSpan, CesiumMath.PI_OVER_TWO);
		this._azimuthSpan = defaultValue(options.azimuthSpan, CesiumMath.PI_OVER_TWO);
		this._elevation = defaultValue(options.elevation, 0.0);
		this._azimuth = defaultValue(options.azimuth, 0.0);

		updateDirections(this);
	};

	defineProperties(TorusSensorVolume.prototype, {
		elevationSpan: {
			get: function() {
				return this._elevationSpan;
			},
			set: function(value) {
				if (this._elevationSpan !== value) {
					this._elevationSpan = Math.max(0.000001, Math.min(value, CesiumMath.PI));
					updateDirections(this);
				}
			}
		},
		elevation: {
			get: function() {
				return this._elevation;
			},
			set: function(value) {
				if (this._elevation !== value) {
					this._elevation = value;
					updateDirections(this);
				}
			}
		},
		azimuthSpan: {
			get: function() {
				return this._azimuthSpan;
			},
			set: function(value) {
				if (this._azimuthSpan !== value) {
					this._azimuthSpan = Math.max(0.000001, Math.min(value, CesiumMath.TWO_PI));
					updateDirections(this);
				}
			}
		},
		azimuth: {
			get: function() {
				return this._azimuth;
			},
			set: function(value) {
				if (this._azimuth !== value) {
					this._azimuth = value;
					updateDirections(this);
				}
			}
		},
		show: {
			get: function() {
				return this._customSensor.show;
			},
			set: function(value) {
				this._customSensor.show = value;
			}
		},
		showIntersection: {
			get: function() {
				return this._customSensor.showIntersection;
			},
			set: function(value) {
				this._customSensor.showIntersection = value;
			}
		},
		showThroughEllipsoid: {
			get: function() {
				return this._customSensor.showThroughEllipsoid;
			},
			set: function(value) {
				this._customSensor.showThroughEllipsoid = value;
			}
		},
		modelMatrix: {
			get: function() {
				return this._customSensor.modelMatrix;
			},
			set: function(value) {
				this._customSensor.modelMatrix = value;
			}
		},
		radius: {
			get: function() {
				return this._customSensor.radius;
			},
			set: function(value) {
				if (this._customSensor.radius !== value) {
					this._customSensor.radius = value;
					this._customSensor._directionsDirty = true;
				}
			}
		},
		lateralSurfaceMaterial: {
			get: function() {
				return this._customSensor.lateralSurfaceMaterial;
			},
			set: function(value) {
				this._customSensor.lateralSurfaceMaterial = value;
			}
		},
		intersectionColor: {
			get: function() {
				return this._customSensor.intersectionColor;
			},
			set: function(value) {
				this._customSensor.intersectionColor = value;
			}
		},
		intersectionWidth: {
			get: function() {
				return this._customSensor.intersectionWidth;
			},
			set: function(value) {
				this._customSensor.intersectionWidth = value;
			}
		},
		id: {
			get: function() {
				return this._customSensor.id;
			},
			set: function(value) {
				this._customSensor.id = value;
			}
		}
	});

	TorusSensorVolume.prototype.update = function(frameState) {
		this._customSensor.update(frameState);
	};

	TorusSensorVolume.prototype.isDestroyed = function() {
		return false;
	};

	TorusSensorVolume.prototype.destroy = function() {
		this._customSensor = this._customSensor && this._customSensor.destroy();
		return destroyObject(this);
	};

	return TorusSensorVolume;
});
