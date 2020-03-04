define(function(require) {
	'use strict';

	var AssociativeArray = require('Cesium/Core/AssociativeArray');
	var Cartesian3 = require('Cesium/Core/Cartesian3');
	var Color = require('Cesium/Core/Color');
	var defined = require('Cesium/Core/defined');
	var destroyObject = require('Cesium/Core/destroyObject');
	var DeveloperError = require('Cesium/Core/DeveloperError');
	var CesiumMath = require('Cesium/Core/Math');
	var Matrix3 = require('Cesium/Core/Matrix3');
	var Matrix4 = require('Cesium/Core/Matrix4');
	var Quaternion = require('Cesium/Core/Quaternion');
	var MaterialProperty = require('Cesium/DataSources/MaterialProperty');
	var Property = require('Cesium/DataSources/Property');

	var TorusSensorVolume = require('./torus-sensor-volume');
	var removePrimitive = require('../util/remove-primitive');

	var defaultIntersectionColor = Color.WHITE;
	var defaultIntersectionWidth = 1.0;
	var defaultRadius = Number.POSITIVE_INFINITY;

	var matrix3Scratch = new Matrix3();
	var cachedPosition = new Cartesian3();
	var cachedOrientation = new Quaternion();

	/**
	 * A {@link Visualizer} which maps {@link Entity#torusSensor} to a {@link TorusSensor}.
	 * @alias TorusSensorVisualizer
	 * @constructor
	 *
	 * @param {Scene} scene The scene the primitives will be rendered in.
	 * @param {EntityCollection} entityCollection The entityCollection to visualize.
	 */
	var TorusSensorVisualizer = function(scene, entityCollection) {
		// >>includeStart('debug', pragmas.debug);
		if (!defined(scene)) {
			throw new DeveloperError('scene is required.');
		}
		if (!defined(entityCollection)) {
			throw new DeveloperError('entityCollection is required.');
		}
		// >>includeEnd('debug');

		entityCollection.collectionChanged.addEventListener(TorusSensorVisualizer.prototype._onCollectionChanged, this);

		this._scene = scene;
		this._primitives = scene.primitives;
		this._entityCollection = entityCollection;
		this._hash = {};
		this._entitiesToVisualize = new AssociativeArray();

		this._onCollectionChanged(entityCollection, entityCollection.values, [], []);
	};

	/**
	 * Updates the primitives created by this visualizer to match their
	 * Entity counterpart at the given time.
	 *
	 * @param {JulianDate} time The time to update to.
	 * @returns {Boolean} This function always returns true.
	 */
	TorusSensorVisualizer.prototype.update = function(time) {
		// >>includeStart('debug', pragmas.debug);
		if (!defined(time)) {
			throw new DeveloperError('time is required.');
		}
		// >>includeEnd('debug');

		var entities = this._entitiesToVisualize.values;
		var hash = this._hash;
		var primitives = this._primitives;

		for (var i = 0, len = entities.length; i < len; i++) {
			var entity = entities[i];
			var torusSensorGraphics = entity._torusSensor;

			var position;
			var orientation;
			var data = hash[entity.id];
			var show = entity.isShowing && entity.isAvailable(time) && Property.getValueOrDefault(torusSensorGraphics._show, time, true);

			if (show) {
				position = Property.getValueOrUndefined(entity._position, time, cachedPosition);
				orientation = Property.getValueOrUndefined(entity._orientation, time, cachedOrientation);
				show = defined(position) && defined(orientation);
			}

			if (!show) {
				// don't bother creating or updating anything else
				if (defined(data)) {
					data.primitive.show = false;
				}
				continue;
			}

			var primitive = defined(data) ? data.primitive : undefined;
			if (!defined(primitive)) {
				primitive = new TorusSensorVolume();
				primitive.id = entity;
				primitives.add(primitive);

				data = {
					primitive: primitive,
					position: undefined,
					orientation: undefined
				};
				hash[entity.id] = data;
			}

			if (!Cartesian3.equals(position, data.position) || !Quaternion.equals(orientation, data.orientation)) {
				Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(orientation, matrix3Scratch), position, primitive.modelMatrix);
				data.position = Cartesian3.clone(position, data.position);
				data.orientation = Quaternion.clone(orientation, data.orientation);
			}

			primitive.show = true;
			primitive.elevationSpan = Property.getValueOrDefault(torusSensorGraphics._elevationSpan, time, CesiumMath.PI_OVER_TWO);
			primitive.azimuthSpan = Property.getValueOrDefault(torusSensorGraphics._azimuthSpan, time, CesiumMath.PI_OVER_TWO);
			primitive.elevation = Property.getValueOrDefault(torusSensorGraphics._elevation, time, 0.0);
			primitive.azimuth = Property.getValueOrDefault(torusSensorGraphics._azimuth, time, 0.0);
			primitive.radius = Property.getValueOrDefault(torusSensorGraphics._radius, time, defaultRadius);
			primitive.lateralSurfaceMaterial = MaterialProperty.getValue(time, torusSensorGraphics._lateralSurfaceMaterial, primitive.lateralSurfaceMaterial);
			primitive.intersectionColor = Property.getValueOrClonedDefault(torusSensorGraphics._intersectionColor, time, defaultIntersectionColor, primitive.intersectionColor);
			primitive.intersectionWidth = Property.getValueOrDefault(torusSensorGraphics._intersectionWidth, time, defaultIntersectionWidth);
		}
		return true;
	};

	/**
	 * Returns true if this object was destroyed; otherwise, false.
	 *
	 * @returns {Boolean} True if this object was destroyed; otherwise, false.
	 */
	TorusSensorVisualizer.prototype.isDestroyed = function() {
		return false;
	};

	/**
	 * Removes and destroys all primitives created by this instance.
	 */
	TorusSensorVisualizer.prototype.destroy = function() {
		var entities = this._entitiesToVisualize.values;
		var hash = this._hash;
		var primitives = this._primitives;
		for (var i = entities.length - 1; i > -1; i--) {
			removePrimitive(entities[i], hash, primitives);
		}
		return destroyObject(this);
	};

	/**
	 * @private
	 */
	TorusSensorVisualizer.prototype._onCollectionChanged = function(entityCollection, added, removed, changed) {
		var i;
		var entity;
		var entities = this._entitiesToVisualize;
		var hash = this._hash;
		var primitives = this._primitives;

		for (i = added.length - 1; i > -1; i--) {
			entity = added[i];
			if (defined(entity._torusSensor) && defined(entity._position) && defined(entity._orientation)) {
				entities.set(entity.id, entity);
			}
		}

		for (i = changed.length - 1; i > -1; i--) {
			entity = changed[i];
			if (defined(entity._torusSensor) && defined(entity._position) && defined(entity._orientation)) {
				entities.set(entity.id, entity);
			} else {
				removePrimitive(entity, hash, primitives);
				entities.remove(entity.id);
			}
		}

		for (i = removed.length - 1; i > -1; i--) {
			entity = removed[i];
			removePrimitive(entity, hash, primitives);
			entities.remove(entity.id);
		}
	};

	return TorusSensorVisualizer;
});
