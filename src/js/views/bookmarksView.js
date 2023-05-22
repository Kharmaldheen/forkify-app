import icons from 'url:../../img/icons.svg'; //parcel 2
import View from './view.js';
import previewView from './previewView.js';

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet, find a nice recipe and bookmark it :)`;
  _sucessMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarksView();
