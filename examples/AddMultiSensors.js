var longitude = Cesium.Math.toRadians(138.3309818);
var latitude = Cesium.Math.toRadians(-35.0004451);
var altitude = 30000.0;

function getModelMatrix() {
	var ellipsoid = viewer.scene.globe.ellipsoid;
	var location = ellipsoid.cartographicToCartesian(new Cesium.Cartographic(longitude, latitude, altitude));
	var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(location);
	return modelMatrix;
}

function addRectangularSensors(xOffset, yOffset) {
	for (var dx = 1; dx < 3.5; dx += 1) {
		for (var dy = 1; dy < 3.5; dy += 1) {
			var rectangularPyramidSensor = new CesiumSensorVolumes.RectangularPyramidSensorVolume();

			var translationMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.IDENTITY, new Cesium.Cartesian3((dx + xOffset) * altitude * 3, (dy + yOffset) * altitude * 3, 0));
			rectangularPyramidSensor.modelMatrix = Cesium.Matrix4.multiply(getModelMatrix(), translationMatrix, new Cesium.Matrix4());
			rectangularPyramidSensor.radius = altitude - 500;
			rectangularPyramidSensor.xHalfAngle = Cesium.Math.toRadians(dx * 90 / 3);
			rectangularPyramidSensor.yHalfAngle = Cesium.Math.toRadians(dy * 90 / 3);

			rectangularPyramidSensor.lateralSurfaceMaterial = Cesium.Material.fromType('Color');
			rectangularPyramidSensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(0.0, 1.0, 1.0, 0.8);
			viewer.scene.primitives.add(rectangularPyramidSensor);
		}
	}
}

function addTorusSensors(xOffset, yOffset) {
	for (var dx = 1.0; dx < 3.5; dx += 1.0) {
		for (var dy = 1.0; dy < 6.5; dy += 1.0) {
			var torusSensor = new CesiumSensorVolumes.TorusSensorVolume();

			var translationMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.IDENTITY, new Cesium.Cartesian3((dx + xOffset) * altitude * 3, (dy + yOffset) * altitude * 3, 0));
			torusSensor.modelMatrix = Cesium.Matrix4.multiply(getModelMatrix(), translationMatrix, new Cesium.Matrix4());
			torusSensor.radius = altitude - 500.0;
			torusSensor.elevationSpan = Cesium.Math.toRadians((dx * 180.0) / 3.0);
			torusSensor.azimuthSpan = Cesium.Math.toRadians((dy * 180.0) / 3.0);

			torusSensor.lateralSurfaceMaterial = Cesium.Material.fromType('Color');
			torusSensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(1.0, 0.0, 1.0, 0.8);
			viewer.scene.primitives.add(torusSensor);
		}
	}
}

// Start off looking at Australia.
viewer.camera.setView({
	destination: Cesium.Rectangle.fromDegrees(130.0, -35.0, 145.0, -29.0)
});

addRectangularSensors(0, -2);
addTorusSensors(3, -3.5);
// addConicSensors(6, -2);

