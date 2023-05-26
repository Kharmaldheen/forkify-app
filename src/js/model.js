import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import config from './config.js';
import { AJAX, getCalories } from './helpers.js';
import { RESULT_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${config.apiKey1}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    console.log(state.recipe.ingredients);

    //////////////////////////////////////////////////
    //getting the total calories and total fat from the spoonacular API
    const ingredientStrings = state.recipe.ingredients.map(ingredient => {
      return `${ingredient.quantity} ${ingredient.unit} ${ingredient.description}`;
    });

    const inputStrings = {
      title: state.recipe.title,
      servings: state.recipe.servings,
      ingredients: ingredientStrings,
    };

    const data2 = await getCalories(
      `https://api.spoonacular.com/recipes/analyze?apiKey=${config.apiKey2}&includeNutrition=true&includeTaste=true`,
      inputStrings
    );
    console.log(data2);
    /////setting the total calories to the recipe object
    state.recipe.totalCalories = `${data2.nutrition.nutrients[0].amount} ${data2.nutrition.nutrients[0].unit}`;
    state.recipe.totalFat = `${data2.nutrition.nutrients[1].amount} ${data2.nutrition.nutrients[1].unit}`;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${config.apiKey1}`);
    console.log(data);
    const { recipes } = data.data;
    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9
  return state.search.results.slice(start, end);
};

export const updateServings = function (numServings) {
  //using the formular new quantity = old quatity * numServings / old servings
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * numServings) / state.recipe.servings;
  });

  const totalCalories = parseFloat(state.recipe.totalCalories) * numServings;

  const totalFat = parseFloat(state.recipe.totalFat) * numServings;

  state.recipe.totalCalories = `${(
    totalCalories / state.recipe.servings
  ).toFixed(1)} kcal`;

  state.recipe.totalFat = `${(totalFat / state.recipe.servings).toFixed(1)} g`;

  state.recipe.servings = numServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add recipe
  state.bookmarks.push(recipe);

  //mark current reipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingr => {
        // const ingrArr = ingr[1].replaceAll(' ', '').split(',');
        const ingrArr = ingr[1].split(',').map(el => el.trim());
        if (ingrArr.length !== 3)
          throw new Error(
            `Wrong ingredient format! Please use the correct format :)`
          );
        const [quantity, unit, description] = ingrArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${config.apiKey1}`, recipe);
    console.log(data);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
