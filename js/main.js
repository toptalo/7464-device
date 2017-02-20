(function (window, $) {
  'use strict';

  /**
   * Попапы
   **/

  var $popups = $.querySelectorAll('.js-popup-feedback, .js-popup-contacts');

  [].forEach.call($popups, function ($popup) { // Закрытие кнопкой
    $popup.querySelector('.js-popup-close').addEventListener('click', function (event) {
      event.preventDefault();

      $popup.classList.remove('is-visible');
    }, false);

    window.addEventListener('keyup', function (event) { // Закрытие по Esc
      if (event.keyCode === 27 && $popup.classList.contains('is-visible')) {
        $popup.classList.remove('is-visible');
      }
    });
  });

  /**
   * Обратная связь
   **/

  var $feedbackPopup = $.querySelector('.js-popup-feedback');
  var $feedbackLink = $.querySelector('.js-show-feedback');
  var $feedbackForm = $.querySelector('.js-feedback-form');
  var $feedbackFields = $feedbackForm.querySelectorAll('input, textarea');

  $feedbackForm.noValidate = true; // отключаю стандартную валидацию

  function isValidField ($field) {
    var isValid = false;

    if ($field.type === 'text' || $field.type === 'textarea') {
      isValid = !!$field.value;
    }

    if ($field.type === 'email') {
      isValid = /^.*@.*\..{2,}$/.test($field.value);
    }

    return isValid;
  }

  function showErrorFor ($field) {
    if (!$field.classList.contains('is-invalid')) {
      $field.classList.add('is-invalid');
    }
  }

  function hideErrorFor ($field) {
    if ($field.classList.contains('is-invalid')) {
      $field.classList.remove('is-invalid');
    }
  }

  function storeData () {
    if (typeof window.localStorage === 'object') {
      var name = $feedbackForm.querySelector('[name="name"]').value;
      var email = $feedbackForm.querySelector('[name="email"]').value;

      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
    }

    return true;
  }

  $feedbackLink.addEventListener('click', function (event) {
    event.preventDefault();

    if ($feedbackPopup.classList.contains('is-shaked')) { // если у попапа был класс трясучки с прошлого показа - удаляю его
      $feedbackPopup.classList.remove('is-shaked');
    }

    $feedbackPopup.classList.add('is-visible');
    var emptyFields = [];

    [].forEach.call($feedbackFields, function ($field) { // заполняю сохраненные поля
      hideErrorFor($field); // если у поля был класс инвалидности с прошлого показа - удаляю его

      if (typeof window.localStorage === 'object') {
        var savedValue = localStorage.getItem($field.name);
        if (savedValue) {
          $field.value = savedValue;
        } else {
          emptyFields.push($field);
        }
      } else {
        emptyFields.push($field);
      }
    });

    if (emptyFields.length) { // ставлю фокус в первое пустое поле
      emptyFields[0].focus();
    }
  });

  $feedbackForm.addEventListener('submit', function (event) {
    var errorsCount = 0;

    [].forEach.call($feedbackFields, function ($field) { // проверяю все поля
      if (isValidField($field)) {
        hideErrorFor($field);
      } else {
        errorsCount += 1;
        showErrorFor($field);
      }
    });

    if (errorsCount !== 0) { // если есть ошибки, ничего не делаю и трясу попапом
      event.preventDefault();
      $feedbackPopup.classList.add('is-shaked');
    } else { // иначе сохраняю и сабмичу
      storeData();
    }
  });

  [].forEach.call($feedbackFields, function ($field) {
    $field.addEventListener('input', function () {
      if ($feedbackPopup.classList.contains('is-shaked')) { // удаляю трясучку при изменении полей формы
        $feedbackPopup.classList.remove('is-shaked');
      }

      if ($field.classList.contains('is-invalid') && isValidField($field)) { // убираю инвалидный класс если поле исправили
        hideErrorFor($field);
      }
    });
  });

  /**
   * Контакты
   **/

  var $contactsPopup = $.querySelector('.js-popup-contacts');
  var $contactsLink = $.querySelector('.js-show-contacts');

  $contactsLink.addEventListener('click', function (event) {
    event.preventDefault();

    $contactsPopup.classList.add('is-visible');
  }, false);

}(window, document));
