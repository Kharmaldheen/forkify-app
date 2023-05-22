import icons from 'url:../../img/icons.svg'; //parcel 2
import View from './view.js';
import previewView from './previewView.js';

class resultSearchView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for your query! Please try again :)`;
  _sucessMessage = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultSearchView();
