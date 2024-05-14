//Real World Projects generally have 2 files that are impelemented outside the architecutre of the website//
//1). is the configuration files//
//2). is a file for helper functions that will be useful throughout the project.//
//in this file well put all variables that should be constants and should be re-used accross the project//
//the goal of having this file is that it will allow us to easily congifure our project by changing data here//
//NOT ALL VARIABLES... just the variables that are important for defining some important data about the application itself//

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/'
export const TIMEOUT_SEC=10
export const RESPERPAGE =10;
export const KEY = `02eb4eb3-b672-4c38-b3f0-50c056a92eca`
export const MODAL_CLOSE_SEC = 1;

//using all uppercase is the convention for declaring a variable that will never change//
