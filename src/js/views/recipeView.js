import View from './view.js';

import icons from 'url:../../img/icons.svg'; //parcel 2
// import Fraction from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We couldn't find that recipe. Please try another one`;
  _sucessMessage = '';

  addHanderRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--update-servings');

      if (!clickedBtn) return;

      const { updateTo } = clickedBtn.dataset;

      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnClicked = e.target.closest('.btn-bookmark');
      if (!btnClicked) return;
      handler();
    });
  }

  decimalToFraction(decimal) {
    const MAX_DENOMINATOR = 1000000;
    let numerator = decimal;
    let denominator = 1;

    while (
      Math.abs(numerator - Math.round(numerator)) > 1e-10 &&
      denominator <= MAX_DENOMINATOR
    ) {
      numerator = decimal * denominator;
      denominator++;
    }

    const gcd = this.findGCD(Math.round(numerator), denominator - 1);
    const simplifiedNumerator = Math.round(numerator) / gcd;
    const simplifiedDenominator = (denominator - 1) / gcd;

    return `${simplifiedNumerator}/${simplifiedDenominator}`;
  }

  findGCD(a, b) {
    if (b === 0) {
      return a;
    }
    return findGCD(b, a % b);
  }

  _generateMarkup() {
    console.log(this._data);
    return `<figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
              <use href="${icons}#icon-user"></use>
          </svg>
          </div>

          <button class="btn--round btn-bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(this._generateMarkUpIngredients)
            .join('')}
          </ul>
        </div>

        <div class = "calFat">
        <p>Total Calories: ${this._data.totalCalories}</p>
        <p>Total Fat: ${this._data.totalFat}</p>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _generateMarkUpIngredients(ingredient) {
    return `
  <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ingredient.quantity ? this.decimalToFraction(ingredient.quantity) : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ingredient.unit}</span>
      ${ingredient.description}
    </div>
  </li>`;
  }
}

export default new RecipeView();
