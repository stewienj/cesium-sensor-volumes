/* eslint-disable max-nested-callbacks */
define([
	'conic/conic-sensor-graphics',
	'Cesium/Core/Color',
	'Cesium/DataSources/ColorMaterialProperty',
	'Cesium/DataSources/ConstantProperty',
	'../matchers/add-to-throw-developer-error-matcher'
], function(
	ConicSensorGraphics,
	Color,
	ColorMaterialProperty,
	ConstantProperty,
	addToThrowDeveloperErrorMatcher
) {
	'use strict';

	/* global describe, it, beforeEach, expect */

	describe('conic sensor graphics', function() {
		describe('merge', function() {
			beforeEach(addToThrowDeveloperErrorMatcher);

			it('should assign unassigned properties', function() {
				var source = new ConicSensorGraphics();
				source.lateralSurfaceMaterial = new ColorMaterialProperty();
				source.innerHalfAngle = new ConstantProperty(1);
				source.maximumClockAngle = new ConstantProperty(1);
				source.minimumClockAngle = new ConstantProperty(1);
				source.outerHalfAngle = new ConstantProperty(1);
				source.intersectionColor = new ConstantProperty(Color.WHITE);
				source.radius = new ConstantProperty(1);
				source.show = new ConstantProperty(true);
				source.showIntersection = new ConstantProperty(true);
				source.intersectionWidth = new ConstantProperty(1);

				var target = new ConicSensorGraphics();
				target.merge(source);

				expect(target.lateralSurfaceMaterial).toBe(source.lateralSurfaceMaterial);
				expect(target.innerHalfAngle).toBe(source.innerHalfAngle);
				expect(target.maximumClockAngle).toBe(source.maximumClockAngle);
				expect(target.minimumClockAngle).toBe(source.minimumClockAngle);
				expect(target.outerHalfAngle).toBe(source.outerHalfAngle);
				expect(target.intersectionColor).toBe(source.intersectionColor);
				expect(target.radius).toBe(source.radius);
				expect(target.show).toBe(source.show);
				expect(target.showIntersection).toBe(source.showIntersection);
				expect(target.intersectionWidth).toBe(source.intersectionWidth);
			});

			it('should not assign assigned properties', function() {
				var source = new ConicSensorGraphics();
				source.lateralSurfaceMaterial = new ColorMaterialProperty();
				source.innerHalfAngle = new ConstantProperty(1);
				source.maximumClockAngle = new ConstantProperty(1);
				source.minimumClockAngle = new ConstantProperty(1);
				source.outerHalfAngle = new ConstantProperty(1);
				source.intersectionColor = new ConstantProperty(Color.WHITE);
				source.radius = new ConstantProperty(1);
				source.show = new ConstantProperty(true);
				source.showIntersection = new ConstantProperty(true);
				source.intersectionWidth = new ConstantProperty(1);

				var lateralSurfaceMaterial = new ColorMaterialProperty();
				var innerHalfAngle = new ConstantProperty(1);
				var maximumClockAngle = new ConstantProperty(1);
				var minimumClockAngle = new ConstantProperty(1);
				var outerHalfAngle = new ConstantProperty(1);
				var intersectionColor = new ConstantProperty(Color.WHITE);
				var radius = new ConstantProperty(1);
				var show = new ConstantProperty(true);
				var showIntersection = new ConstantProperty(true);
				var intersectionWidth = new ConstantProperty(1);

				var target = new ConicSensorGraphics();
				target.lateralSurfaceMaterial = lateralSurfaceMaterial;
				target.innerHalfAngle = innerHalfAngle;
				target.maximumClockAngle = maximumClockAngle;
				target.minimumClockAngle = minimumClockAngle;
				target.outerHalfAngle = outerHalfAngle;
				target.intersectionColor = intersectionColor;
				target.radius = radius;
				target.show = show;
				target.showIntersection = showIntersection;
				target.intersectionWidth = intersectionWidth;

				target.merge(source);

				expect(target.lateralSurfaceMaterial).toBe(lateralSurfaceMaterial);
				expect(target.innerHalfAngle).toBe(innerHalfAngle);
				expect(target.maximumClockAngle).toBe(maximumClockAngle);
				expect(target.minimumClockAngle).toBe(minimumClockAngle);
				expect(target.outerHalfAngle).toBe(outerHalfAngle);
				expect(target.intersectionColor).toBe(intersectionColor);
				expect(target.radius).toBe(radius);
				expect(target.show).toBe(show);
				expect(target.showIntersection).toBe(showIntersection);
				expect(target.intersectionWidth).toBe(intersectionWidth);
			});

			it('should throw if source undefined', function() {
				var target = new ConicSensorGraphics();
				expect(function() {
					target.merge(undefined);
				}).toThrowDeveloperError();
			});
		});

		it('should clone', function() {
			var source = new ConicSensorGraphics();
			source.lateralSurfaceMaterial = new ColorMaterialProperty();
			source.innerHalfAngle = new ConstantProperty(1);
			source.maximumClockAngle = new ConstantProperty(1);
			source.minimumClockAngle = new ConstantProperty(1);
			source.outerHalfAngle = new ConstantProperty(1);
			source.intersectionColor = new ConstantProperty(Color.WHITE);
			source.radius = new ConstantProperty(1);
			source.show = new ConstantProperty(true);
			source.showIntersection = new ConstantProperty(true);
			source.intersectionWidth = new ConstantProperty(1);

			var result = source.clone();
			expect(result.lateralSurfaceMaterial).toBe(source.lateralSurfaceMaterial);
			expect(result.innerHalfAngle).toBe(source.innerHalfAngle);
			expect(result.maximumClockAngle).toBe(source.maximumClockAngle);
			expect(result.minimumClockAngle).toBe(source.minimumClockAngle);
			expect(result.outerHalfAngle).toBe(source.outerHalfAngle);
			expect(result.intersectionColor).toBe(source.intersectionColor);
			expect(result.radius).toBe(source.radius);
			expect(result.show).toBe(source.show);
			expect(result.showIntersection).toBe(source.showIntersection);
			expect(result.intersectionWidth).toBe(source.intersectionWidth);
		});
	});
});
