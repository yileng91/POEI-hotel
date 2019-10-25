/**
 * @file
 * Javascript for Yandex Maps integration.
 */

(function ($, Drupal) {
  'use strict';

  /* global ymaps */

  /**
   * GeolocationYandexMap element.
   *
   * @constructor
   * @augments {GeolocationMapBase}
   * @implements {GeolocationMapInterface}
   * @inheritDoc
   *
   * @prop {Object} settings.yandex_settings - Yandex Maps specific settings.
   */
  function GeolocationYandexMap(mapSettings) {
    if (typeof ymaps === 'undefined') {
      console.error('Yandex Maps library not loaded. Bailing out.'); // eslint-disable-line no-console.
      return;
    }

    this.type = 'yandex';

    Drupal.geolocation.GeolocationMapBase.call(this, mapSettings);

    var defaultYandexSettings = {
      zoom: 10
    };

    // Add any missing settings.
    this.settings.yandex_settings = $.extend(defaultYandexSettings, this.settings.yandex_settings);

    // Set the container size.
    this.container.css({
      height: this.settings.yandex_settings.height,
      width: this.settings.yandex_settings.width
    });

    var that = this;

    ymaps.ready(function () {
      // Instantiate (and display) a map object:
      that.yandexMap = new ymaps.Map(
        that.container.get(0), {
          center: [that.lat, that.lng],
          zoom: that.settings.yandex_settings.zoom,
          controls: []
        }
      );

      that.addPopulatedCallback(function (map) {
        map.yandexMap.events.add('click', function (e) {
          var coords = e.get('coords');
          map.clickCallback({lat: coords.lat, lng: coords.lng});
        });

        map.yandexMap.events.add('contextmenu', function (e) {
          var coords = e.get('coords');
          map.contextClickCallback({lat: coords.lat, lng: coords.lng});
        });
      });

      that.initializedCallback();
      that.populatedCallback();
    });
  }
  GeolocationYandexMap.prototype = Object.create(Drupal.geolocation.GeolocationMapBase.prototype);
  GeolocationYandexMap.prototype.constructor = GeolocationYandexMap;
  GeolocationYandexMap.prototype.setZoom = function (zoom) {
    if (typeof zoom === 'undefined') {
      zoom = this.settings.yandex_settings.zoom;
    }
    zoom = parseInt(zoom);
    this.yandexMap.setZoom(zoom);
  };
  GeolocationYandexMap.prototype.setCenterByCoordinates = function (coordinates, accuracy, identifier) {
    Drupal.geolocation.GeolocationMapBase.prototype.setCenterByCoordinates.call(this, coordinates, accuracy, identifier);
    this.yandexMap.setCenter([coordinates.lat, coordinates.lng]);
  };
  GeolocationYandexMap.prototype.setMapMarker = function (markerSettings) {
    var yandexMarkerSettings = {
      hintContent: markerSettings.title,
      iconContent: markerSettings.label
    };

    var currentMarker = new ymaps.Placemark([parseFloat(markerSettings.position.lat), parseFloat(markerSettings.position.lng)], yandexMarkerSettings);

    this.yandexMap.geoObjects.add(currentMarker);

    currentMarker.locationWrapper = markerSettings.locationWrapper;

    Drupal.geolocation.GeolocationMapBase.prototype.setMapMarker.call(this, currentMarker);

    return currentMarker;
  };
  GeolocationYandexMap.prototype.removeMapMarker = function (marker) {
    Drupal.geolocation.GeolocationMapBase.prototype.removeMapMarker.call(this, marker);
    this.yandexMap.geoObjects.remove(marker);
  };
  GeolocationYandexMap.prototype.getCenter = function () {
    return this.yandexMap.getCenter();
  };
  GeolocationYandexMap.prototype.fitBoundaries = function (boundaries, identifier) {
    this.yandexMap.setBounds(boundaries);
    Drupal.geolocation.GeolocationMapBase.prototype.fitBoundaries.call(this, boundaries, identifier);
  };
  GeolocationYandexMap.prototype.getMarkerBoundaries = function (locations) {
    locations = locations || this.mapMarkers;
    if (locations.length === 0) {
      return;
    }

    return this.yandexMap.geoObjects.getBounds();
  };

  Drupal.geolocation.GeolocationYandexMap = GeolocationYandexMap;
  Drupal.geolocation.addMapProvider('yandex', 'GeolocationYandexMap');

})(jQuery, Drupal);
