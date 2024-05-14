
//Imports//
import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarksView from './views/bookmarksView.js';
import PaginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import addRecipeView from './views/addRecipeView.js';
import {MODAL_CLOSE_SEC} from './config.js'
import icons from 'url:../img/icons.svg';




//selecting the recipe class for easy reuse inside the variable recipeContainer//

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    RecipeView.renderSpinner();

    //0). Update results view to mark selected search result//
    resultsView.update(model.getSearchResultsPage());

      //3). updating bookmarksView
      bookmarksView.update(model.state.bookmarks);

  //1). Load Recipe//
    await model.loadRecipe(id);

    //2). Rendering Recipe//
    RecipeView.render(model.state.recipe);

  } catch (err) {
    RecipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{
    ResultsView.renderSpinner();

    //1). Get Search Query//
    const query= SearchView.getQuery();
    if(!query) return;

    //2). Load Search Results//
    await model.loadSearchResults(query);

    //3).Render Results
    resultsView.render(model.getSearchResultsPage());

    //4). Render initial Pagination buttons//
    PaginationView.render(model.state.search);
  }catch(err){console.log(err)}
}

const controlPagination = function(goToPage){
      //3).Render NEW Results
      resultsView.render(model.getSearchResultsPage(goToPage));

      //4). Render NEW Pagination buttons//
      PaginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //Update the Recipe Servings in the State
    model.updateServings(newServings);
  //Update the Recipe View//
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function(){
  //1).Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2).Update Recipe View//
  recipeView.update(model.state.recipe);

  //3).Render bookmarks//
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
 try{

//show loading spinner//
addRecipeView.renderSpinner();

  await model.uploadRecipe(newRecipe)

  //Render recipe//
  recipeView.render(model.state.recipe);

  //display success message//
  addRecipeView.renderMessage();

  //render bookmark view//
  bookmarksView.render(model.state.bookmarks);

  //change ID in URL//
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  //close form window//
  setTimeout(function(){
    addRecipeView.toggleWindow();
    location.reload();
  }, MODAL_CLOSE_SEC*1000)

 }catch(err){
console.error(err)
addRecipeView.renderError(err.message);
 }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark)
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

//Implementing an Archietecture//
/**
 For mapty we made our own archietecture, but on large scale projects this simply isnt realistic so we often use an already well established.
 Many developers will use a js framework like React, and depend on the framework to implement the architecture for them.
 But You should know how to build and implement homemade architectures..
 */

 /*Components of Any Architecture
  Business Logic
    code that solves the actual business problem and is directly related to what that business does and needs.
    For whatsApp this would be storing transactions, sending messages, etc..

  State
    stores all the data about the application
    should be the "single source of truth"
    UI should be kept in sync with the state, if the UI changes so should the state and vice versa
    State libraries exist, like redox

  HTTP Libraries
    Responsible for making and recieving AJAX requests
    Optional but almost always necessary in real-world apps

  Application Logic(Router)
    Code that is only concerned with implemenation of the app itself
    Handles UIevents, navigation, etc..

  Presenetaion Logic(UI Layer)
    Code concerned with the visible parts of the application
    DISPLAYS THE STATE
    */

  /*Model View Controller(MVC) Architecture
  Any good architecture has a way to seperate these components

  Contains 3 Big Parts: model, controller, and view
    View
      Presentation Logic
    
    Model
      State
      Business Logic
      HTTP Library

    Controller
      ApplicationLogic
      Bridge between model and view (wchich dont know about one another)
      Handles UI Events and dispatches tasks to model and view
   
   */

/*Now we have a problem: we want events to happen in the view as they have to do with UI(DOM MANIUPULATION), however, the eventListener handler function
needs to stay in the controller bc it coordinated interactions between the model and the view.
  This can be seen by it using information both from the model and the RecipeView modules.
So, how do we solve this problem...? The Publisher-Subscriber Pattern*/

/*Event Handling in MVC: Publisher-Subscriber Pattern:
Events should be handled in the controller (otherwise we would have application logic in the view)
Events, though should be listened to in the view, (Otherwise we would need DOM elements in the controller which would vioalte MVC)
In other words, events should be listened and attached to DOM Eelements in the view, and then handled by controller functions, living in the controller module.
BUT WE CANT EXPORT LISTENGING IN TEH VIEW TO HANDLING IN THE CONTROLLER--->VIOLATES MVC//
SOLUTION:
  we have publisher which knows when to react to an event in the view, then a code that wants to react(subscriber) in the controller.
  Remember, publisher doesnt know subscriber exists.
  We can subscribe to the publisher by passing in the subscriber function
    in other words, as soon as the program is loaded, init is called in the controller, which immediately calls the addHandlerRender function in the view,
    (remember controller imports from model and the view). controlRecipes (subscriber) will be passed into addHandlerRender(publisher) as an arguement when program starts then.
    We subscribe controlRecipes to addHandlerRender().
    As soon as the publisher publishes an event, the subscriber is called.
 */