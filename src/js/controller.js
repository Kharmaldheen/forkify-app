// import icons from '../img/icons.svg'//parcel 1
import * as model from './model.js';
import * as config from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultSearchView from './views/resultSearchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0 upate results view to mark selected search result
    resultSearchView.update(model.getSearchResultPage());

    //1.update the bookmars view
    bookmarksView.update(model.state.bookmarks);

    //2.loading recipe
    await model.loadRecipe(id); //this is because an aysnc function returns a promise so we have to await it to stop execution of this controlRecipes function and to also get result from loadRecipe function
    const { recipe } = model.state;

    //3.//RENDERING THE RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultSearchView.renderSpinner();

    //1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. load search
    await model.loadSearchResults(query);

    //3. render result
    // resultSearchView.render(model.state.search.results);
    resultSearchView.render(model.getSearchResultPage());

    //4 render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultSearchView.renderError();
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render new results
  resultSearchView.render(model.getSearchResultPage(goToPage));

  //4 render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2.update recipe view
  recipeView.update(model.state.recipe);

  //3. render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //sucess message
    addRecipeView.renderSucessMessage();

    //render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the url using the history API
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form aand reload the page
    setTimeout(function () {
      addRecipeView.toggleWindowOverlay();
    }, config.MODAL_CLOSE_SEC * 1000);
    setTimeout(function () {
      location.reload();
    }, config.MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
    setTimeout(function () {
      location.reload();
    }, config.MODAL_CLOSE_SEC * 1000);
  }
};

const newFeature = function () {
  console.log('welcome to the Application');
};

//////PUBLISHER-SUBSCRIBER PATTERN
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHanderRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerbtnsClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
  recipeView.decimalToFraction(0.85);
};
init();
