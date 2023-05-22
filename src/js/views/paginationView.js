import icons from 'url:../../img/icons.svg'; //parcel 2
import View from './view.js';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerbtnsClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicked = e.target.closest('.btn--inline');
      if (!clicked) return;
      const gotoPage = +clicked.dataset.goto;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
              <span>page ${currentPage + 1}</span>
              <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
              </svg>
        </button>

        <button class="btn--inline pagination__btn--curPage">
              <span>page ${currentPage} of ${numPages}</span>
        </button>
              `;
    }

    //last page
    if (currentPage === numPages && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--curPage">
              <span>page ${currentPage} of ${numPages}</span>
        </button>
      
      
      <button data-goto = "${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
                 <svg class="search__icon">
                 <use href="${icons}#icon-arrow-left"></use>
                 </svg>
                 <span>page ${currentPage - 1}</span>
              </button>

        
            `;
    }

    //other page
    if (currentPage < numPages) {
      return `<button data-goto = "${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
                <span>page ${currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </button>

          <button class="btn--inline pagination__btn--curPage">
              <span>page ${currentPage} of ${numPages}</span>
        </button>
    
              <button data-goto = "${
                currentPage - 1
              }" class="btn--inline pagination__btn--prev">
                         <svg class="search__icon">
                         <use href="${icons}#icon-arrow-left"></use>
                         </svg>
                         <span>page ${currentPage - 1}</span>
                      </button>
              `;
    }

    //page 1 and no other pages
    return '';
  }
}

export default new paginationView();
