import dotenv from 'dotenv';
dotenv.config();

export const apiKey1 = process.env.API_KEY1;
export const apiKey2 = process.env.API_KEY2;

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';

export const TIMEOUT_SEC = 10;

export const RESULT_PER_PAGE = 10;

export const MODAL_CLOSE_SEC = 2.5;
