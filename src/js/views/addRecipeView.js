import icons from 'url:../../img/icons.svg'; //parcel 2
import View from './view.js';

class addRecipeView extends View {
  _sucessMessage = 'Recipe was sucessfully uploaded';
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _newIngredients = document.querySelectorAll('.new');
  _newIngredientsBtn = document.querySelector('.moreIng');
  _allIngs = document.querySelectorAll('.inputIng');
  _lessIngBtn = document.querySelector('.showless-btn');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerShowMoreIng();
    this.addHandlerValidateIngs();
    this._addHandlerShowLessIng();
  }

  _validateInputIngs() {
    this.value.trim();
    const ingArr = this.value.split(',');
    const isValid = ingArr.length === 3;
    if (!isValid) this.style.border = '2px solid red';

    if (isValid || this.value.length === 0)
      this.style.border = '1px solid #ddd';
  }

  addHandlerValidateIngs() {
    this._allIngs.forEach(ing =>
      ing.addEventListener('input', this._validateInputIngs.bind(ing))
    );
  }

  toggleWindowOverlay() {
    [this._overlay, this._window].forEach(cover =>
      cover.classList.toggle('hidden')
    );
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      this.toggleWindowOverlay.bind(this)
    );
  }

  showMoreIng(e) {
    e.preventDefault();
    console.log(this._newIngredients);
    this._newIngredients.forEach(ing => (ing.style.display = 'block'));
    this._newIngredientsBtn.style.display = 'none';
    this._lessIngBtn.classList.remove('hide');
  }

  showLessIng(e) {
    e.preventDefault();
    this._newIngredients.forEach(ing => (ing.style.display = 'none'));
    this._lessIngBtn.classList.add('new');
    this._newIngredientsBtn.style.display = 'block';
  }

  _addHandlerShowMoreIng() {
    this._newIngredientsBtn.addEventListener(
      'click',
      this.showMoreIng.bind(this)
    );
  }

  _addHandlerShowLessIng() {
    this._lessIngBtn.addEventListener('click', this.showLessIng.bind(this));
  }

  _addHandlerHideWindow() {
    [this._btnClose, this._overlay].forEach(cover =>
      cover.addEventListener('click', this.toggleWindowOverlay.bind(this))
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
