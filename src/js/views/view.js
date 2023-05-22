import icons from 'url:../../img/icons.svg'; //parcel 2

export default class View {
  _data;

  /**
   * render the received object to the dom
   * @param {Object | Object[]} data the daya to be rendered e.g. a recipe
   * @param {boolean} [render=true] if false,create markup string instead of rendering it to the DOM
   * @returns {undefined | string} a markup string is returned if render is false
   * @this {Object} View instance
   * @author Abdullahi kamaldeen
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const markUp = this._generateMarkup();
    if (!render) return markUp;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   return this.renderError();
    // }
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    //update changed text
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //update changed attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSucessMessage(message = this._sucessMessage) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner = function () {
    const markup = `<div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
}
