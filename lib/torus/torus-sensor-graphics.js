define(function(require) {
	'use strict';

	var defaultValue = require('Cesium/Core/defaultValue');
	var defined = require('Cesium/Core/defined');
	var defineProperties = require('Cesium/Core/defineProperties');
	var DeveloperError = require('Cesium/Core/DeveloperError');
	var Event = require('Cesium/Core/Event');

	var createPropertyDescriptor = require('Cesium/DataSources/createPropertyDescriptor');

	/**
	 * An optionally time-dynamic pyramid.
	 *
	 * @alias TorusSensorGraphics
	 * @constructor
	 */
	var TorusSensorGraphics = function() {
		this._elevationSpan = undefined;
		this._elevationSpanSubscription = undefined;
		this._azimuthSpan = undefined;
		this._azimuthSpanSubscription = undefined;

		this._elevation = undefined;
		this._elevationSubscription = undefined;
		this._azimuth = undefined;
		this._azimuthSubscription = undefined;

		this._lateralSurfaceMaterial = undefined;
		this._lateralSurfaceMaterialSubscription = undefined;

		this._intersectionColor = undefined;
		this._intersectionColorSubscription = undefined;
		this._intersectionWidth = undefined;
		this._intersectionWidthSubscription = undefined;
		this._showIntersection = undefined;
		this._showIntersectionSubscription = undefined;
		this._radius = undefined;
		this._radiusSubscription = undefined;
		this._show = undefined;
		this._showSubscription = undefined;
		this._definitionChanged = new Event();
	};

	defineProperties(TorusSensorGraphics.prototype, {
		/**
		 * Gets the event that is raised whenever a new property is assigned.
		 * @memberof TorusSensorGraphics.prototype
		 *
		 * @type {Event}
		 * @readonly
		 */
		definitionChanged: {
			get: function() {
				return this._definitionChanged;
			}
		},

		/**
		 * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		elevationSpan: createPropertyDescriptor('elevationSpan'),

		/**
		 * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		elevation: createPropertyDescriptor('elevation'),

		/**
		 * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		azimuthSpan: createPropertyDescriptor('azimuthSpan'),

		/**
		 * A {@link Property} which returns an array of {@link Spherical} instances representing the pyramid's projection.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		azimuth: createPropertyDescriptor('azimuth'),

		/**
		 * Gets or sets the {@link MaterialProperty} specifying the the pyramid's appearance.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {MaterialProperty}
		 */
		lateralSurfaceMaterial: createPropertyDescriptor('lateralSurfaceMaterial'),

		/**
		 * Gets or sets the {@link Color} {@link Property} specifying the color of the line formed by the intersection of the pyramid and other central bodies.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		intersectionColor: createPropertyDescriptor('intersectionColor'),

		/**
		 * Gets or sets the numeric {@link Property} specifying the width of the line formed by the intersection of the pyramid and other central bodies.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		intersectionWidth: createPropertyDescriptor('intersectionWidth'),

		/**
		 * Gets or sets the boolean {@link Property} specifying the visibility of the line formed by the intersection of the pyramid and other central bodies.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		showIntersection: createPropertyDescriptor('showIntersection'),

		/**
		 * Gets or sets the numeric {@link Property} specifying the radius of the pyramid's projection.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		radius: createPropertyDescriptor('radius'),

		/**
		 * Gets or sets the boolean {@link Property} specifying the visibility of the pyramid.
		 * @memberof TorusSensorGraphics.prototype
		 * @type {Property}
		 */
		show: createPropertyDescriptor('show')
	});

	/**
	 * Duplicates a TorusSensorGraphics instance.
	 *
	 * @param {TorusSensorGraphics} [result] The object onto which to store the result.
	 * @returns {TorusSensorGraphics} The modified result parameter or a new instance if one was not provided.
	 */
	TorusSensorGraphics.prototype.clone = function(result) {
		if (!defined(result)) {
			result = new TorusSensorGraphics();
		}
		result.elevationSpan = this.elevationSpan;
		result.azimuthSpan = this.azimuthSpan;
		result.elevation = this.elevation;
		result.azimuth = this.azimuth;
		result.radius = this.radius;
		result.show = this.show;
		result.showIntersection = this.showIntersection;
		result.intersectionColor = this.intersectionColor;
		result.intersectionWidth = this.intersectionWidth;
		result.lateralSurfaceMaterial = this.lateralSurfaceMaterial;
		return result;
	};

	/**
	 * Assigns each unassigned property on this object to the value
	 * of the same property on the provided source object.
	 *
	 * @param {TorusSensorGraphics} source The object to be merged into this object.
	 */
	TorusSensorGraphics.prototype.merge = function(source) {
		// >>includeStart('debug', pragmas.debug);
		if (!defined(source)) {
			throw new DeveloperError('source is required.');
		}
		// >>includeEnd('debug');

		this.elevationSpan = defaultValue(this.elevationSpan, source.elevationSpan);
		this.azimuthSpan = defaultValue(this.azimuthSpan, source.azimuthSpan);
		this.elevation = defaultValue(this.elevation, source.elevation);
		this.azimuth = defaultValue(this.azimuth, source.azimuth);
		this.radius = defaultValue(this.radius, source.radius);
		this.show = defaultValue(this.show, source.show);
		this.showIntersection = defaultValue(this.showIntersection, source.showIntersection);
		this.intersectionColor = defaultValue(this.intersectionColor, source.intersectionColor);
		this.intersectionWidth = defaultValue(this.intersectionWidth, source.intersectionWidth);
		this.lateralSurfaceMaterial = defaultValue(this.lateralSurfaceMaterial, source.lateralSurfaceMaterial);
	};

	return TorusSensorGraphics;
});
