<?php

namespace Drupal\geolocation\Plugin\geolocation\Location;

use Drupal\geolocation\LocationInterface;
use Drupal\geolocation\LocationBase;

/**
 * Fixed coordinates map center.
 *
 * @Location(
 *   id = "freeogeoip",
 *   name = @Translation("freegoip.net Service"),
 *   description = @Translation("See http://freegeoip.net website. Limited to 15000 requests per hour."),
 * )
 */
class FreeGeoIp extends LocationBase implements LocationInterface {

  /**
   * {@inheritdoc}
   */
  public function getCoordinates($center_option_id, array $center_option_settings, $context = NULL) {
    $ip = \Drupal::request()->getClientIp();
    if (empty($ip)) {
      return [];
    }

    $json = file_get_contents("http://freegeoip.net/json/" . $ip);
    if (empty($json)) {
      return [];
    }

    $result = json_decode($json, TRUE);
    if (
      empty($result)
      || empty($result['latitude'])
      || empty($result['longitude'])
    ) {
      return [];
    }

    return [
      'lat' => (float) $result['latitude'],
      'lng' => (float) $result['longitude'],
    ];
  }

}
