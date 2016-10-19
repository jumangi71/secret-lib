require('_styles/app.styl');

const moment = require('moment');
// TODO: https://github.com/puranjayjain/md-date-time-picker/issues/119
const mdDateTimePicker = require('./dependencies/mdDateTimePicker.min.js');
// const sails = require('./dependencies/sails.io.js');
const gator = require('gator');

let addForm = document.querySelector('#addForm');
let isbnInput = document.querySelector('#isbn-search');
let isbnAction = document.querySelector('#isbn-action');
let removeCheck = document.querySelector('#removeCheck');
let dateInput = document.querySelector('#dateInp');
let getBookCtrl = document.querySelector('#getBookCtrl');

moment.locale('ru');


if (dateInput) {
  if (getBookCtrl) {
    gator(getBookCtrl).on('click', (e) => {
      if (!dateInput.value.length) {
        e.preventDefault();
        dateInput.parentNode.classList.add('is-invalid');
      }
    });
  }

  let dialogDate = new mdDateTimePicker.default({ // eslint-disable-line
    type: 'date',
    init: moment(),
    past: moment().subtract(0, 'years'),
    future: moment().add(1, 'month')
  });
  dialogDate.trigger = dateInput;

  gator(dateInput)
    .on('click', () => {
      dialogDate.toggle();
    })
    .on('onOk', function() {
      this.parentNode.classList.add('is-dirty');
      this.value = dialogDate.time.format('D.M.YYYY');
    });
}

if (removeCheck) {
  let removeBook = document.querySelector('#removeBook');
  let dialog = document.querySelector('#removeDialog');
  if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });

  gator(removeCheck).on('click', function() {
    dialog.showModal();
  });
  gator(removeBook).on('click', function() {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        location.href = '/book/';
      }
    });
    xhr.open('DELETE', '/book/' + this.dataset.id);
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.send();
  });
}

if (isbnInput && addForm) {
  gator(isbnInput).on('input', () => {
    if (isbnInput.value.length) {
      isbnAction.removeAttribute('disabled');
    } else {
      isbnAction.setAttribute('disabled', 'disabled');
    }
  });
  gator(isbnAction).on('click', () => {
    isbnAction.classList.add('hidden');
    let parent = isbnAction.parentNode;
    let preloader = document.createElement('div');
    preloader.classList = 'mdl-spinner mdl-js-spinner is-active';
    parent.appendChild(preloader);

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        isbnAction.classList.remove('hidden');
        preloader.remove();

        let data = JSON.parse(this.responseText);

        if (data[0]) {
          addForm.querySelector('#title').value = '';
          addForm.querySelector('#author').value = '';
          addForm.querySelector('#description').value = '';
          addForm.querySelector('#publishing_house').value = '';
          addForm.querySelector('#cover').value = '';
          document.querySelector('#cover-v').style.background = '';

          if (data[0].title) {
            addForm.querySelector('#title').parentNode.classList.add('is-dirty');
            addForm.querySelector('#title').value = data[0].title + (data[0].subtitle ? ' ' + data[0].subtitle : '');
          }

          if (data[0].authors) {
            addForm.querySelector('#author').parentNode.classList.add('is-dirty');
            addForm.querySelector('#author').value = data[0].authors.join(', ');
          }

          if (data[0].description) {
            addForm.querySelector('#description').parentNode.classList.add('is-dirty');
            addForm.querySelector('#description').value = data[0].description;
          }

          if (data[0].publisher) {
            addForm.querySelector('#publishing_house').parentNode.classList.add('is-dirty');
            addForm.querySelector('#publishing_house').value = data[0].publisher;
          }

          if (data[0].thumbnail) {
            addForm.querySelector('#cover').value = data[0].thumbnail;
            document.querySelector('#cover-v').style.background = 'url(' + data[0].thumbnail + ')';
            document.querySelector('#cover-v').style.backgroundRepeat = 'no-repeat';
            document.querySelector('#cover-v').style.backgroundSize = 'cover';
          }
        }
      }
    });
    xhr.open('GET', '/isbnsearch/' + isbnInput.value);
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.send();
  });
}
