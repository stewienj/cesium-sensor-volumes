/* eslint-disable max-nested-callbacks */
define([
	'rectangular/rectangular-sensor-graphics',
	'rectangular/rectangular-sensor-visualizer',
	'Cesium/Core/Cartesian3',
	'Cesium/Core/Color',
	'Cesium/Core/JulianDate',
	'Cesium/Core/Math',
	'Cesium/Core/Matrix3',
	'Cesium/Core/Matrix4',
	'Cesium/Core/Quaternion',
	'Cesium/Core/Spherical',
	'Cesium/DataSources/ColorMaterialProperty',
	'Cesium/DataSources/ConstantProperty',
	'Cesium/DataSources/EntityCollection',
	'../util/create-scene',
	'../matchers/add-to-throw-developer-error-matcher'
], function(
	RectangularSensorGraphics,
	RectangularSensorVisualizer,
	Cartesian3,
	Color,
	JulianDate,
	CesiumMath,
	Matrix3,
	Matrix4,
	Quaternion,
	Spherical,
	ColorMaterialProperty,
	ConstantProperty,
	EntityCollection,
	createScene,
	addToThrowDeveloperErrorMatcher
) {
	'use strict';

	/* global describe, it, beforeAll, afterAll, beforeEach, afterEach, expect */

	describe('rectangular sensor visualizer', function() {
		var scene;
		var visualizer;

		beforeAll(function() {
			scene = createScene();
		});

		afterAll(function() {
			scene.destroyForSpecs();
		});

		beforeEach(addToThrowDeveloperErrorMatcher);

		afterEach(function() {
			visualizer = visualizer && visualizer.destroy();
		});

		describe('constructor', function() {
			it('should throw if no scene is passed', function() {
				expect(function() {
					return new RectangularSensorVisualizer();
				}).toThrowDeveloperError();
			});
		});

		describe('update', function() {
			it('should throw if no time specified', function() {
				var entityCollection = new EntityCollection();
				visualizer = new RectangularSensorVisualizer(scene, entityCollection);
				expect(function() {
					visualizer.update();
				}).toThrowDeveloperError();
			});
		});

		describe('isDestroy', function() {
			it('should return false until destroyed', function() {
				var entityCollection = new EntityCollection();
				visualizer = new RectangularSensorVisualizer(scene, entityCollection);
				expect(visualizer.isDestroyed()).toEqual(false);
				visualizer.destroy();
				expect(visualizer.isDestroyed()).toEqual(true);
				visualizer = undefined;
			});
		});

		it('should not create a primitive from an object with no rectangularSensor', function() {
			var entityCollection = new EntityCollection();
			visualizer = new RectangularSensorVisualizer(scene, entityCollection);

			var testObject = entityCollection.getOrCreateEntity('test');
			testObject.position = new ConstantProperty(new Cartesian3(1234, 5678, 9101112));
			testObject.orientation = new ConstantProperty(new Quaternion(0, 0, 0, 1));
			visualizer.update(JulianDate.now());
			expect(scene.primitives.length).toEqual(0);
		});

		it('should not create a primitive from an object with no position', function() {
			var entityCollection = new EntityCollection();
			visualizer = new RectangularSensorVisualizer(scene, entityCollection);

			var testObject = entityCollection.getOrCreateEntity('test');
			testObject.addProperty('rectangularSensor');
			testObject.orientation = new ConstantProperty(new Quaternion(0, 0, 0, 1));
			var rectangularSensor = new RectangularSensorGraphics();
			rectangularSensor.xHalfAngle = new ConstantProperty(0.1);
			rectangularSensor.yHalfAngle = new ConstantProperty(0.2);
			testObject.rectangularSensor = rectangularSensor;
			visualizer.update(JulianDate.now());
			expect(scene.primitives.length).toEqual(0);
		});

		it('should not create a primitive from an object with no orientation', function() {
			var entityCollection = new EntityCollection();
			visualizer = new RectangularSensorVisualizer(scene, entityCollection);

			var testObject = entityCollection.getOrCreateEntity('test');
			testObject.addProperty('rectangularSensor');
			testObject.position = new ConstantProperty(new Cartesian3(1234, 5678, 9101112));
			var rectangularSensor = new RectangularSensorGraphics();
			rectangularSensor.xHalfAngle = new ConstantProperty(0.1);
			rectangularSensor.yHalfAngle = new ConstantProperty(0.2);
			testObject.rectangularSensor = rectangularSensor;
			visualizer.update(JulianDate.now());
			expect(scene.primitives.length).toEqual(0);
		});

		it('should cause a sensor to be created and updated', function() {
			var time = JulianDate.now();
			var entityCollection = new EntityCollection();
			visualizer = new RectangularSensorVisualizer(scene, entityCollection);

			var testObject = entityCollection.getOrCreateEntity('test');
			testObject.addProperty('rectangularSensor');
			testObject.show = true;
			testObject.position = new ConstantProperty(new Cartesian3(1234, 5678, 9101112));
			testObject.orientation = new ConstantProperty(new Quaternion(0, 0, Math.sin(CesiumMath.PI_OVER_FOUR), Math.cos(CesiumMath.PI_OVER_FOUR)));

			var rectangularSensor = new RectangularSensorGraphics();
			rectangularSensor.xHalfAngle = new ConstantProperty(0.1);
			rectangularSensor.yHalfAngle = new ConstantProperty(0.2);
			rectangularSensor.intersectionColor = new ConstantProperty(new Color(0.1, 0.2, 0.3, 0.4));
			rectangularSensor.intersectionWidth = new ConstantProperty(0.5);
			rectangularSensor.showIntersection = new ConstantProperty(true);
			rectangularSensor.radius = new ConstantProperty(123.5);
			rectangularSensor.show = new ConstantProperty(true);
			rectangularSensor.lateralSurfaceMaterial = new ColorMaterialProperty(Color.WHITE);
			testObject.rectangularSensor = rectangularSensor;
			visualizer.update(time);

			expect(scene.primitives.length).toEqual(1);
			var p = scene.primitives.get(0);
			expect(p.intersectionColor).toEqual(testObject.rectangularSensor.intersectionColor.getValue(time));
			expect(p.intersectionWidth).toEqual(testObject.rectangularSensor.intersectionWidth.getValue(time));
			expect(p.showIntersection).toEqual(testObject.rectangularSensor.showIntersection.getValue(time));
			expect(p.radius).toEqual(testObject.rectangularSensor.radius.getValue(time));
			expect(p.modelMatrix).toEqual(Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(testObject.orientation.getValue(time)), testObject.position.getValue(time)));
			expect(p.show).toEqual(testObject.rectangularSensor.show.getValue(time));
			expect(p.lateralSurfaceMaterial.uniforms).toEqual(testObject.rectangularSensor.lateralSurfaceMaterial.getValue(time));

			testObject.show = false;
			visualizer.update(time);
			expect(p.show).toBe(false);

			testObject.show = true;
			visualizer.update(time);
			expect(p.show).toBe(true);

			rectangularSensor.show.setValue(false);
			visualizer.update(time);
			expect(p.show).toBe(false);
		});

		it('should remove primitives', function() {
			var entityCollection = new EntityCollection();
			visualizer = new RectangularSensorVisualizer(scene, entityCollection);

			var testObject = entityCollection.getOrCreateEntity('test');
			testObject.addProperty('rectangularSensor');
			testObject.position = new ConstantProperty(new Cartesian3(1234, 5678, 9101112));
			testObject.orientation = new ConstantProperty(new Quaternion(0, 0, 0, 1));
			var rectangularSensor = new RectangularSensorGraphics();
			rectangularSensor.xHalfAngle = new ConstantProperty(0.1);
			rectangularSensor.yHalfAngle = new ConstantProperty(0.2);
			testObject.rectangularSensor = rectangularSensor;

			var time = JulianDate.now();
			expect(scene.primitives.length).toEqual(0);
			visualizer.update(time);
			expect(scene.primitives.length).toEqual(1);
			expect(scene.primitives.get(0).show).toEqual(true);
			entityCollection.removeAll();
			visualizer.update(time);
			expect(scene.primitives.length).toEqual(0);
		});

		it('should set entity property', function() {
			var entityCollection = new EntityCollection();
			visualizer = new RectangularSensorVisualizer(scene, entityCollection);

			var testObject = entityCollection.getOrCreateEntity('test');
			testObject.addProperty('rectangularSensor');
			testObject.position = new ConstantProperty(new Cartesian3(1234, 5678, 9101112));
			testObject.orientation = new ConstantProperty(new Quaternion(0, 0, 0, 1));
			var rectangularSensor = new RectangularSensorGraphics();
			rectangularSensor.xHalfAngle = new ConstantProperty(0.1);
			rectangularSensor.yHalfAngle = new ConstantProperty(0.2);
			testObject.rectangularSensor = rectangularSensor;

			var time = JulianDate.now();
			visualizer.update(time);
			expect(scene.primitives.get(0).id).toEqual(testObject);
		});
	});
}, 'WebGL');
