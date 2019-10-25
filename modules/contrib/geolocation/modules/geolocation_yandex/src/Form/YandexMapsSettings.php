<?php

namespace Drupal\geolocation_yandex\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the Yandex Maps form controller.
 *
 * @see \Drupal\Core\Form\FormBase
 */
class YandexMapsSettings extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->configFactory->get('yandex_maps.settings');

    $form['key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Yandex Maps Key'),
      '#default_value' => $config->get('key'),
      '#description' => $this->t('Yandex Maps requires users to sign up at <a href="https://developer.tech.yandex.ru/">developer.tech.yandex.ru</a>.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'geolocation_yandex_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'yandex_maps.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->configFactory()->getEditable('yandex_maps.settings');
    $config->set('key', $form_state->getValue('key'));

    $config->save();

    // Confirmation on form submission.
    \Drupal::messenger()->addMessage($this->t('The configuration options have been saved.'));

    drupal_flush_all_caches();
  }

}
